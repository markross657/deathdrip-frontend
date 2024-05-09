import UserService from "./UserService";
const API_BASE_URL='http://localhost:3520'

class ProductService {

    constructor() {
        this.subscribers = [];
        this.products = [];
        this.productCategories = [];    
            
        this.fetchProductCategories();
        this.fetchProducts();
    }

    //Subscribers
    subscribe(callback) {
        this.subscribers.push({ callback });
        return () => {
            this.subscribers = this.subscribers.filter(subscriber => subscriber.callback !== callback);
        };
    }

    notifySubscribers() {
        this.subscribers.forEach(subscriber => {
            subscriber.callback(this.getGroupedProducts());
        });
    }

    //API CALLS
    async fetchProducts() {
        try {
            const response = await fetch(API_BASE_URL + '/products/', {
                method: 'GET',
                headers: {
                    'Authorization': "Bearer " + UserService.getToken(),
                    'Content-type': 'application/json',
                }
            });

            if (response.ok)
            {
                const data = await response.json();

                if (data.length === 0) {
                    return "No products received"
                }
    
                this.menu = data
                this.updateSessionStorage();
                this.notifySubscribers();
            }
            else 
            {
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Unknown error'

                switch (response.status) {
                    case 400:
                        throw new Error(`Bad request: ${errorMessage}`);
                    case 401:
                        throw new Error(`Unauthorized: ${errorMessage}`);
                    case 403:
                        throw new Error(`Forbidden: ${errorMessage}`);
                    case 404:
                        throw new Error(`Not Found: ${errorMessage}`);
                    case 500:
                        throw new Error(`Internal Server Error: ${errorMessage}`);
                    default:
                        throw new Error(`An error occurred: ${errorMessage}`);
                }
            }            
        }
        catch (error) {
            console.error('Error occured while retreiving Products:\n', error);
        }
    }

    async fetchProductCategories(){
        try {
            const response = await fetch(API_BASE_URL + '/products/categories', {
                method: 'GET',
                headers: {
                    'Authorization': "Bearer " + UserService.getToken(),
                    'Content-type': 'application/json',
                }
            });

            if (response.ok)
            {
                const data = await response.json();

                if (data.length === 0) {
                    return "No menu items received"
                }
    
                this.productCategories = data
                console.log("Product Categories Fetched:")
                console.log(data)
                this.updateSessionStorage()
                this.notifySubscribers();
            }
            else 
            {
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Unknown error'

                switch (response.status) {
                    case 400:
                        throw new Error(`Bad request: ${errorMessage}`);
                    case 401:
                        throw new Error(`Unauthorized: ${errorMessage}`);
                    case 403:
                        throw new Error(`Forbidden: ${errorMessage}`);
                    case 404:
                        this.menu = [];
                    case 500:
                        throw new Error(`Internal Server Error: ${errorMessage}`);
                    default:
                        throw new Error(`An error occurred: ${errorMessage}`);
                }
            }            
        }
        catch (error) {
            console.error('Error occured while retreiving Products:\n', error);
        }
    }

    async createInventoryItem(itemData) {
        console.log("ITEM DATA")
        console.log(itemData)

        if (!itemData) {
            console.error('Invalid item data. Cannot create inventory item.');
            return null;
        }

        const user = UserService.getUser();

        if (user !== null) {
            const inventoryItem = {};
            // Populate the inventory item properties based on your data structure            
            inventoryItem.name = itemData.name || ''
            inventoryItem.description = itemData.description || ''
            inventoryItem.price = itemData.price || null
            inventoryItem.category = itemData.category || ''

            // Handle Sizes
            if (itemData.size && Array.isArray(itemData.size)) {
                inventoryItem.size = itemData.size.map((size) => ({
                    label: size.label || '',
                    price: size.price || null,
                }));
            }

            console.log("created new item")
            console.log(inventoryItem)

            //Do Post
            try {
                const response = await fetch(API_BASE_URL + "/menu/", {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + UserService.getToken(),
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify(inventoryItem),
                });

                if (response.ok) {
                    const createdItem = await response.json()
                    this.menu.push(createdItem)
                    this.updateSessionStorage()
                    return createdItem
                } else {
                    const errorData = await response.json();
                    const errorMessage = errorData.message || 'Unknown error'

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
            } catch (error) {
                console.error('Error creating inventory item:', error.message);
                return null;
            }
        } else {
            console.log("NO USER");
            return null;
        }
    }

    async updateInventoryItem(itemData) {
        if (UserService.getUser() !== null) {
            console.log("UPDATING ITEM")
            console.log("ITEM DATA")
            console.log(itemData)
            try {
                const api = API_BASE_URL + "/menu/" + itemData._id
                const response = await fetch(api, {
                    method: 'PUT',
                    headers: {
                        'Authorization': 'Bearer ' + UserService.getToken(),
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify(itemData),
                });

                if (response.ok) {
                    const updatedItem = await response.json();
                    const index = this.menu.findIndex(item => item._id === updatedItem._id);
                    if (index !== -1) {
                        this.menu[index] = updatedItem;
                        this.updateSessionStorage();
                    }
                    return updatedItem;
                }
                else {
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
                console.error('Error updating inventory item:', error.message);
                return null;
            }
        }
        else {
            console.log('NO USER');
            return null;
        }
    }

    async deleteInventoryItem(itemId) {
        if (UserService.getUser() !== null) {
            console.log("DELETING ITEM");
            console.log("ITEM ID", itemId);

            try {
                const api = API_BASE_URL + "/menu/" + itemId;

                const response = await fetch(api, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': 'Bearer ' + UserService.getToken(),
                    },
                });

                if (response.ok) {
                    this.fetchMenu(); // Optionally fetch the menu after successful delete
                    return { message: 'Item deleted successfully' };
                } else {
                    const errorData = await response.json();
                    const errorMessage = errorData.message || 'Unknown error';

                    switch (response.status) {
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
            } catch (error) {
                console.error('Error deleting inventory item:', error.message);
                return null;
            }
        } else {
            console.log('NO USER');
            return null;
        }
    }    

    getGroupedProducts() {       
        let groupedProducts = {};

        for (let category of this.productCategories) {
            let categoryName = category.name;
            groupedProducts[categoryName] = this.products.filter(product => product.category === categoryName);
        }

        return groupedProducts;
    }
    

    updateSessionStorage() 
    {
        const products = JSON.stringify(this.products)
        sessionStorage.setItem('products', products);

        const productCategories = JSON.stringify(this.productCategories)
        sessionStorage.setItem('productCategories', productCategories);
    }
}

const service = new ProductService()
export default service
