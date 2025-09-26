import express from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProductBySlug,
  getProducts,
  updateProduct,
} from "../controllers/productController.js";
import { uploadToCloudinaryController } from "../controllers/productImageController.js";
import upload from "../middleware/multer.js";

const router = express.Router();

// ✅ Single image upload route
router.post("/image", upload.array("files"), uploadToCloudinaryController);

// Create product
router.post("/", createProduct);

// Get all products
router.get("/", getProducts);

// Get single product By ID
router.get("/:id", getProductById);

// Get single product By slug
router.get("/slug/:slug", getProductBySlug);

// Update product
router.put("/:id", updateProduct);

// Delete product
router.delete("/:id", deleteProduct);

export default router;
