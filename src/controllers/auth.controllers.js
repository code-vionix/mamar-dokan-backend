import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";

import { prisma } from "../config/database.js";
import { generateRefreshToken, generateToken } from "../config/jwt.js";
import { createResponse } from "../utils/responseHelper.js";

// Register user
export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("⚠️ Validation errors:", errors.array()); // Log validation errors
      return res
        .status(400)
        .json(createResponse(false, "Validation failed", null, errors.array()));
    }

    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return res
        .status(400)
        .json(createResponse(false, "User already exists with this email"));
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user with only name
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        name: name.trim(),
        phone: phone?.trim(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    // Generate tokens
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
    });

    res.status(201).json(
      createResponse(true, "User registered successfully", {
        user,
        accessToken: token,
        refreshToken,
      })
    );
  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json(createResponse(false, "Internal server error"));
  }
};

// Login user
export const login = async (req, res) => {
  console.log(req.body);
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res
        .status(400)
        .json(createResponse(false, "Validation failed", null, errors.array()));

    const { email, password, role } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || !user.isActive)
      return res.status(401).json(createResponse(false, "Invalid credentials"));

    if (role === "ADMIN" && user.role !== "ADMIN")
      return res
        .status(403)
        .json(createResponse(false, "Access denied: Not an admin"));

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid)
      return res.status(401).json(createResponse(false, "Invalid credentials"));

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
    });

    const { passwordHash, ...userWithoutPassword } = user;

    res.json(
      createResponse(true, "Login successful", {
        user: userWithoutPassword,
        accessToken: token,
        refreshToken,
      })
    );
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json(createResponse(false, "Internal server error"));
  }
};

// Get current user
export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        dateOfBirth: true,
        avatarUrl: true,
        role: true,
        emailVerified: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        addresses: true,
        orders: true,
        reviews: true,
        wishlist: true,
        cart: true,
      },
    });

    if (!user)
      return res.status(404).json(createResponse(false, "User not found"));

    res.json(createResponse(true, "User retrieved successfully", user));
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json(createResponse(false, "Internal server error"));
  }
};

// OAuth login
export const oauthLogin = async (req, res) => {
  try {
    const { email, name, image } = req.body;
    if (!email || !name)
      return res
        .status(400)
        .json(createResponse(false, "Email and name are required."));

    const lowerEmail = email.toLowerCase();

    let user = await prisma.user.findUnique({ where: { email: lowerEmail } });

    if (!user) {
      const [firstName, ...rest] = name.trim().split(" ");
      const lastName = rest.join(" ");

      user = await prisma.user.create({
        data: {
          email: lowerEmail,
          firstName,
          lastName,
          avatarUrl: image,
          emailVerified: true,
          isActive: true,
        },
      });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
    });

    const { passwordHash, ...userWithoutPassword } = user;

    res.json(
      createResponse(true, "OAuth login successful", {
        user: userWithoutPassword,
        accessToken: token,
        refreshToken,
      })
    );
  } catch (error) {
    console.error("OAuth login error:", error);
    res.status(500).json(createResponse(false, "Internal server error"));
  }
};
