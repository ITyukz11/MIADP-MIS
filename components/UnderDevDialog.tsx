import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface UnderDevelopmentDialogProps {
    title?: string;
    description?: string;
    onClose?: () => void;
    open: boolean;
}

export function UnderDevelopmentDialog({
    title = "Under Development!",
    description = "I'm sorry, this feature is still under development.",
    onClose,
    open
}: UnderDevelopmentDialogProps) {
    // State to hold the selected random image
    const [randomImage, setRandomImage] = useState<string>("");

    // Effect to set a random image when the dialog opens
    useEffect(() => {
        if (open) {
            // Array of image file names
            const images = [
                "/under-development/1.png",
                "/under-development/2.png",
                "/under-development/3.png",
                "/under-development/4.png",
                "/under-development/5.png",
                "/under-development/6.png",
            ];

            const randomIndex = Math.floor(Math.random() * images.length);
            setRandomImage(images[randomIndex]);
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                {/* Render the random image */}
                <div className="flex justify-center">
                    {randomImage && (
                        <Image
                            src={randomImage}
                            alt="Under Development"
                            width={300} // Adjust width as needed
                            height={200} // Adjust height as needed
                            className="rounded-lg" // Optional styling
                        />
                    )}
                </div>
                <DialogFooter>
                    <Button type="button" onClick={onClose}>
                        Ok. I understand
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
