  import { Product } from "@/app/types/product";
  
  interface Props {
    product: Product;
  }
  
  const ProductCard: React.FC<Props> = ({ product }) => {
    return (
      <div className="border rounded-lg p-4 shadow-md">
        <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-md" />
        <h2 className="text-lg font-bold mt-2">{product.name}</h2>
        <p className="text-gray-600">{product.description}</p>
        <p className="text-xl font-semibold mt-2">${product.price.toFixed(2)}</p>
        <p className="text-sm text-gray-500">Stock: {product.stock}</p>
        <p className="text-sm text-gray-500">Categoría: {product.category}</p>
      </div>
    );
  };
  
  export default ProductCard;
  