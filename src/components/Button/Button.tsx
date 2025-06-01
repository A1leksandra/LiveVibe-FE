import React from 'react';
import './Button.css';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outlined';
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  className = '' 
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