import Link from "next/link";
import { cn } from "@/lib/utils";
import { LucideIcon, ChevronDown, ChevronRight } from "lucide-react";

interface Submenu {
  name: string;
  href: string;
}

interface CollapsibleNavItemProps {
  name: string;
  icon: LucideIcon;
  submenu: Submenu[];
  isOpen: boolean;
  pathname: string;
  onToggle: () => void;
}

export function CollapsibleNavItem({
  name,
  icon: Icon,
  submenu,
  isOpen,
  pathname,
  onToggle,
}: CollapsibleNavItemProps) {
  const hasActiveChild = submenu.some((sub) => pathname === sub.href);

  return (
    <div>
      <button
        onClick={onToggle}
        className={cn(
          "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          hasActiveChild
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground hover:bg-accent/30 hover:text-accent-foreground"
        )}
      >
        <div className="flex items-center gap-3">
          <Icon className="h-4 w-4" />
          {name}
        </div>
        {isOpen ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>
      {isOpen && (
        <div className="ml-6 mt-1 space-y-1">
          {submenu.map((subItem) => {
            const isActive = pathname === subItem.href;
            return (
              <Link
                key={subItem.href}
                href={subItem.href}
                className={cn(
                  "block rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "nav-item-active font-medium"
                    : "text-muted-foreground nav-item-hover"
                )}
              >
                {subItem.name}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
