import { BookOpenCheck, FolderOpen, LayoutDashboard, UserRound, Users } from "lucide-react";

export const NAV_GROUPS = [
  {
    label: "Study",
    items: [
      { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
      { href: "/dashboard/workspace", label: "My workspace", icon: FolderOpen },
      { href: "/dashboard/pyqs", label: "PYQ library", icon: BookOpenCheck },
    ],
  },
  {
    label: "People",
    items: [
      { href: "/dashboard/community", label: "Community", icon: Users },
      { href: "/dashboard/profile", label: "My profile", icon: UserRound },
    ],
  },
];

export function isActive(pathname, item) {
  return item.exact ? pathname === item.href : pathname.startsWith(item.href);
}

export function currentNavItem(pathname) {
  for (const group of NAV_GROUPS) {
    const match = group.items.find((item) => isActive(pathname, item));
    if (match) return match;
  }
  return null;
}
