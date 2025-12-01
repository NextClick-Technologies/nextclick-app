import Link from "next/link";
import { cn } from "@/shared/utils/cn";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { useSidebar } from "@/shared/contexts";

interface NavItemProps {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  isCollapsed?: boolean;
}

export function NavItem({
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
