'use client';

import { useRouter } from 'next/navigation';

const AdminDashboardPage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-md rounded-2xl p-10 w-full max-w-xl space-y-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Panel de Administración</h1>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => router.push('/admin/dashboard/listado')}
            className="w-full py-4 bg-amber-600 text-white rounded-xl text-lg font-semibold hover:bg-amber-700 transition"
          >
            📦 Listado de Productos
          </button>

          <button
            onClick={() => router.push('/admin/dashboard/nuevo-producto')}
            className="w-full py-4 bg-amber-600 text-white rounded-xl text-lg font-semibold hover:bg-amber-700 transition"
          >
            ➕ Cargar un Nuevo Producto
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
