import api from "../../shared/api";
import { urls } from "../../shared/urls";
import { PaginatedRequest } from "../../shared/models/api/pagination/PaginatedRequest";
import { Organizer } from "./Organizer";

export const organizerRepository = {
    /**
     * Fetches all organizers with pagination
     * @param request The paginated request object
     * @returns Promise containing paginated array of organizers
     */
    getAllOrganizers: async (request: PaginatedRequest<void>) => {
        return await api.getPaginated<Organizer>(urls.getAllOrganizers, request);
    }
} 