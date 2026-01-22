import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import CountdownTimer from "@/components/CountdownTimer";
import { SocialShareButtons } from "@/components/SocialShareButtons";
import { NewsletterSubscription } from "@/components/NewsletterSubscription";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Lightbulb, Award, BookOpen, GraduationCap, Mail, Microscope, FlaskConical, Globe, Calculator, Heart, Sparkles, Atom, Zap } from "lucide-react";

export default function Home() {
  const tracks = [
    {
      icon: Microscope,
      title: "Life Sciences",
      titleAr: "العلوم الحياتية",
      description: "Biology, Biotechnology, Microbiology, Genetics",
      color: "bg-blue-100 text-blue-700"
    },
    {
      icon: Zap,
      title: "Physical Sciences",
      titleAr: "العلوم الفيزيائية",
      description: "Physics, Applied Physics, Theoretical Physics",
      color: "bg-purple-100 text-purple-700"
    },
    {
      icon: Atom,
      title: "Chemical Sciences",
      titleAr: "العلوم الكيميائية",
      description: "Chemistry, Analytical Chemistry, Organic Chemistry, Inorganic Chemistry",
      color: "bg-pink-100 text-pink-700"
    },
    {
      icon: Globe,
      title: "Geoscience and Earth Systems",
      titleAr: "علوم الأرض وأنظمة الأرض",
      description: "Sustainable resource exploration, environmental monitoring, geohazard assessment, carbon capture and storage (CCS), water resources protection",
      color: "bg-green-100 text-green-700"
    },
    {
      icon: Calculator,
      title: "Mathematical & Computational Sciences",
      titleAr: "العلوم الرياضية والحاسوبية",
      description: "Mathematics, Statistics, AI, Data Science",
      color: "bg-orange-100 text-orange-700"
    },
    {
      icon: Heart,
      title: "Medical & Health Sciences",
      titleAr: "العلوم الطبية والصحية",
      description: "Biochemistry, Pharmacology, Medical Physics",
      color: "bg-red-100 text-red-700"
    },
    {
      icon: Sparkles,
      title: "Interdisciplinary & Emerging Fields",
      titleAr: "المجالات البينية والحديثة",
      description: "Space Science, Forensics, Sustainability",
      color: "bg-indigo-100 text-indigo-700"
    },
    {
      icon: FlaskConical,
      title: "Advanced Materials Science",
      titleAr: "علوم المواد المتقدمة",
      description: "Innovations in nanomaterials, polymers, and composites for industrial applications",
      color: "bg-teal-100 text-teal-700"
    }
  ];

  const registrationCategories = [
    {
      title: "Graduate & Postgraduate Students",
      titleAr: "طلاب التخرج والدراسات العليا",
      description: "Faculty of Science - Cairo University",
      link: "https://forms.gle/zXTMLVuGvFctfn46A"
    },
    {
      title: "Faculty Members (Internal)",
      titleAr: "أعضاء هيئة التدريس (داخلي)",
      description: "Faculty of Science - Cairo University",
      link: "https://forms.gle/7XDrJb7EKY8tSYZS6"
    },
    {
      title: "External Researchers",
      titleAr: "الباحثون الخارجيون",
      description: "All Universities & Research Centers",
      link: "https://forms.gle/kMLu69y5yTxVw1LK7"
    },
    {
      title: "Industry Partners",
      titleAr: "شركاء الصناعة",
      description: "Companies & Industrial Sector",
      link: "https://forms.gle/RPmxzLSS67Qvuvxo9"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <img src="/images/logo_cu_new.png" alt="Cairo University" className="h-16 object-contain" />
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-primary">SCI 2026</h1>
                <p className="text-sm text-muted-foreground">Faculty of Science</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">
                About
              </a>
              <a href="#registration" className="text-sm font-medium hover:text-primary transition-colors">
                Registration
              </a>
              <a href="/schedule" className="text-sm font-medium hover:text-primary transition-colors">
                Schedule
              </a>
              <a href="/checkin-dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                Dashboard
              </a>
              <a href="#sponsors" className="text-sm font-medium hover:text-primary transition-colors">
                Sponsors
              </a>
            </nav>
            <img src="/images/logo_pioneers.png" alt="Pioneers in Science" className="h-16 object-contain" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-40"></div>
        
        <div className="container relative py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge className="bg-secondary text-secondary-foreground px-4 py-1.5 text-sm font-medium">
                April 7-8, 2026 | ٧-٨ أبريل ٢٠٢٦
              </Badge>
              
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-primary">
                  Science at the Core of Innovation
                </h1>
                <p className="text-2xl md:text-3xl text-secondary font-semibold" dir="rtl">
                  العلوم في قلب الإبتكار
                </p>
              </div>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Building Effective Partnerships between Universities and Industry
              </p>
              <p className="text-lg md:text-xl text-muted-foreground" dir="rtl">
                بناء شراكات فاعلة بين الجامعات والصناعة
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 bg-primary hover:bg-primary/90"
                  onClick={() => document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Register Now | سجل الآن
                </Button>
                <Link href="/schedule">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                    View Program | البرنامج
                  </Button>
                </Link>
                <Link href="/live-gallery">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                    Photo Gallery | معرض الصور
                  </Button>
                </Link>
              </div>

              <div className="grid sm:grid-cols-3 gap-6 pt-8">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">April 7-8</p>
                    <p className="text-sm text-muted-foreground">2026</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Cairo University</p>
                    <p className="text-sm text-muted-foreground">University Hostel</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Faculty of Science</p>
                    <p className="text-sm text-muted-foreground">Conference Hall</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative max-w-sm mx-auto">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white">
                <img 
                  src="/images/conference-poster-latest.png" 
                  alt="SCI 2026 Conference" 
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary/20 rounded-full blur-3xl"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
            </div>
          </div>
          
          {/* Countdown Timer Section */}
          <div className="container relative py-12">
            <CountdownTimer />
          </div>
          
          {/* Social Share Section */}
          <div className="container relative pb-12">
            <div className="flex justify-center">
              <SocialShareButtons />
            </div>
          </div>
        </div>
      </section>

      {/* Patronage Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-primary" dir="rtl">تحت رعاية</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-xl">Prof. Dr. Mohamed Samy Abdel Sadek</CardTitle>
                  <CardDescription className="text-base" dir="rtl">
                    الأستاذ الدكتور/ محمد سامي عبد الصادق<br/>
                    رئيس جامعة القاهرة
                  </CardDescription>
                  <CardDescription className="text-sm">
                    President of Cairo University
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-xl">Prof. Dr. Sohair Ramadan Fahmy</CardTitle>
                  <CardDescription className="text-base" dir="rtl">
                    الأستاذ الدكتور/ سهير رمضان فهمي<br/>
                    عميد كلية العلوم جامعة القاهرة
                  </CardDescription>
                  <CardDescription className="text-sm">
                    Dean of Faculty of Science - Cairo University
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
            
            {/* Conference Coordinator */}
            <div className="max-w-2xl mx-auto mt-8">
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-xl">Prof. Dr. Emtithal Mohamed Abdel Samie</CardTitle>
                  <CardDescription className="text-base" dir="rtl">
                    الأستاذ الدكتور/ امتثال محمد عبد السميع<br/>
                    المنسق العام للمؤتمر
                  </CardDescription>
                  <CardDescription className="text-sm">
                    Conference General Coordinator
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Organizing Committee Section */}
      <section className="py-20 bg-gradient-to-b from-accent/5 to-white">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-primary">Organizing Committee</h2>
            <p className="text-2xl font-semibold text-secondary" dir="rtl">اللجنة التنظيمية</p>
          </div>

          {/* Coordinator */}
          <div className="max-w-2xl mx-auto mb-12">
            <Card className="border-2 border-primary/30 hover:border-primary/50 transition-colors">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-primary">Prof. Dr. Emtithal Mohamed Abdel Samie</CardTitle>
                <CardDescription className="text-lg" dir="rtl">
                  الأستاذ الدكتور/ امتثال محمد عبد السميع
                </CardDescription>
                <CardDescription className="text-base font-semibold text-primary">
                  Conference General Coordinator
                </CardDescription>
                <CardDescription className="text-base" dir="rtl">
                  المنسق العام للمؤتمر
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Team Members */}
          <div className="max-w-5xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-8 text-primary">Team | الفريق</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow border-2 hover:border-primary/50">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">Dr. Nourhan Hassan</CardTitle>
                  <CardDescription dir="rtl">
                    د. نورهان حسن
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="hover:shadow-lg transition-shadow border-2 hover:border-primary/50">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">Dr. Dina Amr</CardTitle>
                  <CardDescription dir="rtl">
                    د. دينا عمرو
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="hover:shadow-lg transition-shadow border-2 hover:border-primary/50">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">Dr. Nahla Osama</CardTitle>
                  <CardDescription dir="rtl">
                    د. نهلة أسامة
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-b from-accent/5 to-white">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-primary">About the Conference</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              The Science at the Core of Innovation (SCI 2026) conference aims to bridge the gap between academic research 
              and industrial applications, fostering collaboration and innovation across all scientific disciplines.
            </p>
            <div className="grid md:grid-cols-3 gap-6 pt-8">
              <Card>
                <CardHeader>
                  <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                  <CardTitle>Excellence</CardTitle>
                  <CardDescription>
                    Showcasing cutting-edge research and innovations
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                  <CardTitle>Collaboration</CardTitle>
                  <CardDescription>
                    Building partnerships between academia and industry
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
                  <CardTitle>Innovation</CardTitle>
                  <CardDescription>
                    Transforming scientific discoveries into real-world solutions
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Research Tracks */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-primary">Research Tracks</h2>
            <p className="text-2xl font-semibold text-secondary" dir="rtl">المحاور البحثية</p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Six comprehensive tracks covering all scientific disciplines
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tracks.map((track, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-2 hover:border-primary/50">
                <CardHeader>
                  <div className={`w-16 h-16 rounded-xl ${track.color} flex items-center justify-center mb-4`}>
                    <track.icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-xl">{track.title}</CardTitle>
                  <CardDescription className="text-base font-medium" dir="rtl">
                    {track.titleAr}
                  </CardDescription>
                  <CardDescription className="text-sm pt-2">
                    {track.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section id="registration" className="py-20 bg-gradient-to-b from-primary/5 to-white">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-primary">Registration</h2>
            <p className="text-2xl font-semibold text-secondary" dir="rtl">التسجيل</p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose your category and submit your registration
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {registrationCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-2 hover:border-primary/50">
                <CardHeader>
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                  <CardDescription className="text-base font-medium" dir="rtl">
                    {category.titleAr}
                  </CardDescription>
                  <CardDescription className="text-sm pt-2">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => window.open(category.link, '_blank')}
                  >
                    Register | سجل الآن
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Attendance Only Registration */}
          <div className="mt-12 text-center">
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="border-t pt-8">
                <h3 className="text-2xl font-bold text-primary mb-2">Attendance Only</h3>
                <p className="text-lg font-semibold text-secondary mb-3" dir="rtl">الحضور فقط</p>
                <p className="text-muted-foreground mb-6">
                  If you only plan to attend the conference without presenting research or participating in workshops, register here.
                </p>
                <Link href="/attendance">
                  <Button size="lg" className="px-8">
                    Register for Attendance | تسجيل الحضور
                  </Button>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* NAWAH Workshops */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-primary">Professional Workshops</h2>
              <p className="text-xl text-muted-foreground">
                In collaboration with NAWAH Scientific
              </p>
            </div>

            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl">Hands-on Training & Certification</CardTitle>
                <CardDescription className="text-base space-y-4 pt-4">
                  <p>
                    As part of the conference program, a series of hands-on and professional workshops will be delivered 
                    in collaboration with <strong>NAWAH Scientific</strong>, a leading provider of advanced scientific services 
                    and research solutions.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-left">
                    <li>Workshops will be open to registered participants</li>
                    <li>Separate workshop registration may apply due to limited capacity</li>
                    <li>Certificates of completion will be provided by NAWAH</li>
                  </ul>
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Sponsors & Partners Section */}
      <section id="sponsors" className="py-20 bg-gradient-to-b from-white to-accent/5">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-primary">Sponsors & Partners</h2>
              <p className="text-2xl font-semibold text-secondary" dir="rtl">الرعاة والشركاء</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* NAWAH Scientific */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-center h-32 bg-white rounded-lg mb-4 p-4">
                    <img 
                      src="/images/nawah-logo.webp" 
                      alt="NAWAH Scientific" 
                      className="h-full w-auto object-contain"
                    />
                  </div>
                  <CardTitle className="text-xl text-center">NAWAH Scientific</CardTitle>
                  <CardDescription className="text-center">
                    Workshop Partner | شريك ورش العمل
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center">
                    Leading provider of advanced scientific services and research solutions
                  </p>
                  <p className="text-sm text-muted-foreground text-center mt-2" dir="rtl">
                    مزود رائد للخدمات العلمية المتقدمة وحلول البحث
                  </p>
                </CardContent>
              </Card>

              {/* Placeholder for future sponsors */}
              <Card className="hover:shadow-lg transition-shadow border-dashed">
                <CardHeader>
                  <div className="flex items-center justify-center h-32 bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg mb-4">
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-muted-foreground">Your Organization</h3>
                      <p className="text-sm text-muted-foreground mt-1">Become a Sponsor</p>
                    </div>
                  </div>
                  <CardTitle className="text-xl text-center">Sponsorship Opportunities</CardTitle>
                  <CardDescription className="text-center" dir="rtl">
                    فرص الرعاية
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Join us as a sponsor and support scientific innovation
                  </p>
                  <Link href="/sponsor">
                    <Button 
                      variant="outline" 
                      className="w-full"
                    >
                      View Packages | عرض الباقات
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <NewsletterSubscription />
          </div>
        </div>
      </section>

      {/* Location & Map Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-primary">Location</h2>
              <p className="text-2xl font-semibold text-secondary" dir="rtl">الموقع</p>
              <div className="space-y-2">
                <p className="text-lg text-muted-foreground">
                  Conference Hall, Cairo University, University Hostel
                </p>
                <p className="text-lg text-muted-foreground" dir="rtl">
                  قاعة المؤتمرات، جامعة القاهرة، المدينة الجامعية
                </p>
              </div>
            </div>

            <Card className="overflow-hidden border-2">
              <CardContent className="p-0">
                <div className="aspect-video w-full">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3456.0!2d31.2!3d30.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583fa60b21beeb%3A0x79dfb296e8423bba!2sCairo%20University!5e0!3m2!1sen!2seg!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Conference Location"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="text-center mt-8">
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.open('https://maps.app.goo.gl/gyvCQd6K6zEWL5tL6', '_blank')}
                className="gap-2"
              >
                <MapPin className="w-5 h-5" />
                Open in Google Maps | افتح في خرائط جوجل
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-b from-accent/5 to-primary/5">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-primary">Contact Us</h2>
              <p className="text-2xl font-semibold text-secondary" dir="rtl">للاستفسار</p>
              <p className="text-muted-foreground">Have questions? Send us a message and we'll get back to you soon.</p>
              <p className="text-muted-foreground" dir="rtl">لديك أسئلة؟ أرسل لنا رسالة وسنرد عليك قريباً</p>
            </div>

            <Card className="border-2">
              <CardContent className="pt-6">
                <form 
                  className="space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const name = formData.get('name');
                    const email = formData.get('email');
                    const subject = formData.get('subject');
                    const message = formData.get('message');
                    window.location.href = `mailto:science.faculty.conference2026@gmail.com?subject=${encodeURIComponent(subject as string)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
                  }}
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Name | الاسم
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email | البريد الإلكتروني
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject | الموضوع
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="What is your inquiry about?"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message | الرسالة
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      placeholder="Type your message here..."
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    <Mail className="w-5 h-5 mr-2" />
                    Send Message | إرسال الرسالة
                  </Button>
                </form>

                <div className="mt-8 pt-8 border-t text-center space-y-4">
                  <p className="text-sm font-medium">Or email us directly at:</p>
                  <a 
                    href="mailto:science.faculty.conference2026@gmail.com" 
                    className="text-primary hover:underline font-medium inline-flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    science.faculty.conference2026@gmail.com
                  </a>
                  <div className="pt-4 space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Conference Hall, Cairo University, University Hostel
                    </p>
                    <p className="text-sm text-muted-foreground" dir="rtl">
                      قاعة المؤتمرات، جامعة القاهرة، المدينة الجامعية
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">SCI 2026</h3>
              <p className="text-sm opacity-90">
                Science at the Core of Innovation
              </p>
              <p className="text-sm opacity-90" dir="rtl">
                العلوم في قلب الإبتكار
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm opacity-90">
                <li><a href="#about" className="hover:underline">About</a></li>
                <li><a href="#tracks" className="hover:underline">Research Tracks</a></li>
                <li><a href="#registration" className="hover:underline">Registration</a></li>
                <li><a href="#contact" className="hover:underline">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Organizers</h3>
              <p className="text-sm opacity-90">
                Faculty of Science<br/>
                Cairo University<br/>
                Egypt
              </p>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm opacity-75">
            <p>© 2026 Faculty of Science, Cairo University. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
