import { prisma } from "../config/database.js";
import { createResponse } from "../utils/responseHelper.js";

export const createReview = async (req, res) => {
  try {
    const { productId, userId, orderId, rating, title, comment } = req.body;
    if (!productId || !userId || !rating)
      return res
        .status(400)
        .json(
          createResponse(
            false,
            "Product ID and User ID and Rating is mandatory!"
          )
        );
    if (typeof rating !== "number") {
      return res
        .status(400)
        .json(createResponse(false, "Rating must be a number!"));
    }
    const isExist = await prisma.productReview.findUnique({
      where: {
        productId_userId: { productId, userId },
      },
    });
    if (isExist)
      return res
        .status(400)
        .json(
          createResponse(
            false,
            "This user already reviewd this product!",
            isExist
          )
        );
    const review = await prisma.productReview.create({
      data: {
        productId,
        userId,
        rating,
        orderId,
        title,
        comment,
        isVerified: orderId ? true : false,
      },
    });
    res.status(201).json(createResponse(true, "Review created!", review));
  } catch (error) {
    console.log("Product Review creating error : ", error);
    res.status(500).json(createResponse(false, "Internal server error"));
  }
};

export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, rating, title, comment } = req.body;
    if (!id)
      return res
        .status(400)
        .json(createResponse(false, "Review ID is required!"));
    if (!userId || !rating)
      return res
        .status(400)
        .json(createResponse(false, "User ID and Rating is required!"));
    if (typeof rating !== "number") {
      return res
        .status(400)
        .json(createResponse(false, "Rating must be a number!"));
    }
    const review = await prisma.productReview.update({
      where: { id, userId },
      data: {
        rating,
        title,
        comment,
      },
    });

    res.status(200).json(createResponse(true, "Review Updated!", review));
  } catch (error) {
    console.log("Review updating error : ", error);
    if (error.code === "P2025") {
      return res
        .status(401)
        .json(createResponse(false, "Not authorized or review not found"));
    }
    res.status(500).json(createResponse(false, "Internal server error"));
  }
};

export const getReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId)
      return res
        .status(400)
        .json(createResponse(false, "Product ID is required!"));
    const reviews = await prisma.productReview.findMany({
      where: { productId, isApproved: true },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
        reviewVotes: true,
      },
    });
    res.status(200).json(createResponse(true, "All review fetched!", reviews));
  } catch (error) {
    console.log("Product review getting error : ", error);
    res.status(500).json(createResponse(false, "Internal server error"));
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    if (!id)
      return res
        .status(400)
        .json(createResponse(false, "Review ID is required!"));
    if (!userId)
      return res.status(400).json(createResponse(false, "User is required!"));
    const review = await prisma.productReview.delete({
      where: { id, userId },
    });

    res.status(200).json(createResponse(true, "Review Deleted!", review));
  } catch (error) {
    console.log("Review Deleting error : ", error);
    if (error.code === "P2025") {
      return res
        .status(401)
        .json(createResponse(false, "Not authorized or review not found"));
    }
    res.status(500).json(createResponse(false, "Internal server error"));
  }
};

export const reviewVoteToggle = async (req, res) => {
  try {
    const { id: reviewId } = req.params;
    const { userId, isHelpful } = req.body;

    if (!reviewId) {
      return res
        .status(400)
        .json(createResponse(false, "Review ID is required!"));
    }
    if (typeof userId !== "string" || typeof isHelpful !== "boolean") {
      return res
        .status(400)
        .json(createResponse(false, "User ID and isHelpful are required!"));
    }

    const existingVote = await prisma.reviewVote.findUnique({
      where: { userId_reviewId: { userId, reviewId } },
    });

    let updateData = {};

    if (!existingVote) {
      await prisma.reviewVote.create({
        data: { reviewId, userId, isHelpful },
      });

      if (isHelpful) {
        updateData = { helpfulCount: { increment: 1 } };
      } else {
        updateData = { notHelpfulCount: { increment: 1 } };
      }
    } else if (existingVote.isHelpful === isHelpful) {
      await prisma.reviewVote.delete({
        where: { userId_reviewId: { userId, reviewId } },
      });

      if (isHelpful) {
        updateData = { helpfulCount: { decrement: 1 } };
      } else {
        updateData = { notHelpfulCount: { decrement: 1 } };
      }
    } else {
      await prisma.reviewVote.update({
        where: { userId_reviewId: { userId, reviewId } },
        data: { isHelpful },
      });

      if (isHelpful) {
        updateData = {
          helpfulCount: { increment: 1 },
          notHelpfulCount: { decrement: 1 },
        };
      } else {
        updateData = {
          notHelpfulCount: { increment: 1 },
          helpfulCount: { decrement: 1 },
        };
      }
    }

    const updateReview = await prisma.productReview.update({
      where: { id: reviewId },
      data: updateData,
    });

    res
      .status(200)
      .json(createResponse(true, "Review Vote Updated!", updateReview));
  } catch (error) {
    console.log("Review Voting error : ", error);
    res.status(500).json(createResponse(false, "Internal server error"));
  }
};
