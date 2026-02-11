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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Check } from "lucide-react";
import { Link } from "wouter";

const sponsorshipSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  contactPerson: z.string().min(1, "Contact person is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  packageType: z.enum(["platinum", "gold", "silver", "bronze"]),
  companyWebsite: z.string().url("Invalid website URL").optional().or(z.literal("")),
  message: z.string().optional(),
});

type SponsorshipForm = z.infer<typeof sponsorshipSchema>;

const benefits = [
  {
    name: "Speaking Opportunity (Panel or Sponsor Session)",
    platinum: true,
    gold: true,
    silver: false,
    bronze: false,
  },

  {
    name: "Company Stand at the Conference Fair (Foyer)",
    platinum: true,
    gold: true,
    silver: true,
    bronze: false,
  },
  {
    name: "Merch (Tote bag, Leaflet, Notebook, Lanyard, Pen)",
    platinum: true,
    gold: true,
    silver: true,
    bronze: true,
  },
  {
    name: "Logo on Website and Conference Printings (size depends on package)",
    platinum: true,
    gold: true,
    silver: true,
    bronze: true,
  },

  {
    name: "Conference Tickets",
    platinum: true,
    gold: true,
    silver: true,
    bronze: true,
  },
];

export default function Sponsor() {
  const [submitted, setSubmitted] = useState(false);
  const createSponsorship = trpc.sponsorship.create.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SponsorshipForm>({
    resolver: zodResolver(sponsorshipSchema),
  });

  const packageType = watch("packageType");

  const onSubmit = async (data: SponsorshipForm) => {
    try {
      await createSponsorship.mutateAsync(data);
      setSubmitted(true);
      toast.success("Sponsorship inquiry submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit sponsorship inquiry. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-white p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Thank You!</CardTitle>
            <CardDescription className="text-base" dir="rtl">
              شكراً لك!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-muted-foreground">
              Your sponsorship inquiry has been submitted successfully. Our team will contact you shortly to discuss the details.
            </p>
            <p className="text-muted-foreground" dir="rtl">
              تم إرسال استفسار الرعاية بنجاح. سيتواصل معك فريقنا قريباً لمناقشة التفاصيل.
            </p>
            <Link href="/">
              <Button className="w-full">Return to Home | العودة للصفحة الرئيسية</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-primary/5 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/images/logo_cu_new.png" alt="Cairo University" className="h-16 object-contain" />
              <img src="/images/logo_faculty_science.jpeg" alt="Faculty of Science" className="h-16 object-contain" />
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-primary">SCI 2026</h1>
                <p className="text-sm text-muted-foreground">Faculty of Science</p>
              </div>
            </div>
            <img src="/images/logo_pioneers.png" alt="Pioneers in Science" className="h-16 object-contain" />
          </div>
        </div>
      </header>

      <div className="container py-12 space-y-12">
        {/* Title Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Sponsorship Packages</h1>
          <p className="text-2xl font-semibold text-secondary" dir="rtl">باقات الرعاية</p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Partner with us to support scientific innovation and gain valuable exposure
          </p>
          <p className="text-lg text-muted-foreground" dir="rtl">
            شارك معنا لدعم الابتكار العلمي واكتساب تعرض قيم
          </p>
        </div>

        {/* Comparison Table */}
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl text-center">Sponsorship Packages Overview</CardTitle>
              <CardDescription className="text-center text-lg" dir="rtl">
                نظرة عامة على باقات الرعاية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-primary">
                      <th className="p-4 text-left font-bold text-lg"></th>
                      <th className="p-4 text-center font-bold text-lg">
                        <div className="space-y-1">
                          <div className="text-slate-600">Platinum</div>
                          <div className="text-2xl text-primary">200,000 EGP</div>
                        </div>
                      </th>
                      <th className="p-4 text-center font-bold text-lg">
                        <div className="space-y-1">
                          <div className="text-yellow-600">Gold</div>
                          <div className="text-2xl text-primary">150,000 EGP</div>
                        </div>
                      </th>
                      <th className="p-4 text-center font-bold text-lg">
                        <div className="space-y-1">
                          <div className="text-gray-500">Silver</div>
                          <div className="text-2xl text-primary">100,000 EGP</div>
                        </div>
                      </th>
                      <th className="p-4 text-center font-bold text-lg">
                        <div className="space-y-1">
                          <div className="text-orange-700">Bronze</div>
                          <div className="text-2xl text-primary">50,000 EGP</div>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {benefits.map((benefit, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="p-4 font-medium">{benefit.name}</td>
                        <td className="p-4 text-center">
                          {benefit.platinum && <Check className="w-6 h-6 text-green-500 mx-auto" />}
                        </td>
                        <td className="p-4 text-center">
                          {benefit.gold && <Check className="w-6 h-6 text-green-500 mx-auto" />}
                        </td>
                        <td className="p-4 text-center">
                          {benefit.silver && <Check className="w-6 h-6 text-green-500 mx-auto" />}
                        </td>
                        <td className="p-4 text-center">
                          {benefit.bronze && <Check className="w-6 h-6 text-green-500 mx-auto" />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Registration Form */}
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Sponsorship Inquiry Form</CardTitle>
              <CardDescription className="text-base" dir="rtl">
                نموذج استفسار الرعاية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name | اسم الشركة *</Label>
                    <Input
                      id="companyName"
                      {...register("companyName")}
                      placeholder="Your company name"
                    />
                    {errors.companyName && (
                      <p className="text-sm text-red-500">{errors.companyName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Contact Person | الشخص المسؤول *</Label>
                    <Input
                      id="contactPerson"
                      {...register("contactPerson")}
                      placeholder="Full name"
                    />
                    {errors.contactPerson && (
                      <p className="text-sm text-red-500">{errors.contactPerson.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email | البريد الإلكتروني *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="company@example.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone | رقم الهاتف *</Label>
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

                <div className="space-y-2">
                  <Label htmlFor="packageType">Sponsorship Package | باقة الرعاية *</Label>
                  <Select
                    value={packageType}
                    onValueChange={(value) => setValue("packageType", value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select package" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="platinum">Platinum - 200,000 EGP</SelectItem>
                      <SelectItem value="gold">Gold - 150,000 EGP</SelectItem>
                      <SelectItem value="silver">Silver - 100,000 EGP</SelectItem>
                      <SelectItem value="bronze">Bronze - 50,000 EGP</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.packageType && (
                    <p className="text-sm text-red-500">{errors.packageType.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyWebsite">Company Website | موقع الشركة (Optional)</Label>
                  <Input
                    id="companyWebsite"
                    {...register("companyWebsite")}
                    placeholder="https://www.example.com"
                  />
                  {errors.companyWebsite && (
                    <p className="text-sm text-red-500">{errors.companyWebsite.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Additional Message | رسالة إضافية (Optional)</Label>
                  <Textarea
                    id="message"
                    {...register("message")}
                    placeholder="Any additional information or questions..."
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={createSponsorship.isPending}
                >
                  {createSponsorship.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Inquiry | إرسال الاستفسار"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Contact Section */}
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h2 className="text-2xl font-bold text-primary">Questions?</h2>
          <p className="text-muted-foreground">
            For more information about sponsorship opportunities, please contact us:
          </p>
          <p className="text-muted-foreground" dir="rtl">
            لمزيد من المعلومات حول فرص الرعاية، يرجى الاتصال بنا:
          </p>
          <a
            href="mailto:science.faculty.conference2026@gmail.com"
            className="text-primary hover:underline font-medium text-lg"
          >
            science.faculty.conference2026@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
