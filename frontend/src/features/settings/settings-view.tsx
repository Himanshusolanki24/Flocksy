"use client";

import { useTranslations } from "next-intl";
import { Save, Download, Trash2, HelpCircle, Info, Settings } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { usePreferencesStore, type ThemePreference } from "@/store/use-preferences-store";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function SettingRow({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>
        {desc ? <p className="text-xs text-muted-foreground">{desc}</p> : null}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export function SettingsView() {
  const t = useTranslations("settings");
  const { setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const {
    theme,
    language,
    setLanguage,
    largeText,
    setLargeText,
    notificationPrefs,
    setNotificationPref,
  } = usePreferencesStore();

  const save = () => toast.success(t("saved"));

  return (
    <div className="mx-auto max-w-2xl px-4 pb-10 sm:px-6">
      <PageHeader
        icon={<Settings className="h-6 w-6" />}
        title={t("title")}
        description={t("subtitle")}
      />

      <div className="space-y-5">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("general")}</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            <SettingRow title={t("languagePref")}>
              <div className="flex gap-1.5">
                {["en", "hi"].map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => {
                      setLanguage(lang);
                      router.replace(pathname, { locale: lang as (typeof routing.locales)[number] });
                    }}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                      language === lang ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                    )}
                  >
                    {lang === "en" ? "English" : "हिंदी"}
                  </button>
                ))}
              </div>
            </SettingRow>
            <SettingRow title={t("themeMode")}>
              <div className="flex gap-1.5">
                {(["light", "dark", "system"] as ThemePreference[]).map((th) => (
                  <button
                    key={th}
                    type="button"
                    onClick={() => {
                      usePreferencesStore.getState().setTheme(th);
                      setTheme(th);
                    }}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors",
                      theme === th ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                    )}
                  >
                    {t(th)}
                  </button>
                ))}
              </div>
            </SettingRow>
            <SettingRow title="Large text" desc="Increase text size for readability">
              <Switch checked={largeText} onCheckedChange={setLargeText} />
            </SettingRow>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("notificationsPref")}</CardTitle>
            <CardDescription>{t("general")}</CardDescription>
          </CardHeader>
          <CardContent className="divide-y">
            <SettingRow title={t("push")}>
              <Switch checked={notificationPrefs.push} onCheckedChange={(v) => setNotificationPref("push", v)} />
            </SettingRow>
            <SettingRow title={t("sms")}>
              <Switch checked={notificationPrefs.sms} onCheckedChange={(v) => setNotificationPref("sms", v)} />
            </SettingRow>
            <SettingRow title={t("weatherAlerts")}>
              <Switch checked={notificationPrefs.weatherAlerts} onCheckedChange={(v) => setNotificationPref("weatherAlerts", v)} />
            </SettingRow>
            <SettingRow title={t("marketAlerts")}>
              <Switch checked={notificationPrefs.marketAlerts} onCheckedChange={(v) => setNotificationPref("marketAlerts", v)} />
            </SettingRow>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("privacy")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <SettingRow title={t("data")}>
              <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-4 w-4" /> {t("downloadData")}</Button>
            </SettingRow>
            <SettingRow title={t("deleteAccount")}>
              <Button variant="outline" size="sm" className="gap-1.5 text-destructive"><Trash2 className="h-4 w-4" /> {t("deleteAccount")}</Button>
            </SettingRow>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("about")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <SettingRow title={t("version")} desc="Flocksy v1.0.0">
              <Badge variant="soft">Stable</Badge>
            </SettingRow>
            <SettingRow title={t("help")}>
              <Button variant="outline" size="sm" className="gap-1.5"><HelpCircle className="h-4 w-4" /> {t("help")}</Button>
            </SettingRow>
            <SettingRow title="Privacy policy">
              <Button variant="outline" size="sm" className="gap-1.5"><Info className="h-4 w-4" /> Open</Button>
            </SettingRow>
          </CardContent>
        </Card>

        <Button className="w-full gap-2" onClick={save}>
          <Save className="h-4 w-4" /> {t("saved")}
        </Button>
      </div>
    </div>
  );
}