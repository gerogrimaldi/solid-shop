import { PrismaClient, Roles } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const saltRounds = 10; // Número de rondas de salting para bcrypt

async function main() {
  // Crear categorías
  await prisma.category.createMany({
    data: [
      { name: "Electronica" , imageUrl: "https://grimaldi-test-bucket.s3.us-east-1.amazonaws.com/laptop.webp" },
      { name: "Ropa" , imageUrl: "https://grimaldi-test-bucket.s3.us-east-1.amazonaws.com/zapatillas.webp" },
      { name: "Hogar" , imageUrl: "https://grimaldi-test-bucket.s3.us-east-1.amazonaws.com/aspiradora.webp" },
      { name: "Deportes" , imageUrl: "https://grimaldi-test-bucket.s3.us-east-1.amazonaws.com/mancuerna.webp" },
    ],
    skipDuplicates: true,
  });

  const allCategories = await prisma.category.findMany();

  // Obtener categorías con sus IDs
  const categoryMap = Object.fromEntries(
    allCategories.map((category) => [category.name, category.id]),
  );

  // Crear productos en categorías correctas
  await prisma.product.createMany({
    data: [
      // Electrónica
      { name: "Smartphone", description: "Un smartphone de última generación", price: 499.99, stock: 100, categoryId: categoryMap["Electrónica"], imageUrl: "https://grimaldi-test-bucket.s3.us-east-1.amazonaws.com/smartphone.webp" },
      { name: "Laptop", description: "Laptop ultradelgada con gran rendimiento", price: 999.99, stock: 50, categoryId: categoryMap["Electrónica"], imageUrl: "https://grimaldi-test-bucket.s3.us-east-1.amazonaws.com/laptop.webp" },
      { name: "Auriculares", description: "Auriculares inalámbricos con cancelación de ruido", price: 199.99, stock: 80, categoryId: categoryMap["Electrónica"], imageUrl: "https://grimaldi-test-bucket.s3.us-east-1.amazonaws.com/auriculares.webp" },
      { name: "Smartwatch", description: "Reloj inteligente con monitoreo de salud", price: 249.99, stock: 120, categoryId: categoryMap["Electrónica"], imageUrl: "https://grimaldi-test-bucket.s3.us-east-1.amazonaws.com/smartwatch.webp" },

      // Ropa
      { name: "Camiseta", description: "Camiseta de algodón de alta calidad", price: 19.99, stock: 200, categoryId: categoryMap["Ropa"], imageUrl: "https://grimaldi-test-bucket.s3.us-east-1.amazonaws.com/camiseta.webp" },
      { name: "Jeans", description: "Jeans ajustados para todos los días", price: 39.99, stock: 150, categoryId: categoryMap["Ropa"], imageUrl: "https://grimaldi-test-bucket.s3.us-east-1.amazonaws.com/jeans.webp" },
      { name: "Zapatillas", description: "Zapatillas deportivas cómodas y duraderas", price: 89.99, stock: 120, categoryId: categoryMap["Ropa"], imageUrl: "https://grimaldi-test-bucket.s3.us-east-1.amazonaws.com/zapatillas.webp" },
      { name: "Chaqueta", description: "Chaqueta impermeable para invierno", price: 129.99, stock: 70, categoryId: categoryMap["Ropa"], imageUrl: "https://grimaldi-test-bucket.s3.us-east-1.amazonaws.com/chaqueta.webp" },

      // Hogar
      { name: "Cafetera", description: "Cafetera con múltiples funciones programables", price: 79.99, stock: 60, categoryId: categoryMap["Hogar"], imageUrl: "https://grimaldi-test-bucket.s3.us-east-1.amazonaws.com/cafetera.webp" },
      { name: "Aspiradora", description: "Aspiradora sin cables con gran potencia de succión", price: 149.99, stock: 40, categoryId: categoryMap["Hogar"], imageUrl: "https://grimaldi-test-bucket.s3.us-east-1.amazonaws.com/aspiradora.webp" },

      // Deportes
      { name: "Bicicleta", description: "Bicicleta de montaña con marco de aluminio", price: 599.99, stock: 30, categoryId: categoryMap["Deportes"], imageUrl: "https://grimaldi-test-bucket.s3.us-east-1.amazonaws.com/bicicleta.webp" },
      { name: "Mancuernas", description: "Set de mancuernas ajustables", price: 49.99, stock: 90, categoryId: categoryMap["Deportes"], imageUrl: "https://grimaldi-test-bucket.s3.us-east-1.amazonaws.com/mancuerna.webp" },
    ],
    skipDuplicates: true,
  });

  const allProducts = await prisma.product.findMany();

  // Crear usuarios con contraseñas hasheadas
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@admin.com',
        username: 'admin',
        password: await bcrypt.hash('admin', saltRounds),
        Role: 'ADMIN',
        wishlist: { create: {} },
        cart: { create: {} },
      },
      include: { cart: true, wishlist: true },
    }),
    prisma.user.create({
      data: {
        email: 'user1@example.com',
        username: 'user1',
        password: await bcrypt.hash('password1', saltRounds),
        Role: 'USER',
        wishlist: { create: {} },
        cart: { create: {} },
      },
      include: { cart: true, wishlist: true },
    }),
    prisma.user.create({
      data: {
        email: 'user2@example.com',
        username: 'user2',
        password: await bcrypt.hash('password2', saltRounds),
        Role: 'USER',
        wishlist: { create: {} },
        cart: { create: {} },
      },
      include: { cart: true, wishlist: true },
    }),
    prisma.user.create({
      data: {
        email: 'user3@example.com',
        username: 'user3',
        password: await bcrypt.hash('password3', saltRounds),
        Role: 'USER',
        wishlist: { create: {} },
        cart: { create: {} },
      },
      include: { cart: true, wishlist: true },
    }),
  ]);

  // Agregar productos a carritos
  await prisma.cartItem.createMany({
    data: [
      { productId: allProducts[0].id, cartId: users[1].cart.id, quantity: 1 },
      { productId: allProducts[2].id, cartId: users[1].cart.id, quantity: 2 },
      { productId: allProducts[4].id, cartId: users[2].cart.id, quantity: 1 },
      { productId: allProducts[5].id, cartId: users[2].cart.id, quantity: 1 },
      { productId: allProducts[7].id, cartId: users[3].cart.id, quantity: 3 },
    ],
  });

  // Agregar productos a wishlists
  await prisma.wishlistItem.createMany({
    data: [
      { productId: allProducts[3].id, wishlistId: users[1].wishlist.id },
      { productId: allProducts[6].id, wishlistId: users[1].wishlist.id },
      { productId: allProducts[8].id, wishlistId: users[2].wishlist.id },
      { productId: allProducts[9].id, wishlistId: users[3].wishlist.id },
      { productId: allProducts[1].id, wishlistId: users[3].wishlist.id },
    ],
  });

  console.log('Seed completado exitosamente');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
