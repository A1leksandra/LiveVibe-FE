import api from "../../shared/api";
import { urls } from "../../shared/urls";
import { TicketDetails } from "./TicketDetails";

export const ticketRepository = {
    /**
     * Fetches all tickets for the currently authenticated user
     * @returns Promise containing array of user's tickets
     */
    getMyTickets: async () => {
        return await api.get<TicketDetails[]>(urls.getMyTickets);
    }
} 