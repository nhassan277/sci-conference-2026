import { useState } from "react";
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
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";

const registrationSchema = z.object({
  fullNameEnglish: z.string().min(1, "English name is required"),
  fullNameArabic: z.string().min(1, "Arabic name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  affiliation: z.string().min(1, "Affiliation is required"),
  attendeeCategory: z.enum(["student", "faculty", "researcher", "industry"]),
  participationType: z.literal("attendee"),
  wantsCertificate: z.boolean(),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export default function Attendance() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [wantsCertificate, setWantsCertificate] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    getValues,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      participationType: "attendee",
      wantsCertificate: false,
    },
  });

  const createRegistration = trpc.registration.create.useMutation({
    onSuccess: (data) => {
      setShowSuccess(true);
      toast.success("Registration submitted successfully!");
      
      // If certificate is requested, redirect to payment
      if (wantsCertificate) {
        handlePayment(data.id);
      } else {
        reset();
        setTimeout(() => {
          setShowSuccess(false);
          setWantsCertificate(false);
        }, 5000);
      }
    },
    onError: (error) => {
      toast.error(`Registration failed: ${error.message}`);
    },
  });

  const createCheckoutSession = trpc.payment.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        toast.info("Redirecting to payment...");
        window.open(data.checkoutUrl, "_blank");
      }
    },
    onError: (error) => {
      toast.error(`Payment setup failed: ${error.message}`);
    },
  });

  const handlePayment = (regId: number) => {
    const formData = getValues();
    createCheckoutSession.mutate({
      registrationId: regId,
      email: formData.email,
      fullName: formData.fullNameEnglish,
    });
  };

  const onSubmit = handleSubmit((data) => {
    createRegistration.mutate({
      ...data,
      wantsCertificate,
    });
  });

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-accent/5 py-12 px-4">
        <Card className="max-w-2xl w-full border-2 border-green-200">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-3xl text-green-700">Registration Successful!</CardTitle>
            <CardDescription className="text-lg" dir="rtl">
              تم التسجيل بنجاح!
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Thank you for registering for SCI 2026. We have received your registration and will contact you via email with further details.
            </p>
            <p className="text-muted-foreground" dir="rtl">
              شكراً لتسجيلك في مؤتمر SCI 2026. لقد استلمنا تسجيلك وسنتواصل معك عبر البريد الإلكتروني بمزيد من التفاصيل.
            </p>
            {wantsCertificate && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2 text-left">
                <p className="text-sm font-semibold text-blue-900">
                  Certificate Payment Instructions | تعليمات دفع الشهادة
                </p>
                <p className="text-xs text-blue-800">
                  Please transfer <strong>100 EGP</strong> to the bank account below and bring the receipt on the day of the conference.
                </p>
                <p className="text-xs text-blue-800" dir="rtl">
                  يرجى تحويل <strong>100 جنيه مصري</strong> إلى الحساب البنكي التالي وإحضار الإيصال يوم المؤتمر.
                </p>
                <div className="p-3 bg-white border border-blue-300 rounded text-sm space-y-1" dir="rtl">
                  <p className="font-semibold text-blue-900">ح/ صندوق الخدمات التعليمية</p>
                  <p className="text-blue-800">كلية العلوم - جامعة القاهرة</p>
                  <p className="text-blue-800">رقم الحساب: <span className="font-mono font-bold">7/450/88516/9</span></p>
                </div>
              </div>
            )}
            <Button onClick={() => {
              setShowSuccess(false);
              setWantsCertificate(false);
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
          <p className="text-2xl font-semibold text-secondary" dir="rtl">
            تسجيل الحضور
          </p>
          <p className="text-muted-foreground mt-4">
            Science at the Core of Innovation (SCI 2026) | April 7-8, 2026
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            This form is for <strong>attendance only</strong>. If you plan to present research or participate in workshops, 
            please use the participation registration forms on the homepage.
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
                <Label htmlFor="fullNameEnglish">
                  Full Name (English) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullNameEnglish"
                  {...register("fullNameEnglish")}
                  placeholder="John Doe"
                />
                {errors.fullNameEnglish && (
                  <p className="text-sm text-red-500">{errors.fullNameEnglish.message}</p>
                )}
              </div>

              {/* Full Name Arabic */}
              <div className="space-y-2">
                <Label htmlFor="fullNameArabic" dir="rtl">
                  الاسم الكامل (بالعربية) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullNameArabic"
                  {...register("fullNameArabic")}
                  placeholder="محمد أحمد"
                  dir="rtl"
                />
                {errors.fullNameArabic && (
                  <p className="text-sm text-red-500">{errors.fullNameArabic.message}</p>
                )}
              </div>

              {/* Email & Phone */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="john.doe@example.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    {...register("phone")}
                    placeholder="+20 123 456 7890"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              {/* Affiliation */}
              <div className="space-y-2">
                <Label htmlFor="affiliation">
                  Affiliation / Organization <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="affiliation"
                  {...register("affiliation")}
                  placeholder="Cairo University, Faculty of Science"
                />
                {errors.affiliation && (
                  <p className="text-sm text-red-500">{errors.affiliation.message}</p>
                )}
              </div>

              {/* Attendee Category */}
              <div className="space-y-2">
                <Label htmlFor="attendeeCategory">
                  Attendee Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) =>
                    setValue("attendeeCategory", value as any, { shouldValidate: true })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student / طالب</SelectItem>
                    <SelectItem value="faculty">Faculty Member / عضو هيئة تدريس</SelectItem>
                    <SelectItem value="researcher">Researcher / باحث</SelectItem>
                    <SelectItem value="industry">Industry Partner / شريك صناعي</SelectItem>
                  </SelectContent>
                </Select>
                {errors.attendeeCategory && (
                  <p className="text-sm text-red-500">{errors.attendeeCategory.message}</p>
                )}
              </div>

              {/* Certificate Option */}
              <div className="space-y-4 p-4 border rounded-lg bg-accent/5">
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
                    <Label htmlFor="wantsCertificate" className="font-medium cursor-pointer">
                      I want to purchase a certificate (100 EGP)
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      أرغب في شراء شهادة (100 جنيه مصري)
                    </p>
                  </div>
                </div>

                {wantsCertificate && (
                  <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
                    <p className="text-sm font-semibold text-blue-900">
                      Payment Instructions | تعليمات الدفع
                    </p>
                    <p className="text-xs text-blue-800">
                      Please transfer <strong>100 EGP</strong> to the following bank account and bring the receipt on the day of the conference.
                    </p>
                    <p className="text-xs text-blue-800" dir="rtl">
                      يرجى تحويل <strong>100 جنيه مصري</strong> إلى الحساب البنكي التالي وإحضار الإيصال يوم المؤتمر.
                    </p>
                    <div className="mt-2 p-3 bg-white border border-blue-300 rounded text-sm space-y-1" dir="rtl">
                      <p className="font-semibold text-blue-900">ح/ صندوق الخدمات التعليمية</p>
                      <p className="text-blue-800">كلية العلوم - جامعة القاهرة</p>
                      <p className="text-blue-800">رقم الحساب: <span className="font-mono font-bold">7/450/88516/9</span></p>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={createRegistration.isPending}
              >
                {createRegistration.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
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
