import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import {
  getOrders,
  createOrder,
  getAllOrdersForAdmin,
  updateOrderStatus,
} from "../controller/order.controller";

const router = express.Router();

router.route("/orders").get(isAuthenticated, getOrders);
router.route("/orders").post(isAuthenticated, createOrder);

router.route("/admin/orders").get(isAuthenticated, getAllOrdersForAdmin);
router
  .route("/admin/orders/:id/status")
  .put(isAuthenticated, updateOrderStatus);

export default router;
