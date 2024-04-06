class CartService {
    constructor() {
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

    // Add an item to the cart and update sessionStorage
    addToCart(item) {
        const hasSize = item.hasOwnProperty('size');
        const existingItem = hasSize
            ? this.cartItems.find(cartItem => cartItem._id === item._id && cartItem.size === item.size)
            : this.cartItems.find(cartItem => cartItem._id === item._id && !cartItem.size);
    
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

        // Loop through the cart items and accumulate the quantities
        this.cartItems.forEach((item) => {
            totalCount += item.quantity; // Assuming each item has a 'quantity' property
        });

        return totalCount;
    }

    // Calculate the total cost of items in the cart
    calculateTotal() {
        return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    }

    emptyCart() {
        this.cartItems = []
        this.updateSessionStorage()
    }

    // Update the cart data in sessionStorage
    updateSessionStorage() {
        sessionStorage.setItem('cart', JSON.stringify(this.cartItems));
    }
}

const service = new CartService()
export default service
