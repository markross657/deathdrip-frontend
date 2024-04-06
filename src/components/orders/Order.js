import React from 'react';
import SlButton from '@shoelace-style/shoelace/dist/react/button';
import '../../css/order.css'
const Order = ({ order, startOrder, cancelOrder, completeOrder }) => {

    const handleCancelOrder = (order) => {
        cancelOrder(order)
    }

    const handleStartOrder = (order) => {
        startOrder(order)
    };

    const handleCompleteOrder = (order) => {
        completeOrder(order)
    }

    const handleHideOrder = (order) => {

    }

    return (
        <div className="order-container">
            <div className="order-top">
                <h2>{order.customerName}</h2>
            </div>
            <div className="order-middle">
                {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                        <span>{item.quantity} {item.name}</span>
                    </div>
                ))}
            </div>
            <div className="order-bottom">
                <span>Total: ${order.total.toFixed(2)}</span>
                <span>Order Time: {new Date(order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="order-button">
                {order.status === 'Complete' ? (
                    <SlButton size='medium' variant='danger' onClick={() => handleHideOrder(order)} href="#">
                        Hide
                    </SlButton>
                ) : (
                    <>
                        {order.status === 'Pending' && (
                            <SlButton size='medium' variant='success' onClick={() => handleStartOrder(order)} href="#">
                                Start
                            </SlButton>
                        )}
                        {order.status === 'Processing' && (
                            <SlButton size='medium' variant='success' onClick={() => handleCompleteOrder(order)} href="#">
                                Complete
                            </SlButton>
                        )}
                        <SlButton size='medium' variant='danger' onClick={() => handleCancelOrder(order)} href="#">
                            Cancel
                        </SlButton>
                    </>
                )}
            </div>

        </div>
    );
};

export default Order;
