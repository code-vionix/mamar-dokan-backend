// src/config/database.js
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  errorFormat: "pretty",
});

// Test database connection
export async function connectDB() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");

    // Test query (optional)
    const userCount = await prisma.user.count();
    console.log(`Total users: ${userCount}`);
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
