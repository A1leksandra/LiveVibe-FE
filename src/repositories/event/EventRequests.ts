export interface CreateEventRequest {
    title: string;
    description: string;
    organizerId: string;
    categoryId: string;
    location: string;
    cityId: string;
    time: string;
}

export interface UpdateEventRequest {
    id: string;
    title: string;
    description: string;
    organizerId: string;
    categoryId: string;
    location: string;
    cityId: string;
    time: string;
} 