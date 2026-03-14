import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import CountdownTimer from "@/components/CountdownTimer";
import { SocialShareButtons } from "@/components/SocialShareButtons";
import { NewsletterSubscription } from "@/components/NewsletterSubscription";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Lightbulb, Award, BookOpen, GraduationCap, Mail, Microscope, FlaskConical, Globe, Calculator, Heart, Sparkles, Atom, Zap, Telescope } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const { data: workshopCounts } = trpc.registration.getWorkshopCounts.useQuery();
  const WORKSHOP_LIMIT = 30;
  const COLORS_LIMIT = 25;

  const getSpotsBadge = (count: number) => {
    const remaining = WORKSHOP_LIMIT - count;
    if (remaining <= 0) return <Badge className="bg-red-100 text-red-800 text-xs">Full 🔴</Badge>;
    if (remaining <= 5) return <Badge className="bg-red-100 text-red-800 text-xs">{remaining} spots left 🔴</Badge>;
    if (remaining <= 15) return <Badge className="bg-amber-100 text-amber-800 text-xs">{remaining}/{WORKSHOP_LIMIT} spots left 🟡</Badge>;
    return <Badge className="bg-green-100 text-green-800 text-xs">{remaining}/{WORKSHOP_LIMIT} spots left 🟢</Badge>;
  };
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
      description: "Physical Chemistry, Analytical Chemistry, Organic Chemistry, Inorganic Chemistry",
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
    },
    {
      icon: Telescope,
      title: "Astronomy, Space & Meteorology",
      titleAr: "الفلك والفضاء والأرصاد الجوية",
      description: "Astrophysics, Space Exploration, Climate Science, Atmospheric Research",
      color: "bg-cyan-100 text-cyan-700"
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
            <div className="flex items-center gap-4">
              <img src="/images/logo_cu_new.png" alt="Cairo University" className="h-16 object-contain" />
              <img src="/images/logo_faculty_science.jpeg" alt="Faculty of Science" className="h-16 object-contain" />
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
              <a href="/speakers" className="text-sm font-medium hover:text-primary transition-colors">
                Keynote and Invited Speakers
              </a>
              <a href="/schedule" className="text-sm font-medium hover:text-primary transition-colors">
                Schedule
              </a>
              <a href="/awards" className="text-sm font-medium hover:text-primary transition-colors">
                Awards
              </a>
              <a href="/media-registration" className="text-sm font-medium hover:text-primary transition-colors">
                Media
              </a>
              <a href="/volunteer" className="text-sm font-medium hover:text-primary transition-colors">
                Volunteer
              </a>
              <a href="/sponsor" className="text-sm font-medium hover:text-primary transition-colors">
                Sponsors
              </a>
              <a href="/checkin-dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                Dashboard
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
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-secondary text-secondary-foreground px-4 py-1.5 text-sm font-medium">
                  April 7-8, 2026 | ٧-٨ أبريل ٢٠٢٦
                </Badge>
                <Badge className="bg-green-600 text-white px-4 py-1.5 text-sm font-medium">
                  ✓ Free Attendance | الحضور مجاناً
                </Badge>
                <Badge className="bg-blue-600 text-white px-4 py-1.5 text-sm font-medium">
                  Conference Certificate: 100 EGP | شهادة المؤتمر: ١٠٠ ج
                </Badge>
              </div>
              
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
                    الأستاذ الدكتور/ سهير رمضان فهمي
                  </CardDescription>
                  <CardDescription className="text-sm">
                    عميد كلية العلوم - جامعة القاهرة<br/>
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
                <div className="flex justify-center mb-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
                    <img 
                      src="https://files.manuscdn.com/user_upload_by_module/session_file/118031311/jIIzDxPeBLWRTLvp.jpeg" 
                      alt="Prof. Dr. Emtithal Mohamed Abdel Samie" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
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
            <h3 className="text-2xl font-bold text-center mb-2 text-primary">Team | الفريق</h3>
            <p className="text-center text-base text-muted-foreground mb-8">
              Lecturers at Biotechnology Department | مدرسون بقسم التكنولوجيا الحيوية
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow border-2 hover:border-primary/50">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
                      <img 
                        src="https://files.manuscdn.com/user_upload_by_module/session_file/118031311/AgfGFlGDGhMgodtH.jpg" 
                        alt="Dr. Nourhan Hassan" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <CardTitle className="text-lg">Dr. Nourhan Hassan</CardTitle>
                  <CardDescription dir="rtl">
                    د. نورهان حسن
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow border-2 hover:border-primary/50">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
                      <img 
                        src="https://d2xsxph8kpxj0f.cloudfront.net/118031311/BK5ELr97meyN2f7P5B76DF/dina_amr_photo_c47be1c9.png" 
                        alt="Dr. Dina Amr" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <CardTitle className="text-lg">Dr. Dina Amr</CardTitle>
                  <CardDescription dir="rtl">
                    د. دينا عمرو
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow border-2 hover:border-primary/50">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
                      <img 
                        src="https://files.manuscdn.com/user_upload_by_module/session_file/118031311/PTtRzbZnNIobKpQd.jpeg" 
                        alt="Dr. Nahla Osama" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
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

      {/* Conference Awards Section */}
      <section className="py-20 bg-gradient-to-b from-white to-accent/5">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-primary">Conference Awards</h2>
            <p className="text-2xl font-semibold text-secondary" dir="rtl">جوائز المؤتمر</p>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Seven prestigious awards recognizing excellence in scientific research and innovation
            </p>
            <p className="text-base text-muted-foreground max-w-3xl mx-auto" dir="rtl">
              سبع جوائز مرموقة لتكريم التميز في البحث العلمي والابتكار
            </p>
          </div>

          {/* Awards Graphic */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://files.manuscdn.com/user_upload_by_module/session_file/118031311/iDQaNJqKhQPQfZIT.png" 
                alt="SCI 2026 Conference Awards" 
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Key Information */}
          <div className="max-w-3xl mx-auto">
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Automatic Eligibility for All Participants</CardTitle>
                <CardDescription className="text-center text-lg" dir="rtl">
                  الأهلية التلقائية لجميع المشاركين
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-center text-base">
                  All registered participants who present research, projects, or innovations during SCI 2026 
                  will be automatically considered for the relevant awards. No separate application needed!
                </p>
                <p className="text-center text-base" dir="rtl">
                  جميع المشاركين المسجلين الذين يقدمون أبحاثًا أو مشاريع أو ابتكارات خلال SCI 2026 
                  سيتم النظر فيهم تلقائيًا للجوائز ذات الصلة. لا حاجة لتقديم طلب منفصل!
                </p>
                <div className="flex items-center justify-center gap-2 pt-4">
                  <Award className="w-6 h-6 text-primary" />
                  <p className="font-semibold text-lg">Winners Announced at Closing Ceremony - April 8, 2026</p>
                </div>
                <p className="text-center font-semibold text-base" dir="rtl">
                  الإعلان عن الفائزين في حفل الختام - ٨ أبريل ٢٠٢٦
                </p>
                <div className="flex justify-center pt-4">
                  <Link href="/awards">
                    <Button size="lg" className="bg-primary hover:bg-primary/90">
                      Learn More About Awards | معرفة المزيد عن الجوائز
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
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
              Nine comprehensive tracks covering all scientific disciplines
            </p>
            <Link href="/tracks">
              <Button variant="outline" size="lg" className="mt-4">
                View All Tracks | عرض جميع المحاور
              </Button>
            </Link>
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
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <Badge className="bg-green-600 text-white px-6 py-2 text-base font-medium">
                ✓ Conference Attendance is FREE | الحضور مجاناً
              </Badge>
              <Badge className="bg-blue-600 text-white px-6 py-2 text-base font-medium">
                Conference Certificate: 100 EGP | شهادة المؤتمر: ١٠٠ جنيه
              </Badge>
            </div>
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

      {/* Professional Workshops */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-primary">Professional Workshops</h2>
              <p className="text-2xl font-semibold text-secondary" dir="rtl">ورش العمل المهنية</p>
              <p className="text-xl text-muted-foreground">
                In collaboration with NAWAH Scientific, MARC, Medsol Corporation, and Palacký University Olomouc
              </p>
              {/* Pricing Banner */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
                <Badge className="bg-amber-500 text-white px-4 py-2 text-base font-bold">
                  200 EGP per workshop (incl. certificate)
                </Badge>
                <Badge className="bg-red-600 text-white px-4 py-2 text-base font-bold">
                  🔥 First 30 participants only | أول 30 مشارك فقط
                </Badge>
              </div>
              {/* Notice */}
              <div className="max-w-2xl mx-auto p-4 bg-amber-50 border-2 border-amber-300 rounded-xl text-sm text-amber-900 space-y-1">
                <p className="font-bold flex items-center justify-center gap-2">⚠️ Important Notice | تنبيه هام</p>
                <p>Each participant may register for <strong>ONE workshop only</strong>. Priority is given to the first 30 participants who pay and upload their payment invoice. Register early to secure your spot!</p>
                <p dir="rtl" className="text-amber-800">يمكن لكل مشارك التسجيل في <strong>ورشة عمل واحدة فقط</strong>. الأولوية لأول 30 مشاركاً يدفعون ويرفعون إيصال الدفع. سجّل مبكراً لضمان مكانك!</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
              {/* NAWAH Workshop */}
              <Card className="border-2 border-primary/20 flex flex-col">
                <CardHeader className="flex-1">
                  <div className="flex justify-center mb-4">
                    <img 
                      src="https://files.manuscdn.com/user_upload_by_module/session_file/118031311/ndKRwnmyKdJLbGXC.png" 
                      alt="NAWAH Scientific" 
                      className="h-28 object-contain"
                    />
                  </div>
                  <CardTitle className="text-xl mb-2">How to Convert Research Findings into Business Ideas</CardTitle>
                  {workshopCounts && <div className="mb-2">{getSpotsBadge(workshopCounts.nawah)}</div>}
                  <CardDescription className="text-base space-y-3 pt-2">
                    <p className="text-foreground font-medium">
                      In collaboration with <strong>NAWAH Scientific</strong>
                    </p>
                    
                    <div className="bg-primary/5 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2"><strong>Duration:</strong> 4 hours</p>
                      <p className="font-bold text-amber-700 text-sm mt-1">200 EGP (incl. certificate)</p>
                      <p className="text-amber-600 text-xs" dir="rtl">200 جنيه مصري (شاملة الشهادة)</p>
                    </div>

                    <p className="text-sm text-justify">
                      This course bridges the gap between laboratory results and real-world ventures, guiding participants to identify which scientific findings have true commercial potential. It distinguishes clearly between business ideas and sustainable business models, and introduces core fundraising concepts relevant to early-stage science-based startups.
                    </p>

                    <div className="border-t pt-4 mt-4">
                      <ul className="list-disc list-inside space-y-1 text-left text-sm">
                        <li>Open to all registered participants</li>
                        <li>Certificate co-signed by company &amp; Faculty of Science, Cairo University</li>
                        <li>Interactive Business Model Canvas session</li>
                      </ul>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button 
                    className="w-full bg-amber-600 hover:bg-amber-700 text-sm h-auto py-2 px-3 whitespace-normal leading-snug text-center" 
                    onClick={() => { window.location.href = '/attendance'; }}
                  >
                    Register & Upload Invoice | سجّل وارفع الإيصال
                  </Button>
                </CardContent>
              </Card>

              {/* MARC Workshop */}
              <Card className="border-2 border-secondary/20 flex flex-col">
                <CardHeader className="flex-1">
                  <div className="flex justify-center mb-4">
                    <img 
                      src="https://files.manuscdn.com/user_upload_by_module/session_file/118031311/ovrQFMOFiOzebFkT.jpg" 
                      alt="MARC" 
                      className="h-28 object-contain"
                    />
                  </div>
                  <CardTitle className="text-xl mb-2">Good Clinical Practice (GCP) Workshop</CardTitle>
                  {workshopCounts && <div className="mb-2">{getSpotsBadge(workshopCounts.marc)}</div>}
                  <CardDescription className="text-base space-y-3 pt-2">
                    <p className="text-foreground font-medium">
                      In collaboration with <strong>MARC</strong>
                    </p>
                    
                    <div className="bg-secondary/5 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2"><strong>Duration:</strong> 3 hours</p>
                      <p className="font-bold text-amber-700 text-sm mt-1">200 EGP (incl. certificate)</p>
                      <p className="text-amber-600 text-xs" dir="rtl">200 جنيه مصري (شاملة الشهادة)</p>
                    </div>

                    <p className="text-sm text-justify">
                      Comprehensive training in Good Clinical Practice covering ICH-GCP guidelines, ethical principles in clinical research, informed consent procedures, protocol compliance, data integrity, regulatory requirements, adverse event reporting, and monitoring procedures.
                    </p>

                    <div className="border-t pt-4 mt-4">
                      <ul className="list-disc list-inside space-y-1 text-left text-sm">
                        <li>ICH-GCP guidelines and regulations</li>
                        <li>Ethical principles and informed consent</li>
                        <li>Data integrity and protocol compliance</li>
                        <li>Certificate co-signed by company &amp; Faculty of Science, Cairo University</li>
                      </ul>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button 
                    className="w-full bg-amber-600 hover:bg-amber-700 text-sm h-auto py-2 px-3 whitespace-normal leading-snug text-center" 
                    onClick={() => { window.location.href = '/attendance'; }}
                  >
                    Register & Upload Invoice | سجّل وارفع الإيصال
                  </Button>
                </CardContent>
              </Card>

              {/* Medsol Workshop */}
              <Card className="border-2 border-accent/20 flex flex-col">
                <CardHeader className="flex-1">
                  <div className="flex justify-center mb-4">
                    <img 
                      src="https://files.manuscdn.com/user_upload_by_module/session_file/118031311/suhdZISVxwwlvpPk.png" 
                      alt="Medsol Corporation" 
                      className="h-28 object-contain"
                    />
                  </div>
                  <CardTitle className="text-xl mb-2">From DNA to Proteins: Advanced Sequencing Technologies Workshop</CardTitle>
                  {workshopCounts && <div className="mb-2">{getSpotsBadge(workshopCounts.medsol)}</div>}
                  <CardDescription className="text-base space-y-3 pt-2">
                    <p className="text-foreground font-medium">
                      In collaboration with <strong>Medsol Corporation</strong>
                    </p>
                    
                    <div className="bg-accent/5 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2"><strong>Duration:</strong> 3 hours</p>
                      <p className="font-bold text-amber-700 text-sm mt-1">200 EGP (incl. certificate)</p>
                      <p className="text-amber-600 text-xs" dir="rtl">200 جنيه مصري (شاملة الشهادة)</p>
                    </div>

                    <p className="text-sm text-justify">
                      This workshop provides a comprehensive introduction to cutting-edge sequencing technologies that are shaping the future of life sciences. Participants will explore Oxford Nanopore sequencing alongside Quantum-Si's innovative protein sequencing platform, gaining insights into workflows, data interpretation, and applications across both research and industry.
                    </p>

                    <div className="border-t pt-4 mt-4">
                      <ul className="list-disc list-inside space-y-1 text-left text-sm">
                        <li>Oxford Nanopore sequencing workflows</li>
                        <li>Quantum-Si protein sequencing platform</li>
                        <li>Data interpretation and analysis</li>
                        <li>Certificate co-signed by company &amp; Faculty of Science, Cairo University</li>
                      </ul>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button 
                    className="w-full bg-amber-600 hover:bg-amber-700 text-sm h-auto py-2 px-3 whitespace-normal leading-snug text-center" 
                    onClick={() => { window.location.href = '/attendance'; }}
                  >
                    Register & Upload Invoice | سجّل وارفع الإيصال
                  </Button>
                </CardContent>
              </Card>
              {/* Dr. Jan Sedláček Workshop */}
              <Card className="border-2 border-emerald-200 flex flex-col">
                <CardHeader className="flex-1 px-6 pt-6">
                  <div className="flex flex-col items-center text-center mb-3 gap-3">
                    <img
                      src="https://d2xsxph8kpxj0f.cloudfront.net/118031311/BK5ELr97meyN2f7P5B76DF/pasted_file_KE7pNQ_image_92d74388.png"
                      alt="Dr. Jan Sedláček"
                      className="h-24 w-24 object-cover rounded-full border-2 border-emerald-300 shrink-0"
                    />
                    <div className="w-full px-2">
                      <CardTitle className="text-xl mb-2 leading-snug">Environmental Geochemical Data Analysis Workshop</CardTitle>
                      <Badge className="bg-green-100 text-green-800 text-xs whitespace-normal text-center">Free Attendance ✅ | No Registration Required</Badge>
                    </div>
                  </div>
                  <CardDescription className="text-base space-y-3 pt-2 text-center">
                    <p className="text-foreground font-medium">
                      By <strong>Dr. Jan Sedláček</strong>
                    </p>
                    <p className="text-sm text-muted-foreground italic">Palacký University Olomouc, Czech Republic</p>

                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1"><strong>Duration:</strong> 2 days × 90 min/day</p>
                      <p className="text-sm text-muted-foreground"><strong>Dates:</strong> April 7 &amp; 8, 2026</p>
                    </div>

                    <p className="text-sm text-justify">
                      Practical Application of Statistical Methodologies for Pollution Source Apportionment — a hands-on two-day workshop covering environmental geochemical data analysis techniques used to identify and quantify pollution sources.
                    </p>

                    <div className="border-t pt-4 mt-4">
                      <ul className="list-none space-y-1 text-center text-sm">
                        <li>Statistical methods for geochemical data</li>
                        <li>Pollution source apportionment techniques</li>
                        <li>Practical data analysis exercises</li>
                        <li>Certificate co-signed by company &amp; Faculty of Science, Cairo University</li>
                      </ul>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="w-full bg-emerald-50 border border-emerald-200 rounded-lg py-3 px-4 text-center">
                    <p className="text-emerald-800 font-semibold text-sm">✅ Open to All Conference Attendees</p>
                    <p className="text-emerald-700 text-xs mt-1">No registration or payment required</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ─── Pre/Post Conference Workshops ─── */}
            <div className="mt-16 space-y-8">
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-full font-bold text-lg">
                  🎉 Surprise Announcement! | إعلان مفاجأة!
                </div>
                <h3 className="text-3xl font-bold text-primary">Extended Workshop Days</h3>
                <p className="text-2xl font-semibold text-secondary" dir="rtl">أيام ورش عمل إضافية</p>
              </div>

              <div className="max-w-3xl mx-auto p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/20 rounded-2xl space-y-4">
                <p className="text-base text-foreground leading-relaxed">
                  Due to the <strong>huge demand</strong> and the strong interest of companies to participate in the conference, we are thrilled to announce <strong>two additional workshop days</strong> — one before and one after the main conference!
                </p>
                <p className="text-base text-foreground leading-relaxed" dir="rtl">
                  نظراً للطلب الكبير واهتمام الشركات بالمشاركة في المؤتمر، يسعدنا الإعلان عن <strong>يومين إضافيين لورش العمل</strong> — يوم قبل المؤتمر ويوم بعده!
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white border-2 border-blue-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">📅</span>
                      <div>
                        <p className="font-bold text-blue-900">Pre-Conference Day</p>
                        <p className="text-blue-700 font-semibold">April 6, 2026</p>
                        <p className="text-blue-600 text-sm" dir="rtl">يوم ما قبل المؤتمر — ٦ أبريل ٢٠٢٦</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">3 workshops on this day</p>
                  </div>
                  <div className="p-4 bg-white border-2 border-green-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">📅</span>
                      <div>
                        <p className="font-bold text-green-900">Post-Conference Day</p>
                        <p className="text-green-700 font-semibold">April 9, 2026</p>
                        <p className="text-green-600 text-sm" dir="rtl">يوم ما بعد المؤتمر — ٩ أبريل ٢٠٢٦</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">3 workshops on this day</p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <Badge className="bg-amber-500 text-white px-4 py-2 text-base font-bold">
                    100 or 200 EGP per workshop (incl. certificate)
                  </Badge>
                  <Badge className="bg-muted text-muted-foreground px-4 py-2 text-sm">
                    Companies will be announced soon | الشركات ستُعلن قريباً
                  </Badge>
                </div>
              </div>

              {/* Chitosan Workshop Card — Biotech Product Development 101 */}
              <div className="max-w-2xl mx-auto">
                <div className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-300 rounded-2xl space-y-4">
                  {/* Header with logo */}
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <img
                      src="https://files.manuscdn.com/user_upload_by_module/session_file/118031311/GXxzRnTYsggXAHMu.png"
                      alt="Chitosan"
                      className="h-20 w-20 object-contain rounded-full"
                    />
                    <Badge className="bg-orange-100 text-orange-800 border-orange-300 text-xs">
                      Pre-Conference | قبل المؤتمر
                    </Badge>
                  </div>

                  {/* Title */}
                  <div>
                    <h4 className="text-2xl font-bold text-orange-900">Biotech Product Development 101</h4>
                    <p className="text-sm text-orange-700 italic mt-1">By <strong>Chitosan</strong></p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-foreground leading-relaxed text-justify">
                    An interactive session designed for senior students, fresh graduates, and early-career researchers who want to learn how scientific ideas can be translated into real products. The session introduces a practical roadmap for biotech product development and potential startup building.
                  </p>

                  {/* Bullet points */}
                  <ul className="list-disc list-inside space-y-1 text-sm text-foreground">
                    <li>Identifying meaningful problems and opportunities in biotech</li>
                    <li>Screening existing solutions (products, patents, scientific literature)</li>
                    <li>Structured idea generation and innovation tools</li>
                    <li>Developing product concepts and defining a value proposition</li>
                    <li>Building an initial MVP and testing assumptions</li>
                  </ul>

                  {/* Eligibility note */}
                  <div className="p-3 bg-orange-100 border border-orange-300 rounded-lg">
                    <p className="text-xs font-semibold text-orange-900">🎓 Eligibility | الأهلية</p>
                    <p className="text-xs text-orange-800 mt-1">Open to <strong>3rd &amp; 4th year undergraduate students</strong> and graduate/postgraduate students. Limited to <strong>30 participants</strong>.</p>
                    <p className="text-xs text-orange-800" dir="rtl">مفتوح لطلاب السنة الثالثة والرابعة وطلاب الدراسات العليا. الأماكن محدودة بـ <strong>٣٠ مشاركاً</strong>.</p>
                  </div>

                  {/* Details grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white rounded-xl border border-orange-200">
                      <p className="text-xs text-muted-foreground">📅 Date | التاريخ</p>
                      <p className="font-bold text-orange-900 text-sm">April 6, 2026</p>
                      <p className="text-orange-700 text-xs" dir="rtl">٦ أبريل ٢٠٢٦</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-orange-200">
                      <p className="text-xs text-muted-foreground">⏰ Time | الوقت</p>
                      <p className="font-bold text-orange-900 text-sm">9:00 AM – 12:00 PM</p>
                      <p className="text-orange-700 text-xs" dir="rtl">٩:٠٠ ص – ١٢:٠٠ ظ</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-orange-200">
                      <p className="text-xs text-muted-foreground">⏳ Duration | المدة</p>
                      <p className="font-bold text-orange-900 text-sm">3 Hours</p>
                      <p className="text-orange-700 text-xs" dir="rtl">٣ ساعات</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-orange-200">
                      <p className="text-xs text-muted-foreground">👥 Capacity | الطاقة</p>
                      <p className="font-bold text-orange-900 text-sm">30 Participants</p>
                      <p className="text-orange-700 text-xs" dir="rtl">٣٠ مشاركاً</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-orange-200 col-span-2">
                      <p className="text-xs text-muted-foreground">💰 Fee | الرسوم</p>
                      <p className="font-bold text-amber-700 text-sm">100 EGP (incl. certificate)</p>
                      <p className="text-amber-600 text-xs" dir="rtl">100 جنيه مصري (شاملة الشهادة)</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="p-3 bg-white rounded-xl border border-orange-200 flex items-start gap-2">
                    <span className="text-orange-600 text-base mt-0.5">📍</span>
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold">Location | المكان</p>
                      <p className="font-bold text-orange-900 text-sm">قاعة ابن سينا — قسم النبات القديم — كلية العلوم — جامعة القاهرة</p>
                      <p className="text-orange-700 text-xs">Ibn Sina Hall — Botany Dept. — Faculty of Science, Cairo University</p>
                    </div>
                  </div>

                  {/* Certificate Note */}
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                    <span className="text-green-600 text-sm mt-0.5">🎓</span>
                    <p className="text-xs text-green-700">Certificate co-signed by <strong>Chitosan</strong> &amp; <strong>Faculty of Science, Cairo University</strong> | شهادة معتمدة من Chitosan وكلية العلوم ، جامعة القاهرة</p>
                  </div>

                  {/* Spots counter */}
                  <div className="flex items-center justify-between">
                    {workshopCounts && getSpotsBadge(workshopCounts.chitosan ?? 0)}
                    <Button
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-3"
                      onClick={() => { window.location.href = '/attendance'; }}
                    >
                      Register & Upload Invoice | سجّل وارفع الإيصال
                    </Button>
                  </div>
                </div>
              </div>

              {/* Agitech Workshop Card — NGS & ddPCR in Targeted Therapy */}
              <div className="max-w-2xl mx-auto">
                <div className="p-6 bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-300 rounded-2xl space-y-4">
                  {/* Header with logo */}
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <img
                      src="https://files.manuscdn.com/user_upload_by_module/session_file/118031311/edodYeJkMcSIdRYR.png"
                      alt="Agitech"
                      className="h-20 object-contain"
                    />
                    <Badge className="bg-gray-100 text-gray-800 border-gray-300 text-xs">
                      Pre-Conference | قبل المؤتمر
                    </Badge>
                  </div>

                  {/* Title */}
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900">From Basic Research to Precision Medicine: Applications of NGS and ddPCR in Targeted Therapy</h4>
                    <p className="text-sm text-gray-700 italic mt-1">By <strong>Agitech</strong> — For Integrated Scientific Instruments, SAE</p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-foreground leading-relaxed text-justify">
                    This workshop highlights how basic cancer research has enabled the discovery of molecular drivers that paved the way for targeted therapies. It demonstrates how modern technologies such as Next-Generation Sequencing (NGS) and Droplet Digital PCR (ddPCR) are used to detect disease-related biomarkers, supporting precision oncology by improving diagnosis, guiding therapy selection, and enabling effective treatment monitoring.
                  </p>

                  {/* Points of Discussion */}
                  <ul className="list-disc list-inside space-y-1 text-sm text-foreground">
                    <li>Overview of molecular drivers in cancer</li>
                    <li>Application of modern molecular technologies: Next-Generation Sequencing and Droplet Digital PCR</li>
                    <li>Clinical implementation of molecular diagnostics</li>
                  </ul>

                  {/* Details grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white rounded-xl border border-gray-200">
                      <p className="text-xs text-muted-foreground">📅 Date | التاريخ</p>
                      <p className="font-bold text-gray-900 text-sm">April 6, 2026</p>
                      <p className="text-gray-700 text-xs" dir="rtl">٦ أبريل ٢٠٢٦</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-gray-200">
                      <p className="text-xs text-muted-foreground">⏰ Time | الوقت</p>
                      <p className="font-bold text-gray-900 text-sm">12:00 PM – 2:00 PM</p>
                      <p className="text-gray-700 text-xs" dir="rtl">١٢:٠٠ ظ – ٢:٠٠ م</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-gray-200">
                      <p className="text-xs text-muted-foreground">⏳ Duration | المدة</p>
                      <p className="font-bold text-gray-900 text-sm">2 Hours</p>
                      <p className="text-gray-700 text-xs" dir="rtl">ساعتان</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-gray-200">
                      <p className="text-xs text-muted-foreground">🔬 Focus | المحور</p>
                      <p className="font-bold text-gray-900 text-sm">Precision Oncology</p>
                      <p className="text-gray-700 text-xs" dir="rtl">الأورام الدقيقة</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-gray-200 col-span-2">
                      <p className="text-xs text-muted-foreground">💰 Fee | الرسوم</p>
                      <p className="font-bold text-gray-900 text-sm">200 EGP (incl. certificate)</p>
                      <p className="text-gray-700 text-xs" dir="rtl">200 جنيه مصري (شاملة الشهادة)</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="p-3 bg-white rounded-xl border border-gray-200 flex items-start gap-2">
                    <span className="text-gray-600 text-base mt-0.5">📍</span>
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold">Location | المكان</p>
                      <p className="font-bold text-gray-900 text-sm">قاعة ابن سينا — قسم النبات القديم — كلية العلوم — جامعة القاهرة</p>
                      <p className="text-gray-700 text-xs">Ibn Sina Hall — Botany Dept. — Faculty of Science, Cairo University</p>
                    </div>
                  </div>

                  {/* Certificate Note */}
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                    <span className="text-green-600 text-sm mt-0.5">🎓</span>
                    <p className="text-xs text-green-700">Certificate co-signed by <strong>Agitech</strong> &amp; <strong>Faculty of Science, Cairo University</strong> | شهادة معتمدة من Agitech وكلية العلوم ، جامعة القاهرة</p>
                  </div>

                  {/* Spots counter + Register button */}
                  <div className="flex items-center justify-between">
                    {workshopCounts && (() => {
                      const AGITECH_LIMIT = 20;
                      const count = workshopCounts.agitech ?? 0;
                      const remaining = AGITECH_LIMIT - count;
                      if (remaining <= 0) return <Badge className="bg-red-100 text-red-800 text-xs">Full 🔴</Badge>;
                      if (remaining <= 5) return <Badge className="bg-red-100 text-red-800 text-xs">{remaining} spots left 🔴</Badge>;
                      if (remaining <= 10) return <Badge className="bg-amber-100 text-amber-800 text-xs">{remaining}/{AGITECH_LIMIT} spots left 🟡</Badge>;
                      return <Badge className="bg-green-100 text-green-800 text-xs">{remaining}/{AGITECH_LIMIT} spots left 🟢</Badge>;
                    })()}
                    <Button
                      size="sm"
                      className="bg-gray-700 hover:bg-gray-800 text-white text-xs px-3"
                      onClick={() => { window.location.href = '/attendance'; }}
                    >
                      Register & Upload Invoice | سجّل وارفع الإيصال
                    </Button>
                  </div>
                </div>
              </div>

              {/* Vaccine Industry Workshop Card */}
              <div className="max-w-2xl mx-auto mb-6">
                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-2xl space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">💉</div>
                      <div>
                        <Badge className="bg-blue-100 text-blue-800 text-xs">Pre-Conference Workshop | ورشة عمل قبل المؤتمر</Badge>
                      </div>
                    </div>
                    <Badge className="bg-indigo-100 text-indigo-800 text-xs">Unlimited Participants | مفتوح للجميع</Badge>
                  </div>
                  {/* Title */}
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900">The Vaccine Industry Race: Ready to Play the Viruses' Game?</h4>
                    <p className="text-sm text-gray-700 italic mt-1">By <strong>Jasmine Mohsen</strong> &amp; <strong>Dr. Khaled Walid</strong> — Vaccine Industry</p>
                  </div>
                  {/* Description */}
                  <p className="text-sm text-foreground leading-relaxed text-justify">
                    An immersive workshop exploring the full lifecycle of vaccine development — from pathogen discovery to large-scale manufacturing — and the career opportunities available in the global and Egyptian vaccine industry.
                  </p>
                  {/* Points of Discussion */}
                  <ul className="list-disc list-inside space-y-1 text-sm text-foreground">
                    <li>Vaccine Discovery and Development Pipeline (Pathogen identification, Antigen discovery, Vaccine design &amp; platform selection, Preclinical &amp; Clinical trials, QC, Regulatory Approval, Manufacturing &amp; Distribution)</li>
                    <li>Types of Vaccines and Their Design (R&amp;D Stage)</li>
                    <li>Large Scale Production</li>
                    <li>Careers in the Vaccine Industry (Egypt &amp; Worldwide)</li>
                  </ul>
                  {/* Details grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white rounded-xl border border-gray-200">
                      <p className="text-xs text-muted-foreground">📅 Date | التاريخ</p>
                      <p className="font-bold text-gray-900 text-sm">April 6, 2026</p>
                      <p className="text-gray-700 text-xs" dir="rtl">٦ أبريل ٢٠٢٦</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-gray-200">
                      <p className="text-xs text-muted-foreground">⏰ Time | الوقت</p>
                      <p className="font-bold text-gray-900 text-sm">2:00 PM – 5:00 PM</p>
                      <p className="text-gray-700 text-xs" dir="rtl">٢:٠٠ م – ٥:٠٠ م</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-gray-200">
                      <p className="text-xs text-muted-foreground">⏳ Duration | المدة</p>
                      <p className="font-bold text-gray-900 text-sm">2.5 – 3 Hours</p>
                      <p className="text-gray-700 text-xs" dir="rtl">٢.٥ – ٣ ساعات</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-gray-200">
                      <p className="text-xs text-muted-foreground">👥 Capacity | السعة</p>
                      <p className="font-bold text-gray-900 text-sm">Unlimited</p>
                      <p className="text-gray-700 text-xs" dir="rtl">غير محدود</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-gray-200 col-span-2">
                      <p className="text-xs text-muted-foreground">💰 Fee | الرسوم</p>
                      <p className="font-bold text-amber-700 text-sm">100 EGP (incl. certificate)</p>
                      <p className="text-amber-600 text-xs" dir="rtl">100 جنيه مصري (شاملة الشهادة)</p>
                    </div>
                  </div>
                  {/* Location */}
                  <div className="p-3 bg-white rounded-xl border border-blue-200 flex items-start gap-2">
                    <span className="text-blue-600 text-base mt-0.5">📍</span>
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold">Location | المكان</p>
                      <p className="font-bold text-blue-900 text-sm">قاعة ابن سينا — قسم النبات القديم — كلية العلوم — جامعة القاهرة</p>
                      <p className="text-blue-700 text-xs">Ibn Sina Hall — Botany Dept. — Faculty of Science, Cairo University</p>
                    </div>
                  </div>

                  {/* Register button */}
                  <div className="flex items-center justify-end">
                    <Button
                      size="sm"
                      className="bg-blue-700 hover:bg-blue-800 text-white text-xs px-3"
                      onClick={() => { window.location.href = '/attendance'; }}
                    >
                      Register | سجّل الآن
                    </Button>
                  </div>
                </div>
              </div>

              {/* EgcompBio scRNA-seq Workshop Card */}
              <div className="max-w-2xl mx-auto mb-6">
                <div className="p-6 bg-gradient-to-r from-teal-50 to-cyan-50 border-2 border-teal-300 rounded-2xl space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://files.manuscdn.com/user_upload_by_module/session_file/118031311/VSqePLOAbshMxznI.png"
                        alt="EG-CompBio"
                        className="h-12 object-contain"
                      />
                      <img
                        src="https://files.manuscdn.com/user_upload_by_module/session_file/118031311/snJavEQgcNAGfzLj.png"
                        alt="GARN - German Arab Research Network"
                        className="h-12 object-contain"
                      />
                    </div>
                    <Badge className="bg-teal-100 text-teal-800 border-teal-300 text-xs">
                      Post-Conference | بعد المؤتمر
                    </Badge>
                  </div>

                  {/* Title */}
                  <div>
                    <h4 className="text-2xl font-bold text-teal-900">Introduction to Single Cell Genomics</h4>
                    <p className="text-lg font-semibold text-teal-700" dir="rtl">مقدمة في جينوميات الخلية الواحدة</p>
                    <p className="text-sm text-teal-600 italic mt-1">"scRNA-seq Analysis in Cancer — Mini-Workshop"</p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-foreground leading-relaxed">
                    Explore single-cell RNA sequencing (scRNA-seq) as a powerful approach to study gene expression at the resolution of individual cells. Participants will learn how scRNA-seq reveals cellular diversity within complex tissues and uncovers the molecular basis of tumor heterogeneity, with hands-on computational training in R.
                  </p>
                  <p className="text-sm text-foreground leading-relaxed" dir="rtl">
                    استكشف تسلسل الحمض النووي الريبوزي أحادي الخلية (scRNA-seq) لدراسة التعبير الجيني على مستوى الخلايا الفردية، مع تدريب حاسوبي عملي في سرطان الجينوم.
                  </p>

                  {/* Prerequisites note */}
                  <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg">
                    <p className="text-xs font-semibold text-teal-900">⚠️ Prerequisites | المتطلبات المسبقة</p>
                    <p className="text-xs text-teal-800 mt-1">Fair proficiency in R · Experience with dplyr, ggplot2, tidyverse · Bring your laptop with R ≥ 4.2, RStudio &amp; Seurat installed</p>
                    <p className="text-xs text-teal-800 mt-1" dir="rtl">إجادة R · خبرة مع dplyr وggplot2 · أحضر لابتوب مثبت عليه R ≥ 4.2 وRStudio وSeurat</p>
                  </div>

                  {/* Details grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white rounded-xl border border-teal-200">
                      <p className="text-xs text-muted-foreground">📅 Date | التاريخ</p>
                      <p className="font-bold text-teal-900 text-sm">April 9, 2026</p>
                      <p className="text-teal-700 text-xs" dir="rtl">٩ أبريل ٢٠٢٦</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-teal-200">
                      <p className="text-xs text-muted-foreground">⏰ Time | الوقت</p>
                      <p className="font-bold text-teal-900 text-sm">10:00 AM – 1:00 PM</p>
                      <p className="text-teal-700 text-xs" dir="rtl">١٠:٠٠ ص – ١:٠٠ م</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-teal-200">
                      <p className="text-xs text-muted-foreground">👥 Capacity | السعة</p>
                      <p className="font-bold text-teal-900 text-sm">30 Participants</p>
                      <p className="text-teal-700 text-xs" dir="rtl">٣٠ مشاركاً فقط</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-teal-200">
                      <p className="text-xs text-muted-foreground">💰 Fee | الرسوم</p>                      <p className="font-bold text-teal-900 text-sm">200 EGP (incl. certificate)</p>
                      <p className="text-teal-700 text-xs" dir="rtl">200 جنيه مصري (شاملة الشهادة)</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="p-3 bg-white rounded-xl border border-teal-200 flex items-start gap-2">
                    <span className="text-teal-600 text-base mt-0.5">📍</span>
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold">Location | المكان</p>
                      <p className="font-bold text-teal-900 text-sm">قاعة ابن سينا — قسم النبات القديم — كلية العلوم — جامعة القاهرة</p>
                      <p className="text-teal-700 text-xs">Ibn Sina Hall — Botany Dept. — Faculty of Science, Cairo University</p>
                    </div>
                  </div>

                  {/* Certificate Note */}
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                    <span className="text-green-600 text-sm mt-0.5">🎓</span>
                    <p className="text-xs text-green-700">Certificate co-signed by <strong>EG-CompBio</strong> &amp; <strong>Faculty of Science, Cairo University</strong> | شهادة معتمدة من EG-CompBio وكلية العلوم ، جامعة القاهرة</p>
                  </div>

                  {/* Spots counter */}
                  <div className="flex items-center justify-between">
                    {workshopCounts && getSpotsBadge(workshopCounts.scrna_seq ?? 0)}
                    <Button
                      size="sm"
                      className="bg-teal-700 hover:bg-teal-800 text-white text-xs px-3"
                      onClick={() => { window.location.href = '/attendance'; }}
                    >
                      Register &amp; Upload Invoice | سجّل وارفع الإيصال
                    </Button>
                  </div>
                </div>
              </div>

              {/* AI Meets Biotech Workshop Card */}
              <div className="max-w-2xl mx-auto mb-6">
                <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-300 rounded-2xl space-y-4">
                  {/* Header with logo */}
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <img
                      src="https://files.manuscdn.com/user_upload_by_module/session_file/118031311/QvdupTbEZQQzfgEz.jpeg"
                      alt="AI بالعربي"
                      className="h-32 object-contain"
                    />
                    <Badge className="bg-purple-100 text-purple-800 border-purple-300 text-xs">
                      Post-Conference | بعد المؤتمر
                    </Badge>
                  </div>

                  {/* Title */}
                  <div>
                    <h4 className="text-2xl font-bold text-purple-900">AI Meets Biotech</h4>
                    <p className="text-lg font-semibold text-purple-700" dir="rtl">الذكاء الاصطناعي يلتقي بالتكنولوجيا الحيوية</p>
                    <p className="text-sm text-purple-600 italic mt-1">“How to leverage AI in Biotechnology”</p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-foreground leading-relaxed">
                    A practical workshop bridging science and technology — from research hypothesis to hands-on experience with AI tools that predict 3D structures of proteins, genes, and enzymes, plus a general introduction to using AI in biotechnology.
                  </p>
                  <p className="text-sm text-foreground leading-relaxed" dir="rtl">
                    ورشة عمل تطبيقية تجسر الهوة بين العلم والتكنولوجيا — من فرضية البحث حتى التجربة العملية بأدوات الذكاء الاصطناعي.
                  </p>

                  {/* Details grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white rounded-xl border border-purple-200">
                      <p className="text-xs text-muted-foreground">📅 Date | التاريخ</p>
                      <p className="font-bold text-purple-900 text-sm">April 9, 2026</p>
                      <p className="text-purple-700 text-xs" dir="rtl">٩ أبريل ٢٠٢٦</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-purple-200">
                      <p className="text-xs text-muted-foreground">⏰ Time | الوقت</p>
                      <p className="font-bold text-purple-900 text-sm">1:00 – 3:00 PM</p>
                      <p className="text-purple-700 text-xs" dir="rtl">١:٠٠ – ٣:٠٠ م</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-purple-200">
                      <p className="text-xs text-muted-foreground">⏳ Duration | المدة</p>
                      <p className="font-bold text-purple-900 text-sm">2 Hours</p>
                      <p className="text-purple-700 text-xs" dir="rtl">٢ ساعتان</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-purple-200">
                      <p className="text-xs text-muted-foreground">💰 Fee | الرسوم</p>
                      <p className="font-bold text-purple-900 text-sm">100 EGP (incl. certificate)</p>
                      <p className="text-purple-700 text-xs" dir="rtl">100 جنيه مصري (شاملة الشهادة)</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="p-3 bg-white rounded-xl border border-purple-200 flex items-start gap-2">
                    <span className="text-purple-600 text-base mt-0.5">📍</span>
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold">Location | المكان</p>
                      <p className="font-bold text-purple-900 text-sm">قاعة ابن سينا — قسم النبات القديم — كلية العلوم — جامعة القاهرة</p>
                      <p className="text-purple-700 text-xs">Ibn Sina Hall — Botany Dept. — Faculty of Science, Cairo University</p>
                    </div>
                  </div>

                  {/* Certificate Note */}
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                    <span className="text-green-600 text-sm mt-0.5">🎓</span>
                    <p className="text-xs text-green-700">Certificate co-signed by <strong>AI بالعربي</strong> &amp; <strong>Faculty of Science, Cairo University</strong> | شهادة معتمدة من AI بالعربي وكلية العلوم ، جامعة القاهرة</p>
                  </div>

                  {/* Spots counter */}
                  <div className="flex items-center justify-between">
                    {workshopCounts && getSpotsBadge(workshopCounts.ai_biotech ?? 0)}
                    <Button
                      size="sm"
                      className="bg-purple-700 hover:bg-purple-800 text-white text-xs px-3"
                      onClick={() => { window.location.href = '/attendance'; }}
                    >
                      Register & Upload Invoice | سجّل وارفع الإيصال
                    </Button>
                  </div>
                </div>
              </div>



              {/* GESR Workshop Card */}
              <div className="max-w-2xl mx-auto">
                <div className="p-6 bg-gradient-to-r from-slate-50 to-gray-50 border-2 border-slate-300 rounded-2xl space-y-4">
                  {/* Header with logo */}
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <img
                      src="https://d2xsxph8kpxj0f.cloudfront.net/118031311/BK5ELr97meyN2f7P5B76DF/GESR-logo_7866e6d3.jpg"
                      alt="GESR"
                      className="h-16 object-contain"
                    />
                    <Badge className="bg-green-100 text-green-800 border-green-300 text-xs">
                      Post-Conference | بعد المؤتمر
                    </Badge>
                  </div>

                  {/* Workshop Title */}
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">From Lab to Global Opportunities: How to Prepare for Scholarships and Research Abroad</h4>
                    <p className="text-base font-semibold text-slate-700 mt-1" dir="rtl">من المختبر إلى الفرص العالمية: كيف تستعد للمنح الدراسية والبحث في الخارج</p>

                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-700 leading-relaxed">
                    This workshop helps students and early-career researchers understand how to prepare for international research opportunities and scholarships — covering academic CV writing, motivation letters, scholarship identification, and strategic planning for studying abroad.
                  </p>

                  {/* Workshop Parts */}
                  <div className="grid sm:grid-cols-2 gap-2">
                    <div className="bg-white/80 rounded-lg p-2 border border-slate-200">
                      <p className="text-xs font-bold text-slate-800">Part 1 — Global Research Opportunities (30 min)</p>
                      <p className="text-xs text-slate-600">Scholarships, fellowships, internships, DAAD, Erasmus, Marie Curie</p>
                    </div>
                    <div className="bg-white/80 rounded-lg p-2 border border-slate-200">
                      <p className="text-xs font-bold text-slate-800">Part 2 — Building a Strong Academic CV (45 min)</p>
                      <p className="text-xs text-slate-600">Structure, research highlights, common mistakes, example review</p>
                    </div>
                    <div className="bg-white/80 rounded-lg p-2 border border-slate-200">
                      <p className="text-xs font-bold text-slate-800">Part 3 — Writing a Winning Motivation Letter (45 min)</p>
                      <p className="text-xs text-slate-600">Structure, storytelling, linking interests, real examples analysis</p>
                    </div>
                    <div className="bg-white/80 rounded-lg p-2 border border-slate-200">
                      <p className="text-xs font-bold text-slate-800">Part 4 — Preparing for Research Abroad (30 min)</p>
                      <p className="text-xs text-slate-600">Supervisor selection, networking, building a research profile</p>
                    </div>
                  </div>

                  {/* Meta info */}
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-800">📅 Thursday, April 9, 2026 &nbsp;|&nbsp; 🕒 3:00 PM – 6:00 PM &nbsp;|&nbsp; ⏱ 3 Hours &nbsp;|&nbsp; 🆓 Free</p>
                    <p className="text-xs text-slate-600">🎤 Presented by <strong>Dr. Nourhan Hassan</strong> &amp; <strong>Dr. Hazem Badawy</strong> (Board of GESR)</p>
                    <p className="text-xs text-slate-600">🎯 Target: Undergraduates, Master's &amp; PhD students, Early-career researchers</p>
                    <p className="text-xs text-slate-600">📍 <strong>قاعة ابن سينا — قسم النبات القديم — كلية العلوم — جامعة القاهرة</strong></p>
                    <p className="text-xs text-slate-600">Ibn Sina Hall — Botany Dept. — Faculty of Science, Cairo University</p>
                  </div>

                  {/* Certificate */}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                    <p className="text-xs text-green-700">🎓 <strong>FREE Workshop</strong> — No fees, no invoice required. Register to secure your spot.</p>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <Badge className="bg-green-100 text-green-800 text-xs">Free — Open to all registered participants 🟢</Badge>
                    <Button
                      size="sm"
                      className="bg-slate-700 hover:bg-slate-800 text-white text-xs px-3"
                      onClick={() => { window.location.href = '/attendance'; }}
                    >
                      Register Now | سجّل الآن
                    </Button>
                  </div>
                </div>
              </div>



              {/* HVD Life Sciences Workshop Card */}
              <div className="max-w-2xl mx-auto">
                <div className="p-6 bg-gradient-to-r from-blue-50 to-slate-50 border-2 border-blue-300 rounded-2xl space-y-4">
                  {/* Header with logo */}
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <img
                      src="https://files.manuscdn.com/user_upload_by_module/session_file/118031311/NlYUUYlTeGQwRRXp.png"
                      alt="HVD Life Sciences"
                      className="h-16 object-contain"
                    />
                    <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-xs">
                      Post-Conference | بعد المؤتمر
                    </Badge>
                  </div>

                  {/* Title */}
                  <div>
                    <h4 className="text-xl font-bold text-blue-900">Integrating Genomics and Proteomics in Modern Biopharmaceutical R&amp;D</h4>
                    <p className="text-base font-semibold text-blue-700 mt-1" dir="rtl">دمج الجينوميكس والبروتيوميكس في أبحاث وتطوير الأدوية الحيوية</p>
                    <p className="text-sm text-blue-600 italic mt-1">&ldquo;Bridging Omics Technologies for Drug Discovery&rdquo;</p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-foreground leading-relaxed">
                    A hands-on workshop exploring how genomics and proteomics technologies are integrated in modern biopharmaceutical research and drug development. Participants will gain practical insights into omics data analysis workflows used in drug discovery pipelines.
                  </p>
                  <p className="text-sm text-foreground leading-relaxed" dir="rtl">
                    ورشة عمل تطبيقية تستعرض كيفية دمج تقنيات الجينوميكس والبروتيوميكس في أبحاث الأدوية الحيوية الحديثة، مع تدريب عملي على تحليل البيانات.
                  </p>

                  {/* Date */}
                  <div className="p-3 bg-blue-50 border border-blue-300 rounded-lg flex items-start gap-2">
                    <span className="text-blue-600 text-lg">📅</span>
                    <div>
                      <p className="text-xs font-bold text-blue-800">Sunday, April 12, 2026 (Post-Conference) | الأحد ١٢ أبريل ٢٠٢٦ (بعد المؤتمر)</p>
                      <p className="text-xs text-blue-700 mt-0.5">Time — To Be Announced | سيتم الإعلان عن الوقت قريباً</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="p-3 bg-white rounded-xl border border-blue-200 flex items-start gap-2">
                    <span className="text-blue-600 text-base mt-0.5">📍</span>
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold">Location | المكان</p>
                      <p className="font-bold text-blue-900 text-sm">HVD Company — New Cairo</p>
                      <a
                        href="https://share.google/8FTOPPpd0JLDz8h2k"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 underline hover:text-blue-800 break-all"
                      >
                        2C53+JCC, New Cairo 1, Cairo Governorate 4720113
                      </a>
                    </div>
                  </div>

                  {/* Details grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white rounded-xl border border-blue-200">
                      <p className="text-xs text-muted-foreground">⏳ Duration | المدة</p>
                      <p className="font-bold text-blue-900 text-sm">3 Hours</p>
                      <p className="text-blue-700 text-xs" dir="rtl">٣ ساعات</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-blue-200">
                      <p className="text-xs text-muted-foreground">💰 Fee | الرسوم</p>
                      <p className="font-bold text-blue-900 text-sm">200 EGP (incl. certificate)</p>
                      <p className="text-blue-700 text-xs" dir="rtl">200 جنيه مصري (شاملة الشهادة)</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-blue-200">
                      <p className="text-xs text-muted-foreground">👥 Capacity | السعة</p>
                      <p className="font-bold text-blue-900 text-sm">30 Participants</p>
                      <p className="text-blue-700 text-xs" dir="rtl">٣٠ مشاركاً فقط</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-blue-200">
                      <p className="text-xs text-muted-foreground">🏷️ Type | النوع</p>
                      <p className="font-bold text-blue-900 text-sm">Hands-on</p>
                      <p className="text-blue-700 text-xs" dir="rtl">عملي تطبيقي</p>
                    </div>
                  </div>

                  {/* Certificate Note */}
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                    <span className="text-green-600 text-sm mt-0.5">🎓</span>
                    <p className="text-xs text-green-700">Certificate co-signed by <strong>HVD Life Sciences</strong> &amp; <strong>Faculty of Science, Cairo University</strong> | شهادة معتمدة من HVD Life Sciences وكلية العلوم ، جامعة القاهرة</p>
                  </div>

                  {/* Spots counter */}
                  <div className="flex items-center justify-between">
                    {workshopCounts && (() => {
                      const count = workshopCounts.hvd_genomics ?? 0;
                      const HVD_LIMIT = 20;
                      const remaining = HVD_LIMIT - count;
                      if (remaining <= 0) return <Badge className="bg-red-100 text-red-800 text-xs">Full 🔴</Badge>;
                      if (remaining <= 5) return <Badge className="bg-red-100 text-red-800 text-xs">{remaining} spots left 🔴</Badge>;
                      if (remaining <= 10) return <Badge className="bg-amber-100 text-amber-800 text-xs">{remaining}/{HVD_LIMIT} spots left 🟡</Badge>;
                      return <Badge className="bg-green-100 text-green-800 text-xs">{remaining}/{HVD_LIMIT} spots left 🟢</Badge>;
                    })()}
                    <Button
                      size="sm"
                      className="bg-blue-700 hover:bg-blue-800 text-white text-xs px-3"
                      onClick={() => { window.location.href = '/attendance'; }}
                    >
                      Register &amp; Upload Invoice | سجّل وارفع الإيصال
                    </Button>
                  </div>
                </div>
              </div>

              {/* Colors Educational Hub Workshop Card */}
              <div className="max-w-2xl mx-auto">
                <div className="p-6 bg-gradient-to-r from-indigo-50 to-teal-50 border-2 border-indigo-300 rounded-2xl space-y-4">
                  {/* Header with logo */}
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <img
                      src="https://d2xsxph8kpxj0f.cloudfront.net/118031311/BK5ELr97meyN2f7P5B76DF/logo_colors_52f6762b.png"
                      alt="Colors Educational Hub"
                      className="h-16 object-contain"
                    />
                    <Badge className="bg-indigo-100 text-indigo-800 border-indigo-300 text-xs">
                      Post-Conference | بعد المؤتمر
                    </Badge>
                  </div>

                  {/* Title */}
                  <div>
                    <h4 className="text-xl font-bold text-indigo-900">Metagenomics, Microbiome & 16S rRNA Sequencing</h4>
                    <p className="text-base font-semibold text-indigo-700 mt-1" dir="rtl">الميتاجينوميكس، الميكروبيوم وتسلسل الـ 16S rRNA</p>
                    <p className="text-sm text-indigo-600 italic mt-1">&ldquo;Title to be announced soon&rdquo;</p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-foreground leading-relaxed">
                    A hands-on workshop covering metagenomics approaches, microbiome analysis, and 16S rRNA sequencing techniques. Participants will explore the diversity of microbial communities and learn state-of-the-art bioinformatics workflows for microbiome data analysis.
                  </p>
                  <p className="text-sm text-foreground leading-relaxed" dir="rtl">
                    ورشة عمل تطبيقية تغطي أساليب الميتاجينوميكس وتحليل الميكروبيوم وتقنيات تسلسل الـ 16S rRNA، مع تدريب على سير عمل المعلوماتية الحيوية.
                  </p>

                  {/* TBA Notice */}
                  <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg flex items-start gap-2">
                    <span className="text-amber-600 text-lg">📂</span>
                    <div>
                      <p className="text-xs font-bold text-amber-800">Title, Date &amp; Time — To Be Announced | سيتم الإعلان عن العنوان والتاريخ والوقت قريباً</p>
                      <p className="text-xs text-amber-700 mt-0.5">Stay tuned for the confirmed schedule.</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="p-3 bg-white rounded-xl border border-indigo-200 flex items-start gap-2">
                    <span className="text-indigo-600 text-base mt-0.5">📍</span>
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold">Location | المكان</p>
                      <p className="font-bold text-indigo-900 text-sm">Colors Educational Hub — Maadi, Cairo</p>
                      <a
                        href="https://share.google/XzvUcdryGtkmA5QQd"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-600 underline hover:text-indigo-800 break-all"
                      >
                        4 شارع 160، برج رهام، المعادي الخبيري الغربية، المعادي، القاهرة 11431
                      </a>
                    </div>
                  </div>

                  {/* Details grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white rounded-xl border border-indigo-200">
                      <p className="text-xs text-muted-foreground">💰 Fee | الرسوم</p>
                      <p className="font-bold text-indigo-900 text-sm">200 EGP (incl. certificate)</p>
                      <p className="text-indigo-700 text-xs" dir="rtl">200 جنيه مصري (شاملة الشهادة)</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-indigo-200">
                      <p className="text-xs text-muted-foreground">👥 Capacity | السعة</p>
                      <p className="font-bold text-indigo-900 text-sm">25 Students</p>
                      <p className="text-indigo-700 text-xs" dir="rtl">٢٥ طالباً فقط</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-indigo-200">
                      <p className="text-xs text-muted-foreground">🏷️ Type | النوع</p>
                      <p className="font-bold text-indigo-900 text-sm">Hands-on</p>
                      <p className="text-indigo-700 text-xs" dir="rtl">عملي تطبيقي</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-indigo-200">
                      <p className="text-xs text-muted-foreground">🏢 By | المنظم</p>
                      <p className="font-bold text-indigo-900 text-sm">Colors Educational Hub</p>
                    </div>
                  </div>

                  {/* Certificate Note */}
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                    <span className="text-green-600 text-sm mt-0.5">🎓</span>
                    <p className="text-xs text-green-700">Certificate co-signed by <strong>Colors Educational Hub</strong> &amp; <strong>Faculty of Science, Cairo University</strong> | شهادة معتمدة من Colors Educational Hub وكلية العلوم، جامعة القاهرة</p>
                  </div>

                  {/* Spots counter */}
                  <div className="flex items-center justify-between">
                    {workshopCounts && (() => {
                      const count = workshopCounts.colors_metagenomics ?? 0;
                      const remaining = COLORS_LIMIT - count;
                      if (remaining <= 0) return <Badge className="bg-red-100 text-red-800 text-xs">Full 🔴</Badge>;
                      if (remaining <= 5) return <Badge className="bg-red-100 text-red-800 text-xs">{remaining} spots left 🔴</Badge>;
                      if (remaining <= 10) return <Badge className="bg-amber-100 text-amber-800 text-xs">{remaining}/{COLORS_LIMIT} spots left 🟡</Badge>;
                      return <Badge className="bg-green-100 text-green-800 text-xs">{remaining}/{COLORS_LIMIT} spots left 🟢</Badge>;
                    })()}
                    <Button
                      size="sm"
                      className="bg-indigo-700 hover:bg-indigo-800 text-white text-xs px-3"
                      onClick={() => { window.location.href = '/attendance'; }}
                    >
                      Register &amp; Upload Invoice | سجّل وارفع الإيصال
                    </Button>
                  </div>
                 </div>
              </div>


            </div>
          </div>
        </div>
      </section>
      {/* Meet Our Sponsors Section */}
      <section id="sponsors" className="py-20 bg-gradient-to-b from-white to-accent/5">
        <div className="container">
          <div className="text-center space-y-4 mb-14">
            <h2 className="text-4xl md:text-5xl font-bold text-primary">Meet Our Sponsors</h2>
            <p className="text-2xl font-semibold text-secondary" dir="rtl">تعرف على رعاتنا</p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              SCI 2026 is made possible by the generous support of leading companies and organizations committed to advancing science and innovation in Egypt.
            </p>
          </div>

          {/* Platinum Sponsor */}
          <div className="mb-14">
            <div className="text-center mb-6">
              <Badge className="bg-primary text-white px-4 py-1.5 text-sm font-semibold tracking-wide">
                🏅 Platinum Sponsor | الراعي البلاتيني
              </Badge>
            </div>
            <div className="max-w-sm mx-auto">
              <div className="bg-white border-2 border-primary/30 rounded-2xl p-6 flex flex-col items-center gap-4 shadow-lg hover:shadow-xl transition-shadow">
                <div className="h-28 flex items-center justify-center">
                  <img src="https://files.manuscdn.com/user_upload_by_module/session_file/118031311/AnhypChIFEYqXvzy.png" alt="Sami Ayed Group" className="h-24 object-contain" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-base text-foreground">Sami Ayed Group for Feed & Poultry</p>
                  <p className="text-sm text-muted-foreground" dir="rtl">مجموعة سامي عايد للأعلاف والدواجن</p>
                </div>
              </div>
            </div>
          </div>

          {/* Workshop Providers */}
          <div className="mb-14">
            <div className="text-center mb-8">
              <Badge className="bg-blue-600 text-white px-4 py-1.5 text-sm font-semibold tracking-wide">
                🔬 Workshop Providers | مقدمو الورش
              </Badge>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
              {[
                { name: "NAWAH Scientific", logo: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/ndKRwnmyKdJLbGXC.png", linkedin: "https://www.linkedin.com/company/nawah-scientific/?originalSubdomain=eg" },
                { name: "MARC", logo: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/VulsiXaRGfrttVQf.png", linkedin: "https://www.linkedin.com/company/marcresearch/posts/?feedView=all" },
                { name: "Medsol Corporation", logo: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/suhdZISVxwwlvpPk.png", linkedin: "https://www.linkedin.com/company/medsolme/posts/?feedView=all" },
                { name: "Agitech", logo: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/VgPdbFhKiVTOdmtC.png", linkedin: "https://www.linkedin.com/company/agitech-egypt/posts/?feedView=all" },
                { name: "Colors Educational Hub", logo: "https://d2xsxph8kpxj0f.cloudfront.net/118031311/BK5ELr97meyN2f7P5B76DF/logo_colors_52f6762b.png", linkedin: "https://www.linkedin.com/company/colors-educational-hub/posts/?feedView=all" },
                { name: "Chitosan Egypt", logo: "https://d2xsxph8kpxj0f.cloudfront.net/118031311/BK5ELr97meyN2f7P5B76DF/pasted_file_t1mp8m_image_bbedca70.png", linkedin: "https://www.linkedin.com/in/chitosan-egypt/" },
                { name: "EgCompBio", logo: "/images/logo_egcompbio.png", linkedin: "https://www.linkedin.com/company/egcompbio/posts/?feedView=all" },
                { name: "AI بالعربي", logo: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/KlrhKxhzNQOHAlor.jpeg", linkedin: "https://www.linkedin.com/company/ai-بالعربي/" },
                { name: "GESR", logo: "https://d2xsxph8kpxj0f.cloudfront.net/118031311/BK5ELr97meyN2f7P5B76DF/GESR-logo_7866e6d3.jpg", linkedin: "https://www.linkedin.com/company/102566987/" },
                { name: "HVD Life Sciences", logo: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/NlYUUYlTeGQwRRXp.png", linkedin: "https://www.linkedin.com/company/hvdegypt/posts/?feedView=all" },
              ].map((s) => (
                <a key={s.name} href={s.linkedin} target="_blank" rel="noopener noreferrer"
                  className="bg-white border border-border rounded-xl p-4 flex flex-col items-center gap-3 shadow-sm hover:shadow-md hover:border-primary/40 transition-all group">
                  <div className="h-16 flex items-center justify-center w-full">
                    <img src={s.logo} alt={s.name} className="max-h-14 max-w-full object-contain" />
                  </div>
                  <p className="text-xs font-medium text-center text-muted-foreground group-hover:text-primary transition-colors leading-tight">{s.name}</p>
                  <span className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    LinkedIn
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Award Sponsors */}
          <div className="mb-14">
            <div className="text-center mb-8">
              <Badge className="bg-amber-500 text-white px-4 py-1.5 text-sm font-semibold tracking-wide">
                🏆 Award Sponsors | رعاة الجوائز
              </Badge>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
              {[
                { name: "NAWAH Scientific", logo: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/ndKRwnmyKdJLbGXC.png", linkedin: "https://www.linkedin.com/company/nawah-scientific/?originalSubdomain=eg" },
                { name: "MARC", logo: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/VulsiXaRGfrttVQf.png", linkedin: "https://www.linkedin.com/company/marcresearch/posts/?feedView=all" },
                { name: "Mina Pharm", logo: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/VSYnJUbvoViFDJRE.png", linkedin: "https://www.linkedin.com/company/minapharm-pharmaceuticals/posts/?feedView=all" },
                { name: "Startup Grind", logo: "https://d2xsxph8kpxj0f.cloudfront.net/118031311/BK5ELr97meyN2f7P5B76DF/download(2)_577d8ace.png", linkedin: "https://www.linkedin.com/company/startup-grind/posts/?feedView=all" },
                { name: "Plasma", logo: "https://d2xsxph8kpxj0f.cloudfront.net/118031311/BK5ELr97meyN2f7P5B76DF/logo-2_953b35eb.jpeg", linkedin: "https://www.linkedin.com/company/plasma-company/?originalSubdomain=eg" },
                { name: "EgCompBio", logo: "/images/logo_egcompbio.png", linkedin: "https://www.linkedin.com/company/egcompbio/posts/?feedView=all" },
                { name: "GESR", logo: "https://d2xsxph8kpxj0f.cloudfront.net/118031311/BK5ELr97meyN2f7P5B76DF/GESR-logo_7866e6d3.jpg", linkedin: "https://www.linkedin.com/company/102566987/" },
                { name: "Agitech", logo: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/VgPdbFhKiVTOdmtC.png", linkedin: "https://www.linkedin.com/company/agitech-egypt/posts/?feedView=all" },
                { name: "Medsol Corporation", logo: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/suhdZISVxwwlvpPk.png", linkedin: "https://www.linkedin.com/company/medsolme/posts/?feedView=all" },
                { name: "Chitosan Egypt", logo: "https://d2xsxph8kpxj0f.cloudfront.net/118031311/BK5ELr97meyN2f7P5B76DF/pasted_file_t1mp8m_image_bbedca70.png", linkedin: "https://www.linkedin.com/in/chitosan-egypt/" },
                { name: "AI بالعربي", logo: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/KlrhKxhzNQOHAlor.jpeg", linkedin: "https://www.linkedin.com/company/ai-بالعربي/" },
                { name: "Colors Educational Hub", logo: "https://d2xsxph8kpxj0f.cloudfront.net/118031311/BK5ELr97meyN2f7P5B76DF/logo_colors_52f6762b.png", linkedin: "https://www.linkedin.com/company/colors-educational-hub/posts/?feedView=all" },
              ].map((s) => (
                <a key={s.name} href={s.linkedin} target="_blank" rel="noopener noreferrer"
                  className="bg-white border border-border rounded-xl p-4 flex flex-col items-center gap-3 shadow-sm hover:shadow-md hover:border-amber-400 transition-all group">
                  <div className="h-16 flex items-center justify-center w-full">
                    <img src={s.logo} alt={s.name} className="max-h-14 max-w-full object-contain" />
                  </div>
                  <p className="text-xs font-medium text-center text-muted-foreground group-hover:text-amber-600 transition-colors leading-tight">{s.name}</p>
                  <span className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    LinkedIn
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link href="/sponsors">
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white transition-colors">
                View All Sponsors & Details | عرض جميع الرعاة والتفاصيل
              </Button>
            </Link>
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
                  مركز المؤتمرات، جامعة القاهرة، المدينة الجامعية
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
                    window.location.href = `mailto:sci.conf.2026@gmail.com?subject=${encodeURIComponent(subject as string)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
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
                    href="mailto:sci.conf.2026@gmail.com" 
                    className="text-primary hover:underline font-medium inline-flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    sci.conf.2026@gmail.com
                  </a>
                  <div className="pt-4 space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Conference Hall, Cairo University, University Hostel
                    </p>
                    <p className="text-sm text-muted-foreground" dir="rtl">
                      مركز المؤتمرات، جامعة القاهرة، المدينة الجامعية
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
