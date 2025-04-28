import { z } from "zod";

const passwordRegex = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /[0-9]/,
  special: /[!@#$%^&*(),.?":{}|<>]/,
};

export const passwordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(passwordRegex.uppercase, "Password must contain 1 Uppercase & 1 Lowercase letter")
    .regex(passwordRegex.lowercase, "Password must contain 1 Uppercase & 1 Lowercase letter")
    .regex(passwordRegex.number, "Password must contain atleast one digit like 1,2,3,4,5,6,etc.")
    .regex(passwordRegex.special, "Password must contain atleast one special character like !, @, #, $, etc."),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type TPasswordSchema = typeof passwordSchema; 