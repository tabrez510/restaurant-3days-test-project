import mongoose, { Document, Model } from "mongoose";

export interface ICartItem {
  user: mongoose.Schema.Types.ObjectId;
  recipeId: mongoose.Schema.Types.ObjectId;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface ICartItemDocument extends ICartItem, Document {
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new mongoose.Schema<ICartItemDocument>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const CartItem: Model<ICartItemDocument> =
  mongoose.model<ICartItemDocument>("CartItem", cartItemSchema);
