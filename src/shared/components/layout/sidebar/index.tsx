"use client";

import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Building2,
  UserCog,
  Wallet,
  TrendingUp,
  FileText,
  Search,
  Package,
  CreditCard,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { NavItem } from "./NavItem";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { UserMenu } from "@/components/UserMenu";
import { useSidebar } from "@/contexts";

interface SectionNavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSection {
  section?: string;
  items: SectionNavItem[];
}

const navigation: NavSection[] = [
  {
    items: [{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    section: "Client Management",
    items: [
      { name: "Clients", href: "/clients", icon: Users },
      { name: "Projects", href: "/projects", icon: FolderKanban },
      { name: "Companies", href: "/companies", icon: Building2 },
    ],
  },
  {
    section: "HR Management",
    items: [
      { name: "Employees", href: "/employees", icon: UserCog },
      { name: "Payroll", href: "/payroll", icon: Wallet },
      { name: "Performance", href: "/performance", icon: TrendingUp },
    ],
  },
  {
    section: "Others",
    items: [
      { name: "Document Center", href: "/documents", icon: FileText },
      { name: "Research Hub", href: "/research", icon: Search },
      { name: "Service Catalog", href: "/services", icon: Package },
      { name: "Billing Management", href: "/billing", icon: CreditCard },
      { name: "Service Management", href: "/service-mgmt", icon: Settings },
      { name: "Security Center", href: "/security", icon: Shield },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed } = useSidebar();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-card transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div
        className={cn(
          "flex h-16 items-center border-b px-6",
          isCollapsed && "justify-center px-0"
        )}
      >
        {!isCollapsed ? (
          <>
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground">
              <span className="text-sm font-bold">NC</span>
            </div>
            <div className="ml-2">
              <h1 className="text-sm font-semibold">Next Click ERP</h1>
            </div>
          </>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground">
            <span className="text-sm font-bold">NC</span>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navigation.map((section, idx) => (
          <div key={idx} className={cn(idx > 0 && "mt-6")}>
            {section.section && !isCollapsed && (
              <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                {section.section}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavItem
                  key={item.href}
                  name={item.name}
                  href={item.href}
                  icon={item.icon}
                  isActive={pathname === item.href}
                  isCollapsed={isCollapsed}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <UserMenu isCollapsed={isCollapsed} />
    </aside>
  );
}
