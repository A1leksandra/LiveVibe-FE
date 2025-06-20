import React, { useState, useEffect } from 'react';
import './AuthModel.css';
import { authRepository } from '../../repositories/auth/authRepository';
import { RegisterRequest } from '../../repositories/auth/RegisterRequest';
import { LoginRequest } from '../../repositories/auth/LoginRequest';
import { AuthResponse } from '../../repositories/auth/AuthResponse';

interface AuthModelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const clearAuth = () => {
  // Clear auth data
  localStorage.removeItem('authToken');
  localStorage.removeItem('isAdmin');
  
  // Clear the auto-logout timer
  const timerId = localStorage.getItem('logoutTimer');
  if (timerId) {
    clearTimeout(Number(timerId));
    localStorage.removeItem('logoutTimer');
  }
  
  // Dispatch auth change event
  window.dispatchEvent(new Event('authChange'));
  
  // Reload the page to reset app state
  window.location.reload();
};

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

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Clear the timeout when component unmounts
      clearTimeout(Number(localStorage.getItem('logoutTimer')));
      // Remove event listeners
      window.removeEventListener('mousemove', () => {});
      window.removeEventListener('keypress', () => {});
      window.removeEventListener('click', () => {});
      window.removeEventListener('scroll', () => {});
    };
  }, []);

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

  const handleLogout = () => {
    clearAuth();
  };

  const setupAutoLogout = () => {
    const LOGOUT_TIME = 60 * 60 * 1000; // 1 hour in milliseconds
    const logoutTimer = setTimeout(handleLogout, LOGOUT_TIME);
    
    // Store the timer ID in localStorage to clear it if needed
    localStorage.setItem('logoutTimer', logoutTimer.toString());

    // Reset the timer on user activity
    const resetTimer = () => {
      clearTimeout(Number(localStorage.getItem('logoutTimer')));
      const newTimer = setTimeout(handleLogout, LOGOUT_TIME);
      localStorage.setItem('logoutTimer', newTimer.toString());
    };

    // Add event listeners for user activity
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('scroll', resetTimer);
  };

  const handleAuthSuccess = (response: AuthResponse) => {
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('isAdmin', response.isAdmin.toString());
    setupAutoLogout();
    
    // Dispatch auth change event before closing modal
    window.dispatchEvent(new Event('authChange'));
    
    clearForm();
    onClose();
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
        
        const response = await authRepository.login(loginRequest);
        
        if (response.isSuccess && response.data) {
          handleAuthSuccess(response.data);
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
        
        const response = await authRepository.register(registerRequest);
        
        if (response.isSuccess && response.data) {
          handleAuthSuccess(response.data);
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

        <form onSubmit={handleSubmit}>
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

          {apiError && <div className="error-message">{apiError}</div>}

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Завантаження...' : (isLogin ? 'Увійти' : 'Зареєструватися')}
          </button>

          {isLogin && (
            <button type="button" className="forgot-password">
              Забули пароль?
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default AuthModel; 