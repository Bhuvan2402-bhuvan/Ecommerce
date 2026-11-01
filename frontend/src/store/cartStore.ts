import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Cart, CartItem } from '../types';

interface CartState {
  cart: Cart;
  isOpen: boolean;
  setCart: (cart: Cart) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  clearLocalCart: () => void;
}

const emptyCart: Cart = { items: [], totalPrice: 0, totalItems: 0 };

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: emptyCart,
      isOpen: false,
      setCart: (cart) => set({ cart }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
      clearLocalCart: () => set({ cart: emptyCart }),
    }),
    {
      name: 'cart-store',
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);
