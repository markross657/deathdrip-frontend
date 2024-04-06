import React from 'react';
import LogoutButton from '../components/login/Logout'
import UserService from '../services/UserService';

const NavMenu = ({ onSetActive }) => {
    const user = UserService.getUser()
    const handleSelect = (type) => {
        onSetActive(type)
    }

    return (
        <div className="navmenu">
            {user.accesslevel === 1 && (
                <div>
                    <div className='navMenuItem' onClick={() => handleSelect('Account')}>Account</div>
                    <div className='navMenuItem ' onClick={() => handleSelect('Menu')}>Menu</div>
                    <div className='navMenuItem' onClick={() => handleSelect('Cart')}>Cart</div>
                </div>)
            }
            {user.accesslevel > 1 && (
                <div>
                    <div className='navMenuItem' onClick={() => handleSelect('Account')}>Account</div>
                    <div className='navMenuItem ' onClick={() => handleSelect('Orders')}>Orders</div>
                    {user.accesslevel === 2 && <div className='navMenuItem ' onClick={() => handleSelect('Inventory')}>Inventory</div>}
                </div>)
            }
            <div className='navMenuItem' >
                <LogoutButton />
            </div>
        </div>
    );
};

export default NavMenu;
