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
import { CheckCircle2, Loader2, Award, Star, Medal, Trophy } from "lucide-react";

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

const packages = [
  {
    name: "Platinum",
    value: "platinum",
    price: "200,000 EGP",
    icon: Trophy,
    color: "text-slate-400",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-300",
    benefits: [
      "Logo displayed behind speakers in press conference",
      "3' x 3' display booth in Platinum area",
      "Extra large logo in Registration area",
      "5 attendee passes with sponsorship ribbons",
      "Acknowledgment during opening session",
      "Logo with direct link on website main page",
      "Logo placement in conference materials",
      "Logo displayed on LCDs during conference",
      "Full page print ad in conference book",
      "Promotional item in conference bag",
      "Access to VIP area",
      "5 Gala dinner tickets",
    ],
  },
  {
    name: "Gold",
    value: "gold",
    price: "150,000 EGP",
    icon: Award,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-300",
    benefits: [
      "Logo displayed behind speakers in press conference",
      "3' x 3' display booth in Gold area",
      "Large logo in Registration area",
      "4 attendee passes with sponsorship ribbons",
      "Acknowledgment during opening session",
      "Logo with direct link on website",
      "Brochure/insert in conference bag",
      "Logo on LCDs during conference",
      "Half page print ad in conference book",
      "Access to VIP area",
      "4 Gala dinner tickets",
    ],
  },
  {
    name: "Silver",
    value: "silver",
    price: "100,000 EGP",
    icon: Medal,
    color: "text-gray-400",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-300",
    benefits: [
      "Logo displayed behind speakers in press conference",
      "3' x 3' display booth in Silver area",
      "Medium logo in Registration area",
      "3 attendee passes with sponsorship ribbons",
      "Acknowledgment during opening session",
      "Logo in conference book",
      "Quarter page print ad in conference book",
      "Logo with direct link on website",
      "3 Gala dinner tickets",
    ],
  },
  {
    name: "Bronze",
    value: "bronze",
    price: "50,000 EGP",
    icon: Star,
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-300",
    benefits: [
      "Logo displayed behind speakers in press conference",
      "3' x 3' display booth in Bronze area",
      "2 attendee passes with sponsorship ribbons",
      "Logo in conference book",
      "Promotional item in conference bag",
      "Logo with direct link on website",
      "2 Gala dinner tickets",
    ],
  },
];

export default function Sponsor() {
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<SponsorshipForm>({
    resolver: zodResolver(sponsorshipSchema),
  });

  const createSponsorship = trpc.sponsorship.create.useMutation({
    onSuccess: () => {
      setShowSuccess(true);
      reset();
      toast.success("Sponsorship inquiry submitted successfully!");
      setTimeout(() => setShowSuccess(false), 5000);
    },
    onError: (error) => {
      toast.error(`Submission failed: ${error.message}`);
    },
  });

  const onSubmit = (data: SponsorshipForm) => {
    createSponsorship.mutate(data);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-accent/5 py-12 px-4">
        <Card className="max-w-2xl w-full border-2 border-green-200">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-3xl text-green-700">Thank You for Your Interest!</CardTitle>
            <CardDescription className="text-lg" dir="rtl">
              شكراً لاهتمامك!
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              We have received your sponsorship inquiry and will contact you shortly to discuss the details and finalize the partnership.
            </p>
            <p className="text-muted-foreground" dir="rtl">
              لقد استلمنا استفسارك عن الرعاية وسنتواصل معك قريباً لمناقشة التفاصيل وإتمام الشراكة.
            </p>
            <Button onClick={() => setShowSuccess(false)} className="mt-6">
              Submit Another Inquiry | إرسال استفسار آخر
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-accent/5 py-12 px-4">
      <div className="container max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">Sponsorship Packages</h1>
          <p className="text-2xl font-semibold text-secondary" dir="rtl">
            باقات الرعاية
          </p>
          <p className="text-muted-foreground mt-4 max-w-3xl mx-auto">
            Partner with us to gain market exposure, network with key government officials and industry peers, 
            and participate directly in scientific development in Egypt.
          </p>
        </div>

        {/* Sponsorship Packages */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {packages.map((pkg) => {
            const Icon = pkg.icon;
            return (
              <Card key={pkg.value} className={`border-2 ${pkg.borderColor} ${pkg.bgColor}`}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className={`w-8 h-8 ${pkg.color}`} />
                    <CardTitle className="text-2xl">{pkg.name} Package</CardTitle>
                  </div>
                  <CardDescription className="text-2xl font-bold text-primary">
                    {pkg.price}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {pkg.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Sponsorship Registration Form */}
        <Card className="border-2 max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Sponsorship Inquiry Form | نموذج استفسار الرعاية</CardTitle>
            <CardDescription>
              Fill in your details and select your preferred sponsorship package. We'll contact you to discuss the partnership.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Company Name */}
              <div className="space-y-2">
                <Label htmlFor="companyName">
                  Company / Organization Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="companyName"
                  {...register("companyName")}
                  placeholder="Your Company Name"
                />
                {errors.companyName && (
                  <p className="text-sm text-red-500">{errors.companyName.message}</p>
                )}
              </div>

              {/* Contact Person */}
              <div className="space-y-2">
                <Label htmlFor="contactPerson">
                  Contact Person <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contactPerson"
                  {...register("contactPerson")}
                  placeholder="Full Name"
                />
                {errors.contactPerson && (
                  <p className="text-sm text-red-500">{errors.contactPerson.message}</p>
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
                    placeholder="contact@company.com"
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

              {/* Company Website */}
              <div className="space-y-2">
                <Label htmlFor="companyWebsite">Company Website</Label>
                <Input
                  id="companyWebsite"
                  {...register("companyWebsite")}
                  placeholder="https://www.company.com"
                />
                {errors.companyWebsite && (
                  <p className="text-sm text-red-500">{errors.companyWebsite.message}</p>
                )}
              </div>

              {/* Package Type */}
              <div className="space-y-2">
                <Label htmlFor="packageType">
                  Sponsorship Package <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) =>
                    setValue("packageType", value as any, { shouldValidate: true })
                  }
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

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message">Additional Message (Optional)</Label>
                <Textarea
                  id="message"
                  {...register("message")}
                  placeholder="Any specific requirements or questions..."
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={createSponsorship.isPending}
              >
                {createSponsorship.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Sponsorship Inquiry | إرسال استفسار الرعاية"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-12 text-center text-muted-foreground">
          <p>
            For more information, contact us at{" "}
            <a href="mailto:science.faculty.conference2026@gmail.com" className="text-primary hover:underline">
              science.faculty.conference2026@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
