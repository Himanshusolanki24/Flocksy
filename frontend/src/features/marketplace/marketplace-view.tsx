"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Search, MapPin, ArrowUpRight, ArrowDownRight, Plus, Tag } from "lucide-react";
import { useMarketPrices } from "@/lib/queries";
import { DataState } from "@/components/shared/data-state";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkline } from "@/components/charts";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatINR } from "@/lib/utils";
import { cn } from "@/lib/utils";

const categoryIcons: Record<string, string> = {
  eggs: "🥚",
  milk: "🥛",
  birds: "🐔",
  goats: "🐐",
  vegetables: "🥬",
  grains: "🌾",
};

function priceCategory(commodity: string): string {
  const c = commodity.toLowerCase();
  if (c.includes("egg")) return "eggs";
  if (c.includes("milk")) return "milk";
  if (c.includes("bird") || c.includes("broiler")) return "birds";
  if (c.includes("goat")) return "goats";
  if (c.includes("wheat") || c.includes("rice") || c.includes("grain")) return "grains";
  return "vegetables";
}

function ListItemForm() {
  const t = useTranslations("marketplace");
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setSaved(false); }}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> {t("listItem")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("listTitle")}</DialogTitle>
          <DialogDescription>{t("listDesc")}</DialogDescription>
        </DialogHeader>
        {saved ? (
          <div className="grid place-items-center py-8 text-center">
            <Badge variant="soft" className="mb-2">✓ {t("posted")}</Badge>
            <Button variant="outline" onClick={() => setOpen(false)}>{t("listItem")} →</Button>
          </div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setSaved(true);
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="item">{t("title")}</Label>
              <Input id="item" placeholder={t("searchPlaceholder")} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="qty">{t("quantity")}</Label>
                <Input id="qty" type="text" defaultValue="50 dozen" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="price">{t("price")}</Label>
                <Input id="price" type="number" placeholder="₹" required />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="city">{t("cityPlaceholder")}</Label>
              <Input id="city" defaultValue="Nashik" />
            </div>
            <Button type="submit" className="w-full">{t("post")}</Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function MarketplaceView() {
  const t = useTranslations("marketplace");
  const { data, isLoading, isError, refetch } = useMarketPrices();
  const [tab, setTab] = useState("sell");
  const [query, setQuery] = useState("");

  return (
    <div className="mx-auto max-w-5xl px-4 pb-10 sm:px-6">
      <PageHeader
        title={t("title")}
        description={t("subtitle")}
        actions={<ListItemForm />}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="pl-9"
          />
        </div>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="sell">{t("sell")}</TabsTrigger>
            <TabsTrigger value="buy">{t("buy")}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Object.keys(categoryIcons).map((cat) => (
          <button
            key={cat}
            type="button"
            className="flex flex-col items-center gap-1.5 rounded-xl border bg-card py-3 transition-colors hover:border-primary/40 hover:bg-primary/5"
          >
            <span className="text-2xl">{categoryIcons[cat]}</span>
            <span className="text-xs font-medium">{t(cat)}</span>
          </button>
        ))}
      </div>

      <DataState isLoading={isLoading} isError={isError} onRetry={() => refetch()}>
        <div className="mt-5 space-y-3">
          {(data ?? [])
            .filter((p) => p.commodity.toLowerCase().includes(query.toLowerCase()))
            .map((p) => {
              const up = p.changePct >= 0;
              return (
                <Card key={p.id} className="overflow-hidden">
                  <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-2xl">
                        {categoryIcons[priceCategory(p.commodity)] ?? <Tag className="h-5 w-5 text-primary" />}
                      </span>
                      <div>
                        <p className="font-semibold">{p.commodity}</p>
                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" /> {p.mandi} · {p.unit}
                        </p>
                      </div>
                    </div>
                    <div className="hidden w-40 sm:block">
                      <Sparkline values={p.trend.map((x) => x.value)} />
                    </div>
                    <div className="flex items-center gap-3 sm:ml-auto">
                      <div className="text-right">
                        <p className="text-xl font-bold">{formatINR(p.price)}</p>
                        <Badge variant={up ? "soft" : "destructive"} className={cn("gap-0.5", up ? "text-success" : "text-destructive")}>
                          {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                          {Math.abs(p.changePct)}%
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Tag className="h-3.5 w-3.5" /> {t("priceTrend")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </DataState>
    </div>
  );
}