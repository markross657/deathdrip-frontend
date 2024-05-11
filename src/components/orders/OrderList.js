import React from 'react';
import '../../css/menu.css';
import Order from './Order';

const OrderList = (props) => {
    const { title, orders, startOrder, cancelOrder, completeOrder } = props;

    return (
        <div className='order-list'>
            <div><h2>{title}</h2></div>
            <div className='order-list-items'>
                {orders.slice(0, 10).map(order => (
                    <Order key={"order"+order.id} startOrder={startOrder} cancelOrder={cancelOrder} completeOrder={completeOrder} order={order} />
                ))}
            </div>
        </div>
    );
}

export default OrderList;
