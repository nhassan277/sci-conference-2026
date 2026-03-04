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
import { LogOut, Download, Users, Building2, TrendingUp, Search, Plus, Edit, Trash2, Calendar, Shield, FileText, Mail } from "lucide-react";
import { toast } from "sonner";
import { useNotifications } from "@/hooks/useNotifications";

export default function Admin() {
  const { user, loading: authLoading, logout, login, isAuthenticated, isAdmin } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [vipFilter, setVipFilter] = useState<string>("all");
  const [packageFilter, setPackageFilter] = useState<string>("all");
  
  // Real-time notifications
  const { notifications, isConnected } = useNotifications();

  // Redirect if not admin
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

  const { data: registrations, isLoading: loadingRegistrations } = trpc.registration.list.useQuery();
  const { data: sponsorships, isLoading: loadingSponsorships } = trpc.sponsorship.list.useQuery();
  const { data: sessions, isLoading: loadingSessions, refetch: refetchSessions } = trpc.session.list.useQuery();
  const { data: supportTickets, isLoading: loadingTickets, refetch: refetchTickets } = trpc.supportTicket.list.useQuery();

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

      return matchesSearch && matchesCategory && matchesVIP;
    });
  }, [registrations, searchTerm, categoryFilter, vipFilter]);

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
              <TabsList className="grid w-full grid-cols-4 mb-6">
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
                                      <Badge className="bg-amber-100 text-amber-800 block w-fit">
                                        {reg.workshopChoice?.toUpperCase() || "Workshop"}
                                      </Badge>
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
                                      <Badge className="bg-purple-100 text-purple-800 block w-fit text-xs">
                                        {(reg as any).extWorkshopChoice === 'ai_biotech' ? 'AI Meets Biotech' : ((reg as any).extWorkshopChoice?.toUpperCase() || 'Pre/Post WS')}
                                      </Badge>
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
