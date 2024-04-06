import React from 'react';

function CartItem({ item, removeFromCart }) {

    const handleRemoveFromCart = (item) => {
        removeFromCart(item);
    }

    return (
        <div className="cart-item">            
            <div className="cart-item-details">
                <div className="cart-item-top">
                    <span className='cart-name'>{item.name}</span>
                </div>
                <div className="cart-item-middle">
                </div>
                <div className="cart-item-bottom">
                    {item.size && (<span className='cart-size'>Size: {item.size}</span>)}
                    <span className='cart-price'>Price: {item.price}</span>
                    <span className='cart-quanity'>Quantity: {item.quantity}</span>
                </div>
            </div>
            <div className="cart-item-button">
                <button className="btn btn-danger" onClick={() => handleRemoveFromCart(item)}>
                    Remove
                </button>
            </div>
        </div>
    );
}

export default CartItem;
