import UserService from "./UserService";
const API_BASE_URL='http://3.26.170.85'

class OrderService {
    constructor() {
        this.activeOrder = null;

        this.orders = [];
        this.subscribers = [];
        this.getOrdersFromAPI();        
    }   
    
    //Subscribers
    subscribe(callback) {
        this.getOrdersFromAPI();     

        this.subscribers.push({ callback });
        return () => {
            this.subscribers = this.subscribers.filter(subscriber => subscriber.callback !== callback);
        };

    }

    notifySubscribers() {
        this.subscribers.forEach(subscriber => {
            subscriber.callback(this.getOrders());
        });
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

            //console.log("orders received")
            //console.log(data)

            if (data.length === 0) {
                return "No orders received"
            }

            if (!Array.isArray(data)){
                console.error("Recevied Data is not an array: ", data);
                return;
            }

            this.orders = data;
            this.updateSessionStorage();
            this.notifySubscribers();
        }
        catch (error) {
            console.error('Error fetching and organizing menu items from the API:', error);
        }
    }

    async updateOrder(order) {   
        console.log("Updated order")
        console.log(order);
    
        try {
            const response = await fetch(API_BASE_URL + '/order/' + order.id, {
                method: 'PUT',
                headers: {
                    'Authorization': "Bearer " + UserService.getToken(),
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(order)
            });            
            
            if (response.ok) 
            {
                const updatedOrder = await response.json();
                console.log("updated order from API")
                console.log(updatedOrder)
                const index = this.orders.findIndex(o => o.id === order.id);
                if (index !== -1) {
                    this.orders[index].status = order.status;
                    this.notifySubscribers();
                    console.log("Updated order in orders")
                    console.log(this.orders[index])
                }                
            } 
            else
            {
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
        const user = UserService.getUser();

        if (items === null || items.length < 1) {
            console.log("No items in cart. Cannot place order");
            return;
        }

        if (user === null){
            console.log("Must be logged in to place an order");
            return false;
        }

        const order = {};
        order.customerId = user.id;
        order.customerName = user.firstName + " " + user.lastName;
        order.status = 'Pending';        
        order.items = items;

        // Calculate the total of all items
        const orderTotal = order.items.reduce((total, item) => total + (item.size.price * item.quantity), 0);
        order.total = orderTotal;

        //Do Post
        try {
            console.log("order:")
            console.log(order)
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
    }  

    getOrders() {
        return this.orders;
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
        const orderToChange = this.orders.find(odr => odr.id === order.id)
        if (orderToChange) {
            console.log("Found Order. Setting status to " + newStatus)
            orderToChange.status = newStatus
        }
        this.updateOrder(orderToChange)
        this.updateSessionStorage();
        this.notifySubscribers();
    }
}

const service = new OrderService();
export default service;
