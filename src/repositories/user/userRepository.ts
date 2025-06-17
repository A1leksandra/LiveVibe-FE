import api from "../../shared/api";
import { urls } from "../../shared/urls";
import { UserDetails } from "./UserDetails";

export const userRepository = {
    /**
     * Fetches the current user's details using the stored auth token
     * @returns ApiResponse containing the user details if successful
     */
    me: async () => {
        return await api.get<UserDetails>(urls.getCurrentUser);
    }
} 