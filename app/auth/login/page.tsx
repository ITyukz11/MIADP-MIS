'use client'
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AuthenticationPage from '@/components/auth/auth-component';

const LoginPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // If user is logged in, redirect to main page
  if (session) {
    router.replace('/');
    return null; // Render nothing, as the user will be redirected
  }

  // If user is not logged in, render the authentication page
  return <AuthenticationPage />;
};

export default LoginPage;
