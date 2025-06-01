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
      title: 'Jazz Night at Blue Note',
      description: 'An evening of smooth jazz and fine dining',
      imageUrl: jazImage,
      date: 'Coming Soon',
      price: '200 UAH'
    },
    {
      id: '2',
      title: 'Theater Gala',
      description: 'Experience the magic of live theater with our exclusive gala night.',
      imageUrl: require('../../assets/theatre.jpg'),
      date: 'Coming Soon',
      price: '350 UAH'
    },
    {
      id: '3',
      title: 'Music Festival',
      description: 'Dance to the beats and enjoy the ultimate music festival experience.',
      imageUrl: atlasImage,
      date: 'Coming Soon',
      price: '400 UAH'
    },
    {
      id: '4',
      title: 'Один в каное',
      description: 'Магія звучання, Щирість замість байдужості, Осінь, що відчувається влітку, Вулиця, яка лишається пустою опівночі',
      imageUrl: odunvcanoeImage,
      date: '18 червня 2024',
      price: '750 UAH'
    },
    {
      id: '5',
      title: 'Symphony Night',
      description: 'Ніч симфонічної музики під зірками. Класичні шедеври у виконанні найкращих музикантів України.',
      imageUrl: fankonImage,
      date: '5 квітня 2024',
      price: '500 UAH'
    },
    {
      id: '6',
      title: 'Acoustic Evening',
      description: 'Затишний вечір акустичної музики. Живе виконання, душевна атмосфера та незабутні емоції.',
      imageUrl: palindromImage,
      date: '20 травня 2024',
      price: '450 UAH'
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