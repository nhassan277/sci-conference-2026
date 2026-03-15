import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Upload, AlertCircle, X, ImageIcon, Calculator } from "lucide-react";

const registrationSchema = z.object({
  fullNameEnglish: z.string().min(1, "English name is required"),
  fullNameArabic: z.string().min(1, "Arabic name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  affiliation: z.string().min(1, "Affiliation is required"),
  attendeeCategory: z.enum(["student", "faculty", "researcher", "industry"]),
  participationType: z.literal("attendee"),
  wantsCertificate: z.boolean(),
  wantsWorkshop: z.boolean(),
  workshopChoice: z.enum(["nawah", "marc", "medsol", "agitech"]).optional(),
  wantsExtWorkshop: z.boolean(),
  extWorkshopChoice: z.string().optional(),
});
type RegistrationFormData = z.infer<typeof registrationSchema>;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}

function InvoiceUpload({
  label, labelAr, file, onFileChange, required,
}: {
  label: string; labelAr: string; file: File | null; onFileChange: (f: File | null) => void; required?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-2">
      <Label>{label} {required && <span className="text-red-500">*</span>}</Label>
      <p className="text-xs text-muted-foreground" dir="rtl">{labelAr}</p>
      {file ? (
        <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <ImageIcon className="w-5 h-5 text-green-600 shrink-0" />
          <span className="text-sm text-green-800 truncate flex-1">{file.name}</span>
          <button type="button" onClick={() => onFileChange(null)} className="text-red-400 hover:text-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Click to upload invoice photo (JPG, PNG, PDF)</p>
          <p className="text-xs text-muted-foreground mt-1" dir="rtl">اضغط لرفع صورة الإيصال</p>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => onFileChange(e.target.files?.[0] ?? null)} />
    </div>
  );
}

const ALL_WORKSHOPS = [
  { key: "chitosan", label: "Biotech Product Development 101", labelAr: "تطوير المنتجات في التكنولوجيا الحيوية", desc: "From scientific ideas to real products — startup building roadmap for biotech.", descAr: "من الأفكار العلمية إلى منتجات حقيقية — مسار بناء الشركات الناشئة.", date: "April 6, 2026 | 9:00 AM – 12:00 PM", dateAr: "٦ أبريل ٢٠٢٦ | ٩:٠٠ ص – ١٢:٠٠ ظ", by: "Chitosan", logo: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/GXxzRnTYsggXAHMu.png", eligibility: "3rd & 4th year undergrads + graduates | 30 spots only", fee: 100, tag: "Pre-Conference", tagColor: "bg-green-100 text-green-800" },
  { key: "agitech", label: "NGS & ddPCR in Targeted Therapy", labelAr: "تطبيقات NGS وddPCR في العلاج الموجه", desc: "From Basic Research to Precision Medicine: Applications of NGS and ddPCR in Targeted Therapy.", descAr: "من البحث الأساسي إلى الطب الدقيق: تطبيقات NGS و ddPCR في العلاج الموجه.", date: "April 6, 2026 | 12:00 – 2:00 PM", dateAr: "٦ أبريل ٢٠٢٦ | ١٢:٠٠ – ٢:٠٠ م", by: "Agitech", logo: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/qtvBAZFSrMqYBKkE.png", eligibility: "20 spots only", fee: 200, tag: "Pre-Conference", tagColor: "bg-green-100 text-green-800" },
  { key: "vaccine_industry", label: "The Vaccine Industry Race", labelAr: "سباق صناعة اللقاحات", desc: "Understanding the vaccine development pipeline, regulatory pathways, and careers in the vaccine industry.", descAr: "فهم مسار تطوير اللقاحات والمسارات التنظيمية والمسارات المهنية.", date: "April 6, 2026 | 2:00 – 5:00 PM", dateAr: "٦ أبريل ٢٠٢٦ | ٢:٠٠ – ٥:٠٠ م", by: "Jasmine Mohsen & Dr. Khaled Walid", logo: null, icon: "💉", eligibility: null, fee: 100, tag: "Pre-Conference", tagColor: "bg-green-100 text-green-800" },
  { key: "nawah", label: "NAWAH Scientific Workshop", labelAr: "ورشة عمل نواة للعلوم", desc: "Research to Business — Translating Science into Industry.", descAr: "من البحث إلى الأعمال — تحويل العلوم إلى صناعة.", date: "April 7–8, 2026", dateAr: "٧–٨ أبريل ٢٠٢٦", by: "NAWAH Scientific", logo: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/nawah_logo.png", eligibility: "30 spots only", fee: 200, tag: "During Conference", tagColor: "bg-amber-100 text-amber-800" },
  { key: "marc", label: "Good Clinical Practice (GCP) Workshop", labelAr: "ورشة الممارسة السريرية الجيدة", desc: "Comprehensive GCP training for clinical research professionals.", descAr: "تدريب شامل على الممارسة السريرية الجيدة للباحثين السريريين.", date: "April 8, 2026", dateAr: "٨ أبريل ٢٠٢٦", by: "MARC", logo: null, icon: "🏥", eligibility: "30 spots only", fee: 200, tag: "During Conference", tagColor: "bg-amber-100 text-amber-800" },
  { key: "medsol", label: "Nanopore & Protein Sequencing", labelAr: "تسلسل النانوبور والبروتين", desc: "From DNA to Proteins: Advanced Sequencing Technologies.", descAr: "من الحمض النووي إلى البروتينات: تقنيات التسلسل المتقدمة.", date: "April 7–8, 2026", dateAr: "٧–٨ أبريل ٢٠٢٦", by: "Medsol Corporation", logo: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/medsol_logo.png", eligibility: "30 spots only", fee: 200, tag: "During Conference", tagColor: "bg-amber-100 text-amber-800" },
  { key: "geochemistry", label: "Geochemistry Workshop", labelAr: "ورشة عمل الجيوكيمياء", desc: "Hands-on geochemistry training covering analytical techniques and field applications.", descAr: "تدريب عملي في الجيوكيمياء يغطي تقنيات التحليل والتطبيقات الميدانية.", date: "April 7–8, 2026 (2 days)", dateAr: "٧–٨ أبريل ٢٠٢٦ (يومان)", by: "Faculty of Science — Geology Dept.", logo: null, icon: "🌍", eligibility: null, fee: 0, tag: "During Conference", tagColor: "bg-amber-100 text-amber-800", isFree: true },
  { key: "scrna_seq", label: "Introduction to Single Cell Genomics", labelAr: "مقدمة في جينوميات الخلية الواحدة", desc: "scRNA-seq Analysis in Cancer — Hands-on computational training in R. Bring your laptop.", descAr: "تحليل scRNA-seq في السرطان — تدريب حاسوبي عملي بلغة R. أحضر لابتوبك.", date: "April 9, 2026 | 10:00 AM – 1:00 PM", dateAr: "٩ أبريل ٢٠٢٦ | ١٠:٠٠ ص – ١:٠٠ م", by: "EG-CompBio", logo: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/VSqePLOAbshMxznI.png", eligibility: "Intermediate to advanced level · 30 spots only", fee: 200, tag: "Post-Conference", tagColor: "bg-purple-100 text-purple-800" },
  { key: "ai_biotech", label: "AI Meets Biotech", labelAr: "الذكاء الاصطناعي يلتقي بالتكنولوجيا الحيوية", desc: "How to leverage AI in Biotechnology — Predict 3D structures of proteins, genes & enzymes.", descAr: "كيفية توظيف الذكاء الاصطناعي في التكنولوجيا الحيوية — التنبؤ بالبنى ثلاثية الأبعاد.", date: "April 9, 2026 | 1:00 – 3:00 PM", dateAr: "٩ أبريل ٢٠٢٦ | ١:٠٠ – ٣:٠٠ م", by: "AI بالعربي", logo: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/QvdupTbEZQQzfgEz.jpeg", eligibility: null, fee: 100, tag: "Post-Conference", tagColor: "bg-purple-100 text-purple-800" },
  { key: "gesr_scholarships", label: "From Lab to Global Opportunities", labelAr: "من المختبر إلى العالم: كيف تستعد للمنح والبحث في الخارج", desc: "A 3-hour workshop by GESR covering international scholarships, academic CV, motivation letter, and research abroad.", descAr: "ورشة عمل مدتها 3 ساعات من تقديم GESR تغطي المنح الدولية والسيرة الذاتية الأكاديمية.", date: "Thursday, April 9, 2026 | 3:00 – 6:00 PM", dateAr: "الخميس ٩ أبريل ٢٠٢٦ | ٣:٠٠ م – ٦:٠٠ م", by: "GESR", logo: "https://d2xsxph8kpxj0f.cloudfront.net/118031311/BK5ELr97meyN2f7P5B76DF/GESR-logo_7866e6d3.jpg", eligibility: "Open to undergrads, master's, PhD, early-career researchers", fee: 0, tag: "Post-Conference", tagColor: "bg-purple-100 text-purple-800", isFree: true },
  { key: "hvd_genomics", label: "Integrating Genomics & Proteomics in Biopharma R&D", labelAr: "دمج الجينوميكس والبروتيوميكس في أبحاث وتطوير الأدوية الحيوية", desc: "Bridging Omics Technologies for Drug Discovery — Hands-on workshop on genomics & proteomics integration.", descAr: "تقنيات الأوميكس لاكتشاف الأدوية — ورشة عملية على دمج الجينوميكس والبروتيوميكس.", date: "Sunday, April 12, 2026 — Full Day (~5 Hours)", dateAr: "الأحد ١٢ أبريل ٢٠٢٦ — يوم كامل (~٥ ساعات)", by: "HVD Life Sciences — New Cairo", logo: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/NlYUUYlTeGQwRRXp.png", eligibility: "20 spots only", fee: 200, tag: "Post-Conference", tagColor: "bg-purple-100 text-purple-800" },
  { key: "colors_metagenomics", label: "Metagenomics, Microbiome & 16S rRNA Sequencing", labelAr: "الميتاجينوميكس، الميكروبيوم وتسلسل الـ 16S rRNA", desc: "Hands-on workshop on metagenomics, microbiome analysis, and 16S rRNA sequencing.", descAr: "ورشة عملية في الميتاجينوميكس وتحليل الميكروبيوم وتسلسل الـ 16S rRNA.", date: "Date & Time — To Be Announced", dateAr: "سيتم الإعلان عن التاريخ والوقت قريباً", by: "Colors Educational Hub", logo: "https://d2xsxph8kpxj0f.cloudfront.net/118031311/BK5ELr97meyN2f7P5B76DF/logo_colors_52f6762b.png", eligibility: "25 spots only", fee: 200, tag: "TBA", tagColor: "bg-gray-100 text-gray-700" },
] as const;

export default function Attendance() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [wantsCertificate, setWantsCertificate] = useState(false);
  const [selectedWorkshops, setSelectedWorkshops] = useState<Set<string>>(new Set());
  const [workshopInvoiceFiles, setWorkshopInvoiceFiles] = useState<Record<string, File | null>>({});
  const [certInvoiceFile, setCertInvoiceFile] = useState<File | null>(null);
  const [uploadingInvoice, setUploadingInvoice] = useState(false);

  const CERTIFICATE_FEE = 100;
  const certFee = wantsCertificate ? CERTIFICATE_FEE : 0;
  const workshopFees = Array.from(selectedWorkshops).reduce((sum, key) => {
    const ws = ALL_WORKSHOPS.find(w => w.key === key);
    return sum + (ws?.fee ?? 0);
  }, 0);
  const totalFee = certFee + workshopFees;

  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: { participationType: "attendee", wantsCertificate: false, wantsWorkshop: false, wantsExtWorkshop: false },
  });

  const uploadInvoice = trpc.registration.uploadInvoice.useMutation();
  const uploadWorkshopInvoice = trpc.registration.uploadWorkshopInvoice.useMutation();

  const toggleWorkshop = (key: string) => {
    setSelectedWorkshops(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
        setWorkshopInvoiceFiles(f => { const n = { ...f }; delete n[key]; return n; });
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const createRegistration = trpc.registration.create.useMutation({
    onSuccess: async (data) => {
      setUploadingInvoice(true);
      try {
        if (wantsCertificate && certInvoiceFile) {
          const certBase64 = await fileToBase64(certInvoiceFile);
          await uploadInvoice.mutateAsync({ registrationId: data.id, invoiceType: "certificate", file: { data: certBase64, name: certInvoiceFile.name, type: certInvoiceFile.type } });
        }
        for (const key of Array.from(selectedWorkshops)) {
          const ws = ALL_WORKSHOPS.find(w => w.key === key);
          if (!ws || ws.fee === 0) continue;
          const invoiceFile = workshopInvoiceFiles[key];
          if (invoiceFile) {
            const base64 = await fileToBase64(invoiceFile);
            await uploadWorkshopInvoice.mutateAsync({ registrationId: data.id, workshopKey: key, file: { data: base64, name: invoiceFile.name, type: invoiceFile.type } });
          }
        }
      } catch {
        toast.error("Registration saved but invoice upload failed. Please contact us.");
      }
      setUploadingInvoice(false);
      setShowSuccess(true);
      toast.success("Registration submitted successfully!");
    },
    onError: (error) => { toast.error(`Registration failed: ${error.message}`); },
  });

  const onSubmit = handleSubmit((data) => {
    if (wantsCertificate && !certInvoiceFile) { toast.error("Please upload the certificate payment invoice."); return; }
    for (const key of Array.from(selectedWorkshops)) {
      const ws = ALL_WORKSHOPS.find(w => w.key === key);
      if (!ws || ws.fee === 0) continue;
      if (!workshopInvoiceFiles[key]) { toast.error(`Please upload the payment invoice for: ${ws.label}`); return; }
    }
    const selected = Array.from(selectedWorkshops);
    createRegistration.mutate({
      ...data,
      wantsCertificate,
      wantsWorkshop: selected.some(k => ["nawah","marc","medsol","agitech","geochemistry"].includes(k)),
      wantsExtWorkshop: selected.some(k => !["nawah","marc","medsol","agitech","geochemistry"].includes(k)),
      selectedWorkshops: selected.length > 0 ? selected : undefined,
    } as any);
  });

  const bankDetails = (
    <div className="p-3 bg-white border border-blue-300 rounded text-sm space-y-1" dir="rtl">
      <p className="font-semibold text-blue-900">ح/ صندوق الخدمات التعليمية</p>
      <p className="text-blue-800">كلية العلوم - جامعة القاهرة</p>
      <p className="text-blue-800">البنك المركزي المصري</p>
      <p className="text-blue-800">رقم الحساب: <span className="font-mono font-bold">9/450/88216/7</span></p>
    </div>
  );

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-accent/5 py-12 px-4">
        <Card className="max-w-2xl w-full border-2 border-green-200">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-3xl text-green-700">Registration Successful!</CardTitle>
            <CardDescription className="text-lg" dir="rtl">تم التسجيل بنجاح!</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">Thank you for registering for SCI 2026. We will contact you via email with further details.</p>
            <p className="text-muted-foreground" dir="rtl">شكراً لتسجيلك في مؤتمر SCI 2026. سنتواصل معك عبر البريد الإلكتروني بمزيد من التفاصيل.</p>
            {selectedWorkshops.size > 0 && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg space-y-2 text-left">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <p className="text-sm font-semibold text-amber-900">{selectedWorkshops.size} Workshop{selectedWorkshops.size > 1 ? "s" : ""} Registered ✓</p>
                </div>
                <ul className="text-xs text-amber-800 space-y-1">
                  {Array.from(selectedWorkshops).map(key => {
                    const ws = ALL_WORKSHOPS.find(w => w.key === key);
                    return ws ? <li key={key}>• {ws.label} {ws.fee === 0 ? "(Free — auto-confirmed)" : "(Invoice uploaded — pending review)"}</li> : null;
                  })}
                </ul>
              </div>
            )}
            <Button onClick={() => { setShowSuccess(false); setWantsCertificate(false); setSelectedWorkshops(new Set()); setWorkshopInvoiceFiles({}); setCertInvoiceFile(null); reset(); }} className="mt-6">
              Register Another Attendee | تسجيل مشارك آخر
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-accent/5 py-12 px-4">
      <div className="container max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">Attendance Registration</h1>
          <p className="text-2xl font-semibold text-secondary" dir="rtl">تسجيل الحضور</p>
          <p className="text-muted-foreground mt-4">Science at the Core of Innovation (SCI 2026) | April 7-8, 2026</p>
          <p className="text-sm text-muted-foreground mt-2">This form is for <strong>attendance only</strong>. If you plan to present research, please use the participation registration forms on the homepage.</p>
        </div>
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Attendee Information | معلومات المشارك</CardTitle>
            <CardDescription>Please fill in all required fields. All information will be kept confidential.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullNameEnglish">Full Name (English) <span className="text-red-500">*</span></Label>
                <Input id="fullNameEnglish" {...register("fullNameEnglish")} placeholder="John Doe" />
                {errors.fullNameEnglish && <p className="text-sm text-red-500">{errors.fullNameEnglish.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullNameArabic" dir="rtl">الاسم الكامل (بالعربية) <span className="text-red-500">*</span></Label>
                <Input id="fullNameArabic" {...register("fullNameArabic")} placeholder="محمد أحمد" dir="rtl" />
                {errors.fullNameArabic && <p className="text-sm text-red-500">{errors.fullNameArabic.message}</p>}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                  <Input id="email" type="email" {...register("email")} placeholder="john.doe@example.com" />
                  {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                  <Input id="phone" {...register("phone")} placeholder="+20 123 456 7890" />
                  {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="affiliation">Affiliation / Organization <span className="text-red-500">*</span></Label>
                <Input id="affiliation" {...register("affiliation")} placeholder="Cairo University, Faculty of Science" />
                {errors.affiliation && <p className="text-sm text-red-500">{errors.affiliation.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Attendee Category <span className="text-red-500">*</span></Label>
                <Select onValueChange={(value) => setValue("attendeeCategory", value as any, { shouldValidate: true })}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student / طالب</SelectItem>
                    <SelectItem value="faculty">Faculty Member / عضو هيئة تدريس</SelectItem>
                    <SelectItem value="researcher">Researcher / باحث</SelectItem>
                    <SelectItem value="industry">Industry Partner / شريك صناعي</SelectItem>
                  </SelectContent>
                </Select>
                {errors.attendeeCategory && <p className="text-sm text-red-500">{errors.attendeeCategory.message}</p>}
              </div>

              {/* Certificate Section */}
              <div className="space-y-4 p-4 border-2 rounded-lg bg-blue-50/50 border-blue-200">
                <div className="flex items-start space-x-3">
                  <Checkbox id="wantsCertificate" checked={wantsCertificate} onCheckedChange={(checked) => { const v = checked === true; setWantsCertificate(v); setValue("wantsCertificate", v); }} />
                  <div className="space-y-1">
                    <Label htmlFor="wantsCertificate" className="font-semibold cursor-pointer text-blue-900">I want to receive a participation certificate — 100 EGP</Label>
                    <p className="text-sm text-blue-700" dir="rtl">أرغب في الحصول على شهادة مشاركة — 100 جنيه مصري</p>
                  </div>
                </div>
                {wantsCertificate && (
                  <div className="space-y-4 mt-2">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
                      <p className="text-sm font-semibold text-blue-900 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Payment Instructions | تعليمات الدفع</p>
                      <p className="text-xs text-blue-800">Transfer <strong>100 EGP</strong> to the bank account below, then upload a photo of the transfer receipt. <strong>Uploading the invoice is mandatory for certificate printing.</strong></p>
                      <p className="text-xs text-blue-800" dir="rtl">حوّل <strong>100 جنيه مصري</strong> إلى الحساب البنكي التالي، ثم ارفع صورة إيصال التحويل أدناه. <strong>رفع الإيصال إلزامي لطباعة الشهادة.</strong></p>
                      {bankDetails}
                    </div>
                    <InvoiceUpload label="Upload Certificate Payment Invoice (Required)" labelAr="ارفع صورة إيصال دفع الشهادة (إلزامي)" file={certInvoiceFile} onFileChange={setCertInvoiceFile} required />
                    {wantsCertificate && !certInvoiceFile && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Invoice upload is required to complete certificate registration.</p>}
                  </div>
                )}
              </div>

              {/* Multi-Workshop Section */}
              <div className="space-y-4 p-4 border-2 rounded-lg bg-amber-50/50 border-amber-200">
                <div className="space-y-1">
                  <h3 className="font-bold text-amber-900 text-lg">🔬 Workshops (Optional — Select Any)</h3>
                  <p className="text-sm text-amber-700" dir="rtl">ورش العمل (اختياري — يمكنك اختيار أكثر من ورشة)</p>
                  <p className="text-xs text-amber-600">You can register for <strong>one or more workshops</strong>. Each paid workshop requires a separate payment invoice.</p>
                  <p className="text-xs text-amber-600" dir="rtl">يمكنك التسجيل في <strong>ورشة واحدة أو أكثر</strong>. كل ورشة مدفوعة تتطلب إيصال دفع منفصل.</p>
                </div>
                <div className="space-y-3">
                  {ALL_WORKSHOPS.map((ws) => {
                    const isSelected = selectedWorkshops.has(ws.key);
                    const isFree = ws.fee === 0;
                    return (
                      <div key={ws.key} className={`border-2 rounded-lg overflow-hidden transition-all ${isSelected ? "border-amber-500 bg-amber-50" : "border-muted bg-white hover:border-amber-300"}`}>
                        <div className="flex items-start gap-3 p-3 cursor-pointer" onClick={() => toggleWorkshop(ws.key)}>
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 ${isSelected ? "border-amber-500 bg-amber-500" : "border-muted-foreground"}`}>
                            {isSelected && <span className="text-white text-xs font-bold">✓</span>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              {ws.logo ? (
                                <img src={ws.logo} alt={ws.by} className="h-6 object-contain shrink-0" />
                              ) : (ws as any).icon ? (
                                <span className="text-xl">{(ws as any).icon}</span>
                              ) : null}
                              <p className="font-bold text-sm text-amber-900">{ws.label}</p>
                              <Badge className={`text-xs px-2 py-0 ${ws.tagColor}`}>{ws.tag}</Badge>
                              {isFree ? (
                                <Badge className="text-xs px-2 py-0 bg-green-100 text-green-800">FREE</Badge>
                              ) : (
                                <Badge className="text-xs px-2 py-0 bg-orange-100 text-orange-800">{ws.fee} EGP</Badge>
                              )}
                            </div>
                            <p className="text-xs font-medium text-amber-700 mb-1" dir="rtl">{ws.labelAr}</p>
                            <p className="text-xs text-muted-foreground">{ws.desc}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">📅 {ws.date}</p>
                            {ws.eligibility && <p className="text-xs text-orange-700 mt-0.5">🎓 {ws.eligibility}</p>}
                          </div>
                        </div>
                        {isSelected && !isFree && (
                          <div className="px-4 pb-4 space-y-3 border-t border-amber-200 bg-amber-50/80 pt-3">
                            <div className="p-3 bg-white border border-amber-300 rounded-lg space-y-2">
                              <p className="text-xs font-semibold text-amber-900 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Payment Required | مطلوب الدفع</p>
                              <p className="text-xs text-amber-800">Transfer <strong>{ws.fee} EGP</strong> to the bank account below and upload the receipt.</p>
                              {bankDetails}
                            </div>
                            <InvoiceUpload
                              label={`Upload Invoice for: ${ws.label}`}
                              labelAr={`ارفع إيصال دفع: ${ws.labelAr}`}
                              file={workshopInvoiceFiles[ws.key] ?? null}
                              onFileChange={(f) => setWorkshopInvoiceFiles(prev => ({ ...prev, [ws.key]: f }))}
                              required
                            />
                            {!workshopInvoiceFiles[ws.key] && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Invoice required to confirm your spot.</p>}
                          </div>
                        )}
                        {isSelected && isFree && (
                          <div className="px-4 pb-3 pt-2 border-t border-green-200 bg-green-50/80">
                            <p className="text-xs text-green-800 flex items-center gap-1">✅ <strong>This workshop is FREE — No payment required.</strong> Your spot will be confirmed automatically.</p>
                            <p className="text-xs text-green-700 mt-0.5" dir="rtl">هذه الورشة مجانية — لا يلزم الدفع. سيتم تأكيد مكانك تلقائياً.</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                  <span className="text-green-600 text-base mt-0.5">🎓</span>
                  <div>
                    <p className="text-xs font-bold text-green-800">Certificate of Completion | شهادة إتمام</p>
                    <p className="text-xs text-green-700 mt-0.5">All workshops provide a certified certificate co-signed by the organizing company and the <strong>Faculty of Science, Cairo University</strong>.</p>
                    <p className="text-xs text-green-700 mt-0.5" dir="rtl">جميع ورش العمل تمنح شهادة إتمام معتمدة موقّعة من الشركة المنظمة و<strong>كلية العلوم ، جامعة القاهرة</strong>.</p>
                  </div>
                </div>
              </div>

              {/* Fee Calculator */}
              {totalFee > 0 && (
                <div className="p-4 border-2 border-primary/30 rounded-lg bg-primary/5 space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Calculator className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-primary text-base">Fee Summary | ملخص الرسوم</h3>
                  </div>
                  <div className="space-y-2">
                    {certFee > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Participation Certificate | شهادة مشاركة</span>
                        <span className="font-semibold text-blue-700">{certFee} EGP</span>
                      </div>
                    )}
                    {Array.from(selectedWorkshops).map(key => {
                      const ws = ALL_WORKSHOPS.find(w => w.key === key);
                      if (!ws || ws.fee === 0) return null;
                      return (
                        <div key={key} className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">{ws.label}</span>
                          <span className="font-semibold text-amber-700">{ws.fee} EGP</span>
                        </div>
                      );
                    })}
                    {Array.from(selectedWorkshops).some(k => ALL_WORKSHOPS.find(w => w.key === k)?.fee === 0) && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Free Workshops | ورش مجانية</span>
                        <span className="font-semibold text-green-700">0 EGP</span>
                      </div>
                    )}
                    <div className="border-t pt-2 flex justify-between items-center">
                      <span className="font-bold text-primary">Total | الإجمالي</span>
                      <span className="font-bold text-xl text-primary">{totalFee} EGP</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground" dir="rtl">يرجى تحويل المبلغ الإجمالي إلى الحساب البنكي المذكور أعلاه ورفع إيصال الدفع.</p>
                  <p className="text-xs text-muted-foreground">Please transfer the total amount to the bank account mentioned above and upload the payment receipt.</p>
                </div>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={createRegistration.isPending || uploadingInvoice}>
                {(createRegistration.isPending || uploadingInvoice) ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{uploadingInvoice ? "Uploading invoices..." : "Submitting..."}</>
                ) : (
                  "Submit Registration | إرسال التسجيل"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
