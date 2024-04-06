import UserService from "./UserService";

const API_BASE_URL = 'https://deathdrip-api-1ec5c7435dc5.herokuapp.com';

class InventoryService {
    constructor() {
        this.menu = JSON.parse(sessionStorage.getItem('menu'))
        this.startMenuUpdateTimer()
    }

    // Function to fetch menu items from an API
    async fetchMenu() {
        try {
            // Replace with your actual API endpoint
            const response = await fetch(API_BASE_URL + '/menu/', {
                method: 'GET',
                headers: {
                    'Authorization': "Bearer " + UserService.getToken(),
                    'Content-type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch menu items from the API')
            }

            const data = await response.json();

            if (data.length === 0) {
                return "No menu items received"
            }
            this.menu = data
            this.updateSessionStorage()
        }
        catch (error) {
            console.error('Error fetching and organizing menu items from the API:', error);
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

    // Load the menu from the API initially
    async loadMenuFromApi() {
        await this.fetchMenu();
    }

    // Start a timer to update the menu from the API periodically
    startMenuUpdateTimer() {
        setInterval(async () => {
            await this.fetchMenu();
        }, 15000); // 60 seconds (in milliseconds)
    }

    getMenu() {
        // Organize menu items into groups by type
        const menuGroups = {};
        this.menu.forEach(item => {
            if (!menuGroups[item.category]) {
                menuGroups[item.category] = [];
            }
            menuGroups[item.category].push(item);
        });

        return menuGroups;
    }

    updateSessionStorage() {
        const menu = JSON.stringify(this.menu)
        sessionStorage.setItem('menu', menu);
    }
}

const service = new InventoryService()
export default service
