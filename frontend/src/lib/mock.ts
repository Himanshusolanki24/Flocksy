/**
 * Curated in-memory data used to render every feature end-to-end.
 *
 * The live backend exposes a subset of endpoints (auth, dashboard, diagnosis,
 * vets, farms, users). Features without a backend endpoint — weather, market,
 * finance, learning, community, schemes, inventory, feed, medicine,
 * vaccination, reports, notifications — gracefully fall back to these
 * realistic Indian-farm datasets so the product is fully demonstrable and
 * investor-ready today, and can be wired to real APIs later.
 */
import type {
  AppNotification,
  CommunityPost,
  FeedBatch,
  FinanceSummary,
  GovernmentScheme,
  InventoryItem,
  Lesson,
  MarketPrice,
  Medicine,
  Transaction,
  TrendPoint,
  Vet,
  Vaccination,
  WeatherData,
} from "@/types";

export const mockDashboard = () => {
  return {
    activeAlerts: 2,
    healthyBirdRatio: 91.4,
    feedEfficiency: 87.9,
    pendingTreatments: 5,
    recentDetections: [
      { disease: "Coccidiosis", confidence: 0.82, timestamp: new Date().toISOString() },
      { disease: "Marek's Disease", confidence: 0.94, timestamp: new Date(Date.now() - 864e5 * 2).toISOString() },
    ],
    stats: [
      { label: "Active Flocks", value: "12", subtext: "+2 this week", trend: "up" },
      { label: "Birds", value: "2,400", subtext: "broilers + layers", trend: "up" },
      { label: "Egg Production", value: "1,850 eggs/day", subtext: "+45 vs yesterday", trend: "up" },
      { label: "Profit (30d)", value: "₹1,84,500", subtext: "+12% vs last month", trend: "up" },
    ],
    alerts: [
      {
        id: "alert-1",
        title: "Temperature Alert — Coop 3",
        badge: "Critical",
        note: "Temperature above threshold",
        severity: "critical",
        timestamp: new Date().toISOString(),
        actionRequired: true,
        category: "environment",
      },
      {
        id: "alert-2",
        title: "Feed low — Broiler batch B",
        badge: "Warning",
        note: "Stock below 20%",
        severity: "warning",
        timestamp: new Date(Date.now() - 36e5).toISOString(),
        actionRequired: false,
        category: "feed",
      },
      {
        id: "alert-3",
        title: "Egg price up in Nashik",
        badge: "Info",
        note: "+₹2.50 per dozen",
        severity: "info",
        timestamp: new Date(Date.now() - 72e5).toISOString(),
        actionRequired: false,
        category: "market",
      },
    ],
    tasks: [
      {
        id: "task-1",
        title: "Vaccination — Newcastle, Coop 1",
        priority: "high",
        completed: false,
        category: "health",
        dueDate: new Date(Date.now() + 36e5).toISOString(),
      },
      {
        id: "task-2",
        title: "Re-order feed (Grower)",
        priority: "medium",
        completed: false,
        category: "feed",
        dueDate: new Date(Date.now() + 4 * 36e5).toISOString(),
      },
      {
        id: "task-3",
        title: "Collect morning eggs",
        priority: "low",
        completed: true,
        category: "farm",
        dueDate: new Date().toISOString(),
      },
    ],
    weeklyTrend: [
      { day: "Mon", value: 85 },
      { day: "Tue", value: 88 },
      { day: "Wed", value: 92 },
      { day: "Thu", value: 90 },
      { day: "Fri", value: 94 },
      { day: "Sat", value: 91 },
    ],
    activities: [
      { id: "a1", title: "Health check completed", meta: "Coop 1", timestamp: new Date().toISOString(), type: "health" },
      { id: "a2", title: "Sold 20 dozen eggs", meta: "Nashik mandi", timestamp: new Date(Date.now() - 2 * 36e5).toISOString(), type: "sale" },
      { id: "a3", title: "Feed batch added", meta: "Layer mash, 500 kg", timestamp: new Date(Date.now() - 5 * 36e5).toISOString(), type: "note" },
    ],
    chartData: [
      { label: "Feed", value: 45, color: "var(--chart-1)", description: "Feed costs & efficiency" },
      { label: "Health", value: 26, color: "var(--chart-2)", description: "Vet & medicine" },
      { label: "Labor", value: 18, color: "var(--chart-3)", description: "On-site labor" },
      { label: "Other", value: 11, color: "var(--chart-4)", description: "Utilities & misc" },
    ],
  };
};

