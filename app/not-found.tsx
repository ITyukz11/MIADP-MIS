"use client"
// import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { FaUnlink } from 'react-icons/fa';

function NotFound() {
  // const router = useRouter();

  // useEffect(() => {
  //   // Redirect to '/' after 2 seconds
  //   const redirectTimeout = setTimeout(() => {
  //     router.push('/');
  //   }, 2000);

  //   // Clear the timeout when the component unmounts
  //   return () => clearTimeout(redirectTimeout);
  // }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <span className="text-6xl" role="img" aria-label="disconnect"><FaUnlink/></span>
      <h1 className="text-2xl font-bold mt-4">404 - Not Found</h1>
      <p className="text-lg text-gray-600 mt-2">Oops! It seems like you&apos;re lost... </p>
      
      <p className="text-lg text-gray-600 mt-2 flex flex-row">Redirecting you now back to main page... <LoadingSpinner/></p>
    </div>
  );
}

export default NotFound;
