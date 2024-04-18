'use client'

import Link from "next/link"
import { Button } from "../ui/button"

interface BackButtonProps {
    href: string,
    label: string,
    loading: boolean
}

export const BackButton = ({ href, label, loading }: BackButtonProps) => {

    return (
        <Button
            
            variant={"link"}
            className="font-normal w-full"
            size="sm"
            disabled={loading}
            asChild>
            <Link href={loading? '': href}>
                {label}
            </Link>
        </Button>
    )
}