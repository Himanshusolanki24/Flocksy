"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { User, Phone, MapPin, Home, Languages, Link2, Calendar, Pencil } from "lucide-react";
import { usePreferencesStore } from "@/store/use-preferences-store";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-muted/40 px-4 py-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-background text-primary">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

export function ProfileView() {
  const t = useTranslations("profile");
  const farmType = usePreferencesStore((s) => s.farmType);
  const [edit, setEdit] = useState(false);

  const save = () => {
    setEdit(false);
    toast.success(t("saved"));
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pb-10 sm:px-6">
      <PageHeader
        title={t("title")}
        description={t("subtitle")}
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => (edit ? save() : setEdit(true))}>
            <Pencil className="h-4 w-4" /> {t("edit")}
          </Button>
        }
      />

      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-primary/30 via-primary/10 to-transparent" />
        <CardContent className="-mt-10">
          <div className="flex items-end gap-4">
            <Avatar className="h-20 w-20 border-4 border-background">
              <AvatarFallback className="bg-primary/20 text-xl font-bold text-primary">RS</AvatarFallback>
            </Avatar>
            <div className="pb-1">
              <p className="text-lg font-bold">Ramesh Solanki</p>
              <p className="text-sm text-muted-foreground">+91 98•••• ••••</p>
            </div>
            <Badge variant="soft" className="mb-1 ml-auto capitalize">{farmType ?? t("primaryType")}</Badge>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <InfoRow icon={<User className="h-4 w-4" />} label={t("personalInfo")} value="Ramesh Solanki" />
            <InfoRow icon={<Phone className="h-4 w-4" />} label={t("phone")} value="+91 98765 43210" />
            <InfoRow icon={<Home className="h-4 w-4" />} label={t("farmSize")} value="4.5 acres" />
            <InfoRow icon={<MapPin className="h-4 w-4" />} label={`${t("location")} · ${t("state")}`} value="Nashik, Maharashtra" />
            <InfoRow icon={<Languages className="h-4 w-4" />} label={t("languages")} value="English, हिंदी, मराठी" />
            <InfoRow icon={<Calendar className="h-4 w-4" />} label={t("memberSince")} value="March 2025" />
          </div>
        </CardContent>
      </Card>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle className="text-base">{t("farmInfo")}</CardTitle>
          <CardDescription>{t("primaryType")} · {t("location")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="pstate">{t("state")}</Label>
              <Input id="pstate" defaultValue="Maharashtra" disabled={!edit} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pfarm">{t("farmSize")}</Label>
              <Input id="pfarm" defaultValue="4.5 acres" disabled={!edit} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="paddr">{t("location")}</Label>
              <Input id="paddr" defaultValue="Village Talegaon, Nashik District" disabled={!edit} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Link2 className="h-4 w-4 text-primary" /> {t("linkedAccounts")}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2">
          {["WhatsApp", "Aadhaar e-KYC", "PM Kisan"].map((a) => (
            <div key={a} className="flex items-center justify-between rounded-xl border px-4 py-3 text-sm">
              <span>{a}</span>
              <Badge variant="soft" className="text-success">✓</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}