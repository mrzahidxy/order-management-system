// store/useStore.ts
import privateRequest from "@/healper/privateRequest";
import axios from "axios";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// Interfaces
interface CartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
}

interface CartState {
  cartItems: CartItem[];
  message: string;
  isLoading: boolean;
  error: string | null;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  placeOrder: () => Promise<void>;
}

// Helper function to auto-clear message after delay
const clearNotification = (set: any, delay = 3000) => {
  setTimeout(() => set({ message: "", error: null }), delay);
};

// Zustand store with persistence
const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set) => ({
        cartItems: [],
        message: "",
        isLoading: false,
        error: null,

        addToCart: async (productId, quantity) => {
          set({ isLoading: true, error: null });
          try {
            const { data } = await privateRequest.post("/carts", {
              productId,
              quantity,
            });
            if (data?.data) {
              set((state) => ({
                cartItems: [...state.cartItems, data.data],
                message: data.message,
                isLoading: false,
              }));
              clearNotification(set);
            }
          } catch (error) {
            set({
              error: `Failed to add to cart: ${
                axios.isAxiosError(error)
                  ? error.response?.data?.message
                  : (error as any).message
              }`,
              isLoading: false,
            });
            clearNotification(set);
          }
        },

        placeOrder: async () => {
          set({ isLoading: true, error: null });
          try {
            const response = await privateRequest.post("/orders");
            if ([200, 201].includes(response.status)) {
              set({
                cartItems: [],
                message: "Order placed successfully!",
                isLoading: false,
              });
            } else {
              set({ message: "Failed to place order.", isLoading: false });
            }
            clearNotification(set);
          } catch (error) {
            set({
              error: `Failed to place order: ${
                axios.isAxiosError(error)
                  ? error.response?.data?.message
                  : (error as any).message
              }`,
              isLoading: false,
            });
            clearNotification(set);
          }
        },
      }),
      { name: "cart-storage" }
    )
  )
);

export default useCartStore;
