import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../Button/Button';
import AuthModal from '../AuthModal/AuthModal';
import './Navigation.css';

const Navigation: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Оберіть місто');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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

  return (
    <header className="navigation">
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
        <div className="location-dropdown">
          <Button 
            variant="outlined" 
            className="nav-button"
            onClick={() => setIsLocationOpen(!isLocationOpen)}
          >
            {selectedCity}
          </Button>
          {isLocationOpen && (
            <div className="city-dropdown">
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
          )}
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

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  );
};

export default Navigation; 