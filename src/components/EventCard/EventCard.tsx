import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../Card/Card';
import Button from '../Button/Button';
import { isUserAdmin } from '../../shared/utils/authUtils';
import './EventCard.css';

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date?: string;
  price: string;
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  description,
  imageUrl,
  date,
  price
}) => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(isUserAdmin());
  }, []);

  const handleClick = () => {
    navigate(`/event/${id}`);
  };

  return (
    <Card className="event-card">
      <img src={imageUrl} alt={title} className="event-image" />
      <div className="event-content">
        <h3>{title}</h3>
        {date && <p className="date">{date}</p>}
        <p className="description">{description}</p>
        <div className="event-footer">
          <span className="price">{price}</span>
          <Button 
            variant="contained" 
            className="event-button"
            onClick={handleClick}
          >
            {isAdmin ? 'Деталі' : 'Купити квиток'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default EventCard; 