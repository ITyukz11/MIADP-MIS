import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const pendingUsersSchema = z.object({
  id: z.string(),
  region: z.string(),
  name: z.string(),
  email: z.string(),
  status: z.string(),
  unit: z.string(),
  component: z.string(),
  position: z.string(),
  createdAt: z.string()
})

export type Task = z.infer<typeof pendingUsersSchema>