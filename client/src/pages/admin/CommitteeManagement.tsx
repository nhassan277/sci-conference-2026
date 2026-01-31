import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Users } from "lucide-react";

// Simple toast replacement
const useToast = () => ({
  toast: ({ title, description, variant }: { title: string; description: string; variant?: string }) => {
    if (variant === 'destructive') {
      alert(`Error: ${title}\n${description}`);
    } else {
      alert(`${title}\n${description}`);
    }
  }
});

type CommitteeType = "scientific" | "organizing" | "reception" | "technical";

interface CommitteeFormData {
  fullName: string;
  title: string;
  committeeType: CommitteeType;
  department?: string;
  role?: string;
  email?: string;
  phone?: string;
  displayOrder: number;
}

export default function CommitteeManagement() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CommitteeFormData>({
    fullName: "",
    title: "",
    committeeType: "scientific",
    department: "",
    role: "",
    email: "",
    phone: "",
    displayOrder: 0,
  });

  const { data: committees, isLoading, refetch } = trpc.committee.getAll.useQuery();
  const createMutation = trpc.committee.create.useMutation();
  const updateMutation = trpc.committee.update.useMutation();
  const deleteMutation = trpc.committee.delete.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, ...formData });
        toast({
          title: "Success",
          description: "Committee member updated successfully",
        });
      } else {
        await createMutation.mutateAsync(formData);
        toast({
          title: "Success",
          description: "Committee member added successfully",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save committee member",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (committee: any) => {
    setEditingId(committee.id);
    setFormData({
      fullName: committee.fullName,
      title: committee.title,
      committeeType: committee.committeeType,
      department: committee.department || "",
      role: committee.role || "",
      email: committee.email || "",
      phone: committee.phone || "",
      displayOrder: committee.displayOrder,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      await deleteMutation.mutateAsync({ id });
      toast({
        title: "Success",
        description: "Committee member deleted successfully",
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete committee member",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      fullName: "",
      title: "",
      committeeType: "scientific",
      department: "",
      role: "",
      email: "",
      phone: "",
      displayOrder: 0,
    });
  };

  const committeeTypeLabels: Record<CommitteeType, string> = {
    scientific: "Scientific Committee",
    organizing: "Organizing Committee",
    reception: "Reception Committee",
    technical: "Technical Committee",
  };

  const groupedCommittees = committees?.reduce((acc, committee) => {
    const type = committee.committeeType;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(committee);
    return acc;
  }, {} as Record<string, typeof committees>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading committees...</div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Committee Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage conference committees and members
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>

      <div className="grid gap-6">
        {Object.entries(groupedCommittees || {}).map(([type, members]) => (
          <Card key={type}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                {committeeTypeLabels[type as CommitteeType]}
              </CardTitle>
              <CardDescription>
                {members.length} member{members.length !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-start justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-semibold">
                        {member.title} {member.fullName}
                      </div>
                      {member.department && (
                        <div className="text-sm text-muted-foreground">
                          {member.department}
                        </div>
                      )}
                      {member.role && (
                        <div className="text-sm text-muted-foreground">
                          Role: {member.role}
                        </div>
                      )}
                      {member.email && (
                        <div className="text-sm text-muted-foreground">
                          {member.email}
                        </div>
                      )}
                      {member.phone && (
                        <div className="text-sm text-muted-foreground">
                          {member.phone}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground mt-1">
                        Display Order: {member.displayOrder}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(member)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(member.id, member.fullName)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Committee Member" : "Add Committee Member"}
            </DialogTitle>
            <DialogDescription>
              Fill in the details for the committee member
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Prof., Dr., etc."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="committeeType">Committee Type *</Label>
              <Select
                value={formData.committeeType}
                onValueChange={(value: CommitteeType) =>
                  setFormData({ ...formData, committeeType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scientific">Scientific Committee</SelectItem>
                  <SelectItem value="organizing">Organizing Committee</SelectItem>
                  <SelectItem value="reception">Reception Committee</SelectItem>
                  <SelectItem value="technical">Technical Committee</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                placeholder="e.g., Zoology, Physics (for scientific committees)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                placeholder="e.g., Chair, Co-chair, Member"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input
                id="displayOrder"
                type="number"
                value={formData.displayOrder}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    displayOrder: parseInt(e.target.value) || 0,
                  })
                }
              />
              <p className="text-xs text-muted-foreground">
                Lower numbers appear first
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingId ? "Update" : "Add"} Member
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
