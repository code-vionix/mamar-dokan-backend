import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Start clearing the database...");

  // In reverse order of creation to avoid foreign key constraint violations
  await prisma.reviewVote.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.productReview.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cartSummary.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productFeature.deleteMany();
  await prisma.productSpecification.deleteMany();
  await prisma.productShippingInfo.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.userAddress.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.user.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.newsletterSubscription.deleteMany();
  await prisma.visitor.deleteMany();

  console.log("Database cleared successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });