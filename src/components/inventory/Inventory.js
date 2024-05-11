import '../../css/menu.css'
import ProductDialog from './ProductDialog';
import productService from '../../services/ProductService';
import InventoryItem from './InventoryItem';
import SlButton from '@shoelace-style/shoelace/dist/react/button';
import SlDivider from '@shoelace-style/shoelace/dist/react/divider';
import React, { useState, useEffect } from 'react';

const Inventory = () => {
    const [groupedProducts, setGroupedProducts] = useState(productService.getGroupedProducts());
    const [showDialog, setShowDialog] = useState(false);
    const [dialogProduct, setDialogProduct] = useState(null);
    const [dialogCategory, setDialogCategory] = useState(null);

    useEffect(() => {
        const unsubscribe = productService.subscribe(updatedGroupedProducts => {
            setGroupedProducts([...updatedGroupedProducts]);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const handleCloseDialog = () => {
        setDialogProduct(null);
        setDialogCategory(null);
        setShowDialog(false);
    }

    const handleShowAddDialog = (category) => {
        setDialogCategory(category);
        setDialogProduct(null); // Ensure no product is set when adding a new one
        setShowDialog(true);
    }

    const handleShowEditDialog = (item) => {
        setDialogCategory(item.category); // Assuming `item` contains a category object
        setDialogProduct(item);
        setShowDialog(true);
    }

    return (
        <div className='inv-container'>
            <div className='inv-header'>
                <h1>Inventory Management</h1>
            </div>
            <div className='inv-items'>
                {groupedProducts.map(([category, products], groupIndex) => (
                    <div key={groupIndex} className='inv-group'>
                        <SlDivider></SlDivider>
                        <div className='inv-group-header'>
                            <h2 className='inv-group-text'>{category.name}</h2>
                            <SlButton variant='success' className='inv-add-button' onClick={() => handleShowAddDialog(category)}>
                                Add Item
                            </SlButton>
                        </div>
                        <div className='inv-group-items'>
                            {products.length === 0 ? (
                                <div>No products.</div>
                            ) : (
                                products.map(item => (
                                    <InventoryItem
                                        handleShowEditDialog={handleShowEditDialog}
                                        key={item.id}
                                        item={item}
                                    />
                                ))
                            )}
                        </div>
                        <div className='inv-footer'></div>
                    </div>
                ))}
            </div>

            {showDialog && <ProductDialog cat={dialogCategory} product={dialogProduct} handleCloseDialog={handleCloseDialog} />}
        </div>
    );
}

export default Inventory;
