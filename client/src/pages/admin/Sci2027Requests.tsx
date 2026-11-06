import { useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, Download, FileText, Loader2, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";

type RequestKind = "media" | "sponsor";
type RequestStatus = "pending" | "in_review" | "contacted" | "closed";
type CommonRequest = {
  id: number;
  year: number;
  reference: string;
  status: RequestStatus;
  adminNotes: string | null;
  createdAt: Date | string;
  updatedAt?: Date | string;
  consent: boolean | number;
  consentAt?: Date | string;
  submissionKey: string;
  email: string;
  phone: string;
  jobTitle: string;
  website: string | null;
  notes: string | null;
};
type RequestRow = CommonRequest & (
  | { fullName: string; organizationName: string; coverageType: string }
  | { companyName: string; contactPerson: string; activitySector: string; cooperationType: string }
);

const STATUS_CONFIG: Record<RequestStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "border-amber-200 bg-amber-50 text-amber-900" },
  in_review: { label: "In review", className: "border-blue-200 bg-blue-50 text-blue-900" },
  contacted: { label: "Contacted", className: "border-teal-200 bg-teal-50 text-teal-900" },
  closed: { label: "Closed", className: "border-slate-200 bg-slate-100 text-slate-700" },
};
const statuses = Object.keys(STATUS_CONFIG) as RequestStatus[];
const selectClassName = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50";

function formatDate(value: Date | string | undefined) {
  if (!value) return "Not recorded";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Not recorded" : date.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }) + " UTC";
}

function StatusBadge({ status }: { status: RequestStatus }) {
  const config = STATUS_CONFIG[status];
  return <Badge variant="outline" className={`whitespace-nowrap ${config.className}`}>{config.label}</Badge>;
}

function DetailField({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className="min-w-0 space-y-1">
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="whitespace-pre-wrap break-words text-sm [overflow-wrap:anywhere]">{value === null || value === undefined || value === "" ? "Not provided" : value}</dd>
    </div>
  );
}

