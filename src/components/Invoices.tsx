import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockInvoices, formatCurrency, formatDate, Invoice } from "@/lib/mock-data";
import {
  MagnifyingGlass,
  Download,
  CaretUp,
  CaretDown,
  Funnel,
  FunnelSimple,
  X,
} from "@phosphor-icons/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function Invoices() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Invoice | null;
    direction: "asc" | "desc";
  }>({
    key: "date",
    direction: "desc",
  });
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Filtering logic
  const filteredInvoices = mockInvoices.filter((invoice) => {
    const matchesSearch = invoice.number
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? invoice.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  // Sorting logic
  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    // For numerical values like amount
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const requestSort = (key: keyof Invoice) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const renderSortIndicator = (key: keyof Invoice) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <CaretUp size={14} />
    ) : (
      <CaretDown size={14} />
    );
  };

  const getSortableHeaderProps = (key: keyof Invoice, label: string) => ({
    onClick: () => requestSort(key),
    className: "cursor-pointer select-none",
    children: (
      <div className="flex items-center gap-1">
        {label}
        {renderSortIndicator(key)}
      </div>
    ),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
        <p className="text-muted-foreground">Manage and download your invoices</p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative">
              <MagnifyingGlass
                size={18}
                className="absolute left-2.5 top-2.5 text-muted-foreground"
              />
              <Input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full sm:w-64"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Button
                  variant={statusFilter === null ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setStatusFilter(null)}
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === "paid" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setStatusFilter("paid")}
                >
                  Paid
                </Button>
                <Button
                  variant={statusFilter === "pending" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setStatusFilter("pending")}
                >
                  Pending
                </Button>
                <Button
                  variant={statusFilter === "overdue" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setStatusFilter("overdue")}
                >
                  Overdue
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead {...getSortableHeaderProps("number", "Invoice")}>
                  </TableHead>
                  <TableHead
                    {...getSortableHeaderProps("date", "Issue Date")}
                  ></TableHead>
                  <TableHead
                    {...getSortableHeaderProps("dueDate", "Due Date")}
                  ></TableHead>
                  <TableHead
                    {...getSortableHeaderProps("amount", "Amount")}
                  ></TableHead>
                  <TableHead
                    {...getSortableHeaderProps("status", "Status")}
                  ></TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 h-32">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <FunnelSimple size={24} className="mb-2" />
                        <p className="text-sm">No invoices found</p>
                        <p className="text-xs">
                          Try adjusting your search or filter
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        {invoice.number}
                      </TableCell>
                      <TableCell>{formatDate(invoice.date)}</TableCell>
                      <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                      <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            invoice.status === "paid"
                              ? "outline"
                              : invoice.status === "pending"
                              ? "secondary"
                              : "destructive"
                          }
                          className="text-xs font-normal"
                        >
                          {invoice.status.charAt(0).toUpperCase() +
                            invoice.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Download Invoice"
                        >
                          <Download size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}