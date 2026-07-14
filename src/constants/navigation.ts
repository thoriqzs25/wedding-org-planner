export interface NavItem {
  label: string;
  href: string;
  icon: string;
  subpages?: { label: string; pattern: string }[];
}

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: "dashboard" },
  {
    label: "Elemen Pernikahan",
    href: "/wedding-elements",
    icon: "checklist",
    subpages: [{ label: "Detail Elemen", pattern: "/wedding-elements/*" }],
  },
  { label: "Vendor Tracker", href: "/vendors", icon: "storefront" },
  {
    label: "Mood Board",
    href: "/mood-board",
    icon: "collections",
    subpages: [{ label: "Detail Mood Board", pattern: "/mood-board/*" }],
  },
  { label: "Invoice", href: "/invoices", icon: "receipt_long" },
  { label: "Kalender", href: "/calendar", icon: "calendar_month" },
  { label: "FAQ", href: "/faq", icon: "help" },
];

export function getMaintenanceCheckItems(): { label: string; path: string }[] {
  const items: { label: string; path: string }[] = [];
  for (const item of navItems) {
    items.push({ label: item.label, path: item.href });
    for (const sub of item.subpages ?? []) {
      items.push({ label: `${item.label} - ${sub.label}`, path: sub.pattern });
    }
  }
  return items;
}
