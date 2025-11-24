import Link from "next/link";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface NavItemProps {
  name: string;
  href: string;
  icon: LucideIcon;
  isActive: boolean;
}

export function NavItem({ name, href, icon: Icon, isActive }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
        isActive ? "nav-item-active" : "text-muted-foreground nav-item-hover"
      )}
    >
      <Icon className="h-4 w-4" />
      {name}
    </Link>
  );
}
