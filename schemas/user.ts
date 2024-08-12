import { z } from "zod";

// User Schema
export const UserSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "*"),
  email: z.string().min(1, "*"),
  position: z.string().min(1, "*"),
  component: z.string().min(1, "*"),
  unit: z.string().optional(),
  region: z.string().min(1, "*"),
  color: z.string().optional()
}).refine(data => {
  // If component is "Component 4", unit must be present
  if (data.component === "Component 4" && !data.unit) {
    return false;
  }
  return true;
}, {
  message: "*",
  path: ["unit"], // This specifies which field the error should be attached to
});

export type UserType = z.infer<typeof UserSchema>;
