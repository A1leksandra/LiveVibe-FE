import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../Button/Button';
import './EventDetails.css';
import jazImage from '../../assets/jaz.jpg';
import atlasImage from '../../assets/atlas.jpg';
import odunvcanoeImage from '../../assets/odunvcanoe.jpg';
import fankonImage from '../../assets/fankon.jpg';
import palindromImage from '../../assets/palindrom.jpg';

type EventId = '1' | '2' | '3' | '4' | '5' | '6';

interface EventType {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  price: string;
  location: string;
  time: string;
  availableTickets: number;
}

const eventData: Record<EventId, EventType> = {
  '1': {
    id: '1',
    title: 'Jazz Night at Blue Note',
    description: 'An evening of smooth jazz and fine dining',
    imageUrl: jazImage,
    date: 'Coming Soon',
    price: '200 UAH',
    location: 'Blue Note Jazz Club, Київ',
    time: '19:00',
    availableTickets: 150
  },
  '2': {
    id: '2',
    title: 'Theater Gala',
    description: 'Experience the magic of live theater with our exclusive gala night.',
    imageUrl: require('../../assets/theatre.jpg'),
    date: 'Coming Soon',
    price: '350 UAH',
    location: 'National Theater, Київ',
    time: '18:30',
    availableTickets: 200
  },
  '3': {
    id: '3',
    title: 'Music Festival',
    description: 'Dance to the beats and enjoy the ultimate music festival experience.',
    imageUrl: atlasImage,
    date: 'Coming Soon',
    price: '400 UAH',
    location: 'Atlas Arena, Київ',
    time: '16:00',
    availableTickets: 500
  },
  '4': {
    id: '4',
    title: 'Один в каное',
    description: 'Магія звучання, Щирість замість байдужості, Осінь, що відчувається влітку, Вулиця, яка лишається пустою опівночі',
    imageUrl: odunvcanoeImage,
    date: '18 червня 2024',
    price: '750 UAH',
    location: 'Stereo Plaza, Київ',
    time: '20:00',
    availableTickets: 300
  },
  '5': {
    id: '5',
    title: 'Symphony Night',
    description: 'Ніч симфонічної музики під зірками. Класичні шедеври у виконанні найкращих музикантів України.',
    imageUrl: fankonImage,
    date: '5 квітня 2024',
    price: '500 UAH',
    location: 'Національна Філармонія України, Київ',
    time: '19:30',
    availableTickets: 250
  },
  '6': {
    id: '6',
    title: 'Acoustic Evening',
    description: 'Затишний вечір акустичної музики. Живе виконання, душевна атмосфера та незабутні емоції.',
    imageUrl: palindromImage,
    date: '20 травня 2024',
    price: '450 UAH',
    location: 'Caribbean Club, Київ',
    time: '20:00',
    availableTickets: 180
  }
};

const EventDetails: React.FC = () => {
  const { id } = useParams();
  const event = id && (id in eventData) ? eventData[id as EventId] : null;
  const [ticketCount, setTicketCount] = useState(1);

  const totalPrice = useMemo(() => {
    if (!event) return '0 UAH';
    const priceNumber = parseInt(event.price.split(' ')[0]);
    return `${priceNumber * ticketCount} UAH`;
  }, [event, ticketCount]);

  if (!event) {
    return <div className="event-details">Event not found</div>;
  }

  const handleAddToCart = () => {
    // Cart logic would go here
    console.log('Adding to cart:', { eventId: id, quantity: ticketCount });
  };

  const handleTicketCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTicketCount(Number(e.target.value));
  };

  return (
    <div className="event-details">
      <div className="event-details-content">
        <img src={event.imageUrl} alt={event.title} className="event-image" />
        <h1>{event.title}</h1>
        <div className="event-info">
          <div className="info-row">
            <span className="label">Дата:</span>
            <span className="value">{event.date}</span>
          </div>
          <div className="info-row">
            <span className="label">Час:</span>
            <span className="value">{event.time}</span>
          </div>
          <div className="info-row">
            <span className="label">Місце проведення:</span>
            <span className="value">{event.location}</span>
          </div>
          <div className="info-row">
            <span className="label">Доступно квитків:</span>
            <span className="value">{event.availableTickets}</span>
          </div>
        </div>
        <p className="description">{event.description}</p>
        <div className="event-footer">
          <div className="price-info">
            <span className="price-label">Ціна за квиток:</span>
            <span className="price-per-ticket">{event.price}</span>
            {ticketCount > 1 && (
              <span className="total-price">
                Загальна сума: {totalPrice}
              </span>
            )}
          </div>
          <div className="purchase-controls">
            <select 
              value={ticketCount} 
              onChange={handleTicketCountChange}
              className="ticket-count-select"
            >
              {[...Array(Math.min(10, event.availableTickets))].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} {i === 0 ? 'квиток' : i < 4 ? 'квитки' : 'квитків'}
                </option>
              ))}
            </select>
            <Button 
              variant="contained" 
              className="buy-button"
              onClick={handleAddToCart}
            >
              Додати в кошик
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails; 