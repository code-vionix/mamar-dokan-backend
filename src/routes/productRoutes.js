import express from "express";
import upload from "../middleware/multer.js";
import { uploadToCloudinary } from "../controllers/productImageController.js";
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct } from "../controllers/productController.js";

const router = express.Router();

// ✅ Single image upload route
router.post("/image", upload.single("file"), uploadToCloudinary);

// Create product
router.post("/", createProduct);

// Get all products
router.get("/", getProducts);

// Get single product
router.get("/:id", getProductById);

// Update product
router.put("/:id", updateProduct);

// Delete product
router.delete("/:id", deleteProduct);

export default router;
