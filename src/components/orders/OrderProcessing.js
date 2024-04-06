import React, { useState } from 'react';
import OrderService from '../../services/OrderService';
import OrderList from './OrderList';

const OrderProcessing = () => {
    const [orders, setOrders] = useState(OrderService.getOrders())

    const startOrder = (order) => {
        OrderService.changeOrderStatus(order, 'Processing')
        setOrders(OrderService.getOrders())
    };

    const completeOrder = (order) => {
        OrderService.changeOrderStatus(order, 'Complete')
        setOrders(OrderService.getOrders())
    };

    const cancelOrder = (order) => {
        OrderService.changeOrderStatus(order, 'Cancelled')
        setOrders(OrderService.getOrders())
    };

    const orderStatusOrder = ['Pending', 'Processing', 'Complete']

    const sortedOrders = Object.entries(orders)
        .filter(([status]) => status !== 'Cancelled') // Exclude 'Cancelled' status
        .sort(([statusA], [statusB]) => orderStatusOrder.indexOf(statusA) - orderStatusOrder.indexOf(statusB));

    return (
        <div className="order-processing-container">
            <div className="order-processing-header"><h1>ORDERS</h1></div>
            <div className="order-processing-lists">
                {sortedOrders.map(([status, orders]) => (
                    <OrderList key={status} startOrder={startOrder} completeOrder={completeOrder} cancelOrder={cancelOrder} title={status} orders={orders} />
                ))}
            </div>
        </div>
    );
};

export default OrderProcessing;
