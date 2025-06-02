import React from 'react';
import './Button.css';

interface ButtonProps {
  variant?: 'outlined' | 'contained';
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'contained', 
  className = '', 
  onClick,
  children,
  disabled = false
}) => {
  return (
    <button 
      className={`button ${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button; 