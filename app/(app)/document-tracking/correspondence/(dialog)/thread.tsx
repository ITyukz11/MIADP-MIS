'use client';

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { SendIcon, ViewIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

interface ThreadProps {
    open: boolean;
    setClose: () => void;
    data: {}
    documentId: string
}

export function ThreadDialog({ open, setClose, data, documentId }: ThreadProps) {
    return (
        <Dialog open={open} onOpenChange={setClose}>
            <DialogContent className="w-full max-w-[750px] overflow-y-auto scrollbar-thin max-h-[95vh] rounded-lg">
                <DialogHeader className="md:text-center">
                    <DialogTitle >Thread</DialogTitle>
                    <DialogDescription>
                        Please encode your routing slip here and ensure to send it once completed.
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <Card className='flex flex-row gap-2 w-full shadow-none'>
                    <CardContent className='p-4 overflow-y-auto space-y-4 w-full'>
                        <div className="grid grid-cols-3 gap-2">
                            <Label>No: <Badge variant={'secondary'}>DTS-01</Badge></Label>
                            <Label>Date: <Badge variant={'secondary'}>July 18, 2024</Badge></Label>
                            <Label>Encoder: <Badge variant={'secondary'}>Errol Robyn M. Abella</Badge></Label>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-2 pt-2">
                            <div>
                                <Label className="text-right">
                                    To
                                </Label>
                                <Input id="name" value="Pedro Duarte" className="col-span-3" />
                            </div>
                            <div>
                                <Label className="text-right">
                                    From
                                </Label>
                                <Input id="name" value="Pedro Duarte" className="col-span-3" />
                            </div>
                        </div>
                        <div className="flex flex-row gap-2">
                            <div className="w-full">
                                <Label className="text-right">
                                    Purpose
                                </Label>
                                <Input id="name" value="Pedro Duarte" className="col-span-3" />
                            </div>
                            <div>
                                <Label>
                                    Attachment
                                </Label>
                                <Button variant="outline">
                                    <ViewIcon size={15} /> View
                                </Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="col-span-2">
                                <Label>
                                    Subject
                                </Label>
                                <Textarea className='text-xs sm:text-sm' placeholder="Type your subject here." />
                            </div>
                            <div className="col-span-1">
                                <Label>
                                    Remarks
                                </Label>
                                <Textarea className='text-xs sm:text-sm' placeholder="Type your remarks here if any..." />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <DialogFooter>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <Textarea placeholder="Comment as Errol Robyn M. Abella..." />
                    <Button>
                        <SendIcon />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
