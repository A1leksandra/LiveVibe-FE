import React from 'react';
import Button from '../Button/Button';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <h1>Знайдіть своє наступне враження</h1>
      <Button variant="contained" className="hero-button">
        Знайти подію
      </Button>
    </section>
  );
};

export default Hero; 