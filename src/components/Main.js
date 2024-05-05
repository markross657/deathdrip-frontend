import { useState } from "react";
import Navbar from "./NavBar";
import Menu from "./menu/Menu";
import OrderProcessing from "./orders/OrderProcessing"
import Cart from "./cart/Cart"
import Account from "./users/Account";
import UserService from "../services/UserService";
import Inventory from "./inventory/Inventory";
import React from "react";

const Main = () => {

    const [active, setActive] = useState('Orders')
    const user = UserService.getUser()

    return (
        <div className='main-container'>
            <Navbar onSetActive={setActive} />
            {user.accesslevel === 1 && (
                (active === 'Menu' && <Menu onSetActive={setActive} />) ||
                (active === 'Cart' && <Cart onSetActive={setActive} />) ||
                (active === 'Account' && <Account onSetActive={setActive} />)
            )}
            {user.accesslevel > 1 && (
                (active === 'Orders' && <OrderProcessing onSetActive={setActive} />) ||
                (user.accesslevel === 2 && active === 'Inventory' && <Inventory onSetActive={setActive} />) ||
                (active === 'Account' && <Account onSetActive={setActive} />)
            )}
        </div>
    );

}

export default Main;