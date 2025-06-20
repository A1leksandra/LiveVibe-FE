export const urls = {
    // Auth
    register: '/users/register',
    login: '/users/login',
    // Users
    getCurrentUser: '/users/me',
    getMyTickets: '/users/my-tickets',
    getAllUsers: '/users/all',
    getUserById: (id: string) => `/users/${id}`,
    // Cities
    getAllCities: '/cities/all',
    getAllCitiesFull: '/cities/all/full',
    // Events
    searchEvents: '/events/search',
    getEventById: (id: string) => `/events/${id}`,
    createEvent: '/events/create',
    updateEvent: '/events/update',
    deleteEvent: (id: string) => `/events/delete/${id}`,
    uploadEventPhoto: (eventId: string) => `/events/upload-photo/${eventId}`,
    // Orders
    createOrder: '/orders/create',
    // Organizers
    getAllOrganizers: '/organizers/all',
    // Categories
    getAllCategories: '/event-categories/all/full',
    // Event Seat Types
    createEventSeatType: '/event-seat-types/create',
    updateEventSeatType: '/event-seat-types/update',
    deleteEventSeatType: (id: string) => `/event-seat-types/delete/${id}`,
} as const; 