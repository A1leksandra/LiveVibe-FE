import React, { useState, useRef, useEffect } from 'react';
import './CategoryButtons.css';

const CategoryButtons: React.FC = () => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        buttonRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDatePickerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('uk-UA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setIsDatePickerOpen(false);
  };

  const generateCalendarDays = () => {
    const today = new Date();
    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const days: Date[] = [];
    
    // Get the first day of the month
    const firstDay = currentMonth.getDay();
    
    // Add empty days for padding
    for (let i = 0; i < firstDay; i++) {
      days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), -firstDay + i + 1));
    }
    
    // Add all days of the current month
    while (currentMonth.getMonth() === today.getMonth()) {
      days.push(new Date(currentMonth.getTime()));
      currentMonth.setDate(currentMonth.getDate() + 1);
    }
    
    return days;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date: Date) => {
    return selectedDate &&
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear();
  };

  return (
    <div className="category-buttons">
      <button className="category-button">Концерти</button>
      <button className="category-button">Фестивалі</button>
      <button className="category-button">Театр</button>
      <div className="calendar-button-container">
        <button 
          ref={buttonRef}
          className="category-button calendar-button" 
          onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="calendar-icon"
          >
            <path 
              d="M12.6667 2.66667H3.33333C2.59695 2.66667 2 3.26362 2 4V13.3333C2 14.0697 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0697 14 13.3333V4C14 3.26362 13.403 2.66667 12.6667 2.66667Z" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M2 6.66667H14" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M5.33333 1.33333V4" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M10.6667 1.33333V4" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          {selectedDate ? formatDate(selectedDate) : 'Обрати дату'}
        </button>
        {isDatePickerOpen && (
          <div ref={calendarRef} className="date-picker-container">
            <div className="calendar">
              <div className="calendar-header">
                {new Intl.DateTimeFormat('uk-UA', { month: 'long', year: 'numeric' }).format(new Date())}
              </div>
              <div className="calendar-weekdays">
                {['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'].map(day => (
                  <div key={day} className="weekday">{day}</div>
                ))}
              </div>
              <div className="calendar-days">
                {generateCalendarDays().map((date, index) => (
                  <button
                    key={index}
                    className={`calendar-day ${isToday(date) ? 'today' : ''} ${
                      isSelected(date) ? 'selected' : ''
                    } ${date.getMonth() !== new Date().getMonth() ? 'other-month' : ''}`}
                    onClick={() => handleDateSelect(date)}
                    disabled={date < new Date(new Date().setHours(0, 0, 0, 0))}
                  >
                    {date.getDate()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryButtons; 