import React from 'react';
import SlButton from '@shoelace-style/shoelace/dist/react/button';
import orderService from '../../services/OrderService'
import '../../css/order.css';

const AccountOrderCard = ({ order }) => {

    const handleCancelOrder = (order) => {
        orderService.changeOrderStatus(order, 'Cancelled');
        console.log("Order Cancelled:", order.id);
    };    

    return (
        <div className="account-order-container">
            <div className="order-top">
                <h2>Order: {order.id}</h2>
            </div>
            <div className="order-middle">
                {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                        <span>{item.quantity} {item.name}</span>
                    </div>
                ))}
            </div>
            <div className="order-bottom">
                <span>Total: ${order.total}</span>
                <span>Order Time: {new Date(order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="order-button">
                {order.status === 'Processing' || order.status === 'Pending' ? (                                           
                    <SlButton size='medium' variant='danger' onClick={() => handleCancelOrder(order)} href="#">
                        Cancel
                    </SlButton>
                ) : null}                    
            </div>
        </div>
    );
};

export default AccountOrderCard;
