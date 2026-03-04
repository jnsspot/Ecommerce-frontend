'use client';

import { Suspense, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productsApi, categoriesApi } from '@/lib/api';
import { Product, Category } from '@/lib/types';
import ProductCard from '@/components/products/ProductCard';
import Spinner from '@/components/ui/Spinner';
import { useSearchParams } from 'next/navigation';

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [search, setSearch] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(0);
  const limit = 12;

  const { data: catData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll().then((r) => r.data.categories as Category[]),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['products', selectedCategory, page, search],
    queryFn: async () => {
      if (search) {
        const r = await productsApi.search(search);
        return r.data.products as Product[];
      }
      const r = await productsApi.getAll({
        limit,
        offset: page * limit,
        category_id: selectedCategory || undefined,
      });
      return r.data.products as Product[];
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">All Products</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => { setSelectedCategory(''); setSearch(''); setPage(0); }}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${!selectedCategory && !search ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border hover:border-indigo-400'}`}
        >
          All
        </button>
        {catData?.map((c) => (
          <button
            key={c.id}
            onClick={() => { setSelectedCategory(c.id); setSearch(''); setPage(0); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${selectedCategory === c.id ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border hover:border-indigo-400'}`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {search && (
        <div className="mb-6 flex items-center gap-3">
          <p className="text-gray-600 text-sm">Results for: <strong>&quot;{search}&quot;</strong></p>
          <button onClick={() => setSearch('')} className="text-xs text-red-500 underline">Clear</button>
        </div>
      )}

      {isLoading ? (
        <Spinner />
      ) : !data || data.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!search && (
        <div className="flex justify-center gap-4 mt-10">
          <button
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
            className="px-5 py-2 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-100 transition"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-600">Page {page + 1}</span>
          <button
            disabled={(data?.length ?? 0) < limit}
            onClick={() => setPage(p => p + 1)}
            className="px-5 py-2 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-100 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
export default function ProductsPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <ProductsContent />
    </Suspense>
  );
}