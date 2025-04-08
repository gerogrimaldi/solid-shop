import React from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';


export default function Unauthorized() {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center">
            <header className="bg-red-600 dark:bg-red-800 w-full py-6">
                <h1 className="text-white text-3xl text-center font-bold">Acceso denegado</h1>
            </header>
            <main className="flex-grow flex flex-col justify-center items-center px-4">
                <section className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Acceso no autorizado</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                        No tienes permiso para acceder
                    </p>
                    <div className='flex flex-col space-y-4'>
                        <Link href="/auth/login" className="w-full bg-purple-600 dark:bg-purple-700 px-3 text-white py-2 rounded-md text-center hover:bg-purple-700 dark:hover:bg-purple-800">
                            Ir al login
                        </Link>
                    </div>
                </section>
            </main>
            <Footer></Footer>
        </div>
    );
}