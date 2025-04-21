"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { avoidDefaultDomBehavior, handleKeyDown } from "@/utils/dialogUtils";
import { useUsersData } from "@/lib/users/useUserDataHook";
import { UserType } from "@/types/users/userType";
import { Cat, Dog, Fish, Rabbit, Turtle } from "lucide-react";
// import DTRUploader from "@/app/(app)/(components)/DTRUploader";
// import DailyTimeRecord from "@/app/(app)/(components)/DTRUploader";

interface RequestTravelOrderDialogProps {
  open: boolean;
  close: () => void;
}

const TravelOrderSchema = z.object({
  travelers: z.string().min(1, "*"),
  departureDate: z.date(),
  destination: z.string().min(1, "*"),
  officeStation: z.string().min(1, "*"),
  placesToBeVisited: z.string().min(1, "*"),
  purposeActivity: z.string().min(1, "*"),
  objectives: z.string().min(1, "*"),
});

function RequestTravelOrderDialog({
  open,
  close,
}: RequestTravelOrderDialogProps) {
  const [loading, setLoading] = useState(false); // Initialize loading state
  const [error, setError] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("PSO");
  const { usersData } = useUsersData();

  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([
    "react",
    "angular",
  ]);

  const form = useForm<z.infer<typeof TravelOrderSchema>>({
    resolver: zodResolver(TravelOrderSchema),
    defaultValues: {},
  });
  const onSubmit = async (values: z.infer<typeof TravelOrderSchema>) => {
    setLoading(true);

    try {
      console.log("ON SUBMIT VALUES: ", values);
    } catch (error: any) {
      console.error("Error generating subproject code:", error);
      setError(error);
      alert("An error occurred while generating the subproject code.");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsersPerRegion = usersData
    ? usersData.filter((user: UserType) => user.region == selectedRegion)
    : [];

  const frameworksList = [
    { value: "react", label: "React", icon: Turtle },
    { value: "angular", label: "Angular", icon: Cat },
    { value: "vue", label: "Vue", icon: Dog },
    { value: "svelte", label: "Svelte", icon: Rabbit },
    { value: "ember", label: "Ember", icon: Fish },
  ];

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent
        className="min-w-[50%] overflow-y-auto scrollbar-thin max-h-[95vh] "
        onPointerDownOutside={avoidDefaultDomBehavior}
        onInteractOutside={avoidDefaultDomBehavior}
        onKeyDown={handleKeyDown}
      >
        <DialogHeader>
          <DialogTitle>Request for Travel Order</DialogTitle>
          <DialogDescription>
            *Please make sure all the details are correct before submitting!
          </DialogDescription>
        </DialogHeader>
        {/* <DailyTimeRecord /> */}
        {/* <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            autoComplete="off"
          >
            <MultiSelect
              options={frameworksList}
              onValueChange={setSelectedFrameworks}
              defaultValue={selectedFrameworks}
              placeholder="Select frameworks"
              variant="inverted"
              animation={2}
              maxCount={3}
            />
            <FormFieldWrapper
              name="travelers"
              control={form.control}
              label="Choose the name of the traveler(s)"
              type="select"
              selectOptions={filteredUsersPerRegion.map((user: UserType) => ({
                label: user.name,
                value: user.name,
              }))}
            />
          </form>
        </Form> */}
      </DialogContent>
    </Dialog>
  );
}

export default RequestTravelOrderDialog;
