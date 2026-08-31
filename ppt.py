import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter
from pathlib import Path

plt.rcParams.update({
    "figure.dpi": 110,
    "savefig.dpi": 200,
    "savefig.bbox": "tight",
    "font.family": "DejaVu Sans",
    "font.size": 10,
    "axes.titlesize": 13,
    "axes.titleweight": "semibold",
    "axes.titlepad": 14,
    "axes.labelsize": 10,
    "axes.edgecolor": "#D2DACD",
    "axes.linewidth": 0.9,
    "axes.grid": True,
    "grid.color": "#E6EAE3",
    "grid.linewidth": 0.8,
    "axes.axisbelow": True,
    "figure.facecolor": "white",
})

TEAL, BRICK, MUSTARD, SLATE, OLIVE, GREY = (
    "#2C6E63", "#8C3B4A", "#A2751B", "#4A6480", "#6B7A5A", "#B9C2B6"
)
PALETTE = [TEAL, BRICK, MUSTARD, SLATE, OLIVE, GREY]
INK, SOFT = "#16211C", "#5C6B62"


def strip(ax, x_grid=False):
    """Clean chart frame: no top/right spines, horizontal grid only."""
    for side in ("top", "right"):
        ax.spines[side].set_visible(False)
    ax.grid(axis="x" if x_grid else "y")
    ax.grid(axis="y" if x_grid else "x", visible=False)
    ax.tick_params(colors=SOFT, length=0)
    return ax


def label_bars(ax, bars, fmt="{:.1f}", pad=0.01, horizontal=False):
    span = (ax.get_xlim()[1] if horizontal else ax.get_ylim()[1])
    for b in bars:
        v = b.get_width() if horizontal else b.get_height()
        if horizontal:
            ax.text(v + span * pad, b.get_y() + b.get_height() / 2, fmt.format(v),
                    va="center", ha="left", fontsize=9, color=INK)
        else:
            ax.text(b.get_x() + b.get_width() / 2, v + span * pad, fmt.format(v),
                    ha="center", va="bottom", fontsize=9, color=INK)


FIGS = {}

# ── DATA (2024–25 unless noted) ──────────────────────────────────────────────

# Eggs, BAHS 2025
eggs_total_bn   = 149.11          # billion eggs, 2024-25
eggs_prev_bn    = 142.77          # billion eggs, 2023-24
eggs_growth_pct = 4.44
eggs_split = pd.DataFrame({
    "segment": ["Commercial poultry", "Backyard poultry"],
    "billion_eggs": [125.98, 23.13],
    "share_pct": [84.49, 15.51],
})

eggs_per_capita = pd.DataFrame({
    "year": ["2014-15", "2023-24", "2024-25"],
    "eggs_per_year": [62, 101, 106],
})

egg_states = pd.DataFrame({
    "state": ["Andhra Pradesh", "Tamil Nadu", "Telangana", "West Bengal", "Karnataka"],
    "share_pct": [18.37, 15.63, 12.98, 10.72, 6.67],
})

# Meat, BAHS 2025
meat_total_mt   = 10.50           # million tonnes, 2024-25
meat_growth_pct = 2.46
poultry_meat_mt = 5.18            # million tonnes, ~49% of total

# Species split is 2023-24 (latest published breakdown) — flagged in the chart title
meat_species = pd.DataFrame({
    "species": ["Poultry", "Buffalo", "Goat", "Sheep", "Pig", "Other"],
    "share_pct": [48.96, 18.09, 15.50, 11.13, 3.72, 2.60],
})

meat_states = pd.DataFrame({
    "state": ["West Bengal", "Uttar Pradesh", "Maharashtra", "Andhra Pradesh", "Telangana"],
    "share_pct": [12.46, 12.20, 11.57, 10.84, 10.49],
})

# Bird population — 20th Livestock Census (2019). Still the latest national count.
flock = pd.DataFrame({
    "segment": ["Backyard", "Commercial"],
    "million_birds": [317.07, 534.74],
})

# Animal health capacity
vet_capacity = pd.DataFrame({
    "resource": ["Registered vet practitioners", "Dispensaries", "Hospitals"],
    "count": [67800, 27140, 12234],
})

