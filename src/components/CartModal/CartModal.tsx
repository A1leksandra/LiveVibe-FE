import React from 'react';
import './CartModal.css';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
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
          {/* Cart items will be added here later */}
          <p className="empty-cart-message">Ваш кошик порожній</p>
        </div>
      </div>
    </div>
  );
};

export default CartModal; 