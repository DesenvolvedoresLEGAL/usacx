
import { LiveStatsCards } from "@/components/live/LiveStatsCards";
import { ActiveAgentsTable } from "@/components/live/ActiveAgentsTable";
import { QueueMonitor } from "@/components/live/QueueMonitor";
import { LiveControlPanel } from "@/components/live/LiveControlPanel";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download, Filter } from "lucide-react";

const LiveManagementPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão - Ao Vivo</h1>
          <p className="text-muted-foreground mt-1">
            Monitore e gerencie todos os atendimentos em tempo real
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <LiveStatsCards />

      {/* Control Panel */}
      <LiveControlPanel />

      {/* Queue Monitor */}
      <QueueMonitor />

      {/* Active Agents */}
      <ActiveAgentsTable />
    </div>
  );
};

export default LiveManagementPage;
