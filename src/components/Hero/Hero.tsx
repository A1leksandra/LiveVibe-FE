import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Button/Button';
import './Hero.css';

const Hero: React.FC = () => {
  const navigate = useNavigate();

  const handleFindEvent = () => {
    navigate('/events');
  };

  return (
    <section className="hero">
      <h1>Знайдіть своє наступне враження</h1>
      <Button 
        variant="contained" 
        className="hero-button"
        onClick={handleFindEvent}
      >
        Знайти подію
      </Button>
    </section>
  );
};

export default Hero; 