'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { ordersApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const empty = Object.values(form).some((v) => !v.trim());
    if (empty) { toast.error('Please fill all fields'); return; }
    setLoading(true);
    try {
      const res = await ordersApi.place(form);
      await clearCart();
      toast.success('Order placed successfully!');
      router.push(`/orders/${res.data.order.id}`);
    } catch {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center text-gray-500">
        <p>Your cart is empty. <a href="/products" className="text-indigo-600 underline">Shop now</a></p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Shipping form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-2">Shipping Address</h2>
          <Input label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} placeholder="John Doe" />
          <Input label="Address" name="address" value={form.address} onChange={handleChange} placeholder="123 Main St" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="City" name="city" value={form.city} onChange={handleChange} placeholder="New York" />
            <Input label="Postal Code" name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="10001" />
          </div>
          <Input label="Country" name="country" value={form.country} onChange={handleChange} placeholder="United States" />
          <Button type="submit" size="lg" className="w-full mt-4" isLoading={loading}>
            Place Order
          </Button>
        </form>

        {/* Order summary */}
        <div className="bg-white rounded-xl shadow-sm p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm text-gray-700">
                <span>{item.product_name} × {item.quantity}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 flex justify-between font-bold text-gray-900">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
