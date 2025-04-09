import { z } from "zod";

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

// Esquema para formulario de registro
export const SignupFormSchema = z.object({
  username: z
    .string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .max(20, "El nombre de usuario no puede exceder 20 caracteres")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "El nombre de usuario solo puede contener letras, números y guiones bajos"
    ),
  email: z.string().email("Ingresa un correo electrónico válido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-])[A-Za-z\d@$!%*?&-]+$/,
      "La contraseña debe contener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial (@$!%*?&-)"
    )
});

export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Por favor ingresa un correo válido" }).trim(),
  password: z.string().min(1, { message: "La contraseña es requerida" }),
});

export type SignupFormData = z.infer<typeof SignupFormSchema>;
export type LoginFormData = z.infer<typeof LoginFormSchema>;