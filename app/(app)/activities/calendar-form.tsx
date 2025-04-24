"use client";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { DatePicker } from "antd";
import { TimePicker } from "antd";
import dayjs from "dayjs";
import { CalendarOfActivitySchema } from "@/schemas/calendar-of-activity";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import {
  PreparatoryActivityStatus,
  TypeData,
} from "@/components/calendar-of-activity/data";
import { ToastAction } from "@/components/ui/toast";
import { calendarOfActivity } from "@/actions/calendar-of-activity/calendarofactivity";
import { toast } from "@/components/ui/use-toast";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import axios from "axios";
import { formatDate } from "@/components/table/data/activities/coa-columns";
import { Badge } from "@/components/ui/badge";
import { regionOptions } from "@/lib/data/filter";
import { MdPeopleAlt } from "react-icons/md";
import { Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { FancyMultiSelect, Framework } from "@/components/MultiSelect";
import { UserType } from "@/types/users/userType";
import { fetchActivitiesData } from "@/app/store/activityAction";
import { useDispatch, useSelector } from "@/app/store/store";
import { TypeOfActivity } from "@/components/forms/data";
import { TooltipComponent } from "@/components/Tooltip";
import { IoInformationCircleOutline } from "react-icons/io5";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import { Switch } from "@/components/ui/switch";
import { FaX } from "react-icons/fa6";
import { userAgent } from "next/server";
import FormFieldWrapper from "@/components/FormFieldWrapper";
import { useActivitiesData } from "@/lib/calendar-of-activity/useActivitiesDataHook";
import { useSession } from "next-auth/react";
import { sendBulkEmail } from "@/actions/send-bulk-email";
import { format, parseISO } from "date-fns"
import { useUsersData } from "@/lib/users/useUserDataHook";

export const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });

type Props = {
  setDialogClose: () => void;
  individualActivity_: boolean;
};

export const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    [
      "link",
      // 'image'
    ],
    [{ align: [] }],
    [{ color: [] }],
    // ['code-block'],
    ["clean"],
  ],
};

export const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "link",
  //   'image',
  "align",
  "color",
  // 'code-block',
];

