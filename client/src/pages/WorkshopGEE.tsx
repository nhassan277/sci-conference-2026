import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Calendar, Clock, MapPin, User, Laptop, BookOpen,
  ChevronDown, ChevronUp, Download, CheckCircle2, ExternalLink,
  GraduationCap, Cpu, Globe, Leaf
} from "lucide-react";

const SYLLABUS = [
  {
    level: "Level 1",
    title: "Basics of GEE",
    icon: BookOpen,
    color: "bg-blue-50 border-blue-200 text-blue-800",
    iconColor: "text-blue-600",
    sessions: [
      {
        hour: "Hour 1",
        items: [
          { title: "Overview of Cloud-Based RS Analysis with GEE", points: ["Cloud computing vs. traditional RS workflows", "Role of GEE in revolutionizing remote sensing", "Making researchers account on GEE"] },
          { title: "Basics of JavaScript", points: ["JavaScript syntax, variables, functions, loops", "GEE's JavaScript-based Code Editor interface", "Hands-on mini-coding warm-up"] },
        ]
      },
      {
        hour: "Hour 2",
        items: [
          { title: "Building Unit Code of GEE", points: ["Scripting structure and hidden pattern of coding", "Filtering datasets by date and location (space–time)", "Visualization parameters and map layers"] },
          { title: "Acquiring the Two Outputs of GEE (Maps & Charts)", points: ["Displaying raster results and customizing visualizations", "Generating time series charts from ImageCollections", "Exporting data"] },
        ]
      }
    ]
  },
  {
    level: "Level 2",
    title: "AI & ML of GEE",
    icon: Cpu,
    color: "bg-purple-50 border-purple-200 text-purple-800",
    iconColor: "text-purple-600",
    sessions: [
      {
        hour: "Hour 3",
        items: [
          { title: "Data Analysis (Descriptive, Diagnostic, Predictive, Prescriptive)", points: ["Types of data analysis: descriptive, diagnostic, predictive, prescriptive", "Use of reducers", "Time series analysis for vegetation, temperature, etc."] },
          { title: "AI & ML for GEE", points: ["Machine learning concepts in GEE", "Algorithms: CART, SVM, Random Forest, k-Means", "Model training, evaluation, and application"] },
        ]
      }
    ]
  },
  {
    level: "Level 3",
    title: "Applied Projects",
    icon: Globe,
    color: "bg-green-50 border-green-200 text-green-800",
    iconColor: "text-green-600",
    sessions: [
      {
        hour: "Hour 4",
        items: [
          { title: "Climate Change & Meteorological Parameters in GEE", points: ["Climate datasets: ERA5, MODIS, CHIRPS", "Temporal analysis of temperature, precipitation", "Indices: LST, TCI, PDSI, SPI — trend detection"] },
          { title: "Agricultural & Air Pollution Applications", points: ["Crop monitoring: NDVI, EVI, phenological metrics", "Soil moisture, evapotranspiration estimation", "Air quality mapping (NO2, Aerosol Optical Depth)"] },
        ]
      }
    ]
  }
];

const TARGET_FACULTIES = [
  "Science (Meteorology, Space Science, Botany, Geology, Physics, Computer)",
  "Agriculture",
  "Arts — Geography",
  "Education — Geography",
  "Information Technology & Computers",
  "Engineering — Geomatics",
];

