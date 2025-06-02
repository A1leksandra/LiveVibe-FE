import api from "../../shared/api"
import { urls } from "../../shared/urls";

export const cityRepository = {
    getAllCities: async () => {
        return await api.get<string[]>(urls.getAllCities);
    }
}