import api from "../../shared/api";
import { urls } from "../../shared/urls";
import { Category } from "./Category";

export const categoryRepository = {
    /**
     * Fetches all event categories
     * @returns Promise containing array of categories
     */
    getAllCategories: async () => {
        return await api.get<Category[]>(urls.getAllCategories);
    }
} 