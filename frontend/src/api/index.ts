import api from './client';
import type { ApiResponse, AuthUser, CheckoutForm, Cart, CartItem, Order, Page, Product, Category, User, AdminStats } from '../types';

// Auth
export const authApi = {
  register: (data: { firstName: string; lastName: string; email: string; password: string; phone?: string }) =>
    api.post<ApiResponse<AuthUser>>('/auth/register', data).then(r => r.data),
  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<AuthUser>>('/auth/login', data).then(r => r.data),
};

// Products
export const productsApi = {
  getAll: (params?: {
    search?: string; categoryId?: number; minPrice?: number; maxPrice?: number;
    sortBy?: string; sortDir?: string; page?: number; size?: number;
  }) => api.get<ApiResponse<Page<Product>>>('/products', { params }).then(r => r.data),
  getById: (id: number) => api.get<ApiResponse<Product>>(`/products/${id}`).then(r => r.data),
  getFeatured: () => api.get<ApiResponse<Product[]>>('/products/featured').then(r => r.data),
};

// Categories
export const categoriesApi = {
  getAll: () => api.get<ApiResponse<Category[]>>('/categories').then(r => r.data),
  getById: (id: number) => api.get<ApiResponse<Category>>(`/categories/${id}`).then(r => r.data),
};

// Cart
export const cartApi = {
  get: () => api.get<ApiResponse<Cart>>('/cart').then(r => r.data),
  addItem: (productId: number, quantity: number) =>
    api.post<ApiResponse<Cart>>('/cart/items', { productId, quantity }).then(r => r.data),
  updateItem: (itemId: number, quantity: number) =>
    api.put<ApiResponse<Cart>>(`/cart/items/${itemId}?quantity=${quantity}`).then(r => r.data),
  removeItem: (itemId: number) =>
    api.delete<ApiResponse<Cart>>(`/cart/items/${itemId}`).then(r => r.data),
  clear: () => api.delete<ApiResponse<void>>('/cart').then(r => r.data),
};

// Orders
export const ordersApi = {
  checkout: (data: CheckoutForm) =>
    api.post<ApiResponse<Order>>('/orders/checkout', data).then(r => r.data),
  getMyOrders: () => api.get<ApiResponse<Order[]>>('/orders').then(r => r.data),
  getMyOrder: (id: number) => api.get<ApiResponse<Order>>(`/orders/${id}`).then(r => r.data),
};

// User
export const userApi = {
  getMe: () => api.get<ApiResponse<User>>('/users/me').then(r => r.data),
  updateMe: (data: Partial<User>) =>
    api.put<ApiResponse<User>>('/users/me', data).then(r => r.data),
};

// Admin
export const adminApi = {
  getStats: () => api.get<ApiResponse<AdminStats>>('/admin/stats').then(r => r.data),

  // Products
  getAllProducts: () => api.get<ApiResponse<Product[]>>('/admin/products').then(r => r.data),
  createProduct: (data: Partial<Product> & { categoryId: number }) =>
    api.post<ApiResponse<Product>>('/admin/products', data).then(r => r.data),
  updateProduct: (id: number, data: Partial<Product> & { categoryId: number }) =>
    api.put<ApiResponse<Product>>(`/admin/products/${id}`, data).then(r => r.data),
  deleteProduct: (id: number) =>
    api.delete<ApiResponse<void>>(`/admin/products/${id}`).then(r => r.data),

  // Categories
  getAllCategories: () => api.get<ApiResponse<Category[]>>('/admin/categories').then(r => r.data),
  createCategory: (data: Partial<Category>) =>
    api.post<ApiResponse<Category>>('/admin/categories', data).then(r => r.data),
  updateCategory: (id: number, data: Partial<Category>) =>
    api.put<ApiResponse<Category>>(`/admin/categories/${id}`, data).then(r => r.data),
  deleteCategory: (id: number) =>
    api.delete<ApiResponse<void>>(`/admin/categories/${id}`).then(r => r.data),

  // Orders
  getAllOrders: (page = 0, size = 20) =>
    api.get<ApiResponse<Page<Order>>>(`/admin/orders?page=${page}&size=${size}`).then(r => r.data),
  updateOrderStatus: (id: number, status: string) =>
    api.patch<ApiResponse<Order>>(`/admin/orders/${id}/status?status=${status}`).then(r => r.data),

  // Customers
  getAllCustomers: () => api.get<ApiResponse<User[]>>('/admin/customers').then(r => r.data),
};
