import mongoose, { Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  image: string;
  cuisines: string[];
  recipes: mongoose.Schema.Types.ObjectId[];
}

const categorySchema = new mongoose.Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    cuisines: [
      {
        type: String,
        required: true,
      },
    ],
    recipes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],
  },
  { timestamps: true }
);

export const Category = mongoose.model<ICategory>("Category", categorySchema);
