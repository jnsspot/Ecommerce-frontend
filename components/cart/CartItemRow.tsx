'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/lib/types';
import { formatPrice, getImageUrl } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import toast from 'react-hot-toast';

export default function CartItemRow({ item }: { item: CartItemType }) {
  const { updateItem, removeItem } = useCart();

  const handleRemove = async () => {
    await removeItem(item.product_id);
    toast.success('Item removed');
  };

  return (
    <div className="flex items-center gap-4 py-4 border-b last:border-0">
      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
        <Image
          src={getImageUrl(item.images?.[0])}
          alt={item.product_name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{item.product_name}</p>
        <p className="text-sm text-indigo-600 font-semibold mt-0.5">{formatPrice(item.price)}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateItem(item.product_id, item.quantity - 1)}
          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-indigo-500 transition"
        >
          <Minus size={13} />
        </button>
        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
        <button
          onClick={() => updateItem(item.product_id, item.quantity + 1)}
          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-indigo-500 transition"
        >
          <Plus size={13} />
        </button>
      </div>
      <div className="text-right w-24">
        <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
        <button onClick={handleRemove} className="mt-1 text-red-400 hover:text-red-600 transition">
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
