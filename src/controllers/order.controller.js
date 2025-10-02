import { prisma } from "../config/database.js";
import { createResponse } from "../utils/responseHelper.js";

/**
 * Check if all items have enough stock
 * @param {Array} products - Products array fetched from DB
 * @param {Array} items - Items array with requested quantity
 * @returns {boolean} - true if all items have enough stock, else false
 */
function checkStockAvailability(products, items) {
  if (!products || !items) return false;

  return items.every((item, index) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return false;

    // Assuming stock is an array and we check the first stock entry
    const availableQuantity = product.stock?.[0]?.quantity ?? 0;
    return availableQuantity >= item.quantity;
  });
}

export const createOrder = async (req, res) => {
  const {
    userId,
    email,
    paymentMethod,
    taxAmount,
    shippingAmount,
    discountAmount,
    billingAddress,
    shippingAddress,
    notes,
    items,
  } = req.body;

  if (
    !userId ||
    !email ||
    !paymentMethod ||
    !taxAmount ||
    !shippingAddress ||
    !items.length
  ) {
    return res
      .status(400)
      .json(createResponse(false, "All fields are required!"));
  }

  items.map(
    (item) =>
      item.quantity <= 0 &&
      res
        .status(400)
        .json(createResponse(false, "Quantity must be greater than 0!"))
  );

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json(createResponse(false, "User not found!"));
    }

    // check if the product exists
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: items.map((item) => item.productId),
        },
      },
      include: {
        stock: true,
      },
    });

    if (products.length !== items.length) {
      return res.status(404).json(createResponse(false, "Product not found!"));
    }

    // check if the product is in stock
    const isStockAvailable = checkStockAvailability(products, items);
    if (!isStockAvailable) {
      return res
        .status(400)
        .json(createResponse(false, "Product out of stock!"));
    }

    const subtotal = items.reduce((total, item) => total + item.total, 0);
    const totalAmount = subtotal + taxAmount + shippingAmount - discountAmount;

    const order = await prisma.order.create({
      data: {
        userId,
        email,
        paymentMethod,
        subtotal,
        taxAmount,
        shippingAmount,
        discountAmount,
        totalAmount,
        billingAddress,
        shippingAddress,
        notes,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            sku: item.sku,
            quantity: item.quantity,
            price: item.price,
            total: item.total,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    res.status(201).json(createResponse(true, "Order Created!", order));
  } catch (error) {
    console.log("Order creating error : ", error);
    res.status(500).json(createResponse(false, "Internal server error"));
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
        user: true,
      },
    });
    res.status(200).json(createResponse(true, "Orders fetched!", orders));
  } catch (error) {
    console.log("Orders fetching error : ", error);
    res.status(500).json(createResponse(false, "Internal server error"));
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(400)
        .json(createResponse(false, "Order id is required!"));
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        user: true,
      },
    });
    if (!order)
      return res
        .status(404)
        .json(createResponse(false, `Order not found with id ${id}`));
    res.status(200).json(createResponse(true, "Order fetched!", order));
  } catch (error) {
    console.log("Order by id error : ", error);
    res.status(500).json(createResponse(false, "Internal server error"));
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      return res
        .status(400)
        .json(createResponse(false, "Order ID is required!"));
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status,
      },
    });

    res
      .status(200)
      .json(createResponse(true, "Order status updated!", updatedOrder));
  } catch (error) {
    res.status(500).json(createResponse(false, "Internal server error"));
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      return res
        .status(400)
        .json(createResponse(false, "Order ID is required!"));
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        paymentStatus: status,
      },
    });

    res
      .status(200)
      .json(createResponse(true, "Payment status updated!", updatedOrder));
  } catch (error) {
    res.status(500).json(createResponse(false, "Internal server error"));
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json(createResponse(false, "Order ID is required!"));
    }

    // use transaction to delete order and its items
    const deletedOrder = await prisma.$transaction(async (tx) => {
      const deletedOrder = await tx.order.delete({
        where: { id },
      });
      await tx.orderItem.deleteMany({
        where: { orderId: id },
      });
      return deletedOrder;
    });

    res.status(200).json(createResponse(true, "Order deleted!", deletedOrder));
  } catch (error) {
    res.status(500).json(createResponse(false, "Internal server error"));
  }
};

export const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res
        .status(400)
        .json(createResponse(false, "User ID is required!"));
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: true,
        user: true,
      },
    });

    res
      .status(200)
      .json(createResponse(true, "Orders fetched for the user!", orders));
  } catch (error) {
    console.log("Orders by user ID error: ", error);
    res.status(500).json(createResponse(false, "Internal server error"));
  }
};
