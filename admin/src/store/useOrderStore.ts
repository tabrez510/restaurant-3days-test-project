import { OrderState } from "@/types/orderType";
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
      getAllOrdersForAdmin: async () => {
        try {
          set({ loading: true });
          const response = await axios.get(`${API_END_POINT}/admin/all-orders`);
          set({ loading: false, orders: response.data.orders });
          toast.success("Orders fetched successfully");
        } catch (error: any) {
          set({ loading: false });
          toast.error(error.response?.data?.message || "Error fetching orders");
        }
      },

      // Update order status (Admin)
      updateOrderStatus: async (orderId: string, status: string) => {
        try {
          set({ loading: true });
          const response = await axios.put(
            `${API_END_POINT}/admin/update-order-status/${orderId}`,
            { status },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          set({ loading: false });
          toast.success(response.data.message);

          // Optionally: Update local order state
          set((state) => ({
            orders: state.orders.map((order) =>
              order._id === orderId ? { ...order, status } : order
            ),
          }));
        } catch (error: any) {
          set({ loading: false });
          toast.error(
            error.response?.data?.message || "Error updating order status"
          );
        }
      },

      // Get order details (User or Admin)
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
      name: "order-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
