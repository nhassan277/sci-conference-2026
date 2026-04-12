import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Award, Search, RefreshCw, CheckCircle2, Clock, XCircle, Loader2, ChevronDown, ChevronUp, Mail, User, Building2, FileText, Presentation, Download } from "lucide-react";
import { toast } from "sonner";

type CertRequest = {
  id: number;
  nameOnCertificate: string;
  email: string;
  affiliation: string;
  certificateType: string;
  presentationTitle: string | null;
  presentationType: string | null;
  organizationRole: string | null;
  additionalNotes: string | null;
  status: string;
  adminNotes: string | null;
  processedBy: string | null;
  processedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock },
  processing: { label: "Processing", color: "bg-blue-100 text-blue-800 border-blue-200", icon: Loader2 },
  issued: { label: "Issued", color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
};

const CERT_TYPE_LABELS: Record<string, string> = {
  attendance: "Attendance",
  participation: "Participation",
  organization: "Organization",
};

const PRES_TYPE_LABELS: Record<string, string> = {
  poster: "Poster",
  oral: "Oral Presentation",
  invited_speaker: "Invited Speaker",
  workshop_organizer: "Workshop Organizer",
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.color}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

function RequestDetailRow({ request, onUpdate }: { request: CertRequest; onUpdate: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState(request.status);
  const [adminNotes, setAdminNotes] = useState(request.adminNotes ?? "");

  const updateStatus = trpc.certificates.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Status updated successfully");
      setDialogOpen(false);
      onUpdate();
    },
    onError: (err) => toast.error("Failed to update: " + err.message),
  });

  const handleSave = () => {
    updateStatus.mutate({ id: request.id, status: newStatus as any, adminNotes });
  };

  return (
    <>
      <TableRow className="cursor-pointer hover:bg-muted/30" onClick={() => setExpanded(!expanded)}>
        <TableCell className="font-medium">
          <div className="flex items-center gap-2">
            {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            #{request.id}
          </div>
        </TableCell>
        <TableCell>
          <div>
            <p className="font-semibold text-sm">{request.nameOnCertificate}</p>
            <p className="text-xs text-muted-foreground">{request.email}</p>
          </div>
        </TableCell>
        <TableCell className="text-sm text-muted-foreground max-w-[180px] truncate">{request.affiliation}</TableCell>
        <TableCell>
          <Badge variant="outline" className="text-xs capitalize">
            {CERT_TYPE_LABELS[request.certificateType] ?? request.certificateType}
          </Badge>
        </TableCell>
        <TableCell>
          <StatusBadge status={request.status} />
        </TableCell>
        <TableCell className="text-xs text-muted-foreground">
          {new Date(request.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
        </TableCell>
        <TableCell onClick={(e) => e.stopPropagation()}>
          <Button size="sm" variant="outline" onClick={() => { setDialogOpen(true); setNewStatus(request.status); setAdminNotes(request.adminNotes ?? ""); }}>
            Update
          </Button>
        </TableCell>
      </TableRow>

      {/* Expanded detail row */}
      {expanded && (
        <TableRow className="bg-muted/10">
          <TableCell colSpan={7} className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-primary" />
                  <span className="font-medium">Email:</span>
                  <a href={`mailto:${request.email}`} className="text-primary underline">{request.email}</a>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Building2 className="w-4 h-4 text-primary mt-0.5" />
                  <span className="font-medium">Affiliation:</span>
                  <span>{request.affiliation}</span>
                </div>
                {request.presentationTitle && (
                  <div className="flex items-start gap-2 text-sm">
                    <Presentation className="w-4 h-4 text-primary mt-0.5" />
                    <span className="font-medium">Title:</span>
                    <span className="italic">{request.presentationTitle}</span>
                  </div>
                )}
                {request.presentationType && (
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="font-medium">Type:</span>
                    <span>{PRES_TYPE_LABELS[request.presentationType] ?? request.presentationType}</span>
                  </div>
                )}
                {request.organizationRole && (
                  <div className="flex items-start gap-2 text-sm">
                    <User className="w-4 h-4 text-primary mt-0.5" />
                    <span className="font-medium">Role:</span>
                    <span>{request.organizationRole}</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                {request.additionalNotes && (
                  <div className="text-sm">
                    <p className="font-medium mb-1">Additional Notes:</p>
                    <p className="text-muted-foreground bg-muted/50 rounded p-2 text-xs">{request.additionalNotes}</p>
                  </div>
                )}
                {request.adminNotes && (
                  <div className="text-sm">
                    <p className="font-medium mb-1">Admin Notes:</p>
                    <p className="text-muted-foreground bg-yellow-50 rounded p-2 text-xs border border-yellow-200">{request.adminNotes}</p>
                  </div>
                )}
                {request.processedBy && (
                  <p className="text-xs text-muted-foreground">
                    Processed by: <strong>{request.processedBy}</strong>
                    {request.processedAt && ` on ${new Date(request.processedAt).toLocaleDateString()}`}
                  </p>
                )}
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}

      {/* Update Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Certificate Request #{request.id}</DialogTitle>
            <DialogDescription>
              <strong>{request.nameOnCertificate}</strong> — {request.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="issued">Issued ✓</SelectItem>
                  <SelectItem value="rejected">Rejected ✗</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Admin Notes (optional)</Label>
              <Textarea
                placeholder="Internal notes about this request..."
                value={adminNotes}
                onChange={e => setAdminNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={updateStatus.isPending}>
              {updateStatus.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function CertificateRequests() {
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "processing" | "issued" | "rejected">("all");
  const [search, setSearch] = useState("");
  const [exporting, setExporting] = useState(false);

  const { data: requests, isLoading, refetch } = trpc.certificates.list.useQuery(
    { status: statusFilter, search: search || undefined },
    { refetchInterval: 30000 }
  );

  const { data: stats } = trpc.certificates.stats.useQuery(undefined, { refetchInterval: 30000 });

  const utils = trpc.useUtils();

  const handleExport = async () => {
    setExporting(true);
    try {
      const result = await utils.certificates.exportCsv.fetch({ status: statusFilter });
      if (!result?.csv) {
        toast.error("No data to export");
        return;
      }
      // Add BOM for Excel UTF-8 compatibility
      const bom = "\uFEFF";
      const blob = new Blob([bom + result.csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const filterLabel = statusFilter === "all" ? "all" : statusFilter;
      const dateStr = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.download = `SCI2026_certificate_requests_${filterLabel}_${dateStr}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`Exported ${result.count} request${result.count !== 1 ? "s" : ""} to CSV`);
    } catch (err: any) {
      toast.error("Export failed: " + (err?.message ?? "Unknown error"));
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Award className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Certificate Requests</h2>
            <p className="text-sm text-muted-foreground">Manage post-conference certificate requests</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={exporting || isLoading}
            className="gap-2 border-green-300 text-green-700 hover:bg-green-50"
          >
            {exporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="border-yellow-200">
            <CardContent className="p-4 flex items-center gap-3">
              <Clock className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-blue-200">
            <CardContent className="p-4 flex items-center gap-3">
              <Loader2 className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.processing}</p>
                <p className="text-xs text-muted-foreground">Processing</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-green-200">
            <CardContent className="p-4 flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.issued}</p>
                <p className="text-xs text-muted-foreground">Issued</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Award className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Requests</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Breakdown by type */}
      {stats && (
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">Attendance: {stats.attendance}</Badge>
          <Badge variant="outline" className="text-xs">Participation: {stats.participation}</Badge>
          <Badge variant="outline" className="text-xs">Organization: {stats.organization}</Badge>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or affiliation..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={v => setStatusFilter(v as any)}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="issued">Issued</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            {isLoading ? "Loading..." : `${requests?.length ?? 0} request${requests?.length !== 1 ? "s" : ""}`}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : !requests || requests.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Award className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No certificate requests found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">ID</TableHead>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Affiliation</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-24">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((req) => (
                    <RequestDetailRow key={req.id} request={req as CertRequest} onUpdate={refetch} />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
