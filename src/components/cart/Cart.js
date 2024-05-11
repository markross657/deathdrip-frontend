import React, { useState, useEffect } from 'react';
import CartService from '../../services/CartService';
import OrderService from '../../services/OrderService';
import CartItem from './CartItem';
import '../../css/cart.css'
import SlButton from '@shoelace-style/shoelace/dist/react/button';

function Cart() {
    const [cartItems, setCartItems] = useState(CartService.getCartItems());
    const [total, setTotal] = useState(CartService.calculateTotal());

    const removeFromCart = (item) => {
        CartService.removeFromCart(item);
        setCartItems([...CartService.getCartItems()]);
    };

    const confirmOrder = () => {
        if (OrderService.createOrder(cartItems)){
            CartService.emptyCart();
            setCartItems(CartService.getCartItems());
        }
    };

    // Update total whenever cart items change
    useEffect(() => {
        setTotal(CartService.calculateTotal());
    }, [cartItems]);

    return (
        <div className="cart-container">
            <h2>Your Cart</h2>
            {cartItems.length > 0 ? (
                <div>
                    {cartItems.map((item) => (
                        <CartItem key={item._id + item.size.label} item={item} removeFromCart={removeFromCart} />
                    ))}                    
                    <p>Total: ${total.toFixed(2)}</p>
                    <div>
                        <SlButton onClick={confirmOrder}>PLACE ORDER</SlButton>
                    </div>
                </div>
            ) : (
                <div>
                    <h3>Your cart is empty</h3>
                </div>
            )}
        </div>
    );        
}

export default Cart;
