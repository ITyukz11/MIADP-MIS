import * as z from "zod";
 
export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
    password:z.string().min(6, {
        message:"Password is required atleast 6 characters"
    })
})

export const RegisterSchema = z.object({
    region:z.string().min(1, {
        message:"Region is required"
    }),
    fullname: z.string().min(1, {
        message: "Fullname is required"
    }),
    email: z.string().email({
        message: "Email is required"
    }),
    password:z.string().min(6, {
        message:"Minimum 6 characters required"
    }),
})

export const WFPActivitySchema = z.object({
    activityIdNumber: z.string().min(1, {
      message: "Activity ID Number is required",
    }),
    typeOfActivity: z.string().min(1, {
      message: "Type of Activity is required",
    }),
    operatingUnit: z.string().min(1, {
      message: "Operating Unit is required",
    }),
    componentsUnits: z.string().min(1, {
      message: "Components/Units is required",
    }),
    budgetYear: z.string().min(1, {
      message: "Budget Year is required",
    }),
    activities: z.string().min(1, {
      message: "Activities is required",
    }),
    costTabMajorActivity: z.string().min(1, {
      message: "Cost Tab Major Activity is required",
    }),
    costTabSubActivity: z.string().min(1, {
      message: "Cost Tab Sub-activity is required",
    }),
    unitOfMeasure: z.string().min(1, {
      message: "Unit of Measure is required",
    }),
    physicalTarget: z.string().min(1, {
      message: "Physical Target is required",
    }),
    financialTotal: z.string().min(1, {
      message: "Financial (Total) is required",
    }),
    loanProceed: z.string().min(1, {
      message: "Loan Proceed is required",
    }),
    gopCounterpart: z.string().min(1, {
      message: "GOP Counterpart is required",
    }),
    budgetLine: z.string().min(1, {
        message: "Budget Line is required",
    }),
    UACSCode: z.string().min(1, {
        message: "UACS Code is required"
    }),    
  });
export const WFPActivityPhysicalMonthSchema = z.object({
  physicalJan: z.string().min(1, { message: "required" }),
  physicalFeb: z.string().min(1, { message: "required" }),
  physicalMar: z.string().min(1, { message: "required" }),
  physicalApr: z.string().min(1, { message: "required" }),
  physicalMay: z.string().min(1, { message: "required" }),
  physicalJun: z.string().min(1, { message: "required" }),
  physicalJul: z.string().min(1, { message: "required" }),
  physicalAug: z.string().min(1, { message: "required" }),
  physicalSep: z.string().min(1, { message: "required" }),
  physicalOct: z.string().min(1, { message: "required" }),
  physicalNov: z.string().min(1, { message: "required" }),
  physicalDec: z.string().min(1, { message: "required" }),
})

export const WFPActivityFinancialMonthSchema = z.object({  
  financialJan: z.string().min(1, { message: "required" }),
  financialFeb: z.string().min(1, { message: "required" }),
  financialMar: z.string().min(1, { message: "required" }),
  financialApr: z.string().min(1, { message: "required" }),
  financialMay: z.string().min(1, { message: "required" }),
  financialJun: z.string().min(1, { message: "required" }),
  financialJul: z.string().min(1, { message: "required" }),
  financialAug: z.string().min(1, { message: "required" }),
  financialSep: z.string().min(1, { message: "required" }),
  financialOct: z.string().min(1, { message: "required" }),
  financialNov: z.string().min(1, { message: "required" }),
  financialDec: z.string().min(1, { message: "required" }),
})

export const ActivitySchema = z.object({
  activityDescription: z.string(),
  type: z.string(),
  plannedFromDate: z.date().nullable(),
  plannedToDate: z.date().nullable(),
  targetParticipants: z.string(),
  location: z.string().optional(),
  status: z.string().default('new'),
  remarks: z.string(),
  user: z.string(),
});



