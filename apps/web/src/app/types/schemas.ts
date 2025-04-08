import { z } from "zod";

// Enum for user roles (shared across frontend/backend)
export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

// Signup Form Schema
export const SignupFormSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-])[A-Za-z\d@$!%*?&-]+$/,
      "Password must contain 1 uppercase, 1 lowercase, 1 number, and 1 special character (@$!%*?&-)"
    )
});

// Login Form Schema
export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z.string().min(1, { message: "Password field must not be empty." }),
});

// TypeScript type inference
export type SignupFormData = z.infer<typeof SignupFormSchema>;
export type LoginFormData = z.infer<typeof LoginFormSchema>;