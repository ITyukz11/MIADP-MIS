// components/RequireAuth.tsx
'use client'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface RequireAuthProps {
  children: ReactNode;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Check if the session is authenticated and data is available
    if (status === 'authenticated' && session) {
      // User is authenticated, continue rendering children
      return;
    }

    // If session status is not 'authenticated' or data is not available, redirect to login
    router.push('/auth/login');
  }, [status, session, router]);

  // Render children only if authenticated
  return status === 'authenticated' && session ? <>{children}</> : null;
};

export default RequireAuth;
