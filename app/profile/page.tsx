'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/auth/login');
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xl font-semibold">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        <div className="border-t pt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <p className="text-xs text-gray-400 uppercase">Role</p>
            <p className="capitalize font-medium">{user.role}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase">Member Since</p>
            <p>{formatDate(user.created_at)}</p>
          </div>
        </div>
        <div className="border-t pt-4 flex gap-4">
          <Link href="/orders">
            <Button variant="outline">View Orders</Button>
          </Link>
          <Button variant="danger" onClick={() => { logout(); router.push('/'); }}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
