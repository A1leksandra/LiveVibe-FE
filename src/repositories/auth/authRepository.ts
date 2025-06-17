import api from "../../shared/api";
import { urls } from "../../shared/urls";
import { RegisterRequest } from "./RegisterRequest";
import { LoginRequest } from "./LoginRequest";
import { AuthResponse } from "./AuthResponse";

export const authRepository = {
    register: async (request: RegisterRequest) => {
        return await api.post<RegisterRequest, AuthResponse>(urls.register, request);
    },
    
    login: async (request: LoginRequest) => {
        return await api.post<LoginRequest, AuthResponse>(urls.login, request);
    }
}
