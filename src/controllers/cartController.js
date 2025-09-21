import { prisma } from "../config/database.js";
import { createResponse } from "../utils/responseHelper.js";

export const createCart = async (req, res) => {
  const { userId, sessionId } = req.body;
  try {
    if (!userId && !sessionId) {
      return res
        .status(400)
        .json({ error: "Either userId or sessionId is required" });
    }
    if (userId) {
      const existCart = await prisma.cart.findUnique({
        where: { userId },
      });
      if (existCart)
        return res
          .status(400)
          .json(createResponse(false, "Cart already exists for this user!"));
    }

    const cart = await prisma.cart.create({
      data: { userId, sessionId },
    });

    res.status(201).json(createResponse(true, "Cart Created!", cart));
  } catch (error) {
    console.log("Cart creating error : ", error);
    res.status(500).json(createResponse(false, "Internal server error"));
  }
};

export const getCart = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(400)
        .json(createResponse(false, "Cart id is required!"));
    const cart = await prisma.cart.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        cartSummary: true,
      },
    });
    res.status(200).json(createResponse(true, "Cart fetched!", cart));
  } catch (error) {
    console.log("Cart getting error : ", error);
    res.status(500).json(createResponse(false, "Internal server error"));
  }
};

export const deleteCart = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(400)
        .json(createResponse(false, "Cart id is required!"));
    const deletedCart = await prisma.cart.delete({
      where: { id },
    });
    res.status(200).json(createResponse(true, "Cart Deleted!", deletedCart));
  } catch (error) {
    console.log("Cart deleting error : ", error);
    res.status(500).json(createResponse(false, "Internal server error"));
  }
};

// cartitems

export const addCartItem = async (req, res) => {
  try {
    const { id: cartId } = req.params;
    const { productId, variantId, quantity } = req.body;

    if (!cartId)
      return res.status(400).json(createResponse(false, "Cart id required!"));
    if (!productId)
      return res
        .status(400)
        .json(createResponse(false, "Product id is required!"));
    if (!quantity || quantity < 1)
      return res
        .status(400)
        .json(createResponse(false, "Valid quantity is required!"));

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product)
      return res
        .status(404)
        .json(createResponse(false, `Product not found with id ${productId}`));

    if (product.inventoryQuantity < quantity)
      return res
        .status(400)
        .json(
          createResponse(
            false,
            `Only ${product.stock} items available in stock`
          )
        );

    const existInCart = await prisma.cartItem.findFirst({
      where: {
        cartId,
        productId,
        variantId: variantId || null,
      },
    });

    if (existInCart) {
      return res
        .status(400)
        .json(
          createResponse(
            false,
            "This product with same variant already in Cart!"
          )
        );
    }

    const price = product.price * quantity;

    const item = await prisma.cartItem.create({
      data: { cartId, productId, variantId, quantity, price },
    });

    res.status(201).json(createResponse(true, "Item added to the cart!", item));
  } catch (error) {
    console.log("Cart item add : ", error);
    res.status(500).json(createResponse(false, "Internal server error"));
  }
};

export const updateItemQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!id) {
      return res
        .status(400)
        .json(createResponse(false, "Item id is required!"));
    }
    if (typeof quantity !== "number" || quantity < 1) {
      return res
        .status(400)
        .json(createResponse(false, "Valid quantity is required!"));
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id },
      include: { product: true },
    });

    if (!cartItem) {
      return res
        .status(404)
        .json(createResponse(false, "Cart item not found!"));
    }

    if (cartItem.product.inventoryQuantity < quantity) {
      return res
        .status(400)
        .json(
          createResponse(
            false,
            `Only ${cartItem.product.inventoryQuantity} items available in stock`
          )
        );
    }

    const newPrice = cartItem.product.price * quantity;

    const updatedItem = await prisma.cartItem.update({
      where: { id },
      data: { quantity, price: newPrice },
    });

    res
      .status(200)
      .json(createResponse(true, "Item quantity updated!", updatedItem));
  } catch (error) {
    console.log("Cart item quantity update : ", error);
    res.status(500).json(createResponse(false, "Internal server error"));
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(400)
        .json(createResponse(false, "Cart item id is required!"));

    const isItemExist = await prisma.cartItem.findUnique({
      where: { id },
    });

    if (!isItemExist)
      return res
        .status(404)
        .json(createResponse(false, `Item not found with id ${id}`));

    const deletedItem = await prisma.cartItem.delete({
      where: { id },
    });
    res
      .status(200)
      .json(createResponse(true, "Item deleted from cart!", deletedItem));
  } catch (error) {
    console.log("Cart item deleting : ", error);
    res.status(500).json(createResponse(false, "Internal server error"));
  }
};
