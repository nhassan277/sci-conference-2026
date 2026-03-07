import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, Megaphone, CheckCircle, AlertTriangle, Info, Zap, Link, ArrowLeft, Send, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

const TYPE_CONFIG = {
  info: { label: "Info", color: "bg-blue-100 text-blue-800 border-blue-300", icon: Info, barColor: "bg-blue-600" },
  warning: { label: "Warning", color: "bg-yellow-100 text-yellow-800 border-yellow-300", icon: AlertTriangle, barColor: "bg-yellow-500" },
  success: { label: "Success", color: "bg-green-100 text-green-800 border-green-300", icon: CheckCircle, barColor: "bg-green-600" },
  urgent: { label: "Urgent", color: "bg-red-100 text-red-800 border-red-300", icon: Zap, barColor: "bg-red-600" },
};

type AnnouncementType = keyof typeof TYPE_CONFIG;

interface AnnouncementForm {
  message: string;
  messageAr: string;
  type: AnnouncementType;
  isActive: boolean;
  link: string;
  linkText: string;
}

const defaultForm: AnnouncementForm = {
  message: "",
  messageAr: "",
  type: "info",
  isActive: true,
  link: "",
  linkText: "",
};

export default function AnnouncementsManagement() {
  const [, setLocation] = useLocation();
  const [form, setForm] = useState<AnnouncementForm>(defaultForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const utils = trpc.useUtils();
  const { data: allAnnouncements, isLoading } = trpc.announcements.getAll.useQuery();

  const createMutation = trpc.announcements.create.useMutation({
    onSuccess: () => {
      toast.success("Announcement created and published!");
      utils.announcements.getAll.invalidate();
      utils.announcements.getActive.invalidate();
      setForm(defaultForm);
      setShowForm(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.announcements.update.useMutation({
    onSuccess: () => {
      toast.success("Announcement updated!");
      utils.announcements.getAll.invalidate();
      utils.announcements.getActive.invalidate();
      setForm(defaultForm);
      setEditingId(null);
      setShowForm(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const toggleMutation = trpc.announcements.toggleActive.useMutation({
    onSuccess: () => {
      utils.announcements.getAll.invalidate();
      utils.announcements.getActive.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = trpc.announcements.delete.useMutation({
    onSuccess: () => {
      toast.success("Announcement deleted.");
      utils.announcements.getAll.invalidate();
      utils.announcements.getActive.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const [sendingId, setSendingId] = useState<number | null>(null);
  const sendMutation = trpc.announcements.sendToRegistrants.useMutation({
    onSuccess: (data) => {
      toast.success(`✅ ${data.message}`);
      setSendingId(null);
    },
    onError: (err) => {
      toast.error(`Failed to send: ${err.message}`);
      setSendingId(null);
    },
  });

  const handleSendToRegistrants = (ann: { id: number; message: string }) => {
    if (!confirm(`Send this announcement to ALL registrants via email?\n\n"${ann.message.slice(0, 120)}${ann.message.length > 120 ? '...' : ''}"\n\nThis cannot be undone.`)) return;
    setSendingId(ann.id);
    sendMutation.mutate({ id: ann.id });
  };

  const handleSubmit = () => {
    if (!form.message.trim()) {
      toast.error("Message is required.");
      return;
    }
    const payload = {
      message: form.message.trim(),
      messageAr: form.messageAr.trim() || undefined,
      type: form.type,
      isActive: form.isActive,
      link: form.link.trim() || undefined,
      linkText: form.linkText.trim() || undefined,
    };
    if (editingId !== null) {
      updateMutation.mutate({ id: editingId, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleEdit = (ann: any) => {
    setForm({
      message: ann.message,
      messageAr: ann.messageAr || "",
      type: ann.type as AnnouncementType,
      isActive: ann.isActive,
      link: ann.link || "",
      linkText: ann.linkText || "",
    });
    setEditingId(ann.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setForm(defaultForm);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => setLocation("/admin")} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Button>
        <div className="flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold">Announcements Manager</h1>
        </div>
        <div className="ml-auto">
          {!showForm && (
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="w-4 h-4" /> New Announcement
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">

        {/* Live Preview Banner */}
        {showForm && form.message && (
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Live Preview</p>
            <div className={`w-full py-3 px-4 flex items-center gap-3 rounded-lg ${TYPE_CONFIG[form.type].barColor} text-white text-sm`}>
              {(() => { const Icon = TYPE_CONFIG[form.type].icon; return <Icon className="w-4 h-4 shrink-0" />; })()}
              <span className="flex-1">{form.message}</span>
              {form.link && form.linkText && (
                <span className="underline font-semibold text-xs">{form.linkText} →</span>
              )}
            </div>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {editingId !== null ? "Edit Announcement" : "Create New Announcement"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-1">
                  <Label>Message (English) *</Label>
                  <Textarea
                    placeholder="e.g. Abstract submission deadline extended to March 9, 2026"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={2}
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground text-right">{form.message.length}/500</p>
                </div>
                <div className="md:col-span-2 space-y-1">
                  <Label>Message (Arabic) <span className="text-muted-foreground text-xs">optional</span></Label>
                  <Textarea
                    placeholder="الرسالة بالعربية (اختياري)"
                    value={form.messageAr}
                    onChange={(e) => setForm({ ...form, messageAr: e.target.value })}
                    rows={2}
                    dir="rtl"
                    maxLength={500}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Type</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as AnnouncementType })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">ℹ️ Info (Blue)</SelectItem>
                      <SelectItem value="warning">⚠️ Warning (Yellow)</SelectItem>
                      <SelectItem value="success">✅ Success (Green)</SelectItem>
                      <SelectItem value="urgent">🚨 Urgent (Red)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Status</Label>
                  <div className="flex items-center gap-3 pt-2">
                    <Switch
                      checked={form.isActive}
                      onCheckedChange={(v) => setForm({ ...form, isActive: v })}
                    />
                    <span className="text-sm">{form.isActive ? "Active (visible to visitors)" : "Inactive (hidden)"}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="flex items-center gap-1"><Link className="w-3 h-3" /> CTA Link <span className="text-muted-foreground text-xs">optional</span></Label>
                  <Input
                    placeholder="https://..."
                    value={form.link}
                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label>CTA Button Text <span className="text-muted-foreground text-xs">optional</span></Label>
                  <Input
                    placeholder="e.g. Register Now"
                    value={form.linkText}
                    onChange={(e) => setForm({ ...form, linkText: e.target.value })}
                    maxLength={100}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleSubmit}
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="gap-2"
                >
                  {editingId !== null ? <><Edit2 className="w-4 h-4" /> Save Changes</> : <><Plus className="w-4 h-4" /> Publish Announcement</>}
                </Button>
                <Button variant="outline" onClick={handleCancel}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Announcements List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span>All Announcements</span>
              <Badge variant="outline">{allAnnouncements?.length ?? 0} total</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground text-center py-8">Loading...</p>
            ) : !allAnnouncements?.length ? (
              <div className="text-center py-12 space-y-2">
                <Megaphone className="w-10 h-10 text-muted-foreground mx-auto" />
                <p className="text-muted-foreground">No announcements yet. Create one to show a banner to all visitors.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {allAnnouncements.map((ann) => {
                  const config = TYPE_CONFIG[ann.type as AnnouncementType] || TYPE_CONFIG.info;
                  const Icon = config.icon;
                  return (
                    <div key={ann.id} className={`border-2 rounded-xl p-4 ${ann.isActive ? "border-green-200 bg-green-50/30" : "border-gray-200 bg-gray-50 opacity-60"}`}>
                      <div className="flex items-start gap-3">
                        <div className={`p-1.5 rounded-lg ${config.color} shrink-0`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{ann.message}</p>
                          {ann.messageAr && (
                            <p className="text-sm text-muted-foreground mt-1" dir="rtl">{ann.messageAr}</p>
                          )}
                          {ann.link && (
                            <a href={ann.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline mt-1 block truncate">
                              {ann.linkText || ann.link}
                            </a>
                          )}
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <Badge className={`text-xs ${config.color}`}>{config.label}</Badge>
                            <span className="text-xs text-muted-foreground">by {ann.createdByName}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(ann.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                          <Switch
                            checked={ann.isActive}
                            onCheckedChange={(v) => toggleMutation.mutate({ id: ann.id, isActive: v })}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5 text-xs border-blue-300 text-blue-700 hover:bg-blue-50"
                            disabled={sendingId === ann.id}
                            onClick={() => handleSendToRegistrants(ann)}
                            title="Send this announcement as email to all registrants"
                          >
                            {sendingId === ann.id ? (
                              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending...</>
                            ) : (
                              <><Send className="w-3.5 h-3.5" /> Email All</>
                            )}
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(ann)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => {
                              if (confirm("Delete this announcement?")) {
                                deleteMutation.mutate({ id: ann.id });
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
// checkpoint trigger Fri Mar  6 19:50:18 EST 2026

