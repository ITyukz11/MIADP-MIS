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
    physicalQ1: z.string().min(1,{
        message: "Timeframe (physical) Q1 is required"
    }),
    physicalQ2: z.string().min(1,{
        message: "Timeframe (physical) Q2 is required"
    }),
    physicalQ3: z.string().min(1,{
        message: "Timeframe (physical) Q3 is required"
    }),
    physicalQ4: z.string().min(1,{
        message: "Timeframe (physical) Q4 is required"
    }),
    financialQ1: z.string().min(1,{
        message: "Timeframe (financial) Q1 is required"
    }),
    financialQ2: z.string().min(1,{
        message: "Timeframe (financial) Q2 is required"
    }),
    financialQ3: z.string().min(1,{
        message: "Timeframe (financial) Q3 is required"
    }),
    financialQ4: z.string().min(1,{
        message: "Timeframe (financial) Q4 is required"
    }),
  });

