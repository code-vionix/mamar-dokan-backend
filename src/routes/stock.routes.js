import express from "express";
import { manageStock } from "../controllers/stock.controller.js";

const router = express.Router();

// Create product
router.post("/:productId", manageStock);

export default router;
