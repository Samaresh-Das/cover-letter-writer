'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const PROTECTED_ROUTES = ['/dashboard', '/profile', '/onboarding'];

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

      if (isProtectedRoute && !token) {
        setAuthorized(false);
        router.push('/auth');
      } else {
        setAuthorized(true);
      }
    };

    checkAuth();
  }, [pathname, router]);

  if (!authorized && PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return children;
}
