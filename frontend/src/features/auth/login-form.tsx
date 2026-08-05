"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { loginSchema, type LoginValues } from "@/features/auth/schema";
import { useLogin } from "@/lib/queries";
import { TextField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const t = useTranslations("auth");
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: LoginValues) => login.mutate(values);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <TextField
        label={t("email")}
        type="email"
        autoComplete="email"
        placeholder="farmer@example.com"
        error={errors.email?.message}
        {...register("email")}
      />
      <TextField
        label={t("password")}
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />
      <Button type="submit" size="lg" className="w-full" disabled={login.isPending}>
        {login.isPending ? t("sending") : t("login")}
      </Button>
    </form>
  );
}