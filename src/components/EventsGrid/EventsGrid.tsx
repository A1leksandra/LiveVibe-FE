import React from 'react';
import EventCard from '../EventCard/EventCard';
import './EventsGrid.css';

interface Event {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date?: string;
  buttonText: string;
}

interface EventsGridProps {
  title: string;
  events: Event[];
  onEventClick?: (eventId: string) => void;
}

const EventsGrid: React.FC<EventsGridProps> = ({
  title,
  events,
  onEventClick
}) => {
  return (
    <section className="events-section">
      <h2>{title}</h2>
      <div className="events-grid">
        {events.map((event) => (
          <EventCard
            key={event.id}
            title={event.title}
            description={event.description}
            imageUrl={event.imageUrl}
            date={event.date}
            buttonText={event.buttonText}
            onButtonClick={() => onEventClick?.(event.id)}
          />
        ))}
      </div>
    </section>
  );
};

export default EventsGrid; 