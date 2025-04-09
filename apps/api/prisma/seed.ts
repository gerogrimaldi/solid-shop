import { PrismaClient, Roles } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Smartphone } from 'lucide-react';

const prisma = new PrismaClient();
const saltRounds = 10; // Número de rondas de salting para bcrypt

async function main() {
// Crear categorías
await prisma.category.createMany({
  data: [
    { name: "Electrónica", imageUrl: "https://grimaldi-test-bucket.s3.us-east-1.amazonaws.com/laptop.webp" },
    { name: "Ropa", imageUrl: "https://grimaldi-test-bucket.s3.us-east-1.amazonaws.com/zapatillas.webp" },
    { name: "Hogar", imageUrl: "https://grimaldi-test-bucket.s3.us-east-1.amazonaws.com/aspiradora.webp" },
    { name: "Deportes", imageUrl: "https://grimaldi-test-bucket.s3.us-east-1.amazonaws.com/mancuerna.webp" },
    { name: "Supermercado", imageUrl: "https://grimaldi-test-bucket.s3.us-east-1.amazonaws.com/1744161026474-cereales.webp", },
    { name: "Vehículos", imageUrl: "https://grimaldi-test-bucket.s3.us-east-1.amazonaws.com/1744161589601-hilux.webp" },
  ],
  skipDuplicates: true,
});


  const allCategories = await prisma.category.findMany();

  // Obtener categorías con sus IDs
  const categoryMap = Object.fromEntries(
    allCategories.map((category) => [category.name, category.id]),
  );

  const ARRimageUrls = {
    // electronica
    Smartphone: "https://grimaldi-test-bucket.s3.us-east-1.amazonaws.com/smartphone.webp",
    Laptop: "https://grimaldi-test-bucket.s3.us-east-1.amazonaws.com/laptop.webp",
    Auriculares: "https://grimaldi-test-bucket.s3.us-east-1.amazonaws.com/auriculares.webp",
    Smartwatch: "https://grimaldi-test-bucket.s3.us-east-1.amazonaws.com/smartwatch.webp",
    Switch: "https://grimaldi-test-bucket.s3.us-east-1.amazonaws.com/1744161500720-switch.webp",
    // Ropa
    Camiseta: "https://grimaldi-test-bucket.s3.us-east-1.amazonaws.com/camiseta.webp",
    Jeans: "https://grimaldi-test-bucket.s3.us-east-1.amazonaws.com/jeans.webp",
    Zapatillas: "https://grimaldi-test-bucket.s3.us-east-1.amazonaws.com/zapatillas.webp",
    Chaqueta: "https://grimaldi-test-bucket.s3.us-east-1.amazonaws.com/chaqueta.webp",
    // hogar
    Cafetera: "https://grimaldi-test-bucket.s3.us-east-1.amazonaws.com/cafetera.webp",
    Aspiradora: "https://grimaldi-test-bucket.s3.us-east-1.amazonaws.com/aspiradora.webp",
    // deportes
    Bicicleta: "https://grimaldi-test-bucket.s3.us-east-1.amazonaws.com/bicicleta.webp",
    Mancuernas: "https://grimaldi-test-bucket.s3.us-east-1.amazonaws.com/mancuerna.webp",
    // super
    Cereales: "https://grimaldi-test-bucket.s3.us-east-1.amazonaws.com/1744161026474-cereales.webp",
    Agua: "https://grimaldi-test-bucket.s3.us-east-1.amazonaws.com/1744161438132-agua.webp",
    // vehiculo
    Scooter: "https://grimaldi-test-bucket.s3.us-east-1.amazonaws.com/1744161570442-scooter.webp",
    Hilux: "https://grimaldi-test-bucket.s3.us-east-1.amazonaws.com/1744161589601-hilux.webp"
  }

  await prisma.product.createMany({
    data: [
      // Electrónica
      { name: "Smartphone", description: "Un smartphone de última generación", price: 499.99, stock: 100, categoryId: categoryMap["Electrónica"], imageUrl: ARRimageUrls.Smartphone },
      { name: "Laptop", description: "Laptop ultradelgada con gran rendimiento", price: 999.99, stock: 50, categoryId: categoryMap["Electrónica"], imageUrl: ARRimageUrls.Laptop },
      { name: "Auriculares", description: "Auriculares inalámbricos con cancelación de ruido", price: 199.99, stock: 80, categoryId: categoryMap["Electrónica"], imageUrl: ARRimageUrls.Auriculares },
      { name: "Smartwatch", description: "Reloj inteligente con monitoreo de salud", price: 249.99, stock: 120, categoryId: categoryMap["Electrónica"], imageUrl: ARRimageUrls.Smartwatch },
      { name: "Switch 2 chipeada", description: "Nintendo switch 2 con 100 juegos", price: 249.99, stock: 120, categoryId: categoryMap["Electrónica"], imageUrl: ARRimageUrls.Switch },
  
      // Ropa
      { name: "Camiseta", description: "Camiseta de algodón de alta calidad", price: 19.99, stock: 200, categoryId: categoryMap["Ropa"], imageUrl: ARRimageUrls.Camiseta },
      { name: "Jeans", description: "Jeans ajustados para todos los días", price: 39.99, stock: 150, categoryId: categoryMap["Ropa"], imageUrl: ARRimageUrls.Jeans },
      { name: "Zapatillas", description: "Zapatillas deportivas cómodas y duraderas", price: 89.99, stock: 120, categoryId: categoryMap["Ropa"], imageUrl: ARRimageUrls.Zapatillas },
      { name: "Chaqueta", description: "Chaqueta impermeable para invierno", price: 129.99, stock: 70, categoryId: categoryMap["Ropa"], imageUrl: ARRimageUrls.Chaqueta },
  
      // Hogar
      { name: "Cafetera", description: "Cafetera con múltiples funciones programables", price: 79.99, stock: 60, categoryId: categoryMap["Hogar"], imageUrl: ARRimageUrls.Cafetera },
      { name: "Aspiradora", description: "Aspiradora sin cables con gran potencia de succión", price: 149.99, stock: 40, categoryId: categoryMap["Hogar"], imageUrl: ARRimageUrls.Aspiradora },
  
      // Deportes
      { name: "Bicicleta", description: "Bicicleta de montaña con marco de aluminio", price: 599.99, stock: 30, categoryId: categoryMap["Deportes"], imageUrl: ARRimageUrls.Bicicleta },
      { name: "Mancuernas", description: "Set de mancuernas ajustables", price: 49.99, stock: 90, categoryId: categoryMap["Deportes"], imageUrl: ARRimageUrls.Mancuernas },
  
      // Supermercado
      { name: "Caja de cereales", description: "Cereales integrales saludables", price: 4.99, stock: 300, categoryId: categoryMap["Supermercado"], imageUrl: ARRimageUrls.Cereales },
      { name: "Botella de agua", description: "Agua mineral 1.5L", price: 1.25, stock: 500, categoryId: categoryMap["Supermercado"], imageUrl: ARRimageUrls.Agua },
  
      // Vehículos
      { name: "Scooter eléctrico", description: "Scooter eléctrico urbano con batería de larga duración", price: 349.99, stock: 20, categoryId: categoryMap["Vehículos"], imageUrl: ARRimageUrls.Scooter },
      { name: "Toyota hilux", description: "Alta chata", price: 59999.99, stock: 100, categoryId: categoryMap["Vehículos"], imageUrl: ARRimageUrls.Hilux },
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
