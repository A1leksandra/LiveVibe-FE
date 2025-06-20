export interface EventSeatType {
    id: string;
    eventId: string;
    name: string;
    capacity: number;
    availableSeats: number;
    price: number;
}

export interface CreateEventSeatTypeRequest {
    eventId: string;
    name: string;
    capacity: number;
    availableSeats: number;
    price: number;
}

export interface UpdateEventSeatTypeRequest {
    id: string;
    eventId: string;
    name: string;
    capacity: number;
    availableSeats: number;
    price: number;
} 