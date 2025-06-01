import React from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryButtons from '../CategoryButtons/CategoryButtons';
import EventsGrid from '../EventsGrid/EventsGrid';
import atlasImage from '../../assets/atlas.jpg';
import jazImage from '../../assets/jaz.jpg';
import odunvcanoeImage from '../../assets/odunvcanoe.jpg';
import fankonImage from '../../assets/fankon.jpg';
import palindromImage from '../../assets/palindrom.jpg';
import './Events.css';

const Events: React.FC = () => {
  const navigate = useNavigate();
  const allEvents = [
    {
      id: '1',
      title: 'Rock Symphony',
      description: 'Legendary rock hits performed by a symphony orchestra. Experience your favorite songs in a new light.',
      imageUrl: require('../../assets/theatre.jpg'),
      date: '15 липня 2024',
      price: '600 UAH'
    },
    {
      id: '2',
      title: 'Ukrainian Folk Festival',
      description: 'A celebration of Ukrainian culture with traditional music, dance, and contemporary folk fusion.',
      imageUrl: atlasImage,
      date: '25 серпня 2024',
      price: '450 UAH'
    },
    {
      id: '3',
      title: 'Opera Night',
      description: 'An enchanting evening of classical opera featuring world-renowned performers.',
      imageUrl: jazImage,
      date: '10 вересня 2024',
      price: '800 UAH'
    },
    {
      id: '4',
      title: 'Electronic Music Fest',
      description: 'A night of electronic music with top DJs and incredible visual effects.',
      imageUrl: fankonImage,
      date: '30 липня 2024',
      price: '550 UAH'
    },
    {
      id: '5',
      title: 'Shakespeare in the Park',
      description: 'Open-air theater performance of classic Shakespeare plays in a beautiful park setting.',
      imageUrl: odunvcanoeImage,
      date: '5 серпня 2024',
      price: '400 UAH'
    },
    {
      id: '6',
      title: 'Jazz & Wine Festival',
      description: 'Smooth jazz performances paired with fine wine tasting experience.',
      imageUrl: palindromImage,
      date: '20 серпня 2024',
      price: '700 UAH'
    }
  ];

  const handleEventClick = (eventId: string) => {
    navigate(`/event/${eventId}`);
  };

  return (
    <div className="events-page">
      <CategoryButtons />
      <EventsGrid
        events={allEvents}
        onEventClick={handleEventClick}
      />
    </div>
  );
};

export default Events; 