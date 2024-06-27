
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"
import { register } from "@/actions/register"
import { startTransition, useState } from "react"
import { RegisterSchema } from "@/schemas"
import { z } from "zod"
import { toast } from "../ui/use-toast"
import { ToastAction } from "../ui/toast"
import { LoadingSpinner } from "../LoadingSpinner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

interface DialogApprovePendingUsersProps<TData> {
    approvedPendingUsersData: Array<TData & { id?: number, name?: string, email?: string, region?: string, color?:string, password?: string }>
    disable: boolean
}

export function DialogApprovePendingUsers<TData>({ approvedPendingUsersData, disable }: DialogApprovePendingUsersProps<TData>): JSX.Element {
    const [loading, setLoading] = useState(false)
    // console.log("approvedPendingUsersData: ", approvedPendingUsersData)
    const [open, setOpen] = useState(false)

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            region: "",
            email: "",
            password: "",
            fullname: "", // Add a default value for fullname
            color:""
        }
    });
    
    // Iterate over each item in approvedPendingUsersData and set form values
    approvedPendingUsersData.forEach(user => {
        form.setValue("region", user.region || ""); // Provide a default value if region is undefined
        form.setValue("fullname", user.name || ""); // Assuming 'name' corresponds to 'fullname'
        form.setValue("email", user.email || "");
        form.setValue("password", user.password || "");
        form.setValue("color", user.color || "");
    });
    
    const onSubmit = async () => {
        const values = form.getValues(); // Get the form values
        startTransition(() => {
            setLoading(true);
            register(values)
                .then((data) => {
                    setTimeout(() => {
                        if (!data.error) {
                            toast({
                                title: "Approved Pending Users",
                                description: "They can now login.",
                                duration: 10000,
                                action: (
                                    <ToastAction altText="Goto schedule to undo">Ok</ToastAction>
                                ),
                            });
                        }
                        location.reload();
                        setLoading(false);
                        setOpen(false)
                        // document.getElementById('closeDialog')?.click();


                    }, 2000); // Delay for 2 seconds
                });
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {/* <DialogTrigger asChild>
                <Button size="sm" onClick={submit} disabled={disableApproveButton||disable}>Approve</Button>
            </DialogTrigger> */}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Approving pending users</DialogTitle>
                    <DialogDescription>
                        Please review the list of users intended for approval to ensure accuracy and correctness.
                    </DialogDescription>
                    <Separator />
                </DialogHeader>
                <div className="flex gap-2">
                    {approvedPendingUsersData ? (
                        approvedPendingUsersData.map(item => (
                            <Badge variant={'outline'} key={item.id} className="w-fit cursor-default font-bold">{item.name}</Badge>
                        ))
                    ) : (
                        <span>No data available</span>
                    )}
                </div>


                <DialogFooter>
                    <Button type="button" onClick={onSubmit} disabled={loading}>
                        {loading && <LoadingSpinner />} Submit
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    )
}
