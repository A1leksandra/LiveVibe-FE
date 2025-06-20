import React from 'react';
import EventCard from '../EventCard/EventCard';
import './EventsGrid.css';

interface Event {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date?: string;
  price: string;
}

interface EventsGridProps {
  events: Event[];
  onEventClick?: (id: string) => void;
  onEventDelete?: () => void;
}

const EventsGrid: React.FC<EventsGridProps> = ({ events, onEventClick, onEventDelete }) => {
  return (
    <div className="events-grid">
      {events.map((event) => (
        <div key={event.id} className="event-item">
          <EventCard
            id={event.id}
            title={event.title}
            description={event.description}
            imageUrl={event.imageUrl}
            date={event.date}
            price={event.price}
            onDelete={onEventDelete}
          />
        </div>
      ))}
    </div>
  );
};

export default EventsGrid; 