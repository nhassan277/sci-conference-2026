import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Filter, Download } from "lucide-react";
import { format } from "date-fns";

export default function AuditLog() {
  const { user, loading: authLoading, logout, login, isAuthenticated, isAdmin } = useUser();
  const [filters, setFilters] = useState({
    action: "",
    resourceType: "",
    adminEmail: "",
    startDate: "",
    endDate: "",
  });

  const { data: logs, refetch } = trpc.auditLog.list.useQuery({
    limit: 100,
    offset: 0,
    ...filters,
  });
  const { data: stats } = trpc.auditLog.stats.useQuery();

  // Redirect if not admin
  if (!authLoading && (!isAuthenticated || !isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-white">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Access Required</CardTitle>
            <CardDescription>
              This audit log is for administrators only.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isAuthenticated ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Please log in with an admin account to continue.
                </p>
                <Button onClick={login} className="w-full">
                  Log In
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  Your account does not have admin privileges.
                </p>
                <Button onClick={logout} variant="outline" className="w-full">
                  Log Out
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleExportCSV = () => {
    if (!logs) return;

    const headers = ["Timestamp", "Admin", "Action", "Resource Type", "Resource ID", "Details", "IP Address"];
    const rows = logs.map((log) => [
      format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss"),
      log.adminEmail || "System",
      log.action,
      log.resourceType,
      log.resourceId || "",
      log.details || "",
      log.ipAddress || "",
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-log-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case "create":
        return <Badge className="bg-green-500">Create</Badge>;
      case "update":
        return <Badge className="bg-blue-500">Update</Badge>;
      case "delete":
        return <Badge className="bg-red-500">Delete</Badge>;
      case "export":
        return <Badge className="bg-purple-500">Export</Badge>;
      case "login":
        return <Badge variant="secondary">Login</Badge>;
      case "logout":
        return <Badge variant="outline">Logout</Badge>;
      default:
        return <Badge variant="outline">{action}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="w-8 h-8" />
            Audit Log
          </h1>
          <p className="text-muted-foreground mt-2">
            Track all administrative actions and system events
          </p>
        </div>
        <Button onClick={handleExportCSV} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalActions}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Action Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(stats.actionCounts).map(([action, count]) => (
                  <div key={action} className="flex justify-between text-sm">
                    <span className="capitalize">{action}</span>
                    <span className="font-semibold">{count as number}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Resource Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(stats.resourceCounts).map(([resource, count]) => (
                  <div key={resource} className="flex justify-between text-sm">
                    <span className="capitalize">{resource}</span>
                    <span className="font-semibold">{count as number}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label>Action</Label>
              <Select
                value={filters.action}
                onValueChange={(value) => setFilters({ ...filters, action: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Actions</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                  <SelectItem value="export">Export</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="logout">Logout</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Resource Type</Label>
              <Select
                value={filters.resourceType}
                onValueChange={(value) => setFilters({ ...filters, resourceType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Resources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Resources</SelectItem>
                  <SelectItem value="registration">Registration</SelectItem>
                  <SelectItem value="session">Session</SelectItem>
                  <SelectItem value="sponsorship">Sponsorship</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="support_ticket">Support Ticket</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Admin Email</Label>
              <Input
                value={filters.adminEmail}
                onChange={(e) => setFilters({ ...filters, adminEmail: e.target.value })}
                placeholder="Filter by admin"
              />
            </div>
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={() => refetch()}>Apply Filters</Button>
            <Button
              variant="outline"
              onClick={() => {
                setFilters({
                  action: "",
                  resourceType: "",
                  adminEmail: "",
                  startDate: "",
                  endDate: "",
                });
                refetch();
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>
            {logs?.length || 0} action{logs?.length !== 1 ? "s" : ""} recorded
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs?.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm">
                    {format(new Date(log.timestamp), "MMM d, yyyy HH:mm:ss")}
                  </TableCell>
                  <TableCell className="text-sm">
                    <div>
                      <div className="font-medium">{log.adminName || "System"}</div>
                      <div className="text-muted-foreground text-xs">{log.adminEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getActionBadge(log.action)}</TableCell>
                  <TableCell className="capitalize">{log.resourceType}</TableCell>
                  <TableCell>{log.resourceId || "-"}</TableCell>
                  <TableCell className="max-w-xs truncate text-sm">
                    {log.details || "-"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {log.ipAddress || "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
