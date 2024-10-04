import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name should not exceed 100 characters" }),
  image: z
    .any()
    .refine((file) => file instanceof File || typeof file === "undefined", {
      message: "Invalid image file",
    }),
  cuisines: z
    .array(z.string().min(1, { message: "Cuisine cannot be empty" }))
    .nonempty({ message: "At least one cuisine is required" }),
});

export type CategoryFormSchema = z.infer<typeof categorySchema>;
