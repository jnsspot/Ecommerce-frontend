// ─── Auth ───────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  avatar?: string;
  is_verified: boolean;
  created_at: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

// ─── Category ───────────────────────────────────────────
export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  created_at: string;
}

// ─── Product ────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category_id?: string;
  category_name?: string;
  images?: string[];
  sku?: string;
  is_active: boolean;
  avg_rating?: number;
  review_count?: number;
  created_at: string;
  updated_at: string;
}

// ─── Cart ────────────────────────────────────────────────
export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  product_name: string;
  price: number;
  images?: string[];
}

export interface Cart {
  items: CartItem[];
  total: number;
}

// ─── Order ───────────────────────────────────────────────
export interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
  name: string;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  user_id: string;
  user_name?: string;
  user_email?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  shipping_address: ShippingAddress;
  stripe_payment_id?: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

// ─── Review ──────────────────────────────────────────────
export interface Review {
  id: string;
  user_id: string;
  user_name: string;
  product_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

// ─── API Generic ─────────────────────────────────────────
export interface ApiError {
  message: string;
  errors?: { msg: string; param: string }[];
}
