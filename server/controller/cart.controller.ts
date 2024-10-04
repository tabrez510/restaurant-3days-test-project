import { Request, Response } from "express";
import { CartItem } from "../models/cart.model";

export const addToCart = async (req: Request, res: Response) => {
  try {
    const user = req.id;
    const { menuId, name, image, price, quantity } = req.body;

    let cartItem = await CartItem.findOne({ user, menuId });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = new CartItem({ user, menuId, name, image, price, quantity });
      await cartItem.save();
    }

    res.status(200).json(cartItem);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getCartItems = async (req: Request, res: Response) => {
  try {
    const user = req.id;
    const cartItems = await CartItem.find({ user });
    res.status(200).json(cartItems);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const clearCartItems = async (req: Request, res: Response) => {
  try {
    const user = req.id;
    const cartItems = await CartItem.deleteMany({user});
    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const user = req.id;
    const { menuId } = req.params;
    await CartItem.deleteOne({ user, menuId });
    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const user = req.id;
    const { menuId } = req.params;
    const { quantity } = req.body;

    const cartItem = await CartItem.findOne({ user, menuId });
    if (cartItem) {
      cartItem.quantity = quantity;
      await cartItem.save();
      res.status(200).json(cartItem);
    } else {
      res.status(404).json({ message: "Cart item not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
