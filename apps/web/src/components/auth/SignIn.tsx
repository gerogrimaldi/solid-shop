"use server";

import { signIn } from "next-auth/react";

export default function SignIn() {
    async function handleSignIn() {
        await signIn("credentials", { redirectTo: "/" });
    }

    return (
        <form onSubmit={(e) => { e.preventDefault(); handleSignIn(); }}>
            <button 
                type="submit" 
                className="w-full bg-purple-600 dark:bg-purple-700 px-3 text-white py-2 rounded-md text-center hover:bg-purple-700 dark:hover:bg-purple-800"
            >
                Iniciar sesión
            </button>
        </form>
    );
}
