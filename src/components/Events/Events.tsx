import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryButtons from '../CategoryButtons/CategoryButtons';
import EventsGrid from '../EventsGrid/EventsGrid';
import { eventRepository } from '../../repositories/event/eventsRepository';
import { Event } from '../../repositories/event/Event';
import { SearchEventsRequest } from '../../repositories/event/SearchEventsRequest';
import { getImageUrl } from '../../shared/utils/imageUtils';
import './Events.css';

const Events: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const response = await eventRepository.searchEvents({
          page: 1,
          pageSize: 10,
          request: {
            Title: '',
            Category: '',
            City: '',
            DateFrom: '',
            DateTo: ''
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
    navigate(`/event/${eventId}`);
  };

  if (isLoading) {
    return <div className="events-page">Loading...</div>;
  }

  return (
    <div className="events-page">
      <CategoryButtons />
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
    </div>
  );
};

export default Events; 