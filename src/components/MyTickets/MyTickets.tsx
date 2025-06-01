import React from 'react';
import './MyTickets.css';

interface Ticket {
  id: string;
  eventName: string;
  date: string;
  location: string;
  price: string;
  status: 'active' | 'used' | 'cancelled';
}

const MyTickets: React.FC = () => {
  // This would typically come from an API or state management
  const tickets: Ticket[] = [
    {
      id: '1',
      eventName: 'Jazz Night at Blue Note',
      date: '15 березня 2024, 19:00',
      location: 'Blue Note, Київ',
      price: '550 грн',
      status: 'active'
    },
    {
      id: '2',
      eventName: 'Theater Gala',
      date: '20 березня 2024, 18:30',
      location: 'Театр опери та балету, Львів',
      price: '750 грн',
      status: 'active'
    }
  ];

  const getStatusText = (status: Ticket['status']) => {
    switch (status) {
      case 'active':
        return 'Активний';
      case 'used':
        return 'Використаний';
      case 'cancelled':
        return 'Скасований';
      default:
        return status;
    }
  };

  const getStatusClass = (status: Ticket['status']) => {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'used':
        return 'status-used';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  return (
    <div className="my-tickets">
      <h1>Мої квитки</h1>
      
      <div className="tickets-container">
        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <div key={ticket.id} className="ticket-card">
              <div className="ticket-header">
                <h2>{ticket.eventName}</h2>
                <span className={`ticket-status ${getStatusClass(ticket.status)}`}>
                  {getStatusText(ticket.status)}
                </span>
              </div>
              
              <div className="ticket-details">
                <div className="detail-item">
                  <span className="label">Дата:</span>
                  <span className="value">{ticket.date}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Місце проведення:</span>
                  <span className="value">{ticket.location}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Ціна:</span>
                  <span className="value">{ticket.price}</span>
                </div>
              </div>

              <div className="ticket-actions">
                <button className="download-button">
                  Завантажити квиток
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-tickets">
            <p>У вас поки немає придбаних квитків</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTickets; 