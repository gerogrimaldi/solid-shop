import { PrismaClient, Roles } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Crear categorías
  const electronicsCategory = await prisma.category.create({
    data: {
      name: "Electrónica",
    },
  });

  const clothingCategory = await prisma.category.create({
    data: {
      name: "Ropa",
    },
  });

  // Crear productos
  const product1 = await prisma.product.create({
    data: {
      name: "Smartphone",
      description: "Un smartphone de última generación",
      price: 499.99,
      stock: 100,
      categoryId: electronicsCategory.id,
    //   image: "https://via.placeholder.com/150",
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: "Laptop",
      description: "Laptop ultradelgada con gran rendimiento",
      price: 999.99,
      stock: 50,
      categoryId: electronicsCategory.id,
    //   image: "https://via.placeholder.com/150",
    },
  });

  const product3 = await prisma.product.create({
    data: {
      name: "T-shirt",
      description: "Camiseta de algodón de alta calidad",
      price: 19.99,
      stock: 200,
      categoryId: clothingCategory.id,
    //   image: "https://via.placeholder.com/150",
    },
  });

  const product4 = await prisma.product.create({
    data: {
      name: "Jeans",
      description: "Jeans ajustados para todos los días",
      price: 39.99,
      stock: 150,
      categoryId: clothingCategory.id,
    //   image: "https://via.placeholder.com/150",
    },
  });

  // Crear un usuario
  const user = await prisma.user.create({
    data: {
      email: "usuario@ejemplo.com",
      username: "usuarioEjemplo",
      password: "password123", // Asegúrate de usar un hash de contraseña en producción
      Role: Roles.USER,
      wishlist: {
        create: {},
      },
      cart: {
        create: {},
      },
    },
  });

  // Agregar productos al carrito
  await prisma.cartItem.create({
    data: {
      productId: product1.id,
      cartId: user.cartId,
      quantity: 1,
    },
  });

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

  console.log("Seed completado");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
