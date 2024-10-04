import { Request, Response } from "express";
import { Category } from "../models/category.model";
import { Multer } from "multer";
import uploadImageOnCloudinary from "../utils/imageUpload";
import { User } from "../models/user.model";


const isAdmin = async (userId: string) => {
  const user = await User.findById(userId);
  return user && user.admin === true;
};


export const createCategory = async (req: Request, res: Response) => {
  try {
    if (!(await isAdmin(req.id))) {
      return res
        .status(403)
        .json({ success: false, message: "Admin access required" });
    }

    const { name, cuisines } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
    await Category.create({
      name,
      cuisines: cuisines,
      image: imageUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Category Added",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const updateCategory = async (req: Request, res: Response) => {
  try {
    if (!(await isAdmin(req.id))) {
      return res
        .status(403)
        .json({ success: false, message: "Admin access required" });
    }

    const { name, cuisines } = req.body;
    const file = req.file;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    category.name = name;

    if (typeof cuisines === 'string') {
      category.cuisines = cuisines.split(",").map(cuisine => cuisine.trim());
    } else {
      category.cuisines = cuisines;
    }

    if (file) {
      const imageUrl = await uploadImageOnCloudinary(
        file as Express.Multer.File
      );
      category.image = imageUrl;
    }

    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated",
      category,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



export const deleteCategory = async (req: Request, res: Response) => {
  try {
    if (!(await isAdmin(req.id))) {
      return res
        .status(403)
        .json({ success: false, message: "Admin access required" });
    }

    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const searchCategory = async (req: Request, res: Response) => {
  try {
    const searchText = req.query.searchText || "";
    const selectedCuisines = (req.query.selectedCuisines as string || "").split(",").filter(cuisine => cuisine);
    const query: any = {};

    if (searchText) {
      query.$or = [
        { name: { $regex: searchText, $options: "i" } },
        { cuisines: { $regex: searchText, $options: "i" } },
      ];
    }
    if(selectedCuisines.length > 0){
        query.cuisines = {$in:selectedCuisines}
    }
    const categories = await Category.find(query);
    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getSingleCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.id;

    const category = await Category.findById(categoryId).populate({
      path: "recipes",
      options: { sort: { createdAt: -1 } },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
