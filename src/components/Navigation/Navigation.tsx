import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../Button/Button';
import AuthModal from '../AuthModal/AuthModal';
import CartModal from '../CartModal/CartModal';
import './Navigation.css';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  const handleClearSearch = () => {
    setSearchValue('');
    navigate('/events');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchValue.trim())}`);
    } else {
      navigate('/events');
    }
  };

  const handleSearchClick = () => {
    if (searchValue.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchValue.trim())}`);
    } else {
      navigate('/events');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e as any);
    }
  };

  return (
    <header className="navigation">
      <div className="nav-content">
        <Link to="/" className="logo">EventsHub</Link>
        <form className="search-container" onSubmit={handleSearchSubmit}>
          <input 
            type="search" 
            placeholder="Пошук подій" 
            className="search-input" 
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          {searchValue && (
            <button 
              type="button"
              className="search-clear-button"
              onClick={handleClearSearch}
              aria-label="Clear search"
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
          )}
          <button 
            type="submit"
            className="search-submit-button"
            aria-label="Search"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path 
                d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" 
                stroke="#623939" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M14 14L11.1 11.1" 
                stroke="#623939" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>
        <nav className="nav-buttons">
          <button 
            className="cart-button"
            onClick={() => setIsCartModalOpen(true)}
            aria-label="Open cart"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path 
                d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" 
                stroke="#CFB7AD" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M3 6H21" 
                stroke="#CFB7AD" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" 
                stroke="#CFB7AD" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <Button 
            variant="outlined" 
            className="nav-button"
            onClick={() => setIsAuthModalOpen(true)}
          >
            Увійти
          </Button>
          <Link to="/my-tickets" className="nav-link">
            <Button 
              variant="outlined" 
              className="nav-button"
            >
              Мої квитки
            </Button>
          </Link>
        </nav>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      <CartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
      />
    </header>
  );
};

export default Navigation; 