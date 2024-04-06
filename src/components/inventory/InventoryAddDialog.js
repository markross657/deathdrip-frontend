import React, { useState, useEffect } from 'react';
import SlButton from '@shoelace-style/shoelace/dist/react/button';
import SlInput from '@shoelace-style/shoelace/dist/react/input';
import SlTextarea from '@shoelace-style/shoelace/dist/react/textarea';
import SlDialog from '@shoelace-style/shoelace/dist/react/dialog';
import InventoryService from '../../services/InventoryService';
import '../../css/inventory.css'

const InventoryAddDialog = ({ handleCloseAddDialog, cat }) => {
    const [name, setName] = useState('')
    const [size, setSizes] = useState([
        { label: 'Small', price: 0 },
        { label: 'Medium', price: 0 },
        { label: 'Large', price: 0 }])
    const [price, setPrice] = useState(0.00)
    const [description, setDescription] = useState('')
    const [item, setItem] = useState({
        name: '',
        category: cat,
        description: '',
        price: 0,
        size: [{ label: 'Small', price: 0 },
        { label: 'Medium', price: 0 },
        { label: 'Large', price: 0 }
        ]
    })

    useEffect(() => {
        setItem((prevItem) => {
            return {
                ...prevItem,
                name: name,
            };
        });
    }, [name]);

    useEffect(() => {
        setItem((prevItem) => {
            return {
                ...prevItem,
                price: price,
            };
        });
    }, [price]);

    useEffect(() => {
        setItem((prevItem) => {
            return {
                ...prevItem,
                description: description,
            };
        });
    }, [description]);

    useEffect(() => {
        setItem((prevItem) => {
            return {
                ...prevItem,
                size: size,
            };
        });
    }, [size, setItem]);

    const handleClose = () => {
        handleCloseAddDialog()
    }

    const handleSave = () => {
        if (item.category !== 'Coffee') {
            item.size = [];
        }
        InventoryService.createInventoryItem(item)
        handleCloseAddDialog()
    }

    const handleSizePriceChange = (e, index) => {
        console.log("Changing size at index " + index + ". value: " + e.target.value)
        const { name, value } = e.target;
        setSizes((prevSizes) => {
            const newSizes = prevSizes.map((s, i) => {
                if (i === index) {
                    return {
                        ...s,
                        [name]: value,
                    };
                }
                return s;
            });
            return newSizes;
        });
    };


    const handleNameChange = (e) => {
        console.log("Name Change: " + e.target.value)
        setName(e.target.value)
    }

    const handleDescriptionChange = (e) => {
        console.log("Description Change: " + e.target.value)
        setDescription(e.target.value)
    }

    const handlePriceChange = (e) => {
        console.log("Price Change: " + e.target.value)
        setPrice(e.target.value)
    }

    return (
        <SlDialog key='add' size='large' className='inv-dialog' open={true}>
            <div className="inv-dialog-header">
                <h2>Create {cat} Item</h2>
            </div>
            <div className='inv-dialog-spacer'></div>
            <div className="inv-dialog-image">
                <img src="./productimage1.png" alt="Product" />
            </div>
            <div className="inv-dialog-body">
                <div>
                    <h4>Name</h4>
                    <SlInput placeholder='Enter Item name' onSlChange={(e) => handleNameChange(e)} value={name}></SlInput>
                </div>
                <div>
                    <h4>Description</h4>
                    <SlTextarea placeholder='Write a description here' onSlChange={(e) => handleDescriptionChange(e)} value={description} size='small'></SlTextarea>
                </div>
                {item.category === 'Coffee' && (
                    <div className='inv-sizes'>
                        <h4>Pricing by Size</h4>
                        {size.map((size, index) => (
                            <div className="inv-size-container" key={index}>
                                <h4>{size.label}</h4>
                                <SlInput
                                    type="number"
                                    name="price"
                                    value={size.price}
                                    onSlChange={(e) => handleSizePriceChange(e, index)}
                                ></SlInput>
                            </div>
                        ))}
                    </div>
                )}
                {item.category !== 'Coffee' && (
                    <div>
                        <h4>Price</h4>
                        <SlInput
                            className='inv-input'
                            type="number"
                            name="price"
                            value={price}
                            onSlChange={(e) => handlePriceChange(e)}
                        ></SlInput>
                    </div>)}
            </div>
            <div className='inv-dialog-spacer'></div>
            <div className="inv-item-footer">
                <div className='inv-item-button'>
                    <SlButton size='large' variant='danger' onClick={handleClose} href="#">
                        Close
                    </SlButton>
                </div>
                <div className='inv-item-button'>
                    <SlButton size='large' variant='success' onClick={handleSave} href="#">
                        Create
                    </SlButton>
                </div>
            </div>
        </SlDialog>
    );
};

export default InventoryAddDialog;
