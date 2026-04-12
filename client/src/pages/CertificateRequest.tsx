import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, CheckCircle2, ArrowLeft, GraduationCap, Users, Presentation, FlaskConical } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

type CertType = "attendance" | "participation" | "organization" | "workshop" | "";

export default function CertificateRequest() {
  const [, setLocation] = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const [refId, setRefId] = useState<number | null>(null);

  const [form, setForm] = useState({
    nameOnCertificate: "",
    email: "",
    affiliation: "",
    certificateType: "" as CertType,
    presentationTitle: "",
    presentationType: "" as "poster" | "oral" | "workshop_organizer" | "invited_speaker" | "",
    organizationRole: "",
    workshopName: "",
    additionalNotes: "",
  });

  const submit = trpc.certificates.submit.useMutation({
    onSuccess: (data) => {
      setRefId(data.id);
      setSubmitted(true);
      toast.success("Certificate request submitted successfully!");
    },
    onError: (err) => {
      toast.error("Failed to submit request: " + err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.certificateType) {
      toast.error("Please select a certificate type.");
      return;
    }
    if (form.certificateType === "participation" && !form.presentationTitle) {
      toast.error("Please enter your presentation/poster title.");
      return;
    }
    if (form.certificateType === "organization" && !form.organizationRole) {
      toast.error("Please describe your role in the conference organization.");
      return;
    }
    if (form.certificateType === "workshop" && !form.workshopName) {
      toast.error("Please enter the workshop name.");
      return;
    }
    submit.mutate({
      nameOnCertificate: form.nameOnCertificate,
      email: form.email,
      affiliation: form.affiliation,
      certificateType: form.certificateType as "attendance" | "participation" | "organization" | "workshop",
      presentationTitle: form.presentationTitle || undefined,
      presentationType: (form.presentationType as any) || undefined,
      organizationRole: form.organizationRole || undefined,
      workshopName: form.workshopName || undefined,
      additionalNotes: form.additionalNotes || undefined,
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white flex items-center justify-center p-4">
        <Card className="max-w-lg w-full text-center shadow-lg">
          <CardContent className="pt-10 pb-10 space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-primary">Request Submitted!</h2>
              <p className="text-lg font-semibold text-green-700" dir="rtl">تم إرسال طلبك بنجاح!</p>
              {refId && (
                <Badge variant="outline" className="text-sm px-4 py-1">
                  Reference ID: #{refId}
                </Badge>
              )}
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground space-y-1">
              <p>Your certificate request has been received and will be reviewed by the conference team.</p>
              <p dir="rtl" className="text-xs mt-2">سيتم مراجعة طلبك من قِبل فريق المؤتمر وإرسال الشهادة على بريدك الإلكتروني.</p>
            </div>
            <Button onClick={() => setLocation("/")} variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setLocation("/")} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <span className="font-semibold text-primary">Certificate Request | طلب شهادة</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-12 max-w-2xl">
        {/* Page Title */}
        <div className="text-center space-y-3 mb-10">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Award className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-primary">Request Your Certificate</h1>
          <p className="text-xl font-semibold text-secondary" dir="rtl">طلب شهادة المشاركة</p>
          <p className="text-muted-foreground">
            SCI 2026 — Faculty of Science, Cairo University — April 7–8, 2026
          </p>
        </div>

        {/* Certificate Type Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { type: "attendance", icon: Users, label: "Attendance", labelAr: "حضور", desc: "I attended the conference" },
            { type: "participation", icon: Presentation, label: "Participation", labelAr: "مشاركة بحثية", desc: "I presented a poster or talk" },
            { type: "organization", icon: GraduationCap, label: "Organization", labelAr: "تنظيم", desc: "I helped organize the conference" },
            { type: "workshop", icon: FlaskConical, label: "Workshop", labelAr: "ورشة عمل", desc: "I attended a workshop" },
          ].map(({ type, icon: Icon, label, labelAr, desc }) => (
            <button
              key={type}
              type="button"
              onClick={() => setForm(f => ({ ...f, certificateType: type as CertType }))}
              className={`p-4 rounded-xl border-2 text-center transition-all cursor-pointer ${
                form.certificateType === type
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border hover:border-primary/40 bg-white"
              }`}
            >
              <Icon className={`w-6 h-6 mx-auto mb-2 ${form.certificateType === type ? "text-primary" : "text-muted-foreground"}`} />
              <p className={`font-semibold text-sm ${form.certificateType === type ? "text-primary" : "text-foreground"}`}>{label}</p>
              <p className="text-xs text-muted-foreground" dir="rtl">{labelAr}</p>
              <p className="text-xs text-muted-foreground mt-1 hidden sm:block">{desc}</p>
            </button>
          ))}
        </div>

        {/* Form */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Personal Information | المعلومات الشخصية</CardTitle>
            <CardDescription>
              Please fill in your details exactly as you want them to appear on the certificate.
              <br />
              <span dir="rtl" className="text-xs">يرجى ملء بياناتك كما تريدها أن تظهر على الشهادة.</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name on Certificate */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="font-medium">
                  Name on Certificate <span className="text-red-500">*</span>
                  <span className="text-muted-foreground font-normal text-xs ml-2">(as you want it printed)</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Dr. Nourhan Hassan"
                  value={form.nameOnCertificate}
                  onChange={e => setForm(f => ({ ...f, nameOnCertificate: e.target.value }))}
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="font-medium">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>

              {/* Affiliation */}
              <div className="space-y-1.5">
                <Label htmlFor="affiliation" className="font-medium">
                  Affiliation / Institution <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="affiliation"
                  placeholder="e.g., Faculty of Science, Cairo University"
                  value={form.affiliation}
                  onChange={e => setForm(f => ({ ...f, affiliation: e.target.value }))}
                  required
                />
              </div>

              {/* Conditional: Workshop fields */}
              {form.certificateType === "workshop" && (
                <div className="space-y-1.5 pt-2 border-t">
                  <p className="text-sm font-semibold text-primary">Workshop Details | تفاصيل الورشة</p>
                  <Label htmlFor="workshopName" className="font-medium">
                    Workshop Name <span className="text-red-500">*</span>
                    <span className="text-muted-foreground font-normal text-xs ml-2 block" dir="rtl">اسم الورشة كما تريده على الشهادة</span>
                  </Label>
                  <Input
                    id="workshopName"
                    placeholder="e.g., Advanced Microscopy Techniques Workshop"
                    value={form.workshopName}
                    onChange={e => setForm(f => ({ ...f, workshopName: e.target.value }))}
                  />
                </div>
              )}

              {/* Conditional: Participation fields */}
              {form.certificateType === "participation" && (
                <div className="space-y-4 pt-2 border-t">
                  <p className="text-sm font-semibold text-primary">Presentation Details | تفاصيل المشاركة البحثية</p>

                  <div className="space-y-1.5">
                    <Label htmlFor="presTitle" className="font-medium">
                      Title of Poster / Presentation <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="presTitle"
                      placeholder="Enter the full title of your poster or oral presentation"
                      value={form.presentationTitle}
                      onChange={e => setForm(f => ({ ...f, presentationTitle: e.target.value }))}
                      rows={2}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="font-medium">Presentation Type</Label>
                    <Select
                      value={form.presentationType}
                      onValueChange={v => setForm(f => ({ ...f, presentationType: v as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="poster">Poster Presentation</SelectItem>
                        <SelectItem value="oral">Oral Presentation</SelectItem>
                        <SelectItem value="invited_speaker">Invited Speaker</SelectItem>
                        <SelectItem value="workshop_organizer">Workshop Organizer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Conditional: Organization role */}
              {form.certificateType === "organization" && (
                <div className="space-y-1.5 pt-2 border-t">
                  <p className="text-sm font-semibold text-primary">Organization Role | دور في التنظيم</p>
                  <Label htmlFor="orgRole" className="font-medium">
                    Your Role in the Conference <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="orgRole"
                    placeholder="e.g., Scientific Committee Member, Session Chair, Volunteer"
                    value={form.organizationRole}
                    onChange={e => setForm(f => ({ ...f, organizationRole: e.target.value }))}
                  />
                </div>
              )}

              {/* Additional Notes */}
              <div className="space-y-1.5">
                <Label htmlFor="notes" className="font-medium">
                  Additional Notes <span className="text-muted-foreground font-normal text-xs">(optional)</span>
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information you'd like to include..."
                  value={form.additionalNotes}
                  onChange={e => setForm(f => ({ ...f, additionalNotes: e.target.value }))}
                  rows={2}
                />
              </div>

              {/* Submit */}
              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full text-base py-5"
                  disabled={submit.isPending || !form.certificateType}
                >
                  {submit.isPending ? "Submitting..." : "Submit Certificate Request | إرسال الطلب"}
                </Button>
                {!form.certificateType && (
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Please select a certificate type above to continue.
                  </p>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
