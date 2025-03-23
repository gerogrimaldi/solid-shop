import { PrismaClient, Roles } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Crear categorías
  const categories = await prisma.category.createMany({
    data: [
      { name: "Electrónica" },
      { name: "Ropa" },
      { name: "Hogar" },
      { name: "Deportes" },
    ],
  });

  const allCategories = await prisma.category.findMany();

  // Obtener categorías con sus IDs
  const categoryMap = Object.fromEntries(
    allCategories.map((category) => [category.name, category.id])
  );

  // Crear productos en categorías correctas
  const products = await prisma.product.createMany({
    data: [
      // Electrónica
      {
        name: "Smartphone",
        description: "Un smartphone de última generación",
        price: 499.99,
        stock: 100,
        categoryId: categoryMap["Electrónica"],
        imageUrl: "https://via.placeholder.com/150",
      },
      {
        name: "Laptop",
        description: "Laptop ultradelgada con gran rendimiento",
        price: 999.99,
        stock: 50,
        categoryId: categoryMap["Electrónica"],
        imageUrl: "https://via.placeholder.com/150",
      },
      {
        name: "Auriculares",
        description: "Auriculares inalámbricos con cancelación de ruido",
        price: 199.99,
        stock: 80,
        categoryId: categoryMap["Electrónica"],
        imageUrl: "https://via.placeholder.com/150",
      },
      {
        name: "Smartwatch",
        description: "Reloj inteligente con monitoreo de salud",
        price: 249.99,
        stock: 120,
        categoryId: categoryMap["Electrónica"],
        imageUrl: "https://via.placeholder.com/150",
      },

      // Ropa
      {
        name: "Camiseta",
        description: "Camiseta de algodón de alta calidad",
        price: 19.99,
        stock: 200,
        categoryId: categoryMap["Ropa"],
        imageUrl: "https://via.placeholder.com/150",
      },
      {
        name: "Jeans",
        description: "Jeans ajustados para todos los días",
        price: 39.99,
        stock: 150,
        categoryId: categoryMap["Ropa"],
        imageUrl: "https://via.placeholder.com/150",
      },
      {
        name: "Zapatillas",
        description: "Zapatillas deportivas cómodas y duraderas",
        price: 89.99,
        stock: 120,
        categoryId: categoryMap["Ropa"],
        imageUrl: "https://via.placeholder.com/150",
      },
      {
        name: "Chaqueta",
        description: "Chaqueta impermeable para invierno",
        price: 129.99,
        stock: 70,
        categoryId: categoryMap["Ropa"],
        imageUrl: "https://via.placeholder.com/150",
      },

      // Hogar
      {
        name: "Cafetera",
        description: "Cafetera con múltiples funciones programables",
        price: 79.99,
        stock: 60,
        categoryId: categoryMap["Hogar"],
        imageUrl: "https://via.placeholder.com/150",
      },
      {
        name: "Aspiradora",
        description: "Aspiradora sin cables con gran potencia de succión",
        price: 149.99,
        stock: 40,
        categoryId: categoryMap["Hogar"],
        imageUrl: "https://via.placeholder.com/150",
      },

      // Deportes
      {
        name: "Bicicleta",
        description: "Bicicleta de montaña con marco de aluminio",
        price: 599.99,
        stock: 30,
        categoryId: categoryMap["Deportes"],
        imageUrl: "https://via.placeholder.com/150",
      },
      {
        name: "Mancuernas",
        description: "Set de mancuernas ajustables",
        price: 49.99,
        stock: 90,
        categoryId: categoryMap["Deportes"],
        imageUrl: "https://via.placeholder.com/150",
      },
    ],
    skipDuplicates: true,
  });

  const allProducts = await prisma.product.findMany();

  // Crear usuarios
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "admin@admin.com",
        username: "admin",
        password: "admin",
        Role: Roles.ADMIN,
        wishlist: { create: {} },
        cart: { create: {} },
      },
    }),
    prisma.user.create({
      data: {
        email: "user1@example.com",
        username: "user1",
        password: "password1",
        Role: Roles.USER,
        wishlist: { create: {} },
        cart: { create: {} },
      },
    }),
    prisma.user.create({
      data: {
        email: "user2@example.com",
        username: "user2",
        password: "password2",
        Role: Roles.USER,
        wishlist: { create: {} },
        cart: { create: {} },
      },
    }),
    prisma.user.create({
      data: {
        email: "user3@example.com",
        username: "user3",
        password: "password3",
        Role: Roles.USER,
        wishlist: { create: {} },
        cart: { create: {} },
      },
    }),
  ]);

  // Agregar productos a carritos
  await prisma.cartItem.createMany({
    data: [
      { productId: allProducts[0].id, cartId: users[1].cartId, quantity: 1 },
      { productId: allProducts[2].id, cartId: users[1].cartId, quantity: 2 },
      { productId: allProducts[4].id, cartId: users[2].cartId, quantity: 1 },
      { productId: allProducts[5].id, cartId: users[2].cartId, quantity: 1 },
      { productId: allProducts[7].id, cartId: users[3].cartId, quantity: 3 },
    ],
  });

  // Agregar productos a wishlists
  await prisma.wishlistItem.createMany({
    data: [
      { productId: allProducts[3].id, wishlistId: users[1].wishlistId },
      { productId: allProducts[6].id, wishlistId: users[1].wishlistId },
      { productId: allProducts[8].id, wishlistId: users[2].wishlistId },
      { productId: allProducts[9].id, wishlistId: users[3].wishlistId },
      { productId: allProducts[1].id, wishlistId: users[3].wishlistId },
    ],
  });

  console.log("Seed completado exitosamente");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
