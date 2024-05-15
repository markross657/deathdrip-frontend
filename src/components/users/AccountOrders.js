import React, { useState } from 'react';
import orderService from '../../services/OrderService';
import AccountOrderCard from '../orders/AccountOrderCard';

const AccountOrders = ({ user }) => {
    const [myOrders, setMyOrders] = useState(orderService.getOrdersByUserId(user.id));

    useEffect(() => {
        const unsubscribe = orderService.subscribe(() => {
            setMyOrders(orderService.getOrdersByUserId(user.id));
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const currentOrders = myOrders.filter(order => order.status === 'Processing' || order.status === 'Pending');
    const pastOrders = myOrders.filter(order => order.status === 'Complete' || order.status === 'Cancelled');

    return (
        <div className="account-orders-page">
            <div>
                <h3>Your Current Orders</h3>
                {currentOrders.length > 0 ? (
                    <div className='account-orderlist-container'>
                        {currentOrders.map(order => (
                            <AccountOrderCard key={order.id} order={order} />
                        ))}
                    </div>
                ) : (
                    <p>You have no current orders.</p>
                )}
            </div>
            <div>
                <h3>Your Past Orders</h3>
                <div className='account-orderlist-container'>
                    {pastOrders.length > 0 ? (
                        pastOrders.map(order => (
                            <AccountOrderCard key={order.id} order={order} />
                        ))
                    ) : (
                        <p>You have no previous orders.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AccountOrders;
