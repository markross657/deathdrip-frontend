import React from 'react';
import '../../css/menu.css';
import Order from './Order';

const OrderList = (props) => {
    const { title, orders, startOrder, cancelOrder, completeOrder } = props;

    // If the title is 'Complete', take only the most recent 10 orders
    const displayedOrders = title === 'Complete' ? orders.slice(0, 10) : orders;

    return (
        <div className='order-list'>
            <div><h2>{title}</h2></div>
            <div className='order-list-items'>
                {displayedOrders.map(order => (
                    <Order key={order._id} startOrder={startOrder} cancelOrder={cancelOrder} completeOrder={completeOrder} order={order} />
                ))}
            </div>
        </div>
    );
}

export default OrderList;
