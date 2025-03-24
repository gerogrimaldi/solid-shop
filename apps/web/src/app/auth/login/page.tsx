"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";

// login
export default function LogIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (!res || res.error) {
            setError(res?.error || "Invalid credentials");
        } else {
            router.push("/dashboard");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center">
            <header className="bg-purple-600 dark:bg-purple-800 w-full py-6">
                <h1 className="text-white text-3xl text-center font-bold">Iniciar sesión</h1>
            </header>
            <main className="flex-grow flex flex-col justify-center items-center px-4">
                {/* CREDENTIALS LOGIN */}
                <section className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* EMAIL */}
                        <div>
                            <label htmlFor="email" className="block text-gray-700 dark:text-gray-300">Email:</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-gray-100"
                            />
                        </div>
                        {/* PASSWORD */}
                        <div>
                            <label htmlFor="password" className="block text-gray-700 dark:text-gray-300">Contraseña:</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-gray-100"
                            />
                        </div>
                        <button type="submit" className="w-full bg-purple-600 dark:bg-purple-700 text-white py-2 rounded-md hover:bg-purple-700 dark:hover:bg-purple-800">Iniciar sesión</button>
                    </form>
                </section>
                <br />
                {/* Espacio para providers login) */}
               
            </main>
            <Footer />
        </div>
    );
}