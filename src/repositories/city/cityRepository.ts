import api from "../../shared/api"
import { urls } from "../../shared/urls";
import { City } from "./City";

export const cityRepository = {
    /**
     * Gets a list of city names
     * @returns Promise containing array of city names
     */
    getAllCities: async () => {
        return await api.get<string[]>(urls.getAllCities);
    },

    /**
     * Gets a list of full city details including IDs
     * @returns Promise containing array of city objects
     */
    getAllCitiesFull: async () => {
        return await api.get<City[]>(urls.getAllCitiesFull);
    }
}