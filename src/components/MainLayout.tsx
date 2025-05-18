
import React from "react";
import { Outlet, Link } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Bell, Menu as MenuIcon, UserCircle, LogOut, Settings, HelpCircleIcon } from "lucide-react"; 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MainLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-secondary/50">
        <AppSidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6 shrink-0">
            <div className="flex items-center gap-2">
              <SidebarTrigger>
                {/* The SidebarTrigger must only have exactly one child.
                    This span might be redundant if Button provides sr-only too, 
                    but let's keep it for now as per original structure or remove if Button handles it.
                    The MenuIcon Button is separate.
                */}
                 <Button variant="outline" size="icon" className="lg:hidden">
                    <MenuIcon className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
              </SidebarTrigger>
              {/* Removed the separate Button for lg:hidden as SidebarTrigger might handle it, 
                  or it was conflicting. The user had a button inside trigger, then another separate.
                  The original structure of SidebarTrigger from Shadcn usually takes a Button as a child or works standalone.
                  Let's assume the prior fix made SidebarTrigger a direct button.
                  The <Button> below was for the mobile toggle, separate from the trigger.
              */}
               {/* The existing MenuIcon button for mobile, separate from SidebarTrigger */}
               {/* This was previously inside the SidebarTrigger, then outside.  Clarifying based on common pattern:
                  SidebarTrigger is usually its own button. The separate Button is for mobile toggle if desired.
                  The current SidebarTrigger implementation wraps a Button internally. So this is fine.
                  The other <Button> with MenuIcon seems to be a duplicate or for a different purpose.
                  The original file has SidebarTrigger and then a separate Button with MenuIcon (lg:hidden).
                  Let's ensure SidebarTrigger is correctly a single element for its purpose.
                  And the MenuIcon button is separate.
                */}

              {/* Let's ensure SidebarTrigger is clean */}
              {/* The SidebarTrigger itself acts as a button, or wraps one.
                  The MenuIcon button that was `lg:hidden` is the one that should be separate.
              */}
              <div className="lg:hidden"> {/* This div is to ensure MenuIcon Button is indeed for smaller screens */}
                <Button variant="outline" size="icon" asChild={false}>
                  <MenuIcon className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </div>


              {/* Placeholder for breadcrumbs or page title */}
              <h1 className="text-lg font-semibold ml-2">Dashboard</h1> {/* Added ml-2 for spacing */}
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
                    <Link to="/perfil/configuracoes"> {/* Placeholder Link */}
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configurar Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/suporte"> {/* Placeholder Link */}
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
