export const urls = {
    // Auth
    register: '/users/register',
    login: '/users/login',
    // Users
    getCurrentUser: '/users/me',
    // Cities
    getAllCities: '/cities/all',
    // Events
    searchEvents: '/events/search',
    getEventById: (id: string) => `/events/${id}`,
    // Orders
    createOrder: '/orders/create',
} as const; 