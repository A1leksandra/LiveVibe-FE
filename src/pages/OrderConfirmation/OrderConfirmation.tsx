import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { orderRepository } from '../../repositories/order/orderRepository';
import { userRepository } from '../../repositories/user/userRepository';
import './OrderConfirmation.css';

const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  useEffect(() => {
    // Load user data when component mounts
    const loadUserData = async () => {
      try {
        const response = await userRepository.me();
        if (response.isSuccess && response.data) {
          setFormData({
            firstName: response.data.firstName || '',
            lastName: response.data.lastName || '',
            email: response.data.email || ''
          });
        }
      } catch (err) {
        console.error('Failed to load user data:', err);
      }
    };

    loadUserData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Create an order for each item in the cart
      const orderPromises = items.map(item => 
        orderRepository.create({
          eventId: item.eventId,
          seatTypeId: item.seatTypeId,
          quantity: item.quantity,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email
        })
      );

      const results = await Promise.all(orderPromises);
      
      // Check if any orders failed
      const failedOrders = results.filter(result => !result.isSuccess);
      
      if (failedOrders.length > 0) {
        setError('Помилка при створенні замовлення. Будь ласка, спробуйте ще раз.');
      } else {
        // All orders were successful
        clearCart();
        navigate('/my-tickets');
      }
    } catch (err) {
      setError('Помилка при створенні замовлення. Будь ласка, спробуйте ще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: 'UAH',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (items.length === 0) {
    navigate('/');
    return null;
  }

  return (
    <div className="order-confirmation-page">
      <div className="order-confirmation-container">
        <h1>Оформлення замовлення</h1>
        
        <div className="order-summary">
          <h2>Ваше замовлення</h2>
          {items.map(item => (
            <div key={item.id} className="order-item">
              <div className="order-item-details">
                <span className="event-title">{item.eventTitle}</span>
                <span className="seat-type">{item.seatTypeName}</span>
                <span className="quantity">Кількість: {item.quantity}</span>
              </div>
              <span className="price">{formatPrice(item.pricePerTicket * item.quantity)}</span>
            </div>
          ))}
          <div className="total">
            <span>Загальна сума:</span>
            <span className="total-amount">{formatPrice(getTotalPrice())}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="order-form">
          <h2>Контактні дані</h2>
          
          <div className="form-group">
            <label htmlFor="firstName">Ім'я</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              placeholder="Введіть ваше ім'я"
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Прізвище</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              placeholder="Введіть ваше прізвище"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Введіть ваш email"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button 
              type="button" 
              onClick={handleCancel}
              className="cancel-button"
            >
              Назад до кошика
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Оформлення...' : 'Підтвердити замовлення'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderConfirmation; 