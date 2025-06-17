export const urls = {
    // Auth
    register: '/users/register',
    login: '/users/login',
    // Cities
    getAllCities: '/cities/all',
    // Events
    searchEvents: '/events/search',
    getEventById: (id: string) => `/events/${id}`,
} as const; 