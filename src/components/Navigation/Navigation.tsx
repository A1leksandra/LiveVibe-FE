import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../Button/Button';
import AuthModal from '../AuthModal/AuthModal';
import Portal from '../Portal/Portal';
import './Navigation.css';

const Navigation: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Оберіть місто');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
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
    </header>
  );
};

export default Navigation; 