import React from 'react';
import Button from '../Button/Button';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <h1>Inspiration starts with an event</h1>
      <Button variant="primary" className="hero-button">
        Find your next event
      </Button>
    </section>
  );
};

export default Hero; 