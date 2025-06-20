import api from "../../shared/api";
import { urls } from "../../shared/urls";
import { UserDetails, UserDetailsWithOrders } from "./UserDetails";
import { PaginatedRequest } from "../../shared/models/api/pagination/PaginatedRequest";

export const userRepository = {
    /**
     * Fetches the current user's details using the stored auth token
     * @returns ApiResponse containing the user details if successful
     */
    me: async () => {
        return await api.get<UserDetails>(urls.getCurrentUser);
    },

    /**
     * Fetches all users with pagination
     * @param request The paginated request parameters
     * @returns Promise containing paginated array of users
     */
    getAllUsers: async (request: PaginatedRequest<void>) => {
        return await api.getPaginated<UserDetails>(urls.getAllUsers, request);
    },

    /**
     * Fetches a user's details by their ID, including their orders
     * @param id The ID of the user to fetch
     * @returns Promise containing the user details and their orders
     */
    getUserById: async (id: string) => {
        return await api.get<UserDetailsWithOrders>(urls.getUserById(id));
    }
}; 