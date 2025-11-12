
import { Fragment, useMemo } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Bell, HelpCircleIcon, LogOut, Menu as MenuIcon, Settings, UserCircle } from "lucide-react";
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
import { matchNavigationItem } from "@/data/navigation";

const MainLayout = () => {
  const location = useLocation();
  const matchedNavigation = useMemo(
    () => matchNavigationItem(location.pathname),
    [location.pathname]
  );

  const isDashboard = matchedNavigation?.href === "/dashboard";
  const breadcrumbs = useMemo(() => {
    if (!matchedNavigation || isDashboard) {
      return [] as { label: string; href?: string }[];
    }

    const items: { label: string; href?: string }[] = [];
    if (matchedNavigation.groupTitle) {
      items.push({ label: matchedNavigation.groupTitle });
    }

    items.push({ label: matchedNavigation.title, href: matchedNavigation.href });
    return items;
  }, [isDashboard, matchedNavigation]);

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
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <UserCircle className="h-6 w-6" />
                    <span className="sr-only">Perfil</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/perfil/configuracoes">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configurar Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/suporte">
                      <HelpCircleIcon className="mr-2 h-4 w-4" />
                      <span>Suporte</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/login">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </Link>
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

