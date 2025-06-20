import api from "../../shared/api"
import { urls } from "../../shared/urls";
import { PaginatedRequest } from "../../shared/models/api/pagination/PaginatedRequest";
import { SearchEventsRequest } from "./SearchEventsRequest";
import { Event } from "./Event";
import { EventDetails } from "./EventDetails";
import { CreateEventRequest, UpdateEventRequest } from "./EventRequests";
import { UploadPhotoSuccessDTO } from "./UploadPhotoSuccessDTO";

export const eventRepository = {
    searchEvents: async (request: PaginatedRequest<SearchEventsRequest>) => {
        return await api.getPaginated<Event>(urls.searchEvents, request);
    },
    
    getById: async (id: string) => {
        return await api.get<EventDetails>(urls.getEventById(id));
    },

    /**
     * Creates a new event
     * @param request The create event request
     * @returns Promise containing the created event
     */
    create: async (request: CreateEventRequest) => {
        return await api.post<CreateEventRequest, Event>(urls.createEvent, request);
    },

    /**
     * Updates an existing event
     * @param request The update event request
     * @returns Promise containing the updated event
     */
    update: async (request: UpdateEventRequest) => {
        return await api.put<UpdateEventRequest, Event>(urls.updateEvent, request);
    },

    /**
     * Deletes an event
     * @param id The ID of the event to delete
     * @returns Promise containing the success response
     */
    delete: async (id: string) => {
        return await api.delete(urls.deleteEvent(id));
    },

    /**
     * Uploads a photo for an event
     * @param eventId The ID of the event
     * @param file The image file to upload (must be jpg, jpeg, png, gif, or webp, up to 5MB)
     * @returns Promise containing the uploaded photo URL
     */
    uploadPhoto: async (eventId: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        return await api.post<FormData, UploadPhotoSuccessDTO>(
            urls.uploadEventPhoto(eventId),
            formData,
            {
                'Content-Type': 'multipart/form-data'
            }
        );
    }
}