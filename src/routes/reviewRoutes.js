import express from "express"
import { createReview, deleteReview, getReviews, reviewVoteToggle, updateReview } from "../controllers/reviewController.js";

const router = express.Router();

router.get("/:productId", getReviews);
router.post("/", createReview);
router.patch("/:id", updateReview);
router.delete("/:id", deleteReview);
router.post("/:id/update-vote", reviewVoteToggle);

export default router;