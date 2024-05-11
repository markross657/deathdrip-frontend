import React, {useState, useEffect} from 'react';
import MenuItem from './MenuItem'
import '../../css/menu.css'
import productService from '../../services/ProductService';

const Menu = () => {
  const [groupedProducts, setGroupedProducts] = useState(productService.getGroupedProducts());

  useEffect(() => {
    const unsubscribe = productService.subscribe(updatedGroupedProducts => {
      setGroupedProducts([...updatedGroupedProducts]);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className='menu-container'>
      {groupedProducts.length === 0 ? (
        <div>There are no menu items available.</div>
      ) : (
        groupedProducts.map(([category, items], groupIndex) => (
          <div key={'group' + groupIndex} className='inv-group'>
            <div className='inv-group-header'>
              <h2 key={'catname' + groupIndex} className='inv-group-text'>{category.name}</h2>
            </div>
            <div className='inv-group-items'>
              {items.length === 0 ? (
                <div>No products in this category.</div>
              ) : (
                items.map(item => (
                  <MenuItem key={item._id} item={item} />
                ))
              )}
            </div>
            <div className='inv-footer'></div>
          </div>
        ))
      )}

    </div>
  );
}

export default Menu;
