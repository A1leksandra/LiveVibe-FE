import React from 'react';
import './Button.css';

interface ButtonProps {
  variant?: 'outlined' | 'contained';
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'contained', 
  className = '', 
  onClick,
  children
}) => {
  return (
    <button 
      className={`button ${variant} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button; 