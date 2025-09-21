import express from "express";
import { addCartItem, createCart, deleteCart, deleteCartItem, getCart, updateItemQuantity } from "../controllers/cartController.js";

const router = express.Router();

router.post("/", createCart);
router.get("/:id", getCart);
router.delete("/:id", deleteCart);

router.post("/:id/item", addCartItem);
router.patch("/item/:id", updateItemQuantity);
router.delete("/item/:id", deleteCartItem);

export default router;