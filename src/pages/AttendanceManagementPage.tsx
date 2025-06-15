
import { AttendanceStatsCards } from "@/components/attendance/AttendanceStatsCards";
import { AttendanceFilters } from "@/components/attendance/AttendanceFilters";
import { AttendanceTable } from "@/components/attendance/AttendanceTable";
import { AttendanceBulkActions } from "@/components/attendance/AttendanceBulkActions";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download, Plus, Filter } from "lucide-react";
import { useState } from "react";

const AttendanceManagementPage = () => {
  const [selectedAttendances, setSelectedAttendances] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão - Atendimentos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie todos os atendimentos do sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Novo Atendimento
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <AttendanceStatsCards />

      {/* Filters */}
      {showFilters && <AttendanceFilters />}

      {/* Bulk Actions */}
      {selectedAttendances.length > 0 && (
        <AttendanceBulkActions 
          selectedCount={selectedAttendances.length}
          onClearSelection={() => setSelectedAttendances([])}
        />
      )}

      {/* Attendance Table */}
      <AttendanceTable 
        selectedAttendances={selectedAttendances}
        onSelectionChange={setSelectedAttendances}
      />
    </div>
  );
};

export default AttendanceManagementPage;
