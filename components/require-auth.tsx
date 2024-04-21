// components/RequireAuth.tsx
'use client'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface RequireAuthProps {
  children: ReactNode;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const redirect = () => {
      // Redirect to login page if not authenticated
      router.push('/auth/login');
    };

    if (status === 'authenticated' && session) {
      // User is authenticated, continue rendering children
      return;
    } else if (status === 'loading') {
      // Optionally, show a loading indicator or placeholder content
      <LoadingSpinner/>
      return;
    } else {
      // Handle error or unauthenticated state
      redirect();
    }
  }, [status, session, router]);

  // Render children only if authenticated
  return status === 'authenticated' && session ? <>{children}</> : null;
};

export default RequireAuth;
