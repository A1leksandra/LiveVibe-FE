import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import Hero from './components/Hero/Hero';
import EventsGrid from './components/EventsGrid/EventsGrid';
import MyTickets from './components/MyTickets/MyTickets';
import EventDetails from './components/EventDetails/EventDetails';
import Events from './components/Events/Events';
import atlasImage from './assets/atlas.jpg';
import jazImage from './assets/jaz.jpg';
import odunvcanoeImage from './assets/odunvcanoe.jpg';
import fankonImage from './assets/fankon.jpg';
import palindromImage from './assets/palindrom.jpg';
import './App.css';

// Import images

// const atlasImg = require('./assets/atlas.jpg');

const HomePage = () => {
  const featuredEvents = [
    {
      id: '1',
      title: 'Jazz Night at Blue Note',
      description: 'An evening of smooth jazz and fine dining',
      imageUrl: jazImage,
      buttonText: 'View Details',
      price: '200 UAH'
    },
    {
      id: '2',
      title: 'Theater Gala',
      description: 'Experience the magic of live theater with our exclusive gala night.',
      imageUrl: require('./assets/theatre.jpg'),
      buttonText: 'View Details',
      price: '350 UAH'
    },
    {
      id: '3',
      title: 'Music Festival',
      description: 'Dance to the beats and enjoy the ultimate music festival experience.',
      imageUrl: atlasImage,
      buttonText: 'View Details',
      price: '400 UAH'
    }
  ];

  const upcomingConcerts = [
    {
      id: '4',
      title: 'Один в каное',
      description: 'Магія звучання, Щирість замість байдужості, Осінь, що відчувається влітку, Вулиця, яка лишається пустою опівночі, ',
      imageUrl: odunvcanoeImage,
      date: '18 червня 2024',
      buttonText: 'Купити квиток',
      price: '750 UAH'
    },
    {
      id: '5',
      title: 'Symphony Night',
      description: 'Ніч симфонічної музики під зірками. Класичні шедеври у виконанні найкращих музикантів України.',
      imageUrl: fankonImage,
      date: '5 квітня 2024',
      buttonText: 'Купити квиток',
      price: '500 UAH'
    },
    {
      id: '6',
      title: 'Acoustic Evening',
      description: 'Затишний вечір акустичної музики. Живе виконання, душевна атмосфера та незабутні емоції.',
      imageUrl: palindromImage,
      date: '20 травня 2024',
      buttonText: 'Купити квиток',
      price: '450 UAH'
    }
  ];

  const handleEventClick = (eventId: string) => {
    console.log(`Event clicked: ${eventId}`);
  };

  return (
    <>
      <Hero />
      <EventsGrid
        events={featuredEvents}
        onEventClick={handleEventClick}
      />
      <EventsGrid
        events={upcomingConcerts}
        onEventClick={handleEventClick}
      />
    </>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<Events />} />
          <Route path="/my-tickets" element={<MyTickets />} />
          <Route path="/event/:id" element={<EventDetails />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App; 