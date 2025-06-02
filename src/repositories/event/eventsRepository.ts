import api from "../../shared/api"
import { urls } from "../../shared/urls";
import { PaginatedRequest } from "../../shared/models/api/pagination/PaginatedRequest";
import { SearchEventsRequest } from "./SearchEventsRequest";
import { Event } from "./Event";

export const eventRepository = {
    searchEvents: async (request: PaginatedRequest<SearchEventsRequest>) => {
        return await api.getPaginated<Event>(urls.searchEvents, request);
    }
}