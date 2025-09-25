import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  toggleActiveStatus,
  updateCategory,
} from "../controllers/categoryController.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post("/", upload.single("image"), createCategory);
router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.patch("/status/:id", toggleActiveStatus);
router.patch("/:id", upload.single("image"), updateCategory);
router.delete("/:id", deleteCategory);

export default router;
