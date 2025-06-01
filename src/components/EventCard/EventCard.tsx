import React from 'react';
import Card from '../Card/Card';
import Button from '../Button/Button';
import './EventCard.css';

interface EventCardProps {
  title: string;
  description: string;
  imageUrl: string;
  date?: string;
  buttonText: string;
  onButtonClick?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({
  title,
  description,
  imageUrl,
  date,
  buttonText,
  onButtonClick
}) => {
  return (
    <Card className="event-card">
      <img src={imageUrl} alt={title} />
      <h3>{title}</h3>
      {date && <p className="date">{date}</p>}
      <p className="description">{description}</p>
      <Button 
        variant="secondary" 
        onClick={onButtonClick}
        className="event-button"
      >
        {buttonText}
      </Button>
    </Card>
  );
};

export default EventCard; 