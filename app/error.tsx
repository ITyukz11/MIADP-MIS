"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { signOut } from "next-auth/react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const handleSignOut = () => {
    signOut();
    localStorage.clear();
    sessionStorage.clear();
  };

  return (
    <html>
      <body>
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Label style={{ display: "block", marginBottom: "10px" }}>
            Our system is currently undergoing maintenance. You have been logged
            out for security reasons. Please try again later.
          </Label>
          <Button onClick={handleSignOut}>Log Out</Button>
        </div>
      </body>
    </html>
  );
}
