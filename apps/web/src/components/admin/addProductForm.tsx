import React, { useState } from 'react';
import { X, Upload, Loader } from 'lucide-react';
import { Category } from '@/types/category';
import { useSession } from 'next-auth/react';

const AddProductForm = ({
  categories,
  onClose,
  onSubmit,
}: {
  categories: Category[];
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const { data: session, status } = useSession();
  const user = session?.user;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
  
    let parsedValue: string | number = value;
  
    // Convertir explícitamente a número si es un campo numérico
    if (type === 'number') {
      parsedValue = value === '' ? '' : Number(value);
    }
  
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(png|jpeg|jpg)$/)) {
      setErrors(prev => ({
        ...prev,
        image: 'Archivo no válido. Solo se permiten imágenes PNG o JPG/JPEG',
      }));
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));

    if (errors.image) {
      setErrors(prev => ({ ...prev, image: null }));
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    console.log("From data: ",formData)
    if (!formData.name.trim()) newErrors.name = 'Nombre obligatorio';
    if (!formData.description.trim()) newErrors.description = 'Descripción obligatoria';

    const price = formData.price;
    if (!formData.price) newErrors.price = 'Precio obligatorio';
    else if (isNaN(price) || price <= 0) newErrors.price = 'Debe ser un número mayor a 0';

    const stock = formData.stock;
    if (!formData.stock) newErrors.stock = 'Stock obligatorio';
    else if (isNaN(stock) || stock < 0) newErrors.stock = 'Debe ser un entero positivo';

    if (!formData.categoryId) newErrors.categoryId = 'Categoría obligatoria';
    if (!image) newErrors.image = 'Imagen obligatoria';

    return newErrors;
  };

  const uploadImageToS3 = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload/image', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${user?.tokens?.accessToken}`
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al subir la imagen');
    }

    const data = await response.json();
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsLoading(true);
      const imageUrl = await uploadImageToS3(image!);

      await onSubmit({
        ...formData,
        price: formData.price,
        stock: formData.stock,
        imageUrl: imageUrl,
      });

      onClose();
    } catch (err: any) {
      console.error(err);
      setErrors(prev => ({
        ...prev,
        submit: err.message || 'Error al guardar el producto',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Agregar producto</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors">
          <X size={20} />
        </button>
      </div>

      {errors.submit && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-700 rounded-md">
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-5">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre *</label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 block w-full border ${errors.name ? 'border-red-300' : 'border-gray-300'} text-gray-700 rounded-md shadow-sm py-2 px-3 sm:text-sm`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción *</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className={`mt-1 block w-full border ${errors.description ? 'border-red-300' : 'border-gray-300'} text-gray-700 rounded-md shadow-sm py-2 px-3 sm:text-sm`}
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          {/* Precio y stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Precio ($) *</label>
              <input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                className={`mt-1 block w-full border ${errors.price ? 'border-red-300' : 'border-gray-300'} text-gray-700 rounded-md shadow-sm py-2 px-3 sm:text-sm`}
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Stock *</label>
              <input
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                className={`mt-1 block w-full border ${errors.stock ? 'border-red-300' : 'border-gray-300'} text-gray-700 rounded-md shadow-sm py-2 px-3 sm:text-sm`}
              />
              {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Categoría *</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className={`mt-1 block w-full border ${errors.categoryId ? 'border-red-300' : 'border-gray-300'} text-gray-700 rounded-md shadow-sm py-2 px-3 sm:text-sm`}
            >
              <option value="">Selecciona una categoría</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>}
          </div>

          {/* Imagen */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Imagen del producto *</label>
            <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${errors.image ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}>
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-gray-800 hover:text-gray-500">
                    <span>Sube un archivo</span>
                    <input id="image-upload" name="image" type="file" accept="image/*" onChange={handleImageChange} className="sr-only" />
                  </label>
                  <p className="pl-1">o arrástralo</p>
                </div>
                <p className="text-xs text-gray-500">PNG o JPG hasta 5MB</p>
              </div>
            </div>
            {imagePreview && (
              <div className="mt-2">
                <img src={imagePreview} alt="Preview" className="max-h-32 mx-auto rounded-md shadow" />
              </div>
            )}
            {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
          </div>
        </div>

        {/* Botón submit */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-700 focus:outline-none"
          >
            {isLoading ? (
              <>
                <Loader className="h-4 w-4 animate-spin mr-2" />
                Subiendo...
              </>
            ) : (
              'Guardar producto'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;
