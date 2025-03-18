// pages/categories.tsx
import Link from 'next/link';

// Definir los tipos para las categorías
interface Category {
  id: number;
  name: string;
}

const categories: Category[] = [
  { id: 1, name: 'Electronics' },
  { id: 2, name: 'Clothing' },
  { id: 3, name: 'Home Appliances' },
  { id: 4, name: 'Books' },
  // Agrega más categorías según sea necesario
];

const Categories = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Categorías de Productos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="p-4 border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <Link href={`/category/${category.id}`}>
              <span className="text-xl font-semibold text-center text-blue-500 hover:underline">
                {category.name}
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;
