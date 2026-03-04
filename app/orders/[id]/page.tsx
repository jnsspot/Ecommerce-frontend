'use client';

import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '@/lib/api';
import { Order } from '@/lib/types';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import { formatPrice, formatDate, ORDER_STATUS_COLORS } from '@/lib/utils';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function OrderDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersApi.getById(id).then((r) => r.data.order as Order),
  });

  if (isLoading) return <Spinner />;
  if (!data) return <div className="text-center py-20 text-gray-400">Order not found.</div>;

  const addr = data.shipping_address;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
        <Badge label={data.status} className={ORDER_STATUS_COLORS[data.status]} />
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400 text-xs uppercase">Order ID</p>
            <p className="font-mono">{data.id}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase">Date</p>
            <p>{formatDate(data.created_at)}</p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-gray-800 mb-4">Items Ordered</h2>
        <div className="space-y-3">
          {data.items?.map((item, i) => (
            <div key={i} className="flex justify-between text-sm text-gray-700">
              <span>{item.name} × {item.quantity}</span>
              <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="border-t mt-4 pt-4 flex justify-between font-bold text-gray-900">
          <span>Total</span>
          <span>{formatPrice(data.total)}</span>
        </div>
      </div>

      {/* Shipping */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-gray-800 mb-3">Shipping Address</h2>
        <p className="text-sm text-gray-600">{addr?.fullName}</p>
        <p className="text-sm text-gray-600">{addr?.address}</p>
        <p className="text-sm text-gray-600">{addr?.city}, {addr?.postalCode}</p>
        <p className="text-sm text-gray-600">{addr?.country}</p>
      </div>

      <Link href="/orders" className="text-indigo-600 hover:underline text-sm">← Back to Orders</Link>
    </div>
  );
}
