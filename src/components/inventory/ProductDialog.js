import React, { useState, useEffect } from 'react';
import SlButton from '@shoelace-style/shoelace/dist/react/button';
import SlIconButton from '@shoelace-style/shoelace/dist/react/icon-button';
import SlInput from '@shoelace-style/shoelace/dist/react/input';
import SlTextarea from '@shoelace-style/shoelace/dist/react/textarea';
import SlDialog from '@shoelace-style/shoelace/dist/react/dialog';
import productService from '../../services/ProductService';
import '../../css/inventory.css';

const ProductDialog = ({ handleCloseDialog, cat, product = null }) => {
    const [name, setName] = useState(product ? product.name : '');
    const [description, setDescription] = useState(product ? product.description : '');
    const [sizes, setSizes] = useState(product ? product.size : [{ label: '', price: 0 }]);

    const [item, setItem] = useState({
        id: product ? product.id : undefined,
        name: name,
        category: product ? product.category : cat,
        description: description,
        size: sizes,
    });

    useEffect(() => {
        setItem({
            id: product ? product.id : undefined,
            name: name,
            category: cat,
            description: description,
            size: sizes,
        });
    }, [name, description, sizes, cat, product]);

    const handleClose = () => {
        handleCloseDialog();
    };

    const handleSave = () => {
        if (product) {
            productService.updateProduct(item);
        } else {
            productService.createProduct(item);
        }
        handleCloseDialog();
    };

    const handleSizeChange = (index, field, value) => {
        const updatedSizes = sizes.map((size, idx) => {
            if (idx === index) {
                return { ...size, [field]: value };
            }
            return size;
        });
        setSizes(updatedSizes);
    };

    const handleAddSize = () => {
        setSizes([...sizes, { label: '', price: 0 }]);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleDeleteSize = (index) => {
        const updatedSizes = sizes.filter((_, idx) => idx !== index);
        setSizes(updatedSizes);
    };

    return (
        <SlDialog key='add' size='large' className='inv-dialog' open={true}>
            <div className="inv-dialog-header">
                <h2>{product ? `'Edit ${cat.name}` : 'Create Product'}</h2>
            </div>
            <div className='inv-dialog-spacer'></div>
            <div className="inv-dialog-body">
                <div>
                    <h4>Name</h4>
                    <SlInput placeholder='Enter Item name' onSlChange={handleNameChange} value={name}></SlInput>
                </div>
                <div>
                    <h4>Description</h4>
                    <SlTextarea placeholder='Write a description here' onSlChange={handleDescriptionChange} value={description} size='small'></SlTextarea>
                </div>
                <div className='inv-sizes'>
                    <div className='inv-size-header'>
                        <h4>Pricing by Size</h4>
                        <SlButton onClick={handleAddSize}>Add Size</SlButton>
                    </div>
                    {sizes.map((size, index) => (
                        <div className="inv-size-container" key={index}>
                            <SlInput
                                type="text"
                                name="label"
                                value={size.label}
                                onSlChange={(e) => handleSizeChange(index, 'label', e.target.value)}
                            ></SlInput>
                            <SlInput
                                type="number"
                                name="price"
                                value={size.price}
                                onSlChange={(e) => handleSizeChange(index, 'price', e.target.value)}
                            ></SlInput>
                            <SlIconButton onClick={(e) => handleDeleteSize(index)} size="large" name="x-square" label="delete" style={{ fontSize: '1.5rem' }} />
                        </div>
                    ))}
                </div>
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
                        {product ? 'Update' : 'Create'}
                    </SlButton>
                </div>
            </div>
        </SlDialog>
    );
};

export default ProductDialog;
