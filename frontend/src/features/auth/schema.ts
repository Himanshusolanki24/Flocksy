import { z } from "zod";
import { isValidMobile } from "./identity";

/**
 * Error messages are `auth` message keys, translated at render time, so the
 * forms stay localisable.
 */
const password = z.string().min(6, "errPassword");
const mobile = z.string().refine(isValidMobile, "errMobile");
const email = z.string().min(1, "errEmailEmpty").email("errEmail");

export const mobileLoginSchema = z.object({ mobile, password });
export const emailLoginSchema = z.object({ email, password });

export type MobileLoginValues = z.infer<typeof mobileLoginSchema>;
export type EmailLoginValues = z.infer<typeof emailLoginSchema>;

/** Step 1 of signup — who you are. */
export const signupAccountSchema = z
  .object({
    name: z.string().min(2, "errName"),
    mobile,
    password,
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "errConfirm",
    path: ["confirmPassword"],
  });

/** Step 2 of signup — the farm itself. Location stays optional. */
export const signupFarmSchema = z.object({
  farmName: z.string().min(2, "errFarmName"),
  birdCount: z.string().optional(),
  shedCount: z.string().optional(),
  state: z.string().optional(),
  district: z.string().optional(),
  village: z.string().optional(),
});

export type SignupAccountValues = z.infer<typeof signupAccountSchema>;
export type SignupFarmValues = z.infer<typeof signupFarmSchema>;