# Market estimates, 2025 — DIFFERENT SCOPES, do not compare naively
market_scope = pd.DataFrame({
    "estimate": ["Poultry meat\nonly\n(Ken/Mordor)",
                 "Whole sector\n(R&M)",
                 "Whole sector\n(EMR)"],
    "usd_bn": [6.50, 30.46, 32.93],
})

# Poultry-meat value path, 2025 base compounded at the published CAGR
meat_base_usd_bn, meat_cagr = 6.50, 0.038
meat_years = list(range(2025, 2033))
meat_path = pd.DataFrame({
    "year": meat_years,
    "usd_bn": [round(meat_base_usd_bn * (1 + meat_cagr) ** i, 2)
               for i in range(len(meat_years))],
})

flock_total = flock.million_birds.sum()
vets = int(vet_capacity.loc[vet_capacity.resource.str.contains("practitioners"), "count"].iloc[0])

print(f"Flock            : {flock_total:,.2f} M birds (2019)")
print(f"Backyard share   : {flock.million_birds[0] / flock_total * 100:,.1f}%")
print(f"Birds per vet    : {flock_total * 1e6 / vets:,.0f}")
print(f"Eggs 2024-25     : {eggs_total_bn} bn  (+{eggs_growth_pct}%)")
print(f"Poultry meat     : {poultry_meat_mt} Mt of {meat_total_mt} Mt "
      f"({poultry_meat_mt / meat_total_mt * 100:.1f}%)")
print(f"Implied 2032 mkt : ${meat_path.usd_bn.iloc[-1]}B")

# ── 2. Eggs — where the 149 billion comes from ────────────────────────────────
fig1, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4.4))

wedges, _, autotexts = ax1.pie(
    eggs_split.billion_eggs, labels=eggs_split.segment,
    colors=[TEAL, MUSTARD], autopct="%1.1f%%", startangle=90, labeldistance=1.08,
    pctdistance=0.78, wedgeprops=dict(width=0.42, edgecolor="white", linewidth=2),
    textprops=dict(color=INK, fontsize=10),
)
for t in autotexts:
    t.set_color("white"); t.set_fontweight("bold")
ax1.text(0, 0, f"{eggs_total_bn}\nbn eggs", ha="center", va="center",
         fontsize=13, color=INK, fontweight="semibold")
ax1.set_title("Egg production by segment, 2024–25")

b = ax2.bar(eggs_per_capita.year, eggs_per_capita.eggs_per_year,
            color=[GREY, SLATE, TEAL], width=0.55)
strip(ax2)
label_bars(ax2, b, "{:.0f}")
ax2.set_ylim(0, 125)
ax2.set_ylabel("eggs per person per year")
ax2.set_title("Per-capita egg availability")

FIGS["01_eggs"] = fig1

# ── 3. Meat — poultry is now half of everything India produces ────────────────
fig2, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4.4))

order = meat_species.sort_values("share_pct", ascending=True)
colors = [TEAL if s == "Poultry" else GREY for s in order.species]
b = ax1.barh(order.species, order.share_pct, color=colors, height=0.65)
strip(ax1, x_grid=True)
label_bars(ax1, b, "{:.1f}%", horizontal=True)
ax1.set_xlim(0, 58)
ax1.set_xlabel("% of national meat output")
ax1.set_title("Meat output by species (2023–24 split)", loc="left")

years = ["2023-24", "2024-25"]
totals = [meat_total_mt / (1 + meat_growth_pct / 100), meat_total_mt]
poultry = [totals[0] * meat_species.share_pct[0] / 100, poultry_meat_mt]

b_all = ax2.bar(years, totals, color=GREY, width=0.5, label="All meat")
b_pou = ax2.bar(years, poultry, color=TEAL, width=0.5, label="Poultry meat")
strip(ax2)
ax2.set_ylim(0, 13.5)
ax2.set_ylabel("million tonnes")
ax2.set_title(f"Total vs poultry meat  (+{meat_growth_pct}% YoY)")
ax2.legend(frameon=False, loc="upper left", fontsize=9)
label_bars(ax2, b_all, "{:.2f}")
for bar, v in zip(b_pou, poultry):
    ax2.text(bar.get_x() + bar.get_width() / 2, v / 2, f"{v:.2f}",
             ha="center", va="center", color="white", fontsize=9.5, fontweight="bold")

