import express from "express";
import {
  addToCart,
  getCartItems,
  clearCartItems,
  removeFromCart,
  updateCartItem,
} from "../controller/cart.controller";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = express.Router();

router.route("/cart").post(isAuthenticated, addToCart);
router.route("/cart").get(isAuthenticated, getCartItems);
router.route("/cart").delete(isAuthenticated, clearCartItems);
router.route("/cart/:menuId").delete(isAuthenticated, removeFromCart);
router.route("/cart/:menuId").put(isAuthenticated, updateCartItem);

export default router;
