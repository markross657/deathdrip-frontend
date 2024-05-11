import UserService from "./UserService";
const API_BASE_URL='http://3.26.170.85'

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
    
                this.products = data
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
                        break;
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

    async createProduct(productData) {
        const user = UserService.getUser();
        if (user === null || user === undefined)
            return;

        console.log("ITEM DATA")
        console.log(productData)

        if (!productData) {
            console.error('Invalid item data. Cannot create inventory item.');
            return null;
        }

        const newProduct = {};

        // Populate the inventory item properties based on your data structure            
        newProduct.name = productData.name
        newProduct.description = productData.description
        newProduct.category = productData.category

        // Handle Sizes
        if (productData.size && Array.isArray(productData.size)) {
            newProduct.size = productData.size.map((size) => ({
                label: size.label,
                price: size.price,
            }));
        }
        
        //Do Post
        try {
            const response = await fetch(API_BASE_URL + "/products/", {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + UserService.getToken(),
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(newProduct),
            });

            if (response.ok) {
                const createdItem = await response.json()
                this.products.push(createdItem)
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
        
    }

    async updateProduct(itemData) {
        if (UserService.getUser() !== null) {            
            try {
                const api = API_BASE_URL + "/products/" + itemData.id;
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
                    console.log("Updated Item")
                    console.log(updatedItem)
                    const index = this.products.findIndex(item => item.id === updatedItem.id);                   

                    if (index !== -1) 
                    {
                        console.log("found item")
                        console.log(index);
                        console.log(this.products[index]);
                        this.products[index] = updatedItem;                        
                        this.updateSessionStorage();
                        this.notifySubscribers();
                    }
                }
                else {
                    const errorData = await response.json();
                    const errorMessage = errorData.message || 'Unknown error';
    
                    // Error handling based on response status
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
    

    async deleteProduct(itemId) {
        if (UserService.getUser() !== null) {
            console.log("DELETING ITEM");
            console.log("ITEM ID", itemId);

            try {
                const api = API_BASE_URL + "/products/" + itemId;

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
        let groupedProducts = [];

        for (let category of this.productCategories) {
            let productsInCategory = this.products.filter(product => product.category.name === category.name);
            groupedProducts.push([category, productsInCategory]);
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