export const mockVets: Vet[] = [
  {
    id: "vet-1",
    name: "Dr. Ananya Kulkarni",
    specialty: "Poultry pathology",
    city: "Pune",
    availability: "Within 4 hours",
    rating: 4.9,
    online: true,
    experience: "12 years",
    languages: ["Hindi", "English", "Marathi"],
  },
  {
    id: "vet-2",
    name: "Dr. Raghav Menon",
    specialty: "Broiler nutrition & flock management",
    city: "Hyderabad",
    availability: "Tomorrow morning",
    rating: 4.8,
    online: true,
    experience: "9 years",
    languages: ["Hindi", "English", "Telugu"],
  },
  {
    id: "vet-3",
    name: "Dr. Sunita Rathore",
    specialty: "Poultry disease & avian pathology",
    city: "Jaipur",
    availability: "Today, 4 PM",
    rating: 4.7,
    online: false,
    experience: "15 years",
    languages: ["Hindi", "English", "Rajasthani"],
  },
  {
    id: "vet-4",
    name: "Dr. Vikram Deshmukh",
    specialty: "Commercial layer flock & egg yield",
    city: "Nashik",
    availability: "Available now",
    rating: 4.9,
    online: true,
    experience: "11 years",
    languages: ["Hindi", "English", "Marathi"],
  },
  {
    id: "vet-5",
    name: "Dr. Harpreet Singh",
    specialty: "Poultry biosecurity & shed climate",
    city: "Ludhiana",
    availability: "Today, 6 PM",
    rating: 4.8,
    online: true,
    experience: "14 years",
    languages: ["Hindi", "English", "Punjabi"],
  },
];

export const mockFarms = [
  {
    id: "farm-demo-1",
    name: "Green Coop Farm",
    location: "Nashik, Maharashtra",
    flockSize: 2400,
    houseCount: 3,
    farmType: "poultry",
  },
];

const hour = (index: number) => {
  const d = new Date(Date.now());
  d.setHours(0, 0, 0, 0);
  d.setHours((8 + index) % 24);
  return d;
};

export const mockWeatherData: WeatherData = {
  location: "Nashik, Maharashtra",
  tempC: 29,
  feelsLikeC: 31,
  humidity: 58,
  windKph: 12,
  uvIndex: 7,
  precipitationChance: 20,
  sunrise: "05:54",
  sunset: "19:03",
  condition: "partly-cloudy",
  hourly: Array.from({ length: 12 }, (_, i) => {
    const m = hour(i);
    return {
      time: m.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      tempC: 24 + Math.round(Math.sin(i / 3) * 6),
      condition: i > 6 ? "light-rain" : "partly-cloudy",
      precipitationChance: i > 6 ? 45 : 15,
    };
  }),
  daily: Array.from({ length: 7 }, (_, i) => {
    const label = new Date(Date.now() + i * 864e5).toLocaleDateString("en-IN", {
      weekday: "short",
    });
    return {
      date: label,
      maxTempC: 31 + (i % 3),
      minTempC: 22 - (i % 2),
      condition: i === 2 ? "thunderstorm" : i === 4 ? "light-rain" : "sunny",
      precipitationChance: i === 2 ? 70 : i === 4 ? 40 : 10,
    };
  }),
  alerts: [
    { id: "w1", type: "heat", message: "Heat stress risk for poultry this afternoon. Provide shading and extra water." },
    { id: "w2", type: "rain", message: "Light rain expected after 5 PM. Keep feed stores and drains covered." },
  ],
};

export const mockMarketPrices: MarketPrice[] = [
  { id: "m1", commodity: "Table Eggs", unit: "tray (30)", price: 165, mandi: "Nashik", changePct: 3.2, trend: mkTrend([155, 158, 160, 159, 162, 165]) },
  { id: "m2", commodity: "Broiler live weight", unit: "kg", price: 92, mandi: "Pune", changePct: -0.8, trend: mkTrend([95, 94, 93, 91, 92, 92]) },
  { id: "m3", commodity: "Desi / Country Bird", unit: "kg", price: 240, mandi: "Nashik", changePct: 2.1, trend: mkTrend([230, 232, 235, 238, 240, 240]) },
  { id: "m4", commodity: "Culled Layer Birds", unit: "kg", price: 78, mandi: "Mumbai", changePct: 1.4, trend: mkTrend([74, 75, 76, 77, 78, 78]) },
  { id: "m5", commodity: "Day-Old Broiler Chicks", unit: "chick", price: 34, mandi: "Hatchery (Nashik)", changePct: 0.0, trend: mkTrend([34, 34, 34, 34, 34]) },
];

