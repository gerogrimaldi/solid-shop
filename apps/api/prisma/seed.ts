<<<<<<< HEAD
import { PrismaClient, Roles } from '@prisma/client';
=======
import { PrismaClient, Roles } from "@prisma/client";
import bcrypt from 'bcrypt';
>>>>>>> 08788c5e8a060cbacc521f3182804ae88e9ef179

const prisma = new PrismaClient();
const saltRounds = 10; // Número de rondas de salting para bcrypt

async function main() {
  // Crear categorías
<<<<<<< HEAD
  const electronicsCategory = await prisma.category.create({
    data: {
      name: 'Electrónica',
    },
  });

  const clothingCategory = await prisma.category.create({
    data: {
      name: 'Ropa',
    },
  });

  // Crear productos
  const product1 = await prisma.product.create({
    data: {
      name: 'Smartphone',
      description: 'Un smartphone de última generación',
      price: 499.99,
      stock: 100,
      categoryId: electronicsCategory.id,
      //   image: "https://via.placeholder.com/150",
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Laptop',
      description: 'Laptop ultradelgada con gran rendimiento',
      price: 999.99,
      stock: 50,
      categoryId: electronicsCategory.id,
      //   image: "https://via.placeholder.com/150",
    },
  });

  const product3 = await prisma.product.create({
    data: {
      name: 'T-shirt',
      description: 'Camiseta de algodón de alta calidad',
      price: 19.99,
      stock: 200,
      categoryId: clothingCategory.id,
      //   image: "https://via.placeholder.com/150",
    },
  });

  const product4 = await prisma.product.create({
    data: {
      name: 'Jeans',
      description: 'Jeans ajustados para todos los días',
      price: 39.99,
      stock: 150,
      categoryId: clothingCategory.id,
      //   image: "https://via.placeholder.com/150",
    },
  });

  await prisma.user.deleteMany();
  // Crear un usuario
  const user = await prisma.user.create({
    data: {
      email: 'usuario@ejemplo.com',
      username: 'usuarioEjemplo',
      password: 'password123', // Asegúrate de usar un hash de contraseña en producción
      Role: Roles.USER,
      wishlist: {
        create: {},
=======
  await prisma.category.createMany({
    data: [
      { name: "Electrónica" },
      { name: "Ropa" },
      { name: "Hogar" },
      { name: "Deportes" },
    ],
    skipDuplicates: true,
  });

  const allCategories = await prisma.category.findMany();

  // Obtener categorías con sus IDs
  const categoryMap = Object.fromEntries(
    allCategories.map((category) => [category.name, category.id])
  );

  // Crear productos en categorías correctas
  await prisma.product.createMany({
    data: [
      // Electrónica
      { name: "Smartphone", description: "Un smartphone de última generación", price: 499.99, stock: 100, categoryId: categoryMap["Electrónica"], imageUrl: "https://via.placeholder.com/150" },
      { name: "Laptop", description: "Laptop ultradelgada con gran rendimiento", price: 999.99, stock: 50, categoryId: categoryMap["Electrónica"], imageUrl: "https://via.placeholder.com/150" },
      { name: "Auriculares", description: "Auriculares inalámbricos con cancelación de ruido", price: 199.99, stock: 80, categoryId: categoryMap["Electrónica"], imageUrl: "https://via.placeholder.com/150" },
      { name: "Smartwatch", description: "Reloj inteligente con monitoreo de salud", price: 249.99, stock: 120, categoryId: categoryMap["Electrónica"], imageUrl: "https://via.placeholder.com/150" },

      // Ropa
      { name: "Camiseta", description: "Camiseta de algodón de alta calidad", price: 19.99, stock: 200, categoryId: categoryMap["Ropa"], imageUrl: "https://via.placeholder.com/150" },
      { name: "Jeans", description: "Jeans ajustados para todos los días", price: 39.99, stock: 150, categoryId: categoryMap["Ropa"], imageUrl: "https://via.placeholder.com/150" },
      { name: "Zapatillas", description: "Zapatillas deportivas cómodas y duraderas", price: 89.99, stock: 120, categoryId: categoryMap["Ropa"], imageUrl: "https://via.placeholder.com/150" },
      { name: "Chaqueta", description: "Chaqueta impermeable para invierno", price: 129.99, stock: 70, categoryId: categoryMap["Ropa"], imageUrl: "https://via.placeholder.com/150" },

      // Hogar
      { name: "Cafetera", description: "Cafetera con múltiples funciones programables", price: 79.99, stock: 60, categoryId: categoryMap["Hogar"], imageUrl: "https://via.placeholder.com/150" },
      { name: "Aspiradora", description: "Aspiradora sin cables con gran potencia de succión", price: 149.99, stock: 40, categoryId: categoryMap["Hogar"], imageUrl: "https://via.placeholder.com/150" },

      // Deportes
      { name: "Bicicleta", description: "Bicicleta de montaña con marco de aluminio", price: 599.99, stock: 30, categoryId: categoryMap["Deportes"], imageUrl: "https://via.placeholder.com/150" },
      { name: "Mancuernas", description: "Set de mancuernas ajustables", price: 49.99, stock: 90, categoryId: categoryMap["Deportes"], imageUrl: "https://via.placeholder.com/150" },
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
>>>>>>> 08788c5e8a060cbacc521f3182804ae88e9ef179
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

<<<<<<< HEAD
  await prisma.cartItem.create({
    data: {
      productId: product2.id,
      cartId: user.cartId,
      quantity: 2,
    },
  });

  // Agregar productos a la wishlist
  await prisma.wishlistItem.create({
    data: {
      productId: product3.id,
      wishlistId: user.wishlistId,
    },
  });

  await prisma.wishlistItem.create({
    data: {
      productId: product4.id,
      wishlistId: user.wishlistId,
    },
  });

  console.log('Seed completado');
=======
  console.log("Seed completado exitosamente");
>>>>>>> 08788c5e8a060cbacc521f3182804ae88e9ef179
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
