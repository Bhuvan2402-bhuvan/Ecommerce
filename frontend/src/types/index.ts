// Types for the ShopSphere application

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  role: 'CUSTOMER' | 'ADMIN';
  enabled: boolean;
  createdAt: string;
}

export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CUSTOMER' | 'ADMIN';
  token: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  slug?: string;
  active: boolean;
  productCount: number;
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  inStock: boolean;
  imageUrl?: string;
  brand?: string;
  sku?: string;
  active: boolean;
  featured: boolean;
  categoryId: number;
  categoryName?: string;
  createdAt: string;
}

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productImageUrl?: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  stockQuantity: number;
}

export interface Cart {
  id?: number;
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImageUrl?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  paymentMethod: string;
  paymentStatus: string;
  shippingFirstName: string;
  shippingLastName: string;
  shippingEmail: string;
  shippingPhone?: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZipCode: string;
  shippingCountry: string;
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  notes?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AdminStats {
  totalProducts: number;
  totalCategories: number;
  totalCustomers: number;
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
}

export interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  notes?: string;
}

export interface ProductForm {
  name: string;
  description: string;
  price: number | string;
  stockQuantity: number | string;
  categoryId: number | string;
  imageUrl: string;
  brand: string;
  sku: string;
  active: boolean;
  featured: boolean;
}
