"use client"
import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit2, Trash2, ChevronRight, X } from 'lucide-react';
import { Product } from '@/types/product';
import { Category } from '@/types/category';
import AddProductForm from '@/components/admin/addProductForm';
import { useSession } from 'next-auth/react';
import ProductEditForm from '@/components/cartComponents/editProductForm';

const AdminDashboard = () => {
  const { data: session, status } = useSession();
  const user = session?.user;
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/categories');
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        const data = await response.json();
        setCategories(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  
  const fetchProductsByCategory = async (categoryName: string) => {
    try {
      setIsLoading(true);
      setSelectedCategory(categoryName);
      const response = await fetch(`/api/categories/${categoryName}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products for ${categoryName}`);
      }
      
      const data = await response.json();
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteProduct = async (productId: string) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user?.tokens?.accessToken}`
        },
      });
  
      if (!res.ok) {
        const error = await res.text();
        console.error('Error al eliminar producto:', error);
        return;
      }
  
      console.log('Producto eliminado correctamente:', productId);

          // Eliminar el producto del estado
    setProducts(prev => prev.filter(product => product.id !== productId));
    } catch (error) {
      console.error('Error inesperado:', error);
    }
  };
  
  
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };
  
  const handleUpdateProduct = async (updatedFields: Partial<Product>) => {
    try {
        const res = await fetch(`/api/products/${updatedFields.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.tokens?.accessToken}`
        },
        body: JSON.stringify(updatedFields),
      });
  
      if (!res.ok) {
        const error = await res.text();
        console.error('Error actualizando producto:', error);
        return;
      }
  
      const updatedProduct = await res.json();
  
      // Actualizar estado local
      setProducts((prev) =>
        prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );
  
      setEditingProduct(null);
    } catch (err: any) {
      console.error('Error:', err);
    }
  };

  const openAddProductForm = () => {
    setIsAddProductOpen(true);
  };
  
  const closeAddProductForm = () => {
    setIsAddProductOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>
          <button 
            onClick={openAddProductForm}
            className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors duration-300"
          >
            <PlusCircle size={18} className="mr-2" />
            Add Product
          </button>
        </div>
      </header>
      
      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}
        
        {/* Categories */}
        <section className="mb-12">
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-medium text-gray-800">Categories</h2>
            </div>
            
            {isLoading && !selectedCategory ? (
              <div className="px-6 py-12 flex justify-center">
                <div className="animate-pulse text-gray-400">Loading categories...</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categories.map((category) => (
                      <tr key={category.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {category.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <a 
                            href="#" 
                            className="hover:text-gray-700 hover:underline"
                            onClick={(e) => {
                              e.preventDefault();
                              fetchProductsByCategory(category.name);
                            }}
                          >
                            {category.name}
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => fetchProductsByCategory(category.name)}
                            className="inline-flex items-center text-gray-700 hover:text-gray-900"
                          >
                            View Products
                            <ChevronRight size={16} className="ml-1" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
        
        {/* Products */}
        {selectedCategory && (
          <section>
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-800">
                  Products - {selectedCategory}
                </h2>
                <button 
                  onClick={() => setSelectedCategory("")} 
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
              
              {isLoading ? (
                <div className="px-6 py-12 flex justify-center">
                  <div className="animate-pulse text-gray-400">Loading products...</div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stock
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Updated
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {product.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.stock}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${product.price.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(product.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(product.updatedAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                              onClick={() => handleEditProduct(product)}
                              className="text-gray-600 hover:text-gray-900 mr-3"
                              title="Edit Product"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-gray-600 hover:text-red-600"
                              title="Delete Product"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
          </section>
        )}
      </main>
      
          {/* Add Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeAddProductForm}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <AddProductForm 
                categories={categories}
                onClose={closeAddProductForm}
                onSubmit={async (productData) => {
                  try {
                  
                    const response = await fetch('/api/products', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user?.tokens?.accessToken}`
                      },
                      body: JSON.stringify(productData)
                    });
                    
                    if (!response.ok) {
                      const errorData = await response.json();
                      throw new Error(errorData.message || 'Failed to add product');
                    }
                    
                    if (selectedCategory) {
                      fetchProductsByCategory(selectedCategory);
                    }
                    
                    closeAddProductForm();
                    
                    setSuccessMessage('Product added successfully');
                    setTimeout(() => setSuccessMessage(''), 3000);
                  } catch (error: any) {
                    console.error('Error adding product:', error);
                    alert(error.message);
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
            {editingProduct && (
        <ProductEditForm
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSubmit={handleUpdateProduct}
        />
      )}

          </div>
        );
      };

export default AdminDashboard;