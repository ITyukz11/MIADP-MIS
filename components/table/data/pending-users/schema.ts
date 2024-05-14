import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const pendingUsersSchema = z.object({
  id: z.string(),
  region: z.string(),
  name:z.string(),
  email: z.string(),
  status: z.string(),
  createdAt: z.string(),
  component: z.string(),
  unit: z.string(),
  position: z.string(),
})

export type PendingUserType = z.infer<typeof pendingUsersSchema>