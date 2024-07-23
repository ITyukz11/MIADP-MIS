import { z } from "zod"

//User Schema
export const UserSchema = z.object({
  name:z.string().optional(),
  email: z.string().optional(),
  position: z.string().optional(),
  component: z.string().optional(),
  unit: z.string().optional(),
  region: z.string().optional(),
})

export type UserType = z.infer<typeof UserSchema>