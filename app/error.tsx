"use client";

import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GlobalError({}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the home page after a delay
    const redirectTimeout = setTimeout(() => {
      router.push("/");
    }, 3000);

    // Cleanup the timeout when the component unmounts
    return () => {
      clearTimeout(redirectTimeout);
    };
  }, [router]);

  return (
    <html>
      <body>
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Label style={{ display: "block", marginBottom: "10px" }}>
            An error occurred. You will be redirected to the home page shortly.
          </Label>
        </div>
      </body>
    </html>
  );
}
