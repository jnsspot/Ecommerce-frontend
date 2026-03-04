'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatPrice, getImageUrl } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      await addItem(product.id, 1);
      toast.success('Added to cart!');
    } catch {
      toast.error('Login to add items to cart');
    } finally {
      setAdding(false);
    }
  };

  const imageUrl = getImageUrl(product.images?.[0]);

  return (
    <Link href={`/products/${product.id}`} className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
      <div className="relative h-56 bg-gray-100">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-4">
        {product.category_name && (
          <p className="text-xs text-indigo-600 font-medium uppercase tracking-wide mb-1">{product.category_name}</p>
        )}
        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-indigo-600 transition">{product.name}</h3>

        {(product.avg_rating ?? 0) > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <Star size={13} className="fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-gray-600">{Number(product.avg_rating).toFixed(1)} ({product.review_count})</span>
          </div>
        )}

        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
          <Button
            size="sm"
            onClick={handleAddToCart}
            isLoading={adding}
            disabled={product.stock === 0}
            className="flex items-center gap-1"
          >
            <ShoppingCart size={14} />
            Add
          </Button>
        </div>
      </div>
    </Link>
  );
}
