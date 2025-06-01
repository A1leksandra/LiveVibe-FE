import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../Button/Button';
import AuthModal from '../AuthModal/AuthModal';
import CartModal from '../CartModal/CartModal';
import Portal from '../Portal/Portal';
import './Navigation.css';

const Navigation: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Оберіть місто');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);

  const cities = [
    'Київ',
    'Львів',
    'Одеса',
    'Харків',
    'Дніпро',
    'Запоріжжя',
    'Вінниця',
    'Івано-Франківськ'
  ];

  const handleClearSearch = () => {
    setSearchValue('');
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setIsLocationOpen(false);
  };

  const toggleDropdown = () => {
    setIsLocationOpen(!isLocationOpen);
    if (!isLocationOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + (rect.width / 2)
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.city-dropdown') && !target.closest('.location-dropdown')) {
        setIsLocationOpen(false);
      }
    };

    if (isLocationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLocationOpen]);

  return (
    <header className="navigation">
      <div className="nav-content">
        <Link to="/" className="logo">EventsHub</Link>
        <div className="search-container">
          <input 
            type="search" 
            placeholder="Search" 
            className="search-input" 
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          {searchValue && (
            <button 
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
        </div>
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
          <div className="location-dropdown" ref={buttonRef}>
            <Button 
              variant="outlined" 
              className="nav-button"
              onClick={toggleDropdown}
            >
              {selectedCity}
            </Button>
          </div>
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

      {isLocationOpen && (
        <Portal>
          <div 
            className="city-dropdown"
            style={{
              position: 'absolute',
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              transform: 'translateX(-50%)'
            }}
          >
            {cities.map((city) => (
              <button
                key={city}
                className="city-option"
                onClick={() => handleCitySelect(city)}
              >
                {city}
              </button>
            ))}
          </div>
        </Portal>
      )}

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