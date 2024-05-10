import { z } from "zod";

export const activitiesSchema = z.object({
  coa_id: z.number(),
  activity_description: z.string(),
  type: z.string(),
  planned_from_date: z.string(), // You might want to use a date type here
  status: z.string(),
  planned_to_date: z.string(), // You might want to use a date type here
  target_participant: z.string(),
  location: z.string(),
  remarks: z.string(),
  user_id: z.number(),
});

export type Activity = z.infer<typeof activitiesSchema>;
