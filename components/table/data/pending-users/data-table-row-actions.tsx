"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { pendingUsersSchema } from "./schema"
import { labels } from "../data"
import { startTransition, useState } from "react"
import { register } from "@/actions/register"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { useForm } from "react-hook-form"
import { RegisterSchema } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import DialogView from "@/components/dialog/dialog-view"

interface DataTableRowActionsProps {
  rowData: {
    region: string;
    name: string;
    email: string;
    password: string;
    position: string;
    color:string;
    component: string;
    unit: string;
  };
}

export function DataTableRowActions({ rowData }: DataTableRowActionsProps) {

  console.log("rowData: ", rowData);
  const [loading, setLoading] = useState(false); // Initialize loading state
  const [dialogViewOpen, setDialogViewOpen] = useState(false);
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      region: rowData.region || "",
      fullname: rowData.name || "",
      email: rowData.email || "",
      component: rowData.component || "",
      unit: rowData.unit || "",
      position: rowData.position || "",
      password: rowData.password || "",
      color: rowData.color || "",
    }
  });

  const handleApprovePendingUser = async (e: any) => {
    e.preventDefault();

    const values = form.getValues(); // Get the form values

    console.log("values: ", values)
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
            } else {
              alert(data.error);
            }
            setLoading(false);
          }, 2000);
        });
    });
  };


  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => setDialogViewOpen(true)}>View Details</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={(e) => handleApprovePendingUser(e)}>Approve</DropdownMenuItem>
          <DropdownMenuItem>Reject</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogView viewDatas={rowData} open={dialogViewOpen} close={()=> setDialogViewOpen(false)}/>

    </div>

  )
}