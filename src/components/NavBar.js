import React, { useState } from 'react';
import '../css/navbar.css'
import CartButton from './cart/CartButton';
import NavMenu from './NavMenu';
import UserService from '../services/UserService';

function Navbar({onSetActive}) {

    const logoUrl = `${process.env.PUBLIC_URL}/DDIcon.png`
    const user = UserService.getUser()

    const [menuActive, setMenuActive] = useState(false)
    const handleMenuClick = () =>
    {
       setMenuActive(!menuActive);
    }

    const handleSelect = (option) => {
      onSetActive(option);
      setMenuActive(!menuActive);
    }

    return (
    <div className="navbar">
      <div className="navbarLeft">
            {user.accesslevel === 1 &&<img alt='' onClick={() => onSetActive('Menu')} src={logoUrl}/>  }
            {user.accesslevel > 1 && <img alt='' onClick={() => onSetActive('Orders')} src={logoUrl}/>  }
      </div>
      <div className="navbarCenter">
        <button onClick={handleMenuClick}><strong>☰</strong></button>
      </div>
      <div className="navbarRight">
        {user.accesslevel === 1 && (<span><CartButton onSetActive={()=>onSetActive('Cart')}/></span>)}
      </div>
      {menuActive && (<NavMenu onSetActive={(option) => handleSelect(option)}/>)}
    </div>
    );
}

export default Navbar;
