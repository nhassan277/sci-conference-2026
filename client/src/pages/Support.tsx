import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Mail, MessageSquare, HelpCircle, CheckCircle } from "lucide-react";

export default function Support() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    priority: "normal" as "low" | "normal" | "high",
  });

  const [submitted, setSubmitted] = useState(false);

  const createTicketMutation = trpc.supportTicket.create.useMutation({
    onSuccess: () => {
      toast.success("Support ticket submitted successfully!");
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        priority: "normal",
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit ticket");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    createTicketMutation.mutate(formData);
  };

  const handleReset = () => {
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/5">
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

      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-primary">Technical Support</h1>
            <p className="text-xl text-muted-foreground">الدعم الفني</p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Need help? Submit a support ticket and our team will get back to you as soon as possible.
            </p>
          </div>

          {submitted ? (
            /* Success Message */
            <Card className="border-2 border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-green-900">Ticket Submitted Successfully!</h2>
                  <p className="text-green-800">
                    Thank you for contacting us. We've received your support ticket and will respond via email shortly.
                  </p>
                  <p className="text-green-700 text-sm">
                    تم إرسال طلب الدعم بنجاح. سنقوم بالرد عليك قريباً عبر البريد الإلكتروني.
                  </p>
                  <Button onClick={handleReset} variant="outline" className="mt-4">
                    Submit Another Ticket
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {/* Contact Info Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      Contact Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p className="text-sm">support@sci2026.eg</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Phone</p>
                      <p className="text-sm">+20 2 3567 6800</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Location</p>
                      <p className="text-sm">Faculty of Science, Cairo University</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="w-5 h-5" />
                      Common Issues
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Registration problems</li>
                      <li>• Payment issues</li>
                      <li>• Abstract submission</li>
                      <li>• Schedule conflicts</li>
                      <li>• Certificate requests</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Support Form */}
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Submit Support Ticket
                    </CardTitle>
                    <CardDescription>
                      Fill out the form below and we'll respond within 24-48 hours
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">
                            Full Name <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="John Doe"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">
                            Email Address <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="john@example.com"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority Level</Label>
                        <Select
                          value={formData.priority}
                          onValueChange={(value: "low" | "normal" | "high") =>
                            setFormData({ ...formData, priority: value })
                          }
                        >
                          <SelectTrigger id="priority">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low - General inquiry</SelectItem>
                            <SelectItem value="normal">Normal - Standard support</SelectItem>
                            <SelectItem value="high">High - Urgent issue</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">
                          Subject <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          placeholder="Brief description of your issue"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">
                          Message <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Please provide detailed information about your issue..."
                          className="min-h-[150px]"
                          required
                        />
                      </div>

                      <div className="flex justify-end gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            setFormData({
                              name: "",
                              email: "",
                              subject: "",
                              message: "",
                              priority: "normal",
                            })
                          }
                        >
                          Clear Form
                        </Button>
                        <Button type="submit" disabled={createTicketMutation.isPending}>
                          {createTicketMutation.isPending ? "Submitting..." : "Submit Ticket"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
