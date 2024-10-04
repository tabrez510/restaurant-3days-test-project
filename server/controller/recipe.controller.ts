import { Request, Response } from "express";
import uploadImageOnCloudinary from "../utils/imageUpload";
import { Recipe } from "../models/recipe.model";
import { Category } from "../models/category.model";
import mongoose from "mongoose";
import { User } from "../models/user.model";

const isAdmin = async (userId: string) => {
  const user = await User.findById(userId);
  return user && user.admin === true;
};

export const addRecipe = async (req: Request, res: Response) => {
  try {
    if (!isAdmin(req.id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }

    const { name, description, price, ingredients, categoryId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
    const recipe: any = await Recipe.create({
      name,
      description,
      price,
      ingredients: JSON.parse(ingredients),
      image: imageUrl,
    });

    const category = await Category.findById(categoryId);
    if (category) {
      (category.recipes as mongoose.Schema.Types.ObjectId[]).push(recipe._id);
      await category.save();
    }

    return res.status(201).json({
      success: true,
      message: "Recipe added successfully",
      recipe,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const editRecipe = async (req: Request, res: Response) => {
  try {
    if (!isAdmin(req.id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }

    const { id } = req.params;
    const { name, description, price, ingredients } = req.body;
    const file = req.file;

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found!",
      });
    }

    if (name) recipe.name = name;
    if (description) recipe.description = description;
    if (price) recipe.price = price;
    if (ingredients) recipe.ingredients = JSON.parse(ingredients);

    if (file) {
      const imageUrl = await uploadImageOnCloudinary(
        file as Express.Multer.File
      );
      recipe.image = imageUrl;
    }

    await recipe.save();

    return res.status(200).json({
      success: true,
      message: "Recipe updated",
      recipe,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteRecipe = async (req: Request, res: Response) => {
  try {
    if (!isAdmin(req.id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }

    const { id } = req.params;
    const { categoryId } = req.body;

    const recipe = await Recipe.findByIdAndDelete(id);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found!",
      });
    }

    const category = await Category.findById(categoryId);
    if (category) {
      category.recipes = category.recipes.filter(
        (recipeId: mongoose.Schema.Types.ObjectId) => recipeId.toString() !== id
      );
      await category.save();
    }

    return res.status(200).json({
      success: true,
      message: "Recipe deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
