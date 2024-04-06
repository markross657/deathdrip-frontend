import React, { useEffect, useState } from 'react';
import CartService from '../../services/CartService';
import { FaCartArrowDown } from 'react-icons/fa';

function CartButton({ onSetActive }) {
    const [itemCount, setItemCount] = useState(CartService.getTotalItemCount());

    const handleClick = (value) => {
        onSetActive(value);
    };

    useEffect(() => {
        const updateItemCount = () => {
            setItemCount(CartService.getTotalItemCount());
        };

        updateItemCount();
        const interval = setInterval(updateItemCount, 200);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="cart-button" onClick={() => handleClick('Cart')}>
            <FaCartArrowDown /> ({itemCount})
        </div>
    );
}

export default CartButton;
