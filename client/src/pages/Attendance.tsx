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
  workshopChoice: z.enum(["nawah", "bioinformatics", "marc", "medsol", "agitech"]).optional(),
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
  label,
  labelAr,
  file,
  onFileChange,
  required,
}: {
  label: string;
  labelAr: string;
  file: File | null;
  onFileChange: (f: File | null) => void;
  required?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-2">
      <Label>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <p className="text-xs text-muted-foreground" dir="rtl">{labelAr}</p>
      {file ? (
        <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <ImageIcon className="w-5 h-5 text-green-600 shrink-0" />
          <span className="text-sm text-green-800 truncate flex-1">{file.name}</span>
          <button
            type="button"
            onClick={() => onFileChange(null)}
            className="text-red-400 hover:text-red-600"
          >
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
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}

export default function Attendance() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [registrationId, setRegistrationId] = useState<number | null>(null);
  const [wantsCertificate, setWantsCertificate] = useState(false);
  const [wantsWorkshop, setWantsWorkshop] = useState(false);
  const [workshopChoice, setWorkshopChoice] = useState<"nawah" | "bioinformatics" | "marc" | "medsol" | "agitech" | "">("")
  const [wantsExtWorkshop, setWantsExtWorkshop] = useState(false);
  const [extWorkshopChoice, setExtWorkshopChoice] = useState("");
  const [certInvoiceFile, setCertInvoiceFile] = useState<File | null>(null);
  const [workshopInvoiceFile, setWorkshopInvoiceFile] = useState<File | null>(null);
  const [extWorkshopInvoiceFile, setExtWorkshopInvoiceFile] = useState<File | null>(null);
  const [uploadingInvoice, setUploadingInvoice] = useState(false);

  // ─── Fee calculator ───
  const CERTIFICATE_FEE = 100;
  // Workshop fees map (conference-day workshops)
  const WORKSHOP_FEES: Record<string, number> = {
    nawah: 200,
    bioinformatics: 100,
    marc: 200,
    medsol: 200,
    agitech: 200,
  };
  // Pre/post conference workshop fees
  const EXT_WORKSHOP_FEES: Record<string, number> = {
    agitech: 200,
    chitosan: 100,
    scrna_seq: 200,
    ai_biotech: 100,
    hvd_genomics: 200,
    vaccine_industry: 100,
    gesr_scholarships: 0,
    colors_metagenomics: 200,
  };

  const certFee = wantsCertificate ? CERTIFICATE_FEE : 0;
  const workshopFee = wantsWorkshop && workshopChoice ? (WORKSHOP_FEES[workshopChoice] ?? 0) : 0;
  const extWorkshopFee = wantsExtWorkshop && extWorkshopChoice ? (EXT_WORKSHOP_FEES[extWorkshopChoice] ?? 0) : 0;
  const totalFee = certFee + workshopFee + extWorkshopFee;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      participationType: "attendee",
      wantsCertificate: false,
      wantsWorkshop: false,
      wantsExtWorkshop: false,
    },
  });

  const uploadInvoice = trpc.registration.uploadInvoice.useMutation();

  const createRegistration = trpc.registration.create.useMutation({
    onSuccess: async (data) => {
      setRegistrationId(data.id);
      setUploadingInvoice(true);

      try {
        // Upload certificate invoice if needed
        if (wantsCertificate && certInvoiceFile) {
          const certBase64 = await fileToBase64(certInvoiceFile);
          await uploadInvoice.mutateAsync({
            registrationId: data.id,
            invoiceType: "certificate",
            file: {
              data: certBase64,
              name: certInvoiceFile.name,
              type: certInvoiceFile.type,
            },
          });
        }

        // Upload workshop invoice if needed
        if (wantsWorkshop && workshopInvoiceFile) {
          const wsBase64 = await fileToBase64(workshopInvoiceFile);
          await uploadInvoice.mutateAsync({
            registrationId: data.id,
            invoiceType: "workshop",
            file: {
              data: wsBase64,
              name: workshopInvoiceFile.name,
              type: workshopInvoiceFile.type,
            },
          });
        }

        // Upload ext workshop invoice if needed (skip for free workshops like GESR)
        if (wantsExtWorkshop && extWorkshopInvoiceFile && extWorkshopChoice !== "gesr_scholarships") {
          const extBase64 = await fileToBase64(extWorkshopInvoiceFile);
          await uploadInvoice.mutateAsync({
            registrationId: data.id,
            invoiceType: "ext_workshop",
            file: {
              data: extBase64,
              name: extWorkshopInvoiceFile.name,
              type: extWorkshopInvoiceFile.type,
            },
          });
        }
      } catch {
        toast.error("Registration saved but invoice upload failed. Please contact us.");
      }

      setUploadingInvoice(false);
      setShowSuccess(true);
      toast.success("Registration submitted successfully!");
    },
    onError: (error) => {
      toast.error(`Registration failed: ${error.message}`);
    },
  });

  const onSubmit = handleSubmit((data) => {
    // Validate certificate invoice
    if (wantsCertificate && !certInvoiceFile) {
      toast.error("Please upload the certificate payment invoice before submitting.");
      return;
    }
    // Validate workshop invoice
    if (wantsWorkshop && !workshopInvoiceFile) {
      toast.error("Please upload the workshop payment invoice before submitting.");
      return;
    }
    if (wantsWorkshop && !workshopChoice) {
      toast.error("Please select a workshop.");
      return;
    }
    // Validate ext workshop
    if (wantsExtWorkshop && !extWorkshopChoice) {
      toast.error("Please select a pre/post conference workshop.");
      return;
    }
    if (wantsExtWorkshop && extWorkshopChoice !== "gesr_scholarships" && !extWorkshopInvoiceFile) {
      toast.error("Please upload the pre/post conference workshop payment invoice before submitting.");
      return;
    }

    createRegistration.mutate({
      ...data,
      wantsCertificate,
      wantsWorkshop,
      workshopChoice: workshopChoice || undefined,
      wantsExtWorkshop,
      extWorkshopChoice: extWorkshopChoice || undefined,
    });
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
            <p className="text-muted-foreground">
              Thank you for registering for SCI 2026. We will contact you via email with further details.
            </p>
            <p className="text-muted-foreground" dir="rtl">
              شكراً لتسجيلك في مؤتمر SCI 2026. سنتواصل معك عبر البريد الإلكتروني بمزيد من التفاصيل.
            </p>

            {wantsCertificate && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2 text-left">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <p className="text-sm font-semibold text-blue-900">Certificate Invoice Uploaded ✓</p>
                </div>
                <p className="text-xs text-blue-800">
                  Your payment invoice has been received. Your certificate request is under review and will be confirmed shortly.
                </p>
                <p className="text-xs text-blue-800" dir="rtl">
                  تم استلام إيصال الدفع الخاص بك. طلب الشهادة قيد المراجعة وسيتم تأكيده قريباً.
                </p>
                {bankDetails}
              </div>
            )}

            {wantsWorkshop && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg space-y-2 text-left">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <p className="text-sm font-semibold text-amber-900">Workshop Invoice Uploaded ✓</p>
                </div>
                <p className="text-xs text-amber-800">
                  Your workshop payment invoice has been received. Your spot will be confirmed once payment is verified (first 30 participants).
                </p>
                <p className="text-xs text-amber-800 mt-1" dir="rtl">
                  تم استلام إيصال دفع ورشة العمل. سيتم تأكيد مكانك بعد التحقق من الدفع (أول 30 مشارك).
                </p>
              </div>
            )}

            {wantsExtWorkshop && (
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg space-y-2 text-left">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <p className="text-sm font-semibold text-purple-900">Pre/Post Conference Workshop Invoice Uploaded ✓</p>
                </div>
                <p className="text-xs text-purple-800">
                  Your pre/post conference workshop payment invoice has been received. Your spot will be confirmed once payment is verified.
                </p>
                <p className="text-xs text-purple-800 mt-1" dir="rtl">
                  تم استلام إيصال دفع ورشة ما قبل/بعد المؤتمر. سيتم تأكيد مكانك بعد التحقق من الدفع.
                </p>
              </div>
            )}

            <Button onClick={() => {
              setShowSuccess(false);
              setWantsCertificate(false);
              setWantsWorkshop(false);
              setWorkshopChoice("");
              setWantsExtWorkshop(false);
              setExtWorkshopChoice("");
              setCertInvoiceFile(null);
              setWorkshopInvoiceFile(null);
              setExtWorkshopInvoiceFile(null);
              reset();
            }} className="mt-6">
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
          <p className="text-muted-foreground mt-4">
            Science at the Core of Innovation (SCI 2026) | April 7-8, 2026
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            This form is for <strong>attendance only</strong>. If you plan to present research, please use the participation registration forms on the homepage.
          </p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Attendee Information | معلومات المشارك</CardTitle>
            <CardDescription>
              Please fill in all required fields. All information will be kept confidential.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-6">
              {/* Full Name English */}
              <div className="space-y-2">
                <Label htmlFor="fullNameEnglish">Full Name (English) <span className="text-red-500">*</span></Label>
                <Input id="fullNameEnglish" {...register("fullNameEnglish")} placeholder="John Doe" />
                {errors.fullNameEnglish && <p className="text-sm text-red-500">{errors.fullNameEnglish.message}</p>}
              </div>

              {/* Full Name Arabic */}
              <div className="space-y-2">
                <Label htmlFor="fullNameArabic" dir="rtl">الاسم الكامل (بالعربية) <span className="text-red-500">*</span></Label>
                <Input id="fullNameArabic" {...register("fullNameArabic")} placeholder="محمد أحمد" dir="rtl" />
                {errors.fullNameArabic && <p className="text-sm text-red-500">{errors.fullNameArabic.message}</p>}
              </div>

              {/* Email & Phone */}
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

              {/* Affiliation */}
              <div className="space-y-2">
                <Label htmlFor="affiliation">Affiliation / Organization <span className="text-red-500">*</span></Label>
                <Input id="affiliation" {...register("affiliation")} placeholder="Cairo University, Faculty of Science" />
                {errors.affiliation && <p className="text-sm text-red-500">{errors.affiliation.message}</p>}
              </div>

              {/* Attendee Category */}
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

              {/* ─── Certificate Section ─── */}
              <div className="space-y-4 p-4 border-2 rounded-lg bg-blue-50/50 border-blue-200">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="wantsCertificate"
                    checked={wantsCertificate}
                    onCheckedChange={(checked) => {
                      const value = checked === true;
                      setWantsCertificate(value);
                      setValue("wantsCertificate", value);
                    }}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="wantsCertificate" className="font-semibold cursor-pointer text-blue-900">
                      I want to receive a participation certificate — 100 EGP
                    </Label>
                    <p className="text-sm text-blue-700" dir="rtl">أرغب في الحصول على شهادة مشاركة — 100 جنيه مصري</p>
                  </div>
                </div>

                {wantsCertificate && (
                  <div className="space-y-4 mt-2">
                    {/* Payment instructions */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
                      <p className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" /> Payment Instructions | تعليمات الدفع
                      </p>
                      <p className="text-xs text-blue-800">
                        Transfer <strong>100 EGP</strong> to the bank account below, then upload a photo of the transfer receipt below. <strong>Uploading the invoice is mandatory for certificate printing.</strong>
                      </p>
                      <p className="text-xs text-blue-800" dir="rtl">
                        حوّل <strong>100 جنيه مصري</strong> إلى الحساب البنكي التالي، ثم ارفع صورة إيصال التحويل أدناه. <strong>رفع الإيصال إلزامي لطباعة الشهادة.</strong>
                      </p>
                      {bankDetails}
                    </div>

                    {/* Invoice Upload */}
                    <InvoiceUpload
                      label="Upload Certificate Payment Invoice (Required)"
                      labelAr="ارفع صورة إيصال دفع الشهادة (إلزامي)"
                      file={certInvoiceFile}
                      onFileChange={setCertInvoiceFile}
                      required
                    />
                    {wantsCertificate && !certInvoiceFile && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Invoice upload is required to complete certificate registration.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* ─── Workshop Section ─── */}
              <div className="space-y-4 p-4 border-2 rounded-lg bg-amber-50/50 border-amber-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="wantsWorkshop"
                      checked={wantsWorkshop}
                      onCheckedChange={(checked) => {
                        const value = checked === true;
                        setWantsWorkshop(value);
                        setValue("wantsWorkshop", value);
                        if (!value) setWorkshopChoice("");
                      }}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="wantsWorkshop" className="font-semibold cursor-pointer text-amber-900">
                        I want to register for a workshop (incl. certificate)
                      </Label>
                      <p className="text-sm text-amber-700" dir="rtl">أرغب في التسجيل في ورشة عمل (شاملة الشهادة)</p>
                    </div>
                  </div>
                  <Badge className="bg-red-100 text-red-700 border-red-200 text-xs shrink-0">First 30 only | أول 30 مشارك</Badge>
                </div>

                {wantsWorkshop && (
                  <div className="space-y-4 mt-2">
                    {/* Workshop Choice */}
                    <div className="space-y-2">
                      <Label>Choose Your Workshop <span className="text-red-500">*</span></Label>
                      <p className="text-xs text-muted-foreground" dir="rtl">اختر ورشة العمل المفضلة لديك</p>
                      <div className="grid gap-3">
                        {[
                          { value: "nawah", label: "NAWAH Scientific", desc: "Research to Business — Translating Science into Industry | 200 EGP (incl. certificate)", descAr: "من البحث إلى الأعمال — تحويل العلوم إلى صناعة | 200 جنيه (شاملة الشهادة)" },
          { value: "bioinformatics", label: "Bioinformatics Workshop — Dr. Dina Amr", desc: "Introduction to Bioinformatics — Day 1 of conference (April 7) | 100 EGP (incl. certificate) | Max 50 participants", descAr: "مقدمة في المعلوماتية الحيوية — اليوم الأول من المؤتمر (٧ أبريل) | ١٠٠ جنيه (شاملة الشهادة) | الحد الأقصى ٥٠ مشاركاً" },
                          { value: "marc", label: "MARC", desc: "Good Clinical Practice (GCP) Workshop | 200 EGP (incl. certificate)", descAr: "ورشة الممارسة السريرية الجيدة | 200 جنيه (شاملة الشهادة)" },
                          { value: "medsol", label: "Medsol Corporation", desc: "From DNA to Proteins: Advanced Sequencing Technologies | 200 EGP (incl. certificate)", descAr: "من الحمض النووي إلى البروتينات: تقنيات التسلسل المتقدمة | 200 جنيه (شاملة الشهادة)" },
                          { value: "agitech", label: "Agitech — NGS & ddPCR in Targeted Therapy", desc: "From Basic Research to Precision Medicine: Applications of NGS and ddPCR in Targeted Therapy. April 6, 12:00–14:00 | 20 spots only", descAr: "من البحث الأساسي إلى الطب الدقيق: تطبيقات NGS و ddPCR في العلاج الموجه. ٦ أبريل، ١٢:٠٠–٢:٠٠ م | ٢٠ مكاناً فقط", logo: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/qtvBAZFSrMqYBKkE.png" },
                        ].map((ws) => (
                          <div
                            key={ws.value}
                            onClick={() => {
                              setWorkshopChoice(ws.value as any);
                              setValue("workshopChoice", ws.value as any);
                            }}
                            className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${workshopChoice === ws.value ? "border-amber-500 bg-amber-50" : "border-muted hover:border-amber-300"}`}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${workshopChoice === ws.value ? "border-amber-500 bg-amber-500" : "border-muted-foreground"}`}>
                                {workshopChoice === ws.value && <div className="w-2 h-2 rounded-full bg-white" />}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-0.5">
                                  {(ws as any).logo && <img src={(ws as any).logo} alt={ws.label} className="h-5 object-contain" />}
                                  <p className="font-semibold text-sm">{ws.label}</p>
                                </div>
                                <p className="text-xs text-muted-foreground">{ws.desc}</p>
                                <p className="text-xs text-muted-foreground" dir="rtl">{ws.descAr}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Certificate Note */}
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                      <span className="text-green-600 text-base mt-0.5">🎓</span>
                      <div>
                        <p className="text-xs font-bold text-green-800">Certificate of Completion | شهادة إتمام</p>
                        <p className="text-xs text-green-700 mt-0.5">All workshops provide a certified certificate co-signed by the organizing company and the <strong>Faculty of Science, Cairo University</strong>.</p>
                        <p className="text-xs text-green-700 mt-0.5" dir="rtl">جميع ورش العمل تمنح شهادة إتمام معتمدة موقّعة من الشركة المنظمة و<strong>كلية العلوم ، جامعة القاهرة</strong>.</p>
                      </div>
                    </div>

                    {/* Workshop Payment Instructions */}
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg space-y-2">
                      <p className="text-sm font-semibold text-amber-900 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" /> Workshop Payment Instructions | تعليمات دفع ورشة العمل
                      </p>
                      <p className="text-xs text-amber-800">
                        Transfer the workshop fee (100 or 200 EGP depending on the workshop — see fee shown on each workshop above) to the same bank account below, then upload a photo of the transfer receipt. <strong>Uploading the invoice is mandatory to confirm your workshop spot.</strong>
                      </p>
                      <p className="text-xs text-amber-800" dir="rtl">
                        حوّل رسوم ورشة العمل (100 أو 200 جنيه حسب الورشة — انظر الرسوم الموضحة على كل ورشة أعلاه) إلى نفس الحساب البنكي أدناه، ثم ارفع صورة إيصال التحويل. <strong>رفع الإيصال إلزامي لتأكيد مكانك في ورشة العمل.</strong>
                      </p>
                      {bankDetails}
                    </div>

                    {/* Workshop Invoice Upload */}
                    <InvoiceUpload
                      label="Upload Workshop Payment Invoice (Required)"
                      labelAr="ارفع صورة إيصال دفع ورشة العمل (إلزامي)"
                      file={workshopInvoiceFile}
                      onFileChange={setWorkshopInvoiceFile}
                      required
                    />
                    {wantsWorkshop && !workshopInvoiceFile && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Invoice upload is required to confirm your workshop spot.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* ─── Pre/Post Conference Workshop Section ─── */}
              <div className="space-y-4 p-4 border-2 rounded-lg bg-purple-50/50 border-purple-200">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="wantsExtWorkshop"
                    checked={wantsExtWorkshop}
                    onCheckedChange={(checked) => {
                      const value = checked === true;
                      setWantsExtWorkshop(value);
                      setValue("wantsExtWorkshop", value);
                      if (!value) setExtWorkshopChoice("");
                    }}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="wantsExtWorkshop" className="font-semibold cursor-pointer text-purple-900">
                      I want to register for a Pre/Post Conference Workshop (incl. certificate)
                    </Label>
                    <p className="text-sm text-purple-700" dir="rtl">أرغب في التسجيل في ورشة عمل ما قبل/بعد المؤتمر (شاملة الشهادة)</p>
                    <p className="text-xs text-purple-600">April 6 (Pre-Conference) or April 9 (Post-Conference), 2026</p>
                    <p className="text-xs text-purple-600" dir="rtl">٦ أبريل (قبل المؤتمر) أو ٩ أبريل (بعد المؤتمر) ٢٠٢٦</p>
                  </div>
                </div>

                {wantsExtWorkshop && (
                  <div className="space-y-4 mt-2">
                    {/* Workshop Choice */}
                    <div className="space-y-2">
                      <Label>Choose Your Workshop <span className="text-red-500">*</span></Label>
                      <p className="text-xs text-muted-foreground" dir="rtl">اختر ورشة العمل المفضلة لديك</p>
                      <div className="grid gap-3">
                        {[
                          {
                            value: "agitech",
                            label: "NGS & ddPCR in Targeted Therapy",
                            labelAr: "تطبيقات NGS وddPCR في العلاج الموجه",
                            desc: "From Basic Research to Precision Medicine: Applications of NGS and ddPCR in Targeted Therapy.",
                            descAr: "من البحث الأساسي إلى الطب الدقيق: تطبيقات NGS و ddPCR في العلاج الموجه.",
                            date: "April 6, 2026 | 12:00 – 2:00 PM",
                            dateAr: "٦ أبريل ٢٠٢٦ | ١٢:٠٠ – ٢:٠٠ م",
                            by: "Agitech",
                            logo: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/qtvBAZFSrMqYBKkE.png",
                            eligibility: "20 spots only | 200 EGP (incl. certificate)",
                            venue: "قاعة ابن سينا — قسم النبات القديم — كلية العلوم — جامعة القاهرة",
                            venueEn: "Ibn Sina Hall — Botany Dept. — Faculty of Science, Cairo University",
                          },
                          {
                            value: "chitosan",
                            label: "Biotech Product Development 101",
                            labelAr: "تطوير المنتجات في التكنولوجيا الحيوية",
                            desc: "From scientific ideas to real products — startup building roadmap for biotech. 3rd & 4th year undergrads + graduates only.",
                            descAr: "من الأفكار العلمية إلى منتجات حقيقية — مسار بناء الشركات الناشئة في التكنولوجيا الحيوية.",
                            date: "April 6, 2026 | 9:00 AM – 12:00 PM",
                            dateAr: "٦ أبريل ٢٠٢٦ | ٩:٠٠ ص – ١٢:٠٠ ظ",
                            by: "Chitosan",
                            logo: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/GXxzRnTYsggXAHMu.png",
                            eligibility: "3rd & 4th year undergrads + graduates | 30 spots only | 100 EGP (incl. certificate)",
                            venue: "قاعة ابن سينا — قسم النبات القديم — كلية العلوم — جامعة القاهرة",
                            venueEn: "Ibn Sina Hall — Botany Dept. — Faculty of Science, Cairo University",
                          },
                          {
                            value: "scrna_seq",
                            label: "Introduction to Single Cell Genomics",
                            labelAr: "مقدمة في جينوميات الخلية الواحدة",
                            desc: "scRNA-seq Analysis in Cancer — Hands-on computational training in R. Prerequisites: R ≥ 4.2, RStudio & Seurat. Bring your laptop.",
                            descAr: "تحليل scRNA-seq في السرطان — تدريب حاسوبي عملي بلغة R. المتطلبات: R ≥ 4.2 وRStudio وSeurat. أحضر لابتوبك.",
                            date: "April 9, 2026 | 10:00 AM – 1:00 PM",
                            dateAr: "٩ أبريل ٢٠٢٦ | ١٠:٠٠ ص – ١:٠٠ م",
                            by: "EgcompBio",
                            logo: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/VSqePLOAbshMxznI.png",
                            eligibility: "Intermediate to advanced level · 30 spots only | 200 EGP (incl. certificate)",
                            venue: "قاعة ابن سينا — قسم النبات القديم — كلية العلوم — جامعة القاهرة",
                            venueEn: "Ibn Sina Hall — Botany Dept. — Faculty of Science, Cairo University",
                          },
                          {
                            value: "ai_biotech",
                            label: "AI Meets Biotech",
                            labelAr: "الذكاء الاصطناعي يلتقي بالتكنولوجيا الحيوية",
                            desc: "How to leverage AI in Biotechnology — Predict 3D structures of proteins, genes & enzymes",
                            descAr: "كيفية توظيف الذكاء الاصطناعي في التكنولوجيا الحيوية — التنبؤ بالبنى ثلاثية الأبعاد للبروتينات والجينات والإنزيمات",
                            date: "April 9, 2026 | 1:00 – 3:00 PM",
                            dateAr: "٩ أبريل ٢٠٢٦ | ١:٠٠ – ٣:٠٠ م",
                            by: "AI بالعربي",
                            logo: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/QvdupTbEZQQzfgEz.jpeg",
                            eligibility: "100 EGP (incl. certificate)",
                            venue: "قاعة ابن سينا — قسم النبات القديم — كلية العلوم — جامعة القاهرة",
                            venueEn: "Ibn Sina Hall — Botany Dept. — Faculty of Science, Cairo University",
                          },
                          {
                            value: "hvd_genomics",
                            label: "Integrating Genomics and Proteomics in Modern Biopharmaceutical R&D",
                            labelAr: "دمج الجينوميكس والبروتيوميكس في أبحاث وتطوير الأدوية الحيوية",
                            desc: "Bridging Omics Technologies for Drug Discovery — Hands-on workshop on genomics & proteomics integration in biopharma.",
                            descAr: "تقنيات الأوميكس لاكتشاف الأدوية — ورشة عملية على دمج الجينوميكس والبروتيوميكس في صناعة الأدوية الحيوية.",
                            date: "Sunday, April 12, 2026 (Post-Conference) — Full Day ~5 Hours",
                            dateAr: "الأحد ١٢ أبريل ٢٠٢٦ (بعد المؤتمر) — الوقت سيُعلن قريباً",
                            by: "HVD Life Sciences — New Cairo (2C53+JCC, Cairo Governorate 4720113)",
                            logo: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/NlYUUYlTeGQwRRXp.png",
                            eligibility: "20 spots only | 200 EGP (incl. certificate)",
                          },
                          {
                            value: "vaccine_industry",
                            label: "The Vaccine Industry Race: Ready to Play the Viruses' Game?",
                            labelAr: "سباق صناعة اللقاحات: هل أنت مستعد للعب لعبة الفيروسات؟",
                            desc: "Understanding the vaccine development pipeline, regulatory pathways, and careers in the vaccine industry.",
                            descAr: "فهم مسار تطوير اللقاحات والمسارات التنظيمية والمسارات المهنية في صناعة اللقاحات.",
                            date: "April 6, 2026 | 2:00 – 5:00 PM",
                            dateAr: "٦ أبريل ٢٠٢٦ | ٢:٠٠ – ٥:٠٠ م",
                            by: "Jasmine Mohsen & Dr. Khaled Walid",
                            byAr: "جاسمين محسن و د. خالد وليد",
                            icon: "💉",
                            eligibility: "100 EGP (incl. certificate)",
                            venue: "قاعة ابن سينا — قسم النبات القديم — كلية العلوم — جامعة القاهرة",
                            venueEn: "Ibn Sina Hall — Botany Dept. — Faculty of Science, Cairo University",
                          },
                          {
                            value: "gesr_scholarships",
                            label: "From Lab to Global Opportunities: Scholarships & Research Abroad",
                            labelAr: "من المختبر إلى العالم: كيف تستعد للمنح والبحث في الخارج",
                            desc: "A 3-hour workshop by GESR under the MASAR — Nextgen Researchers initiative (launch event). Covers: identifying international scholarships & fellowships, building a strong academic CV, writing a compelling motivation letter, preparing for research abroad, and an interactive Q&A. Special selections: 5 students for GESR Mentorship Program + 5 for next GESR Summer Conference.",
                            descAr: "ورشة عمل مدتها 3 ساعات من تقديم GESR ضمن مبادرة مسار — باحثو الجيل القادم (حفل الإطلاق).",
                            date: "Thursday, April 9, 2026 | 3:00 PM – 6:00 PM",
                            dateAr: "الخميس ٩ أبريل ٢٠٢٦ | ٣:٠٠ م – ٦:٠٠ م",
                            by: "Dr. Nourhan Hassan & Dr. Hazem Badawy (Board of GESR)",
                            byAr: "د. نورهان حسن و د. حازم بدوي (مجلس إدارة GESR)",
                            logo: "https://d2xsxph8kpxj0f.cloudfront.net/118031311/BK5ELr97meyN2f7P5B76DF/GESR-logo_7866e6d3.jpg",
                            eligibility: "Free | Open to: undergraduates, master's students, PhD candidates, early-career researchers",
                          },                          {
                            value: "colors_metagenomics",
                            label: "Metagenomics, Microbiome & 16S rRNA Sequencing",
                            labelAr: "الميتاجينوميكس، الميكروبيوم وتسلسل الـ 16S rRNA",
                            desc: "Hands-on workshop on metagenomics, microbiome analysis, and 16S rRNA sequencing. Title to be announced soon.",
                            descAr: "ورشة عملية في الميتاجينوميكس وتحليل الميكروبيوم وتسلسل الـ 16S rRNA. سيتم الإعلان عن العنوان قريباً.",
                            date: "Date & Time — To Be Announced",
                            dateAr: "سيتم الإعلان عن التاريخ والوقت قريباً",
                            by: "Colors Educational Hub — Maadi, Cairo (4 شارع 160، برج رهام، المعادي 11431)",
                            logo: "https://d2xsxph8kpxj0f.cloudfront.net/118031311/BK5ELr97meyN2f7P5B76DF/logo_colors_52f6762b.png",
                            eligibility: "25 spots only | 200 EGP (incl. certificate)",
                          },
                        ].map((ws) => (
                          <div
                            key={ws.value}
                            onClick={() => {
                              setExtWorkshopChoice(ws.value);
                              setValue("extWorkshopChoice", ws.value);
                            }}
                            className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${extWorkshopChoice === ws.value ? "border-purple-500 bg-purple-50" : "border-muted hover:border-purple-300"}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${extWorkshopChoice === ws.value ? "border-purple-500 bg-purple-500" : "border-muted-foreground"}`}>
                                {extWorkshopChoice === ws.value && <div className="w-2 h-2 rounded-full bg-white" />}
                              </div>
                              <div className="flex-1">
                                {/* Title first */}
                                <p className="font-bold text-sm text-purple-900 mb-1">{ws.label}</p>
                                <p className="text-xs font-medium text-purple-700 mb-2" dir="rtl">{ws.labelAr}</p>
                                {/* Speaker photo/icon + name OR company logo */}
                                {'photo' in ws && ws.photo ? (
                                  <div className="flex items-center gap-2 mb-2">
                                    <img src={(ws as any).photo} alt={(ws as any).by} className="w-8 h-8 rounded-full object-cover border border-purple-200" />
                                    <div>
                                      <p className="text-xs font-semibold text-purple-800">{ws.by}</p>
                                      {'byAr' in ws && <p className="text-xs text-purple-700" dir="rtl">{(ws as any).byAr}</p>}
                                    </div>
                                  </div>
                                ) : 'icon' in ws && (ws as any).icon ? (
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-2xl">{(ws as any).icon}</span>
                                    <div>
                                      <p className="text-xs font-semibold text-purple-800">{ws.by}</p>
                                      {'byAr' in ws && <p className="text-xs text-purple-700" dir="rtl">{(ws as any).byAr}</p>}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 mb-2">
                                    {'logo' in ws && ws.logo && <img src={(ws as any).logo} alt={ws.by} className="h-6 object-contain" />}
                                    <p className="text-xs text-muted-foreground">{ws.by}</p>
                                  </div>
                                )}
                                <p className="text-xs text-muted-foreground">{ws.desc}</p>
                                <p className="text-xs text-muted-foreground" dir="rtl">{ws.descAr}</p>
                                <p className="text-xs font-semibold text-purple-800 mt-1">📅 {ws.date}</p>
                                <p className="text-xs font-semibold text-purple-800" dir="rtl">📅 {ws.dateAr}</p>
                                {'eligibility' in ws && ws.eligibility && (
                                  <p className="text-xs font-medium text-orange-700 mt-1">🎓 {ws.eligibility}</p>
                                )}
                                {'venue' in ws && ws.venue && (
                                  <p className="text-xs font-medium text-blue-700 mt-1">📍 {ws.venue}</p>
                                )}
                                {'venueEn' in ws && ws.venueEn && (
                                  <p className="text-xs text-blue-600">{ws.venueEn}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Certificate Note */}
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                      <span className="text-green-600 text-base mt-0.5">🎓</span>
                      <div>
                        <p className="text-xs font-bold text-green-800">Certificate of Completion | شهادة إتمام</p>
                        <p className="text-xs text-green-700 mt-0.5">All workshops provide a certified certificate co-signed by the organizing company and the <strong>Faculty of Science, Cairo University</strong>.</p>
                        <p className="text-xs text-green-700 mt-0.5" dir="rtl">جميع ورش العمل تمنح شهادة إتمام معتمدة موقّعة من الشركة المنظمة و<strong>كلية العلوم ، جامعة القاهرة</strong>.</p>
                      </div>
                    </div>

                    {/* Payment Instructions — only show for paid workshops */}
                    {extWorkshopChoice && extWorkshopChoice !== "gesr_scholarships" && (
                      <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg space-y-2">
                        <p className="text-sm font-semibold text-purple-900 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" /> Payment Instructions | تعليمات الدفع
                        </p>
                        <p className="text-xs text-purple-800">
                          Transfer the workshop fee (100 or 200 EGP depending on the workshop — see fee shown on each workshop above) to the bank account below, then upload a photo of the transfer receipt. <strong>Uploading the invoice is mandatory to confirm your spot.</strong>
                        </p>
                        <p className="text-xs text-purple-800" dir="rtl">
                          حوّل رسوم ورشة العمل (100 أو 200 جنيه حسب الورشة — انظر الرسوم الموضحة على كل ورشة أعلاه) إلى الحساب البنكي أدناه، ثم ارفع صورة إيصال التحويل. <strong>رفع الإيصال إلزامي لتأكيد مكانك.</strong>
                        </p>
                        {bankDetails}
                      </div>
                    )}

                    {/* Free workshop note for GESR */}
                    {extWorkshopChoice === "gesr_scholarships" && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                        <span className="text-green-600 text-base mt-0.5">✅</span>
                        <div>
                          <p className="text-xs font-bold text-green-800">This workshop is FREE — No payment required | هذه الورشة مجانية — لا يلزم الدفع</p>
                          <p className="text-xs text-green-700 mt-0.5">Your registration will be confirmed automatically. No invoice upload needed.</p>
                          <p className="text-xs text-green-700 mt-0.5" dir="rtl">سيتم تأكيد تسجيلك تلقائياً. لا حاجة لرفع إيصال.</p>
                        </div>
                      </div>
                    )}

                    {/* Invoice Upload — only for paid workshops */}
                    {extWorkshopChoice && extWorkshopChoice !== "gesr_scholarships" && (
                      <>
                        <InvoiceUpload
                          label="Upload Pre/Post Workshop Payment Invoice (Required)"
                          labelAr="ارفع صورة إيصال دفع ورشة ما قبل/بعد المؤتمر (إلزامي)"
                          file={extWorkshopInvoiceFile}
                          onFileChange={setExtWorkshopInvoiceFile}
                          required
                        />
                        {wantsExtWorkshop && !extWorkshopInvoiceFile && (
                          <p className="text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Invoice upload is required to confirm your workshop spot.
                          </p>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* ─── Fee Calculator ─── */}
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
                    {workshopFee > 0 && workshopChoice && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">
                          Workshop ({workshopChoice.toUpperCase()}) | ورشة عمل
                        </span>
                        <span className="font-semibold text-amber-700">{workshopFee} EGP</span>
                      </div>
                    )}
                    {extWorkshopFee > 0 && extWorkshopChoice && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Pre/Post Workshop | ورشة ما قبل/بعد المؤتمر</span>
                        <span className="font-semibold text-purple-700">{extWorkshopFee} EGP</span>
                      </div>
                    )}
                    <div className="border-t pt-2 flex justify-between items-center">
                      <span className="font-bold text-primary">Total | الإجمالي</span>
                      <span className="font-bold text-xl text-primary">{totalFee} EGP</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground" dir="rtl">
                    يرجى تحويل المبلغ الإجمالي إلى الحساب البنكي المذكور أعلاه ورفع إيصال الدفع.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Please transfer the total amount to the bank account mentioned above and upload the payment receipt.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={createRegistration.isPending || uploadingInvoice}
              >
                {(createRegistration.isPending || uploadingInvoice) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {uploadingInvoice ? "Uploading invoice..." : "Submitting..."}
                  </>
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
