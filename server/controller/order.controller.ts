import { Request, Response } from "express";
import { Order } from "../models/order.model";
import { Category } from "../models/category.model";
import { User } from "../models/user.model";

type CheckoutSessionRequest = {
  cartItems: {
    recipeId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
  }[];
  deliveryDetails: {
    name: string;
    email: string;
    address: string;
    city: string;
  };
  categoryId: string;
};

const isAdmin = async (userId: string) => {
  const user = await User.findById(userId);
  return user && user.admin === true;
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ user: req.id })
      .populate("user")
      .populate("category");
    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


export const createOrder = async (req: Request, res: Response) => {
  try {
    const checkoutSessionRequest: CheckoutSessionRequest = req.body;
    const category = await Category.findById(
      checkoutSessionRequest.categoryId
    ).populate("recipes");

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    const order = new Order({
      category: category._id,
      user: req.id,
      deliveryDetails: checkoutSessionRequest.deliveryDetails,
      cartItems: checkoutSessionRequest.cartItems,
      totalAmount: checkoutSessionRequest.cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      ),
      status: "pending",
    });

    await order.save();

    return res.status(201).json({
      success: true,
      message: "Order created successfully.",
      order,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const getAllOrdersForAdmin = async (req: Request, res: Response) => {
  try {
    if (!(await isAdmin(req.id))) {
      return res
        .status(403)
        .json({ success: false, message: "Admin access required" });
    }

    const orders = await Order.find({})
      .populate("user")
      .populate("category");

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update order status (Admin Access)
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!(await isAdmin(req.id))) {
      return res
        .status(403)
        .json({ success: false, message: "Admin access required" });
    }

    const validStatuses = ["pending", "confirmed", "preparing", "outfordelivery", "delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status provided.",
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

