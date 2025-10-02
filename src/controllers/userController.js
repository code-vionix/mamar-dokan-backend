import bcrypt from "bcryptjs";
import { prisma } from "../config/database.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { createResponse } from "../utils/responseHelper.js";

// Update User Info
export const updateUserInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone } = req.body;

    if (!id) {
      return res
        .status(400)
        .json(createResponse(false, "User ID is required!"));
    }

    const userExist = await prisma.user.findUnique({
      where: { id },
    });

    if (!userExist) {
      return res
        .status(404)
        .json(createResponse(false, `User not found with ID ${id}`));
    }

    // Validation
    const errors = {}; // Invalid inputs
    const ignoredFields = {}; // Same as DB
    const updateData = {}; // Fields to update

    // Name
    if (name !== undefined && name !== "") {
      if (typeof name !== "string" || name.length < 3 || name.length > 30) {
        errors.name = "Name must be a string between 3 and 30 characters.";
      } else if (userExist.name === name) {
        ignoredFields.name = "New name cannot be the same as the current name.";
      } else {
        updateData.name = name;
      }
    }

    // Phone
    if (phone !== undefined && phone !== "") {
      const phoneRegex = /^\+?[0-9]{10,15}$/;
      if (!phoneRegex.test(phone)) {
        errors.phone =
          "Phone must contain only digits (optional leading +) and be 10–15 characters long.";
      } else if (userExist.phone === phone) {
        ignoredFields.phone =
          "New phone cannot be the same as the current phone.";
      } else {
        updateData.phone = phone;
      }
    }

    // Invalid fields block update
    if (Object.keys(errors).length > 0) {
      return res
        .status(400)
        .json(createResponse(false, "Validation error", { errors }));
    }

    // No new fields to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json(
        createResponse(false, "No new fields provided for update", {
          ignoredFields,
        })
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json(
      createResponse(true, "User info updated!", {
        id: updatedUser.id,
        name: updatedUser.name,
        phone: updatedUser.phone,
      })
    );
  } catch (error) {
    console.error("User info update error:", error);
    res.status(500).json(createResponse(false, "Internal server error"));
  }
};

// Update User Avatar
export const updateUserAvatar = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;

    if (!id)
      return res
        .status(400)
        .json(createResponse(false, "User ID is required!"));
    if (!file || !file?.buffer)
      return res.status(400).json(createResponse(false, "Image is required!"));

    const userExist = await prisma.user.findUnique({
      where: { id },
    });

    if (!userExist) {
      return res
        .status(404)
        .json(createResponse(false, `User not found with ID ${id}`));
    }

    const result = await uploadToCloudinary(file.buffer, "avatars");
    const updatedAvatar = await prisma.user.update({
      where: { id },
      data: {
        avatarUrl: result.secure_url,
      },
    });
    res.status(200).json(
      createResponse(true, "User avatar updated!", {
        avatarUrl: updatedAvatar.avatarUrl,
      })
    );
  } catch (error) {
    console.error("User avatar update error:", error);
    res.status(500).json(createResponse(false, "Internal server error"));
  }
};

// Update Password
export const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    if (!id)
      return res
        .status(400)
        .json(createResponse(false, "User ID is required!"));
    if (!currentPassword || !newPassword)
      return res
        .status(400)
        .json(
          createResponse(
            false,
            "Current Password and New Password is required!"
          )
        );
    if (currentPassword === newPassword)
      return res
        .status(400)
        .json(
          createResponse(
            false,
            "New Password cannot be the same as the Current Password."
          )
        );
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user)
      return res
        .status(404)
        .json(createResponse(false, `User not found with ID ${id}`));

    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    );
    if (!isValidPassword)
      return res.status(400).json(createResponse(false, "Incorrect Password!"));

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id },
      data: {
        passwordHash,
      },
    });
    res.status(200).json(createResponse(true, "Password Updated!"));
  } catch (error) {
    console.error("User password update error:", error);
    res.status(500).json(createResponse(false, "Internal server error"));
  }
};

// Add New Address
export const createUserAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      type,
      isDefault,
      firstName,
      lastName,
      addressLine1,
      addressLine2,
      city,
      postalCode,
      country,
      phone,
    } = req.body;
    if (!id)
      return res
        .status(400)
        .json(createResponse(false, "User ID is Required!"));
    const requiredFields = {
      type,
      firstName,
      lastName,
      addressLine1,
      city,
      postalCode,
      country,
    };
    for (const [key, value] of Object.entries(requiredFields)) {
      if (value === undefined || value === null || value === "") {
        return res
          .status(400)
          .json(createResponse(false, `${key} is required!`));
      }
    }

    const allowedTypes = ["SHIPPING", "BILLING"];

    if (!allowedTypes.includes(type)) {
      return res
        .status(400)
        .json(
          createResponse(false, "Address type must be SHIPPING or BILLING")
        );
    }

    const newAddress = await prisma.userAddress.create({
      data: {
        userId: id,
        type,
        isDefault,
        firstName,
        lastName,
        addressLine1,
        addressLine2,
        city,
        postalCode,
        country,
        phone,
      },
    });

    res
      .status(201)
      .json(createResponse(true, "New Address Added!", newAddress));
  } catch (error) {
    console.error("User address creating error:", error);
    res.status(500).json(createResponse(false, "Internal server error"));
  }
};

// Get User Addresses
export const getUserAddresses = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(400)
        .json(createResponse(false, "User ID is required!"));

    const addresses = await prisma.userAddress.findMany({
      where: { userId: id },
    });
    res
      .status(200)
      .json(createResponse(true, "Fetch available user addresses", addresses));
  } catch (error) {
    console.error("User address getting error:", error);
    res.status(500).json(createResponse(false, "Internal server error"));
  }
};

// Update User Address
export const updateUserAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      type,
      isDefault,
      firstName,
      lastName,
      addressLine1,
      addressLine2,
      city,
      postalCode,
      country,
      phone,
    } = req.body;
    if (!id)
      return res
        .status(400)
        .json(createResponse(false, "Address ID is required!"));
    const isExist = await prisma.userAddress.findUnique({
      where: { id },
    });
    if (!isExist)
      return res
        .status(404)
        .json(createResponse(false, `Address not found with ID ${id}`));

    const updatedAddress = await prisma.userAddress.update({
      where: { id },
      data: {
        type,
        isDefault,
        firstName,
        lastName,
        addressLine1,
        addressLine2,
        city,
        postalCode,
        country,
        phone,
      },
    });
    res
      .status(200)
      .json(createResponse(true, "User address updated!", updatedAddress));
  } catch (error) {
    console.error("User address updating error:", error);
    res.status(500).json(createResponse(false, "Internal server error"));
  }
};

// Delete User Address
export const deleteUserAddress = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(400)
        .json(createResponse(false, "Address ID is required!"));
    const isExist = await prisma.userAddress.findUnique({
      where: { id },
    });
    if (!isExist)
      return res
        .status(404)
        .json(createResponse(false, `Address not found with ID ${id}`));
    await prisma.userAddress.delete({
      where: { id },
    });
    res.status(200).json(createResponse(true, "Address Deleted!"));
  } catch (error) {
    console.error("User address deleting error:", error);
    res.status(500).json(createResponse(false, "Internal server error"));
  }
};
