import { useState, useMemo } from "react";
import { useUser } from "@/contexts/UserContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LogOut, Download, Users, Building2, TrendingUp, Search, Plus, Edit, Trash2, Calendar, Shield, FileText, Mail, Megaphone, SendHorizonal, CheckCircle2, FlaskConical } from "lucide-react";
import { toast } from "sonner";
import { useNotifications } from "@/hooks/useNotifications";

function AcceptanceEmailCard() {
  const [result, setResult] = useState<{ sent: number; failed: number; total: number } | null>(null);
  const [filter, setFilter] = useState<"all" | "unpaid" | "paid">("all");
  const sendAcceptance = trpc.acceptance.sendAcceptanceEmails.useMutation({
    onSuccess: (data) => {
      toast.success(`\u2705 ${data.message}`);
      setResult({ sent: data.sent, failed: data.failed, total: data.total });
    },
    onError: (err) => {
      toast.error(`Failed to send acceptance emails: ${err.message}`);
    },
  });
  const handleSend = () => {
    const filterLabel = filter === "all" ? "ALL" : filter === "unpaid" ? "UNPAID" : "PAID";
    if (!window.confirm(
      `This will send a personalized acceptance email to ${filterLabel} registrants.\n\nEach email lists their selected workshops, fees, and payment instructions (bilingual EN/AR).\n\nProceed?`
    )) return;
    sendAcceptance.mutate({ filter });
  };
  return (
    <Card className="hover:shadow-md transition-shadow border-blue-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              {result ? (
                <CheckCircle2 className="w-6 h-6 text-blue-600" />
              ) : (
                <Mail className="w-6 h-6 text-blue-600" />
              )}
            </div>
            <div>
              <h3 className="font-semibold">Send Acceptance Emails</h3>
              <p className="text-sm text-muted-foreground">Personalized bilingual email: workshop list, fees &amp; payment instructions</p>
              {result && (
                <p className="text-xs text-blue-700 mt-1 font-medium">
                  \u2713 Sent: {result.sent} | Failed: {result.failed} | Total: {result.total}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as "all" | "unpaid" | "paid")}
              className="text-sm border border-input rounded-md px-2 py-1.5 bg-background"
            >
              <option value="all">All Registrants</option>
              <option value="unpaid">Unpaid Only</option>
              <option value="paid">Paid Only</option>
            </select>
            <Button
              onClick={handleSend}
              disabled={sendAcceptance.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              {sendAcceptance.isPending ? "Sending..." : "Send Emails"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ConfirmationEmailCard() {
  const [confirmed, setConfirmed] = useState(false);
  const sendConfirmation = trpc.announcements.sendAttendanceConfirmation.useMutation({
    onSuccess: (data) => {
      toast.success(`✅ ${data.message}`);
      setConfirmed(true);
    },
    onError: (err) => {
      toast.error(`Failed to send emails: ${err.message}`);
    },
  });

  const handleSend = () => {
    if (!window.confirm(
      `This will send an attendance confirmation + certificate invoice request email to ALL registered participants.\n\nAre you sure you want to proceed?`
    )) return;
    sendConfirmation.mutate();
  };

  return (
    <Card className="hover:shadow-md transition-shadow border-green-200">
      <CardContent className="flex items-center justify-between gap-4 p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-lg">
            {confirmed ? (
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            ) : (
              <SendHorizonal className="w-6 h-6 text-green-600" />
            )}
          </div>
          <div>
            <h3 className="font-semibold">Send Attendance Confirmation</h3>
            <p className="text-sm text-muted-foreground">Email all registrants: confirm attendance + request certificate invoice</p>
          </div>
        </div>
        <Button
          onClick={handleSend}
          disabled={sendConfirmation.isPending}
          className="bg-green-600 hover:bg-green-700 text-white shrink-0"
          size="sm"
        >
          {sendConfirmation.isPending ? "Sending..." : "Send to All"}
        </Button>
      </CardContent>
    </Card>
  );
}

function NawahPaymentReminderCard() {
  const [sent, setSent] = useState(false);
  const sendReminder = trpc.announcements.sendNawahPaymentReminder.useMutation({
    onSuccess: (data) => {
      toast.success(`✅ ${data.message}`);
      setSent(true);
    },
    onError: (err) => {
      toast.error(`Failed to send: ${err.message}`);
    },
  });

  const handleSend = () => {
    if (!window.confirm(
      `This will send a payment confirmation request to ALL participants registered for the NAWAH Scientific Workshop.\n\nAre you sure?`
    )) return;
    sendReminder.mutate();
  };

  return (
    <Card className="hover:shadow-md transition-shadow border-emerald-200">
      <CardContent className="flex items-center justify-between gap-4 p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-100 rounded-lg">
            {sent ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            ) : (
              <FlaskConical className="w-6 h-6 text-emerald-600" />
            )}
          </div>
          <div>
            <h3 className="font-semibold">NAWAH Workshop — Payment Reminder</h3>
            <p className="text-sm text-muted-foreground">Email NAWAH registrants: confirm spot by paying 200 EGP + uploading invoice</p>
          </div>
        </div>
        <Button
          onClick={handleSend}
          disabled={sendReminder.isPending}
          className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
          size="sm"
        >
          {sendReminder.isPending ? "Sending..." : "Send Reminder"}
        </Button>
      </CardContent>
    </Card>
  );
}

function PaymentReminderAllCard() {
  const [sent, setSent] = useState(false);
  const sendReminder = trpc.announcements.sendPaymentReminder.useMutation({
    onSuccess: (data) => {
      toast.success(`✅ ${data.message}`);
      setSent(true);
    },
    onError: (err) => {
      toast.error(`Failed to send: ${err.message}`);
    },
  });

  const handleSend = () => {
    if (!window.confirm(
      `This will send a payment reminder email to ALL 700+ registered attendees.\n\nThe email will include:\n• Certificate payment details (100 EGP via InstaPay)\n• Their personal fee breakdown\n• Available workshops list\n• April 1, 2026 deadline\n\nAre you sure you want to send?`
    )) return;
    sendReminder.mutate();
  };

  return (
    <Card className="hover:shadow-md transition-shadow border-blue-200">
      <CardContent className="flex items-center justify-between gap-4 p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            {sent ? (
              <CheckCircle2 className="w-6 h-6 text-blue-600" />
            ) : (
              <Mail className="w-6 h-6 text-blue-600" />
            )}
          </div>
          <div>
            <h3 className="font-semibold">Payment Reminder — All Attendees</h3>
            <p className="text-sm text-muted-foreground">Email all 700+ registrants: certificate (100 EGP), workshops, InstaPay details & April 1 deadline</p>
          </div>
        </div>
        <Button
          onClick={handleSend}
          disabled={sendReminder.isPending}
          className="bg-blue-600 hover:bg-blue-700 text-white shrink-0"
          size="sm"
        >
          {sendReminder.isPending ? "Sending..." : sent ? "Sent ✓" : "Send to All"}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Admin() {
  const { user, loading: authLoading, logout, login, isAuthenticated, isAdmin } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [vipFilter, setVipFilter] = useState<string>("all");
  const [packageFilter, setPackageFilter] = useState<string>("all");
  const [workshopFilter, setWorkshopFilter] = useState<string>("all");
  
  // Real-time notifications
  const { notifications, isConnected } = useNotifications();

  // All hooks must be called before any conditional returns (Rules of Hooks)
  const { data: registrations, isLoading: loadingRegistrations } = trpc.registration.list.useQuery(undefined, { enabled: isAuthenticated && isAdmin });
  const { data: sponsorships, isLoading: loadingSponsorships } = trpc.sponsorship.list.useQuery(undefined, { enabled: isAuthenticated && isAdmin });
  const { data: sessions, isLoading: loadingSessions, refetch: refetchSessions } = trpc.session.list.useQuery(undefined, { enabled: isAuthenticated && isAdmin });
  const { data: supportTickets, isLoading: loadingTickets, refetch: refetchTickets } = trpc.supportTicket.list.useQuery(undefined, { enabled: isAuthenticated && isAdmin });
  const { data: workshopCounts } = trpc.registration.getWorkshopCounts.useQuery(undefined, { enabled: isAuthenticated && isAdmin });
  const { data: geeRegistrations, isLoading: loadingGee, refetch: refetchGee } = trpc.workshopReg.listAll.useQuery(
    { workshopKey: 'gee_remote_sensing' },
    { enabled: isAuthenticated && isAdmin }
  );

  const confirmGeePayment = trpc.workshopReg.confirmPayment.useMutation({
    onSuccess: () => { toast.success('Payment confirmed'); refetchGee(); },
    onError: (e) => toast.error(e.message),
  });
  const rejectGeePayment = trpc.workshopReg.rejectPayment.useMutation({
    onSuccess: () => { toast.success('Payment rejected'); refetchGee(); },
    onError: (e) => toast.error(e.message),
  });
  const toggleGeeCheckIn = trpc.workshopReg.toggleCheckIn.useMutation({
    onSuccess: () => { toast.success('Check-in updated'); refetchGee(); },
    onError: (e) => toast.error(e.message),
  });

  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [ticketResponse, setTicketResponse] = useState("");

  const updateTicketMutation = trpc.supportTicket.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Ticket updated successfully");
      refetchTickets();
      setSelectedTicket(null);
      setTicketResponse("");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update ticket");
    },
  });

  const handleUpdateTicket = (ticketId: number, status: "open" | "in-progress" | "resolved") => {
    updateTicketMutation.mutate({
      id: ticketId,
      status,
      response: ticketResponse || undefined,
    });
  };

  const generateBadgeMutation = trpc.badge.generate.useMutation({
    onSuccess: (data) => {
      // Convert base64 to blob and download
      const byteCharacters = atob(data.pdf);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = data.filename;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success("Badge downloaded successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to generate badge");
    },
  });

  const generateBulkBadgesMutation = trpc.badge.generateBulk.useMutation({
    onSuccess: (data) => {
      const byteCharacters = atob(data.pdf);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = data.filename;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success(`Downloaded ${data.count} badges successfully`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to generate badges");
    },
  });

  const handleDownloadBadge = (registrationId: number) => {
    generateBadgeMutation.mutate({ registrationId });
  };

  const handleDownloadAllBadges = () => {
    generateBulkBadgesMutation.mutate();
  };

  const toggleVIPMutation = trpc.registration.updateVIPStatus.useMutation({
    onSuccess: () => {
      toast.success("VIP status updated successfully");
      // Refetch registrations to show updated VIP status
      window.location.reload();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update VIP status");
    },
  });

  const handleToggleVIP = (id: number, isVIP: boolean) => {
    toggleVIPMutation.mutate({ id, isVIP });
  };

  const [showSessionDialog, setShowSessionDialog] = useState(false);
  const [editingSession, setEditingSession] = useState<any>(null);
  const [sessionForm, setSessionForm] = useState({
    title: "",
    titleAr: "",
    description: "",
    sessionType: "research" as "keynote" | "research" | "workshop" | "panel" | "break" | "opening" | "closing",
    track: "",
    day: 1,
    startTime: "",
    endTime: "",
    location: "",
    speakerName: "",
    speakerTitle: "",
    speakerAffiliation: "",
    speakerBio: "",
  });

  const createSessionMutation = trpc.session.create.useMutation({
    onSuccess: () => {
      toast.success("Session created successfully");
      refetchSessions();
      setShowSessionDialog(false);
      resetSessionForm();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create session");
    },
  });

  const updateSessionMutation = trpc.session.update.useMutation({
    onSuccess: () => {
      toast.success("Session updated successfully");
      refetchSessions();
      setShowSessionDialog(false);
      setEditingSession(null);
      resetSessionForm();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update session");
    },
  });

   const deleteSessionMutation = trpc.session.delete.useMutation({
    onSuccess: () => {
      toast.success("Session deleted successfully");
      refetchSessions();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete session");
    },
  });

  const utils = trpc.useUtils();

  const confirmWorkshopPaymentMutation = trpc.registration.confirmWorkshopPayment.useMutation({
    onSuccess: () => {
      toast.success("Workshop payment confirmed ✅");
      utils.registration.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to confirm payment");
    },
  });

  const rejectWorkshopPaymentMutation = trpc.registration.rejectWorkshopPayment.useMutation({
    onSuccess: () => {
      toast.success("Workshop payment rejected");
      utils.registration.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to reject payment");
    },
  });

  const confirmExtWorkshopPaymentMutation = trpc.registration.confirmExtWorkshopPayment.useMutation({
    onSuccess: () => {
      toast.success("Pre/Post workshop payment confirmed ✅");
      utils.registration.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to confirm payment");
    },
  });

  const rejectExtWorkshopPaymentMutation = trpc.registration.rejectExtWorkshopPayment.useMutation({
    onSuccess: () => {
      toast.success("Pre/Post workshop payment rejected");
      utils.registration.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to reject payment");
    },
  });

  const resetSessionForm = () => {
    setSessionForm({
      title: "",
      titleAr: "",
      description: "",
      sessionType: "research",
      track: "",
      day: 1,
      startTime: "",
      endTime: "",
      location: "",
      speakerName: "",
      speakerTitle: "",
      speakerAffiliation: "",
      speakerBio: "",
    });
  };

  const handleCreateSession = () => {
    setEditingSession(null);
    resetSessionForm();
    setShowSessionDialog(true);
  };

  const handleEditSession = (session: any) => {
    setEditingSession(session);
    setSessionForm({
      title: session.title,
      titleAr: session.titleAr,
      description: session.description || "",
      sessionType: session.sessionType,
      track: session.track || "",
      day: session.day,
      startTime: session.startTime,
      endTime: session.endTime,
      location: session.location || "",
      speakerName: session.speakerName || "",
      speakerTitle: session.speakerTitle || "",
      speakerAffiliation: session.speakerAffiliation || "",
      speakerBio: session.speakerBio || "",
    });
    setShowSessionDialog(true);
  };

  const handleDeleteSession = (id: number) => {
    if (confirm("Are you sure you want to delete this session?")) {
      deleteSessionMutation.mutate({ id });
    }
  };

  const handleSubmitSession = () => {
    if (editingSession) {
      updateSessionMutation.mutate({ id: editingSession.id, ...sessionForm });
    } else {
      createSessionMutation.mutate(sessionForm);
    }
  };

  // Filter registrations
  const filteredRegistrations = useMemo(() => {
    if (!registrations) return [];

    return registrations.filter((reg) => {
      const matchesSearch =
        reg.fullNameEnglish.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.fullNameArabic.includes(searchTerm) ||
        reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.affiliation.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || reg.attendeeCategory === categoryFilter;

      const matchesVIP =
        vipFilter === "all" ||
        (vipFilter === "vip" && reg.isVIP) ||
        (vipFilter === "non-vip" && !reg.isVIP);

      const matchesWorkshop = (() => {
        if (workshopFilter === "all") return true;
        if (workshopFilter === "none") return !reg.wantsWorkshop && !reg.wantsExtWorkshop;
        if (workshopFilter === "any") return reg.wantsWorkshop || reg.wantsExtWorkshop;
        // During-conference workshops
        if (["nawah", "bioinformatics", "marc", "medsol", "geochemistry", "agitech"].includes(workshopFilter)) {
          if (!reg.wantsWorkshop) return false;
          const choices = (reg as any).workshopChoices as string[] | null;
          if (choices && choices.length > 0) return choices.includes(workshopFilter);
          return reg.workshopChoice === workshopFilter;
        }
        // Pre/Post workshops — support both legacy single and new multi-select
        if (!reg.wantsExtWorkshop) return false;
        const extChoices = (reg as any).extWorkshopChoices as string[] | null;
        if (extChoices && extChoices.length > 0) return extChoices.includes(workshopFilter);
        return reg.extWorkshopChoice === workshopFilter;
      })();

      return matchesSearch && matchesCategory && matchesVIP && matchesWorkshop;
    });
  }, [registrations, searchTerm, categoryFilter, vipFilter, workshopFilter]);

  // Filter sponsorships
  const filteredSponsorships = useMemo(() => {
    if (!sponsorships) return [];

    return sponsorships.filter((sponsor) => {
      const matchesSearch =
        sponsor.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sponsor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sponsor.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPackage =
        packageFilter === "all" || sponsor.packageType === packageFilter;

      return matchesSearch && matchesPackage;
    });
  }, [sponsorships, searchTerm, packageFilter]);

  // Export to CSV
  const exportToCSV = (data: any[], filename: string, headers: string[]) => {
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header] || "";
            return `"${String(value).replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    toast.success(`Exported ${data.length} records to CSV`);
  };

  const handleExportRegistrations = () => {
    if (!filteredRegistrations.length) {
      toast.error("No data to export");
      return;
    }

    exportToCSV(
      filteredRegistrations,
      "registrations",
      [
        "id",
        "fullNameEnglish",
        "fullNameArabic",
        "email",
        "phone",
        "affiliation",
        "attendeeCategory",
        "participationType",
        "researchTitle",
        "researchAbstract",
        "createdAt",
      ]
    );
  };
  const handleExportGeeRegistrations = () => {
    if (!geeRegistrations || geeRegistrations.length === 0) {
      toast.error("No GEE registrations to export");
      return;
    }
    const rows = geeRegistrations.map((r) => ({
      id: r.id,
      fullName: r.fullName,
      email: r.email,
      phone: r.phone,
      affiliation: r.affiliation,
      academicLevel: r.academicLevel,
      hasLaptop: r.hasLaptop ? 'Yes' : 'No',
      paymentStatus: r.paymentStatus,
      checkedIn: r.checkedIn ? 'Yes' : 'No',
      invoiceUrl: r.invoiceUrl || '',
      createdAt: r.createdAt ? new Date(r.createdAt).toLocaleString() : '',
    }));
    exportToCSV(
      rows,
      "gee-workshop-registrations",
      ["id", "fullName", "email", "phone", "affiliation", "academicLevel", "hasLaptop", "paymentStatus", "checkedIn", "invoiceUrl", "createdAt"]
    );
  };

  const handleExportSponsorships = () => {
    if (!filteredSponsorships.length) {
      toast.error("No data to export");
      return;
    }

    exportToCSV(
      filteredSponsorships,
      "sponsorships",
      [
        "id",
        "companyName",
        "contactPerson",
        "email",
        "phone",
        "packageType",
        "message",
        "createdAt",
      ]
    );
  };

  const exportCheckinsMutation = trpc.checkin.exportCheckins.useQuery(undefined, {
    enabled: false,
  });

  const handleExportCheckins = async () => {
    try {
      const result = await exportCheckinsMutation.refetch();
      
      if (!result.data) {
        toast.error("No check-in data to export");
        return;
      }

      const { csv, filename, count } = result.data;

      // Create blob and download
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();

      toast.success(`Exported ${count} check-ins to CSV`);
    } catch (error: any) {
      toast.error(error.message || "Failed to export check-ins");
    }
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-accent/5">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Admin Dashboard</CardTitle>
            <CardDescription>Sign in to access the admin panel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              You need to authenticate to view registration and sponsorship data.
            </p>
            <Button onClick={login} className="w-full" size="lg">
              Sign In with OAuth
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Statistics
  const stats = {
    totalRegistrations: registrations?.length || 0,
    totalSponsorships: sponsorships?.length || 0,
    vipCount: registrations?.filter((r) => r.isVIP).length || 0,
    byCategory: {
      student: registrations?.filter((r) => r.attendeeCategory === "student").length || 0,
      faculty: registrations?.filter((r) => r.attendeeCategory === "faculty").length || 0,
      researcher: registrations?.filter((r) => r.attendeeCategory === "researcher").length || 0,
      industry: registrations?.filter((r) => r.attendeeCategory === "industry").length || 0,
    },
    byPackage: {
      platinum: sponsorships?.filter((s) => s.packageType === "platinum").length || 0,
      gold: sponsorships?.filter((s) => s.packageType === "gold").length || 0,
      silver: sponsorships?.filter((s) => s.packageType === "silver").length || 0,
      bronze: sponsorships?.filter((s) => s.packageType === "bronze").length || 0,
    },
  };

  // Auth guard - show login screen if not authenticated/admin
  if (!authLoading && (!isAuthenticated || !isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-white">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Access Required</CardTitle>
            <CardDescription>
              You need admin privileges to access this page.
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
                  Your account does not have admin privileges. Please contact the system administrator.
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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">SCI 2026 Conference Management</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">{user?.name || "Admin"}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <Button onClick={logout} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Quick Links */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = "/admin-management"}>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Admin Management</h3>
                <p className="text-sm text-muted-foreground">Manage administrator accounts and roles</p>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = "/audit-log"}>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="p-3 bg-primary/10 rounded-lg">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Audit Log</h3>
                <p className="text-sm text-muted-foreground">Track all administrative actions</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.location.href = "/digest-settings"}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Email Digest Settings</h3>
                <p className="text-sm text-muted-foreground">Configure automated email reports</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow border-orange-200" onClick={() => window.location.href = '/admin/announcements'}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Megaphone className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold">Announcements</h3>
                <p className="text-sm text-muted-foreground">Manage site-wide announcement banners</p>
              </div>
            </CardContent>
          </Card>

          {/* Send Attendance Confirmation Email */}
          {/* Acceptance / Workshop Confirmation Emails */}
          <AcceptanceEmailCard />
          <ConfirmationEmailCard />
          {/* NAWAH Workshop Payment Reminder */}
          <NawahPaymentReminderCard />
          {/* Payment Reminder to All Attendees */}
          <PaymentReminderAllCard />
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalRegistrations}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Students: {stats.byCategory.student} | Faculty: {stats.byCategory.faculty}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                ⭐ VIP Attendees: {stats.vipCount}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Sponsorship Inquiries</CardTitle>
              <Building2 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalSponsorships}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Platinum: {stats.byPackage.platinum} | Gold: {stats.byPackage.gold}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {stats.totalRegistrations + stats.totalSponsorships}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Combined registrations and sponsors
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Workshop Statistics */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-amber-600" />
              Workshop Registration Statistics
            </CardTitle>
                <CardDescription>Live registration counts and capacity for all 11 workshops</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* During-Conference Workshops (200 EGP) */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">During Conference Workshops — April 7–8 (200 EGP each, capacity 30)</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { key: "nawah", label: "Nawah Scientific", capacity: 30 },
                    { key: "bioinformatics", label: "Bioinformatics (Dr. Dina Amr)", capacity: 50 },
                    { key: "marc", label: "MARC", capacity: 30 },
                    { key: "medsol", label: "Medsol Corporation", capacity: 30 },
                    { key: "geochemistry", label: "Geochemistry", capacity: 30 },
                  ].map(({ key, label, capacity }) => {
                    const count = (workshopCounts as any)?.[key] ?? 0;
                    const remaining = capacity - count;
                    const pct = Math.min(100, Math.round((count / capacity) * 100));
                    return (
                      <div key={key} className="p-3 bg-muted/40 rounded-lg border">
                        <p className="text-xs font-semibold truncate">{label}</p>
                        <p className="text-2xl font-bold mt-1">{count}<span className="text-sm font-normal text-muted-foreground">/{capacity}</span></p>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                          <div className={`h-1.5 rounded-full ${pct >= 100 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${pct}%` }} />
                        </div>
                        <p className={`text-xs mt-1 ${remaining <= 0 ? 'text-red-600 font-semibold' : remaining <= 5 ? 'text-amber-600' : 'text-green-600'}`}>
                          {remaining <= 0 ? 'FULL' : `${remaining} spots left`}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pre/Post Conference Workshops (200 EGP) */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Pre/Post Conference Workshops — April 6 & 9 (200 EGP each)</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { key: "chitosan", label: "Biotech Product Dev 101 (Chitosan)", capacity: 30, date: "Apr 6, 9:00–12:00" },
                    { key: "agitech", label: "NGS & ddPCR in Targeted Therapy (Agitech)", capacity: 20, date: "Apr 6, 12:00–14:00" },
                    { key: "vaccine_industry", label: "The Vaccine Industry Race (Jasmine Mohsen)", capacity: 999, date: "Apr 6, 2:00–5:00 PM" },
                    { key: "scrna_seq", label: "Single Cell Genomics (EG-CompBio)", capacity: 30, date: "Apr 9, 10:00–13:00" },
                    { key: "ai_biotech", label: "AI Meets Biotech (AI بالعربي)", capacity: 30, date: "Apr 9, 1:00–3:00 PM" },
                    { key: "gesr_scholarships", label: "GESR — From Lab to Global Opportunities", capacity: 999, date: "Apr 9, 3:00–6:00 PM" },
                    { key: "hvd_genomics", label: "Genomics & Proteomics (HVD)", capacity: 30, date: "Apr 12, 2026 — New Cairo" },
                    { key: "colors_metagenomics", label: "Metagenomics & Microbiome (Colors)", capacity: 25, date: "TBA" },
                  ].map(({ key, label, capacity, date }) => {
                    const count = (workshopCounts as any)?.[key] ?? 0;
                    const remaining = capacity - count;
                    const pct = Math.min(100, Math.round((count / capacity) * 100));
                    return (
                      <div key={key} className="p-3 bg-muted/40 rounded-lg border">
                        <p className="text-xs font-semibold leading-tight">{label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{date}</p>
                        <p className="text-2xl font-bold mt-1">{count}<span className="text-sm font-normal text-muted-foreground">/{capacity}</span></p>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                          <div className={`h-1.5 rounded-full ${pct >= 100 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${pct}%` }} />
                        </div>
                        <p className={`text-xs mt-1 ${remaining <= 0 ? 'text-red-600 font-semibold' : remaining <= 5 ? 'text-amber-600' : 'text-green-600'}`}>
                          {remaining <= 0 ? 'FULL' : `${remaining} spots left`}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* ⚡ Flash Bundle Stats */}
              <div className="mt-4 p-4 rounded-lg border-2 border-red-200 bg-red-50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">⚡</span>
                  <p className="text-sm font-bold text-red-700 uppercase tracking-wide">Flash Offer — MARC + Chitosan Bundle (150 EGP)</p>
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">First 20 registrants only · 24 hours</span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-red-700">{(workshopCounts as any)?.marc_chitosan_bundle ?? 0}</p>
                    <p className="text-xs text-muted-foreground mt-1">Bundle Registrations</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Progress toward 20 spots</span>
                      <span>{(workshopCounts as any)?.marc_chitosan_bundle ?? 0} / 20</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          ((workshopCounts as any)?.marc_chitosan_bundle ?? 0) >= 20 ? 'bg-red-600' :
                          ((workshopCounts as any)?.marc_chitosan_bundle ?? 0) >= 15 ? 'bg-orange-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.round(((workshopCounts as any)?.marc_chitosan_bundle ?? 0) / 20 * 100))}%` }}
                      />
                    </div>
                    <p className={`text-xs mt-1 font-semibold ${
                      ((workshopCounts as any)?.marc_chitosan_bundle ?? 0) >= 20 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {((workshopCounts as any)?.marc_chitosan_bundle ?? 0) >= 20
                        ? '🔴 FULL — 20/20 spots taken'
                        : `🟢 ${20 - ((workshopCounts as any)?.marc_chitosan_bundle ?? 0)} spots remaining`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Tables */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>View, filter, and export registration data</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="registrations">
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger value="registrations">
                  Registrations ({filteredRegistrations.length})
                </TabsTrigger>
                <TabsTrigger value="sponsorships">
                  Sponsorships ({filteredSponsorships.length})
                </TabsTrigger>
                <TabsTrigger value="sessions">
                  Sessions ({sessions?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="support">
                  Support ({supportTickets?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="gee-workshop">
                  GEE Workshop ({geeRegistrations?.length || 0})
                </TabsTrigger>
              </TabsList>

              {/* Registrations Tab */}
              <TabsContent value="registrations" className="space-y-4">
                {/* Filters */}
                <div className="flex gap-4 flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name, email, or affiliation..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="faculty">Faculty</SelectItem>
                      <SelectItem value="researcher">Researcher</SelectItem>
                      <SelectItem value="industry">Industry</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={vipFilter} onValueChange={setVipFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter by VIP" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Attendees</SelectItem>
                      <SelectItem value="vip">⭐ VIP Only</SelectItem>
                      <SelectItem value="non-vip">Non-VIP</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={workshopFilter} onValueChange={setWorkshopFilter}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filter by Workshop" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Workshops</SelectItem>
                      <SelectItem value="any">Any Workshop</SelectItem>
                      <SelectItem value="none">No Workshop</SelectItem>
                      <SelectItem value="nawah">🔬 NAWAH Scientific</SelectItem>
                      <SelectItem value="bioinformatics">🧬 Bioinformatics (Dr. Dina Amr)</SelectItem>
                      <SelectItem value="marc">🏥 MARC (GCP)</SelectItem>
                      <SelectItem value="medsol">🧬 Medsol Corporation (Sequencing)</SelectItem>
                      <SelectItem value="geochemistry">🌍 Geochemistry</SelectItem>
                      <SelectItem value="agitech">💉 Agitech (NGS & ddPCR)</SelectItem>
                      <SelectItem value="chitosan">🌿 Biotech Product Dev (Chitosan)</SelectItem>
                      <SelectItem value="scrna_seq">🔭 Single Cell Genomics</SelectItem>
                      <SelectItem value="ai_biotech">🤖 AI Meets Biotech</SelectItem>
                      <SelectItem value="hvd_genomics">🧫 Genomics & Proteomics (HVD)</SelectItem>
                      <SelectItem value="vaccine_industry">💉 Vaccine Industry Race</SelectItem>
                      <SelectItem value="gesr_scholarships">🌍 GESR Scholarships</SelectItem>
                      <SelectItem value="colors_metagenomics">🌿 Metagenomics & Microbiome (Colors)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleExportRegistrations} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Registrations
                  </Button>
                  <Button onClick={handleExportCheckins} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Check-Ins
                  </Button>
                  <Button onClick={handleDownloadAllBadges} variant="default">
                    <Download className="w-4 h-4 mr-2" />
                    Download All Badges
                  </Button>
                </div>

                {/* Table */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="max-h-[600px] overflow-auto">
                    <Table>
                      <TableHeader className="sticky top-0 bg-muted">
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name (EN)</TableHead>
                          <TableHead>Name (AR)</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Affiliation</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>VIP</TableHead>
                          <TableHead>Certificate</TableHead>
                          <TableHead>Workshop Payment</TableHead>
                          <TableHead>Pre/Post WS</TableHead>
                          <TableHead>Payment</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loadingRegistrations ? (
                          <TableRow>
                            <TableCell colSpan={10} className="text-center py-8">
                              Loading...
                            </TableCell>
                          </TableRow>
                        ) : filteredRegistrations.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                              No registrations found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredRegistrations.map((reg) => (
                            <TableRow key={reg.id}>
                              <TableCell className="font-medium">{reg.id}</TableCell>
                              <TableCell>{reg.fullNameEnglish}</TableCell>
                              <TableCell dir="rtl">{reg.fullNameArabic}</TableCell>
                              <TableCell className="text-sm">{reg.email}</TableCell>
                              <TableCell className="text-sm">{reg.phone}</TableCell>
                              <TableCell className="text-sm max-w-[200px] truncate">
                                {reg.affiliation}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{reg.attendeeCategory}</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge>{reg.participationType}</Badge>
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="sm"
                                  variant={reg.isVIP ? "default" : "outline"}
                                  onClick={() => handleToggleVIP(reg.id, !reg.isVIP)}
                                  className="h-7"
                                >
                                  {reg.isVIP ? "⭐ VIP" : "Mark VIP"}
                                </Button>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  {reg.wantsCertificate ? (
                                    <Badge variant="secondary" className="block w-fit">Cert ✓</Badge>
                                  ) : (
                                    <Badge variant="outline" className="block w-fit">No Cert</Badge>
                                  )}
                                  {reg.certificateInvoiceUrl ? (
                                    <a
                                      href={reg.certificateInvoiceUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-blue-600 underline hover:text-blue-800 block"
                                    >
                                      📄 Cert Invoice
                                    </a>
                                  ) : reg.wantsCertificate ? (
                                    <span className="text-xs text-red-500">⚠ No invoice</span>
                                  ) : null}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1 min-w-[140px]">
                                  {reg.wantsWorkshop ? (
                                    <>
                                      {(() => {
                                        const LABELS: Record<string, string> = {
                                          nawah: 'NAWAH Scientific',
                                          bioinformatics: 'Bioinformatics (Dr. Dina Amr)',
                                          marc: 'MARC (GCP)',
                                          medsol: 'Medsol (Sequencing)',
                                          geochemistry: 'Geochemistry',
                                          agitech: 'Agitech (NGS & ddPCR)',
                                        };
                                        const choices = ((reg as any).workshopChoices as string[] | null);
                                        const displayKeys = (choices && choices.length > 0) ? choices : (reg.workshopChoice ? [reg.workshopChoice] : []);
                                        return displayKeys.map(key => (
                                          <Badge key={key} className="bg-amber-100 text-amber-800 block w-fit">
                                            {LABELS[key] || key.toUpperCase()}
                                          </Badge>
                                        ));
                                      })()}
                                      {(reg as any).workshopPaymentStatus === "confirmed" ? (
                                        <Badge className="bg-green-100 text-green-800 block w-fit text-xs">✅ Confirmed</Badge>
                                      ) : (reg as any).workshopPaymentStatus === "rejected" ? (
                                        <Badge className="bg-red-100 text-red-800 block w-fit text-xs">❌ Rejected</Badge>
                                      ) : (
                                        <Badge className="bg-yellow-100 text-yellow-800 block w-fit text-xs">⏳ Pending</Badge>
                                      )}
                                      {reg.workshopInvoiceUrl ? (
                                        <a
                                          href={reg.workshopInvoiceUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-xs text-amber-600 underline hover:text-amber-800 block"
                                        >
                                          📄 WS Invoice
                                        </a>
                                      ) : (
                                        <span className="text-xs text-red-500">⚠ No invoice</span>
                                      )}
                                      {(reg as any).workshopPaymentStatus !== "confirmed" && (
                                        <Button
                                          size="sm"
                                          className="h-6 text-xs px-2 bg-green-600 hover:bg-green-700 text-white w-full"
                                          onClick={() => confirmWorkshopPaymentMutation.mutate({ registrationId: reg.id })}
                                          disabled={confirmWorkshopPaymentMutation.isPending}
                                        >
                                          ✅ Confirm
                                        </Button>
                                      )}
                                      {(reg as any).workshopPaymentStatus !== "rejected" && (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="h-6 text-xs px-2 border-red-300 text-red-600 hover:bg-red-50 w-full"
                                          onClick={() => rejectWorkshopPaymentMutation.mutate({ registrationId: reg.id })}
                                          disabled={rejectWorkshopPaymentMutation.isPending}
                                        >
                                          ❌ Reject
                                        </Button>
                                      )}
                                    </>
                                  ) : (
                                    <Badge variant="outline" className="block w-fit">No WS</Badge>
                                  )}
                                </div>
                              </TableCell>
                              {/* Pre/Post Conference Workshop Column */}
                              <TableCell>
                                <div className="space-y-1 min-w-[140px]">
                                  {(reg as any).wantsExtWorkshop ? (
                                    <>
                                      {(() => {
                                        const extLabels: Record<string, string> = {
                                          ai_biotech: 'AI Meets Biotech',
                                          chitosan: 'Biotech Dev 101 (Chitosan)',
                                          scrna_seq: 'Single Cell Genomics',
                                          hvd_genomics: 'Genomics & Proteomics (HVD)',
                                          vaccine_industry: 'Vaccine Industry Race',
                                          gesr_scholarships: 'GESR Scholarships',
                                          colors_metagenomics: 'Metagenomics (Colors)',
                                        };
                                        const extChoices = (reg as any).extWorkshopChoices as string[] | null;
                                        const keys = extChoices && extChoices.length > 0 ? extChoices : ((reg as any).extWorkshopChoice ? [(reg as any).extWorkshopChoice] : []);
                                        return keys.map((k: string) => (
                                          <Badge key={k} className="bg-purple-100 text-purple-800 block w-fit text-xs">
                                            {extLabels[k] || k.toUpperCase()}
                                          </Badge>
                                        ));
                                      })()}
                                      {(reg as any).extWorkshopPaymentStatus === "confirmed" ? (
                                        <Badge className="bg-green-100 text-green-800 block w-fit text-xs">✅ Confirmed</Badge>
                                      ) : (reg as any).extWorkshopPaymentStatus === "rejected" ? (
                                        <Badge className="bg-red-100 text-red-800 block w-fit text-xs">❌ Rejected</Badge>
                                      ) : (
                                        <Badge className="bg-yellow-100 text-yellow-800 block w-fit text-xs">⏳ Pending</Badge>
                                      )}
                                      {(reg as any).extWorkshopInvoiceUrl ? (
                                        <a
                                          href={(reg as any).extWorkshopInvoiceUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-xs text-purple-600 underline hover:text-purple-800 block"
                                        >
                                          📄 Invoice
                                        </a>
                                      ) : (
                                        <span className="text-xs text-red-500">⚠ No invoice</span>
                                      )}
                                      {(reg as any).extWorkshopPaymentStatus !== "confirmed" && (
                                        <Button
                                          size="sm"
                                          className="h-6 text-xs px-2 bg-green-600 hover:bg-green-700 text-white w-full"
                                          onClick={() => confirmExtWorkshopPaymentMutation.mutate({ registrationId: reg.id })}
                                          disabled={confirmExtWorkshopPaymentMutation.isPending}
                                        >
                                          ✅ Confirm
                                        </Button>
                                      )}
                                      {(reg as any).extWorkshopPaymentStatus !== "rejected" && (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="h-6 text-xs px-2 border-red-300 text-red-600 hover:bg-red-50 w-full"
                                          onClick={() => rejectExtWorkshopPaymentMutation.mutate({ registrationId: reg.id })}
                                          disabled={rejectExtWorkshopPaymentMutation.isPending}
                                        >
                                          ❌ Reject
                                        </Button>
                                      )}
                                    </>
                                  ) : (
                                    <Badge variant="outline" className="block w-fit text-xs">None</Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    reg.paymentStatus === "paid"
                                      ? "default"
                                      : reg.paymentStatus === "pending"
                                      ? "secondary"
                                      : "outline"
                                  }
                                >
                                  {reg.paymentStatus || "unpaid"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">                   {new Date(reg.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDownloadBadge(reg.id)}
                                >
                                  Download Badge
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>

              {/* Sponsorships Tab */}
              <TabsContent value="sponsorships" className="space-y-4">
                {/* Filters */}
                <div className="flex gap-4 flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by company, contact, or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={packageFilter} onValueChange={setPackageFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by package" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Packages</SelectItem>
                      <SelectItem value="platinum">Platinum</SelectItem>
                      <SelectItem value="gold">Gold</SelectItem>
                      <SelectItem value="silver">Silver</SelectItem>
                      <SelectItem value="bronze">Bronze</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleExportSponsorships} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </div>

                {/* Table */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="max-h-[600px] overflow-auto">
                    <Table>
                      <TableHeader className="sticky top-0 bg-muted">
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>Contact Person</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Package</TableHead>
                          <TableHead>Website</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loadingSponsorships ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-8">
                              Loading...
                            </TableCell>
                          </TableRow>
                        ) : filteredSponsorships.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                              No sponsorships found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredSponsorships.map((sponsor) => (
                            <TableRow key={sponsor.id}>
                              <TableCell className="font-medium">{sponsor.id}</TableCell>
                              <TableCell className="font-medium">{sponsor.companyName}</TableCell>
                              <TableCell>{sponsor.contactPerson}</TableCell>
                              <TableCell className="text-sm">{sponsor.email}</TableCell>
                              <TableCell className="text-sm">{sponsor.phone}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    sponsor.packageType === "platinum"
                                      ? "default"
                                      : sponsor.packageType === "gold"
                                      ? "secondary"
                                      : "outline"
                                  }
                                >
                                  {sponsor.packageType}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm max-w-[200px] truncate">
                                {sponsor.companyWebsite || "-"}
                              </TableCell>
                              <TableCell className="text-sm">
                                {new Date(sponsor.createdAt).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>

              {/* Sessions Tab */}
              <TabsContent value="sessions" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Manage Conference Sessions</h3>
                  <Button onClick={handleCreateSession}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Session
                  </Button>
                </div>

                {/* Sessions Table */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="max-h-[600px] overflow-auto">
                    <Table>
                      <TableHeader className="sticky top-0 bg-muted">
                        <TableRow>
                          <TableHead>Day</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Track</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Speaker</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loadingSessions ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-8">
                              Loading...
                            </TableCell>
                          </TableRow>
                        ) : !sessions || sessions.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                              No sessions found. Click "Add Session" to create one.
                            </TableCell>
                          </TableRow>
                        ) : (
                          sessions
                            .sort((a, b) => a.day - b.day || a.startTime.localeCompare(b.startTime))
                            .map((session) => (
                              <TableRow key={session.id}>
                                <TableCell className="font-medium">Day {session.day}</TableCell>
                                <TableCell className="text-sm">
                                  {session.startTime} - {session.endTime}
                                </TableCell>
                                <TableCell className="font-medium max-w-[250px]">
                                  <div className="truncate">{session.title}</div>
                                  <div className="text-xs text-muted-foreground truncate" dir="rtl">
                                    {session.titleAr}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">{session.sessionType}</Badge>
                                </TableCell>
                                <TableCell className="text-sm">{session.track || "-"}</TableCell>
                                <TableCell className="text-sm">{session.location || "-"}</TableCell>
                                <TableCell className="text-sm">{session.speakerName || "-"}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleEditSession(session)}
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleDeleteSession(session.id)}
                                    >
                                      <Trash2 className="w-4 h-4 text-destructive" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>

              {/* Support Tickets Tab */}
              <TabsContent value="support" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Support Tickets Management</h3>
                  <Badge variant="outline">
                    {supportTickets?.filter((t) => t.status === "open").length || 0} Open Tickets
                  </Badge>
                </div>

                {/* Tickets Table */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="max-h-[600px] overflow-auto">
                    <Table>
                      <TableHeader className="sticky top-0 bg-muted">
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loadingTickets ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-8">
                              Loading...
                            </TableCell>
                          </TableRow>
                        ) : !supportTickets || supportTickets.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                              No support tickets found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          supportTickets
                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .map((ticket) => (
                              <TableRow key={ticket.id}>
                                <TableCell className="font-medium">#{ticket.id}</TableCell>
                                <TableCell>{ticket.name}</TableCell>
                                <TableCell className="text-sm">{ticket.email}</TableCell>
                                <TableCell className="max-w-[200px] truncate">{ticket.subject}</TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      ticket.priority === "high"
                                        ? "destructive"
                                        : ticket.priority === "normal"
                                        ? "secondary"
                                        : "outline"
                                    }
                                  >
                                    {ticket.priority}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      ticket.status === "resolved"
                                        ? "default"
                                        : ticket.status === "in-progress"
                                        ? "secondary"
                                        : "outline"
                                    }
                                  >
                                    {ticket.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-sm">
                                  {new Date(ticket.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setSelectedTicket(ticket)}
                                  >
                                    View
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>

              {/* GEE Workshop Tab */}
              <TabsContent value="gee-workshop" className="space-y-4">
                <div className="flex justify-between items-center flex-wrap gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">GEE Remote Sensing Workshop</h3>
                    <p className="text-sm text-muted-foreground">Programming-based Remote Sensing Analysis of Google Earth Engine — Eng. Sherif Shallal | April 19, 2026</p>
                  </div>
                  <div className="flex gap-2 flex-wrap items-center">
                    <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50">
                      Paid: {geeRegistrations?.filter(r => r.paymentStatus === 'paid').length || 0}
                    </Badge>
                    <Badge variant="outline" className="text-yellow-700 border-yellow-300 bg-yellow-50">
                      Pending: {geeRegistrations?.filter(r => r.paymentStatus === 'pending').length || 0}
                    </Badge>
                    <Badge variant="outline" className="text-gray-600">
                      Unpaid: {geeRegistrations?.filter(r => r.paymentStatus === 'unpaid').length || 0}
                    </Badge>
                    <Badge className="bg-primary">
                      Checked In: {geeRegistrations?.filter(r => r.checkedIn).length || 0}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExportGeeRegistrations}
                      className="ml-2"
                    >
                      📅 Export CSV
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="max-h-[600px] overflow-auto">
                    <Table>
                      <TableHeader className="sticky top-0 bg-muted">
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Affiliation</TableHead>
                          <TableHead>Level</TableHead>
                          <TableHead>Laptop</TableHead>
                          <TableHead>Payment</TableHead>
                          <TableHead>Receipt</TableHead>
                          <TableHead>Check-in</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loadingGee ? (
                          <TableRow>
                            <TableCell colSpan={12} className="text-center py-8">Loading...</TableCell>
                          </TableRow>
                        ) : !geeRegistrations || geeRegistrations.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">No registrations yet.</TableCell>
                          </TableRow>
                        ) : (
                          geeRegistrations.map((reg) => (
                            <TableRow key={reg.id}>
                              <TableCell className="font-medium">#{reg.id}</TableCell>
                              <TableCell className="font-medium">{reg.fullName}</TableCell>
                              <TableCell className="text-sm">{reg.email}</TableCell>
                              <TableCell className="text-sm">{reg.phone}</TableCell>
                              <TableCell className="text-sm max-w-[150px] truncate">{reg.affiliation}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-xs">{reg.academicLevel}</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant={reg.hasLaptop ? 'default' : 'secondary'} className="text-xs">
                                  {reg.hasLaptop ? '✓ Yes' : '✗ No'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    reg.paymentStatus === 'paid' ? 'default' :
                                    reg.paymentStatus === 'pending' ? 'secondary' : 'outline'
                                  }
                                  className={
                                    reg.paymentStatus === 'paid' ? 'bg-green-600' :
                                    reg.paymentStatus === 'pending' ? 'bg-yellow-500 text-white' : ''
                                  }
                                >
                                  {reg.paymentStatus}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {reg.invoiceUrl ? (
                                  <a href={reg.invoiceUrl} target="_blank" rel="noopener noreferrer"
                                    className="text-blue-600 underline text-xs">View Receipt</a>
                                ) : (
                                  <span className="text-muted-foreground text-xs">—</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge variant={reg.checkedIn ? 'default' : 'outline'}
                                  className={reg.checkedIn ? 'bg-teal-600' : ''}>
                                  {reg.checkedIn ? '✓ In' : 'Not yet'}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm">
                                {new Date(reg.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex gap-1 justify-end flex-wrap">
                                  {reg.paymentStatus === 'pending' && (
                                    <>
                                      <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700 text-xs h-7"
                                        onClick={() => confirmGeePayment.mutate({ registrationId: reg.id })}>
                                        Confirm
                                      </Button>
                                      <Button size="sm" variant="destructive" className="text-xs h-7"
                                        onClick={() => rejectGeePayment.mutate({ registrationId: reg.id })}>
                                        Reject
                                      </Button>
                                    </>
                                  )}
                                  {reg.paymentStatus === 'paid' && (
                                    <Button size="sm" variant="outline" className="text-xs h-7"
                                      onClick={() => toggleGeeCheckIn.mutate({ registrationId: reg.id, checkedIn: !reg.checkedIn })}>
                                      {reg.checkedIn ? 'Undo Check-in' : 'Check In'}
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Ticket Detail Dialog */}
        {selectedTicket && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">Ticket #{selectedTicket.id}</h2>
                    <p className="text-sm text-muted-foreground">
                      Submitted on {new Date(selectedTicket.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedTicket(null);
                      setTicketResponse("");
                    }}
                  >
                    ✕
                  </Button>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Name</p>
                      <p>{selectedTicket.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p className="text-sm">{selectedTicket.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Priority</p>
                      <Badge
                        variant={
                          selectedTicket.priority === "high"
                            ? "destructive"
                            : selectedTicket.priority === "normal"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {selectedTicket.priority}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <Badge
                        variant={
                          selectedTicket.status === "resolved"
                            ? "default"
                            : selectedTicket.status === "in-progress"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {selectedTicket.status}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Subject</p>
                    <p className="font-medium">{selectedTicket.subject}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Message</p>
                    <div className="bg-muted p-4 rounded-md">
                      <p className="whitespace-pre-wrap">{selectedTicket.message}</p>
                    </div>
                  </div>

                  {selectedTicket.response && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Previous Response</p>
                      <div className="bg-green-50 border border-green-200 p-4 rounded-md">
                        <p className="whitespace-pre-wrap">{selectedTicket.response}</p>
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-2">Update Ticket</p>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="ticketResponse">Response (Optional)</Label>
                        <Textarea
                          id="ticketResponse"
                          value={ticketResponse}
                          onChange={(e) => setTicketResponse(e.target.value)}
                          placeholder="Add a response or note..."
                          className="min-h-[100px]"
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateTicket(selectedTicket.id, "open")}
                          disabled={updateTicketMutation.isPending}
                        >
                          Mark as Open
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleUpdateTicket(selectedTicket.id, "in-progress")}
                          disabled={updateTicketMutation.isPending}
                        >
                          Mark as In Progress
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateTicket(selectedTicket.id, "resolved")}
                          disabled={updateTicketMutation.isPending}
                        >
                          Mark as Resolved
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Session Dialog */}
        {showSessionDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">
                    {editingSession ? "Edit Session" : "Create New Session"}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowSessionDialog(false);
                      setEditingSession(null);
                      resetSessionForm();
                    }}
                  >
                    ✕
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Title (English)</label>
                      <Input
                        value={sessionForm.title}
                        onChange={(e) => setSessionForm({ ...sessionForm, title: e.target.value })}
                        placeholder="Session title"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Title (Arabic)</label>
                      <Input
                        value={sessionForm.titleAr}
                        onChange={(e) => setSessionForm({ ...sessionForm, titleAr: e.target.value })}
                        placeholder="عنوان الجلسة"
                        dir="rtl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                      className="w-full min-h-[80px] px-3 py-2 border rounded-md"
                      value={sessionForm.description}
                      onChange={(e) => setSessionForm({ ...sessionForm, description: e.target.value })}
                      placeholder="Session description"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium">Session Type</label>
                      <Select
                        value={sessionForm.sessionType}
                        onValueChange={(value: any) =>
                          setSessionForm({ ...sessionForm, sessionType: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="keynote">Keynote</SelectItem>
                          <SelectItem value="research">Research</SelectItem>
                          <SelectItem value="workshop">Workshop</SelectItem>
                          <SelectItem value="panel">Panel</SelectItem>
                          <SelectItem value="break">Break</SelectItem>
                          <SelectItem value="opening">Opening</SelectItem>
                          <SelectItem value="closing">Closing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Day</label>
                      <Select
                        value={String(sessionForm.day)}
                        onValueChange={(value) =>
                          setSessionForm({ ...sessionForm, day: parseInt(value) })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Day 1</SelectItem>
                          <SelectItem value="2">Day 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Track</label>
                      <Input
                        value={sessionForm.track}
                        onChange={(e) => setSessionForm({ ...sessionForm, track: e.target.value })}
                        placeholder="e.g., life-sciences"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium">Start Time</label>
                      <Input
                        value={sessionForm.startTime}
                        onChange={(e) => setSessionForm({ ...sessionForm, startTime: e.target.value })}
                        placeholder="09:00"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">End Time</label>
                      <Input
                        value={sessionForm.endTime}
                        onChange={(e) => setSessionForm({ ...sessionForm, endTime: e.target.value })}
                        placeholder="10:00"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Location</label>
                      <Input
                        value={sessionForm.location}
                        onChange={(e) => setSessionForm({ ...sessionForm, location: e.target.value })}
                        placeholder="Main Hall"
                      />
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">Speaker Information (Optional)</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Speaker Name</label>
                        <Input
                          value={sessionForm.speakerName}
                          onChange={(e) =>
                            setSessionForm({ ...sessionForm, speakerName: e.target.value })
                          }
                          placeholder="Dr. John Doe"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Title</label>
                          <Input
                            value={sessionForm.speakerTitle}
                            onChange={(e) =>
                              setSessionForm({ ...sessionForm, speakerTitle: e.target.value })
                            }
                            placeholder="Professor"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Affiliation</label>
                          <Input
                            value={sessionForm.speakerAffiliation}
                            onChange={(e) =>
                              setSessionForm({ ...sessionForm, speakerAffiliation: e.target.value })
                            }
                            placeholder="Cairo University"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Bio</label>
                        <textarea
                          className="w-full min-h-[60px] px-3 py-2 border rounded-md"
                          value={sessionForm.speakerBio}
                          onChange={(e) =>
                            setSessionForm({ ...sessionForm, speakerBio: e.target.value })
                          }
                          placeholder="Speaker biography"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowSessionDialog(false);
                      setEditingSession(null);
                      resetSessionForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitSession}
                    disabled={createSessionMutation.isPending || updateSessionMutation.isPending}
                  >
                    {editingSession ? "Update" : "Create"} Session
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
