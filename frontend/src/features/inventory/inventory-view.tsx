"use client";

import { useMemo, useState } from "react";
import { Search, Plus, MoreVertical, Warehouse } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const demoSheds = [
  { id: "shed-1", name: "Coop 1", type: "Broiler", birds: 800, age: "21 days", health: "Healthy" as const, updatedAt: "1 Sep 2026" },
  { id: "shed-2", name: "Coop 2", type: "Broiler", birds: 800, age: "21 days", health: "Healthy" as const, updatedAt: "1 Sep 2026" },
  { id: "shed-3", name: "Coop 3", type: "Broiler", birds: 800, age: "21 days", health: "At Risk" as const, updatedAt: "1 Sep 2026" },
  { id: "shed-4", name: "Layer Farm", type: "Layer", birds: 250, age: "120 days", health: "Healthy" as const, updatedAt: "1 Sep 2026" },
];

const healthBadgeStyles: Record<string, string> = {
  "Healthy": "bg-[#EAF3EA] text-[#225424]",
  "At Risk": "bg-[#FEF5ED] text-[#D35400]",
  "Critical": "bg-[#FDE8E8] text-[#C53030]",
};

function AddShedDialog({ onAdd }: { onAdd: (shed: (typeof demoSheds)[0]) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("Broiler");
  const [birds, setBirds] = useState(800);
  const [age, setAge] = useState("21 days");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: `shed-${Date.now()}`,
      name,
      type,
      birds: Number(birds),
      age,
      health: "Healthy",
      updatedAt: "Today",
    });
    setOpen(false);
    setName("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1.5 rounded-lg bg-[#205223] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#18401a]">
          <Plus className="h-4 w-4" /> Add Shed
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Shed</DialogTitle>
          <DialogDescription>Enter shed and flock details below.</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="sname">Shed / Flock Name</Label>
            <Input id="sname" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Coop 4" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-white px-3 text-sm"
              >
                <option value="Broiler">Broiler</option>
                <option value="Layer">Layer</option>
                <option value="Breeder">Breeder</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sbirds">Birds</Label>
              <Input
                id="sbirds"
                type="number"
                min={0}
                required
                value={birds}
                onChange={(e) => setBirds(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sage">Age</Label>
            <Input id="sage" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 21 days" />
          </div>
          <Button type="submit" className="w-full bg-[#205223] text-white hover:bg-[#18401a]">
            Save Shed
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function InventoryView() {
  const [shedsList, setShedsList] = useState(demoSheds);
  const [query, setQuery] = useState("");

  const filteredSheds = useMemo(() => {
    return shedsList.filter((s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.type.toLowerCase().includes(query.toLowerCase())
    );
  }, [shedsList, query]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#EAF3EA] to-[#D5E9D5] text-[#225424] shadow-xs border border-[#CDE3CD]/80 ring-2 ring-white">
            <Warehouse className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#1E2922] sm:text-3xl">My Farm</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">All your sheds and flock details in one place.</p>
          </div>
        </div>
        <AddShedDialog onAdd={(newShed) => setShedsList((prev) => [...prev, newShed])} />
      </div>

      {/* Search */}
      <div className="relative sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search sheds..."
          className="h-9 rounded-lg border-border/80 bg-white/90 pl-9 text-sm shadow-soft focus-visible:ring-1"
        />
      </div>

      {/* Table */}
      <Card className="overflow-hidden rounded-xl border border-border/80 bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-transparent text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/90">
                <th className="px-5 py-3">Shed / Flock Name</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Birds</th>
                <th className="px-5 py-3">Age</th>
                <th className="px-5 py-3">Health Status</th>
                <th className="px-5 py-3">Last Updated</th>
                <th className="w-10 px-3 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-[13px]">
              {filteredSheds.map((shed) => (
                <tr key={shed.id} className="transition-colors hover:bg-[#F9FBF8]">
                  <td className="px-5 py-2.5 font-semibold text-foreground">{shed.name}</td>
                  <td className="px-5 py-2.5 text-muted-foreground">{shed.type}</td>
                  <td className="px-5 py-2.5 text-muted-foreground">{shed.birds}</td>
                  <td className="px-5 py-2.5 text-muted-foreground">{shed.age}</td>
                  <td className="px-5 py-2.5">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium",
                        healthBadgeStyles[shed.health] ?? "bg-muted text-muted-foreground"
                      )}
                    >
                      {shed.health}
                    </span>
                  </td>
                  <td className="px-5 py-2.5 text-muted-foreground">{shed.updatedAt}</td>
                  <td className="px-3 py-2.5 text-right text-muted-foreground">
                    <button type="button" className="p-1 hover:text-foreground">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredSheds.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-6 text-center text-muted-foreground">
                    No sheds found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Bottom Illustration: Rolling hills with chickens */}
      <div className="relative mt-2 h-20 w-full overflow-hidden sm:h-24">
        <svg viewBox="0 0 1000 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 left-0 h-full w-full preserve-3d" preserveAspectRatio="none">
          {/* Distant rolling hills */}
          <path d="M0 80 Q 250 40 500 70 T 1000 50 L 1000 140 L 0 140 Z" fill="#E4EFE2" />
          <path d="M0 95 Q 320 60 640 85 T 1000 75 L 1000 140 L 0 140 Z" fill="#D3E5D0" />
          <path d="M0 115 Q 280 85 580 105 T 1000 95 L 1000 140 L 0 140 Z" fill="#BED9BB" />
        </svg>

        {/* Chickens overlay positioned nicely on the grass */}
        <div className="absolute bottom-4 right-12 flex items-end gap-5 sm:right-24">
          {/* Chicken 1 (Hen) */}
          <div className="relative h-12 w-12 scale-90">
            <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
              {/* Comb */}
              <circle cx="34" cy="12" r="3" fill="#E53E3E" />
              <circle cx="37" cy="14" r="2.5" fill="#E53E3E" />
              {/* Head & Body */}
              <ellipse cx="26" cy="30" rx="14" ry="11" fill="#E28743" />
              <circle cx="33" cy="20" r="7" fill="#E28743" />
              {/* Eye */}
              <circle cx="35" cy="18" r="1.2" fill="#1A202C" />
              {/* Beak */}
              <polygon points="40,20 45,22 40,24" fill="#ECC94B" />
              {/* Wattle */}
              <circle cx="36" cy="24" r="2" fill="#E53E3E" />
              {/* Wing */}
              <path d="M20 27 Q 27 24 30 31 Q 25 36 20 27 Z" fill="#C05621" />
              {/* Tail */}
              <path d="M12 28 C 8 22 14 18 17 24 Z" fill="#9C4221" />
              {/* Legs */}
              <line x1="23" y1="40" x2="21" y2="48" stroke="#D69E2E" strokeWidth="2" strokeLinecap="round" />
              <line x1="29" y1="40" x2="28" y2="48" stroke="#D69E2E" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          {/* Chicken 2 (Rooster / Hen looking left) */}
          <div className="relative h-14 w-14">
            <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
              {/* Comb */}
              <path d="M26 8 C 26 5 32 5 32 8 C 34 5 38 7 37 11 Z" fill="#C53030" />
              {/* Body */}
              <ellipse cx="25" cy="28" rx="15" ry="12" fill="#ED8936" />
              <circle cx="32" cy="17" r="8" fill="#F6AD55" />
              {/* Eye */}
              <circle cx="34" cy="15" r="1.3" fill="#1A202C" />
              {/* Beak */}
              <polygon points="39,17 46,19 39,21" fill="#D69E2E" />
              <circle cx="35" cy="22" r="2.5" fill="#E53E3E" />
              {/* Wing */}
              <path d="M18 25 Q 26 21 29 29 Q 23 35 18 25 Z" fill="#DD6B20" />
              {/* Tail feathers */}
              <path d="M11 25 C 5 16 12 12 16 20 Z" fill="#7B341E" />
              <path d="M9 28 C 4 22 10 18 14 24 Z" fill="#9C4221" />
              {/* Legs */}
              <line x1="22" y1="39" x2="20" y2="48" stroke="#B7791F" strokeWidth="2" strokeLinecap="round" />
              <line x1="28" y1="39" x2="27" y2="48" stroke="#B7791F" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}