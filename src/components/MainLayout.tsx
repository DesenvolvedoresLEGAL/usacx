
import { Fragment, useMemo } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Bell, HelpCircleIcon, LogOut, Menu as MenuIcon, MessageSquare, Settings, UserCircle } from "lucide-react";
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { matchNavigationItem, navigationGroups } from "@/data/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MainLayout = () => {
  const location = useLocation();
  const { user, profile, signOut } = useAuth();
  const matchedNavigation = useMemo(
    () => matchNavigationItem(location.pathname),
    [location.pathname]
  );

  const userInitials = profile?.display_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || user?.email?.[0].toUpperCase() || '?';

  const isDashboard = matchedNavigation?.href === "/dashboard";
  
  const breadcrumbs = useMemo(() => {
    if (!matchedNavigation || isDashboard) {
      return [] as { label: string; href?: string }[];
    }

    const items: { label: string; href?: string }[] = [];
    
    // Find the group and subgroup for this navigation item
    let foundSubgroupTitle: string | undefined;
    
    for (const group of navigationGroups) {
      if (group.subgroups) {
        for (const subgroup of group.subgroups) {
          if (subgroup.items.some(item => item.href === matchedNavigation.href)) {
            foundSubgroupTitle = subgroup.subgroupTitle;
            break;
          }
        }
      }
      if (foundSubgroupTitle) break;
    }
    
    // Add group title
    if (matchedNavigation.groupTitle) {
      items.push({ label: matchedNavigation.groupTitle });
    }
    
    // Add subgroup title if found
    if (foundSubgroupTitle) {
      items.push({ label: foundSubgroupTitle });
    }
    
    // Add current page
    items.push({ label: matchedNavigation.title, href: matchedNavigation.href });
    
    // Handle query parameters (e.g., tabs)
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    if (tab) {
      const tabLabels: Record<string, string> = {
        'support': 'Suporte',
        'status': 'Status',
        'version': 'Versão',
        'account': 'Minha Conta',
        'access': 'Logs de Acesso',
        'activities': 'Atividades',
        'attendance': 'Auditoria de Atendimentos',
      };
      if (tabLabels[tab]) {
        items.push({ label: tabLabels[tab] });
      }
    }
    
    return items;
  }, [isDashboard, matchedNavigation, location.search]);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <main className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-4 md:px-6">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="lg:hidden">
                <MenuIcon className="h-6 w-6" />
              </SidebarTrigger>
              <div className="flex flex-col">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      {isDashboard ? (
                        <BreadcrumbPage>Dashboard</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link to="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {breadcrumbs.map((crumb, index) => (
                      <Fragment key={`${crumb.label}-${index}`}>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          {index === breadcrumbs.length - 1 && crumb.href ? (
                            <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                          ) : crumb.href ? (
                            <BreadcrumbLink asChild>
                              <Link to={crumb.href}>{crumb.label}</Link>
                            </BreadcrumbLink>
                          ) : (
                            <span className="text-sm text-muted-foreground">{crumb.label}</span>
                          )}
                        </BreadcrumbItem>
                      </Fragment>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
                <h1 className="text-lg font-semibold leading-tight">
                  {matchedNavigation?.title ?? "Dashboard"}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notificações</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={profile?.avatar_url || ''} alt={profile?.display_name || ''} />
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{profile?.display_name || 'Usuário'}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/conversations">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      <span>Meus Atendimentos</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/perfil/configuracoes">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configurar Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/ajuda">
                      <HelpCircleIcon className="mr-2 h-4 w-4" />
                      <span>Suporte</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;

