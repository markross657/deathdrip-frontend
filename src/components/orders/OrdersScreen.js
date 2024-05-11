import React, { useEffect, useState } from 'react';
import orderService from '../../services/OrderService';
import OrderList from './OrderList';

const OrdersScreen = () => {
    const [orders, setOrders] = useState(orderService.getOrders())

    useEffect(() => {
        const unsubscribe = orderService.subscribe(updatedOrders => { setOrders([...updatedOrders]); });
        return () => { unsubscribe(); };
    }, []);

    const startOrder = (order) => {
        console.log("starting order " + order.id)
        orderService.changeOrderStatus(order, 'Processing')
        setOrders(orderService.getOrders())
    };

    const completeOrder = (order) => {
        console.log("completing order " + order.id)
        orderService.changeOrderStatus(order, 'Complete')
        setOrders(orderService.getOrders())
    };

    const cancelOrder = (order) => {
        console.log("cancelling order " + order.id)
        orderService.changeOrderStatus(order, 'Cancelled')
        setOrders(orderService.getOrders())
    };

    const orderStatusTypes = ['Pending', 'Processing', 'Complete'];

    return (
        <div className="order-processing-container">
            <div className="order-processing-header"><h1>ORDERS</h1></div>
            <div className="order-processing-lists">
                {orderStatusTypes.map(status => (
                    <OrderList
                        key={status}
                        startOrder={startOrder}
                        completeOrder={completeOrder}
                        cancelOrder={cancelOrder}
                        title={status}
                        orders={orders.filter(order => order.status === status)}
                    />
                ))}
            </div>
        </div>
    );
};

export default OrdersScreen;
