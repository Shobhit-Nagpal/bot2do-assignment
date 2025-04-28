import { z } from "zod";

export const otpSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
});

export type TOtpSchema = typeof otpSchema; 