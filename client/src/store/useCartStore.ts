import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axios from "axios";
import { CartState } from "@/types/cartType";
import { MenuItem } from "@/types/restaurantType";

const API_END_POINT = "http://localhost:8001/api/v1/cart"
axios.defaults.withCredentials = true;

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      addToCart: async (item: MenuItem) => {
        try {
          const response = await axios.post(`${API_END_POINT}/cart`, {
            menuId: item._id,
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: 1,
          });
          set((state) => {
            const exisitingItem = state.cart.find(
              (cartItem) => cartItem.menuId === item._id
            );
            if (exisitingItem) {
              return {
                cart: state?.cart.map((cartItem) =>
                  cartItem.menuId === item._id
                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                    : cartItem
                ),
              };
            } else {
              return {
                cart: [...state.cart, response.data],
              };
            }
          });
        } catch (error: any) {
          console.error(error);
        }
      },
      getCart: async () => {
        try {
          const response = await axios.get(`${API_END_POINT}/cart`);
          set({ cart: response.data });
        } catch (error: any) {
          console.error(error);
        }
      },
      clearCart: async () => {
        try {
          await axios.delete(`${API_END_POINT}/cart`);
          set({ cart: [] });
        } catch (error: any) {
          console.error(error);
        }
      },
      removeFromTheCart: async (menuId: string) => {
        try {
          await axios.delete(`${API_END_POINT}/cart/${menuId}`);
          set((state) => ({
            cart: state.cart.filter((item) => item.menuId !== menuId),
          }));
        } catch (error: any) {
          console.error(error);
        }
      },
      incrementQuantity: async (menuId: string) => {
        try {
          const cartItem = useCartStore
            .getState()
            .cart.find((item) => item.menuId === menuId);
          if (cartItem) {
            await axios.put(`${API_END_POINT}/cart/${menuId}`, {
              quantity: cartItem.quantity + 1,
            });
            set((state) => ({
              cart: state.cart.map((item) =>
                item.menuId === menuId
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            }));
          }
        } catch (error: any) {
          console.error(error);
        }
      },
      decrementQuantity: async (menuId: string) => {
        try {
          const cartItem = useCartStore
            .getState()
            .cart.find((item) => item.menuId === menuId);
          if (cartItem && cartItem.quantity > 1) {
            await axios.put(`${API_END_POINT}/cart/${menuId}`, {
              quantity: cartItem.quantity - 1,
            });
            set((state) => ({
              cart: state.cart.map((item) =>
                item.menuId === menuId
                  ? { ...item, quantity: item.quantity - 1 }
                  : item
              ),
            }));
          }
        } catch (error: any) {
          console.error(error);
        }
      },
    }),
    {
      name: "cart-name",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
