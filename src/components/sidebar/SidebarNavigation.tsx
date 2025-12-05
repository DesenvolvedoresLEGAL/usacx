import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/contexts/PermissionsContext";
import { useSidebar } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { sidebarNavigation, type SidebarNavItem, type SidebarNavGroup } from "@/data/sidebarNavigation";
import { useState, useEffect } from "react";

interface NavItemProps {
  item: SidebarNavItem;
  isActive: boolean;
  isCollapsed: boolean;
}

function NavItem({ item, isActive, isCollapsed }: NavItemProps) {
  const Icon = item.icon;

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to={item.href}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg mx-auto transition-all duration-200",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            )}
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-2">
          <span>{item.title}</span>
          {item.badge && (
            <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
              {item.badge}
            </span>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Link
      to={item.href}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
      )}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.5} />
      <span className="truncate">{item.title}</span>
      {item.badge && (
        <span
          className={cn(
            "ml-auto rounded px-1.5 py-0.5 text-[10px] font-medium",
            isActive
              ? "bg-primary-foreground/20 text-primary-foreground"
              : "bg-primary/10 text-primary"
          )}
        >
          {item.badge}
        </span>
      )}
    </Link>
  );
}

interface NavGroupProps {
  group: SidebarNavGroup;
  isCollapsed: boolean;
  openGroupId: string | null;
  onToggle: (id: string) => void;
}

function NavGroup({ group, isCollapsed, openGroupId, onToggle }: NavGroupProps) {
  const location = useLocation();
  const { hasPermission } = usePermissions();
  const Icon = group.icon;

  const visibleItems = group.items.filter(
    (item) => !item.permission || hasPermission(item.permission)
  );

  if (visibleItems.length === 0) return null;

  const isGroupActive = visibleItems.some((item) =>
    location.pathname.startsWith(item.href)
  );
  const isOpen = openGroupId === group.id || isGroupActive;

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => onToggle(group.id)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg mx-auto transition-all duration-200",
              isGroupActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            )}
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="p-0">
          <div className="min-w-[180px] p-2">
            <p className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
              {group.title}
            </p>
            <div className="space-y-1">
              {visibleItems.map((item) => {
                const isActive = location.pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                  >
                    <item.icon className="h-4 w-4" strokeWidth={1.5} />
                    {item.title}
                  </Link>
                );
              })}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={() => onToggle(group.id)}>
      <CollapsibleTrigger
        className={cn(
          "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200",
          isGroupActive
            ? "text-sidebar-foreground"
            : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
        )}
      >
        <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.5} />
        <span className="flex-1 truncate text-left">{group.title}</span>
        <ChevronRight
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-90"
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        <div className="ml-4 mt-1 space-y-1 border-l border-sidebar-border pl-3">
          {visibleItems.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-[13px] transition-all duration-200",
                  isActive
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                <span className="truncate">{item.title}</span>
                {item.badge && (
                  <span className="ml-auto rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function SidebarNavigation() {
  const location = useLocation();
  const { hasPermission } = usePermissions();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [openGroupId, setOpenGroupId] = useState<string | null>(null);

  // Auto-expand group based on current route
  useEffect(() => {
    const activeGroup = sidebarNavigation.groups.find((group) =>
      group.items.some((item) => location.pathname.startsWith(item.href))
    );
    if (activeGroup) {
      setOpenGroupId(activeGroup.id);
    }
  }, [location.pathname]);

  const handleToggle = (id: string) => {
    setOpenGroupId((prev) => (prev === id ? null : id));
  };

  // Filter quick actions by permission
  const visibleQuickActions = sidebarNavigation.quickActions.filter(
    (item) => !item.permission || hasPermission(item.permission)
  );

  return (
    <nav className="flex flex-col gap-1 px-2">
      {/* Quick Actions (Dashboard, Atendimentos) */}
      <div className="space-y-1">
        {visibleQuickActions.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href !== "/dashboard" && location.pathname.startsWith(item.href));
          return (
            <NavItem
              key={item.href}
              item={item}
              isActive={isActive}
              isCollapsed={isCollapsed}
            />
          );
        })}
      </div>

      {/* Separator */}
      <div className={cn("my-2", isCollapsed ? "mx-auto w-6" : "mx-1")}>
        <div className="h-px bg-sidebar-border" />
      </div>

      {/* Grouped Navigation */}
      <div className="space-y-1">
        {sidebarNavigation.groups.map((group) => (
          <NavGroup
            key={group.id}
            group={group}
            isCollapsed={isCollapsed}
            openGroupId={openGroupId}
            onToggle={handleToggle}
          />
        ))}
      </div>

      {/* Bottom Items (Help) */}
      {sidebarNavigation.bottomItems.length > 0 && (
        <>
          <div className={cn("my-2", isCollapsed ? "mx-auto w-6" : "mx-1")}>
            <div className="h-px bg-sidebar-border" />
          </div>
          <div className="space-y-1">
            {sidebarNavigation.bottomItems.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <NavItem
                  key={item.href}
                  item={item}
                  isActive={isActive}
                  isCollapsed={isCollapsed}
                />
              );
            })}
          </div>
        </>
      )}
    </nav>
  );
}
