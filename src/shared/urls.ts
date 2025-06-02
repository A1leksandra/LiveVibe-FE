export const urls = {
    // Auth
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    // Cities
    getAllCities: '/cities/all',
    // Events
    searchEvents: '/events/search',
    getEventById: (id: string) => `/events/${id}`,
} as const; 