FIGS["02_meat"] = fig2

# ── 4. Concentration — five states carry the sector ──────────────────────────
fig3, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4.2), sharex=True)

for ax, df, title, col in [
    (ax1, egg_states, f"Egg production ({egg_states.share_pct.sum():.1f}% combined)", TEAL),
    (ax2, meat_states, f"Meat production ({meat_states.share_pct.sum():.1f}% combined)", BRICK),
]:
    d = df.sort_values("share_pct")
    b = ax.barh(d.state, d.share_pct, color=col, height=0.62)
    strip(ax, x_grid=True)
    label_bars(ax, b, "{:.2f}%", horizontal=True)
    ax.set_xlim(0, 22)
    ax.set_title(title, loc="left")
    ax.set_xlabel("% of national output")

fig3.suptitle("Top five states, 2024–25", x=0.09, ha="left", fontsize=13, fontweight="semibold")
FIGS["03_states"] = fig3

# ── 5. The capacity gap ───────────────────────────────────────────────────────
fig4, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4.4),
                               gridspec_kw={"width_ratios": [1, 1.15]})

b = ax1.bar(vet_capacity.resource.str.replace(" ", "\n"), vet_capacity["count"],
            color=[BRICK, SLATE, OLIVE], width=0.55)
strip(ax1)
label_bars(ax1, b, "{:,.0f}")
ax1.set_ylim(0, 80000)
ax1.yaxis.set_major_formatter(FuncFormatter(lambda v, _: f"{v/1000:.0f}k"))
ax1.set_title("Animal health infrastructure")

birds_per_vet = flock_total * 1e6 / vets
b = ax2.barh(flock.segment, flock.million_birds, color=[MUSTARD, TEAL], height=0.45)
strip(ax2, x_grid=True)
label_bars(ax2, b, "{:.1f}", horizontal=True)
ax2.set_xlim(0, 700)
ax2.set_xlabel("million birds (2019 census)")
ax2.set_title("Flock the same workforce must cover")
ax2.text(0.99, 0.52, f"{birds_per_vet:,.0f} birds\nper registered vet",
         transform=ax2.transAxes, ha="right", va="center",
         fontsize=12.5, color=BRICK, fontweight="semibold")

FIGS["04_capacity"] = fig4

# ── 6. Market size — read the scope before you quote a number ────────────────
fig5, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4.4))

b = ax1.bar(market_scope.estimate, market_scope.usd_bn,
            color=[TEAL, GREY, GREY], width=0.55)
strip(ax1)
label_bars(ax1, b, "${:.2f}B")
ax1.set_ylim(0, 40)
ax1.tick_params(axis="x", labelsize=8.5)
ax1.set_ylabel("USD billion, 2025")
ax1.set_title("Same sector, three scopes")

ax2.fill_between(meat_path.year, meat_path.usd_bn, color=TEAL, alpha=0.16)
ax2.plot(meat_path.year, meat_path.usd_bn, color=TEAL, lw=2,
         marker="o", ms=4, mfc=TEAL, mec="white")
strip(ax2)
ax2.set_ylim(6, 9)
ax2.set_ylabel("USD billion")
ax2.set_title(f"Poultry meat value at {meat_cagr*100:.1f}% CAGR")
for (x, y), ha, dx in [((meat_path.year[0], meat_path.usd_bn[0]), "left", 6),
                       ((meat_path.year.iloc[-1], meat_path.usd_bn.iloc[-1]), "right", -6)]:
    ax2.annotate(f"${y:.2f}B", (x, y), textcoords="offset points",
                 xytext=(dx, 11), ha=ha, fontsize=9.5, color=INK, fontweight="semibold")

FIGS["05_market"] = fig5

# ── 7. Save everything ───────────────────────────────────────────────────────
out = Path("charts")
out.mkdir(exist_ok=True)
for name, f in FIGS.items():
    f.savefig(out / f"{name}.png")
    f.savefig(out / f"{name}.svg")
print(f"Saved {len(FIGS)} charts x2 formats to {out.resolve()}")
