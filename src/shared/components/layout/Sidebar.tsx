"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Building2,
  UserCog,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/cn";
import { UserMenu } from "@/shared/components/UserMenu";
import { useSidebar } from "@/shared/contexts";
import { usePermissions } from "@/shared/hooks/usePermissions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface SectionNavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: string; // Resource permission needed (e.g., 'clients', 'employees')
}

interface NavSection {
  section?: string;
  items: SectionNavItem[];
}

interface NavItemProps {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
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
      {
        name: "Projects",
        href: "/projects",
        icon: FolderKanban,
      },
      {
        name: "Companies",
        href: "/companies",
        icon: Building2,
      },
    ],
  },
  {
    section: "HR Management",
    items: [
      {
        name: "Employees",
        href: "/employees",
        icon: UserCog,
        permission: "employees",
      },
    ],
  },
];

function SidebarItemSkeleton({
  isCollapsed = false,
}: {
  isCollapsed?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5",
        isCollapsed && "justify-center px-2"
      )}
    >
      <Skeleton className="h-4 w-4 shrink-0" />
      {!isCollapsed && <Skeleton className="h-4 flex-1" />}
    </div>
  );
}

function NavItem({
  name,
  href,
  icon: Icon,
  isCollapsed = false,
}: NavItemProps) {
  const { closeMobile } = useSidebar();
  const pathname = usePathname();

  // Check if current pathname starts with the href (for nested routes)
  const isActiveRoute = pathname === href || pathname.startsWith(href + "/");

  const linkContent = (
    <Link
      href={href}
      onClick={closeMobile}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        isActiveRoute
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
  const { isCollapsed, toggleCollapse, closeMobile } = useSidebar();
  const { canRead, isLoading } = usePermissions();

  // Split navigation into public and permission-gated
  const publicNavigation = navigation
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => !item.permission), // Items WITHOUT permission
    }))
    .filter((section) => section.items.length > 0);

  const permissionGatedNavigation = navigation
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => item.permission), // Items WITH permission
    }))
    .filter((section) => section.items.length > 0);

  // Filter permission-gated items (only if not loading)
  const filteredPermissionNavigation = isLoading
    ? []
    : permissionGatedNavigation
        .map((section) => ({
          ...section,
          items: section.items.filter((item) => canRead(item.permission!)),
        }))
        .filter((section) => section.items.length > 0);

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-card",
        "w-full lg:w-56 lg:transition-all lg:duration-300",
        isCollapsed && "lg:w-16"
      )}
    >
      <div
        className={cn(
          "flex h-16 items-center border-b px-6",
          isCollapsed && "lg:justify-center lg:px-0"
        )}
      >
        {!isCollapsed ? (
          <div className="flex w-full items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground">
              <span className="text-sm font-bold">NC</span>
            </div>
            {/* Mobile close button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={closeMobile}
              className="h-10 w-10 lg:hidden"
            >
              <X className="h-6 w-6" />
            </Button>
            {/* Desktop collapse toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapse}
              className="hidden h-10 w-10 lg:flex"
            >
              <PanelLeftClose className="h-6 w-6" />
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            className="hidden h-10 w-10 lg:flex"
          >
            <PanelLeftOpen className="h-6 w-6" />
          </Button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {/* Render public navigation (always visible) */}
        {publicNavigation.map((section, idx) => (
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
                  isCollapsed={isCollapsed}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Render permission-gated navigation or skeleton */}
        {permissionGatedNavigation.map((section, idx) => (
          <div key={`permission-${idx}`} className="mt-6">
            {section.section && !isCollapsed && (
              <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                {section.section}
              </h3>
            )}
            <div className="space-y-1">
              {isLoading
                ? // Show skeleton while loading
                  section.items.map((item, itemIdx) => (
                    <SidebarItemSkeleton
                      key={itemIdx}
                      isCollapsed={isCollapsed}
                    />
                  ))
                : // Show filtered items after loading
                  filteredPermissionNavigation
                    .find((s) => s.section === section.section)
                    ?.items.map((item) => (
                      <NavItem
                        key={item.href}
                        name={item.name}
                        href={item.href}
                        icon={item.icon}
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
