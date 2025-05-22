import FormFieldWrapper from "@/components/FormFieldWrapper";
import { duringData, postActivityData, preActivityData, WFPActivities2025RPCO09, WFPActivities2025RPCO10, WFPActivities2025RPCO11, WFPActivities2025RPCO12, WFPActivities2025RPCO13, WFPActivities2025RPCOBARMM } from "@/lib/ad-plan/data/data";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CgAttachment } from "react-icons/cg";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover-dialog";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { mindanaoCities, mindanaoProvinces, PSAMindanaoRegions } from "@/lib/data/filter";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { FaMapLocation, FaUsers } from "react-icons/fa6";
import { FaList } from "react-icons/fa";
import { upload } from "@vercel/blob/client";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { toast } from "@/components/ui/use-toast";
import { submitProcessDocReport } from "@/actions/ad-plan/insertProcessDocReport";
import { GrDocument, GrDocumentSound } from "react-icons/gr";
import { sendBulkEmail } from "@/actions/send-bulk-email";
import { useSession } from "next-auth/react";

interface ProcessDocumentReportFormInterface {
  setClose: () => void;
}

export const ProcessDocReportSchema = z.object({
  //1. Activity Brief
  activityTitle: z.string().min(1, "*"),
  WFPActivity: z.string().min(1, "*"),
  activityObjectives: z.string().min(5, "*"),
  dateConducted: z.date({ required_error: "*" }),
  region: z.string().min(1, "*"),
  province: z.string().min(1, "*"),
  city: z.string().min(1, "*"),
  municipality: z.string().min(1, "*"),
  baranggay: z.string().min(1, "*"),
  // moreAddress: z.string().min(1, "*"),
  totalMaleIP: z.string().regex(/^[1-9][0-9]*$/, "*"),
  totalFemaleIP: z.string().regex(/^[1-9][0-9]*$/, "*"),
  totalMaleNonIP: z.string().regex(/^[1-9][0-9]*$/, "*"),
  totalFemaleNonIP: z.string().regex(/^[1-9][0-9]*$/, "*"),
  //2. Process Documentation
  //PRE ACTIVITY
  preActivity: z.string().min(1, "*"),
  preOtherActivity: z.string().optional(),
  preActivityDescription: z.string().min(5, "*"),
  preActivityOutputQty: z.string().regex(/^[1-9][0-9]*$/, "*"),
  preActivityOutputDescription: z.string().min(5, "*"),
  preActivityOutcome: z.string().min(5, "*"),
  preActivityEmergingImpact: z.string().min(5, "*"),
  //DURING ACTIVITY
  during: z.string().min(1, "*"),
  duringOtherActivity: z.string().optional(),
  duringDescription: z.string().min(5, "*"),
  duringOutputQty: z.string().regex(/^[1-9][0-9]*$/, "*"),
  duringOutputDescription: z.string().min(5, "*"),
  duringOutcome: z.string().min(5, "*"),
  duringEmergingImpact: z.string().min(5, "*"),
  //POST ACTIVITY
  postActivity: z.string().min(1, "*"),
  postOtherActivity: z.string().optional(),
  postActivityDescription: z.string().min(5, "*"),
  postActivityOutputQty: z.string().regex(/^[1-9][0-9]*$/, "*"),
  postActivityOutputDescription: z.string().min(5, "*"),
  postActivityOutcome: z.string().min(5, "*"),
  postActivityEmergingImpact: z.string().min(5, "*"),
  //3. Attachments: a) Attendance Sheet, b) Program, c) Photo Documentation, d) Participant's Profile, e) Presentation Materials (REQUIRED MOVs)
  attendanceSheet: z
    .any()
    .refine((file) => file instanceof File, { message: "*" }),
  program: z
    .any()
    .refine((file) => file instanceof File, { message: "*" }),
  photoDocumentation: z
    .any()
    .refine((file) => file instanceof File, { message: "*" }),
  participantsProfile: z
    .any()
    .refine((file) => file instanceof File, { message: "*" }),
  presentationMaterials: z
    .any()
    .refine((file) => file instanceof File, { message: "*" }),
  //Signatories
  preparedByName: z.string().min(1, "*"),
  reviewedByName: z.string().min(1, "*"),
  notedByName: z.string().min(1, "*"),
})

