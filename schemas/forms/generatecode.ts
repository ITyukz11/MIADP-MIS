import { z } from "zod";

export const GenerateCodeSchema = z.object({
  subprojectTitle: z.string().min(1, "*"),
  component: z.string().min(1, "*"),
  sharedFundingWithInfra: z.boolean().optional(),  // mapped from Prisma model
  region: z.string().min(1, "*"),
  province: z.string().min(1, "*"),
  municipality: z.string().optional(), // mapped from Prisma model
  ancestralDomainLoc: z.string().optional(), // mapped from Prisma model
  type: z.string().min(1, "*"),
  coordinate: z.string().optional(), // mapped from Prisma model
  measurement: z.string().optional(), // mapped from Prisma model
  physicalIndicator: z.string().optional(), // mapped from Prisma model
  tepc: z.string().optional(), // mapped from Prisma model
  briefDescription: z.string().optional(),
  sequentialNum: z.string().optional(),
});