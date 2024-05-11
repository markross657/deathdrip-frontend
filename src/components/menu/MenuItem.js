import React, { useState } from 'react';
import SlButton from '@shoelace-style/shoelace/dist/react/button';
import CartService from '../../services/CartService';

const MenuItem = ({ item }) => {
    const [selectedSize, setSelectedSize] = useState(() => {
        if (item.size.length > 0) {
            return item.size[0];
        }

        return '';
    });

    const handleSizeChange = (e) => {
        setSelectedSize(item.size[e.target.value]); // Update selected size in state
        console.log("selected size changed")
        console.log(selectedSize)
    };

    const handleAddToCart = () => {
        const itemToAdd = { ...item };
        itemToAdd.size = selectedSize;
        CartService.addToCart(itemToAdd);
    };

    return (
        <div className="menu-item">
            <div className="menu-item-top">
                <h3>{item.name}</h3>
            </div>
            <div className="menu-item-middle">
                <span>{item.description}</span>                
                <div className="menu-item-size">
                    <label htmlFor="size">Size: </label>
                    <select id="size" value={selectedSize} onChange={handleSizeChange}>
                        {item.size.map((sizeOption, index) => (
                            <option key={index} value={index}>
                                {sizeOption.label}
                            </option>
                        ))}
                    </select>
                </div>                
            </div>
            <div className="menu-item-bottom">                
                <span>Price: $ {item.size.find(size => size.label === selectedSize.label)?.price}</span>               
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
