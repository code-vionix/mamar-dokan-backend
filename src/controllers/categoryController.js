import { deleteImageFromCloudinary } from "../config/cloudinary.js";
import { prisma } from "../config/database.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { createResponse } from "../utils/responseHelper.js";
import { slugify } from "../utils/slugMaker.js";

export const createCategory = async (req, res) => {
  const { name, description } = req.body;

  if (!name)
    return res
      .status(400)
      .json(createResponse(false, "Category name is Required!"));
  try {
    const slug = slugify(name);
    let imageUrl = null;

    const isCategoryExist = await prisma.category.findUnique({
      where: { slug },
    });
    if (isCategoryExist)
      return res
        .status(400)
        .json(
          createResponse(false, `Category with name ${name} already exist!`)
        );

    if (req.file && req.file?.buffer) {
      const image = await uploadToCloudinary(req.file.buffer, "categories");
      imageUrl = image.secure_url;
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        imageUrl,
      },
    });

    res.status(201).json(createResponse(true, "Category Created!", category));
  } catch (error) {
    console.log("Category creating error : ", error);
    res.status(500).json(createResponse(false, "Internal server error"));
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res
      .status(200)
      .json(createResponse(true, "Available categories fetched!", categories));
  } catch (error) {
    console.log("Categories fetching error : ", error);
    res.status(500).json(createResponse(false, "Internal server error"));
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(400)
        .json(createResponse(false, "Category id is required!"));
    const category = await prisma.category.findUnique({
      where: { id },
    });
    if (!category)
      return res
        .status(404)
        .json(createResponse(false, `Category not found with id ${id}`));
    res.status(200).json(createResponse(true, "Category fetched!", category));
  } catch (error) {
    console.log("Category by id error : ", error);
    res.status(500).json(createResponse(false, "Internal server error"));
  }
};

export const toggleActiveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(400)
        .json(createResponse(false, "Category id is Required!"));
    const category = await prisma.category.findUnique({
      where: { id },
    });
    if (!category)
      return res
        .status(404)
        .json(createResponse(false, `Category not found with id ${id}`));
    const updateActiveStatus = await prisma.category.update({
      where: { id },
      data: {
        isActive: !category.isActive,
      },
    });
    res
      .status(200)
      .json(createResponse(true, "Updated active status!", updateActiveStatus));
  } catch (error) {
    console.log("Category active toggle error : ", error);
    res.status(500).json(createResponse(false, "Internal server error"));
  }
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!id) {
    return res
      .status(400)
      .json(createResponse(false, "Category ID is required!"));
  }

  try {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return res
        .status(404)
        .json(createResponse(false, `Category not found with id ${id}`));
    }

    let slug = category.slug;
    if (name && name !== category.name) {
      slug = slugify(name);

      const existing = await prisma.category.findUnique({ where: { slug } });
      if (existing && existing.id !== category.id) {
        return res
          .status(400)
          .json(
            createResponse(
              false,
              `Category with name "${name}" already exists!`
            )
          );
      }
    }

    let imageUrl = category.imageUrl;
    if (req.file?.buffer) {
      if (category.imageUrl) {
        await deleteImageFromCloudinary(category.imageUrl);
      }
      imageUrl = await uploadImageToCloudinary(req.file.buffer);
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: name || category.name,
        slug,
        description:
          description !== undefined ? description : category.description,
        imageUrl,
      },
    });

    res
      .status(200)
      .json(
        createResponse(true, "Category updated successfully!", updatedCategory)
      );
  } catch (error) {
    console.error("Category update error:", error);
    res.status(500).json(createResponse(false, "Internal server error"));
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json(createResponse(false, "Category ID is required!"));
    }
    const category = await prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      return res
        .status(404)
        .json(createResponse(false, `Category not found with id ${id}`));
    }

    if (category.imageUrl) {
      await deleteImageFromCloudinary(category.imageUrl);
    }

    const deletedCategory = await prisma.category.delete({
      where: { id },
    });

    res
      .status(200)
      .json(
        createResponse(true, "Category deleted successfully!", deletedCategory)
      );
  } catch (error) {
    console.log("Category deleting error : ", error);
    res.status(500).json(createResponse(false, "Internal server error"));
  }
};
