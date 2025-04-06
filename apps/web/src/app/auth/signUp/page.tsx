"use client"
import { useRouter } from "next/navigation";
import SignupForm from "@/components/auth/SignUpForm";
import { useSession } from "next-auth/react";

const SignupPage: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Cargando...</p>;
  // si ya esta logueado lo mando a categories
  if (session) {
    router.push("/categories");
    return null;
  }

  const handleSignup = async (data: { username: string; email: string; password: string }) => {
    try {
      const response = await fetch("/api/authorization/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Signup failed");

      router.push("/auth/login");
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <SignupForm onSubmit={handleSignup} />
    </div>
  );
};

export default SignupPage;
