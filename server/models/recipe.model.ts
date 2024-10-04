import mongoose, { Document } from "mongoose";

// Interface for Ingredient
export interface IIngredient {
  name: string;
  quantity: string; // e.g., "200g", "2 cups"
}

// Interface for Recipe
export interface IRecipe extends Document {
  name: string;
  description: string;
  price: number;
  image: string;
  ingredients: IIngredient[];
}

const recipeSchema = new mongoose.Schema<IRecipe>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    ingredients: [
      {
        name: { type: String, required: true },
        quantity: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const Recipe = mongoose.model<IRecipe>("Recipe", recipeSchema);
