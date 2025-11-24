"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserCog,
  FileText,
  Search,
  Package,
  CreditCard,
  Settings,
  Shield,
} from "lucide-react";
import { NavItem } from "./NavItem";
import { CollapsibleNavItem } from "./CollapsibleNavItem";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    name: "Client Management",
    icon: Users,
    submenu: [
      { name: "Companies", href: "/companies" },
      { name: "Clients", href: "/clients" },
      { name: "Projects", href: "/projects" },
    ],
  },
  { name: "HR Management", href: "/hr", icon: UserCog },
  { name: "Document Center", href: "/documents", icon: FileText },
  { name: "Research Hub", href: "/research", icon: Search },
  { name: "Service Catalog", href: "/services", icon: Package },
  { name: "Billing Management", href: "/billing", icon: CreditCard },
  { name: "Service Management", href: "/service-mgmt", icon: Settings },
  { name: "Security Center", href: "/security", icon: Shield },
];

export function Sidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  // Auto-open menu when navigating to a page within a collapsible section
  useEffect(() => {
    navigation.forEach((item) => {
      if ("submenu" in item && item.submenu) {
        const hasActiveChild = item.submenu.some(
          (sub) => pathname === sub.href
        );
        if (hasActiveChild) {
          setOpenMenus((prev) => {
            if (!prev.includes(item.name)) {
              return [...prev, item.name];
            }
            return prev;
          });
        }
      }
    });
  }, [pathname]);

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col border-r bg-card">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground">
          <span className="text-sm font-bold">NC</span>
        </div>
        <div>
          <h1 className="text-sm font-semibold">Next Click ERP</h1>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {navigation.map((item) => {
          if ("submenu" in item && item.submenu) {
            return (
              <CollapsibleNavItem
                key={item.name}
                name={item.name}
                icon={item.icon}
                submenu={item.submenu}
                isOpen={openMenus.includes(item.name)}
                pathname={pathname}
                onToggle={() => toggleMenu(item.name)}
              />
            );
          }

          if ("href" in item && item.href) {
            return (
              <NavItem
                key={item.name}
                name={item.name}
                href={item.href}
                icon={item.icon}
                isActive={pathname === item.href}
              />
            );
          }

          return null;
        })}
      </nav>
    </aside>
  );
}
