import { z } from "zod";

export const GenerateCodeSchema = z.object({
  subprojectTitle: z.string().min(1, "*"),
  component: z.string().min(1, "*"),
  optionalEntrepSharedInfra: z.string().optional(),
  region: z.string().min(1, "*"),
  province: z.string().min(1, "*"),
  adLocation: z.string().min(1, "*").max(4,"4 characters only!"),
  type: z.string().min(1, "*"),
  sequentialNumber: z.string(),
})