import Link from "next/link";
import { cn } from "@/utils/cn";
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
        isActive
          ? "bg-primary text-primary-foreground"
          : "hover:bg-secondary hover:text-secondary-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      {name}
    </Link>
  );
}
