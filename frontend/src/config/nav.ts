import {
  LayoutDashboard,
  Bot,
  ScanSearch,
  Sprout,
  CloudSun,
  BarChart3,
  Store,
  Warehouse,
  Wheat,
  Pill,
  Syringe,
  Landmark,
  Stethoscope,
  GraduationCap,
  Users,
  Wallet,
  FileText,
  Bell,
  Settings,
  CircleUser,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: "new" | "beta";
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

/** Main navigation, grouped by purpose for clarity. */
export const navigation: NavSection[] = [
  {
    label: "nav.groups",
    items: [
      { title: "nav.dashboard", href: "/dashboard", icon: LayoutDashboard },
      { title: "nav.farm", href: "/inventory", icon: Warehouse },
    ],
  },
  {
    label: "nav.insights",
    items: [
      { title: "nav.assistant", href: "/assistant", icon: Bot, badge: "new" },
      { title: "nav.diagnosis", href: "/diagnosis", icon: ScanSearch },
      { title: "nav.weather", href: "/weather", icon: CloudSun },
      { title: "nav.analytics", href: "/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "nav.groups",
    items: [
      { title: "nav.marketplace", href: "/marketplace", icon: Store },
      { title: "nav.feed", href: "/feed", icon: Wheat },
      { title: "nav.medicine", href: "/medicine", icon: Pill },
      { title: "nav.vaccination", href: "/vaccination", icon: Syringe },
      { title: "nav.schemes", href: "/schemes", icon: Landmark },
    ],
  },
  {
    label: "nav.support",
    items: [
      { title: "nav.vets", href: "/vets", icon: Stethoscope },
      { title: "nav.learning", href: "/learning", icon: GraduationCap },
      { title: "nav.community", href: "/community", icon: Users },
      { title: "nav.finance", href: "/finance", icon: Wallet },
    ],
  },
  {
    label: "nav.support",
    items: [
      { title: "nav.reports", href: "/reports", icon: FileText },
      { title: "nav.notifications", href: "/notifications", icon: Bell },
      { title: "nav.settings", href: "/settings", icon: Settings },
      { title: "nav.profile", href: "/profile", icon: CircleUser },
    ],
  },
];

/** Flattened list for the command palette and search. */
export const allNavItems: NavItem[] = navigation.flatMap((section) => section.items);

/** Primary nav items surfaced in the mobile dock. */
export const dockItems: NavItem[] = [
  { title: "nav.dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "nav.assistant", href: "/assistant", icon: Bot },
  { title: "nav.diagnosis", href: "/diagnosis", icon: ScanSearch },
  { title: "nav.marketplace", href: "/marketplace", icon: Store },
  { title: "nav.settings", href: "/settings", icon: Settings },
];