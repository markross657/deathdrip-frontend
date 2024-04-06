import UserService from "./UserService";
const API_BASE_URL = 'https://deathdrip-api-1ec5c7435dc5.herokuapp.com';

class OrderService {
    constructor() {
        this.orders = JSON.parse(sessionStorage.getItem('orders'))
        this.activeOrder = null
        this.startUpdateTimer()
        this.getOrdersFromAPI()
    }

    // Start a timer to update the menu from the API periodically
    startUpdateTimer() {
        setInterval(async () => {
            await this.getOrdersFromAPI();
        }, 15000); // 60 seconds (in milliseconds)
    }

    async getOrdersFromAPI() {
        try {
            const response = await fetch(API_BASE_URL + '/order/', {
                method: 'GET',
                headers: {
                    'Authorization': "Bearer " + UserService.getToken(),
                    'Content-type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch menu items from the API');
            }

            const data = await response.json();

            if (data.length === 0) {
                return "No orders received"
            }

            if (!Array.isArray(data)){
                console.error("Recevied Data is not an array: ", data);
                return;
            }

            this.orders = data;
            this.updateSessionStorage()
        }
        catch (error) {
            console.error('Error fetching and organizing menu items from the API:', error);
        }
    }

    async updateOrder(order) {        
        try {
            const response = await fetch(API_BASE_URL + '/order/' + order._id, {
                method: 'PUT',
                headers: {
                    'Authorization': "Bearer " + UserService.getToken(),
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(order)
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Failed to update order';
                throw new Error(errorMessage);
            }
        }
        catch (error) {
            console.error('Error updating order:', error.message);
        }
    }    

    async createOrder(items) {
        const order = {};
        const user = UserService.getUser();

        if (items === null || items.length < 1) {
            console.log("No items in cart. Cannot place order");
            return;
        }

        if (user !== null) {
            order.customerId = user.id;
            order.customerName = user.firstName + " " + user.lastName;
            order.status = 'Pending';

            // Handle Items
            const orderItems = items.map(item => ({
                id: item._id,
                name: item.name,
                quantity: item.quantity,
                price: item.price * item.quantity,
            }));
            order.items = orderItems;

            // Calculate the total of all items
            const orderTotal = orderItems.reduce((total, item) => total + item.price, 0);
            order.total = orderTotal;

            //Do Post
            try {
                const response = await fetch(API_BASE_URL + "/order", {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + UserService.getToken(),
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify(order),
                });

                if (response.ok) {
                    const createdOrder = await response.json()
                    this.activeOrder = createdOrder
                    return true
                } 
                else 
                {
                    const errorData = await response.json();
                    const errorMessage = errorData.message || 'Unknown error';

                    switch (response.status) {
                        case 400:
                            throw new Error(`Bad request: ${errorMessage}`);
                        case 401:
                            throw new Error(`Unauthorized: ${errorMessage}`);
                        case 403:
                            throw new Error(`Forbidden: ${errorMessage}`);
                        case 404:
                            throw new Error(`Not found: ${errorMessage}`);
                        case 500:
                            throw new Error(`Internal Server Error: ${errorMessage}`);
                        default:
                            throw new Error(`An error occurred: ${errorMessage}`);
                    }
                }
            } 
            catch (error) {
                console.error('Error creating order:', error.message);
                return false;
            }
        } else {
            console.log("NO USER");
            return false;
        }
    }  

    getOrders() {
        // Organize menu items into groups by type
        const orderGroup = {};
        this.orders.forEach(order => {
            if (!orderGroup[order.status]) {
                orderGroup[order.status] = [];
            }
            orderGroup[order.status].push(order);
        });

        return orderGroup;
    }

    // Get orders by user ID with an optional status filter
    getOrdersByUserId(userId, status = null) {
        let filteredOrders = this.orders.filter(order => order.customerId === userId);
        if (status) {
            filteredOrders = filteredOrders.filter(order => order.status === status);
        }
        return filteredOrders;
    }

    updateSessionStorage() {
        const orders = JSON.stringify(this.orders)
        sessionStorage.setItem('orders', orders);
    }

    // Change the status of an order
    changeOrderStatus(order, newStatus) {
        const orderToChange = this.orders.find(odr => odr._id === order._id)
        if (orderToChange) {
            console.log("Found Order. Setting status to " + newStatus)
            orderToChange.status = newStatus
        }
        console.log(orderToChange)
        this.updateOrder(orderToChange)
        this.updateSessionStorage()
    }
}

const service = new OrderService();
export default service;
