'use client'

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <Label>Something went wrong!</Label>
        <Button onClick={() => reset()}>Try again</Button>
      </body>
    </html>
  )
}