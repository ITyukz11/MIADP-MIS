import { z, ZodError, ZodIssue } from 'zod';

// Function to create ZodError with custom errors
const createZodError = (errors: ZodIssue[]) => {
  return new ZodError(errors);
};

export const CalendarOfActivitySchema = z.object({
  authorizeOther: z.boolean().optional(),
  individualActivity: z.boolean(),
  WFPYear: z.string().optional(),
  activityTitle: z.string().min(1, "is required *"),
  activityDescription: z.string().min(1, "is required *"),
  type: z.string().min(1, "is required *"),
  otherType: z.string().nullable().optional(),
  targetParticipant: z.string().min(1, "is required *"),
  location: z.string().min(1, "is required *"),
  dateFrom: z.string(),
  dateTo: z.string(),
  timeStart: z.string(),
  timeEnd: z.string(),
  allDay: z.boolean(),
  participants: z.array(
    z.object({
      userId: z.string().min(1, "is required *"),
    })
  ).min(1, "At least one participant is required *").optional(),
  listMode: z.boolean().optional(),
  preparatoryList: z.array(
    z.object({
      description: z.string().optional(),
      status: z.string().optional(),
      remarks: z.string().optional(),
    })
  ).optional().default([{ description: '', status: '', remarks: '' }]),
  preparatoryContent: z.string().optional(),
  remarks: z.string(),
  color: z.string(),
  status: z.string(),
  calendarOfActivityAttachment: z.array(
    z.object({
      details: z.string().optional(),
      link: z.string().optional(),
    })
  ).optional(),
  name: z.string().optional(),
  user: z.object({
    component: z.string(),
    unit: z.string(),
    position: z.string(),
    region: z.string()
  }).optional()
})
.refine((data) => {
  const errors: ZodIssue[] = [];

  // Validate static fields
  if (!data.activityTitle.trim()) {
    errors.push({
      message: "*",
      path: ["activityTitle"],
      code: 'custom'
    });
  }
  if (!data.activityDescription.trim()) {
    errors.push({
      message: "*",
      path: ["activityDescription"],
      code: 'custom'
    });
  }
  if (!data.type.trim()) {
    errors.push({
      message: "*",
      path: ["type"],
      code: 'custom'
    });
  }
  if (!data.targetParticipant.trim()) {
    errors.push({
      message: "*",
      path: ["targetParticipant"],
      code: 'custom'
    });
  }
  if (!data.location.trim()) {
    errors.push({
      message: "*",
      path: ["location"],
      code: 'custom'
    });
  }

  if (!data.participants || data.participants.length === 0) {
    errors.push({
      message: "At least one participant is required *",
      path: ["participants"],
      code: 'custom'
    });
  }
  // Validate preparatoryContent if listMode is false
  if (!data.listMode && !data.preparatoryContent?.trim()) {
    errors.push({
      message: "Preparatory content is required *",
      path: ["preparatoryContent"],
      code: 'custom'
    });
  }

  // Validate preparatoryList if listMode is true
  if (data.listMode) {
    data.preparatoryList.forEach((item, index) => {
      if (!item.description?.trim()) {
        errors.push({
          message: "Description is required *",
          path: [`preparatoryList.${index}.description`],
          code: 'custom'
        });
      }
      if (!item.status?.trim()) {
        errors.push({
          message: "Status is required *",
          path: [`preparatoryList.${index}.status`],
          code: 'custom'
        });
      }
      if (item.status === 'Other' && !item.remarks?.trim()) {
        errors.push({
          message: "Please specify is required *",
          path: [`preparatoryList.${index}.remarks`],
          code: 'custom'
        });
      }
    });
  }
  // Validate attachments if it contains any data
  const hasNonEmptyAttachment = data.calendarOfActivityAttachment?.some(
    calendarOfActivityAttachment => calendarOfActivityAttachment.details?.trim() || calendarOfActivityAttachment.link?.trim()
  );
  
  if (hasNonEmptyAttachment) {
    data.calendarOfActivityAttachment?.forEach((attachment, index) => {
      if (!attachment.details?.trim()) {
        errors.push({
          message: "Details are required *",
          path: [`calendarOfActivityAttachment.${index}.details`],
          code: 'custom'
        });
      }
      if (!attachment.link?.trim()) {
        errors.push({
          message: "Link is required *",
          path: [`calendarOfActivityAttachment.${index}.link`],
          code: 'custom'
        });
      }
    });
  }

  // Ensure otherType is present if type is 'Other'
  if (data.type === 'Other' && !data.otherType?.trim()) {
    errors.push({
      message: "is required *",
      path: ["otherType"],
      code: 'custom'
    });
  }

  if (errors.length > 0) {
    throw createZodError(errors);
  }

  return true;
});
