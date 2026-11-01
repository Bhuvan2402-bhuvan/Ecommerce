import { useCallback } from 'react';
import { cartApi } from '../api';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export function useCart() {
  const { cart, setCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await cartApi.get();
      if (res.success) setCart(res.data);
    } catch (e) {
      console.error('Failed to fetch cart', e);
    }
  }, [isAuthenticated, setCart]);

  const addToCart = useCallback(async (productId: number, quantity: number = 1) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return false;
    }
    try {
      const res = await cartApi.addItem(productId, quantity);
      if (res.success) {
        setCart(res.data);
        toast.success('Added to cart!');
        return true;
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Failed to add to cart';
      toast.error(msg);
    }
    return false;
  }, [isAuthenticated, setCart]);

  const updateQuantity = useCallback(async (itemId: number, quantity: number) => {
    try {
      const res = await cartApi.updateItem(itemId, quantity);
      if (res.success) setCart(res.data);
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Failed to update cart';
      toast.error(msg);
    }
  }, [setCart]);

  const removeItem = useCallback(async (itemId: number) => {
    try {
      const res = await cartApi.removeItem(itemId);
      if (res.success) {
        setCart(res.data);
        toast.success('Item removed');
      }
    } catch (error: any) {
      toast.error('Failed to remove item');
    }
  }, [setCart]);

  const clearCart = useCallback(async () => {
    try {
      await cartApi.clear();
      setCart({ items: [], totalPrice: 0, totalItems: 0 });
    } catch (e) {}
  }, [setCart]);

  return { cart, fetchCart, addToCart, updateQuantity, removeItem, clearCart };
}