export type ProcessDocReportType = z.infer<typeof ProcessDocReportSchema>;

const ProcessDocumentReportForm = ({ setClose }: ProcessDocumentReportFormInterface) => {
  const { data: currentUser } = useSession();

  const [loading, setLoading] = useState<boolean>(false)
  const form = useForm<z.infer<typeof ProcessDocReportSchema>>({
    resolver: zodResolver(ProcessDocReportSchema),
    defaultValues: {
      activityTitle: "",
      WFPActivity: "",
      activityObjectives: "",
      dateConducted: undefined,
      region: "",
      province: "",
      municipality: "",
      baranggay: "",
      totalMaleIP: "0",
      totalFemaleIP: "0",
      totalMaleNonIP: "0",
      totalFemaleNonIP: "0",
      preActivity: "",
      preOtherActivity: "",
      preActivityDescription: "",
      preActivityOutputQty: "0",
      preActivityOutputDescription: "",
      preActivityOutcome: "",
      preActivityEmergingImpact: "",
      during: "",
      duringOtherActivity: "",
      duringDescription: "",
      duringOutputQty: "",
      duringOutputDescription: "",
      duringOutcome: "",
      duringEmergingImpact: "",
      postActivity: "",
      postActivityDescription: "",
      postActivityOutputQty: "0",
      postActivityOutputDescription: "",
      postActivityOutcome: "",
      postActivityEmergingImpact: "",
      attendanceSheet: undefined,
      program: undefined,
      photoDocumentation: undefined,
      participantsProfile: undefined,
      presentationMaterials: undefined,
      preparedByName: "",
      reviewedByName: "",
      notedByName: "",
    },
  });

  const selectedRegion = form.watch("region") || "";
  const selectedProvince = form.watch("province") || "";
  const selectedCity = form.watch("city") || "";
  const selectedMunicipality = form.watch("municipality") || "";

  useEffect(() => {
    form.setValue("province", ""); // or null, depending on your setup
    form.setValue("city", "")
  }, [form, selectedRegion]);

  console.log("error: ", form.formState.errors)
  const onSubmit = async (data: z.infer<typeof ProcessDocReportSchema>) => {
    setLoading(true);
    try {
      const fileFields = [
        "attendanceSheet",
        "program",
        "photoDocumentation",
        "participantsProfile",
        "presentationMaterials",
      ] as const;
  
      // Upload all files in parallel using Promise.all
      const uploadResults = await Promise.all(
        fileFields.map(async (field) => {
          const file = data[field];
          if (file instanceof File) {
            const blob = await upload(file.name, file, {
              access: "public",
              handleUploadUrl: "/api/avatar/upload", // adjust if needed
            });
            return { field, url: blob.url };
          }
          return { field, url: "" };
        })
      );
  
      // Build the URL mapping
      const uploadedUrls: Partial<Record<typeof fileFields[number], string>> = {};
      uploadResults.forEach(({ field, url }) => {
        if (url) {
          uploadedUrls[field] = url;
        }
      });
  
      // Safely convert dateConducted to ISO string
      const dateConductedISO =
        data.dateConducted instanceof Date
          ? data.dateConducted.toISOString()
          : new Date(data.dateConducted).toISOString();
  
      // Construct final payload with file URLs and serialized date
      const finalPayload = {
        ...data,
        ...uploadedUrls,
        dateConducted: dateConductedISO,
        // Remove File objects from payload by overriding them with URLs or empty strings
        attendanceSheet: uploadedUrls.attendanceSheet || "",
        program: uploadedUrls.program || "",
        photoDocumentation: uploadedUrls.photoDocumentation || "",
        participantsProfile: uploadedUrls.participantsProfile || "",
        presentationMaterials: uploadedUrls.presentationMaterials || "",
      };
  
      console.log("Ready to submit payload:", finalPayload);
  
      try {
        console.log("Calling /api/auth/ad-plan/process-doc-report with:", finalPayload);
        const result = await submitProcessDocReport(finalPayload);
        sendEmailNotification(data)

        console.log("API response:", result);
  
        if (result.success) {
          toast({ title: "Success", description: "Submitted successfully!" });
        } else {
          toast({ title: "Error", description: "Submission failed." });
        }
      } catch (apiError) {
        console.error("Failed to call submitProcessDocReport:", apiError);
        toast({ title: "Error", description: "Failed to submit report to server." });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({ title: "Error", description: "Unexpected error occurred." });
    } finally {
      setLoading(false);
      setClose()
    }
  };

  // const onSubmit = async (data:z.infer<typeof ProcessDocReportSchema>)=>{
  //   sendEmailNotification(data)

    // const reportAttachment = await generateProcDocReportPDF(
    //   data,
    // );
    // const downloadUrl = URL.createObjectURL(reportAttachment);
    // const link = document.createElement("a");
    // link.href = downloadUrl;
    // link.download = `ProcessDocumentReport_${data.activityTitle}.pdf`;
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
  // }
  const sendEmailNotification = async (
    values: z.infer<typeof ProcessDocReportSchema>,
  ) => {
    try {

      const ownerEmail = currentUser?.user.email || ""
      const emails = ["miadp.pso.adplan@gmail.com",ownerEmail]

      if (emails.length === 0) {
        toast({
          title: "No Recipients Found",
          description: "Please input the email first",
          variant: "destructive",
        });
        return;
      }

      const totalParticipants = values.totalFemaleIP + values.totalMaleIP + values.totalFemaleNonIP + values.totalMaleNonIP

      const reportAttachment = await generateProcDocReportPDF(
        values,
      );

      const response = await sendBulkEmail({
        to: emails,
        subject: `📃 MIADP Process Documentation Report Copy ${values.activityTitle}`,
        attachment: reportAttachment,
        text: `Dear Team,

  We are pleased to inform you that the process documentation report for the activity "${values.activityTitle}" has been completed. Here is your copy of the report. You can view the full report in the MIADP MIS portal.

  Brief details are as follows:

  📝 ACTIVITY TITLE: ${values.activityTitle}
  📝 WFP ACTIVITY: ${values.WFPActivity}
  📝 ACTIVITY OBJECTIVES: ${values.activityObjectives}

  📅 DATE CONDUCTED: ${values.dateConducted.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}

  Please review the report and let us know if you have any questions or require further information.
  `,
      });

      if (response.success) {
        toast({
          title: "Email Sent Successfully",
          description: response.success,
        });
      } else {
        toast({
          title: "Email Failed",
          description: response.error || "Unable to send emails.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Unexpected Error",
        description:
          error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  const generateProcDocReportPDF = async (
    processDocumentReportData: ProcessDocReportType,
  ) => {
    const { pdf } = await import("@react-pdf/renderer"); // ✅ Import pdf inside
    const ProcessDocReportPDF = (await import("../../process-documentation-report/ProcessDocReportPDF")).default; // ✅ Dynamic import for component

    const blob = await pdf(
      <ProcessDocReportPDF processDocumentReportData={processDocumentReportData}/>
    ).toBlob();

    return new File([blob], "Employee-Payslip.pdf", {
      type: "application/pdf",
    });
  };
  
  return <div>
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full"
        autoComplete="off"
      >
        <div className="space-y-4 w-full flex flex-col flex-wrap">
          <div className="flex items-center flex-row gap-2 w-full">
            <Label className="font-bold text-2xl md:text-base">Activity Brief</Label>
            <FaList />
          </div>
          <section about="Activity-brief" className="bg-slate-50 px-2 py-4 rounded-xl border-2 border-slate-400 w-full">
            <FormFieldWrapper
              control={form.control}
              label="Activity Title"
              placeholder="Activity Title"
              tabIndex={1}
              isFocus
              name="activityTitle" />
            <FormField
              control={form.control}
              name="WFPActivity"
              render={({ field }) => (
                <FormItem className="flex flex-col mb-2">
                  <FormLabel className="flex flex-row gap-2">WFP Activity <FormMessage /></FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          tabIndex={2}
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? `${WFPActivities2025RPCO09.find(
                              (a) => a.title === field.value
                            )?.region} - ${field.value}`
                            : "Select WFP activity"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="z-[100] w-full p-0 max-h-60">
                      <Command>
                        <CommandInput placeholder="Search activity..." />
                        <CommandList>
                          <CommandEmpty>No activity found.</CommandEmpty>
                          <CommandGroup>
                            {WFPActivities2025RPCO09.map((activity) => (
                              <CommandItem
                                key={activity.id}
                                value={activity.title}
                                onSelect={() => {
                                  form.setValue("WFPActivity", activity.title);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    activity.title === field.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {activity.region} - {activity.title}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
            <FormFieldWrapper
              control={form.control}
              label="Activity Objectives"
              placeholder="Activity Objectives"
              tabIndex={3}
              isTextarea
              name="activityObjectives" />
            {/* <FormFieldWrapper
            control={form.control}
            label="Date Conducted"
            name="dateConducted"
            type="date"
          /> */}
            <FormField
              control={form.control}
              name="dateConducted"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="flex flex-row gap-2">Date Conducted <FormMessage /></FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          tabIndex={4}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                </FormItem>
              )}
            />
          </section>
          <Separator />
          <div className="flex items-center flex-row gap-2 w-full">
            <Label className="font-bold text-2xl md:text-base">Venue</Label>
            <FaMapLocation />
          </div>
          <section about="Venue" className="bg-slate-50 px-2 py-4 rounded-xl border-2 border-slate-400 w-full">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <FormFieldWrapper
                control={form.control}
                label="Region"
                name="region"
                type="select"
                tabIndex={5}
                placeholder="Select region"
                selectOptions={PSAMindanaoRegions.map((region) => ({
                  label: region.label,
                  value: region.value
                }))}
              />

              <FormFieldWrapper
                control={form.control}
                label="Province"
                name="province"
                type="select"
                isDisabled={selectedRegion.length == 0}
                tabIndex={6}
                placeholder="Select province"
                selectOptions={
                  mindanaoProvinces
                    .filter((province) => province.region === selectedRegion)
                    .map((province) => ({
                      label: province.label,
                      value: province.value,
                    }))
                }
              />

              <FormFieldWrapper
                control={form.control}
                label="City"
                name="city"
                type="select"
                isDisabled={selectedProvince.length == 0}
                placeholder="Select city"
                tabIndex={7}
                selectOptions={
                  mindanaoCities
                    .filter((city) => city.province === selectedProvince)
                    .map((city) => ({
                      label: city.label,
                      value: city.value,
                    }))
                }
              />
              <FormFieldWrapper
                control={form.control}
                label="Municipality"
                placeholder="Municipality"
                isDisabled={selectedCity.length == 0}
                tabIndex={8}
                name="municipality" />
              <FormFieldWrapper
                control={form.control}
                label="Baranggay"
                isDisabled={selectedMunicipality.length == 0}
                tabIndex={9}
                placeholder="Baranggay"
                name="baranggay" />
            </div>
          </section>
          <Separator />
          <div className="flex items-center flex-row gap-2 w-full">
            <Label className="font-bold text-2xl md:text-base">Total Number of Participants</Label>
            <FaUsers />
          </div>
          <section about="Total-Participants" className="bg-slate-50 px-2 py-4 rounded-xl border-2 border-slate-400 w-full">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FormFieldWrapper
                control={form.control}
                label="Male IP"
                name="totalMaleIP"
                tabIndex={10}
                placeholder="#"
                type="number"
              />
              <FormFieldWrapper
                control={form.control}
                label="Female IP"
                tabIndex={11}
                placeholder="#"
                name="totalFemaleIP"
                type="number"
              />
              <FormFieldWrapper
                control={form.control}
                label="Male Non-IP"
                tabIndex={12}
                placeholder="#"
                name="totalMaleNonIP"
                type="number"
              />
              <FormFieldWrapper
                control={form.control}
                label="Female Non-IP"
                tabIndex={13}
                placeholder="#"
                name="totalFemaleNonIP"
                type="number"
              />
            </div>
          </section>
          <Separator />
          <div className="flex items-center flex-row gap-2 w-full">
            <Label className="font-bold text-2xl md:text-base">Process Documentations</Label>
            <GrDocument />
          </div>
          <section about="Pre-Activity" className="bg-slate-50 px-2 py-4 rounded-xl border-2 border-slate-400 w-full">
            <div className="flex flex-row gap-2">
              <FormFieldWrapper
                control={form.control}
                label="Pre-Activity"
                name="preActivity"
                tabIndex={14}
                placeholder="Select"
                type="select"
                selectOptions={preActivityData.map((activity)=>({
                  label:activity,
                  value: activity
                }))
                }
              />
              {form.watch("preActivity") == "Others" &&
                <FormFieldWrapper
                  control={form.control}
                  label="Other Pre-Activity"
                  placeholder="Input other pre-activity"
                  tabIndex={15}
                  note="(Please specify)"
                  name="preOtherActivity" />
              }
            </div>
            <FormFieldWrapper
              control={form.control}
              label="Pre-Activity Description and Highlights"
              placeholder="Input description"
              tabIndex={16}
              note="(Please input atleast 5 words)"
              isTextarea
              name="preActivityDescription" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <FormFieldWrapper
                className="md:col-span-1"
                control={form.control}
                tabIndex={17}
                label="Output Quantity"
                name="preActivityOutputQty"
                placeholder="Input output qty"
                type="number"
              />

              <div className="md:col-span-3">
                <FormFieldWrapper
                  control={form.control}
                  label="Output Description"
                  tabIndex={18}
                  placeholder="Input output description"
                  name="preActivityOutputDescription"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-2">
              <FormFieldWrapper
                control={form.control}
                label="Outcome"
                tabIndex={19}
                placeholder="Input outcome description"
                note="(Immediate result/effect)"
                isTextarea
                name="preActivityOutcome" />
              <FormFieldWrapper
                control={form.control}
                tabIndex={20}
                label="Emerging Impact"
                placeholder="Input emerging impact description"
                note="(Long-term effect)"
                isTextarea
                name="preActivityEmergingImpact" />
            </div>
          </section>
          <section about="During" className="bg-slate-50 px-2 py-4 rounded-xl border-2 border-slate-400">
            <div className="flex flex-row gap-2">
              <FormFieldWrapper
                control={form.control}
                label="During Activity"
                name="during"
                tabIndex={21}
                placeholder="Select"
                type="select"
                selectOptions={duringData.map((data) => ({
                  label: data,
                  value: data
                }))}
              />
              {form.watch("during") == "Others" &&
                <FormFieldWrapper
                  control={form.control}
                  label="Other During Activity"
                  tabIndex={22}
                  placeholder="Input other during activity"
                  note="(Please specify)"
                  name="duringOtherActivity" />
              }
            </div>
            <FormFieldWrapper
              control={form.control}
              label="During Activity Description and Highlights"
              placeholder="Input description"
              note="(Please input atleast 5 words)"
              tabIndex={23}
              isTextarea
              name="duringDescription" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <FormFieldWrapper
                className="md:col-span-1"
                control={form.control}
                tabIndex={24}
                label="Output Quantity"
                name="duringOutputQty"
                placeholder="Input output qty"
                type="number"
              />

              <div className="md:col-span-3">
                <FormFieldWrapper
                  control={form.control}
                  tabIndex={25}
                  label="Output Description"
                  placeholder="Input output description"
                  name="duringOutputDescription"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-2">
              <FormFieldWrapper
                control={form.control}
                label="Outcome"
                tabIndex={26}
                placeholder="Input outcome description"
                note="(Immediate result/effect)"
                isTextarea
                name="duringOutcome" />
              <FormFieldWrapper
                control={form.control}
                label="Emerging Impact"
                tabIndex={27}
                placeholder="Input emerging impact description"
                note="(Long-term effect)"
                isTextarea
                name="duringEmergingImpact" />
            </div>
          </section>
          <section about="Post-Activity" className="bg-slate-50 px-2 py-4 rounded-xl border-2 border-slate-400">
            <div className="flex flex-row gap-2">
              <FormFieldWrapper
                control={form.control}
                label="Post-Activity"
                name="postActivity"
                placeholder="Select"
                type="select"
                tabIndex={28}
                selectOptions={postActivityData.map((data) => ({
                  label: data,
                  value: data
                }))}
              />
              {form.watch("postActivity") == "Others" &&
                <FormFieldWrapper
                  control={form.control}
                  label="Other Post-Activity"
                  placeholder="Input other post-activity"
                  note="(Please specify)"
                  name="postOtherActivity"
                  tabIndex={29} />
              }
            </div>
            <FormFieldWrapper
              control={form.control}
              label="Post-Activity Description and Highlights"
              placeholder="Input description"
              note="(Please input atleast 5 words)"
              isTextarea
              name="postActivityDescription"
              tabIndex={30} />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <FormFieldWrapper
                className="md:col-span-1"
                control={form.control}
                label="Output Quantity"
                name="postActivityOutputQty"
                placeholder="Input output qty"
                type="number"
                tabIndex={31}
              />

              <div className="md:col-span-3">
                <FormFieldWrapper
                  control={form.control}
                  label="Output Description"
                  placeholder="Input output description"
                  name="postActivityOutputDescription"
                  tabIndex={32}
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-2">
              <FormFieldWrapper
                control={form.control}
                label="Outcome"
                placeholder="Input outcome description"
                note="(Immediate result/effect)"
                isTextarea
                name="postActivityOutcome"
                tabIndex={33} />
              <FormFieldWrapper
                control={form.control}
                label="Emerging Impact"
                placeholder="Input emerging impact description"
                note="(Long-term effect)"
                isTextarea
                name="postActivityEmergingImpact"
                tabIndex={34} />
            </div>
          </section>
          <Separator />
          <div className="flex items-center flex-row gap-2">
            <Label className="font-bold text-2xl md:text-base">Attachments</Label>
            <CgAttachment />
          </div>
          <section about="Attachments" className="bg-slate-50 px-2 py-4 rounded-xl border-2 border-slate-400">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              <FormFieldWrapper
                control={form.control}
                label="Attendance Sheet"
                name="attendanceSheet"
                type="file"
                tabIndex={35}
              />
              <FormFieldWrapper
                control={form.control}
                label="Program"
                name="program"
                type="file"
                tabIndex={36}
              />
              <FormFieldWrapper
                control={form.control}
                label="Photo Documentation"
                name="photoDocumentation"
                type="file"
                tabIndex={37}
              />
              <FormFieldWrapper
                control={form.control}
                label="Participants Profile"
                name="participantsProfile"
                type="file"
                tabIndex={38}
              />
              <FormFieldWrapper
                control={form.control}
                label="Presentation Materials"
                name="presentationMaterials"
                type="file"
                tabIndex={39}
              />
            </div>
          </section>
          <section about="Signatories" className="bg-slate-50 px-2 py-4 rounded-xl border-2 border-slate-400">
            <div className="grid md:grid-cols-3 gap-2">
              <FormFieldWrapper
                control={form.control}
                label="Prepared By"
                placeholder="Name of the person who prepared the report"
                name="preparedByName"
                description="PSP Officer"
                tabIndex={40}
              />

              <FormFieldWrapper
                control={form.control}
                label="Reviewed By"
                placeholder="Name of the person who reviewed the report"
                name="reviewedByName"
                description="SP Specialist"
                tabIndex={41}
              />

              <FormFieldWrapper
                control={form.control}
                label="Noted By"
                placeholder="Name of the person who noted the report"
                name="notedByName"
                description="Component 1 Head"
                tabIndex={42}
              />
              </div>
          </section>
        </div>
        <div className="flex flex-end">
          <Button type="submit" tabIndex={43} className="ml-auto" disabled={loading}>{loading ? <LoadingSpinner /> : "Submit"}</Button>
        </div>
      </form>
    </Form>
  </div>;
};

export default ProcessDocumentReportForm;

// import { type PutBlobResult } from '@vercel/blob';
// import { upload } from '@vercel/blob/client';
// const inputFileRef = useRef<HTMLInputElement>(null);
// const [blob, setBlob] = useState<PutBlobResult | null>(null);

// <div>
// <h1>Upload Your Avatar</h1>

// <form
//   onSubmit={async (event) => {
//     event.preventDefault();

//     if (!inputFileRef.current?.files) {
//       throw new Error('No file selected');
//     }

//     const file = inputFileRef.current.files[0];

//     const newBlob = await upload(file.name, file, {
//       access: 'public',
//       handleUploadUrl: '/api/avatar/upload',
//     });

//     setBlob(newBlob);
//   }}
// >
//   <input name="file" ref={inputFileRef} type="file" required />
//   <button type="submit">Upload</button>
// </form>
// {blob && (
//   <div>
//     Blob url: <a href={blob.url}>{blob.url}</a>
//   </div>
// )}
// </div>