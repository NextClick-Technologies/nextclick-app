"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Building2,
  UserCog,
  Wallet,
  TrendingUp,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/cn";
import { UserMenu } from "@/shared/components/UserMenu";
import { useSidebar } from "@/shared/contexts";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

interface SectionNavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSection {
  section?: string;
  items: SectionNavItem[];
}

interface NavItemProps {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  isCollapsed?: boolean;
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
];

function NavItem({
  name,
  href,
  icon: Icon,
  isActive,
  isCollapsed = false,
}: NavItemProps) {
  const { closeMobile } = useSidebar();

  const linkContent = (
    <Link
      href={href}
      onClick={closeMobile}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "hover:bg-secondary hover:text-secondary-foreground",
        isCollapsed && "justify-center px-2"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!isCollapsed && <span>{name}</span>}
    </Link>
  );

  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {name}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return linkContent;
}

export function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleCollapse } = useSidebar();

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
          <div className="flex w-full items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground">
              <span className="text-sm font-bold">NC</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapse}
              className="h-10 w-10"
            >
              <PanelLeftClose className="h-6 w-6" />
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            className="h-10 w-10"
          >
            <PanelLeftOpen className="h-6 w-6" />
          </Button>
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
