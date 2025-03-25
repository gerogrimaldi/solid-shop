"use client"

import { useRouter } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";

const LoginPage = () => {
  const router = useRouter();

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Login failed");

      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <LoginForm onSubmit={handleLogin} />
    </div>
  );
};

export default LoginPage;