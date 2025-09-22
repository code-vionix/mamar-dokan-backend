import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// NOTE: In a real application, you should use a library like bcrypt to hash passwords.
// For this script, we are storing plain text passwords for simplicity.
const hashPassword = (password) => password;

async function main() {
  console.log("Start seeding the database...");

  // --- Clear Database ---
  console.log("Clearing existing data...");
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
  console.log("Existing data cleared.");

  // --- Create Users ---
  const users = [];
  for (let i = 1; i <= 10; i++) {
    const user = await prisma.user.create({
      data: {
        email: `user${i}@example.com`,
        passwordHash: hashPassword(`password${i}`),
        name: `User FullName ${i}`,
        phone: `123456789${i}`,
        role: i === 1 ? "ADMIN" : "USER",
      },
    });
    users.push(user);
  }
  console.log(`${users.length} users created.`);

  // --- Create User Addresses ---
  for (const user of users) {
    await prisma.userAddress.create({
      data: {
        userId: user.id,
        type: "SHIPPING",
        isDefault: true,
        firstName: user.name.split(" ")[0],
        lastName: user.name.split(" ")[1],
        addressLine1: "123 Main St",
        city: "Anytown",
        state: "Anystate",
        postalCode: "12345",
        country: "USA",
      },
    });
  }
  console.log("User addresses created.");

  // --- Create Categories ---
  const categories = [];
  for (let i = 1; i <= 10; i++) {
    const category = await prisma.category.create({
      data: {
        name: `Category ${i}`,
        slug: `category-${i}`,
        description: `Description for category ${i}`,
      },
    });
    categories.push(category);
  }
  console.log(`${categories.length} categories created.`);

  // --- Create Brands ---
  const brands = [];
  for (let i = 1; i <= 10; i++) {
    const brand = await prisma.brand.create({
      data: {
        name: `Brand ${i}`,
        slug: `brand-${i}`,
      },
    });
    brands.push(brand);
  }
  console.log(`${brands.length} brands created.`);

  // --- Create Products ---
  const products = [];
  for (let i = 1; i <= 10; i++) {
    const product = await prisma.product.create({
      data: {
        name: `Product ${i}`,
        slug: `product-${i}`,
        description: `This is a detailed description for Product ${i}.`,
        price: parseFloat((Math.random() * 100 + 10).toFixed(2)),
        inventoryQuantity: Math.floor(Math.random() * 100),
        categoryId: categories[i % categories.length].id,
        brandId: brands[i % brands.length].id,
        isActive: true,
        tags: [`tag${i}`, `best-seller`],
      },
    });
    products.push(product);
  }
  console.log(`${products.length} products created.`);

  // --- Create Product Details (Images, Variants, etc.) ---
  for (const product of products) {
    // Create Product Images
    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: `https://via.placeholder.com/150/0000FF/808080?Text=Product-${product.id}`,
        isPrimary: true,
      },
    });
    // Create Product Variants
    await prisma.productVariant.create({
      data: {
        productId: product.id,
        sku: `SKU-${product.id}-RED-M`,
        size: "M",
        color: "Red",
        price: product.price + 5,
        stock: 50,
      },
    });
    // Create Product Features
    await prisma.productFeature.create({
      data: {
        productId: product.id,
        key: "Material",
        value: "Cotton",
      },
    });
    // Create Product Specifications
    await prisma.productSpecification.create({
      data: {
        productId: product.id,
        key: "Weight",
        value: "250g",
      },
    });
     // Create Product Shipping Info
     await prisma.productShippingInfo.create({
        data: {
          productId: product.id,
          info: "Ships in 1-2 business days.",
        },
      });
  }
  console.log("Product details (images, variants, etc.) created.");

  // --- Create Carts and Cart Items ---
  for (const user of users) {
    const cart = await prisma.cart.create({
      data: {
        userId: user.id,
      },
    });
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: products[Math.floor(Math.random() * products.length)].id,
        quantity: 1,
        price: 10.99,
      },
    });
  }
  console.log("Carts and cart items created.");

  // --- Create Orders and Order Items ---
  for (const user of users) {
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        email: user.email,
        orderNumber: `ORD-${Date.now()}-${user.id.substring(0, 4)}`,
        totalAmount: 119.98,
        subtotal: 109.99,
        shippingAmount: 9.99,
        billingAddress: { street: "123 Billing St", city: "Billville" },
        shippingAddress: { street: "456 Shipping St", city: "Shipburg" },
      },
    });
    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        productId: products[0].id,
        productName: products[0].name,
        quantity: 1,
        price: products[0].price,
        total: products[0].price,
      },
    });
  }
  console.log("Orders and order items created.");

  // --- Create Product Reviews ---
  const reviews = [];
  for (let i = 0; i < users.length; i++) {
    const review = await prisma.productReview.create({
      data: {
        userId: users[i].id,
        productId: products[i % products.length].id,
        rating: Math.floor(Math.random() * 5) + 1,
        title: `Review for ${products[i % products.length].name}`,
        comment: "This is a great product!",
      },
    });
    reviews.push(review);
  }
  console.log(`${reviews.length} product reviews created.`);
  
  // --- Create Review Votes ---
  for (let i = 0; i < reviews.length; i++) {
    // Make sure a user doesn't vote on their own review
    const votingUser = users[(i + 1) % users.length];
    await prisma.reviewVote.create({
        data: {
            reviewId: reviews[i].id,
            userId: votingUser.id,
            isHelpful: true,
        }
    });
  }
  console.log("Review votes created.");

  // --- Create Wishlists ---
  for (const user of users) {
    await prisma.wishlist.create({
      data: {
        userId: user.id,
        productId: products[Math.floor(Math.random() * products.length)].id,
      },
    });
  }
  console.log("Wishlists created.");

  // --- Create Coupons ---
  await prisma.coupon.create({
    data: {
      code: "SUMMER25",
      type: "PERCENTAGE",
      value: 25,
      usageLimit: 100,
      expiresAt: new Date(new Date().getFullYear() + 1, 7, 31), // July 31st next year
    },
  });
  await prisma.coupon.create({
    data: {
      code: "10OFF",
      type: "FIXED_AMOUNT",
      value: 10,
      minimumAmount: 50,
      usageLimit: 200,
    },
  });
  console.log("Coupons created.");

  // --- Create Newsletter Subscriptions ---
  for (let i = 1; i <= 10; i++) {
    await prisma.newsletterSubscription.create({
      data: {
        email: `subscriber${i}@example.com`,
        firstName: `Sub`,
        lastName: `Scriber${i}`
      },
    });
  }
  console.log("Newsletter subscriptions created.");

  // --- Create Visitors ---
   for (let i = 1; i <= 10; i++) {
    await prisma.visitor.create({
        data: {
            ip: `192.168.1.${i}`,
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
        }
    });
   }
   console.log("Visitors created.");


  console.log("Database seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("An error occurred during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });