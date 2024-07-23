import { z } from "zod"

export const CorrespondenceIncomingSchema = z.object({
  no:z.string().min(1, "*"),
  date: z.string().min(1, "*"),
  encoder: z.string().min(1, "*"),
  to: z.string().min(1, "*"),
  from: z.string().min(1, "*"),
  purpose: z.string().min(1, "*"),
  attachment: z.string().optional(),
  subject: z.string().min(1, "*"),
  remarks: z.string().optional(),
})
export type CorrespondenceIncomingType = z.infer<typeof CorrespondenceIncomingSchema>


export const CorrespondenceOutgoingSchema = z.object({
  no:z.string().min(1, "*"),
  date: z.string().min(1, "*"),
  encoder: z.string().min(1, "*"),
  particular: z.string().min(1, "*"),
  attachment: z.string().optional(),
  remarks: z.string().optional(),
})
export type CorrespondenceOutgoingType = z.infer<typeof CorrespondenceOutgoingSchema>

