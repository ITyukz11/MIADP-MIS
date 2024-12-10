'use client'
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"

export default function GenerateCodePage() {
  const [openGenerateDialog, setGenerateDialog] = useState<boolean>(false)
  return (
    <div className="space-y-6 w-full">
      <div>
        <h3 className="text-lg font-medium">Generate Code</h3>
        <p className="text-sm text-muted-foreground">
        This section is where the code for the MIADP subprojects is generated.
        </p>
      </div>
      <Separator />
      <Button onClick={()=> setGenerateDialog(!openGenerateDialog)}>Generate Code</Button>
      Table here
    </div>
  )
}