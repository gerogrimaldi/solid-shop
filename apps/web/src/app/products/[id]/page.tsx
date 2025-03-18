

// pages/index.tsx
  import React from 'react';
  import ProductCard from '@/components/ProductCard';
  import { Product } from '@/app/types/product';
  
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Producto Ejemplo',
      description: 'Descripción del producto',
      price: 99.99,
      stock: 10,
      category: 'Electrónica',
      image: 'https://via.placeholder.com/150',
    },
  ];
  
  const Home = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {mockProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  };
  
  export default Home;
  