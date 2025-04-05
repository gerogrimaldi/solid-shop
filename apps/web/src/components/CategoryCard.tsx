import { Category } from "@/app/types/category";
import Link from "next/link";
import Image from "next/image";

const CategoryCard = ({ category }: { category: Category }) => {
  return (
    <Link href={`/categories/${encodeURIComponent(category.name)}`} className="block">
      <div className="group p-4 border rounded-2xl shadow-md bg-white transition-all duration-300 ease-in-out transform hover:shadow-xl hover:scale-105">
        <div className="relative w-full h-48 bg-white rounded-xl flex items-center justify-center overflow-hidden">
          <Image
            src={category.imageUrl || "/placeholder.jpg"}
            alt={category.name}
            width={192}
            height={192}
            className="object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="mt-4 text-center">
          <span className="text-xl font-semibold text-blue-600 group-hover:underline transition-all duration-200">
            {decodeURIComponent(category.name)}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
