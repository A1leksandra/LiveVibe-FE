import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../Button/Button';
import { eventRepository } from '../../repositories/event/eventsRepository';
import { EventDetails as EventDetailsType, SeatType } from '../../repositories/event/EventDetails';
import { getImageUrl } from '../../shared/utils/imageUtils';
import './EventDetails.css';

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventDetailsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [selectedSeatType, setSelectedSeatType] = useState<string>('');

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) {
        setError('Event ID not provided');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await eventRepository.getById(id);
        
        if (response.isSuccess && response.data) {
          setEvent(response.data);
          // Set the first available seat type as default
          if (response.data.seatTypes.length > 0) {
            setSelectedSeatType(response.data.seatTypes[0].id);
          }
        } else {
          setError(response.error?.message || 'Failed to fetch event details');
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const selectedSeat = useMemo(() => {
    return event?.seatTypes.find(seat => seat.id === selectedSeatType);
  }, [event, selectedSeatType]);

  const totalPrice = useMemo(() => {
    if (!selectedSeat) return 0;
    return selectedSeat.price * ticketCount;
  }, [selectedSeat, ticketCount]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('uk-UA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('uk-UA', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleAddToCart = () => {
    if (!event || !selectedSeat) return;
    
    console.log('Adding to cart:', {
      eventId: event.id,
      eventTitle: event.title,
      seatTypeId: selectedSeat.id,
      seatTypeName: selectedSeat.name,
      quantity: ticketCount,
      pricePerTicket: selectedSeat.price,
      totalPrice: totalPrice
    });
    
    // TODO: Implement actual cart logic
    alert(`Додано до кошика: ${ticketCount} квиток(ів) на ${event.title}`);
  };

  const handleTicketCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTicketCount(Number(e.target.value));
  };

  const handleSeatTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSeatType(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="event-details">
        <div className="loading">Завантаження...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="event-details">
        <div className="error">Помилка: {error}</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="event-details">
        <div className="error">Подія не знайдена</div>
      </div>
    );
  }

  const maxTickets = selectedSeat ? Math.min(10, selectedSeat.availableSeats) : 0;

  return (
    <div className="event-details">
      <div className="event-details-content">
        <img 
          src={getImageUrl(event.imageUrl)} 
          alt={event.title} 
          className="event-image" 
        />
        <h1>{event.title}</h1>
        <div className="event-info">
          <div className="info-row">
            <span className="label">Дата:</span>
            <span className="value">{formatDate(event.time)}</span>
          </div>
          <div className="info-row">
            <span className="label">Час:</span>
            <span className="value">{formatTime(event.time)}</span>
          </div>
          <div className="info-row">
            <span className="label">Місце проведення:</span>
            <span className="value">{event.location}</span>
          </div>
          <div className="info-row">
            <span className="label">Місто:</span>
            <span className="value">{event.city}</span>
          </div>
          <div className="info-row">
            <span className="label">Організатор:</span>
            <span className="value">{event.organizer}</span>
          </div>
          <div className="info-row">
            <span className="label">Категорія:</span>
            <span className="value">{event.category}</span>
          </div>
          {selectedSeat && (
            <div className="info-row">
              <span className="label">Доступно квитків:</span>
              <span className="value">{selectedSeat.availableSeats} з {selectedSeat.capacity}</span>
            </div>
          )}
        </div>
        <p className="description">{event.description}</p>
        
        {event.seatTypes.length > 0 && (
          <div className="seat-types-section">
            <h3>Типи місць</h3>
            <div className="seat-types-grid">
              {event.seatTypes.map((seatType) => (
                <div 
                  key={seatType.id} 
                  className={`seat-type-card ${selectedSeatType === seatType.id ? 'selected' : ''}`}
                  onClick={() => setSelectedSeatType(seatType.id)}
                >
                  <h4>{seatType.name}</h4>
                  <p className="seat-price">{seatType.price} UAH</p>
                  <p className="seat-availability">
                    Доступно: {seatType.availableSeats} з {seatType.capacity}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="event-footer">
          <div className="price-info">
            {selectedSeat && (
              <>
                <span className="price-label">Ціна за квиток:</span>
                <span className="price-per-ticket">{selectedSeat.price} UAH</span>
                {ticketCount > 1 && (
                  <span className="total-price">
                    Загальна сума: {totalPrice} UAH
                  </span>
                )}
              </>
            )}
          </div>
          
          {event.seatTypes.length > 0 && selectedSeat && (
            <div className="purchase-controls">
              <select 
                value={ticketCount} 
                onChange={handleTicketCountChange}
                className="ticket-count-select"
                disabled={maxTickets === 0}
              >
                {maxTickets === 0 ? (
                  <option value={0}>Немає доступних квитків</option>
                ) : (
                  [...Array(maxTickets)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i === 0 ? 'квиток' : i < 4 ? 'квитки' : 'квитків'}
                    </option>
                  ))
                )}
              </select>
              
              <Button 
                variant="contained" 
                className="buy-button"
                onClick={handleAddToCart}
                disabled={maxTickets === 0}
              >
                Додати в кошик
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails; 