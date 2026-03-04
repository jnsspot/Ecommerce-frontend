'use client';

import { useQuery } from '@tanstack/react-query';
import { productsApi, ordersApi, usersApi } from '@/lib/api';
import { Product, Order, User } from '@/lib/types';
import { Package, ShoppingBag, Users, DollarSign } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdminDashboard() {
  const { data: products } = useQuery({ queryKey: ['admin-products'], queryFn: () => productsApi.getAll({ limit: 1000 }).then(r => r.data.products as Product[]) });
  const { data: orders } = useQuery({ queryKey: ['admin-orders'], queryFn: () => ordersApi.getAll().then(r => r.data.orders as Order[]) });
  const { data: users } = useQuery({ queryKey: ['admin-users'], queryFn: () => usersApi.getAll().then(r => r.data.users as User[]) });

  const revenue = orders?.reduce((s, o) => s + Number(o.total), 0) ?? 0;

  const stats = [
    { label: 'Total Products', value: products?.length ?? '—', icon: <Package size={22} className="text-indigo-600" />, color: 'bg-indigo-50' },
    { label: 'Total Orders', value: orders?.length ?? '—', icon: <ShoppingBag size={22} className="text-green-600" />, color: 'bg-green-50' },
    { label: 'Total Users', value: users?.length ?? '—', icon: <Users size={22} className="text-purple-600" />, color: 'bg-purple-50' },
    { label: 'Total Revenue', value: formatPrice(revenue), icon: <DollarSign size={22} className="text-yellow-600" />, color: 'bg-yellow-50' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
            <div className={`${s.color} p-3 rounded-lg`}>{s.icon}</div>
            <div>
              <p className="text-xs text-gray-500 uppercase">{s.label}</p>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase border-b">
              <tr>
                <th className="pb-2 pr-4">Order ID</th>
                <th className="pb-2 pr-4">Customer</th>
                <th className="pb-2 pr-4">Status</th>
                <th className="pb-2">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders?.slice(0, 5).map((o) => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="py-3 pr-4 font-mono text-xs">{o.id.slice(0, 8)}…</td>
                  <td className="py-3 pr-4">{o.user_name ?? '—'}</td>
                  <td className="py-3 pr-4 capitalize">{o.status}</td>
                  <td className="py-3 font-medium">{formatPrice(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
