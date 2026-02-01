import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

interface SpeakerFormData {
  id?: number;
  fullName: string;
  title: string;
  affiliation: string;
  presentationTitle: string;
  presentationTitleAr: string;
  presentationAbstract: string;
  bio: string;
  bioAr: string;
  photoUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  websiteUrl: string;
  displayOrder: number;
  isVisible: boolean;
}

const initialFormData: SpeakerFormData = {
  fullName: "",
  title: "",
  affiliation: "",
  presentationTitle: "",
  presentationTitleAr: "",
  presentationAbstract: "",
  bio: "",
  bioAr: "",
  photoUrl: "",
  linkedinUrl: "",
  twitterUrl: "",
  websiteUrl: "",
  displayOrder: 0,
  isVisible: true,
};

export default function KeynoteSpeakersManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<SpeakerFormData>(initialFormData);
  const [isEditing, setIsEditing] = useState(false);

  const utils = trpc.useUtils();
  const { data: speakers, isLoading } = trpc.keynoteSpeakers.listAll.useQuery();

  const createMutation = trpc.keynoteSpeakers.create.useMutation({
    onSuccess: () => {
      utils.keynoteSpeakers.listAll.invalidate();
      setIsDialogOpen(false);
      setFormData(initialFormData);
      alert("Keynote speaker created successfully!");
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const updateMutation = trpc.keynoteSpeakers.update.useMutation({
    onSuccess: () => {
      utils.keynoteSpeakers.listAll.invalidate();
      setIsDialogOpen(false);
      setFormData(initialFormData);
      setIsEditing(false);
      alert("Keynote speaker updated successfully!");
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const deleteMutation = trpc.keynoteSpeakers.delete.useMutation({
    onSuccess: () => {
      utils.keynoteSpeakers.listAll.invalidate();
      alert("Keynote speaker deleted successfully!");
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && formData.id) {
      updateMutation.mutate(formData as Required<SpeakerFormData>);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (speaker: any) => {
    setFormData({
      id: speaker.id,
      fullName: speaker.fullName,
      title: speaker.title,
      affiliation: speaker.affiliation,
      presentationTitle: speaker.presentationTitle,
      presentationTitleAr: speaker.presentationTitleAr || "",
      presentationAbstract: speaker.presentationAbstract || "",
      bio: speaker.bio || "",
      bioAr: speaker.bioAr || "",
      photoUrl: speaker.photoUrl || "",
      linkedinUrl: speaker.linkedinUrl || "",
      twitterUrl: speaker.twitterUrl || "",
      websiteUrl: speaker.websiteUrl || "",
      displayOrder: speaker.displayOrder,
      isVisible: speaker.isVisible,
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      deleteMutation.mutate({ id });
    }
  };

  const handleAddNew = () => {
    setFormData(initialFormData);
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Keynote Speakers Management</h1>
          <p className="text-muted-foreground">Manage keynote speakers for SCI 2026</p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="w-4 h-4 mr-2" />
          Add Speaker
        </Button>
      </div>

      <div className="grid gap-4">
        {speakers && speakers.length > 0 ? (
          speakers.map((speaker) => (
            <Card key={speaker.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    {speaker.photoUrl && (
                      <img
                        src={speaker.photoUrl}
                        alt={speaker.fullName}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {speaker.fullName}
                        {!speaker.isVisible && (
                          <EyeOff className="w-4 h-4 text-muted-foreground" />
                        )}
                      </CardTitle>
                      <CardDescription>
                        {speaker.title} | {speaker.affiliation}
                      </CardDescription>
                      <p className="text-sm font-medium mt-2">{speaker.presentationTitle}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(speaker)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(speaker.id, speaker.fullName)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No keynote speakers yet. Click "Add Speaker" to create one.
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit" : "Add"} Keynote Speaker</DialogTitle>
            <DialogDescription>
              Fill in the speaker information below
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Major General Dr., Prof. Dr."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="affiliation">Affiliation *</Label>
              <Input
                id="affiliation"
                value={formData.affiliation}
                onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="presentationTitle">Presentation Title (English) *</Label>
              <Input
                id="presentationTitle"
                value={formData.presentationTitle}
                onChange={(e) => setFormData({ ...formData, presentationTitle: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="presentationTitleAr">Presentation Title (Arabic)</Label>
              <Input
                id="presentationTitleAr"
                value={formData.presentationTitleAr}
                onChange={(e) => setFormData({ ...formData, presentationTitleAr: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="presentationAbstract">Presentation Abstract</Label>
              <Textarea
                id="presentationAbstract"
                rows={3}
                value={formData.presentationAbstract}
                onChange={(e) => setFormData({ ...formData, presentationAbstract: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biography (English)</Label>
              <Textarea
                id="bio"
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bioAr">Biography (Arabic)</Label>
              <Textarea
                id="bioAr"
                rows={3}
                value={formData.bioAr}
                onChange={(e) => setFormData({ ...formData, bioAr: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="photoUrl">Photo URL</Label>
              <Input
                id="photoUrl"
                placeholder="/images/speakers/name.jpg"
                value={formData.photoUrl}
                onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                <Input
                  id="linkedinUrl"
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitterUrl">Twitter URL</Label>
                <Input
                  id="twitterUrl"
                  type="url"
                  value={formData.twitterUrl}
                  onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="websiteUrl">Website URL</Label>
                <Input
                  id="websiteUrl"
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="isVisible">Visibility</Label>
                <Select
                  value={formData.isVisible ? "visible" : "hidden"}
                  onValueChange={(value) => setFormData({ ...formData, isVisible: value === "visible" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visible">Visible</SelectItem>
                    <SelectItem value="hidden">Hidden</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {isEditing ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
