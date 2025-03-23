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

  // Crear productos
  const products = await prisma.product.createMany({
    data: [
      { name: "Smartphone", description: "Última generación", price: 499.99, stock: 100, categoryId: allCategories[0].id, imageUrl: "https://via.placeholder.com/150" },
      { name: "Laptop", description: "Gran rendimiento", price: 999.99, stock: 50, categoryId: allCategories[0].id, imageUrl: "https://via.placeholder.com/150" },
      { name: "T-shirt", description: "Camiseta algodón", price: 19.99, stock: 200, categoryId: allCategories[1].id, imageUrl: "https://via.placeholder.com/150" },
      { name: "Jeans", description: "Jeans ajustados", price: 39.99, stock: 150, categoryId: allCategories[1].id, imageUrl: "https://via.placeholder.com/150" },
      { name: "Sofá", description: "Sofá cómodo", price: 299.99, stock: 20, categoryId: allCategories[2].id, imageUrl: "https://via.placeholder.com/150" },
      { name: "Lámpara", description: "Lámpara moderna", price: 49.99, stock: 80, categoryId: allCategories[2].id, imageUrl: "https://via.placeholder.com/150" },
      { name: "Pelota de fútbol", description: "Pelota oficial", price: 25.99, stock: 120, categoryId: allCategories[3].id, imageUrl: "https://via.placeholder.com/150" },
      { name: "Bicicleta", description: "Bicicleta de montaña", price: 599.99, stock: 30, categoryId: allCategories[3].id, imageUrl: "https://via.placeholder.com/150" },
      { name: "Tablet", description: "Pantalla HD", price: 299.99, stock: 70, categoryId: allCategories[0].id, imageUrl: "https://via.placeholder.com/150" },
      { name: "Reloj inteligente", description: "Monitoreo de salud", price: 149.99, stock: 90, categoryId: allCategories[0].id, imageUrl: "https://via.placeholder.com/150" },
    ],
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
