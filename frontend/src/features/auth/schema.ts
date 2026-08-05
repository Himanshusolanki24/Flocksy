import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("valid email"),
  password: z.string().min(6, "min 6"),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, "min 2"),
    email: z.string().email("valid email"),
    password: z.string().min(6, "min 6"),
    confirmPassword: z.string(),
    farmName: z.string().optional(),
    farmType: z.enum(["poultry", "dairy", "livestock", "crops"]).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwords must match",
    path: ["confirmPassword"],
  });

export type RegisterValues = z.infer<typeof registerSchema>;