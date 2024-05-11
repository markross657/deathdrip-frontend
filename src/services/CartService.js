class CartService {
    constructor() {
        this.subscribers = [];
        //Confirm we are logged in
        const userData = sessionStorage.getItem('user')
        if (userData === null) {
            this.cartItems = [];
        }
        else {
            // Retrieve cart data from sessionStorage on service initialization
            const cartData = sessionStorage.getItem('cart');
            this.cartItems = cartData ? JSON.parse(cartData) : [];
        }
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
            subscriber.callback(this.getCartItems());
        });
    }

    // Add an item to the cart and update sessionStorage
    addToCart(item) {
        console.log("Adding item to card")
        console.log(item)
        const existingItem =
            this.cartItems.find(cartItem => cartItem._id === item._id && cartItem.size === item.size)
    
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            item.quantity = 1;
            this.cartItems.push({ ...item });
        }
    
        this.updateSessionStorage();
    }
    

    removeFromCart = (item) => {
        const existingItemIndex = this.cartItems.findIndex(cartItem => cartItem.id === item.id);

        if (existingItemIndex !== -1) {
            const existingItem = this.cartItems[existingItemIndex];

            if (existingItem.quantity > 1) {
                existingItem.quantity -= 1;
            } else {
                this.cartItems.splice(existingItemIndex, 1);
            }

            this.updateSessionStorage();
        }
        else {
            console.log('Item not found in the cart');
        }
    };

    // Update the quantity of an item in the cart and update sessionStorage
    updateQuantity(itemId, newQuantity) {
        const itemToUpdate = this.cartItems.find(item => item.id === itemId);

        if (itemToUpdate) {
            itemToUpdate.quantity = newQuantity;
        }

        // Update sessionStorage with the new cart data
        this.updateSessionStorage();
    }

    // Get the current cart items
    getCartItems() {
        return this.cartItems;
    }

    getTotalItemCount() {
        let totalCount = 0;

        this.cartItems.forEach((item) => {
            totalCount += item.quantity;
        });

        return totalCount;
    }

    calculateTotal() {
        return this.cartItems.reduce((total, item) => total + item.size.price * item.quantity, 0);
    }

    emptyCart() {
        this.cartItems = []
        this.updateSessionStorage()
    }

    updateSessionStorage() {
        sessionStorage.setItem('cart', JSON.stringify(this.cartItems));
    }
}

const service = new CartService()
export default service
