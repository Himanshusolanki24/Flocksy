"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useRegister } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { MobileInput, PasswordInput, TextInput } from "./fields";
import { AuthSuccess } from "./auth-success";
import { FormError } from "./login-form";
import { formatMobile, mobileToIdentifier } from "./identity";
import {
  signupAccountSchema,
  signupFarmSchema,
  type SignupAccountValues,
  type SignupFarmValues,
} from "./schema";

const STATES = [
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export function SignupForm() {
  const t = useTranslations("auth");
  const registerUser = useRegister();
  const [step, setStep] = useState(1);
  const [account, setAccount] = useState<SignupAccountValues | null>(null);

  const accountForm = useForm<SignupAccountValues>({
    resolver: zodResolver(signupAccountSchema),
    defaultValues: { name: "", mobile: "", password: "", confirmPassword: "" },
  });
  const farmForm = useForm<SignupFarmValues>({
    resolver: zodResolver(signupFarmSchema),
    defaultValues: {
      farmName: "",
      birdCount: "",
      shedCount: "",
      state: "",
      district: "",
      village: "",
    },
  });

  if (registerUser.isSuccess) return <AuthSuccess />;

  const finish = (farm: SignupFarmValues) => {
    if (!account) return;
    // ponytail: /auth/register only stores name/email/password today, so the
    // farm answers are kept locally rather than thrown away. Post them to the
    // farms API the day it accepts them.
    try {
      localStorage.setItem(
        "flocksy-farm-setup",
        JSON.stringify({ mobile: account.mobile, ...farm }),
      );
    } catch {
      /* private mode — the account still gets created */
    }

    registerUser.mutate({
      name: account.name.trim(),
      email: mobileToIdentifier(account.mobile),
      password: account.password,
      farmName: farm.farmName.trim(),
      farmType: "poultry",
    });
  };

  return (
    <div className="space-y-6">
      <header className="space-y-1.5">
        <h1 className="text-3xl font-semibold tracking-tight">
          {step === 1 ? t("signupTitle") : t("farmTitle")}
        </h1>
        <p className="text-muted-foreground">
          {step === 1 ? t("signupSubtitle") : t("farmSubtitle")}
        </p>
      </header>

      <StepIndicator step={step} />

      {registerUser.isError ? <FormError message={t("errSignup")} /> : null}

      {step === 1 ? (
        <form
          noValidate
          className="space-y-5"
          onSubmit={accountForm.handleSubmit((values) => {
            setAccount(values);
            setStep(2);
          })}
        >
          <TextInput
            label={t("name")}
            autoComplete="name"
            autoCapitalize="words"
            error={accountForm.formState.errors.name?.message}
            {...accountForm.register("name")}
          />
          <MobileInput
            label={t("mobileLabel")}
            placeholder={t("mobilePlaceholder")}
            error={accountForm.formState.errors.mobile?.message}
            {...accountForm.register("mobile")}
          />
          <PasswordInput
            label={t("password")}
            autoComplete="new-password"
            withStrength
            value={accountForm.watch("password")}
            error={accountForm.formState.errors.password?.message}
            {...accountForm.register("password")}
          />
          <PasswordInput
            label={t("confirmPassword")}
            autoComplete="new-password"
            error={accountForm.formState.errors.confirmPassword?.message}
            {...accountForm.register("confirmPassword")}
          />
          <Button
            type="submit"
            size="lg"
            className="h-12 w-full gap-2 text-base"
          >
            {t("continueCta")} <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </form>
      ) : (
        <form
          noValidate
          className="space-y-5"
          onSubmit={farmForm.handleSubmit(finish)}
        >
          <TextInput
            label={t("farmName")}
            autoComplete="organization"
            error={farmForm.formState.errors.farmName?.message}
            {...farmForm.register("farmName")}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput
              label={t("birdsLabel")}
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="1200"
              {...farmForm.register("birdCount")}
            />
            <TextInput
              label={t("shedsLabel")}
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="2"
              {...farmForm.register("shedCount")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="state">
              {t("stateLabel")}{" "}
              <span className="font-normal text-muted-foreground">
                ({t("optional")})
              </span>
            </Label>
            <select
              id="state"
              className="h-12 w-full rounded-lg border bg-background px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              {...farmForm.register("state")}
            >
              <option value="">{t("selectState")}</option>
              {STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput
              label={t("districtLabel")}
              {...farmForm.register("district")}
            />
            <TextInput
              label={t("villageLabel")}
              {...farmForm.register("village")}
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row-reverse">
            <Button
              type="submit"
              size="lg"
              className="h-12 flex-1 gap-2 text-base"
              disabled={registerUser.isPending}
            >
              {registerUser.isPending ? t("creatingFarm") : t("finishCta")}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-12 gap-2"
              onClick={() => setStep(1)}
              disabled={registerUser.isPending}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden /> {t("backCta")}
            </Button>
          </div>

          {account ? (
            <p className="text-center text-sm text-muted-foreground">
              +91 {formatMobile(account.mobile)}
            </p>
          ) : null}
        </form>
      )}

      <p className="text-center text-sm text-muted-foreground">
        {t("haveAccount")}{" "}
        <Link
          href="/login"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          {t("loginLink")}
        </Link>
      </p>
    </div>
  );
}

function StepIndicator({ step }: { step: number }) {
  const t = useTranslations("auth");
  const labels = [t("stepYourDetails"), t("stepFarmDetails")];

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {t("stepOf", { current: step, total: 2 })} · {labels[step - 1]}
      </p>
      <div className="flex gap-2" aria-hidden>
        {labels.map((label, i) => (
          <span
            key={label}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              i < step ? "bg-primary" : "bg-muted",
            )}
          />
        ))}
      </div>
    </div>
  );
}
