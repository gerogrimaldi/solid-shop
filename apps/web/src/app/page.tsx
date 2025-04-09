import Image from "next/image";
import Link from "next/link";
import NavBar from "@/components/NavBar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex flex-col items-center justify-center flex-grow p-8 text-center">
        <Image
          className="dark:invert"
          src="/"
          alt="Ecommerce logo"
          width={180}
          height={38}
          priority
        />
        <h1 className="text-3xl font-bold mt-4">Bienvenido a Mi Ecommerce</h1>
        <p className="text-gray-600 mt-2">Encuentra los mejores productos al mejor precio.</p>
        <Link
          href="/categories"
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Ver Productos
        </Link>
      </main>
    </div>
  );
}
