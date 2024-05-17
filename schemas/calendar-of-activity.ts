import * as z from "zod";

export const CalendarOfActivitySchema = z.object({
  authorizeOther: z.boolean(),
  activityTitle:z.string().min(1, "Activity Title is required"),
  activityDescription: z.string().min(1, "Activity Description is required"),
  type: z.string().min(1, "Type is required"),
  targetParticipant: z.string().min(1, "Target Participant is required"),
  location: z.string().min(1, "Location is required"),
  dateFrom: z.string(),
  dateTo: z.string(),
  timeStart: z.string(),
  timeEnd: z.string(),
  allDay: z.boolean(),
  preparatoryList: z.object({
    description: z.string().min(1, ""),
    status: z.string().min(1, ""),
    remarks: z.string(),
  }).array(),
  remarks: z.string(),
  color:z.string(),
  status: z.string(),
  name: z.string()
});

export type CalendarOfActivityType = z.infer<typeof CalendarOfActivitySchema>;