export const mockInventory: InventoryItem[] = [
  { id: "i1", name: "Grower Feed", category: "feed", quantity: 120, unit: "kg", stockStatus: "low-stock", updatedAt: new Date().toISOString() },
  { id: "i2", name: "Layer Mash", category: "feed", quantity: 450, unit: "kg", stockStatus: "in-stock", updatedAt: new Date().toISOString() },
  { id: "i3", name: "Multivitamin", category: "medicine", quantity: 8, unit: "units", stockStatus: "in-stock", updatedAt: new Date().toISOString() },
  { id: "i4", name: "Drinking troughs", category: "equipment", quantity: 24, unit: "units", stockStatus: "in-stock", updatedAt: new Date().toISOString() },
  { id: "i5", name: "Dewormer", category: "medicine", quantity: 0, unit: "units", stockStatus: "out-of-stock", updatedAt: new Date().toISOString() },
];

export const mockFeedBatches: FeedBatch[] = [
  { id: "f1", brand: "Godrej Grower", type: "grower", weightKg: 500, cost: 15800, purchaseDate: new Date().toISOString(), expiryDate: new Date(Date.now() + 45 * 864e5).toISOString(), qualityScore: 92, avgDailyConsumptionKg: 120, daysLeft: 6 },
  { id: "f2", brand: "CP Layer", type: "layer", weightKg: 500, cost: 16900, purchaseDate: new Date(Date.now() - 10 * 864e5).toISOString(), expiryDate: new Date(Date.now() + 20 * 864e5).toISOString(), qualityScore: 88, avgDailyConsumptionKg: 95, daysLeft: 28 },
  { id: "f3", brand: "Poultry Plus Finisher", type: "finisher", weightKg: 250, cost: 8100, purchaseDate: new Date(Date.now() - 3 * 864e5).toISOString(), expiryDate: new Date(Date.now() + 60 * 864e5).toISOString(), qualityScore: 91, avgDailyConsumptionKg: 60, daysLeft: 4 },
];

export const mockMedicines: Medicine[] = [
  { id: "med1", name: "CocciCare Plus", batchNo: "CC241A", dose: "10 ml / 5 L water", schedule: "Daily × 3 days", stock: "Active", cost: 420, withdrawalDays: 5, course: "active", nextDoseAt: new Date(Date.now() + 8 * 36e5).toISOString() },
  { id: "med2", name: "Dewormer Suspension", batchNo: "DW-88", dose: "2 ml / kg", schedule: "Every 45 days", stock: "Out", cost: 260, withdrawalDays: 7, course: "completed" },
  { id: "med3", name: "Electrolyte Powder", batchNo: "EL-12", dose: "20 g / 10 L", schedule: "After stress", stock: "Active", cost: 150, withdrawalDays: 0, course: "active" },
];

export const mockVaccinations: Vaccination[] = [
  { id: "v1", vaccine: "Newcastle — Lasota", flock: "Batch A (Broiler)", ageDays: 18, dueDate: new Date(Date.now() + 2 * 864e5).toISOString(), status: "scheduled" },
  { id: "v2", vaccine: "IBD (Gumboro)", flock: "Batch B (Layer)", ageDays: 14, dueDate: new Date(Date.now() - 1 * 864e5).toISOString(), status: "overdue" },
  { id: "v3", vaccine: "Marek's Disease", flock: "Batch A (Broiler)", ageDays: 1, dueDate: new Date(Date.now() - 16 * 864e5).toISOString(), status: "completed" },
  { id: "v4", vaccine: "Fowl Pox", flock: "Batch C", ageDays: 60, dueDate: new Date(Date.now() + 9 * 864e5).toISOString(), status: "scheduled" },
];

export const mockSchemes: GovernmentScheme[] = [
  { id: "s1", title: "National Livestock Mission (NLM) — Poultry", ministry: "MoFAHD", category: "poultry", benefit: "Up to ₹25L capital subsidy (50%)", eligibility: "Broiler/Layer poultry farmers (1000+ birds)", deadline: "31 Mar 2026", applyUrl: "#", open: true },
  { id: "s2", title: "Poultry Venture Capital Fund (PVCF)", ministry: "NABARD", category: "subsidy", benefit: "25% back-ended capital subsidy", eligibility: "Individual poultry farmers and SHGs", deadline: "Open year-round", applyUrl: "#", open: true },
  { id: "s3", title: "Kisan Credit Card (Poultry / Animal Husbandry)", ministry: "NABARD", category: "loan", benefit: "Working capital loan up to ₹2L at 4%", eligibility: "All registered poultry farmers", applyUrl: "#", open: true },
  { id: "s4", title: "Comprehensive Poultry Insurance Scheme", ministry: "MoA&FW", category: "insurance", benefit: "Bird mortality risk coverage at 2.5% premium", eligibility: "Commercial broiler & layer flocks", applyUrl: "#", open: true },
  { id: "s5", title: "Poultry Shed Solar & Environmental Control Subsidy", ministry: "MNRE", category: "subsidy", benefit: "40% subsidy for solar exhaust fans & cooling pads", eligibility: "Registered poultry sheds", applyUrl: "#", open: true },
];

