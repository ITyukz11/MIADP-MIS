import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { signIn } from "next-auth/react";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  try {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    console.log("RESULT: ", result);

    if (result && result.error) {
      return { error: "Invalid Credentials!" };
    }

    return { success: "Success!" };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
};
