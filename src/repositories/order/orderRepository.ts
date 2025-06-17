import api from "../../shared/api";
import { urls } from "../../shared/urls";
import { CreateOrderRequest } from "./CreateOrderRequest";
import { CreateOrderResponse } from "./CreateOrderResponse";

export const orderRepository = {
    /**
     * Creates a new order
     * @param request The order details
     * @returns ApiResponse containing a success message if the order was created
     */
    create: async (request: CreateOrderRequest) => {
        return await api.post<CreateOrderRequest, CreateOrderResponse>(urls.createOrder, request);
    }
}; 