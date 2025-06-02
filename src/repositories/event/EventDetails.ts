export interface SeatType {
    id: string;
    name: string;
    availableSeats: number;
    capacity: number;
    price: number;
}

export interface EventDetails {
    id: string;
    title: string;
    description: string;
    organizer: string;
    category: string;
    location: string;
    city: string;
    time: string;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
    seatTypes: SeatType[];
} 