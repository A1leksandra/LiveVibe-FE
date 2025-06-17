import React, { useState } from 'react';
import './AuthModel.css';
import { authRepository } from '../../repositories/auth/authRepository';
import { RegisterRequest } from '../../repositories/auth/RegisterRequest';
import { LoginRequest } from '../../repositories/auth/LoginRequest';

interface AuthModelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModel: React.FC<AuthModelProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const clearForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFirstName('');
    setLastName('');
    setPhone('');
    setPasswordError('');
    setApiError('');
  };

  const handleAuthSuccess = (token: string) => {
    localStorage.setItem('authToken', token);
    clearForm();
    // Close the modal first
    onClose();
    // Use setTimeout to allow the request to complete and be visible in network tab
  };

  const validatePasswords = () => {
    if (password !== confirmPassword) {
      setPasswordError('Паролі не співпадають');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    setIsLoading(true);
    
    try {
      if (isLogin) {
        const loginRequest: LoginRequest = {
          email,
          password
        };
        
        console.log('Sending login request:', loginRequest);
        const response = await authRepository.login(loginRequest);
        console.log('Login response:', response);
        
        if (response.isSuccess && response.data) {
          handleAuthSuccess(response.data.token);
        } else {
          setApiError(response.error?.message || 'Помилка входу');
        }
      } else {
        if (!validatePasswords()) {
          setIsLoading(false);
          return;
        }
        
        const registerRequest: RegisterRequest = {
          firstName,
          lastName,
          phone,
          email,
          password
        };
        
        console.log('Sending register request:', registerRequest);
        const response = await authRepository.register(registerRequest);
        console.log('Register response:', response);
        
        if (response.isSuccess && response.data) {
          handleAuthSuccess(response.data.token);
        } else {
          setApiError(response.error?.message || 'Помилка реєстрації');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setApiError('Виникла несподівана помилка');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (login: boolean) => {
    setIsLogin(login);
    clearForm();
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
            <>
              <div className="form-group">
                <label htmlFor="firstName">Ім'я</label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Введіть ваше ім'я"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName">Прізвище</label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Введіть ваше прізвище"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Телефон</label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Введіть ваш номер телефону"
                  required
                />
              </div>
            </>
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

          {apiError && <span className="error-message">{apiError}</span>}

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Завантаження...' : (isLogin ? 'Увійти' : 'Зареєструватися')}
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

export default AuthModel; 