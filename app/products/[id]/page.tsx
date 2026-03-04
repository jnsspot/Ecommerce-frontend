'use client';

import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/lib/api';
import { Product, Review } from '@/lib/types';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import { formatPrice, getImageUrl, ORDER_STATUS_COLORS } from '@/lib/utils';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { reviewsApi } from '@/lib/api';
import { useParams } from 'next/navigation';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getById(id).then((r) => r.data as { product: Product & { reviews: Review[] } }),
  });

  const product = data?.product;

  const handleAddToCart = async () => {
    if (!isAuthenticated) { toast.error('Please login to add items'); return; }
    setAdding(true);
    try {
      await addItem(product!.id, qty);
      toast.success(`${qty} item(s) added to cart`);
    } finally {
      setAdding(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Login to post a review'); return; }
    setSubmitting(true);
    try {
      await reviewsApi.create(id, review);
      toast.success('Review submitted!');
      setReview({ rating: 5, comment: '' });
      refetch();
    } catch {
      toast.error('Could not submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <Spinner />;
  if (!product) return <div className="text-center py-20 text-gray-400">Product not found.</div>;

  const images = product.images && product.images.length > 0 ? product.images : [undefined];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="relative w-full h-96 rounded-2xl overflow-hidden bg-gray-100 shadow">
            <Image
              src={getImageUrl(images[selectedImage])}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 mt-4">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 ${selectedImage === i ? 'border-indigo-600' : 'border-transparent'}`}
                >
                  <Image src={getImageUrl(img)} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          {product.category_name && (
            <p className="text-sm text-indigo-600 font-medium uppercase tracking-wide">{product.category_name}</p>
          )}
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

          {(product.avg_rating ?? 0) > 0 && (
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={16} className={s <= Math.round(product.avg_rating!) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
              ))}
              <span className="text-sm text-gray-500">({product.review_count} reviews)</span>
            </div>
          )}

          <p className="text-3xl font-bold text-indigo-600">{formatPrice(product.price)}</p>
          <p className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}
          </p>

          {product.description && <p className="text-gray-600 leading-relaxed">{product.description}</p>}

          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-gray-100 text-lg">−</button>
              <span className="px-4 py-2 font-medium">{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="px-3 py-2 hover:bg-gray-100 text-lg">+</button>
            </div>
            <Button onClick={handleAddToCart} isLoading={adding} disabled={product.stock === 0} size="lg" className="flex-1">
              <ShoppingCart size={18} /> Add to Cart
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>

        {/* Review form */}
        {isAuthenticated && (
          <form onSubmit={handleReviewSubmit} className="bg-white rounded-xl p-6 shadow-sm mb-8">
            <h3 className="font-semibold text-gray-800 mb-4">Write a Review</h3>
            <div className="flex gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} type="button" onClick={() => setReview(r => ({ ...r, rating: s }))}>
                  <Star size={22} className={s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                </button>
              ))}
            </div>
            <textarea
              value={review.comment}
              onChange={(e) => setReview(r => ({ ...r, comment: e.target.value }))}
              placeholder="Share your experience…"
              rows={3}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
            <Button type="submit" isLoading={submitting} className="mt-3">Submit Review</Button>
          </form>
        )}

        {/* Reviews list */}
        {product.reviews && product.reviews.length > 0 ? (
          <div className="space-y-4">
            {product.reviews.map((r) => (
              <div key={r.id} className="bg-white rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} className={s <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />
                    ))}
                  </div>
                  <span className="font-medium text-sm text-gray-800">{r.user_name}</span>
                </div>
                {r.comment && <p className="text-gray-600 text-sm">{r.comment}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No reviews yet. Be the first!</p>
        )}
      </div>
    </div>
  );
}
