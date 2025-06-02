export interface Event {
    id: string;
    title: string;
    description: string;
    organizer: string;
    category: string;
    location: string;
    city: string;
    time: string;
    imageUrl: string;
    matchedSeatCategoryName: string;
    matchedSeatCategoryPrice: number;
}
