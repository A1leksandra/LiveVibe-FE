import React, { useEffect, useState } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import Hero from './components/Hero/Hero';
import EventsGrid from './components/EventsGrid/EventsGrid';
import EventDetails from './components/EventDetails/EventDetails';
import Events from './components/Events/Events';
import OrderConfirmation from './pages/OrderConfirmation/OrderConfirmation';
import MyTickets from './pages/MyTickets/MyTickets';
import CreateEvent from './pages/CreateEvent/CreateEvent';
import EditEvent from './pages/EditEvent/EditEvent';
import UsersList from './pages/Users/Users';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { CartProvider } from './contexts/CartContext';
import { eventRepository } from './repositories/event/eventsRepository';
import { Event } from './repositories/event/Event';
import { getImageUrl } from './shared/utils/imageUtils';
import { isUserAdmin } from './shared/utils/authUtils';
import './App.css';

// Import images

// const atlasImg = require('./assets/atlas.jpg');

const HomePage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventRepository.searchEvents({
          pageNumber: 1,
          pageSize: 6,
          request: {
            Title: '',
            Category: '',
            City: '',
            DateFrom: '',
            DateTo: '',
            OrderByDate: true
          }
        });

        if (response.isSuccess && response.data) {
          setEvents(response.data.items);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = (eventId: string) => {
    console.log(`Event clicked: ${eventId}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Hero />
      <EventsGrid
        events={events.map(event => ({
          id: event.id,
          title: event.title,
          description: event.description,
          imageUrl: getImageUrl(event.imageUrl),
          date: new Date(event.time).toLocaleDateString('uk-UA', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }),
          price: `${event.matchedSeatCategoryPrice} UAH`
        }))}
        onEventClick={handleEventClick}
      />
    </>
  );
};

const App: React.FC = () => {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="App">
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<Events />} />
            <Route 
              path="/my-tickets" 
              element={
                <ProtectedRoute>
                  <MyTickets />
                </ProtectedRoute>
              } 
            />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route 
              path="/event/create" 
              element={
                <ProtectedRoute checkAdmin>
                  <CreateEvent />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/event/edit/:id" 
              element={
                <ProtectedRoute checkAdmin>
                  <EditEvent />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/order-confirmation" 
              element={
                <ProtectedRoute>
                  <OrderConfirmation />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/users" 
              element={
                <ProtectedRoute checkAdmin>
                  <UsersList />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </BrowserRouter>
    </CartProvider>
  );
};

export default App; 