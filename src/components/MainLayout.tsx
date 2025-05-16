
import React from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Bell, Menu as MenuIcon, UserCircle } from "lucide-react"; // UserCircle for profile

const MainLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-secondary/50">
        <AppSidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6 shrink-0">
            <div className="flex items-center gap-2">
              {/* Fixed SidebarTrigger by ensuring it has a single child element */}
              <SidebarTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <MenuIcon className="h-6 w-6" />
                  <span className="sr-only">Toggle sidebar</span>
                </Button>
              </SidebarTrigger>
              {/* Placeholder for breadcrumbs or page title */}
              <h1 className="text-lg font-semibold">Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notificações</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <UserCircle className="h-6 w-6" />
                <span className="sr-only">Perfil</span>
              </Button>
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
