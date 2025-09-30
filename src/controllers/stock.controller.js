import prisma from "../lib/prisma.js";

export async function manageStock(req, res) {
  if (!req.body || !req.params)
    return res.status(400).json(createResponse(false, "Invalid request"));

  const { productId } = req.params;
  const { quantity } = req.body;

  try {
    const existingStock = await prisma.stock.findUnique({
      where: { productId },
    });

    if (existingStock) {
      const updatedStock = await prisma.stock.update({
        where: { productId },
        data: { quantity },
      });

      return res.status(200).json({
        ...updatedStock,
        message: "Stock updated successfully",
      });
    }

    const newStock = await prisma.stock.create({
      data: {
        productId,
        quantity,
      },
    });

    if (!newStock) {
      return res.status(500).json({ error: "Failed to create stock" });
    }

    return res
      .status(201)
      .json({ productId, quantity, message: "Stock created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
