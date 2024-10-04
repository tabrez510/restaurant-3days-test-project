import { z } from "zod";

export const recipeSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Recipe name is required" })
    .max(100, { message: "Recipe name should not exceed 100 characters" }),
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .max(500, { message: "Description should not exceed 500 characters" }),
  price: z.number().min(1, { message: "Price should be at least 1" }),
  image: z
    .any()
    .refine((file) => file instanceof File || typeof file === "undefined", {
      message: "Invalid image file",
    }),
  ingredients: z
    .array(
      z.object({
        name: z.string().min(1, { message: "Ingredient name is required" }),
        quantity: z
          .string()
          .min(1, { message: "Ingredient quantity is required" }),
      })
    )
    .min(1, { message: "At least one ingredient is required" }),
    categoryId: z.string().min(1, { message: "Category is required" }),
});

export type RecipeFormSchema = z.infer<typeof recipeSchema>;
