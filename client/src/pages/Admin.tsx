import { useState, useMemo } from "react";
import { useUser } from "@/contexts/UserContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LogOut, Download, Users, Building2, TrendingUp, Search } from "lucide-react";
import { toast } from "sonner";

export default function Admin() {
  const { user, loading: authLoading, logout, login, isAuthenticated } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [packageFilter, setPackageFilter] = useState<string>("all");

  const { data: registrations, isLoading: loadingRegistrations } = trpc.registration.list.useQuery();
  const { data: sponsorships, isLoading: loadingSponsorships } = trpc.sponsorship.list.useQuery();

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

      return matchesSearch && matchesCategory;
    });
  }, [registrations, searchTerm, categoryFilter]);

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
        "companyWebsite",
        "message",
        "createdAt",
      ]
    );
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
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="registrations">
                  Registrations ({filteredRegistrations.length})
                </TabsTrigger>
                <TabsTrigger value="sponsorships">
                  Sponsorships ({filteredSponsorships.length})
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
                  <Button onClick={handleExportRegistrations} variant="outline">
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
                          <TableHead>Name (EN)</TableHead>
                          <TableHead>Name (AR)</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Affiliation</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loadingRegistrations ? (
                          <TableRow>
                            <TableCell colSpan={9} className="text-center py-8">
                              Loading...
                            </TableCell>
                          </TableRow>
                        ) : filteredRegistrations.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
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
                              <TableCell className="text-sm">
                                {new Date(reg.createdAt).toLocaleDateString()}
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
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
