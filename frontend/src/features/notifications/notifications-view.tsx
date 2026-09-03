"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { CheckCheck, Bell, AlertTriangle, CalendarClock, TrendingUp, Info } from "lucide-react";
import { useNotifications } from "@/lib/queries";
import { DataState } from "@/components/shared/data-state";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNotificationsStore } from "@/store/use-notifications-store";
import { cn } from "@/lib/utils";
import type { NotificationType } from "@/types";

const typeIcon: Record<NotificationType, { icon: React.ReactNode; cls: string }> = {
  alert: { icon: <AlertTriangle className="h-4 w-4" />, cls: "text-destructive" },
  reminder: { icon: <CalendarClock className="h-4 w-4" />, cls: "text-primary" },
  market: { icon: <TrendingUp className="h-4 w-4" />, cls: "text-success" },
  system: { icon: <Info className="h-4 w-4" />, cls: "text-muted-foreground" },
};

export function NotificationsView() {
  const t = useTranslations("notifications");
  const { data, isLoading, isError, refetch } = useNotifications();
  const notifications = useNotificationsStore((s) => s.notifications);
  const setNotifications = useNotificationsStore((s) => s.setNotifications);
  const markAllRead = useNotificationsStore((s) => s.markAllRead);
  const markRead = useNotificationsStore((s) => s.markRead);

  useEffect(() => {
    if (data && data.length > 0) setNotifications(data);
  }, [data, setNotifications]);

  const today = notifications.filter((n) => {
    const d = new Date(n.timestamp ?? Date.now());
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });
  const earlier = notifications.filter((n) => {
    const d = new Date(n.timestamp ?? Date.now());
    const now = new Date();
    return d.toDateString() !== now.toDateString();
  });

  return (
    <div className="mx-auto max-w-2xl px-4 pb-10 sm:px-6">
      <PageHeader
        icon={<Bell className="h-6 w-6" />}
        title={t("title")}
        description={t("subtitle")}
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={markAllRead}>
            <CheckCheck className="h-4 w-4" /> {t("markAllRead")}
          </Button>
        }
      />

      <DataState isLoading={isLoading} isError={isError} onRetry={() => refetch()}>
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="grid place-items-center gap-2 py-14 text-center">
              <Bell className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{t("noNotifications")}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {today.length > 0 ? (
              <section>
                <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("today")}</h2>
                <div className="space-y-2">
                  {today.map((n) => <NotificationRow key={n.id} id={n.id} type={n.type} title={n.title} body={n.body} read={n.read} onMarkRead={() => markRead(n.id)} />)}
                </div>
              </section>
            ) : null}
            {earlier.length > 0 ? (
              <section>
                <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("earlier")}</h2>
                <div className="space-y-2">
                  {earlier.map((n) => <NotificationRow key={n.id} id={n.id} type={n.type} title={n.title} body={n.body} read={n.read} onMarkRead={() => markRead(n.id)} />)}
                </div>
              </section>
            ) : null}
          </div>
        )}
      </DataState>
    </div>
  );
}

function NotificationRow({
  type,
  title,
  body,
  read,
  onMarkRead,
}: {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  read?: boolean;
  onMarkRead: () => void;
}) {
  const icon = typeIcon[type] ?? typeIcon.system;
  return (
    <button
      type="button"
      onClick={onMarkRead}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl border bg-card p-4 text-left transition-colors",
        !read && "border-primary/30 bg-primary/5",
      )}
    >
      <span className={cn("mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted", icon.cls)}>
        {icon.icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="text-sm font-semibold">{title}</span>
          {!read ? <span className="h-2 w-2 shrink-0 rounded-full bg-primary" /> : null}
        </span>
        {body ? <span className="mt-0.5 block text-sm text-muted-foreground">{body}</span> : null}
      </span>
    </button>
  );
}