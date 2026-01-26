import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Mail, Download } from "lucide-react";
import { Link } from "wouter";

export default function CertificateSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
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
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Success Icon */}
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          {/* Success Message */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-green-700">Payment Successful!</h1>
            <p className="text-xl font-semibold text-secondary" dir="rtl">
              تم الدفع بنجاح!
            </p>
            <p className="text-lg text-muted-foreground">
              Your certificate request has been processed successfully
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <Card>
              <CardHeader>
                <Mail className="w-8 h-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Check Your Email</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  A confirmation email has been sent to your registered email address with payment details.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Download className="w-8 h-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Certificate Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Your certificate will be generated and sent to your email within 3-5 business days.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent className="text-left space-y-3 text-sm text-muted-foreground">
              <p>✓ You will receive a payment confirmation email shortly</p>
              <p>✓ Your certificate will be processed by our team</p>
              <p>✓ The certificate will be sent as a PDF to your email</p>
              <p>✓ If you don't receive it within 5 business days, please contact us</p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/">
              <Button size="lg" className="px-8">
                Return to Homepage
              </Button>
            </Link>
            <Link href="/#registration">
              <Button size="lg" variant="outline" className="px-8">
                View Conference Details
              </Button>
            </Link>
          </div>

          {/* Support */}
          <div className="pt-8 border-t">
            <p className="text-sm text-muted-foreground">
              Need help? Contact us at{" "}
              <a href="mailto:sci2026@science.cu.edu.eg" className="text-primary hover:underline">
                sci2026@science.cu.edu.eg
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
