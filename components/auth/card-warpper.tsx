'use client'
import { Header } from "@/components/auth/header";
import {
    Card,
    CardContent,
    CardHeader,
    CardFooter
} from "../ui/card";
import { Social } from "@/components/auth/social";
import { BackButton } from "@/components/auth/back-button";

interface CardWrapperProps {
    children: React.ReactNode;
    headerLabel: string;
    headerTitle: string;
    backButtonLabel: string;
    backButtonHref: string;
    loading: boolean;
    showSocial?: boolean;
};

export const CardWrapper = ({
    children,
    headerTitle,
    headerLabel,
    backButtonLabel,
    backButtonHref,
    loading,
    showSocial
}: CardWrapperProps) => {
    return (
        <Card>
            <CardHeader>
                <Header label={headerLabel} title={headerTitle}/>
            </CardHeader>
            <CardContent>
                {children}

            </CardContent>
            {showSocial &&(
                <CardFooter>
                    <Social/>
                </CardFooter>
            )}
            <CardFooter>
                <BackButton label={backButtonLabel} href={backButtonHref} loading={loading}/>
            </CardFooter>
        </Card>
    )
}