export const mockLessons: Lesson[] = [
  { id: "l1", title: "Day-old chick care basics", category: "poultry", durationMin: 6, level: "beginner", completed: true, points: 20 },
  { id: "l2", title: "Feed conversion for broilers", category: "poultry", durationMin: 8, level: "intermediate", completed: false, points: 30 },
  { id: "l3", title: "Biosecurity and farm sanitization", category: "biosecurity", durationMin: 7, level: "intermediate", completed: false, points: 25 },
  { id: "l4", title: "Poultry farm accounting & profits", category: "finance", durationMin: 10, level: "beginner", completed: false, points: 40 },
  { id: "l5", title: "Managing heat stress in poultry sheds", category: "health", durationMin: 9, level: "advanced", completed: false, points: 35 },
];

export const mockFinance: FinanceSummary = {
  balance: 284500,
  income: 532000,
  expense: 247500,
  monthlyTrend: mkTrend([210, 240, 260, 255, 300, 320]),
};

export const mockTransactions: Transaction[] = [
  { id: "t1", type: "income", amount: 1240, category: "sellEggs", note: "20 dozen @ Nashik", date: new Date().toISOString() },
  { id: "t2", type: "expense", amount: 1580, category: "feedPurchase", note: "Grower feed 50 kg", date: new Date().toISOString() },
  { id: "t3", type: "expense", amount: 640, category: "vetVisit", note: "Coop 1 health check", date: new Date(Date.now() - 864e5).toISOString() },
  { id: "t4", type: "income", amount: 3240, category: "sellBirds", note: "36 broilers @ ₹90/kg", date: new Date(Date.now() - 864e5).toISOString() },
];

export const mockTestimonials = [
  { quoteKey: "landing.testimonial1", nameKey: "landing.testimonial1Name", roleKey: "landing.testimonial1Role", initials: "RP" },
  { quoteKey: "landing.testimonial2", nameKey: "landing.testimonial2Name", roleKey: "landing.testimonial2Role", initials: "SD" },
  { quoteKey: "landing.testimonial3", nameKey: "landing.testimonial3Name", roleKey: "landing.testimonial3Role", initials: "GS" },
];

/** Derive a labelled trend series from raw values. */
function mkTrend(values: number[]): TrendPoint[] {
  return values.map((value, i) => ({
    day: `D${i + 1}`,
    value,
  }));
}

export const mockSparkline = [2, 4, 3, 5, 4, 6, 7, 6, 8, 7, 9];

export const mockNotifications: AppNotification[] = [
  { id: "n1", type: "alert", title: "Temperature high in Coop 3", body: "Current 34°C, threshold 30°C. Increase ventilation.", timestamp: new Date().toISOString(), read: false },
  { id: "n2", type: "reminder", title: "Vaccination due", body: "Batch B — IBD (Gumboro) is overdue by 1 day.", timestamp: new Date(Date.now() - 36e5).toISOString(), read: false },
  { id: "n3", type: "market", title: "Egg price up", body: "Nashik mandi price rose by ₹2.50/dozen.", timestamp: new Date(Date.now() - 72e5).toISOString(), read: true },
  { id: "n4", type: "system", title: "Offline data synced", body: "Your farm records were updated.", timestamp: new Date(Date.now() - 26 * 36e5).toISOString(), read: true },
];

export const mockCommunityPosts: CommunityPost[] = [
  { id: "c1", author: "Suresh Kumar", content: "My broiler chicks are huddling since morning. Is it a cold stress or something else?", likes: 24, replies: 6, timeAgo: "2h", tag: "Poultry", live: true },
  { id: "c2", author: "Meena Joshi", content: "Sharing: Raised layer feed conversion 12% by switching to morning feeding only. Try it!", likes: 58, replies: 14, timeAgo: "6h", tag: "Feed" },
  { id: "c3", author: "Arjun Verma", content: "Anyone tried the new Kisan Credit Card scheme online? Need help with documents.", likes: 12, replies: 9, timeAgo: "1d", tag: "Schemes" },
];