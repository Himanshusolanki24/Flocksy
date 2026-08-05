"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Search, Plus, Package, Pencil, Trash2 } from "lucide-react";
import { useInventory } from "@/lib/queries";
import { DataState } from "@/components/shared/data-state";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { InventoryItem, StockStatus } from "@/types";

const statusStyle: Record<StockStatus, string> = {
  "in-stock": "bg-success/15 text-success",
  "low-stock": "bg-warning/15 text-warning",
  "out-of-stock": "bg-destructive/15 text-destructive",
};

function AddItemDialog() {
  const t = useTranslations("inventory");
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setSaved(false); }}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> {t("addItem")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("addTitle")}</DialogTitle>
          <DialogDescription>{t("name")} · {t("category")} · {t("quantity")}</DialogDescription>
        </DialogHeader>
        {saved ? (
          <div className="grid place-items-center py-6 text-center">
            <Badge variant="soft">✓ {t("saved")}</Badge>
          </div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(e) => { e.preventDefault(); setSaved(true); }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="iname">{t("name")}</Label>
              <Input id="iname" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>{t("category")}</Label>
                <select className="h-9 w-full rounded-md border bg-transparent px-3 text-sm">
                  {["feed", "medicine", "equipment", "other"].map((c) => (
                    <option key={c} value={c}>{t(c)}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>{t("unit")}</Label>
                <Input defaultValue="kg" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="iqty">{t("quantity")}</Label>
              <Input id="iqty" type="number" min={0} required />
            </div>
            <Button type="submit" className="w-full">{t("saved")}</Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function InventoryView() {
  const t = useTranslations("inventory");
  const { data, isLoading, isError, refetch } = useInventory();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all");
  const [items, setItems] = useState<InventoryItem[]>([]);

  const all = (data ?? items).length ? (data ?? items) : items;
  const filtered = useMemo(() => {
    return all.filter((i) => {
      const matchQ = i.name.toLowerCase().includes(query.toLowerCase());
      const matchT = tab === "all" || i.category === tab || i.stockStatus === tab;
      return matchQ && matchT;
    });
  }, [all, query, tab]);

  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const countBy = (key: "category" | "stockStatus", value: string) =>
    all.filter((i) => i[key] === value).length;

  return (
    <div className="mx-auto max-w-5xl px-4 pb-10 sm:px-6">
      <PageHeader title={t("title")} description={t("subtitle")} actions={<AddItemDialog />} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("searchPlaceholder")} className="pl-9" />
        </div>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="all">{t("categories")}</TabsTrigger>
            <TabsTrigger value="in-stock">{t("inStock")} ({countBy("stockStatus", "in-stock")})</TabsTrigger>
            <TabsTrigger value="low-stock">{t("lowStock")} ({countBy("stockStatus", "low-stock")})</TabsTrigger>
            <TabsTrigger value="out-of-stock">{t("outOfStock")} ({countBy("stockStatus", "out-of-stock")})</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <DataState isLoading={isLoading} isError={isError} onRetry={() => refetch()}>
        {filtered.length === 0 ? (
          <Card className="mt-5">
            <CardContent className="grid place-items-center gap-2 py-12 text-center">
              <Package className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{t("noItems")}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <Package className="h-4 w-4 text-primary" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{t(item.category)}</p>
                    </div>
                  </div>
                  <Badge variant="soft" className={cn("text-[11px]", statusStyle[item.stockStatus])}>
                    {t(item.stockStatus)}
                  </Badge>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold">{item.quantity} <span className="text-xs font-normal text-muted-foreground">{item.unit}</span></p>
                    <p className="text-[11px] text-muted-foreground">{t("lastUpdated")}: {new Date(item.updatedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" aria-label={t("adjust")}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive" aria-label={t("deleteConfirm")} onClick={() => remove(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </DataState>
    </div>
  );
}