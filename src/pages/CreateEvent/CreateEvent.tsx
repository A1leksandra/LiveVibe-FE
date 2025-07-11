import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventRepository } from '../../repositories/event/eventsRepository';
import { organizerRepository } from '../../repositories/organizer/organizerRepository';
import { categoryRepository } from '../../repositories/category/categoryRepository';
import { cityRepository } from '../../repositories/city/cityRepository';
import { eventSeatTypeRepository } from '../../repositories/eventSeatType/eventSeatTypeRepository';
import { Organizer } from '../../repositories/organizer/Organizer';
import { Category } from '../../repositories/category/Category';
import { City } from '../../repositories/city/City';
import CustomSelect from '../../components/CustomSelect/CustomSelect';
import './CreateEvent.css';

interface SeatType {
  id?: string;
  name: string;
  price: number;
  capacity: number;
  availableSeats?: number;
  isEditing?: boolean;
}

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form data
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [time, setTime] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('12:00');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const calendarRef = useRef<HTMLDivElement>(null);
  const dateButtonRef = useRef<HTMLButtonElement>(null);
  const timeDropdownRef = useRef<HTMLDivElement>(null);
  const timeButtonRef = useRef<HTMLButtonElement>(null);
  const [organizerId, setOrganizerId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [cityId, setCityId] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [seatTypes, setSeatTypes] = useState<SeatType[]>([]);
  const [newSeatType, setNewSeatType] = useState<SeatType>({
    name: '',
    price: 0,
    capacity: 0,
    availableSeats: 0
  });

  // Dropdown data
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        // Fetch organizers
        const organizersResponse = await organizerRepository.getAllOrganizers({
          pageNumber: 1,
          pageSize: 100,
          request: undefined
        });
        if (organizersResponse.isSuccess && organizersResponse.data) {
          setOrganizers(organizersResponse.data.items);
        }

        // Fetch categories
        const categoriesResponse = await categoryRepository.getAllCategories();
        if (categoriesResponse.isSuccess && categoriesResponse.data) {
          setCategories(categoriesResponse.data);
        }

        // Fetch cities
        const citiesResponse = await cityRepository.getAllCitiesFull();
        if (citiesResponse.isSuccess && citiesResponse.data) {
          setCities(citiesResponse.data);
        }
      } catch (error) {
        console.error('Failed to fetch dropdown data:', error);
        setError('Помилка завантаження даних');
      }
    };

    fetchDropdownData();
  }, []);

  // Cleanup preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Handle click outside calendar and time picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        dateButtonRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        !dateButtonRef.current.contains(event.target as Node)
      ) {
        setIsDatePickerOpen(false);
      }

      if (
        timeDropdownRef.current &&
        timeButtonRef.current &&
        !timeDropdownRef.current.contains(event.target as Node) &&
        !timeButtonRef.current.contains(event.target as Node)
      ) {
        setIsTimePickerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Calendar functions
  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const days: Date[] = [];
    
    const firstDay = firstDayOfMonth.getDay();
    
    for (let i = 0; i < firstDay; i++) {
      days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), -firstDay + i + 1));
    }
    
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

  const isSelectedDate = (date: Date) => {
    return selectedDate &&
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear();
  };

  const isOtherMonth = (date: Date) => {
    return date.getMonth() !== currentMonth.getMonth();
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setIsDatePickerOpen(false);
  };

  const formatSelectedDate = () => {
    if (!selectedDate) return 'Виберіть дату';
    return new Intl.DateTimeFormat('uk-UA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(selectedDate);
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(timeString);
      }
    }
    return times;
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setIsTimePickerOpen(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Будь ласка, виберіть зображення формату JPG, PNG, GIF або WebP');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Розмір файлу не повинен перевищувати 5MB');
        return;
      }

      setSelectedImage(file);
      setError('');

      // Create preview
      const preview = URL.createObjectURL(file);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(preview);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddSeatType = () => {
    if (!newSeatType.name || newSeatType.price <= 0 || newSeatType.capacity <= 0) {
      setError('Будь ласка, заповніть усі поля типу місць коректно');
      return;
    }

    setSeatTypes([...seatTypes, { ...newSeatType }]);
    setNewSeatType({ name: '', price: 0, capacity: 0, availableSeats: 0 });
    setError('');
  };

  const handleEditSeatType = (index: number) => {
    const updatedSeatTypes = [...seatTypes];
    updatedSeatTypes[index] = { ...updatedSeatTypes[index], isEditing: true };
    setSeatTypes(updatedSeatTypes);
  };

  const handleUpdateSeatType = async (index: number) => {
    const seatType = seatTypes[index];
    if (!seatType.name || seatType.price <= 0 || seatType.capacity <= 0) {
      setError('Будь ласка, заповніть усі поля типу місць коректно');
      return;
    }

    const updatedSeatTypes = [...seatTypes];
    updatedSeatTypes[index] = { ...seatType, isEditing: false };
    setSeatTypes(updatedSeatTypes);
    setError('');
  };

  const handleRemoveSeatType = (index: number) => {
    setSeatTypes(seatTypes.filter((_, i) => i !== index));
  };

  const handleSeatTypeChange = (index: number, field: keyof SeatType, value: string | number) => {
    const updatedSeatTypes = [...seatTypes];
    updatedSeatTypes[index] = { 
      ...updatedSeatTypes[index], 
      [field]: field === 'name' ? value : Number(value)
    };
    setSeatTypes(updatedSeatTypes);
  };

  const handleNewSeatTypeChange = (field: keyof SeatType, value: string | number) => {
    setNewSeatType({ 
      ...newSeatType, 
      [field]: field === 'name' ? value : Number(value)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // First create the event
      const eventResponse = await eventRepository.create({
        title,
        description,
        organizerId,
        categoryId,
        location,
        cityId,
        time: selectedDate && selectedTime ? 
          new Date(`${selectedDate.toISOString().split('T')[0]}T${selectedTime}:00.000Z`).toISOString() : 
          new Date().toISOString()
      });

      if (!eventResponse.isSuccess || !eventResponse.data) {
        setError(eventResponse.error?.message || 'Помилка створення події');
        return;
      }

      const eventId = eventResponse.data.id;

      // Then upload the image if selected
      if (selectedImage) {
        const uploadResponse = await eventRepository.uploadPhoto(eventId, selectedImage);
        if (!uploadResponse.isSuccess) {
          console.error('Failed to upload image:', uploadResponse.error);
        }
      }

      // Finally create all seat types
      const seatTypePromises = seatTypes.map(seatType => 
        eventSeatTypeRepository.create({
          eventId,
          name: seatType.name,
          price: seatType.price,
          capacity: seatType.capacity,
          availableSeats: seatType.capacity // Initially, available seats equals capacity
        })
      );

      const seatTypeResults = await Promise.all(seatTypePromises);
      
      // Check if any seat type creation failed
      const failedSeatTypes = seatTypeResults.filter(result => !result.isSuccess);
      if (failedSeatTypes.length > 0) {
        console.error('Some seat types failed to create:', failedSeatTypes);
        // Continue anyway since the event was created
      }

      // Navigate to the events page with filters
      navigate('/events');
    } catch (error) {
      console.error('Failed to create event:', error);
      setError('Виникла несподівана помилка');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-event-page">
      <div className="create-event-container">
        <h1>Створити нову подію</h1>
        
        <form onSubmit={handleSubmit} className="create-event-form">
          <div className="form-section">
            <h2>Основна інформація</h2>
            <div className="form-group">
              <label htmlFor="title">Назва події</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Введіть назву події"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Опис</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Введіть опис події"
                required
              />
            </div>

            <div className="form-group">
              <label>Зображення події</label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/jpeg,image/png,image/gif,image/webp"
                style={{ display: 'none' }}
              />
              <div 
                className={`image-upload-area ${previewUrl ? 'has-image' : ''}`}
                onClick={handleImageClick}
              >
                {previewUrl ? (
                  <>
                    <img src={previewUrl} alt="Preview" className="image-preview" />
                    <button
                      type="button"
                      className="remove-image-button"
                      onClick={handleRemoveImage}
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <div className="upload-placeholder">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7" strokeWidth="2" strokeLinecap="round"/>
                      <polyline points="17 8 12 3 7 8" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="12" y1="3" x2="12" y2="15" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span>Натисніть, щоб завантажити зображення</span>
                    <span className="upload-hint">JPG, PNG, GIF або WebP, до 5MB</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Категорія та організатор</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Категорія</label>
                <CustomSelect
                  options={categories.map(category => ({ value: category.id, label: category.name }))}
                  value={categoryId}
                  onChange={setCategoryId}
                  placeholder="Виберіть категорію"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="organizer">Організатор</label>
                <CustomSelect
                  options={organizers.map(organizer => ({ value: organizer.id, label: organizer.name }))}
                  value={organizerId}
                  onChange={setOrganizerId}
                  placeholder="Виберіть організатора"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Місце та час</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">Місто</label>
                <CustomSelect
                  options={cities.map(city => ({ value: city.id, label: city.name }))}
                  value={cityId}
                  onChange={setCityId}
                  placeholder="Виберіть місто"
                  required
                />
              </div>

              <div className="form-group">
                <label>Дата та час</label>
                <div className="datetime-container">
                  <div className="date-picker-wrapper">
                    <button 
                      ref={dateButtonRef}
                      type="button"
                      className="date-picker-button"
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
                      {formatSelectedDate()}
                    </button>
                    {isDatePickerOpen && (
                      <div ref={calendarRef} className="date-picker-container">
                        <div className="calendar">
                          <div className="calendar-header">
                            <div className="month-navigation">
                              <button type="button" className="month-nav-btn" onClick={goToPreviousMonth}>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                  <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </button>
                              <span className="current-month">
                                {new Intl.DateTimeFormat('uk-UA', { month: 'long', year: 'numeric' }).format(currentMonth)}
                              </span>
                              <button type="button" className="month-nav-btn" onClick={goToNextMonth}>
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
                                type="button"
                                className={`calendar-day 
                                  ${isToday(date) ? 'today' : ''} 
                                  ${isSelectedDate(date) ? 'selected' : ''} 
                                  ${isOtherMonth(date) ? 'other-month' : ''}`}
                                onClick={() => handleDateSelect(date)}
                              >
                                {date.getDate()}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="time-picker-wrapper">
                    <button
                      ref={timeButtonRef}
                      type="button"
                      className="time-picker-button"
                      onClick={() => setIsTimePickerOpen(!isTimePickerOpen)}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="time-icon"
                      >
                        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M8 4v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {selectedTime}
                    </button>
                    {isTimePickerOpen && (
                      <div ref={timeDropdownRef} className="time-dropdown-container">
                        <div className="time-dropdown">
                          {generateTimeOptions().map((time) => (
                            <button
                              key={time}
                              type="button"
                              className={`time-option ${selectedTime === time ? 'selected' : ''}`}
                              onClick={() => handleTimeSelect(time)}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="location">Місце проведення</label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Введіть місце проведення"
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Типи місць</h2>
            
            {/* Existing Seat Types */}
            {seatTypes.map((seatType, index) => (
              <div key={index} className="seat-type-item">
                {seatType.isEditing ? (
                  <>
                    <div className="seat-type-fields">
                      <input
                        type="text"
                        value={seatType.name}
                        onChange={(e) => handleSeatTypeChange(index, 'name', e.target.value)}
                        placeholder="Назва"
                        required
                      />
                      <input
                        type="number"
                        value={seatType.price}
                        onChange={(e) => handleSeatTypeChange(index, 'price', e.target.value)}
                        placeholder="Ціна"
                        min="0"
                        required
                      />
                      <input
                        type="number"
                        value={seatType.capacity}
                        onChange={(e) => handleSeatTypeChange(index, 'capacity', e.target.value)}
                        placeholder="Кількість місць"
                        min="0"
                        required
                      />
                    </div>
                    <div className="seat-type-actions">
                      <button
                        type="button"
                        className="save-button"
                        onClick={() => handleUpdateSeatType(index)}
                      >
                        Зберегти
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="seat-type-info">
                      <span className="seat-type-name">{seatType.name}</span>
                      <span className="seat-type-price">{seatType.price} UAH</span>
                      <span className="seat-type-quantity">{seatType.capacity} місць</span>
                    </div>
                    <div className="seat-type-actions">
                      <button
                        type="button"
                        className="edit-button"
                        onClick={() => handleEditSeatType(index)}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11.333 2.00004C11.5081 1.82494 11.716 1.68605 11.9447 1.59129C12.1735 1.49653 12.4187 1.44775 12.6663 1.44775C12.914 1.44775 13.1592 1.49653 13.3879 1.59129C13.6167 1.68605 13.8246 1.82494 13.9997 2.00004C14.1748 2.17513 14.3137 2.383 14.4084 2.61178C14.5032 2.84055 14.552 3.08575 14.552 3.33337C14.552 3.58099 14.5032 3.82619 14.4084 4.05497C14.3137 4.28374 14.1748 4.49161 13.9997 4.66671L4.99967 13.6667L1.33301 14.6667L2.33301 11L11.333 2.00004Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Редагувати
                      </button>
                      <button
                        type="button"
                        className="remove-button"
                        onClick={() => handleRemoveSeatType(index)}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 4H3.33333H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M5.33301 4V2.66667C5.33301 2.31305 5.47348 1.97391 5.72353 1.72386C5.97358 1.47381 6.31272 1.33334 6.66634 1.33334H9.33301C9.68663 1.33334 10.0258 1.47381 10.2758 1.72386C10.5259 1.97391 10.6663 2.31305 10.6663 2.66667V4M12.6663 4V13.3333C12.6663 13.687 12.5259 14.0261 12.2758 14.2762C12.0258 14.5262 11.6866 14.6667 11.333 14.6667H4.66634C4.31272 14.6667 3.97358 14.5262 3.72353 14.2762C3.47348 14.0261 3.33301 13.687 3.33301 13.3333V4H12.6663Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Видалити
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}

            {/* Add New Seat Type */}
            <div className="add-seat-type-container">
              <div className="add-seat-type">
                <input
                  type="text"
                  value={newSeatType.name}
                  onChange={(e) => handleNewSeatTypeChange('name', e.target.value)}
                  placeholder="Назва"
                />
                <input
                  type="number"
                  value={newSeatType.price || ''}
                  onChange={(e) => handleNewSeatTypeChange('price', e.target.value)}
                  placeholder="Ціна"
                  min="0"
                />
                <input
                  type="number"
                  value={newSeatType.capacity || ''}
                  onChange={(e) => handleNewSeatTypeChange('capacity', e.target.value)}
                  placeholder="Кількість місць"
                  min="0"
                />
              </div>
              <button
                type="button"
                className="add-button"
                onClick={handleAddSeatType}
              >
                Додати тип місць
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => navigate('/events')}
            >
              Скасувати
            </button>
            <button 
              type="submit" 
              className="submit-button" 
              disabled={isLoading}
            >
              {isLoading ? 'Створення...' : 'Створити подію'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent; 