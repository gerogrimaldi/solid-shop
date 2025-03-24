import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSubmit: (data: SignupFormValues) => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>

      {/* Username */}
      <label className="block mb-2 text-sm font-medium">Username</label>
      <input {...register("username")} className="w-full p-2 border rounded-md mb-2" />
      {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}

      {/* Email */}
      <label className="block mb-2 text-sm font-medium">Email</label>
      <input {...register("email")} className="w-full p-2 border rounded-md mb-2" />
      {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

      {/* Password */}
      <label className="block mb-2 text-sm font-medium">Password</label>
      <input type="password" {...register("password")} className="w-full p-2 border rounded-md mb-2" />
      {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 mt-4">
        Register
      </button>
    </form>
  );
};

export default SignupForm;
