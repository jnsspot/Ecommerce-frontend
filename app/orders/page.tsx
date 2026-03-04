'use client';

import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '@/lib/api';
import { Order } from '@/lib/types';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import { formatPrice, formatDate, ORDER_STATUS_COLORS } from '@/lib/utils';
import { Package } from 'lucide-react';

export default function OrdersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => ordersApi.myOrders().then((r) => r.data.orders as Order[]),
  });

  if (isLoading) return <Spinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

      {!data || data.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <Package size={56} className="mx-auto mb-4" />
          <p className="text-lg">No orders yet.</p>
          <Link href="/products" className="text-indigo-600 underline mt-2 block">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((order) => (
            <Link key={order.id} href={`/orders/${order.id}`} className="block bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Order ID</p>
                  <p className="font-mono text-sm text-gray-700">{order.id.slice(0, 8)}…</p>
                </div>
                <Badge label={order.status} className={ORDER_STATUS_COLORS[order.status]} />
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{formatDate(order.created_at)}</span>
                <span className="font-semibold text-gray-900">{formatPrice(order.total)}</span>
              </div>
              {order.items && (
                <p className="text-xs text-gray-400 mt-2">{order.items.length} item(s)</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
