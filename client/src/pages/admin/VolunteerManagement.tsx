import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Users, CheckCircle, XCircle, Clock, Download, Eye, Filter, Mail } from "lucide-react";
import { Link } from "wouter";

const COMMITTEES = [
  { id: "hall_organization", name: "Conference Hall Organization", nameAr: "لجنة التنظيم داخل القاعات" },
  { id: "reception", name: "Reception and Registration", nameAr: "لجنة الاستقبال والتسجيل" },
  { id: "logistics", name: "Logistics and Field Tasks", nameAr: "لجنة المشاوير والمهام الميدانية" },
  { id: "marketing", name: "Publications and Marketing", nameAr: "لجنة المطبوعات والتسويق" },
  { id: "hospitality", name: "Main Entrance Hospitality", nameAr: "لجنة الاستقبال والضيافة" },
  { id: "technical", name: "Technical Support", nameAr: "لجنة الدعم التقني" },
  { id: "catering", name: "Catering and Refreshments", nameAr: "لجنة الضيافة والمرطبات" },
  { id: "scientific", name: "Scientific Coordination", nameAr: "لجنة التنسيق العلمي" },
  { id: "posters", name: "Poster Session", nameAr: "لجنة الملصقات العلمية" },
];

export default function VolunteerManagement() {
  const [filters, setFilters] = useState({
    status: "all" as "all" | "pending" | "approved" | "rejected",
    committee: "",
    academicYear: "",
  });
  const [selectedVolunteer, setSelectedVolunteer] = useState<any>(null);
  const [reviewData, setReviewData] = useState({
    status: "approved" as "pending" | "approved" | "rejected",
    assignedCommittee: "",
    notes: "",
  });
  const [bulkEmailOpen, setBulkEmailOpen] = useState(false);
  const [emailData, setEmailData] = useState({
    subject: "",
    message: "",
  });

  const { data: volunteers, isLoading, refetch } = trpc.volunteers.list.useQuery(filters);
  const { data: stats } = trpc.volunteers.stats.useQuery();

  const updateStatusMutation = trpc.volunteers.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Volunteer status updated successfully");
      refetch();
      setSelectedVolunteer(null);
    },
    onError: (error) => {
      toast.error("Failed to update status", {
        description: error.message,
      });
    },
  });

  const deleteMutation = trpc.volunteers.delete.useMutation({
    onSuccess: () => {
      toast.success("Volunteer application deleted");
      refetch();
      setSelectedVolunteer(null);
    },
    onError: (error) => {
      toast.error("Failed to delete application", {
        description: error.message,
      });
    },
  });

  const sendBulkEmailMutation = trpc.volunteers.sendBulkEmail.useMutation({
    onSuccess: (data) => {
      toast.success(`Email sent to ${data.recipientCount} volunteers!`, {
        description: `Successfully sent to: ${data.recipients.slice(0, 3).map(r => r.name).join(", ")}${data.recipients.length > 3 ? " and more..." : ""}`,
      });
      setBulkEmailOpen(false);
      setEmailData({ subject: "", message: "" });
    },
    onError: (error) => {
      toast.error("Failed to send bulk email", {
        description: error.message,
      });
    },
  });

  const handleSendBulkEmail = () => {
    if (!emailData.subject || !emailData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    sendBulkEmailMutation.mutate({
      subject: emailData.subject,
      message: emailData.message,
      filters: {
        status: filters.status !== "all" ? filters.status : undefined,
        committee: filters.committee || undefined,
        academicYear: filters.academicYear || undefined,
      },
    });
  };

  const handleReview = (volunteerId: number) => {
    updateStatusMutation.mutate({
      id: volunteerId,
      status: reviewData.status,
      assignedCommittee: reviewData.assignedCommittee || undefined,
      notes: reviewData.notes || undefined,
    });
  };

  const handleExportToExcel = () => {
    if (!volunteers || volunteers.length === 0) {
      toast.error("No data to export");
      return;
    }

    // Create CSV content
    const headers = [
      "ID",
      "Full Name",
      "Email",
      "Phone",
      "Student ID",
      "Academic Year",
      "Department",
      "Preferred Committee",
      "Second Choice",
      "Skills",
      "Previous Experience",
      "Day 1 Available",
      "Day 2 Available",
      "Before Conference",
      "Why Volunteer",
      "Status",
      "Assigned Committee",
      "Notes",
      "Reviewed By",
      "Created At",
    ];

    const rows = volunteers.map((v) => [
      v.id,
      v.fullName,
      v.email,
      v.phone,
      v.studentId,
      v.academicYear,
      v.department,
      COMMITTEES.find((c) => c.id === v.preferredCommittee)?.name || v.preferredCommittee,
      v.secondChoiceCommittee ? COMMITTEES.find((c) => c.id === v.secondChoiceCommittee)?.name || v.secondChoiceCommittee : "",
      v.skills || "",
      v.previousExperience || "",
      (v.availability as any)?.day1 ? "Yes" : "No",
      (v.availability as any)?.day2 ? "Yes" : "No",
      (v.availability as any)?.beforeConference ? "Yes" : "No",
      v.whyVolunteer || "",
      v.status,
      v.assignedCommittee || "",
      v.notes || "",
      v.reviewedBy || "",
      new Date(v.createdAt).toLocaleString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `volunteers_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Data exported successfully");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-600">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-600">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-600">Pending</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary">Volunteer Management</h1>
            <p className="text-muted-foreground">Manage conference volunteer applications</p>
          </div>
          <Link href="/admin">
            <Button variant="outline">← Back to Admin</Button>
          </Link>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-3xl font-bold">{stats.total}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <span className="text-3xl font-bold">{stats.pending}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-3xl font-bold">{stats.approved}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="text-3xl font-bold">{stats.rejected}</span>
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
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <Label>Status</Label>
                <Select
                  value={filters.status}
                  onValueChange={(value: any) => setFilters({ ...filters, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Committee</Label>
                <Select
                  value={filters.committee}
                  onValueChange={(value) => setFilters({ ...filters, committee: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All committees" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Committees</SelectItem>
                    {COMMITTEES.map((committee) => (
                      <SelectItem key={committee.id} value={committee.id}>
                        {committee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Academic Year</Label>
                <Select
                  value={filters.academicYear}
                  onValueChange={(value) => setFilters({ ...filters, academicYear: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Years</SelectItem>
                    <SelectItem value="1">Year 1</SelectItem>
                    <SelectItem value="2">Year 2</SelectItem>
                    <SelectItem value="3">Year 3</SelectItem>
                    <SelectItem value="4">Year 4</SelectItem>
                    <SelectItem value="graduate">Graduate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end gap-2">
                <Button onClick={handleExportToExcel} variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Dialog open={bulkEmailOpen} onOpenChange={setBulkEmailOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex-1">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Send Bulk Email to Volunteers</DialogTitle>
                      <DialogDescription>
                        Send an email to all volunteers matching the current filters.
                        {volunteers && volunteers.length > 0 && (
                          <span className="block mt-2 font-medium text-primary">
                            This will send to {volunteers.length} volunteer{volunteers.length !== 1 ? "s" : ""}.
                          </span>
                        )}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email-subject">Subject</Label>
                        <Input
                          id="email-subject"
                          value={emailData.subject}
                          onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                          placeholder="Email subject..."
                        />
                      </div>

                      <div>
                        <Label htmlFor="email-message">Message</Label>
                        <Textarea
                          id="email-message"
                          value={emailData.message}
                          onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                          placeholder="Email message..."
                          rows={8}
                        />
                      </div>

                      <div className="bg-muted p-3 rounded-md text-sm">
                        <p className="font-medium mb-2">Current Filters:</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Status: {filters.status === "all" ? "All" : filters.status}</li>
                          <li>• Committee: {filters.committee ? COMMITTEES.find(c => c.id === filters.committee)?.name : "All"}</li>
                          <li>• Academic Year: {filters.academicYear || "All"}</li>
                        </ul>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={handleSendBulkEmail}
                          disabled={sendBulkEmailMutation.isPending || !volunteers || volunteers.length === 0}
                          className="flex-1"
                        >
                          {sendBulkEmailMutation.isPending ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Mail className="w-4 h-4 mr-2" />
                              Send Email
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setBulkEmailOpen(false)}
                          disabled={sendBulkEmailMutation.isPending}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Volunteers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Volunteer Applications ({volunteers?.length || 0})</CardTitle>
            <CardDescription>Review and manage volunteer applications</CardDescription>
          </CardHeader>
          <CardContent>
            {!volunteers || volunteers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No volunteer applications found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Preferred Committee</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {volunteers.map((volunteer) => (
                      <TableRow key={volunteer.id}>
                        <TableCell className="font-mono text-sm">{volunteer.id}</TableCell>
                        <TableCell className="font-medium">{volunteer.fullName}</TableCell>
                        <TableCell className="text-sm">{volunteer.email}</TableCell>
                        <TableCell className="font-mono text-sm">{volunteer.studentId}</TableCell>
                        <TableCell>Year {volunteer.academicYear}</TableCell>
                        <TableCell className="text-sm">
                          {COMMITTEES.find((c) => c.id === volunteer.preferredCommittee)?.name || volunteer.preferredCommittee}
                        </TableCell>
                        <TableCell>{getStatusBadge(volunteer.status)}</TableCell>
                        <TableCell className="text-sm">
                          {volunteer.assignedCommittee
                            ? COMMITTEES.find((c) => c.id === volunteer.assignedCommittee)?.name || volunteer.assignedCommittee
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedVolunteer(volunteer);
                                  setReviewData({
                                    status: volunteer.status as any,
                                    assignedCommittee: volunteer.assignedCommittee || "",
                                    notes: volunteer.notes || "",
                                  });
                                }}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Volunteer Application Details</DialogTitle>
                                <DialogDescription>Review and update volunteer status</DialogDescription>
                              </DialogHeader>

                              {selectedVolunteer && (
                                <div className="space-y-6">
                                  {/* Personal Information */}
                                  <div className="space-y-3">
                                    <h3 className="font-semibold text-lg border-b pb-2">Personal Information</h3>
                                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                                      <div>
                                        <span className="font-medium">Full Name:</span> {selectedVolunteer.fullName}
                                      </div>
                                      <div>
                                        <span className="font-medium">Email:</span> {selectedVolunteer.email}
                                      </div>
                                      <div>
                                        <span className="font-medium">Phone:</span> {selectedVolunteer.phone}
                                      </div>
                                      <div>
                                        <span className="font-medium">Student ID:</span> {selectedVolunteer.studentId}
                                      </div>
                                      <div>
                                        <span className="font-medium">Academic Year:</span> Year {selectedVolunteer.academicYear}
                                      </div>
                                      <div>
                                        <span className="font-medium">Department:</span> {selectedVolunteer.department}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Committee Preferences */}
                                  <div className="space-y-3">
                                    <h3 className="font-semibold text-lg border-b pb-2">Committee Preferences</h3>
                                    <div className="space-y-2 text-sm">
                                      <div>
                                        <span className="font-medium">Preferred Committee:</span>{" "}
                                        {COMMITTEES.find((c) => c.id === selectedVolunteer.preferredCommittee)?.name ||
                                          selectedVolunteer.preferredCommittee}
                                      </div>
                                      {selectedVolunteer.secondChoiceCommittee && (
                                        <div>
                                          <span className="font-medium">Second Choice:</span>{" "}
                                          {COMMITTEES.find((c) => c.id === selectedVolunteer.secondChoiceCommittee)?.name ||
                                            selectedVolunteer.secondChoiceCommittee}
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Skills and Experience */}
                                  {(selectedVolunteer.skills || selectedVolunteer.previousExperience) && (
                                    <div className="space-y-3">
                                      <h3 className="font-semibold text-lg border-b pb-2">Skills & Experience</h3>
                                      {selectedVolunteer.skills && (
                                        <div className="text-sm">
                                          <span className="font-medium">Skills:</span>
                                          <p className="mt-1 text-muted-foreground">{selectedVolunteer.skills}</p>
                                        </div>
                                      )}
                                      {selectedVolunteer.previousExperience && (
                                        <div className="text-sm">
                                          <span className="font-medium">Previous Experience:</span>
                                          <p className="mt-1 text-muted-foreground">{selectedVolunteer.previousExperience}</p>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Availability */}
                                  <div className="space-y-3">
                                    <h3 className="font-semibold text-lg border-b pb-2">Availability</h3>
                                    <div className="flex gap-4 text-sm">
                                      <div>
                                        <Badge variant={(selectedVolunteer.availability as any)?.day1 ? "default" : "outline"}>
                                          Day 1: {(selectedVolunteer.availability as any)?.day1 ? "Available" : "Not Available"}
                                        </Badge>
                                      </div>
                                      <div>
                                        <Badge variant={(selectedVolunteer.availability as any)?.day2 ? "default" : "outline"}>
                                          Day 2: {(selectedVolunteer.availability as any)?.day2 ? "Available" : "Not Available"}
                                        </Badge>
                                      </div>
                                      <div>
                                        <Badge variant={(selectedVolunteer.availability as any)?.beforeConference ? "default" : "outline"}>
                                          Before Conference:{" "}
                                          {(selectedVolunteer.availability as any)?.beforeConference ? "Available" : "Not Available"}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Motivation */}
                                  <div className="space-y-3">
                                    <h3 className="font-semibold text-lg border-b pb-2">Why Volunteer?</h3>
                                    <p className="text-sm text-muted-foreground">{selectedVolunteer.whyVolunteer}</p>
                                  </div>

                                  {/* Review Section */}
                                  <div className="space-y-4 border-t pt-4">
                                    <h3 className="font-semibold text-lg">Review & Update</h3>

                                    <div className="grid md:grid-cols-2 gap-4">
                                      <div>
                                        <Label>Status</Label>
                                        <Select
                                          value={reviewData.status}
                                          onValueChange={(value: any) => setReviewData({ ...reviewData, status: value })}
                                        >
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="approved">Approved</SelectItem>
                                            <SelectItem value="rejected">Rejected</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      <div>
                                        <Label>Assigned Committee</Label>
                                        <Select
                                          value={reviewData.assignedCommittee}
                                          onValueChange={(value) => setReviewData({ ...reviewData, assignedCommittee: value })}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select committee" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="">Not Assigned</SelectItem>
                                            {COMMITTEES.map((committee) => (
                                              <SelectItem key={committee.id} value={committee.id}>
                                                {committee.name}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>

                                    <div>
                                      <Label>Admin Notes</Label>
                                      <Textarea
                                        value={reviewData.notes}
                                        onChange={(e) => setReviewData({ ...reviewData, notes: e.target.value })}
                                        placeholder="Add any notes about this volunteer..."
                                        rows={3}
                                      />
                                    </div>

                                    <div className="flex gap-3">
                                      <Button
                                        onClick={() => handleReview(selectedVolunteer.id)}
                                        disabled={updateStatusMutation.isPending}
                                        className="flex-1"
                                      >
                                        {updateStatusMutation.isPending ? (
                                          <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Updating...
                                          </>
                                        ) : (
                                          "Update Status"
                                        )}
                                      </Button>
                                      <Button
                                        variant="destructive"
                                        onClick={() => {
                                          if (confirm("Are you sure you want to delete this application?")) {
                                            deleteMutation.mutate({ id: selectedVolunteer.id });
                                          }
                                        }}
                                        disabled={deleteMutation.isPending}
                                      >
                                        {deleteMutation.isPending ? (
                                          <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Deleting...
                                          </>
                                        ) : (
                                          "Delete"
                                        )}
                                      </Button>
                                    </div>
                                  </div>

                                  {/* Metadata */}
                                  <div className="text-xs text-muted-foreground border-t pt-3">
                                    <p>Application submitted: {new Date(selectedVolunteer.createdAt).toLocaleString()}</p>
                                    {selectedVolunteer.reviewedBy && (
                                      <p>
                                        Reviewed by: {selectedVolunteer.reviewedBy} on{" "}
                                        {new Date(selectedVolunteer.reviewedAt).toLocaleString()}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
