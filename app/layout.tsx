import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Inter } from "next/font/google"


const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "MMIS",
  description: "MIADP Information Management System",
};

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
    <head />
    <body className={inter.className} suppressHydrationWarning={true}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}  
        <Toaster />
      </ThemeProvider>
    </body>
  </html>
  );
}
