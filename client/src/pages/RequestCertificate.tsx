import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, Award, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";

export default function RequestCertificate() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    affiliation: "",
    attendeeCategory: "" as "student" | "faculty" | "researcher" | "industry" | "",
  });

  const createRequest = trpc.certificate.create.useMutation();
  const createCheckout = trpc.certificate.createCheckoutSession.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.attendeeCategory) {
      toast({
        title: "Error",
        description: "Please select your category",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create certificate request
      const result = await createRequest.mutateAsync({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        affiliation: formData.affiliation,
        attendeeCategory: formData.attendeeCategory,
      });

      if (result.success && result.requestId) {
        // Create Stripe checkout session
        const checkout = await createCheckout.mutateAsync({
          requestId: result.requestId,
        });

        if (checkout.checkoutUrl) {
          // Redirect to Stripe checkout
          window.location.href = checkout.checkoutUrl;
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process request",
        variant: "destructive",
      });
    }
  };

  const isLoading = createRequest.isPending || createCheckout.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <img src="/images/logo_cu_new.png" alt="Cairo University" className="h-16 object-contain" />
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-primary">SCI 2026</h1>
                <p className="text-sm text-muted-foreground">Faculty of Science</p>
              </div>
            </div>
            <img src="/images/logo_pioneers.png" alt="Pioneers in Science" className="h-16 object-contain" />
          </div>
        </div>
      </header>

      <div className="container py-12">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              ← Back to Home
            </Button>
          </Link>

          {/* Page Header */}
          <div className="text-center space-y-4 mb-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Award className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-primary">Request Certificate</h1>
            <p className="text-xl font-semibold text-secondary" dir="rtl">
              طلب شهادة المشاركة
            </p>
            <p className="text-muted-foreground">
              Get your official SCI 2026 participation certificate
            </p>
          </div>

          {/* Pricing Info */}
          <Card className="mb-8 border-2 border-green-500 bg-green-50/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-green-700">Certificate Fee</p>
                  <p className="text-sm text-muted-foreground">One-time payment</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">100 EGP</p>
                  <p className="text-sm text-muted-foreground" dir="rtl">
                    ١٠٠ جنيه مصري
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>Certificate Request Form</CardTitle>
              <CardDescription>
                Fill in your details to request your participation certificate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+20 XXX XXX XXXX"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="affiliation">
                    Affiliation <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="affiliation"
                    value={formData.affiliation}
                    onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
                    placeholder="University / Company / Institution"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.attendeeCategory}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        attendeeCategory: value as "student" | "faculty" | "researcher" | "industry",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="faculty">Faculty Member</SelectItem>
                      <SelectItem value="researcher">Researcher</SelectItem>
                      <SelectItem value="industry">Industry Partner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-1">What happens next?</p>
                      <ul className="list-disc list-inside space-y-1 text-blue-800">
                        <li>You'll be redirected to secure Stripe payment</li>
                        <li>Complete payment of 100 EGP</li>
                        <li>Receive confirmation email</li>
                        <li>Certificate will be generated and sent to your email</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Proceed to Payment"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg">Certificate Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>✓ Official certificate from Cairo University Faculty of Science</p>
              <p>✓ Includes your name, conference details, and official seal</p>
              <p>✓ Digital PDF format delivered via email</p>
              <p>✓ Suitable for academic and professional purposes</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
