export const urls = {
    // Auth
    register: '/api/users/register',
    login: '/api/users/login',
    // Cities
    getAllCities: '/cities/all',
    // Events
    searchEvents: '/events/search',
    getEventById: (id: string) => `/events/${id}`,
} as const; 