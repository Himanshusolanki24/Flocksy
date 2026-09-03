"use client";

import { useState, type ComponentType } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Receipt,
} from "lucide-react";
import { useFinance, useTransactions } from "@/lib/queries";
import { DataState } from "@/components/shared/data-state";
import { PageHeader } from "@/components/shared/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaTrend } from "@/components/charts";
import { formatINR, cn } from "@/lib/utils";
import type { TransactionType } from "@/types";

function AddTransactionDialog({ type }: { type: TransactionType }) {
  const t = useTranslations("finance");
  const [open, setOpen] = useState(false);
  const isIncome = type === "income";
  const title = t(isIncome ? "recordIncome" : "recordExpense");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant={isIncome ? "default" : "outline"}
          className="h-10 gap-1.5"
        >
          {isIncome ? (
            <ArrowDownLeft className="h-4 w-4" aria-hidden />
          ) : (
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          )}
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setOpen(false);
            toast.success(t("saved"));
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor={`amount-${type}`}>{t("amount")}</Label>
            <Input
              id={`amount-${type}`}
              type="number"
              min={0}
              required
              className="h-11"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`cat-${type}`}>{t("category")}</Label>
            <select
              id={`cat-${type}`}
              className="h-11 w-full rounded-md border bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {(isIncome
                ? ["sellEggs", "sellMilk", "other"]
                : ["feedPurchase", "vetVisit", "other"]
              ).map((c) => (
                <option key={c} value={c}>
                  {t(c)}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`note-${type}`}>{t("note")}</Label>
            <Input id={`note-${type}`} className="h-11" />
          </div>
          <Button type="submit" className="h-11 w-full">
            {t("add")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function FinanceView() {
  const t = useTranslations("finance");
  const { data: summary, isLoading: loadingSummary } = useFinance();
  const { data: txs, isLoading, isError, refetch } = useTransactions();
  const [filter, setFilter] = useState("all");

  const transactions = (txs ?? []).filter(
    (tx) => filter === "all" || tx.type === filter,
  );
  const income = summary?.income ?? 0;
  const expense = summary?.expense ?? 0;
  const profit = income - expense;
  const trend = (summary?.monthlyTrend ?? []).map((p) => ({
    label: p.day,
    value: p.value,
  }));

  const expenseByCat: Record<string, number> = {};
  for (const tx of txs ?? []) {
    if (tx.type === "expense")
      expenseByCat[tx.category] = (expenseByCat[tx.category] ?? 0) + tx.amount;
  }
  const topExpenses = Object.entries(expenseByCat)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);
  const topAmount = topExpenses[0]?.[1] ?? 1;

  return (
    <div className="mx-auto max-w-5xl px-4 pb-12 sm:px-6">
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
        <Kpi
          label={t("balance")}
          value={formatINR(summary?.balance ?? 0)}
          icon={Wallet}
          tone="primary"
        />
        <Kpi
          label={t("income")}
          value={formatINR(income)}
          icon={ArrowDownLeft}
          tone="success"
        />
        <Kpi
          label={t("expense")}
          value={formatINR(expense)}
          icon={ArrowUpRight}
          tone="destructive"
        />
        <Kpi
          label={profit >= 0 ? t("profit") : t("loss")}
          value={formatINR(Math.abs(profit))}
          icon={profit >= 0 ? TrendingUp : TrendingDown}
          tone={profit >= 0 ? "success" : "destructive"}
        />
      </div>

      {/* Income vs expenses — one bar says more than two numbers. */}
      <Card className="mt-5">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t("incomeVsExpense")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div
            className="flex h-3 w-full overflow-hidden rounded-full bg-muted"
            aria-hidden
          >
            <span
              className="bg-success"
              style={{
                width: `${income + expense ? (income / (income + expense)) * 100 : 0}%`,
              }}
            />
            <span
              className="bg-destructive"
              style={{
                width: `${income + expense ? (expense / (income + expense)) * 100 : 0}%`,
              }}
            />
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
            <span className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full bg-success"
                aria-hidden
              />
              {t("income")} <strong>{formatINR(income)}</strong>
            </span>
            <span className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full bg-destructive"
                aria-hidden
              />
              {t("expense")} <strong>{formatINR(expense)}</strong>
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t("cashflow")}</CardTitle>
            <CardDescription>{t("cashflowHint")}</CardDescription>
          </CardHeader>
          <CardContent>
            <AreaTrend
              data={trend}
              height={220}
              prefix="₹"
              color="var(--chart-1)"
              showGrid
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t("topExpenses")}</CardTitle>
            <CardDescription>{t("topExpensesHint")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topExpenses.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {t("noTransactions")}
              </p>
            ) : (
              topExpenses.map(([cat, amt]) => (
                <div key={cat} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t(cat)}</span>
                    <span className="font-semibold">{formatINR(amt)}</span>
                  </div>
                  <div
                    className="h-2 overflow-hidden rounded-full bg-muted"
                    aria-hidden
                  >
                    <span
                      className="block h-full rounded-full bg-primary"
                      style={{ width: `${(amt / topAmount) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-5">
        <CardHeader className="flex-col gap-3 space-y-0 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Receipt className="h-4 w-4 text-primary" aria-hidden />{" "}
            {t("recent")}
          </CardTitle>
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList>
              <TabsTrigger value="all">{t("filterAll")}</TabsTrigger>
              <TabsTrigger value="income">{t("filterIncome")}</TabsTrigger>
              <TabsTrigger value="expense">{t("filterExpense")}</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="space-y-2">
          <DataState
            isLoading={isLoading || loadingSummary}
            isError={isError}
            onRetry={() => refetch()}
          >
            {transactions.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                {t("noTransactions")}
              </p>
            ) : (
              transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center gap-3 rounded-xl border p-3.5"
                >
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                      tx.type === "income"
                        ? "bg-success/10 text-success"
                        : "bg-destructive/10 text-destructive",
                    )}
                  >
                    {tx.type === "income" ? (
                      <ArrowDownLeft className="h-4 w-4" aria-hidden />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" aria-hidden />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {t(tx.category)}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {new Date(tx.date).toLocaleDateString()}
                      {tx.note ? ` · ${tx.note}` : ""}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 font-semibold",
                      tx.type === "income"
                        ? "text-success"
                        : "text-destructive",
                    )}
                  >
                    {tx.type === "income" ? "+" : "−"}
                    {formatINR(tx.amount)}
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

const kpiTone = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  destructive: "bg-destructive/10 text-destructive",
} as const;

function Kpi({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
  tone: keyof typeof kpiTone;
}) {
  return (
    <Card className="p-4">
      <span
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg",
          kpiTone[tone],
        )}
      >
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <p className="mt-3 text-lg font-bold tracking-tight sm:text-xl">
        {value}
      </p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </Card>
  );
}
