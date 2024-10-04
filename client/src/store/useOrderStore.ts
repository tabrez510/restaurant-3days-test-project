import { CheckoutSessionRequest, OrderState } from "@/types/orderType";
import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const API_END_POINT: string = "http://localhost:8001/api/v1/order";
axios.defaults.withCredentials = true;

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      loading: false,
      orders: [],
      createOrder: async (checkoutSession: CheckoutSessionRequest) => {
        try {
          set({ loading: true });
          const response = await axios.post(
            `${API_END_POINT}/create-order`,
            checkoutSession,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          set({ loading: false });
          toast.success(response.data.message);
        } catch (error: any) {
          set({ loading: false });
          toast.error(error.response.data.message);
        }
      },
      getOrderDetails: async () => {
        try {
          set({ loading: true });
          const response = await axios.get(`${API_END_POINT}/`);
          set({ loading: false, orders: response.data.orders });
        } catch (error) {
          set({ loading: false });
        }
      },
    }),
    {
      name: "order-name",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
