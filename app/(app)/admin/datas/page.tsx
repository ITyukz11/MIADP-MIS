'use client'
import { Separator } from "@/components/ui/separator"

export default function SettingsProfilePage() {
  return (
    <div className="space-y-6 w-full">
      <div>
        <h3 className="text-lg font-medium">Datas</h3>
        <p className="text-sm text-muted-foreground">
        This is the section where you configure your data settings, such as dropdown fields in forms and other related configurations.
        </p>
      </div>
      <Separator />
    </div>
  )
}