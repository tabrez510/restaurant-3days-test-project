import express from "express";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  searchCategory,
  getSingleCategory,
} from "../controller/category.controller";
import upload from "../middlewares/multer";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = express.Router();

router
  .route("/")
  .post(isAuthenticated, upload.single("image"), createCategory);

router
  .route("/:id")
  .put(isAuthenticated, upload.single("image"), updateCategory);

router.route("/:id").delete(isAuthenticated, deleteCategory);

router.route("/").get(isAuthenticated, getAllCategories);

router.route("/search").get(isAuthenticated, searchCategory);

router.route("/:id").get(isAuthenticated, getSingleCategory);

export default router;
