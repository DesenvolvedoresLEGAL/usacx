import { Outlet } from "react-router-dom";
import { AppSidebarNew } from "./sidebar/AppSidebarNew";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

const MainLayout = () => {
  return (
    <SidebarProvider>
      <TooltipProvider delayDuration={0}>
        <div className="flex h-screen w-full">
          <AppSidebarNew />
          <main className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </TooltipProvider>
    </SidebarProvider>
  );
};

export default MainLayout;

