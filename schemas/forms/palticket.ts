import { z } from "zod";

export const PalTicket = z.object({
  travelOrderNo: z.string().optional(),
  date: z.string().min(1, { message: "*" }), // Can add date format validation if needed
  passengerDetails: z.array(
    z.object({
      firstName: z.string().min(1, { message: "*" }),
      surName: z.string().min(1, { message: "*" }),
      birthDate: z.string().min(1, { message: "*" }), // Consider adding date format validation
      emailAddress: z
        .string()
        .min(1, { message: "*" })
        .email({ message: "*" }),
      mobileNo: z
        .string()
        .regex(/^\d{11}$/, { message: "Mobile number must be 11 digits" }),
        mabuhayMiles: z.string().min(1, { message: "*" }),
    })
  ),
  dateOfDeparture: z.string().min(1, { message: "*" }),
  dateOfReturn: z.string().min(1, { message: "*" }),
  itineraryRoute: z.string().min(1, { message: "*" }),
  itineraryRoute2: z.string().min(1, { message: "*" }),
  preferredFlightTime: z.string().min(1, { message: "*" }),
  preferredFlightTime2: z.string().min(1, { message: "*" }),
  price: z.string().min(1, {message:"*"}),
  cabin: z.string().min(1, {message:"*"}),
});
