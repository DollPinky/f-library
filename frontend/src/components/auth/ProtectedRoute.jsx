'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccountAuth } from '../../contexts/AccountAuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, loading, user } = useAccountAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }
      if (requiredRole && user?.role !== requiredRole) {
        router.push('/');
        return;
      }
    }
  }, [isAuthenticated, loading, requiredRole, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-sage-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto"></div>
          <p className="mt-4 text-sage-600 dark:text-sage-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  return children;
};

export default ProtectedRoute; 