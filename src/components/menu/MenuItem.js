import React, { useState } from 'react';
import SlButton from '@shoelace-style/shoelace/dist/react/button';
import CartService from '../../services/CartService';

const MenuItem = ({ item }) => {
    const [selectedSize, setSelectedSize] = useState(() => {
        if (item.size.length > 0) {
            return item.size[0].label; // Set default to the first available size
        }
        return '';
    });

    const hasSizes = item.size.length > 0

    const handleSizeChange = (e) => {
        setSelectedSize(e.target.value); // Update selected size in state
    };

    const handleAddToCart = () => {
        const itemToAdd = { ...item };
        if (hasSizes) {
            itemToAdd.size = selectedSize;
            itemToAdd.price = item.size.find(size => size.label === selectedSize)?.price;
        }
        CartService.addToCart(itemToAdd);
    };

    return (
        <div className="menu-item">
            <div className="menu-item-top">
                <h3>{item.name}</h3>
            </div>
            <div className="menu-item-middle">
                <span>{item.description}</span>
                {hasSizes && (
                    <div className="menu-item-size">
                        <label htmlFor="size">Size: </label>
                        <select id="size" value={selectedSize} onChange={handleSizeChange}>
                            {item.size.map((sizeOption, index) => (
                                <option key={index} value={sizeOption.label}>
                                    {sizeOption.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
            <div className="menu-item-bottom">
                {hasSizes ? (
                    <span>Price: $ {item.size.find(size => size.label === selectedSize)?.price}</span>
                ) : (
                    <span>Price: $ {item.price}</span>
                )}
            </div>
            <div className="menu-item-image">
                <img src="./productimage1.png" alt="Product" />
            </div>
            <div className="menu-item-button">
                <SlButton onClick={handleAddToCart} href="#">
                    Add to Cart
                </SlButton>
            </div>
        </div>
    );
};

export default MenuItem;
