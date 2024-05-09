import '../../css/menu.css'
import InventoryAddDialog from './InventoryAddDialog';
import productService from '../../services/ProductService';
import InventoryItem from './InventoryItem';
import SlButton from '@shoelace-style/shoelace/dist/react/button';
import SlDivider from '@shoelace-style/shoelace/dist/react/divider';
import React, { useState, useEffect } from 'react';
import InventoryEditDialog from './InventoryEditDialog';

const Inventory = () => {
    const [groupedProducts, setGroupedProducts] = useState(productService.getGroupedProducts());
    const [showAddDialog, setShowAddDialog] = useState(false)
    const [showEditDialog, setShowEditDialog] = useState(false)

    const [addCategory, setAddCategory] = useState('')
    const [editItem, setEditItem] = useState({})

    useEffect(() => {
        const unsubscribe = productService.subscribe(updatedGroupedProducts => { setGroupedProducts([...updatedGroupedProducts]); });

        return () => {
            unsubscribe();
        }
    }, []);

    const handleCloseAddDialog = () => {
        setAddCategory('')
        setShowAddDialog(false)
    }

    const handleShowAddDialog = (category) => {
        setAddCategory(category)
        setShowAddDialog(true)
    }

    const handleCloseEditDialog = () => {
        setEditItem({})
        setShowEditDialog(false)
    }

    const handleShowEditDialog = (item) => {
        setEditItem(item)
        setShowEditDialog(true)
    }

    return (
        <div className='inv-container'>
            <div className='inv-header'>
                <h1>Inventory Management</h1>
            </div>
            <div className='inv-items'>
                {console.log("Grouped Products:")}
                {console.log(groupedProducts)}
                {Object.entries(groupedProducts).map(([category, products], groupIndex) => (
                    <div key={groupIndex} className='inv-group'>
                        <SlDivider></SlDivider>
                        <div className='inv-group-header'>
                            <h2 className='inv-group-text'>{category}</h2>
                            <span />
                            <SlButton variant='success' className='inv-add-button' onClick={() => handleShowAddDialog(category)} href="#">
                                Add Item
                            </SlButton>
                        </div>
                        <div className='inv-group-items'>
                            {products.length === 0 ? (
                                <div>No products.</div>
                            ) : (
                                products.map(item => (
                                    <InventoryItem
                                        handleCloseEditDialog={handleCloseEditDialog}
                                        handleShowEditDialog={handleShowEditDialog}
                                        key={item._id}
                                        item={item}
                                    />
                                ))
                            )}
                        </div>
                        <div className='inv-footer'></div>
                    </div>
                ))}
            </div>

            {showAddDialog && addCategory !== '' && <InventoryAddDialog cat={addCategory} handleCloseAddDialog={handleCloseAddDialog} />}
            {showEditDialog && Object.keys(editItem).length !== 0 && <InventoryEditDialog item={editItem} handleCloseEditDialog={handleCloseEditDialog} />}
        </div>
    );
}

export default Inventory;
