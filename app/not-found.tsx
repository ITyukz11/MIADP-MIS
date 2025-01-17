"use client";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaUnlink } from "react-icons/fa";

function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(4); // Start countdown at 4 seconds

  useEffect(() => {
    // Update the countdown every second
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    // Redirect to '/' after countdown reaches 0
    const redirectTimeout = setTimeout(() => {
      router.push("/");
    }, 4000);

    // Clear the interval and timeout when the component unmounts
    return () => {
      clearInterval(interval);
      clearTimeout(redirectTimeout);
    };
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <span className="text-6xl" role="img" aria-label="disconnect">
        <FaUnlink />
      </span>
      <h1 className="text-2xl font-bold mt-4">404 - Not Found</h1>
      <p className="text-lg text-gray-600 mt-2">
        Oops! It seems like you&apos;re lost...
      </p>

      <p className="text-lg text-gray-600 mt-2 flex flex-row">
        Redirecting you now back to the main page in {countdown}...{" "}
        <LoadingSpinner />
      </p>
    </div>
  );
}

export default NotFound;
