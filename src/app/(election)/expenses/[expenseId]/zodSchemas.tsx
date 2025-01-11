import * as z from "zod";

export const bankDetailsSchema = z.object({
  bank_account: z.string().min(1, "Bank account is required"),
  has_prepayment: z.boolean().optional(),
  prepayment_amount: z.number().optional(),
  description: z.string().min(1, "description is required"),
});
export const departmentCampusSchema = z.object({
  department: z.string().min(1, "Department is required"),
  campus: z.string().min(1, "Campus is required"),
});


export const documentSchema = z.object({
  amount: z.number().min(0, "Amount must be positive"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  description: z.string().min(1, "Description is required"),
  image: z.any(),
  url:z.string(),
  id:z.string()
});




export const documentsStepSchema = z.object({
  documents: z
    .array(documentSchema)
    .min(1, "At least one document is required"),
});

export const descriptionStepSchema = z.object({
  isEventRelated: z.boolean(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
});

export const formSchema = z.object({
  documents: z.array(documentSchema),
  bankAccount: z.string(),
  campus: z.string(),
  department: z.string(),
  description: z.string(),
  isEventRelated: z.boolean(),
  hasPrepayment: z.boolean(),
});

export type FormData = z.infer<typeof formSchema>;
