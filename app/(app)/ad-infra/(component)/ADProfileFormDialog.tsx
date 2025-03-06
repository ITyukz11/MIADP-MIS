"use client";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormFieldWrapper from "@/components/FormFieldWrapper";
import { avoidDefaultDomBehavior, handleKeyDown } from "@/utils/dialogUtils";
import {
  regionOptions,
  SubprojectType,
  SubprojectUnitOptions,
} from "@/lib/data/filter";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import axios from "axios";

const SPPFormSchema = z.object({
  name: z.string().min(1, "*"),
  region: z.string().min(1, "*"),
  ancestralDomain: z.string().min(1, "*"),
  location: z.string().min(1, "*"),
  subprojectType: z.string().min(1, "*"),
  indicativeCost: z.number().min(1, "*"),
  remarks: z.string().optional(),
  validation: z.string().min(1, "*"),
  cn: z.string().min(1, "*"),
  dedpowfs: z.string().min(1, "*"),
  fsarjtr: z.string().min(1, "*"),
  rpab: z.string().min(1, "*"),
  length: z.string().min(1, "*"),
  unit: z.string().min(1, "*"),
});

const ADProfileFormDialog = () => {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof SPPFormSchema>>({
    resolver: zodResolver(SPPFormSchema),
    defaultValues: {
      name: "",
      region: "",
      ancestralDomain: "",
      location: "",
      subprojectType: "",
      indicativeCost: 0,
      remarks: "",
      validation: "",
      cn: "",
      dedpowfs: "",
      fsarjtr: "",
      rpab: "",
      length: "",
      unit: "",
    },
  });

  const formatFormData = (values: any) => {
    const keyValuePairs = [
      `Subproject Name=${encodeURIComponent(values.name)}`,
      `Region=${encodeURIComponent(values.region)}`,
      `Ancestral Domain=${encodeURIComponent(values.ancestralDomain)}`,
      `Location=${encodeURIComponent(values.location)}`,
      `Subproject Type=${encodeURIComponent(values.subprojectType)}`,
      `Indicative Cost=${encodeURIComponent(values.indicativeCost)}`,
      `Remarks=${encodeURIComponent(values.remarks)}`,
      `Validation=${encodeURIComponent(values.validation)}`,
      `CN=${encodeURIComponent(values.cn)}`,
      `DED/POW/FS=${encodeURIComponent(values.dedpowfs)}`,
      `FSAR/JTR=${encodeURIComponent(values.fsarjtr)}`,
      `RPAB=${encodeURIComponent(values.rpab)}`,
      `Length=${encodeURIComponent(values.length)}`,
      `Unit=${encodeURIComponent(values.unit)}`,
    ];

    return keyValuePairs.join("&");
  };

  const onSubmit = async (values: any) => {
    const formattedData = formatFormData(values);
    console.log(formattedData);
    console.log("values: ", values);
    console.log("formattedData: ", formattedData);

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbxCqurV_MSp5v3X_5Jya8LmbZoXrl7FSgrYVLG7C465LbzjzHaWYYc5_4ju1AJJ_mKmPw/exec",
        {
          method: "POST",
          body: formattedData,
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          mode: "no-cors", // <- Add this
        }
      );

      console.log("Success:", response);
    } catch (error) {
      console.error("Error submitting form data:", error);
    }
  };

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form;

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setOpen(true)}>Open Subproject Form</Button>
        </DialogTrigger>
        <DialogContent
          className="w-full max-w-4xl overflow-y-auto scrollbar-thin max-h-[95vh] rounded-lg"
          onPointerDownOutside={avoidDefaultDomBehavior}
          onInteractOutside={avoidDefaultDomBehavior}
          onKeyDown={handleKeyDown}
        >
          <DialogHeader>
            <DialogTitle>SUBPROJECT FORM</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormFieldWrapper
                  control={control}
                  name="name"
                  label="Name of Subproject"
                  placeholder="Enter subproject name"
                  className="col-span-1 md:col-span-2"
                  isTextarea
                  isFocus
                  tabIndex={1}
                />
                <FormFieldWrapper
                  control={control}
                  name="region"
                  label="Region"
                  placeholder="Select region"
                  type="select"
                  selectOptions={regionOptions.map((region) => ({
                    value: region,
                    label: region,
                  }))}
                  tabIndex={2}
                />
                <FormFieldWrapper
                  control={control}
                  name="ancestralDomain"
                  label="Ancestral Domain"
                  placeholder="Enter ancestral domain"
                  tabIndex={3}
                />
                <FormFieldWrapper
                  control={control}
                  name="subprojectType"
                  label="Subproject Type"
                  placeholder="Select"
                  type="select"
                  selectOptions={SubprojectType.map((type) => ({
                    value: type,
                    label: type,
                  }))}
                  tabIndex={4}
                />

                <FormFieldWrapper
                  control={control}
                  name="indicativeCost"
                  label="Indicative Cost"
                  placeholder="0.00"
                  type="amount"
                  tabIndex={5}
                />
                <FormFieldWrapper
                  control={control}
                  name="location"
                  label="Location"
                  placeholder="Enter location"
                  tabIndex={6}
                />
                <FormFieldWrapper
                  control={control}
                  name="remarks"
                  label="Remarks"
                  placeholder="Enter remarks"
                  tabIndex={7}
                />
              </div>

              <Separator />
              <h2 className="text-lg font-semibold">Timeline (Indicative)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormFieldWrapper
                  control={control}
                  name="validation"
                  label="Validation"
                  type="date"
                  tabIndex={8}
                />
                <FormFieldWrapper
                  control={control}
                  name="cn"
                  label="Concept Note"
                  type="date"
                  tabIndex={9}
                />
                <FormFieldWrapper
                  control={control}
                  name="dedpowfs"
                  label="DED, POW, FS"
                  type="date"
                  tabIndex={10}
                />
                <FormFieldWrapper
                  control={control}
                  name="fsarjtr"
                  label="FSAR, JTR"
                  type="date"
                  tabIndex={11}
                />
                <FormFieldWrapper
                  control={control}
                  name="rpab"
                  label="RPAB"
                  type="date"
                  tabIndex={12}
                />
              </div>
              <Separator />
              <h2 className="text-lg font-semibold">
                Physical Indicator (Indicative)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormFieldWrapper
                  control={control}
                  name="length"
                  label="Length"
                  placeholder="Length/Ha/HH/Area:"
                  tabIndex={13}
                />
                <FormFieldWrapper
                  control={control}
                  name="unit"
                  label="Unit"
                  placeholder="Select"
                  type="select"
                  selectOptions={SubprojectUnitOptions.map((type) => ({
                    value: type,
                    label: type,
                  }))}
                  tabIndex={14}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
                tabIndex={15}
              >
                {isSubmitting ? <LoadingSpinner /> : "Submit"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ADProfileFormDialog;
