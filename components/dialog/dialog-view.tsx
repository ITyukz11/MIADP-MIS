import React, { useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu'
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { RegisterSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingSpinner } from '../LoadingSpinner';


interface DialogViewProps {
  viewDatas: {
    region: string;
    name: string;
    email: string;
    password: string;
    position: string;
    component: string;
    unit: string;
  },
  open: boolean;
  close:()=> void;
}


function DialogView({ viewDatas, open, close}: DialogViewProps) {
  const [loading, setLoading] = useState(false); // Initialize loading state
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      region: viewDatas.region,
      email: viewDatas.email,
      component: viewDatas.component,
      unit: viewDatas.unit,
      position: viewDatas.position,
      fullname: viewDatas.name,
    }
  })
console.log("viewDatas: ", viewDatas)
  const pendingUserData = [
    {
      name: "fullname" as "fullname",
      label: "Fullname"
    },
    {
      name: "email" as "email",
      label: "Email"
    },
    {
      name: "region" as "region",
      label: "Region"
    },
    {
      name: "component" as "component",
      label: "Component"
    },
    {
      name: "unit" as "unit",
      label: "Unit"
    },
    {
      name: "position" as "position",
      label: "Position"
    },
  ];
  
  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="min-w-[30%] overflow-y-auto scrollbar-thin max-h-[95vh] ">
        <DialogHeader>
          <DialogTitle>Pending Account Details</DialogTitle>
          <DialogDescription>
            Don&apos;t forget to approve or reject this pending user.
          </DialogDescription>

        </DialogHeader>
        <Form  {...form}>
          <form //onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            autoComplete="off" >
            <div className="space-y-4">
              {pendingUserData.map((data, index) => (
                <FormField
                  key={index}
                  control={form.control}
                  name={data.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{data.label}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          readOnly
                          disabled={loading}
                          style={{ userSelect: 'none' }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}

            </div>
            <div className='flex flex-row justify-end'>
            <Button
            className='mr-1'
                variant={'destructive'}
                disabled={loading}
              >
                {loading && <LoadingSpinner />}  Reject
              </Button>
              <Button
                disabled={loading}
              >
                {loading && <LoadingSpinner />}  Approve
              </Button>
            </div>

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default DialogView