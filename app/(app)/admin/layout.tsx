import { Card, CardContent } from "@/components/ui/card"

interface AdminLayoutProps {
    children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <div className="w-full relative">
            <Card>
                <CardContent className="p-4">
                    {children}
                </CardContent>
            </Card>
        </div>
    )
}