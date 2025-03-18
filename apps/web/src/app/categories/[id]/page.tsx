// pages/category/[id].tsx
import { useRouter } from 'next/router';

const CategoryDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Categoría {id}</h1>
      {/* Aquí puedes listar los productos relacionados con la categoría */}
      <p className="text-center">Productos de la categoría {id}</p>
    </div>
  );
}

export default CategoryDetail;
