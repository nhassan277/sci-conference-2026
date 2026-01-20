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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Shield, UserPlus, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export default function AdminManagement() {
  const { user, loading: authLoading, logout, login, isAuthenticated, isAdmin } = useUser();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);

  // Form state for adding new admin
  const [newAdmin, setNewAdmin] = useState({
    openId: "",
    email: "",
    name: "",
    role: "viewer" as "super_admin" | "moderator" | "viewer",
  });

  const { data: admins, refetch } = trpc.adminManagement.list.useQuery();
  const { data: currentAdmin } = trpc.adminManagement.me.useQuery();
  const createMutation = trpc.adminManagement.create.useMutation();
  const updateRoleMutation = trpc.adminManagement.updateRole.useMutation();
  const removeMutation = trpc.adminManagement.remove.useMutation();

  // Redirect if not admin
  if (!authLoading && (!isAuthenticated || !isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-white">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Super Admin Access Required</CardTitle>
            <CardDescription>
              This page is for super administrators only.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isAuthenticated ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Please log in with a super admin account to continue.
                </p>
                <Button onClick={login} className="w-full">
                  Log In
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  Your account does not have super admin privileges.
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

  // Check if current user is super admin
  const isSuperAdmin = currentAdmin?.role === "super_admin";

  const handleAddAdmin = async () => {
    try {
      await createMutation.mutateAsync(newAdmin);
      toast.success("Admin added successfully");
      setIsAddDialogOpen(false);
      setNewAdmin({ openId: "", email: "", name: "", role: "viewer" });
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to add admin");
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedAdmin) return;
    try {
      await updateRoleMutation.mutateAsync({
        id: selectedAdmin.id,
        role: selectedAdmin.role,
      });
      toast.success("Admin role updated successfully");
      setIsEditDialogOpen(false);
      setSelectedAdmin(null);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to update admin role");
    }
  };

  const handleRemoveAdmin = async (id: number) => {
    if (!confirm("Are you sure you want to remove this admin?")) return;
    try {
      await removeMutation.mutateAsync({ id });
      toast.success("Admin removed successfully");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to remove admin");
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "super_admin":
        return <Badge className="bg-red-500">Super Admin</Badge>;
      case "moderator":
        return <Badge className="bg-blue-500">Moderator</Badge>;
      case "viewer":
        return <Badge variant="secondary">Viewer</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="w-8 h-8" />
            Admin Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage administrator accounts and permissions
          </p>
        </div>
        {isSuperAdmin && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Add Admin
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Administrator</DialogTitle>
                <DialogDescription>
                  Add a new administrator with specific role and permissions.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="openId">Open ID</Label>
                  <Input
                    id="openId"
                    value={newAdmin.openId}
                    onChange={(e) => setNewAdmin({ ...newAdmin, openId: e.target.value })}
                    placeholder="User's Open ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                    placeholder="admin@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newAdmin.name}
                    onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                    placeholder="Admin Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={newAdmin.role}
                    onValueChange={(value: any) => setNewAdmin({ ...newAdmin, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="super_admin">Super Admin (Full Access)</SelectItem>
                      <SelectItem value="moderator">Moderator (Limited Write)</SelectItem>
                      <SelectItem value="viewer">Viewer (Read Only)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddAdmin} disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Adding..." : "Add Admin"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {!isSuperAdmin && (
        <Card className="mb-6 border-yellow-500">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              You have {currentAdmin?.role} access. Only super admins can manage other administrators.
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Administrators</CardTitle>
          <CardDescription>
            {admins?.length || 0} administrator{admins?.length !== 1 ? "s" : ""} with access to the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Added</TableHead>
                {isSuperAdmin && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins?.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="font-medium">{admin.name}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{getRoleBadge(admin.role)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(admin.createdAt), { addSuffix: true })}
                  </TableCell>
                  {isSuperAdmin && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedAdmin(admin);
                            setIsEditDialogOpen(true);
                          }}
                          disabled={admin.openId === process.env.OWNER_OPEN_ID}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveAdmin(admin.id)}
                          disabled={
                            admin.openId === process.env.OWNER_OPEN_ID || admin.id === currentAdmin?.id
                          }
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Admin Role</DialogTitle>
            <DialogDescription>
              Change the role and permissions for {selectedAdmin?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editRole">Role</Label>
              <Select
                value={selectedAdmin?.role}
                onValueChange={(value: any) =>
                  setSelectedAdmin({ ...selectedAdmin, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super Admin (Full Access)</SelectItem>
                  <SelectItem value="moderator">Moderator (Limited Write)</SelectItem>
                  <SelectItem value="viewer">Viewer (Read Only)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRole} disabled={updateRoleMutation.isPending}>
              {updateRoleMutation.isPending ? "Updating..." : "Update Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
