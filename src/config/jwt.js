// src/config/jwt.js
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "your-super-secret-jwt-key-change-this-in-production";
const JWT_EXPIRE = process.env.JWT_EXPIRE || "30d";
const JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE || "7d";

export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
    issuer: "ecommerce-api",
    audience: "ecommerce-app",
  });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRE,
    issuer: "ecommerce-api",
    audience: "ecommerce-app",
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET, {
    issuer: "ecommerce-api",
    audience: "ecommerce-app",
  });
};

export const decodeToken = (token) => {
  return jwt.decode(token);
};

export { JWT_EXPIRE, JWT_REFRESH_EXPIRE, JWT_SECRET };
