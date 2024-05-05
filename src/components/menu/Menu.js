import React from 'react';
import MenuItem from './MenuItem'
import '../../css/menu.css'
import MenuService from '../../services/InventoryService';

const Menu = () => {
  const menuGroups = MenuService.getMenu();

  return ( 
    <div className='menu-container'>
      {Object.values(menuGroups).map((group, groupIndex) => (
        <div key={groupIndex}>
          <h2 className='dd-h2'>{group[0].category}</h2>
          {group.map(item => (
            <MenuItem key={item._id} item={item} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Menu;
