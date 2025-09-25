import { prisma } from "../config/database.js";
import { createResponse } from "../utils/responseHelper.js";

export const toggleWishlistProduct = async (req, res) => {
  const { productId } = req.body;
  const { userId } = req.params;
  try {
    if (!userId && !productId) {
      return res
        .status(400)
        .json(createResponse(false, "User ID and Product ID is required!"));
    }
    const isExist = await prisma.wishlist.findUnique({
      where: {
          userId_productId: {userId, productId}
        }
    });

    if (isExist) {
      const deletedProduct = await prisma.wishlist.delete({
        where: {
          userId_productId: {userId, productId}
        }
      });
      res
        .status(200)
        .json(
          createResponse(true, "Product removed from Wishlist!", deletedProduct)
        );
    } else {
      const newProduct = await prisma.wishlist.create({
        data: {
          userId,
          productId
        }
      });
      res
        .status(201)
        .json(
          createResponse(true, "Product added to the Wishlist!", newProduct)
        );
    }
  } catch (error) {
    console.log("Wishlist product toggle error : ", error);
    res.status(500).json(createResponse(false, "Internal server error"));
  }
};

export const getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId)
      return res
        .status(400)
        .json(createResponse(false, "User id is required!"));
    const wishlist = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });
    res.status(200).json(createResponse(true, "Wishlist fetched!", wishlist));
  } catch (error) {
    console.log("Wishlist getting error : ", error);
    res.status(500).json(createResponse(false, "Internal server error"));
  }
};
