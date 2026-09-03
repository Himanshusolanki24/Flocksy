"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { registerSchema, type RegisterValues } from "@/features/auth/schema";
import { useRegister } from "@/lib/queries";
import { TextField, NativeSelectField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";

export function RegisterForm() {
  const t = useTranslations("auth");
  const registerUser = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      farmName: "",
      farmType: "",
    },
  });

  const onSubmit = (values: RegisterValues) => {
    const { confirmPassword: _confirm, ...payload } = values;
    void _confirm;
    const cleanPayload = {
      ...payload,
      farmType: payload.farmType || undefined,
    };
    registerUser.mutate(cleanPayload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <TextField
        label={t("name")}
        autoComplete="name"
        error={errors.name?.message}
        {...register("name")}
      />
      <TextField
        label={t("email")}
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <TextField
        label={t("password")}
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />
      <TextField
        label={t("confirmPassword")}
        type="password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
      <TextField
        label={t("farmName")}
        error={errors.farmName?.message}
        {...register("farmName")}
      />
      <NativeSelectField
        label={t("farmType")}
        error={errors.farmType?.message}
        options={[
          { value: "", label: t("farmType") + "…" },
          { value: "poultry", label: "🐔 Poultry (Broiler & Layer)" },
        ]}
        {...register("farmType")}
      />
      <Button
        type="submit"
        size="lg"
        className="w-full bg-[#0E4D34] hover:bg-[#0A3D28] text-white font-semibold transition-colors"
        disabled={registerUser.isPending}
      >
        {registerUser.isPending ? t("sending") : t("register")}
      </Button>
    </form>
  );
}