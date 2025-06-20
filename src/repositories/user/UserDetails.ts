export interface Ticket {
    id: string;
    eventId: string;
    eventName: string;
    seatTypeId: string;
    seat: string;
    orderId: string;
    userId: string;
    qrCodeUrl: string;
    createdAt: string;
}

export interface Order {
    id: string;
    userId: string;
    status: string;
    firstname: string;
    lastname: string;
    email: string;
    createdAt: string;
    tickets: Ticket[];
}

export interface UserDetails {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export interface UserDetailsWithOrders extends UserDetails {
    orders: Order[];
} 