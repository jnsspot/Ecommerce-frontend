'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Search, User, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            ShopNow
          </Link>

          {/* Search — desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-8">
            <div className="relative w-full max-w-lg">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products…"
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600">
                <Search size={16} />
              </button>
            </div>
          </form>

          {/* Nav links — desktop */}
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/products" className="text-sm text-gray-600 hover:text-indigo-600 font-medium">Products</Link>

            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link href="/admin" className="text-sm text-gray-600 hover:text-indigo-600 flex items-center gap-1">
                    <LayoutDashboard size={15} /> Admin
                  </Link>
                )}
                <Link href="/orders" className="text-sm text-gray-600 hover:text-indigo-600">Orders</Link>
                <Link href="/profile" className="text-sm text-gray-600 hover:text-indigo-600 flex items-center gap-1">
                  <User size={15} /> {user?.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-600 hover:text-red-500 flex items-center gap-1"
                >
                  <LogOut size={15} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm text-gray-600 hover:text-indigo-600">Login</Link>
                <Link href="/auth/register" className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-full hover:bg-indigo-700 transition">
                  Sign Up
                </Link>
              </>
            )}

            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-indigo-600">
              <ShoppingCart size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={cn('md:hidden bg-white border-t px-4 pb-4 space-y-3')}>
          <form onSubmit={handleSearch} className="pt-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products…"
                className="w-full pl-4 pr-10 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={16} />
              </button>
            </div>
          </form>
          <Link href="/products" className="block text-sm text-gray-700" onClick={() => setMenuOpen(false)}>Products</Link>
          <Link href="/cart" className="block text-sm text-gray-700" onClick={() => setMenuOpen(false)}>Cart ({itemCount})</Link>
          {isAuthenticated ? (
            <>
              {isAdmin && <Link href="/admin" className="block text-sm text-gray-700" onClick={() => setMenuOpen(false)}>Admin Dashboard</Link>}
              <Link href="/orders" className="block text-sm text-gray-700" onClick={() => setMenuOpen(false)}>Orders</Link>
              <Link href="/profile" className="block text-sm text-gray-700" onClick={() => setMenuOpen(false)}>Profile</Link>
              <button onClick={handleLogout} className="block text-sm text-red-500">Logout</button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="block text-sm text-gray-700" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link href="/auth/register" className="block text-sm text-indigo-600 font-medium" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
