import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { getImageUrl } from '../../shared/utils/imageUtils';
import AuthModel from '../AuthModel/AuthModel';
import './CartModal.css';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, [isAuthModalOpen]); // Re-check when auth modal closes

  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: 'UAH',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('uk-UA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date(dateString));
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
    } else {
      onClose();
      navigate('/order-confirmation');
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 14 14">
              <path 
                d="M13 1L1 13M1 1L13 13" 
                stroke="#623939" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
            </svg>
          </button>
          <h2>Кошик</h2>
          <div className="cart-items">
            {items.length === 0 ? (
              <p className="empty-cart-message">Ваш кошик порожній</p>
            ) : (
              <>
                {items.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-header">
                      <div className="cart-item-image">
                        <img src={getImageUrl(item.eventImage)} alt={item.eventTitle} />
                      </div>
                      <div className="cart-item-title">
                        <h3>{item.eventTitle}</h3>
                        <div className="event-info">
                          {formatDate(item.eventDate)}
                          <br />
                          {item.eventLocation}
                        </div>
                      </div>
                    </div>
                    <div className="seat-type">{item.seatTypeName}</div>
                    <div className="price-info">
                      <span className="price">{formatPrice(item.pricePerTicket)}</span>
                      <div className="quantity-controls">
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="quantity-button"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="quantity-button"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button 
                      className="remove-button"
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Remove item"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14">
                        <path 
                          d="M13 1L1 13M1 1L13 13" 
                          stroke="#623939" 
                          strokeWidth="2" 
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
                <div className="cart-summary">
                  <div className="total-price">
                    <span>Загальна сума:</span>
                    <span className="amount">{formatPrice(getTotalPrice())}</span>
                  </div>
                  <button 
                    className="checkout-button"
                    onClick={handleCheckout}
                  >
                    {isAuthenticated ? 'Оформити замовлення' : 'Увійдіть для оформлення'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <AuthModel 
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          const token = localStorage.getItem('authToken');
          if (token) {
            // If user just logged in, proceed to checkout
            onClose();
            navigate('/order-confirmation');
          }
        }}
      />
    </>
  );
};

export default CartModal; 