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
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";

const registrationSchema = z.object({
  fullNameEnglish: z.string().min(1, "English name is required"),
  fullNameArabic: z.string().min(1, "Arabic name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  affiliation: z.string().min(1, "Affiliation is required"),
  attendeeCategory: z.enum(["student", "faculty", "researcher", "industry"]),
  participationType: z.literal("attendee"), // Fixed to attendee only
});

type RegistrationForm = z.infer<typeof registrationSchema>;

export default function Attendance() {
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      participationType: "attendee",
    },
  });

  const createRegistration = trpc.registration.create.useMutation({
    onSuccess: () => {
      setShowSuccess(true);
      reset();
      toast.success("Registration submitted successfully!");
      setTimeout(() => setShowSuccess(false), 5000);
    },
    onError: (error) => {
      toast.error(`Registration failed: ${error.message}`);
    },
  });

  const onSubmit = (data: RegistrationForm) => {
    createRegistration.mutate(data);
  };

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
            <Button onClick={() => setShowSuccess(false)} className="mt-6">
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
