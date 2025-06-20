import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../Card/Card';
import Button from '../Button/Button';
import { isUserAdmin } from '../../shared/utils/authUtils';
import { eventRepository } from '../../repositories/event/eventsRepository';
import './EventCard.css';

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date?: string;
  price: string;
  onDelete?: () => void;
}

// Wrapper component to handle button clicks
const ActionButton: React.FC<{
  onClick: () => void;
  className?: string;
  variant: "outlined" | "contained";
  disabled?: boolean;
  children: React.ReactNode;
}> = ({ onClick, className, variant, disabled, children }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <Button
      variant={variant}
      className={className}
      onClick={handleClick as () => void}
      disabled={disabled}
    >
      {children}
    </Button>
  );
};

const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  description,
  imageUrl,
  date,
  price,
  onDelete
}) => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const checkAdminStatus = () => {
      setIsAdmin(isUserAdmin());
    };

    // Check initially
    checkAdminStatus();

    // Listen for auth changes
    window.addEventListener('authChange', checkAdminStatus);
    window.addEventListener('storage', (e) => {
      if (e.key === 'authToken' || e.key === 'isAdmin') {
        checkAdminStatus();
      }
    });

    return () => {
      window.removeEventListener('authChange', checkAdminStatus);
      window.removeEventListener('storage', checkAdminStatus);
    };
  }, []);

  const handleClick = () => {
    navigate(`/event/${id}`);
  };

  const handleEdit = () => {
    navigate(`/event/edit/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Ви впевнені, що хочете видалити цю подію?')) {
      setIsDeleting(true);
      try {
        const response = await eventRepository.delete(id);
        if (response.isSuccess) {
          onDelete?.();
        } else {
          alert('Помилка при видаленні події');
        }
      } catch (error) {
        console.error('Failed to delete event:', error);
        alert('Помилка при видаленні події');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <Card className="event-card" onClick={handleClick}>
      <img src={imageUrl} alt={title} className="event-image" />
      <div className="event-content">
        <h3>{title}</h3>
        {date && <p className="date">{date}</p>}
        {description && <p className="description">{description}</p>}
        <div className="event-footer">
          <span className="price">{price}</span>
          {isAdmin ? (
            <div className="admin-actions">
              <ActionButton 
                variant="outlined"
                className="edit-button"
                onClick={handleEdit}
                disabled={isDeleting}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.333 2.00004C11.5081 1.82494 11.716 1.68605 11.9447 1.59129C12.1735 1.49653 12.4187 1.44775 12.6663 1.44775C12.914 1.44775 13.1592 1.49653 13.3879 1.59129C13.6167 1.68605 13.8246 1.82494 13.9997 2.00004C14.1748 2.17513 14.3137 2.383 14.4084 2.61178C14.5032 2.84055 14.552 3.08575 14.552 3.33337C14.552 3.58099 14.5032 3.82619 14.4084 4.05497C14.3137 4.28374 14.1748 4.49161 13.9997 4.66671L4.99967 13.6667L1.33301 14.6667L2.33301 11L11.333 2.00004Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Редагувати
              </ActionButton>
              <ActionButton 
                variant="outlined"
                className="delete-button"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 4H3.33333H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5.33301 4V2.66667C5.33301 2.31305 5.47348 1.97391 5.72353 1.72386C5.97358 1.47381 6.31272 1.33334 6.66634 1.33334H9.33301C9.68663 1.33334 10.0258 1.47381 10.2758 1.72386C10.5259 1.97391 10.6663 2.31305 10.6663 2.66667V4M12.6663 4V13.3333C12.6663 13.687 12.5259 14.0261 12.2758 14.2762C12.0258 14.5262 11.6866 14.6667 11.333 14.6667H4.66634C4.31272 14.6667 3.97358 14.5262 3.72353 14.2762C3.47348 14.0261 3.33301 13.687 3.33301 13.3333V4H12.6663Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {isDeleting ? 'Видалення...' : 'Видалити'}
              </ActionButton>
            </div>
          ) : (
            <ActionButton 
            variant="contained" 
            className="event-button"
              onClick={handleClick}
          >
              Купити
            </ActionButton>
          )}
        </div>
      </div>
    </Card>
  );
};

export default EventCard; 