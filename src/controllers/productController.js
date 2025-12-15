import prisma from "../lib/prisma.js";
import { slugify } from "../utils/slugMaker.js";

// =======================
// ✅ Create Product
// =======================
export const createProduct = async (req, res) => {
  try {
    const {
      id,
      name,
      description,
      price,
      salePrice,
      categoryId,
      tags,
      images,
    } = req.body;

    if (!name || !price) {
      return res
        .status(400)
        .json({ success: false, message: "Name, slug and price are required" });
    }

    const slug = slugify(name);

    // Validate categoryId if provided
    let resolvedCategoryId = null;
    if (categoryId) {
      const existingCategory = await prisma.category.findUnique({
        where: { id: categoryId },
        select: { id: true },
      });
      if (!existingCategory) {
        return res.status(400).json({
          success: false,
          message: "Invalid categoryId: category not found",
        });
      }
      resolvedCategoryId = existingCategory.id;
    }

    const product = await prisma.product.create({
      data: {
        id: id || undefined,
        name,
        slug,
        description,
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        categoryId: resolvedCategoryId,
        tags: tags || [],
        images,
      },
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error("Create Product Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create product" });
  }
};

// =======================
// ✅ Get All Products
// =======================
export const getProducts = async (req, res) => {
  try {
    const { recent } = req.query;

    let products;

    if (recent) {
      // সর্বশেষ 4 টা product আনবে
      products = await prisma.product.findMany({
        include: { category: true, stock: true },
        orderBy: { createdAt: "desc" }, // createdAt field থাকতে হবে
        take: 8,
      });
    } else {
      // সব product আনবে
      products = await prisma.product.findMany({
        include: { category: true, stock: true },
      });
    }

    res.json({ success: true, data: products });
  } catch (error) {
    console.error("Get Products Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch products" });
  }
};

// =======================
// ✅ Get Single Product By ID
// =======================
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true, stock: true },
    });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    console.error("Get Product Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch product" });
  }
};

// =======================
// ✅ Get Single Product By slug
// =======================
export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    console.log("Fetching product with slug:", slug); // Debug log
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { category: true, stock: true },
    });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    console.error("Get Product Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch product" });
  }
};

// =======================
// ✅ Update Product
// =======================
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      slug,
      description,
      price,
      salePrice,
      categoryId,
      tags,
      images,
      stockQuantity, // স্টক আপডেট করার জন্য আলাদা ফিল্ড
    } = req.body;

    // Validate categoryId if provided
    let categoryConnect = undefined;
    if (categoryId) {
      const existingCategory = await prisma.category.findUnique({
        where: { id: categoryId },
        select: { id: true },
      });

      if (!existingCategory) {
        return res.status(400).json({
          success: false,
          message: "Invalid categoryId: category not found",
        });
      }

      categoryConnect = { connect: { id: existingCategory.id } };
    }

    // Update Product
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug: slug || undefined,
        description,
        price: price !== undefined ? parseFloat(price) : undefined,
        salePrice: salePrice !== undefined ? parseFloat(salePrice) : undefined,
        category: categoryConnect,
        tags: tags || undefined,
        images: images || undefined,
      },
      include: {
        stock: true,
        category: true,
      },
    });

    // Update stock quantity if provided
    if (stockQuantity !== undefined) {
      await prisma.stock.updateMany({
        where: { productId: id },
        data: { quantity: parseInt(stockQuantity, 10) },
      });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ success: false, message: "Failed to update product" });
  }
};





// =======================
// ✅ Delete Product
// =======================
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete product" });
  }
};
