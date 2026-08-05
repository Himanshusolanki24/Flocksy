"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Wallet, ArrowDownLeft, ArrowUpRight, Plus, TrendingUp } from "lucide-react";
import { useFinance, useTransactions } from "@/lib/queries";
import { DataState } from "@/components/shared/data-state";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AreaTrend } from "@/components/charts";
import { formatINR } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { TransactionType } from "@/types";

function AddTransactionDialog({ type }: { type: TransactionType }) {
  const t = useTranslations("finance");
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setSaved(false); }}>
      <DialogTrigger asChild>
        <Button size="sm" variant={type === "income" ? "outline" : "ghost"} className={cn("gap-1.5", type === "income" && "text-success")}>
          {type === "income" ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
          {t(type === "income" ? "recordIncome" : "recordExpense")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t(type === "income" ? "recordIncome" : "recordExpense")}</DialogTitle>
        </DialogHeader>
        {saved ? (
          <div className="grid place-items-center py-6"><Badge variant="soft">✓ {t("saved")}</Badge></div>
        ) : (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setSaved(true); }}>
            <div className="space-y-1.5">
              <Label htmlFor="famount">{t("amount")}</Label>
              <Input id="famount" type="number" min={0} required />
            </div>
            <div className="space-y-1.5">
              <Label>{t("category")}</Label>
              <select className="h-9 w-full rounded-md border bg-transparent px-3 text-sm">
                {["sellEggs", "sellMilk", "feedPurchase", "vetVisit", "other"].map((c) => (
                  <option key={c} value={c}>{t(c)}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fnote">{t("note")}</Label>
              <Input id="fnote" />
            </div>
            <Button type="submit" className="w-full">{t("add")}</Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function FinanceView() {
  const t = useTranslations("finance");
  const { data: summary, isLoading: loadingSummary } = useFinance();
  const { data: txs, isLoading, isError, refetch } = useTransactions();
  const transactions = txs ?? [];

  const profit = (summary?.income ?? 0) - (summary?.expense ?? 0);
  const trend = (summary?.monthlyTrend ?? []).map((p) => ({ label: p.day, value: p.value }));

  const expenseByCat: Record<string, number> = {};
  transactions.filter((tx) => tx.type === "expense").forEach((tx) => {
    expenseByCat[tx.category] = (expenseByCat[tx.category] ?? 0) + tx.amount;
  });
  const topExpenses = Object.entries(expenseByCat).sort((a, b) => b[1] - a[1]).slice(0, 4);

  return (
    <div className="mx-auto max-w-5xl px-4 pb-10 sm:px-6">
      <PageHeader
        title={t("title")}
        description={t("subtitle")}
        actions={
          <div className="flex gap-2">
            <AddTransactionDialog type="income" />
            <AddTransactionDialog type="expense" />
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi label={t("balance")} value={formatINR(summary?.balance ?? 0)} icon={<Wallet className="h-5 w-5 text-primary" />} />
        <Kpi label={t("income")} value={formatINR(summary?.income ?? 0)} icon={<ArrowDownLeft className="h-5 w-5 text-success" />} />
        <Kpi label={t("expense")} value={formatINR(summary?.expense ?? 0)} icon={<ArrowUpRight className="h-5 w-5 text-destructive" />} />
        <Kpi label={t("profit")} value={formatINR(profit)} icon={<TrendingUp className="h-5 w-5 text-warning" />} />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">{t("cashflow")}</CardTitle></CardHeader>
          <CardContent>
            <AreaTrend data={trend} height={220} prefix="₹" color="var(--chart-1)" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">{t("topExpenses")}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {topExpenses.length === 0 ? <p className="text-sm text-muted-foreground">{t("noTransactions")}</p> : topExpenses.map(([cat, amt]) => (
              <div key={cat} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t(cat)}</span>
                <span className="font-semibold">{formatINR(amt)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><Plus className="h-4 w-4 text-primary" /> {t("recent")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <DataState isLoading={isLoading || loadingSummary} isError={isError} onRetry={() => refetch()}>
            {transactions.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">{t("noTransactions")}</p>
            ) : (
              transactions.map((tx) => (
                <div key={tx.id} className="flex items-center gap-3 rounded-xl border px-4 py-3">
                  <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg", tx.type === "income" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")}>
                    {tx.type === "income" ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{t(tx.category)}{tx.note ? ` — ${tx.note}` : ""}</p>
                    <p className="text-xs text-muted-foreground">{new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                  <span className={cn("font-semibold", tx.type === "income" ? "text-success" : "text-destructive")}>
                    {tx.type === "income" ? "+" : "−"}{formatINR(tx.amount)}
                  </span>
                </div>
              ))
            )}
          </DataState>
        </CardContent>
      </Card>
    </div>
  );
}

function Kpi({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <Card className="p-4">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">{icon}</span>
      <p className="mt-3 text-lg font-bold sm:text-xl">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </Card>
  );
}