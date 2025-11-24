"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  UserCog,
  FileText,
  Briefcase,
  Search,
  Package,
  CreditCard,
  Settings,
  Shield,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Client Management", href: "/clients", icon: Users },
  { name: "HR Management", href: "/hr", icon: UserCog },
  { name: "Document Center", href: "/documents", icon: FileText },
  { name: "Project Management", href: "/projects", icon: Briefcase },
  { name: "Research Hub", href: "/research", icon: Search },
  { name: "Service Catalog", href: "/services", icon: Package },
  { name: "Billing Management", href: "/billing", icon: CreditCard },
  { name: "Service Management", href: "/service-mgmt", icon: Settings },
  { name: "Security Center", href: "/security", icon: Shield },
];

export function Sidebar() {
  const pathname = usePathname();

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
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
