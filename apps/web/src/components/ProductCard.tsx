"use client";
import { Product } from "@/app/types/product";
import Link from "next/link";
import Image from "next/image";

interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md bg-white">
      <div className="relative w-full h-48 bg-white rounded-md flex items-center justify-center overflow-hidden">
        <Image
          src={product.imageUrl || '/placeholder.jpg'}
          alt={product.name}
          width={192}
          height={192}
          className="object-contain"
        />
      </div>
      <h2 className="text-lg font-bold mt-2 text-black">{product.name}</h2>
      <p className="text-gray-600">{product.description}</p>
      <p className="text-xl font-semibold mt-2 text-black">${product.price.toFixed(2)}</p>
      <p className="text-sm text-gray-500">Stock: {product.stock}</p>
      <Link href={`/products/${product.id}`} className="hover:underline text-blue-600">
        Ver producto
      </Link>
    </div>
  );
};

export default ProductCard;
