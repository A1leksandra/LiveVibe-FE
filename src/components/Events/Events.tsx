import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import EventsGrid from '../EventsGrid/EventsGrid';
import { eventRepository } from '../../repositories/event/eventsRepository';
import { cityRepository } from '../../repositories/city/cityRepository';
import { Event } from '../../repositories/event/Event';
import { SearchEventsRequest } from '../../repositories/event/SearchEventsRequest';
import { getImageUrl } from '../../shared/utils/imageUtils';
import './Events.css';

const Events: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isSelectingEndDate, setIsSelectingEndDate] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [cities, setCities] = useState<string[]>([]);
  const [isCitiesLoading, setIsCitiesLoading] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const cityButtonRef = useRef<HTMLButtonElement>(null);

  const categories = [
    { label: 'Концерти', value: 'Концерт' },
    { label: 'Фестивалі', value: 'Фестиваль' },
    { label: 'Театр', value: 'Вистава' }
  ];

  useEffect(() => {
    const fetchCities = async () => {
      setIsCitiesLoading(true);
      try {
        const response = await cityRepository.getAllCities();
        if (response.isSuccess && response.data) {
          setCities(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch cities:', error);
      } finally {
        setIsCitiesLoading(false);
      }
    };

    fetchCities();
  }, []);

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

      if (
        cityDropdownRef.current &&
        cityButtonRef.current &&
        !cityDropdownRef.current.contains(event.target as Node) &&
        !cityButtonRef.current.contains(event.target as Node)
      ) {
        setIsCityDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatDateForApi = (date: Date) => {
    return date.toISOString().split('T')[0] + 'T00:00:00.000Z';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('uk-UA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  // Check for search term in URL params on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
      setSearchTerm(searchParam);
    } else {
      // Clear search term when no search parameter exists
      setSearchTerm('');
    }
  }, [location.search]);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const request: SearchEventsRequest = {
        Title: searchTerm,
        Category: selectedCategory,
        City: selectedCity,
        DateFrom: '',
        DateTo: ''
      };

      if (startDate) {
        request.DateFrom = formatDateForApi(startDate);
        console.log('Start date for API:', request.DateFrom);
      }

      if (endDate) {
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        request.DateTo = endOfDay.toISOString();
        console.log('End date for API:', request.DateTo);
      }

      console.log('Fetching events with filters:', request);

      const response = await eventRepository.searchEvents({
        page: 1,
        pageSize: 10,
        request
      });

      if (response.isSuccess && response.data) {
        console.log('Received events:', response.data.items.length);
        setEvents(response.data.items);
      } else {
        console.log('API Error:', response.error);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedCategory, selectedCity, startDate, endDate]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleCategoryClick = (category: string) => {
    const newCategory = selectedCategory === category ? '' : category;
    console.log('Category clicked:', category, 'Current selected:', selectedCategory, 'New category:', newCategory);
    setSelectedCategory(newCategory);
  };

  const handleCitySelect = (city: string) => {
    const newCity = selectedCity === city ? '' : city;
    console.log('City selected:', city, 'Current selected:', selectedCity, 'New city:', newCity);
    setSelectedCity(newCity);
    setIsCityDropdownOpen(false);
  };

  const handleDateSelect = (date: Date) => {
    console.log('Date selected:', date);
    
    if (!startDate) {
      // First click - select start date
      console.log('Setting start date:', date);
      setStartDate(date);
      setEndDate(null);
      setIsSelectingEndDate(true);
    } else if (!endDate || !isSelectingEndDate) {
      // Second click - select end date
      if (date >= startDate) {
        console.log('Setting end date:', date);
        setEndDate(date);
        setIsDatePickerOpen(false);
        setIsSelectingEndDate(false);
      } else {
        // If end date is before start date, make it the new start date
        console.log('End date before start, resetting with new start date:', date);
        setStartDate(date);
        setEndDate(null);
        setIsSelectingEndDate(true);
      }
    } else {
      // Third click or reset - start over
      console.log('Resetting dates, new start date:', date);
      setStartDate(date);
      setEndDate(null);
      setIsSelectingEndDate(true);
    }
  };

  const clearDates = () => {
    setStartDate(null);
    setEndDate(null);
    setIsSelectingEndDate(false);
  };

  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const days: Date[] = [];
    
    // Get the first day of the week for the first day of the month
    const firstDay = firstDayOfMonth.getDay();
    
    // Add empty days for padding (previous month)
    for (let i = 0; i < firstDay; i++) {
      days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), -firstDay + i + 1));
    }
    
    // Add all days of the current month
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
    }
    
    return days;
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const isInRange = (date: Date) => {
    if (!startDate || !endDate) return false;
    return date >= startDate && date <= endDate;
  };

  const isStartDate = (date: Date) => {
    return startDate &&
      date.getDate() === startDate.getDate() &&
      date.getMonth() === startDate.getMonth() &&
      date.getFullYear() === startDate.getFullYear();
  };

  const isEndDate = (date: Date) => {
    return endDate &&
      date.getDate() === endDate.getDate() &&
      date.getMonth() === endDate.getMonth() &&
      date.getFullYear() === endDate.getFullYear();
  };

  const isOtherMonth = (date: Date) => {
    return date.getMonth() !== currentMonth.getMonth();
  };

  const getDateButtonText = () => {
    if (!startDate) return 'Обрати період';
    if (!endDate) return `З ${formatDate(startDate)}`;
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const getCityButtonText = () => {
    return selectedCity || 'Оберіть місто';
  };

  const handleEventClick = (eventId: string) => {
    navigate(`/event/${eventId}`);
  };

  if (isLoading) {
    return <div className="events-page">Loading...</div>;
  }

  return (
    <div className="events-page">
      {/* Filter Buttons */}
      <div className="filter-buttons">
        {categories.map(category => (
          <button
            key={category.value}
            className={`filter-button ${selectedCategory === category.value ? 'selected' : ''}`}
            onClick={() => handleCategoryClick(category.value)}
          >
            {category.label}
          </button>
        ))}
        
        {/* City Filter */}
        <div className="city-filter-container">
          <button 
            ref={cityButtonRef}
            className={`filter-button city-button ${selectedCity ? 'selected' : ''}`}
            onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 16 16" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="city-icon"
            >
              <path 
                d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            {getCityButtonText()}
          </button>
          {isCityDropdownOpen && (
            <div ref={cityDropdownRef} className="city-dropdown-container">
              <div className="city-dropdown">
                {isCitiesLoading ? (
                  <div className="city-option loading">Завантаження...</div>
                ) : (
                  cities.map((city) => (
                    <button
                      key={city}
                      className={`city-option ${selectedCity === city ? 'selected' : ''}`}
                      onClick={() => handleCitySelect(city)}
                    >
                      {city}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Date Filter */}
        <div className="date-filter-container">
          <button 
            ref={buttonRef}
            className="filter-button date-button" 
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
            {getDateButtonText()}
          </button>
          {(startDate || endDate) && (
            <button 
              className="clear-dates-btn"
              onClick={clearDates}
              title="Очистити дати"
            >
              ×
            </button>
          )}
          {isDatePickerOpen && (
            <div ref={calendarRef} className="date-picker-container">
              <div className="calendar">
                <div className="calendar-header">
                  <div className="selection-info">
                    {!startDate && 'Оберіть початкову дату'}
                    {startDate && !endDate && 'Оберіть кінцеву дату'}
                    {startDate && endDate && 'Період обрано'}
                  </div>
                  <div className="month-navigation">
                    <button className="month-nav-btn" onClick={goToPreviousMonth}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <span className="current-month">
                      {new Intl.DateTimeFormat('uk-UA', { month: 'long', year: 'numeric' }).format(currentMonth)}
                    </span>
                    <button className="month-nav-btn" onClick={goToNextMonth}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
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
                      className={`calendar-day 
                        ${isToday(date) ? 'today' : ''} 
                        ${isStartDate(date) || isEndDate(date) ? 'selected' : ''} 
                        ${isInRange(date) && !isStartDate(date) && !isEndDate(date) ? 'in-range' : ''}
                        ${isOtherMonth(date) ? 'other-month' : ''}`}
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