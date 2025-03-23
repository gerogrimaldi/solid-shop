import { Category } from "@/app/types/category";
import Link from "next/link";


// Componente de Tarjeta de Categoría
const CategoryCard = ({ category }: { category: Category }) => {
    return (
      <div className="p-4 border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
        <Link href={`/categories/${category.name}`}>
          <div className="flex flex-col items-center">
            <img
              src={category.imageUrl || "/placeholder.jpg"} 
              alt={category.name}
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <span className="text-xl font-semibold text-blue-500 hover:underline text-center">
              {category.name}
            </span>
          </div>
        </Link>
      </div>
    );
  };
  
  export default CategoryCard;