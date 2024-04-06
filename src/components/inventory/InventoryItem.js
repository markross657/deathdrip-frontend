import React, { useState } from 'react';
import SlButton from '@shoelace-style/shoelace/dist/react/button';
import '../../css/inventory.css'
import InventoryService from '../../services/InventoryService';

const InventoryItem = ({ item, handleShowEditDialog }) => {
    const [itemDeleted, setItemDeleted] = useState(false)

    const handleDelete = () => {
        InventoryService.deleteInventoryItem(item._id)
        setItemDeleted(true)
    }

    return (
        <div className="inv-item">
            {((itemDeleted) || !itemDeleted) &&
                (<React.Fragment>
                    <div className="inv-item-img">
                        <img src="./productimage1.png" alt="Product" />
                    </div>
                    <div className="inv-item-info">
                        <h3>{item.name}</h3>
                        <p>
                            {item.size.map((size, index) => (
                                <div key={index}>
                                    {`${size.label}: $${size.price}`}
                                    <br />
                                </div>
                            ))}
                        </p>
                    </div>
                    <div className='inv-item-button'>
                        <SlButton size='medium' variant='success' onClick={(e) => handleShowEditDialog(item)}>Edit</SlButton>
                        <SlButton size='medium' variant='danger' onClick={(e) => handleDelete()}>Delete</SlButton>
                    </div>
                </React.Fragment>)}
        </div>)
};

export default InventoryItem;
