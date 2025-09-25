import express from "express";
import { getWishlist, toggleWishlistProduct } from "../controllers/wishlistController.js";

const router = express.Router();

router.post("/:userId", toggleWishlistProduct);
router.get("/:userId", getWishlist);

export default router;