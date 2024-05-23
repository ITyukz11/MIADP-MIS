import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const font = Poppins({
    subsets: ["latin"],
    weight: ["600"]
})

interface HeaderProps {
    label: string,
    title: string
}

export const Header = ({
    label, title
}: HeaderProps) => {
    return (
        <div className="w-full flex flex-col gap-y-4 items-center justify-center">
            <h1 className={cn("text-center text-xl md:text-3xl font-semibold text-primary", font.className)}>
                🔐 {title}
            </h1>
            <p className="text-center text-xs md:text-sm text-muted-foreground mb-4">
                {label}
            </p>
        </div>
    )
}
