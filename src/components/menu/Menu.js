import React from 'react';
import MenuItem from './MenuItem'
import '../../css/menu.css'
import productService from '../../services/ProductService';

const Menu = () => {
  const groups = productService.getGroupedProducts();

  return (
    <div className='menu-container'>
      {Object.keys(groups).length === 0 ? (
        <div>There are no menu items available.</div>
      ) : (
        Object.entries(groups).map(([category, items], groupIndex) => (
          <div key={groupIndex}>
            <h2 className='dd-h2'>{category}</h2>
            {items.length === 0 ? (
              <div>No products in this category.</div>
            ) : (
              items.map(item => (
                <MenuItem key={item._id} item={item} />
              ))
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Menu;
