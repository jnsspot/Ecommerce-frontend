import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach token on every request
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally → redirect to login
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token');
      if (typeof window !== 'undefined') window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ────────────────────────────────────────────────
export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

// ─── Products ────────────────────────────────────────────
export const productsApi = {
  getAll: (params?: { limit?: number; offset?: number; category_id?: string }) =>
    api.get('/products', { params }),
  getById: (id: string) => api.get(`/products/${id}`),
  search: (q: string) => api.get('/products/search', { params: { q } }),
  create: (data: FormData) =>
    api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: string, data: object) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
};

// ─── Categories ──────────────────────────────────────────
export const categoriesApi = {
  getAll: () => api.get('/categories'),
  getById: (id: string) => api.get(`/categories/${id}`),
  create: (data: FormData) =>
    api.post('/categories', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: string, data: object) => api.put(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

// ─── Cart ────────────────────────────────────────────────
export const cartApi = {
  get: () => api.get('/cart'),
  add: (product_id: string, quantity: number) =>
    api.post('/cart', { product_id, quantity }),
  update: (product_id: string, quantity: number) =>
    api.put('/cart', { product_id, quantity }),
  remove: (productId: string) => api.delete(`/cart/${productId}`),
  clear: () => api.delete('/cart/clear'),
};

// ─── Orders ──────────────────────────────────────────────
export const ordersApi = {
  place: (shipping_address: object) => api.post('/orders', { shipping_address }),
  myOrders: () => api.get('/orders/my'),
  getById: (id: string) => api.get(`/orders/${id}`),
  getAll: () => api.get('/orders'),
  updateStatus: (id: string, status: string) =>
    api.patch(`/orders/${id}/status`, { status }),
};

// ─── Users ───────────────────────────────────────────────
export const usersApi = {
  getAll: () => api.get('/users'),
  getById: (id: string) => api.get(`/users/${id}`),
  updateProfile: (data: FormData) =>
    api.put('/users/profile', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: string) => api.delete(`/users/${id}`),
};

// ─── Reviews ─────────────────────────────────────────────
export const reviewsApi = {
  getByProduct: (productId: string) =>
    api.get(`/products/${productId}/reviews`),
  create: (productId: string, data: { rating: number; comment?: string }) =>
    api.post(`/products/${productId}/reviews`, data),
  delete: (productId: string, reviewId: string) =>
    api.delete(`/products/${productId}/reviews/${reviewId}`),
};

export default api;
