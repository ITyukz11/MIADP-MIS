import * as z from "zod";

export const CalendarOfActivitySchema = z.object({
  authorizeOther: z.boolean(),
  activityTitle:z.string().min(1, "*"),
  activityDescription: z.string().min(1, "*"),
  type: z.string().min(1, "*"),
  targetParticipant: z.string().min(1, "*"),
  location: z.string().min(1, "*"),
  dateFrom: z.string(),
  dateTo: z.string(),
  timeStart: z.string(),
  timeEnd: z.string(),
  allDay: z.boolean(),
  participant: z.object({
    userId: z.string(),
  }).array(),
  preparatoryList: z.object({
    description: z.string().min(1, "*"),
    status: z.string().min(1, "*"),
    remarks: z.string(),
  }).array(),
  remarks: z.string(),
  color:z.string(),
  status: z.string(),
  attachments:z.string(),
  name: z.string()
});

export type CalendarOfActivityType = z.infer<typeof CalendarOfActivitySchema>;
