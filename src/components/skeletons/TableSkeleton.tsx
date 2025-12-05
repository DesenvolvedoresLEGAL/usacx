import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

interface TableSkeletonProps {
  columns?: number;
  rows?: number;
  showHeader?: boolean;
}

export function TableRowSkeleton({ columns = 6 }: { columns?: number }) {
  return (
    <TableRow>
      {[...Array(columns)].map((_, i) => (
        <TableCell key={i}>
          <Skeleton className="h-4 w-full max-w-[120px]" />
        </TableCell>
      ))}
    </TableRow>
  );
}

export function TableSkeleton({ columns = 6, rows = 5, showHeader = true }: TableSkeletonProps) {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        {showHeader && (
          <TableHeader>
            <TableRow>
              {[...Array(columns)].map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
        )}
        <TableBody>
          {[...Array(rows)].map((_, i) => (
            <TableRowSkeleton key={i} columns={columns} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function ReportTableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Stats cards skeleton */}
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-4">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
      
      {/* Table skeleton */}
      <TableSkeleton columns={8} rows={8} />
    </div>
  );
}

export function FiltersSkeleton() {
  return (
    <div className="flex flex-wrap gap-4 p-4 border rounded-lg bg-card">
      <Skeleton className="h-10 w-40" />
      <Skeleton className="h-10 w-40" />
      <Skeleton className="h-10 w-32" />
      <Skeleton className="h-10 w-24" />
    </div>
  );
}
