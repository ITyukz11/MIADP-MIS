'use client'
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { LoginForm } from "./login-form"
import Autoplay from "embla-carousel-autoplay"


import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"
import { RegisterForm } from "./register-form"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

export const metadata: Metadata = {
    title: "Authentication",
    description: "Authentication forms built using the components.",
}

export default function AuthenticationPage() {
    const [userLogginIn, setUserLogginIn] = useState(true)
    const pathName = usePathname()

    const images = [{
        src: '/miadp-cover.png',
        alt: 'miadp-cover'
    },
    {
        src: '/miadp-pso.jpg',
        alt: 'miadp-pso logo'
    },
    {
        src: '/miadp-region-ix.jpg',
        alt: 'miadp-region-ix logo'
    },
    {
        src: '/miadp-region-x.jpg',
        alt: 'miadp-region-x logo'
    },
    {
        src: '/miadp-region-xi.jpg',
        alt: 'miadp-region-xi logo'
    },
    {
        src: '/miadp-region-xii.jpg',
        alt: 'miadp-region-xii logo'
    },
    {
        src: '/miadp-region-xiii.jpg',
        alt: 'miadp-region-xiii logo'
    },
    {
        src: '/miadp-pso.jpg',
        alt: 'miadp-pso logo'
    },
    ]
    return (

        <div className="container relative">
            <div className="border border-border/80 shadow-2xl rounded-xl container relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">

                <Button
                    variant={'link'}
                    className={"absolute right-4 top-4 md:right-8 md:top-8"}
                    onClick={() => setUserLogginIn(!userLogginIn)}
                >
                    {userLogginIn ? "Don't have an account?" : "Already have an account?"}
                </Button>


                <div className="z-10 relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r justify-between">
                    <div className="absolute inset-0 bg-zinc-900  rounded-l-xl rounded-bl-xl" />
                    <div className="relative z-20 flex items-center text-lg font-medium">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2 h-6 w-6"
                        >
                            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                        </svg>
                        MIADP Management Information System
                    </div>
                    <div className="relative z-20">
                        <Carousel
                            plugins={[
                                Autoplay({
                                    delay: 5000,
                                }),
                            ]}>
                            <CarouselContent>
                                {images.map((image, index) => (
                                    <CarouselItem key={index} className="flex justify-center  cursor-grabbing">
                                        <Image
                                            className="rounded-xl"
                                            key={index}
                                            src={image.src}
                                            alt={image.alt}
                                            width={image.alt == "miadp-cover" ? 800 : 500}
                                            height={300}
                                            priority
                                        />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>

                    </div>

                    <div className="relative z-20">
                        <blockquote className="space-y-2">
                            <p className="text-lg">
                                Welcome to the MIADP Management Information System! Our system efficiently tracks encoded documents, streamlining document management processes for easy access and organization.
                                I-Plan
                            </p>
                            <footer className="text-sm">Binyang Maria</footer>
                        </blockquote>
                    </div>
                </div>
                <div className="lg:p-8">
                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                        <div className="flex flex-row w-full">

                        {userLogginIn?
                  
                        <motion.div
                            key="login"
                            initial={{ x: '-100%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '-100%', opacity: 0 }}
                        >
                            <LoginForm />
                        </motion.div>
                    :
                            <motion.div
                                key="register"
                                initial={{ x: '60%', opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: '100%', opacity: 0 }}
                            >
                                <RegisterForm backToLogin={()=> setUserLogginIn(true)}/>
                            </motion.div>
                      }
                        </div>
                  
                        
                        
                        <p className="px-8 text-center text-sm text-muted-foreground">
                            By clicking continue, you agree to our{" "}
                            <Link
                                href="/auth/login"
                                className="underline underline-offset-4 hover:text-primary"
                            >
                                Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link
                                href="/auth/login"
                                className="underline underline-offset-4 hover:text-primary"
                            >
                                Privacy Policy
                            </Link>
                            .
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}