const CalendarForm = ({ setDialogClose, individualActivity_ }: Props) => {
  const { usersData, usersLoading, usersError, refetchUsers } = useUsersData();

  const { data: currentUser } = useSession();

  const [filteredUsersData, setFilteredUsersData] = useState<UserType[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<String[]>(
    []
  );

  const [multiSelectUsersDropdownData, setMultiSelectUsersDropdownData] =
    useState<Framework[]>([]);

  const [isPending, startTransition] = useTransition();
  const [loadingForm, setLoadingForm] = useState(false); // Initialize loadingForm state

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const [allDayChecked, setAllDayChecked] = useState(false);
  const { RangePicker } = DatePicker;

  // const { loading, fetchActivitiesData } = useCalendarOfActivityContext();
  const { activityLoading } = useSelector((state) => state.activity);
  const dispatch = useDispatch();
  const { refetchActivities } = useActivitiesData();

  const [filterRegion, setFilterRegion] = useState(currentUser?.user.region);

  const [participantError, setParticipantError] = useState(false);
  const [preparatoryError, setPreparatoryError] = useState(false);
  const [scheduleError, setScheduleError] = useState(false);
  const [dateToError, setDateToError] = useState(false);
  const [preparatoryContentError, setPreparatoryContentError] = useState(false);

  // const [WFPYear, setWFPYear] = useState(new Date().getFullYear().toString());

  const form = useForm<z.infer<typeof CalendarOfActivitySchema>>({
    resolver: zodResolver(CalendarOfActivitySchema),
    defaultValues: {
      authorizeOther: false,
      individualActivity: individualActivity_,
      WFPYear: new Date().getFullYear().toString(),
      activityTitle: "",
      activityDescription: "",
      targetParticipant: "",
      location: "", // optional field, can be omitted if you don't want a default value
      type: "",
      otherType: "",
      dateFrom: dayjs().format("YYYY-MM-DD"),
      dateTo: dayjs().format("YYYY-MM-DD"),
      timeStart: "",
      timeEnd: "",
      allDay: false,
      participants: [],
      color: "#F5222D",
      status: "", // default value specified in the schema
      listMode: false,
      preparatoryList: [{ description: "", status: "", remarks: "" }],
      preparatoryContent: "",
      calendarOfActivityAttachment: [{ details: "", link: "" }],
      remarks: "",
      name: currentUser?.user.name || "",
    },
  });

  // console.log("preparatoryContent: ", form.watch('preparatoryContent'))

  const handleEditorChange = (newContent: any) => {
    form.setValue("preparatoryContent", newContent);
  };
  const {
    control,
    watch,
    formState: { errors },
  } = form;

  console.log("individualActivity: ", watch("individualActivity"));
  const {
    fields: participantFields,
    append: appendParticipant,
    remove: removeParticipant,
  } = useFieldArray({
    control,
    name: "participants",
  });

  const {
    fields: preparatoryListFields,
    append: appendPreparatoryList,
    remove: removePreparatoryList,
  } = useFieldArray({
    control,
    name: "preparatoryList",
  });

  const validatePreparatoryList = () => {
    const preparatoryList = watch("preparatoryList");

    for (const item of preparatoryList as any) {
      // Check if description is blank and status is blank
      if (!item.description || !item.status) {
        return false;
      }

      // If status is 'Other', check if remarks is blank
      if (item.status === "Other" && !item.remarks) {
        return false;
      }
    }

    return true;
  };

  const {
    fields: attachmentFields,
    append: appendAttachments,
    remove: removeAttachments,
  } = useFieldArray({
    control,
    name: "calendarOfActivityAttachment",
  });

  // const onSubmit = async (values: z.infer<typeof CalendarOfActivitySchema>) => {
  //   const today = new Date();
  //   const todayFormatted = new Date(
  //     today.getFullYear(),
  //     today.getMonth(),
  //     today.getDate()
  //   );
  //   let status = "Upcoming";
  //   if (values.dateFrom) {
  //     // Convert dateFrom to local timezone
  //     const localDateFrom = new Date(values.dateFrom);
  //     // Adjust localDateFrom to match only the date (without time)
  //     const localDateFromFormatted = new Date(
  //       localDateFrom.getFullYear(),
  //       localDateFrom.getMonth(),
  //       localDateFrom.getDate()
  //     );

  //     // Compare localDateFromFormatted with todayFormatted
  //     if (localDateFromFormatted.getTime() <= todayFormatted.getTime()) {
  //       status = "Ongoing";
  //     }
  //   }

  //   if (!navigator.onLine) {
  //     // Alert the user that there is no internet connection
  //     alert(
  //       "No internet connection. Please check your network connection and try again."
  //     );
  //     return;
  //   }

  //   let participantError = false;
  //   let preparatoryError = false;
  //   let scheduleError = false;
  //   let dateToError = false;

  //   if (!allDayChecked) {
  //     if (!values.timeStart || !values.timeEnd) {
  //       scheduleError = true;
  //     } else {
  //       setScheduleError(false);
  //       scheduleError = false;
  //     }
  //   }

  //   if (allDayChecked) {
  //     if (values.dateFrom == values.dateTo) {
  //       dateToError = true;
  //     } else {
  //       dateToError = false;
  //       setDateToError(false);
  //     }
  //   }

  //   if (scheduleError) {
  //     setScheduleError(true);
  //     return;
  //   } else {
  //     setScheduleError(false);
  //   }

  //   if (dateToError) {
  //     setDateToError(true);
  //     return;
  //   }

  //   if (participantError) {
  //     setParticipantError(true);
  //     return;
  //   } else {
  //     setParticipantError(false);
  //   }
  //   const isValid = validatePreparatoryList();
  //   if (
  //     (!form.watch("listMode") && !watch("preparatoryContent")) ||
  //     (form.watch("listMode") && !isValid)
  //   ) {
  //     setPreparatoryContentError(true);
  //     return;
  //   } else {
  //     setPreparatoryContentError(false);
  //   }

  //   values.status = status;
  //   (values.dateFrom = values.dateFrom.split("T")[0]),
  //     (values.dateTo = values.dateTo.split("T")[0]),
  //     setError("");
  //   setSuccess("");
  //   startTransition(() => {
  //     setLoadingForm(true);
  //     calendarOfActivity(values).then((data) => {
  //       setError(data.error);
  //       setSuccess(data.success);
  //       setTimeout(async () => {
  //         if (!data.error) {
  //           try {
  //             // currentUser?.user.expoPushToken &&
  //             //   sendPushNotificationToMobileUser(
  //             //     currentUser?.user.expoPushToken,
  //             //     `New activity by ${currentUser?.name}`,
  //             //     `${currentUser?.user.component} | ${currentUser?.user.unit} - ${
  //             //       values.activityTitle
  //             //     }\n${values.activityDescription}\n${formatDate(
  //             //       values.dateFrom as any
  //             //     )} - ${formatDate(values.dateTo as any)}`
  //             //   );
  //             try {
  //               // Extract emails from usersData based on selected participants
  //               const selectedParticipants = form.watch("participants") || [];

  //               const emails = usersData
  //                 .filter((user) =>
  //                   selectedParticipants.some(
  //                     (participant) => participant.userId === user.id
  //                   )
  //                 )
  //                 .map((user) => user.email); // Ensure you extract the email field

  //               if (emails.length === 0) {
  //                 toast({
  //                   title: "No recipients found",
  //                   description: "Please select participants with valid emails.",
  //                   variant: "destructive",
  //                 });
  //                 return;
  //               }

  //               // Send email request
  //               const response = await sendBulkEmail({
  //                 to: emails, // Now correctly passing an array of emails
  //                 subject: values.activityTitle,
  //                 text: `From: ${values.dateFrom} To: ${values.dateTo}\n
  //                 Description: ${values.activityDescription}\n
  //                 Type: ${values.type}\n
  //                 Location: ${values.location}\n
  //                 Target Participants: ${values.targetParticipant}\n`,
  //                 // attachment: selectedFile, // Optional file from input
  //               });

  //               // Handle response
  //               if (response.success) {
  //                 toast({
  //                   title: "Success",
  //                   description: response.success,
  //                 });
  //               } else {
  //                 toast({
  //                   title: "Error",
  //                   description: response.error || "Failed to send emails.",
  //                   variant: "destructive",
  //                 });
  //               }
  //             } catch (error) {
  //               toast({
  //                 title: "Unexpected Error",
  //                 description:
  //                   error instanceof Error ? error.message : "Something went wrong.",
  //                 variant: "destructive",
  //               });
  //             }

  //             toast({
  //               title: "Success",
  //               description:
  //                 "Your calendar of activity has been encoded to the server",
  //               duration: 10000,
  //               action: (
  //                 <ToastAction altText="Goto schedule to undo">Ok</ToastAction>
  //               ),
  //             });

  //             // dispatch(fetchActivitiesData())
  //           } catch (error) {
  //             console.error("Error submitting calendar activity:", error);

  //             // Display an error toast notification
  //             toast({
  //               title: "Error",
  //               description:
  //                 "An unexpected error occurred while sending notification.",
  //               variant: "destructive",
  //               duration: 10000,
  //               action: <ToastAction altText="Error toast">Ok</ToastAction>,
  //             });
  //           } finally {
  //             if (!activityLoading) {
  //               refetchActivities();
  //               setDialogClose();
  //               setLoadingForm(false);
  //             }
  //           }
  //         }
  //         setLoadingForm(false);
  //       }, 2000); // Delay for 2 seconds
  //     });
  //   });
  // };
  console.log("form error: ", form.formState.errors);
  const onSubmit = async (values: z.infer<typeof CalendarOfActivitySchema>) => {
    try {
      if (!navigator.onLine) {
        toast({
          title: "No Internet Connection",
          description: "Please check your network and try again.",
          variant: "destructive",
        });
        return;
      }

      // Format today's date without time for accurate comparison
      const today = new Date();
      const todayFormatted = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );

      // Format dateFrom properly
      const localDateFrom = new Date(values.dateFrom);
      const localDateFromFormatted = new Date(
        localDateFrom.getFullYear(),
        localDateFrom.getMonth(),
        localDateFrom.getDate()
      );

      let status =
        localDateFromFormatted.getTime() <= todayFormatted.getTime()
          ? "Ongoing"
          : "Upcoming";

      // Validate time inputs
      if (!allDayChecked && (!values.timeStart || !values.timeEnd)) {
        setScheduleError(true);
        return;
      } else {
        setScheduleError(false);
      }

      // Validate date range for all-day events
      if (allDayChecked && values.dateFrom === values.dateTo) {
        setDateToError(true);
        return;
      } else {
        setDateToError(false);
      }

      // Validate preparatory list
      const isValidPreparatory = validatePreparatoryList();
      if (
        (!form.watch("listMode") && !watch("preparatoryContent")) ||
        (form.watch("listMode") && !isValidPreparatory)
      ) {
        setPreparatoryContentError(true);
        return;
      } else {
        setPreparatoryContentError(false);
      }

      // Finalizing values before submission
      values.status = status;
      values.dateFrom = new Date(values.dateFrom).toISOString().split("T")[0];
      values.dateTo = new Date(values.dateTo).toISOString().split("T")[0];
      values.allDay = allDayChecked;

      setLoadingForm(true);
      setError("");
      setSuccess("");

      const data = await calendarOfActivity(values);

      if (data.error) {
        setError(data.error);
        setLoadingForm(false);
        return;
      }

      setSuccess(data.success);

      // Send Email Notification
      await sendEmailNotification(values, data.id);

      toast({
        title: "Success",
        description: "Your calendar of activity has been recorded.",
        duration: 10000,
        action: <ToastAction altText="Go to schedule">Ok</ToastAction>,
      });

      refetchActivities();
      setDialogClose();
    } catch (error) {
      console.error("Error submitting calendar activity:", error);
      toast({
        title: "Submission Failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
        duration: 10000,
        action: <ToastAction altText="Error toast">Ok</ToastAction>,
      });
    } finally {
      setLoadingForm(false);
    }
  };

  // Function to send a push notification
  const sendPushNotificationToMobileUser = async (
    expoPushToken: any,
    title: string,
    body: string,
    data?: string
  ) => {
    try {
      const response = await axios.post(
        "https://exp.host/--/api/v2/push/send",
        {
          to: expoPushToken,
          title,
          body,
          data,
        }
      );

      // Check the response status and handle accordingly
      if (response.data.data) {
        console.log("Push notification sent successfully:", response.data.data);
      } else {
        console.error("Error sending push notification:", response.data);
      }
    } catch (error) {
      console.error("Error making request:", error);
    }
  };

  const addOneDay = (date: string): string => {
    return dayjs(date).add(1, "day").toISOString().split("T")[0];
  };

  const handleRangePickerChange = (value: any) => {
    if (value && Array.isArray(value) && value.length === 2) {
      const [startDate, endDate] = value.map((date: any) =>
        dayjs(date).toISOString()
      );

      // Add one day to startDate and endDate
      const newStartDate = addOneDay(startDate);
      const newEndDate = addOneDay(endDate);

      form.setValue("dateFrom", newStartDate);
      form.setValue("dateTo", newEndDate);
    } else {
      // Clear the value if no range is selected
      form.setValue("dateFrom", dayjs().format("YYYY-MM-DD"));
      form.setValue("dateTo", dayjs().format("YYYY-MM-DD"));
    }
  };

  const handleDatePickerChange = (value: any) => {
    if (value) {
      const date = dayjs(value); // Convert the input value to a Day.js object
      const formattedDate = date.toISOString(); // Format the date as per ISO 8601

      // Add one day to the date
      const newDate = addOneDay(formattedDate);

      form.setValue("dateFrom", newDate);
      form.setValue("dateTo", newDate);
    } else {
      // Clear the value if no range is selected
      form.setValue("dateFrom", "");
      form.setValue("dateTo", "");
    }
  };

  const handleTimeRangeChange = (value: any) => {
    if (value && Array.isArray(value) && value.length === 2) {
      const [timeStart, timeEnd] = value;
      const formattedStartTime = timeStart.format("HH:mm"); // Extract only the time part
      const formattedEndTime = timeEnd.format("HH:mm"); // Extract only the time part

      form.setValue("timeStart", formattedStartTime);
      form.setValue("timeEnd", formattedEndTime);
    } else {
      // Clear the value if no range is selected
      form.setValue("timeStart", "");
      form.setValue("timeEnd", "");
    }
  };

  const convertUsersToDropdownData = (users: UserType[]) => {
    return users.map((user) => ({
      value: user.id,
      label: `${user.region} - ${user.name}`,
    }));
  };

  useEffect(() => {
    const filteredUsersData =
      filterRegion === "All"
        ? usersData
        : usersData.filter((user: { region: string | undefined; }) => user.region === filterRegion);

    const multiSelectUsersDropdownData =
      convertUsersToDropdownData(filteredUsersData);
    setMultiSelectUsersDropdownData(multiSelectUsersDropdownData);
    setFilteredUsersData(filteredUsersData);
  }, [currentUser?.user.region, usersData, filterRegion]);

  const clearFunctionRef = useRef<() => void | null>(null);
  const selectAllFunctionRef = useRef<() => void | null>(null);

  const handleAllDayChecked = () => {
    setAllDayChecked(!allDayChecked);
    form.setValue("dateFrom", dayjs().format("YYYY-MM-DD"));
    form.setValue("timeStart", "");
    form.setValue("timeEnd", "");
    setScheduleError(false);
  };

  const WFPYears = ["2023", "2024", "2025", "2026", "2027", "2028"];

  const handleListChange = () => {
    form.setValue("preparatoryList", [
      { description: "", status: "", remarks: "" },
    ]);
    form.setValue("preparatoryContent", "");
  };
  const sendEmailNotification = async (
    values: z.infer<typeof CalendarOfActivitySchema>,
    id: string // Added id as a parameter
  ) => {
    try {
      const selectedParticipants = form.watch("participants") || [];
      const emails = usersData
        .filter((user: { id: string; }) =>
          selectedParticipants.some(
            (participant) => participant.userId === user.id
          )
        )
        .map((user: { email: any; }) => user.email);

      if (emails.length === 0) {
        toast({
          title: "No Recipients Found",
          description: "Please select participants with valid emails.",
          variant: "destructive",
        });
        return;
      }

      const startDate = parseISO(values.dateFrom);
      const endDate = parseISO(values.dateTo);
      let startDateTime, endDateTime;

      if (allDayChecked) {
        startDateTime = format(startDate, "yyyyMMdd");
        endDateTime = format(endDate, "yyyyMMdd");
      } else {
        // Parse time strings into hours and minutes
        const [startHours, startMinutes] = values.timeStart.split(':');
        const [endHours, endMinutes] = values.timeEnd.split(':');

        // Set the time components on the dates
        startDate.setHours(parseInt(startHours), parseInt(startMinutes));
        endDate.setHours(parseInt(endHours), parseInt(endMinutes));

        startDateTime = format(startDate, "yyyyMMdd'T'HHmmss");
        endDateTime = format(endDate, "yyyyMMdd'T'HHmmss");
      }

      const baseUrl = "https://www.google.com/calendar/render?action=TEMPLATE";
      const text = encodeURIComponent(values.activityTitle);
      const dates = `${startDateTime}/${endDateTime}`;
      const details = encodeURIComponent(values.activityDescription);
      const location = encodeURIComponent(values.location);
      // Format date and time
      const formatDate = (dateString: string | number | Date) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      };

      const formatTime = (timeString: string) => {
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      };

      const googleCalendarLink = `${baseUrl}&text=${text}&dates=${dates}&details=${details}&location=${location}&allday=${allDayChecked}`;

      const response = await sendBulkEmail({
        to: emails,
        subject: `📆 MIADP Upcoming Activity: ${values.activityTitle}`,
        text: `Dear Team,
  
  We are pleased to inform you that you are one of the participants for an upcoming activity. Below are the details:

  📍 LOCATION: ${values.location}
  📝 ACTIVITY TITLE: ${values.activityTitle}
  🎯 TARGET PARTICIPANTS: ${values.targetParticipant}
  📅 DATE: ${formatDate(values.dateFrom)}${values.dateFrom !== values.dateTo ? ` - ${formatDate(values.dateTo)}` : ''}
  🕰️ TIME: ${values.allDay ? 'All Day' : `${formatTime(values.timeStart)} - ${formatTime(values.timeEnd)}`}
  📄 DESCRIPTION: ${values.activityDescription}

  📅 Add to your calendar: 🔗 ${googleCalendarLink}

  Please mark your calendar accordingly. If you have any questions or require further information, feel free to reach out.
  
  You can also visit the web application for more details:  
  🔗 MIADP Portal - Calendar of Activities  
  https://miadp-mis.vercel.app/activities/table
  
  Additionally, you can also share this activity with others using this link:  
  🔗 https://miadp-mis.vercel.app/calendar-of-activities/${id} 
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full"
        autoComplete="off"
      >
        <div className="space-y-4 w-full flex flex-col flex-wrap">
          <div className="flex flex-row gap-2 w-full">
            <FormFieldWrapper
              control={form.control}
              name="activityTitle"
              label="Activity Title"
              placeholder="Type your activity title here."
              tabIndex={0}
              isDisabled={loadingForm}
            />
            <div className="mt-auto">
              {/* <Select onValueChange={(value) => setWFPYear(value)} defaultValue={WFPYear} disabled={loadingForm}>
                                <SelectTrigger className='text-xs sm:text-sm'>
                                    <SelectValue placeholder="Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {WFPYears.map((year, index) => (
                                        <SelectItem
                                            key={index}
                                            value={year}
                                            disabled={loadingForm}
                                            className="text-xs sm:text-sm"
                                        >
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select> */}
              <FormFieldWrapper
                control={form.control}
                name="WFPYear"
                label="WFP Year"
                placeholder="WFP Year"
                isDisabled={loadingForm}
                tabIndex={1}
                type="select"
                selectOptions={WFPYears.map((year, index) => ({
                  label: year,
                  value: year,
                }))}
              />
            </div>
          </div>
          <FormFieldWrapper
            control={form.control}
            name="activityDescription"
            label="Activity Description"
            placeholder="Type your description here."
            isDisabled={loadingForm}
            isTextarea
            tabIndex={0}
          />
          <div className="flex flex-row flex-wrap sm:grid grid-cols-3 gap-2">
            {form.watch("type") === "Other" ? (
              <FormField
                control={form.control}
                name={"otherType"}
                render={({ field }) => (
                  <FormItem className="mt-auto w-full">
                    <FormLabel className="flex flex-row justify-between gap-1 text-xs sm:text-sm">
                      <div className="flex flex-row gap-1">
                        Type
                        <FormMessage />
                      </div>
                      <div>
                        <Label className="text-xs sm:text-sm font-light flex flex-row gap-1 items-center">
                          (Other)
                          <FaX
                            size={10}
                            className="cursor-pointer"
                            onClick={() => {
                              form.resetField("otherType");
                              form.resetField("type");
                            }}
                          />
                        </Label>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={loadingForm}
                        value={form.watch("otherType") || ""}
                        className="text-xs sm:text-sm"
                        placeholder="Please specify..."
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name={"type"}
                render={({ field }) => (
                  <FormItem className="mt-auto w-full">
                    <FormLabel className="flex flex-row justify-between gap-1 text-xs sm:text-sm">
                      <div className="flex flex-row gap-1">
                        Type
                        <FormMessage />
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                        disabled={loadingForm}
                      >
                        <FormControl className="text-xs sm:text-sm">
                          <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TypeData.map((option, index) => (
                            <SelectItem
                              key={index}
                              value={option.value || "default_value"}
                              disabled={loadingForm}
                              className="text-xs sm:text-sm"
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="targetParticipant"
              render={({ field }) => (
                <FormItem className="mt-auto w-full">
                  <FormLabel className="flex flex-row gap-1 text-xs sm:text-sm flex-nowrap">
                    Target Participant
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={loadingForm}
                      className="text-xs sm:text-sm"
                      placeholder="ex. IPS, IPO, LPMIU, RPCO, PSO, etc."
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="mt-auto w-full">
                  <FormLabel className="flex flex-row gap-1 text-xs sm:text-sm">
                    Location
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={loadingForm}
                      className="text-xs sm:text-sm"
                      placeholder="ex. World Palace, Ecoland, Davao City"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <Separator />
          <FormLabel className="flex flex-row gap-2 justify-start items-center">
            <label className="font-bold md:text-xl items-center">
              Schedule
            </label>
            <div className="flex flex-row items-center justify-start gap-1">
              <Checkbox
                checked={allDayChecked}
                onClick={handleAllDayChecked}
                disabled={loadingForm}
              />
              <label
                htmlFor="allday"
                className="text-xs sm:text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 whitespace-nowrap"
              >
                All day
              </label>
            </div>
            <TooltipComponent
              trigger={
                <button type="button" className="flex items-center">
                  <IoInformationCircleOutline size={24} />
                </button>
              }
              description="Please check (All day) if the activity is more than just 1 day"
            />
          </FormLabel>
          <div className="flex flex-row gap-2 item-start flex-wrap">
            {allDayChecked ? (
              <div className="flex flex-col mt-auto w-fit">
                <FormLabel
                  className="text-xs sm:text-sm"
                  style={dateToError ? { color: "#f04d44" } : {}}
                >
                  Planned Date Range
                </FormLabel>
                <RangePicker
                  className="text-xs sm:text-sm dark:bg-[#020817] dark:text-[#f8fafc] dark:border-[#182334]"
                  defaultValue={[dayjs(), null]}
                  format={"YYYY-MM-DD"}
                  onChange={(value) => handleRangePickerChange(value)}
                  disabled={loadingForm}
                />
              </div>
            ) : (
              <div className="flex flex-row gap-2 mt-auto ">
                <div className="mt-auto">
                  <FormLabel className="text-xs sm:text-sm">
                    Planned Date{" "}
                  </FormLabel>
                  <DatePicker
                    className="w-full text-xs sm:text-sm dark:bg-[#020817] dark:text-[#f8fafc] dark:border-[#182334]"
                    defaultValue={[dayjs()]}
                    onChange={(value) => handleDatePickerChange(value)}
                    disabled={loadingForm}
                  />
                </div>
                <div className="flex flex-col mt-auto gap-2">
                  <FormLabel
                    className="text-xs sm:text-sm"
                    style={scheduleError ? { color: "#f04d44" } : {}}
                  >
                    Time Range {scheduleError && "*"}
                  </FormLabel>
                  <TimePicker.RangePicker
                    className="w-full text-xs sm:text-sm dark:bg-[#020817] dark:text-[#f8fafc] dark:border-[#182334]"
                    onChange={(value) => handleTimeRangeChange(value)}
                    disabled={loadingForm}
                    format={"HH:mm"}
                  />
                </div>
              </div>
            )}
          </div>
          {/* {!individualActivity_ && <>
                        <Separator />
                        <FormLabel className='flex flex-row gap-2 justify-between items-center flex-wrap'>
                            <div className='flex flex-row gap-2 items-center'>
                                <label
                                    className='font-bold md:text-xl mr-auto'
                                    style={participantError ? { color: '#f04d44' } : {}}
                                >
                                    Participants {participantError && '*'} <FormMessage />
                                </label>
                                <TooltipComponent
                                    trigger={<button type='button' className='flex items-center'><IoInformationCircleOutline size={24} /></button>}
                                    description="Please press (All) to select all participants, (trash icon) to remove all"
                                />
                            </div>
                            <div className='flex flex-row gap-2 justify-center sm:justify-end items-center w-full sm:w-fit'>
                                <Badge className='flex flex-row gap-1 justify-center items-center'><MdPeopleAlt />{filteredUsersData.length}</Badge>
                                <Select onValueChange={setFilterRegion} defaultValue={filterRegion} disabled={loadingForm}>
                                    <SelectTrigger className='text-xs sm:text-sm'>
                                        <SelectValue placeholder="Filter" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='All' className='text-xs sm:text-sm'>All</SelectItem>
                                        {regionOptions.map((option, index) => (
                                            <SelectItem
                                                key={index}
                                                value={option}
                                                className="text-xs sm:text-sm">{option}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Badge className='flex flex-row gap-1 justify-center items-center' variant='secondary'><MdPeopleAlt />{selectedParticipants.length}</Badge>
                                <Button
                                    variant={'destructive'}
                                    type='button' size={'sm'}
                                    disabled={loadingForm || selectedParticipants.length == 0}
                                    onClick={() => {
                                        if (clearFunctionRef.current) clearFunctionRef.current();
                                    }}>
                                    <FaTrash />
                                </Button>
                                <Button
                                    type='button'
                                    size={'sm'}
                                    disabled={loadingForm}
                                    onClick={() => {
                                        if (selectAllFunctionRef.current) selectAllFunctionRef.current();
                                    }}>
                                    All
                                </Button>
                            </div>
                        </FormLabel>
                        <FancyMultiSelect
                            data={multiSelectUsersDropdownData}
                            onSelectionChange={(selected) => setSelectedParticipants(selected)}
                            clearFunctionRef={clearFunctionRef}
                            selectAllFunctionRef={selectAllFunctionRef}
                            disabled={loadingForm}
                        />
                    </>} */}

          {!individualActivity_ && (
            <>
              <div className="flex flex-row gap-2 justify-between items-center flex-wrap">
                <FormLabel>
                  <div className="flex flex-row gap-2 items-center">
                    <label className="font-bold md:text-xl mr-auto flex flex-row">
                      Participants
                    </label>
                    <TooltipComponent
                      trigger={
                        <button type="button" className="flex items-center">
                          <IoInformationCircleOutline size={24} />
                        </button>
                      }
                      description="Please press (All) to select all participants, (trash icon) to remove all"
                    />
                  </div>
                </FormLabel>

                <div className="flex flex-row gap-2 justify-center sm:justify-end items-center w-full sm:w-fit">
                  <Badge className="flex flex-row gap-1 justify-center items-center">
                    <MdPeopleAlt />
                    {filteredUsersData.length}
                  </Badge>
                  <Select
                    onValueChange={setFilterRegion}
                    defaultValue={filterRegion}
                    disabled={loadingForm}
                  >
                    <SelectTrigger className="text-xs sm:text-sm">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All" className="text-xs sm:text-sm">
                        All
                      </SelectItem>
                      {regionOptions.map((option, index) => (
                        <SelectItem
                          key={index}
                          value={option}
                          className="text-xs sm:text-sm"
                        >
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Badge
                    className="flex flex-row gap-1 justify-center items-center"
                    variant="secondary"
                  >
                    <MdPeopleAlt />
                    {form.watch("participants")?.length}
                  </Badge>
                  <Button
                    variant={"destructive"}
                    type="button"
                    size={"sm"}
                    disabled={
                      loadingForm || form.watch("participants")?.length == 0
                    }
                    onClick={() => {
                      if (clearFunctionRef.current) clearFunctionRef.current();
                    }}
                  >
                    <FaTrash />
                  </Button>
                  <Button
                    type="button"
                    size={"sm"}
                    disabled={loadingForm}
                    onClick={() => {
                      if (selectAllFunctionRef.current)
                        selectAllFunctionRef.current();
                    }}
                  >
                    All
                  </Button>
                </div>
              </div>
              <FormField
                control={form.control}
                name="participants"
                render={({ field }) => (
                  <FormItem className="mt-auto w-full">
                    <FormMessage />

                    <FormControl>
                      <FancyMultiSelect
                        {...field}
                        data={multiSelectUsersDropdownData}
                        onSelectionChange={(selected) => {
                          const formattedParticipants = selected.map(
                            (user) => ({ userId: user })
                          );
                          field.onChange(formattedParticipants); // Ensure this matches the format
                        }}
                        clearFunctionRef={clearFunctionRef}
                        selectAllFunctionRef={selectAllFunctionRef}
                        disabled={loadingForm}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </>
          )}

          <Separator />

          {/* Preparatory list items */}
          <FormLabel className="flex flex-row gap-2 justify-between items-centers">
            <div className="flex flex-row gap-2 items-center">
              <label
                className="font-bold md:text-xl"
                style={preparatoryContentError ? { color: "#f04d44" } : {}}
              >
                Preparatory {form.watch("listMode") ? "List" : "Content"}
              </label>
              <TooltipComponent
                trigger={
                  <button type="button" className="flex items-center">
                    <IoInformationCircleOutline size={24} />
                  </button>
                }
                description="Please enter your preparatory list below. For clarity, consider using bullet points or numbering."
              />
              <FormField
                control={form.control}
                name="listMode"
                render={({ field }) => (
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="list-mode"
                      checked={field.value}
                      onCheckedChange={(value) => {
                        field.onChange(value);
                        handleListChange();
                      }}
                      disabled={loadingForm}
                    />
                    <Label htmlFor="list-mode" className="text-xs sm:text-sm">
                      List mode
                    </Label>
                  </div>
                )}
              />
            </div>
            {form.watch("listMode") && (
              <div className="flex flex-row gap-2 justify-end items-center">
                <Badge variant="secondary" className="h-fit">
                  {preparatoryListFields.length}
                </Badge>
                <Button
                  type="button"
                  size={"sm"}
                  disabled={loadingForm}
                  onClick={() =>
                    appendPreparatoryList({
                      description: "",
                      status: "",
                      remarks: "",
                    })
                  }
                >
                  <FaPlus />
                </Button>
              </div>
            )}

            <FormMessage />
          </FormLabel>
          {!form.watch("listMode") ? (
            <>
              <FormField
                control={form.control}
                name="preparatoryContent"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormMessage />
                    <FormControl>
                      <QuillEditor
                        readOnly={loadingForm}
                        value={field.value}
                        defaultValue={field.value}
                        onChange={field.onChange}
                        modules={quillModules}
                        formats={quillFormats}
                        className="w-full"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </>
          ) : (
            <>
              {preparatoryListFields.map((field, index) => (
                <FormField
                  control={form.control}
                  name={"preparatoryList"}
                  key={index}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <div
                          key={index}
                          className="flex flex-row gap-2 items-end w-full"
                        >
                          <FormField
                            control={form.control}
                            name={`preparatoryList.${index}.description`}
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormMessage />
                                <FormControl>
                                  <Input
                                    {...field}
                                    disabled={loadingForm}
                                    className="text-xs sm:text-sm"
                                    placeholder="Enter description"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`preparatoryList.${index}.status`}
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormMessage />
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  disabled={loadingForm}
                                >
                                  <SelectTrigger className="text-xs sm:text-sm">
                                    <SelectValue placeholder="Select a status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {PreparatoryActivityStatus.map(
                                      (option, index) => (
                                        <SelectItem
                                          key={index}
                                          value={
                                            option.value || "default_value"
                                          }
                                          disabled={loadingForm}
                                          className="cursor-pointer text-xs sm:text-sm"
                                        >
                                          <Badge variant={"outline"}>
                                            {option.label}
                                          </Badge>
                                        </SelectItem>
                                      )
                                    )}
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />
                          {form.watch(`preparatoryList.${index}.status`) ==
                            "Other" && (
                              <FormField
                                control={form.control}
                                name={`preparatoryList.${index}.remarks`}
                                render={({ field }) => (
                                  <FormItem className="w-full">
                                    <FormMessage />
                                    <FormControl>
                                      <Input
                                        {...field}
                                        className="w-full"
                                        disabled={loadingForm}
                                        placeholder="Please specify..."
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            )}
                          <Button
                            className="w-fit"
                            type="button"
                            variant={"destructive"}
                            size={"sm"}
                            onClick={() => removePreparatoryList(index)}
                            disabled={
                              loadingForm || preparatoryListFields.length === 1
                            }
                          >
                            <FaMinus />
                          </Button>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </>
          )}

          <Separator />
          {/* <div className='flex flex-row w-full items-end gap-2'>
                        <FormField
                            control={form.control}
                            name="attachments"
                            key={index}
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <div className='flex flex-row gap-2 justify-between items-center'>
                                        <FormLabel className='flex flex-row gap-1 text-xs sm:text-sm'>Attachments
                                            <Label className=' font-extralight text-xs sm:text-sm'>
                                                (Optional)
                                            </Label>
                                        </FormLabel>
                                        <Button type='button' size={'sm'} disabled={loadingForm} onClick={() => appendPreparatoryList({ description: '', status: '', remarks: '' })}>
                                            <FaPlus />
                                        </Button>
                                    </div>

                                    <FormControl>
                                    <div key={index} className="flex flex-row gap-2 items-end w-full">
                                        <Input {...field} disabled={loadingForm} className='text-xs sm:text-sm' placeholder="Link for you attachments here." />
                                    </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <div className='ml-auto'>
                            <Button disabled size={'sm'}><Upload /></Button>

                        </div>
                    </div> */}
          <FormLabel className="flex items-center justify-between -pb-10">
            <div className="flex flex-row items-center gap-1">
              <label className="font-bold md:text-xl">Attachments</label>
              <TooltipComponent
                trigger={
                  <button type="button" className="flex items-center">
                    <IoInformationCircleOutline size={24} />
                  </button>
                }
                description="If you add any attachment here, the attachment fields will be required."
              />
              <Label className=" font-extralight text-xs sm:text-sm">
                (Optional)
              </Label>
            </div>
            <Button
              type="button"
              size={"sm"}
              disabled={loadingForm}
              onClick={() => appendAttachments({ details: "", link: "" })}
            >
              <FaPlus />
            </Button>
          </FormLabel>
          {attachmentFields.map((field, index) => (
            <FormField
              control={form.control}
              name={"calendarOfActivityAttachment"}
              key={index}
              render={({ field }) => (
                <FormItem className="w-full pt-0 mt-0">
                  <FormControl>
                    <div
                      key={index}
                      className="flex flex-row gap-2 items-end w-full"
                    >
                      <FormField
                        control={form.control}
                        name={`calendarOfActivityAttachment.${index}.details`}
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormMessage />
                            <FormControl>
                              <Input
                                {...field}
                                disabled={loadingForm}
                                className="text-xs sm:text-sm"
                                placeholder="Enter details"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`calendarOfActivityAttachment.${index}.link`}
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormMessage />
                            <FormControl>
                              <Input
                                {...field}
                                disabled={loadingForm}
                                className="text-xs sm:text-sm text-blue-500"
                                placeholder="Paste link here."
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button
                        className="w-fit"
                        type="button"
                        variant={"destructive"}
                        size={"sm"}
                        onClick={() => removeAttachments(index)}
                        disabled={loadingForm || attachmentFields.length === 1}
                      >
                        <FaMinus />
                      </Button>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          ))}

          <FormField
            control={form.control}
            name="remarks"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="flex flex-row gap-1 text-xs sm:text-sm">
                  Remarks{" "}
                  <Label className=" font-extralight text-xs sm:text-sm">
                    {" "}
                    (Optional)
                  </Label>
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={loadingForm}
                    className="text-xs sm:text-sm"
                    placeholder="Type your remarks here."
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormSuccess message={success} />
        <FormError message={error} />

        <Button typeof="submit" className="w-full" disabled={loadingForm}>
          {loadingForm && <LoadingSpinner />} Submit
        </Button>
      </form>
    </Form>
  );
};

export default CalendarForm;
