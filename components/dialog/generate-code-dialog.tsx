"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Form, FormField } from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingSpinner } from "../LoadingSpinner";
import FormFieldWrapper from "../FormFieldWrapper";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import FinishedGeneratedCode from "./finished-generated-code-dialog";
import {
  codeAncestralDomain,
  codeComponent,
  codeProvince,
  codeRegion,
  codeType,
} from "@/app/(app)/admin/generate-code/(datas)/data";
import { GenerateCodeSchema } from "@/schemas/forms/generatecode";
import { FormError } from "../form-error";
import { insertSubProjectCode } from "@/actions/subproject/insertSubProjectCode";
import { avoidDefaultDomBehavior, handleKeyDown } from "@/utils/dialogUtils";
import { TbNumber123 } from "react-icons/tb";
import { useSession } from "next-auth/react";

interface GenerateCodeDialogProps {
  open: boolean;
  close: () => void;
}

function GenerateCodeDialog({ open, close }: GenerateCodeDialogProps) {
  const [loading, setLoading] = useState(false); // Initialize loading state
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [finishedGenerate, setFinishedGenerate] = useState<boolean>(false);
  const [subProjectTitle, setSubProjectTitle] = useState<string>("");
  const [subProjectInformations, setSubProjectInformations] = useState<object>(
    {}
  );
  const [subProjectADLocation, setSubProjectADLocation] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { data: currentUser } = useSession();

  const form = useForm<z.infer<typeof GenerateCodeSchema>>({
    resolver: zodResolver(GenerateCodeSchema),
    defaultValues: {
      subprojectTitle: "",
      component: "",
      sharedFundingWithInfra: false,
      region: "",
      province: "",
      ancestralDomainLoc: "",
      type: "",
      municipality: "",
      coordinate: "",
      physicalIndicator: "",
      tepc: "",
      briefDescription: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof GenerateCodeSchema>) => {
    setLoading(true);

    console.log("ON SUBMIT VALUES: ", values);
    try {
      const component =
        codeComponent.find((item) => item.value === values.component)?.label ||
        values.component;
      // Fetch the count of subproject codes from the API
      const response = await fetch(
        `/api/subproject/count?component=${component}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch subproject code count");
      }

      const data = await response.json();

      console.log("count data: ", data);
      const count = data.count || 0;

      // Set the sequentialNum based on the count + 1
      const sequentialNum = (count + 1).toString().padStart(4, "0"); // Ensure a 4-digit format (e.g., "0001", "0002")

      const code =
        "MIADP-" +
        values.component +
        "-" +
        values.region +
        "-" +
        values.province +
        "-AD-" +
        values.ancestralDomainLoc +
        "-" +
        values.type +
        "-" +
        sequentialNum;
      console.log("codecode: ", code);

      // Replace certain fields with their label counterparts
      values.component =
        codeComponent.find((item) => item.value === values.component)?.label ||
        values.component;
      values.province =
        codeProvince.find((item) => item.value === values.province)?.label ||
        values.province;
      values.region =
        codeRegion.find((item) => item.value === values.region)?.label ||
        values.region;
      values.type =
        codeType.find((item) => item.value === values.type)?.label ||
        values.type;

      values.municipality = values?.municipality;

      const ancestralDomainLoc = codeAncestralDomain.find(
        (AD) => AD.value === values.ancestralDomainLoc
      )?.label;

      // Prepare data for insertion
      const insertSubprojectInformation = {
        ...values,
        ancestralDomainLoc: ancestralDomainLoc || values.ancestralDomainLoc,
        code: code,
        userId: currentUser?.user.id || "",
        measurement: "",
        sequentialNum: sequentialNum,
      };

      console.log("insertSubprojectInformation: ", insertSubprojectInformation);

      // Insert data using API call or directly (if inside a backend function)
      await insertSubProjectCode(insertSubprojectInformation).then((data) => {
        if (!data.error) {
          setSubProjectTitle(values.subprojectTitle || "");
          setSubProjectInformations(insertSubprojectInformation);
          setSubProjectADLocation(ancestralDomainLoc || "");
          setFinishedGenerate(true);
        } else {
          throw new Error("Failed to insert subproject data");
        }
      });
    } catch (error: any) {
      console.error("Error generating subproject code:", error);
      setError(error);
      alert("An error occurred while generating the subproject code.");
    } finally {
      setLoading(false);
    }
  };

  const selectedRegion = form.watch("region");
  const filteredProvinces = codeProvince.filter(
    (province) => province.region === selectedRegion
  );

  const selectedType = form.watch("component");
  const filteredType = codeType.filter((type) => type.type === selectedType);

  const filteredAncestralDomainLoc = codeAncestralDomain.filter(
    (AD) => AD.region === selectedRegion
  );
  const filteredMunicipality = codeAncestralDomain.find(
    (AD) => AD.value === form.watch("ancestralDomainLoc")
  );

  console.log(form.formState.errors);
  console.log("subprojectTitle:", form.watch("subprojectTitle"));
  console.log("form: ", form.watch("municipality"));
  return (
    <>
      <Dialog open={open} onOpenChange={close}>
        <DialogContent
          className="min-w-[60%] overflow-y-auto scrollbar-thin max-h-[95vh] "
          onPointerDownOutside={avoidDefaultDomBehavior}
          onInteractOutside={avoidDefaultDomBehavior}
          onKeyDown={handleKeyDown}
        >
          <DialogHeader>
            <DialogTitle>Generate Sub Project Code</DialogTitle>
            <DialogDescription>
              *Please make sure all the details are correct before generating!
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
              autoComplete="off"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-4">
                  <FormFieldWrapper
                    control={form.control}
                    name="subprojectTitle"
                    label="Subproject Title"
                    isFocus
                    isDisabled={loading}
                    placeholder="Input Subproject Title"
                    tabIndex={1}
                  />

                  <FormFieldWrapper
                    control={form.control}
                    name="component"
                    label="Component"
                    type="select"
                    selectOptions={codeComponent.map((data) => ({
                      label: data.label,
                      value: data.value,
                    }))}
                    isDisabled={loading}
                    placeholder="Select Component"
                    tabIndex={2}
                  />
                  <FormFieldWrapper
                    control={form.control}
                    name="type"
                    label="Type"
                    type="select"
                    selectOptions={filteredType.map((data) => ({
                      label: data.label,
                      value: data.value,
                    }))}
                    isDisabled={loading || !selectedType}
                    placeholder="Select Type"
                    tabIndex={3}
                  />
                  <FormFieldWrapper
                    control={form.control}
                    name="region"
                    label="Region"
                    type="select"
                    selectOptions={codeRegion.map((data) => ({
                      label: data.label,
                      value: data.value,
                    }))}
                    isDisabled={loading}
                    placeholder="Select Region"
                    tabIndex={4}
                  />
                  <FormFieldWrapper
                    control={form.control}
                    name="province"
                    label="Province"
                    type="select"
                    selectOptions={filteredProvinces.map((data) => ({
                      label: data.label,
                      value: data.value,
                    }))}
                    isDisabled={loading || !selectedRegion} // Disable if no region is selected
                    placeholder="Select Province"
                    tabIndex={5}
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <FormFieldWrapper
                    control={form.control}
                    name="ancestralDomainLoc"
                    label="Ancestral Domain Location"
                    type="select"
                    selectOptions={filteredAncestralDomainLoc.map((data) => ({
                      label: data.label,
                      value: data.value,
                    }))}
                    isDisabled={loading || !selectedRegion}
                    placeholder="Select AD Location"
                    tabIndex={6}
                  />
                  {
                    // filteredMunicipality && (
                    //filteredMunicipality?.municipality?.split(", ").length > 1 ? (
                    <FormFieldWrapper
                      control={form.control}
                      name="municipality"
                      label="Municipality"
                      type="select"
                      selectOptions={filteredMunicipality?.municipality
                        .split(", ") // Convert the string to an array
                        .map((municipality) => ({
                          label: municipality.trim(), // Trim any extra spaces
                          value: municipality.trim(), // Use the same value for simplicity
                        }))}
                      isDisabled={loading || !filteredMunicipality} // Disable if no region is selected
                      placeholder="Input Municipality"
                      note="(Please select)"
                      tabIndex={8}
                    />
                    //)
                    //)
                    // : (
                    //   <FormFieldWrapper
                    //     control={form.control}
                    //     name="municipality"
                    //     label="Municipality"
                    //     isDisabled={true}
                    //     placeholder="Input Municipality"
                    //     note="(auto generated)"
                    //     tabIndex={8}
                    //     value={filteredMunicipality?.municipality || ""}
                    //   />
                    // )
                  }

                  <FormFieldWrapper
                    control={form.control}
                    name="coordinate"
                    label="Coordinate"
                    isDisabled={true}
                    placeholder="Input Coordinate"
                    tabIndex={10}
                  />
                  {/* <FormFieldWrapper
                    control={form.control}
                    name="physicalIndicator"
                    label="Measurement"
                    isDisabled={loading}
                    note='(please indicate the unit ex. 195.0 sq.m.)'
                    placeholder="Input Measurement"
                    tabIndex={11}
                /> */}
                  <FormFieldWrapper
                    control={form.control}
                    name="briefDescription"
                    label="Brief Description"
                    isOptional
                    isDisabled={loading}
                    placeholder="Input brief description if any ..."
                    tabIndex={12}
                    isTextarea
                  />
                  {/* <FormFieldWrapper
                    control={form.control}
                    name="tepc"
                    label="Total Estimated Project Cost"
                    isDisabled={loading}
                    placeholder="Input TEPC"
                    tabIndex={12}
                    type='number'
                /> */}
                </div>
              </div>
              {form.watch("component") === "EN" && (
                <div className="flex items-center space-x-2 mt-4" tabIndex={3}>
                  <Checkbox
                    id="remember-password"
                    checked={isChecked}
                    onClick={() => setIsChecked(!isChecked)}
                    disabled={loading}
                  />
                  <Label
                    htmlFor="remember-password"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Check if enterprise has shared funding within infrastructure
                  </Label>
                </div>
              )}
              {Object.keys(form.formState.errors).length > 0 ||
                (error && <FormError message={"An error occurred"} />)}
              <div className="flex flex-row justify-end mt-4">
                <Button disabled={loading} type="submit">
                  {loading && <LoadingSpinner />} Submit!
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <FinishedGeneratedCode
        open={finishedGenerate}
        close={() => setFinishedGenerate(!finishedGenerate)}
        SubprojectTitle={subProjectTitle}
        SubprojectInformations={subProjectInformations}
        subProjectADLocation={subProjectADLocation}
      />
    </>
  );
}

export default GenerateCodeDialog;
