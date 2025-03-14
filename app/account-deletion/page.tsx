"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";

const deletionRequestSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  reason: z.string().optional(),
  confirmation: z.literal("checked", {
    errorMap: () => ({
      message:
        "You must confirm that you understand the consequences of deleting your account.",
    }),
  }),
});

export default function AccountDeletionPage() {
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [confirmation, setConfirmation] = useState<"checked" | "unchecked">(
    "unchecked"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationResult = deletionRequestSchema.safeParse({
      email,
      reason,
      confirmation,
    });

    if (!validationResult.success) {
      validationResult.error.errors.forEach((error) => {
        toast({
          title: "Submission Failed",
          description: error.message,
          variant: "destructive",
        });
      });
      return;
    }

    try {
      const response = await fetch("/api/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          reason,
          confirmation: confirmation === "checked",
        }),
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Your account deletion request has been submitted.",
        });
        setEmail("");
        setReason("");
        setConfirmation("unchecked");
      } else {
        toast({
          title: "Failed!",
          description: "Failed to submit your request. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error!",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">
          Account Deletion Request
        </h2>
        <p className="text-center text-gray-600 mb-6">
          If you wish to delete your account and personal data, please fill out
          the form below.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="email" className="block text-sm font-medium">
            Your Email Address
          </label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="reason" className="block text-sm font-medium">
            Reason for Account Deletion (Optional)
          </label>
          <Textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
          />

          <div className="flex items-center space-x-2">
            <Checkbox
              id="confirmation"
              checked={confirmation === "checked"}
              onCheckedChange={(checked) =>
                setConfirmation(checked === true ? "checked" : "unchecked")
              }
            />
            <label
              htmlFor="confirmation"
              className={`text-sm ${
                confirmation == "checked" ? "" : "text-destructive"
              }`}
            >
              I understand that if I delete my account, all data linked to me
              will be gone forever.
            </label>
          </div>

          <Button type="submit" className="w-full">
            Submit Request
          </Button>
        </form>
      </div>
    </div>
  );
}
