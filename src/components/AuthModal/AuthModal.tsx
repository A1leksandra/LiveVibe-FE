import React, { useState } from 'react';
import './AuthModal.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [passwordError, setPasswordError] = useState('');

  if (!isOpen) return null;

  const validatePasswords = () => {
    if (password !== confirmPassword) {
      setPasswordError('Паролі не співпадають');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && !validatePasswords()) {
      return;
    }

    // Handle authentication logic here
    console.log(isLogin ? 'Login' : 'Register', { email, password, name });
  };

  const handleTabChange = (login: boolean) => {
    setIsLogin(login);
    setPasswordError('');
    if (login) {
      setConfirmPassword('');
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path 
              d="M13 1L1 13M1 1L13 13" 
              stroke="#623939" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
          </svg>
        </button>
        
        <div className="auth-header">
          <h2>{isLogin ? 'Увійти' : 'Реєстрація'}</h2>
          <div className="auth-tabs">
            <button 
              className={`auth-tab ${isLogin ? 'active' : ''}`}
              onClick={() => handleTabChange(true)}
            >
              Увійти
            </button>
            <button 
              className={`auth-tab ${!isLogin ? 'active' : ''}`}
              onClick={() => handleTabChange(false)}
            >
              Реєстрація
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Ім'я</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Введіть ваше ім'я"
                required
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Введіть ваш email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введіть ваш пароль"
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Підтвердіть пароль</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Введіть пароль ще раз"
                required
              />
              {passwordError && <span className="error-message">{passwordError}</span>}
            </div>
          )}

          <button type="submit" className="submit-button">
            {isLogin ? 'Увійти' : 'Зареєструватися'}
          </button>
        </form>

        {isLogin && (
          <button className="forgot-password">
            Забули пароль?
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthModal; 