export default function WorkshopGEE() {
  const [, setLocation] = useLocation();
  const [openLevel, setOpenLevel] = useState<number | null>(0);
  const [showForm, setShowForm] = useState(false);
  const [registrationId, setRegistrationId] = useState<number | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Read URL params for payment result
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "success") {
      setPaymentSuccess(true);
      const regId = params.get("reg_id");
      if (regId) setRegistrationId(parseInt(regId));
    }
  }, []);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    affiliation: "",
    academicLevel: "" as "undergraduate" | "postgraduate" | "faculty" | "professional" | "",
    faculty: "",
    hasLaptop: false,
    notes: "",
  });

  const createMutation = trpc.workshopReg.create.useMutation();
  const checkoutMutation = trpc.workshopReg.createCheckout.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.academicLevel) {
      toast.error("Please select your academic level");
      return;
    }
    try {
      const result = await createMutation.mutateAsync({
        workshopKey: "gee_remote_sensing",
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        affiliation: form.affiliation,
        academicLevel: form.academicLevel as any,
        faculty: form.faculty || undefined,
        hasLaptop: form.hasLaptop,
        notes: form.notes || undefined,
      });

      toast.success("Registration saved! Redirecting to payment…");

      // Create Stripe checkout
      const checkout = await checkoutMutation.mutateAsync({
        registrationId: result.registrationId,
        email: form.email,
        fullName: form.fullName,
      });

      if (checkout.checkoutUrl) {
        window.open(checkout.checkoutUrl, "_blank");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    }
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-6">
        <Card className="max-w-lg w-full text-center shadow-xl">
          <CardContent className="pt-10 pb-8 space-y-4">
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold text-green-700">Payment Successful!</h2>
            <p className="text-muted-foreground">
              You are now registered for the <strong>GEE Remote Sensing Workshop</strong>.<br />
              A confirmation will be sent to your email.
            </p>
            <div className="bg-green-50 rounded-lg p-4 text-sm text-green-800 space-y-1">
              <p><strong>Date:</strong> Saturday, April 11, 2026</p>
              <p><strong>Time:</strong> 10:00 AM – 2:00 PM</p>
              <p><strong>Location:</strong> Ibn Sina Hall, Faculty of Science, Cairo University</p>
              <p><strong>Reminder:</strong> Please bring your laptop</p>
            </div>
            <Button onClick={() => setLocation("/")} className="mt-4">Back to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-3 flex items-center justify-between">
          <button onClick={() => setLocation("/")} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/images/logo_cu.png" alt="Cairo University" className="h-10 object-contain" />
            <span className="font-bold text-primary hidden sm:block">SCI 2026</span>
          </button>
          <Badge className="bg-primary text-white px-3 py-1">Post-Conference Workshop</Badge>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0A1F44] via-[#0d2a5e] to-[#1a3a7a] text-white py-16 md:py-24">
        <div className="container max-w-5xl">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-yellow-400 text-yellow-900 font-semibold">Post-Conference Workshop</Badge>
              <Badge className="bg-white/20 text-white border border-white/30">200 EGP</Badge>
              <Badge className="bg-teal-500 text-white">4 Hours</Badge>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              Programming-based Remote Sensing Analysis<br />
              <span className="text-yellow-400">of Google Earth Engine</span>
            </h1>
            <p className="text-lg text-white/80 max-w-3xl">
              A hands-on 4-hour workshop covering cloud-based remote sensing, JavaScript programming in GEE,
              machine learning applications, and real-world climate & environmental projects.
            </p>

            {/* Key info */}
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              {[
                { icon: Calendar, label: "Date", value: "Saturday, April 11, 2026" },
                { icon: Clock, label: "Time", value: "10:00 AM – 2:00 PM" },
                { icon: MapPin, label: "Location", value: "Ibn Sina Hall" },
                { icon: Laptop, label: "Requirement", value: "Laptop Required" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3 bg-white/10 rounded-lg p-3">
                  <Icon className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-white/60 uppercase tracking-wide">{label}</p>
                    <p className="text-sm font-semibold">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                size="lg"
                className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-bold px-8"
                onClick={() => setShowForm(true)}
              >
                Register Now — 200 EGP
              </Button>
              <a
                href="https://d2xsxph8kpxj0f.cloudfront.net/118031311/BK5ELr97meyN2f7P5B76DF/abstractofworkshop_0ea1a238.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 gap-2">
                  <Download className="w-4 h-4" /> Download Abstract
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Instructor */}
      <section className="py-12 bg-gray-50 border-b">
        <div className="container max-w-5xl">
          <h2 className="text-2xl font-bold text-primary mb-6">Workshop Instructor</h2>
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <User className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Engineer Sherif Shallal</h3>
              <p className="text-primary font-medium">CEO & Technical Team Manager — Lunar Code for Information Systems</p>
              <p className="text-muted-foreground">
                Master's Degree Researcher in <strong>Climate Change Monitoring by Remote Sensing</strong>,
                Faculty of Science, Suez Canal University
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <Badge variant="secondary">Google Earth Engine</Badge>
                <Badge variant="secondary">Remote Sensing</Badge>
                <Badge variant="secondary">Climate Change</Badge>
                <Badge variant="secondary">Machine Learning</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Abstract */}
      <section className="py-12 border-b">
        <div className="container max-w-5xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primary">Workshop Abstract</h2>
            <a
              href="https://d2xsxph8kpxj0f.cloudfront.net/118031311/BK5ELr97meyN2f7P5B76DF/abstractofworkshop_0ea1a238.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <Download className="w-4 h-4" /> Download PDF
            </a>
          </div>
          <p className="text-muted-foreground leading-relaxed text-base">
            The Programming-based Remote Sensing Analysis of Google Earth Engine (GEE) Workshop is a
            4-hour training program designed for undergraduate and postgraduate students across disciplines
            including science, agriculture, geography, engineering, and information technology. The workshop
            introduces participants to cloud-based remote sensing analysis using GEE, emphasizing the
            transition from traditional workflows to scalable, cloud-driven approaches.
          </p>
          <p className="text-muted-foreground leading-relaxed text-base mt-3">
            The course is structured into three progressive levels covering GEE foundations, machine learning
            applications (Random Forest, SVM, CART, k-Means), and real-world projects in climate change
            monitoring, agricultural assessment, and air pollution mapping. Overall, the workshop equips
            students with practical programming and analytical skills to apply remote sensing techniques
            using GEE for environmental and geospatial problem-solving.
          </p>
          <div className="mt-4">
            <a
              href="https://d2xsxph8kpxj0f.cloudfront.net/118031311/BK5ELr97meyN2f7P5B76DF/Cloud_ProgrammingbasedRemoteSensingAnalysisWorkshop_b74d12dd.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
            >
              <ExternalLink className="w-4 h-4" /> View Full Workshop Program (PDF)
            </a>
          </div>
        </div>
      </section>

      {/* Syllabus */}
      <section className="py-12 border-b">
        <div className="container max-w-5xl">
          <h2 className="text-2xl font-bold text-primary mb-8">Workshop Syllabus</h2>
          <div className="space-y-4">
            {SYLLABUS.map((level, idx) => {
              const Icon = level.icon;
              const isOpen = openLevel === idx;
              return (
                <div key={idx} className={`border-2 rounded-xl overflow-hidden ${level.color}`}>
                  <button
                    className="w-full flex items-center justify-between p-5 text-left"
                    onClick={() => setOpenLevel(isOpen ? null : idx)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-6 h-6 ${level.iconColor}`} />
                      <div>
                        <span className="text-xs font-bold uppercase tracking-widest opacity-60">{level.level}</span>
                        <h3 className="text-lg font-bold">{level.title}</h3>
                      </div>
                    </div>
                    {isOpen ? <ChevronUp className="w-5 h-5 opacity-60" /> : <ChevronDown className="w-5 h-5 opacity-60" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 space-y-4 bg-white/60">
                      {level.sessions.map((session, si) => (
                        <div key={si}>
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">{session.hour}</p>
                          <div className="grid md:grid-cols-2 gap-3">
                            {session.items.map((item, ii) => (
                              <div key={ii} className="bg-white rounded-lg p-4 border">
                                <p className="font-semibold text-sm mb-2">{item.title}</p>
                                <ul className="space-y-1">
                                  {item.points.map((pt, pi) => (
                                    <li key={pi} className="text-xs text-muted-foreground flex gap-2">
                                      <span className="text-primary mt-0.5">•</span> {pt}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-12 bg-gray-50 border-b">
        <div className="container max-w-5xl">
          <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
            <GraduationCap className="w-6 h-6" /> Target Audience
          </h2>
          <p className="text-muted-foreground mb-4">Undergraduate & Postgraduate Students from the following faculties:</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {TARGET_FACULTIES.map((f, i) => (
              <div key={i} className="flex items-start gap-2 bg-white rounded-lg p-3 border">
                <Leaf className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                <span className="text-sm">{f}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
            <Laptop className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800">
              <strong>Laptops are required</strong> — the workshop content is practical and includes programming exercises.
              Please bring your own laptop with a stable internet connection.
            </p>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section id="register" className="py-16">
        <div className="container max-w-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary">Register for the Workshop</h2>
            <p className="text-muted-foreground mt-2">Registration fee: <strong>200 EGP</strong> — paid securely via Stripe</p>
          </div>

          {!showForm ? (
            <div className="text-center">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white px-10 py-6 text-lg"
                onClick={() => setShowForm(true)}
              >
                Register Now — 200 EGP
              </Button>
            </div>
          ) : (
            <Card className="shadow-lg border-2">
              <CardHeader>
                <CardTitle>Registration Form</CardTitle>
                <CardDescription>Fill in your details to secure your spot. Payment is processed via Stripe.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      placeholder="Your full name"
                      value={form.fullName}
                      onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        placeholder="+20 1XX XXX XXXX"
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="affiliation">University / Affiliation *</Label>
                    <Input
                      id="affiliation"
                      placeholder="e.g. Cairo University"
                      value={form.affiliation}
                      onChange={e => setForm(f => ({ ...f, affiliation: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Academic Level *</Label>
                      <Select
                        value={form.academicLevel}
                        onValueChange={v => setForm(f => ({ ...f, academicLevel: v as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="undergraduate">Undergraduate</SelectItem>
                          <SelectItem value="postgraduate">Postgraduate</SelectItem>
                          <SelectItem value="faculty">Faculty Member</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="faculty">Faculty / Department</Label>
                      <Input
                        id="faculty"
                        placeholder="e.g. Faculty of Science"
                        value={form.faculty}
                        onChange={e => setForm(f => ({ ...f, faculty: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <Checkbox
                      id="hasLaptop"
                      checked={form.hasLaptop}
                      onCheckedChange={v => setForm(f => ({ ...f, hasLaptop: !!v }))}
                    />
                    <div>
                      <Label htmlFor="hasLaptop" className="font-semibold cursor-pointer">
                        I confirm I will bring my laptop
                      </Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        A laptop is required for the hands-on programming sessions.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes (optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any special requirements or questions?"
                      value={form.notes}
                      onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                    <p className="font-semibold mb-1">Payment Information</p>
                    <p>After submitting this form, you will be redirected to Stripe's secure checkout to pay <strong>200 EGP</strong>. Your registration is confirmed only after successful payment.</p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-base font-semibold"
                    disabled={createMutation.isPending || checkoutMutation.isPending}
                  >
                    {createMutation.isPending || checkoutMutation.isPending
                      ? "Processing…"
                      : "Proceed to Payment — 200 EGP"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A1F44] text-white py-8">
        <div className="container text-center space-y-2">
          <p className="font-semibold">SCI 2026 — Science at the Core of Innovation</p>
          <p className="text-white/60 text-sm">April 7–8, 2026 (Conference) · April 11, 2026 (Workshop)</p>
          <p className="text-white/60 text-sm">Faculty of Science, Cairo University · sciconf26.website</p>
        </div>
      </footer>
    </div>
  );
}
