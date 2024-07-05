import * as z from "zod";

export const CalendarOfActivitySchema = z.object({
  authorizeOther: z.boolean(),
  individualActivity: z.boolean(),
  WFPYear:z.string(),
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
  participants: z.array(
    z.object({
      userId: z.string(),
    })
  ).optional(), // Make participants optional
  preparatoryList: z.array(
    z.object({
      description: z.string(),
      status: z.string(),
      remarks: z.string(),
    })
  ).optional(), // Make preparatoryList optional
  preparatoryContent: z.string(),
  remarks: z.string(),
  color:z.string(),
  status: z.string(),
  attachments:z.string(),
  name: z.string(),
  user: z.object({
    component:z.string(),
    unit: z.string(),
    position: z.string(),
    region: z.string()
  }).optional()
});

export type CalendarOfActivityType = z.infer<typeof CalendarOfActivitySchema>;
