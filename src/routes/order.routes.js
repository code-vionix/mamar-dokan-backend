import express from "express";
import {
  createOrder,
  deleteOrder,
  getOrderById,
  getOrders,
  getOrdersByUserId,
  updateOrderStatus,
  updatePaymentStatus,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/", getOrders);
router.get("/:id", getOrderById);
router.get("/user/:userId", getOrdersByUserId);
router.patch("/:id/status", updateOrderStatus);
router.patch("/:id/payment-status", updatePaymentStatus);
router.delete("/:id", deleteOrder);

export default router;
