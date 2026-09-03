"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { ArrowRight, AlertCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLogin } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MobileInput, PasswordInput, TextInput } from "./fields";
import { AuthSuccess } from "./auth-success";
import { mobileToIdentifier } from "./identity";
import {
  emailLoginSchema,
  mobileLoginSchema,
  type EmailLoginValues,
  type MobileLoginValues,
} from "./schema";

export function LoginForm() {
  const t = useTranslations("auth");
  const login = useLogin();
  const [mode, setMode] = useState<"mobile" | "email">("mobile");
  const [remember, setRemember] = useState(true);

  const mobileForm = useForm<MobileLoginValues>({
    resolver: zodResolver(mobileLoginSchema),
    defaultValues: { mobile: "", password: "" },
  });
  const emailForm = useForm<EmailLoginValues>({
    resolver: zodResolver(emailLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  if (login.isSuccess) return <AuthSuccess />;

  const submit = (email: string, password: string) =>
    login.mutate({ email, password, remember });

  return (
    <div className="space-y-6">
      <header className="space-y-1.5">
        <h1 className="text-3xl font-semibold tracking-tight">
          {t("welcomeBack")} 👋
        </h1>
        <p className="text-muted-foreground">{t("loginSubtitle")}</p>
      </header>

      <Tabs
        value={mode}
        onValueChange={(v) => setMode(v as "mobile" | "email")}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mobile" className="h-9">
            {t("tabMobile")}
          </TabsTrigger>
          <TabsTrigger value="email" className="h-9">
            {t("tabEmail")}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {login.isError ? <FormError message={t("errLogin")} /> : null}

      {mode === "mobile" ? (
        <form
          noValidate
          className="space-y-5"
          onSubmit={mobileForm.handleSubmit((v) =>
            submit(mobileToIdentifier(v.mobile), v.password),
          )}
        >
          <MobileInput
            label={t("mobileLabel")}
            placeholder={t("mobilePlaceholder")}
            error={mobileForm.formState.errors.mobile?.message}
            {...mobileForm.register("mobile")}
          />
          <PasswordInput
            label={t("password")}
            autoComplete="current-password"
            error={mobileForm.formState.errors.password?.message}
            {...mobileForm.register("password")}
          />
          <Options remember={remember} onRemember={setRemember} />
          <SubmitButton pending={login.isPending} />
        </form>
      ) : (
        <form
          noValidate
          className="space-y-5"
          onSubmit={emailForm.handleSubmit((v) =>
            submit(v.email.trim(), v.password),
          )}
        >
          <TextInput
            label={t("email")}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="farmer@example.com"
            error={emailForm.formState.errors.email?.message}
            {...emailForm.register("email")}
          />
          <PasswordInput
            label={t("password")}
            autoComplete="current-password"
            error={emailForm.formState.errors.password?.message}
            {...emailForm.register("password")}
          />
          <Options remember={remember} onRemember={setRemember} />
          <SubmitButton pending={login.isPending} />
        </form>
      )}

      <p className="text-center text-sm text-muted-foreground">
        {t("noAccount")}{" "}
        <Link
          href="/register"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          {t("createFarmAccount")}
        </Link>
      </p>
    </div>
  );
}

function Options({
  remember,
  onRemember,
}: {
  remember: boolean;
  onRemember: (value: boolean) => void;
}) {
  const t = useTranslations("auth");
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <Checkbox
          id="remember"
          checked={remember}
          onCheckedChange={(v) => onRemember(v === true)}
        />
        <Label htmlFor="remember" className="cursor-pointer font-normal">
          {t("rememberMe")}
        </Label>
      </div>
      <Link
        href="/login"
        className="text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        {t("forgotPassword")}
      </Link>
    </div>
  );
}

function SubmitButton({ pending }: { pending: boolean }) {
  const t = useTranslations("auth");
  return (
    <Button
      type="submit"
      size="lg"
      className="h-12 w-full gap-2 text-base"
      disabled={pending}
    >
      {pending ? t("loggingIn") : t("loginCta")}
      {pending ? null : <ArrowRight className="h-4 w-4" aria-hidden />}
    </Button>
  );
}

export function FormError({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 p-3.5 text-sm font-medium text-destructive"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      {message}
    </p>
  );
}
