import api from "../../shared/api";
import { urls } from "../../shared/urls";
import { CreateEventSeatTypeRequest, EventSeatType, UpdateEventSeatTypeRequest } from "./EventSeatType";

export const eventSeatTypeRepository = {
    /**
     * Creates a new event seat type
     * @param request The create event seat type request
     * @returns Promise containing the created event seat type
     */
    create: async (request: CreateEventSeatTypeRequest) => {
        return await api.post<CreateEventSeatTypeRequest, EventSeatType>(urls.createEventSeatType, request);
    },

    /**
     * Updates an existing event seat type
     * @param request The update event seat type request
     * @returns Promise containing the updated event seat type
     */
    update: async (request: UpdateEventSeatTypeRequest) => {
        return await api.put<UpdateEventSeatTypeRequest, EventSeatType>(urls.updateEventSeatType, request);
    },

    /**
     * Deletes an event seat type
     * @param id The ID of the event seat type to delete
     * @returns Promise containing the success response
     */
    delete: async (id: string) => {
        return await api.delete(urls.deleteEventSeatType(id));
    }
} 