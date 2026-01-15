import { z } from "zod";

// Auth validation schemas
export const loginSchema = z.object({
  email: z.email().transform((s) => s.trim().toLowerCase()),
  password: z.string().min(8).max(72),
});

export const signUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    email: z.email().transform((s) => s.trim().toLowerCase()),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72),
    confirmPassword: z.string(),
    role: z.enum(["SUPER_ADMIN", "STATION_MANAGER"], {
      message: "Invalid role selected",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
