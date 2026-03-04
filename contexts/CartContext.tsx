'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { CartItem } from '@/lib/types';
import { cartApi } from '@/lib/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  total: number;
  itemCount: number;
  isLoading: boolean;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) { setItems([]); setTotal(0); return; }
    setIsLoading(true);
    try {
      const res = await cartApi.get();
      setItems(res.data.items);
      setTotal(res.data.total);
    } catch {
      setItems([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addItem = async (productId: string, quantity = 1) => {
    await cartApi.add(productId, quantity);
    await refreshCart();
  };

  const updateItem = async (productId: string, quantity: number) => {
    if (quantity <= 0) { await removeItem(productId); return; }
    await cartApi.update(productId, quantity);
    await refreshCart();
  };

  const removeItem = async (productId: string) => {
    await cartApi.remove(productId);
    await refreshCart();
  };

  const clearCart = async () => {
    await cartApi.clear();
    setItems([]);
    setTotal(0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
        isLoading,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};
