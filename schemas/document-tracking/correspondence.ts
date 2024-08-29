import { z } from "zod"

export const CorrespondenceIncomingSchema = z.object({
  no:z.string().optional(),
  date: z.string().optional(),
  documentId: z.string().optional(),
  senderId: z.string().optional(),
  to: z.string().min(1, "*"),
  from: z.string().optional(),
  purpose: z.string().min(1, "*"),
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

export const DoctrackDocumentSchema = z.object({
  id:z.string().optional(),
  no:z.string().optional(),
  from:z.string().min(1,"*"),
  documentType:z.string().min(1,"*"),
  routeType:z.string().min(1,"*"),
  date: z.string().optional(),
  status: z.string().optional(),
  encoder: z.string().optional(),
  subject: z.string().min(1, "*"),
  description: z.string().min(1, "*"),
  link: z.string().optional(),
  attachment: z.string().optional(),
  remarks: z.string().optional(),
})
export type DoctrackDocumentType = z.infer<typeof DoctrackDocumentSchema>

