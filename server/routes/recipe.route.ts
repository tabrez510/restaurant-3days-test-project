import express from "express";
import {
  addRecipe,
  editRecipe,
  deleteRecipe,
} from "../controller/recipe.controller";
import upload from "../middlewares/multer";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = express.Router();

router.route("/").post(isAuthenticated, upload.single("image"), addRecipe);

router.route("/:id").put(isAuthenticated, upload.single("image"), editRecipe);

router.route("/:id").delete(isAuthenticated, deleteRecipe);

export default router;