function RequestDetails({ request, kind, canUpdate }: { request: RequestRow; kind: RequestKind; canUpdate: boolean }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<RequestStatus>(request.status);
  const [adminNotes, setAdminNotes] = useState(request.adminNotes ?? "");
  const utils = trpc.useUtils();
  const updateRequest = trpc.sci2027Requests.update.useMutation({
    onSuccess: () => {
      void utils.sci2027Requests.list.invalidate({ kind });
      toast.success("Request status and internal notes saved.");
      setOpen(false);
    },
  });
  const handleSave = () => {
    if (!canUpdate || updateRequest.isPending) return;
    updateRequest.mutate({ kind, id: request.id, status, adminNotes });
  };
  const isMedia = "fullName" in request;

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => {
      if (updateRequest.isPending) return;
      if (nextOpen) {
        setStatus(request.status);
        setAdminNotes(request.adminNotes ?? "");
        updateRequest.reset();
      }
      setOpen(nextOpen);
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" aria-label={`View details for ${request.reference}`}>View details</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader className="min-w-0 pr-5">
          <DialogTitle className="break-words [overflow-wrap:anywhere]">{isMedia ? "Media request" : "Sponsor & partner request"} — {request.reference}</DialogTitle>
          <DialogDescription>Request details and internal follow-up. A request is not approval, accreditation or sponsorship confirmation.</DialogDescription>
        </DialogHeader>
        <dl className="grid min-w-0 grid-cols-1 gap-5 rounded-lg border bg-muted/20 p-4 sm:grid-cols-2">
          <DetailField label="Record ID" value={request.id} />
          <DetailField label="Request reference" value={request.reference} />
          <DetailField label="Conference year" value={request.year} />
          <DetailField label="Current status" value={STATUS_CONFIG[request.status].label} />
          <DetailField label="Request type" value={isMedia ? "Media" : "Sponsor / partner"} />
          {"fullName" in request ? (
            <>
              <DetailField label="Full name" value={request.fullName} />
              <DetailField label="Organization name" value={request.organizationName} />
              <DetailField label="Coverage type" value={request.coverageType} />
            </>
          ) : (
            <>
              <DetailField label="Company / organization name" value={request.companyName} />
              <DetailField label="Contact person" value={request.contactPerson} />
              <DetailField label="Activity sector" value={request.activitySector} />
              <DetailField label="Cooperation type" value={request.cooperationType} />
            </>
          )}
          <DetailField label="Job title" value={request.jobTitle} />
          <DetailField label="Email address" value={request.email} />
          <DetailField label="Phone number" value={request.phone} />
          <DetailField label="Website" value={request.website} />
          <div className="min-w-0 sm:col-span-2"><DetailField label="Submitted notes" value={request.notes} /></div>
          <DetailField label="Consent to process request and contact" value={request.consent ? "Given" : "Not given"} />
          <div className="min-w-0 space-y-1">
            <DetailField label="Consent timestamp" value={formatDate(request.consentAt ?? request.createdAt)} />
            {request.consentAt == null && <p className="text-xs text-muted-foreground">Consent was recorded with the request submission at the server receipt time shown here.</p>}
          </div>
          <DetailField label="Received at" value={formatDate(request.createdAt)} />
          <DetailField label="Last updated" value={formatDate(request.updatedAt)} />
          <div className="min-w-0 sm:col-span-2"><DetailField label="Submission key" value={request.submissionKey} /></div>
          <div className="min-w-0 sm:col-span-2"><DetailField label="Saved admin notes" value={request.adminNotes} /></div>
        </dl>
        {!canUpdate && <p className="text-sm text-muted-foreground">Read-only access. Your role cannot update request status or admin notes.</p>}
        {canUpdate && (
          <form className="space-y-4 border-t pt-4" onSubmit={(event) => { event.preventDefault(); handleSave(); }}>
            <div className="space-y-2">
              <Label htmlFor="sci2027-detail-status">Follow-up status</Label>
              <select id="sci2027-detail-status" className={selectClassName} value={status} disabled={updateRequest.isPending} onChange={(event) => setStatus(event.target.value as RequestStatus)}>
                {statuses.map((value) => <option key={value} value={value}>{STATUS_CONFIG[value].label}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sci2027-admin-notes">Admin notes (internal only)</Label>
              <Textarea id="sci2027-admin-notes" value={adminNotes} onChange={(event) => setAdminNotes(event.target.value)} rows={4} maxLength={5000} disabled={updateRequest.isPending} className="resize-y" placeholder="Record follow-up and next steps…" />
              <p className="text-xs text-muted-foreground">These notes are not sent to the requester. Maximum 5,000 characters.</p>
            </div>
            {updateRequest.isError && <p role="alert" className="break-words text-sm text-destructive">Could not save changes: {updateRequest.error.message}. Your changes are still here; please retry.</p>}
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline" disabled={updateRequest.isPending}>Cancel</Button></DialogClose>
              <Button type="submit" disabled={updateRequest.isPending || (status === request.status && adminNotes === (request.adminNotes ?? ""))}>
                {updateRequest.isPending && <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />}
                {updateRequest.isPending ? "Saving…" : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        )}
        {!canUpdate && <DialogFooter><DialogClose asChild><Button variant="outline">Close details</Button></DialogClose></DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}

function RequestList({ kind, canUpdate, canExport }: { kind: RequestKind; canUpdate: boolean; canExport: boolean }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | RequestStatus>("all");
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const list = trpc.sci2027Requests.list.useQuery(
    { kind },
    { retry: false },
  );
  const utils = trpc.useUtils();
  const requests: RequestRow[] = list.data ?? [];
  const filteredRequests = useMemo(() => {
    const term = search.trim().toLowerCase();
    return requests.filter((row) => {
      const fields = [row.reference, row.email, row.phone, row.jobTitle, row.website, row.notes, row.adminNotes,
        ...("fullName" in row ? [row.fullName, row.organizationName, row.coverageType] : [row.companyName, row.contactPerson, row.activitySector, row.cooperationType])];
      return (statusFilter === "all" || row.status === statusFilter) && (!term || fields.some((value) => value?.toLowerCase().includes(term)));
    });
  }, [requests, search, statusFilter]);
  const clearFilters = () => { setSearch(""); setStatusFilter("all"); };

  const handleExport = async () => {
    if (!canExport || exporting) return;
    setExporting(true);
    setExportError(null);
    try {
      // The server returns every row for this kind; local search/status never enter this request.
      const { csv, filename } = await utils.sci2027Requests.exportCsv.fetch({ kind });
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      try {
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
      } finally {
        link.remove();
        // Allow the browser to start reading the Blob before releasing its URL.
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
      toast.success("All selected-type requests exported.");
    } catch (error) {
      setExportError(error instanceof Error ? error.message : "Unable to export requests. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-w-0 max-w-full space-y-5">
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{kind === "media" ? "Media enquiries" : "Sponsorship & partnership enquiries"}</p>
          <p className="mt-1 text-sm text-muted-foreground">Total requests: <strong className="text-foreground">{list.isLoading || list.isError ? "—" : requests.length}</strong></p>
          <p className="mt-1 text-xs text-muted-foreground">Search and status filters do not limit the export.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => void list.refetch()} disabled={list.isFetching}>
            <RefreshCw className={`mr-2 size-4 ${list.isFetching ? "animate-spin" : ""}`} aria-hidden="true" />Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport} disabled={!canExport || exporting} title={canExport ? "Export every request of this type" : "Your role does not permit exports"}>
            {exporting ? <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" /> : <Download className="mr-2 size-4" aria-hidden="true" />}
            {exporting ? "Exporting…" : "Export all CSV"}
          </Button>
        </div>
      </div>
      {exportError && <div role="alert" className="break-words rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">Export failed: {exportError}. Use Export all CSV to retry.</div>}
      <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_12rem]">
        <div className="min-w-0 space-y-2">
          <Label htmlFor="sci2027-request-search">Search requests</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 size-4 text-muted-foreground" aria-hidden="true" />
            <Input id="sci2027-request-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name, organization, email or reference" className="min-w-0 pl-9" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="sci2027-status-filter">Filter by status</Label>
          <select id="sci2027-status-filter" className={selectClassName} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "all" | RequestStatus)}>
            <option value="all">All statuses</option>
            {statuses.map((value) => <option key={value} value={value}>{STATUS_CONFIG[value].label}</option>)}
          </select>
        </div>
      </div>
      {list.isLoading ? (
        <div role="status" className="flex items-center justify-center gap-3 rounded-lg border py-16 text-sm text-muted-foreground"><Loader2 className="size-5 animate-spin" aria-hidden="true" />Loading requests…</div>
      ) : list.isError ? (
        <div role="alert" className="space-y-3 rounded-lg border border-destructive/30 bg-destructive/5 p-6">
          <p className="font-medium text-destructive">Could not load requests</p>
          <p className="break-words text-sm">{list.error.message}</p>
          <Button variant="outline" onClick={() => void list.refetch()} disabled={list.isFetching}>Retry</Button>
        </div>
      ) : requests.length === 0 ? (
        <div role="status" className="rounded-lg border border-dashed px-4 py-16 text-center">
          <FileText className="mx-auto mb-3 size-7 text-muted-foreground" aria-hidden="true" />
          <h3 className="font-semibold">No requests yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">New {kind === "media" ? "media" : "sponsor and partner"} requests will appear here.</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div role="status" className="space-y-3 rounded-lg border px-4 py-12 text-center">
          <h3 className="font-semibold">No matching requests</h3>
          <p className="text-sm text-muted-foreground">Try another search or status.</p>
          <Button variant="outline" onClick={clearFilters}>Clear filters</Button>
        </div>
      ) : (
        <div className="min-w-0 max-w-full space-y-2">
          <p role="status" className="text-xs text-muted-foreground">Showing {filteredRequests.length} of {requests.length} requests · newest first</p>
          <div className="min-w-0 max-w-full overflow-x-auto rounded-lg border" role="region" aria-label={`${kind === "media" ? "Media" : "Sponsor and partner"} requests table`} tabIndex={0}>
            <Table className="min-w-[760px]">
              <caption className="sr-only">SCI 2027 {kind} requests. Use View details to read all fields and permitted follow-up actions.</caption>
              <TableHeader><TableRow>
                <TableHead scope="col">Reference</TableHead>
                <TableHead scope="col">Contact</TableHead>
                <TableHead scope="col">Organization</TableHead>
                <TableHead scope="col">Status</TableHead>
                <TableHead scope="col">Received (UTC)</TableHead>
                <TableHead scope="col"><span className="sr-only">Details</span></TableHead>
              </TableRow></TableHeader>
              <TableBody>{filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="max-w-[180px] whitespace-normal break-words font-mono text-xs [overflow-wrap:anywhere]">{request.reference}</TableCell>
                  <TableCell className="max-w-[220px] whitespace-normal break-words [overflow-wrap:anywhere]">
                    <p className="font-medium">{"fullName" in request ? request.fullName : request.contactPerson}</p>
                    <p className="text-xs text-muted-foreground">{request.email}</p>
                  </TableCell>
                  <TableCell className="max-w-[200px] whitespace-normal break-words [overflow-wrap:anywhere]">{"organizationName" in request ? request.organizationName : request.companyName}</TableCell>
                  <TableCell><StatusBadge status={request.status} /></TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{formatDate(request.createdAt)}</TableCell>
                  <TableCell><RequestDetails request={request} kind={kind} canUpdate={canUpdate} /></TableCell>
                </TableRow>
              ))}</TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Sci2027Requests() {
  const profile = trpc.adminManagement.me.useQuery(undefined, { retry: false });
  const admin = profile.data;
  const canUpdate = admin?.role !== "viewer" && admin?.permissions?.canUpdate === true;
  const canExport = admin?.permissions?.canExport === true;

  if (profile.isLoading) return <div role="status" className="flex items-center gap-2 py-8 text-sm"><Loader2 className="size-4 animate-spin" aria-hidden="true" />Checking admin permissions…</div>;
  if (profile.isError || !admin) return (
    <div role="alert" className="space-y-3 rounded-lg border border-destructive/30 p-6">
      <p className="flex items-center gap-2 font-medium"><AlertCircle className="size-4" aria-hidden="true" />Admin access could not be verified</p>
      <p className="break-words text-sm text-muted-foreground">{profile.error?.message ?? "An authenticated administrator account is required."}</p>
      <Button variant="outline" onClick={() => void profile.refetch()} disabled={profile.isFetching}>Retry permissions check</Button>
    </div>
  );

  return (
    <section className="min-w-0 max-w-full space-y-5" aria-labelledby="sci2027-requests-heading">
      <div className="rounded-lg border-l-4 border-[#c9a44a] bg-[#10243a] p-5 text-white sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e0c57f]">SCI 2027 · Request desk</p>
        <h2 id="sci2027-requests-heading" className="mt-2 text-xl font-semibold">Media, sponsors & partners</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-200">Review enquiries and record follow-up. These SCI 2027 requests are separate from legacy SCI 2026 registrations and sponsorships.</p>
        {!canUpdate && <p className="mt-3 text-xs text-[#e0c57f]">Read-only access{canExport ? " · CSV export permitted" : ""}</p>}
      </div>
      <Tabs defaultValue="media" className="min-w-0">
        <TabsList className="h-auto w-full flex-wrap justify-start gap-1 [&_[data-slot=tabs-trigger]]:h-auto [&_[data-slot=tabs-trigger]]:whitespace-normal">
          <TabsTrigger value="media">Media requests</TabsTrigger>
          <TabsTrigger value="sponsor">Sponsor &amp; partner requests</TabsTrigger>
        </TabsList>
        <TabsContent value="media" className="min-w-0 pt-3"><RequestList kind="media" canUpdate={canUpdate} canExport={canExport} /></TabsContent>
        <TabsContent value="sponsor" className="min-w-0 pt-3"><RequestList kind="sponsor" canUpdate={canUpdate} canExport={canExport} /></TabsContent>
      </Tabs>
    </section>
  );
}
