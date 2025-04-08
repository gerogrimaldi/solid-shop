"use client"
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

export const SignInButton = () => {
    const {data:session} = useSession();

    if (session && session.user) {
        return (
            <div className="flex items-center">
                <span className="text-gray-800 dark:text-white">{session.user.name}</span>
                <Link 
                    href={"/api/auth/signout"} 
                    className="ml-4 bg-purple-600 dark:bg-purple-700 text-white px-3 py-2 rounded-md hover:bg-purple-700 dark:hover:bg-purple-800">
                    Sign Out
                </Link>
            </div>
        );
    }

    return (
        <div>
            <Link 
                href={"/auth/login"} 
                className="bg-purple-600 dark:bg-purple-700 text-white px-3 py-2 rounded-md hover:bg-purple-700 dark:hover:bg-purple-800">
                Sign In
            </Link>
            
            <Link 
                href={"/auth/signUp"} 
                className="bg-purple-600 dark:bg-purple-700 text-white px-3 py-2 rounded-md hover:bg-purple-700 dark:hover:bg-purple-800">
                Sign Up
            </Link>
        </div>
    )

}