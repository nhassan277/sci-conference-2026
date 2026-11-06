import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const source = (path: string) => {
  const filename = fileURLToPath(new URL(`../../../${path}`, import.meta.url));
  return existsSync(filename) ? readFileSync(filename, "utf8") : "";
};
const component = () => source("client/src/pages/admin/Sci2027Requests.tsx");
const shell = () => source("client/src/pages/Admin.tsx");

describe("SCI 2027 request administration", () => {
  it("integrates a separate request tab without replacing the custom legacy shell", () => {
    const admin = shell();
    expect(admin).toContain('import Sci2027Requests from "./admin/Sci2027Requests"');
    expect(admin).toContain('<TabsTrigger value="sci2027-requests">');
    expect(admin).toContain("SCI 2027 Requests");
    expect(admin).toContain('<TabsContent value="sci2027-requests"');
    expect(admin).toContain("<Sci2027Requests />");
    for (const tab of ["registrations", "sponsorships", "sessions", "support", "gee-workshop", "certificates"]) {
      expect(admin).toContain(`<TabsTrigger value="${tab}"`);
      expect(admin).toContain(`<TabsContent value="${tab}"`);
    }
    for (const api of ["trpc.registration.list", "trpc.sponsorship.list", "trpc.session.list", "trpc.supportTicket.list", "trpc.workshopReg.listAll"]) {
      expect(admin).toContain(api);
    }
    expect(admin).toContain("<CertificateRequests />");
    expect(admin).not.toContain("DashboardLayout");
  });

  it("wraps the top-level tabs responsively without a fixed six-column layout", () => {
    const admin = shell();
    expect(admin).toMatch(/<TabsList className="[^"]*h-auto[^"]*flex-wrap/);
    expect(admin).not.toContain("grid-cols-6");
  });

  it("uses independent media and sponsor/partner views and the new list contract", () => {
    const requests = component();
    expect(requests).toContain('<TabsTrigger value="media">');
    expect(requests).toContain('<TabsTrigger value="sponsor">');
    expect(requests).toContain("Sponsor &amp; partner requests");
    expect(requests).toContain("trpc.sci2027Requests.list.useQuery(");
    expect(requests).toContain("{ kind }");
    expect(requests).not.toContain("trpc.media.");
    expect(requests).not.toContain("trpc.sponsorship.");
  });

  it("fails closed on permissions and prevents viewer updates while allowing permitted exports", () => {
    const requests = component();
    expect(requests).toContain("trpc.adminManagement.me.useQuery");
    expect(requests).toContain('admin?.role !== "viewer"');
    expect(requests).toContain("admin?.permissions?.canUpdate === true");
    expect(requests).toContain("admin?.permissions?.canExport === true");
    expect(requests).toContain("if (!canUpdate || updateRequest.isPending) return;");
    expect(requests).toContain("if (!canExport || exporting) return;");
    expect(requests).toContain("{canUpdate && (");
    expect(requests).toContain("Read-only access");
  });

  it("provides labelled search, all four statuses and selected-kind total plus filtered counts", () => {
    const requests = component();
    expect(requests).toContain('htmlFor="sci2027-request-search"');
    expect(requests).toContain('htmlFor="sci2027-status-filter"');
    for (const status of ["pending", "in_review", "contacted", "closed"]) expect(requests).toContain(`${status}:`);
    expect(requests).toContain("row.reference");
    expect(requests).toContain("row.email");
    expect(requests).toContain("row.status === statusFilter");
    expect(requests).toContain("Total requests");
    expect(requests).toContain("filteredRequests.length");
    expect(requests).toContain("requests.length");
  });

  it("distinguishes loading, recoverable query error, empty and no-filter-match states", () => {
    const requests = component();
    expect(requests).toContain("list.isLoading");
    expect(requests).toContain("list.isError");
    expect(requests).toContain("list.refetch()");
    expect(requests).toContain("Retry");
    expect(requests).toContain("Loading requests");
    expect(requests).toContain("No requests yet");
    expect(requests).toContain("No matching requests");
    expect(requests).toContain("Clear filters");
    expect(requests).toContain('role="alert"');
    expect(requests).toContain('role="status"');
  });

  it("opens a keyboard-accessible detail dialog and displays all submitted and audit fields", () => {
    const requests = component();
    for (const primitive of ["DialogTrigger", "DialogContent", "DialogTitle", "DialogDescription", "DialogClose"]) expect(requests).toContain(primitive);
    expect(requests).toContain("View details");
    for (const field of ["id", "reference", "fullName", "email", "phone", "organizationName", "jobTitle", "coverageType", "website", "notes", "companyName", "contactPerson", "activitySector", "cooperationType", "consent", "consentAt", "createdAt", "updatedAt", "submissionKey", "status", "adminNotes"]) {
      expect(requests).toContain(`request.${field}`);
    }
    expect(requests).toContain("Consent timestamp");
    expect(requests).toContain("Request reference");
  });

  it("shows the persisted conference year and uses server receipt time when no separate consent timestamp exists", () => {
    const requests = component();
    expect(requests).toContain("request.year");
    expect(requests).toMatch(/consentAt\?: Date \| string/);
    expect(requests).toContain("request.consentAt ?? request.createdAt");
    expect(requests).toContain("Consent was recorded with the request submission");
    expect(requests).toContain("server receipt time");
  });

  it("saves only status and internal notes through the dedicated update contract and refreshes data", () => {
    const requests = component();
    expect(requests).toContain("trpc.sci2027Requests.update.useMutation");
    expect(requests).toContain("updateRequest.mutate({ kind, id: request.id, status, adminNotes });");
    expect(requests).toContain("utils.sci2027Requests.list.invalidate({ kind })");
    expect(requests).toContain('htmlFor="sci2027-detail-status"');
    expect(requests).toContain('htmlFor="sci2027-admin-notes"');
    expect(requests).toContain("updateRequest.isError");
    expect(requests).toContain("Save changes");
  });

  it("exports all server rows of the selected kind rather than current search/status matches", () => {
    const requests = component();
    expect(requests).toContain("utils.sci2027Requests.exportCsv.fetch({ kind })");
    expect(requests).toContain("Export all CSV");
    expect(requests).toContain("Search and status filters do not limit the export");
    expect(requests).not.toMatch(/exportCsv\.fetch\([^)]*(statusFilter|search|filteredRequests)/);
    expect(requests).toContain("link.download = filename;");
    expect(requests).toContain('new Blob([csv], { type: "text/csv;charset=utf-8;" })');
    expect(requests).toContain("URL.createObjectURL(blob)");
    expect(requests).toContain("URL.revokeObjectURL(url)");
    expect(requests).toContain("link.remove()");
    expect(requests).toContain("finally");
  });

  it("contains horizontal table scrolling and long dialog fields within the viewport", () => {
    const requests = component();
    expect(requests).toContain("min-w-0");
    expect(requests).toContain("overflow-x-auto");
    expect(requests).toContain("max-w-full");
    expect(requests).toContain("max-h-[85dvh]");
    expect(requests).toContain("overflow-y-auto");
    expect(requests).toContain("break-words");
    expect(requests).toContain("sr-only");
    expect(requests).toMatch(/<TableCell className="[^\"]*whitespace-normal[^\"]*font-mono/);
    expect(requests.match(/<TableCell className="[^\"]*whitespace-normal/g)).toHaveLength(3);
  });

  it("adds no deletion, emailing, approval or sponsorship payment actions", () => {
    const requests = component();
    expect(requests).toContain("export default function Sci2027Requests");
    expect(requests).not.toMatch(/\.delete\.|\.remove\.|sendEmail|sendAcceptance|confirmPayment|approveRequest|stripe\./);
    expect(requests).toContain("not approval, accreditation or sponsorship confirmation");
  });
});
