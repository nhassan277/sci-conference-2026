import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Award, Microscope, FlaskConical, Globe, Calculator, Heart, Sparkles } from "lucide-react";

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
      icon: FlaskConical,
      title: "Physical Sciences",
      titleAr: "العلوم الفيزيائية",
      description: "Physics, Chemistry, Materials Science",
      color: "bg-purple-100 text-purple-700"
    },
    {
      icon: Globe,
      title: "Earth & Environmental Sciences",
      titleAr: "علوم الأرض والبيئة",
      description: "Geology, Meteorology, Environmental Science",
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
    }
  ];

  const registrationCategories = [
    {
      title: "Graduate & Postgraduate Students",
      titleAr: "طلاب التخرج والدراسات العليا",
      description: "Faculty of Science - Cairo University",
      link: "https://forms.gle/RPmxzLSS67Qvuvxo9"
    },
    {
      title: "Faculty Members (Internal)",
      titleAr: "أعضاء هيئة التدريس (داخلي)",
      description: "Faculty of Science - Cairo University",
      link: "https://forms.gle/kMLu69y5yTxVw1LK7"
    },
    {
      title: "External Researchers",
      titleAr: "الباحثون الخارجيون",
      description: "All Universities & Research Centers",
      link: "https://forms.gle/7XDrJb7EKY8tSYZS6"
    },
    {
      title: "Industry Partners",
      titleAr: "شركاء الصناعة",
      description: "Companies & Industrial Sector",
      link: "https://forms.gle/zXTMLVuGvFctfn46A"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <img src="/images/logo_cu.png" alt="Cairo University" className="h-16 object-contain" />
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-primary">SCI 2026</h1>
                <p className="text-sm text-muted-foreground">Faculty of Science</p>
              </div>
            </div>
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
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  View Program | البرنامج
                </Button>
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

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="/images/conference-poster-new.jpeg" 
                  alt="SCI 2026 Conference" 
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary/20 rounded-full blur-3xl"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
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
                  <CardTitle className="text-xl">Prof. Mohamed Samy</CardTitle>
                  <CardDescription className="text-base" dir="rtl">
                    الأستاذ الدكتور/ محمد سامي<br/>
                    رئيس جامعة القاهرة
                  </CardDescription>
                  <CardDescription className="text-sm">
                    President of Cairo University
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-xl">Prof. Soheir Ramadan</CardTitle>
                  <CardDescription className="text-base" dir="rtl">
                    الأستاذة الدكتورة/ سهير رمضان<br/>
                    عميد كلية العلوم جامعة القاهرة
                  </CardDescription>
                  <CardDescription className="text-sm">
                    Dean, Faculty of Science - Cairo University
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gradient-to-b from-accent/5 to-white">
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

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-b from-accent/5 to-primary/5">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-primary">Contact Us</h2>
            <p className="text-2xl font-semibold text-secondary" dir="rtl">للاستفسار</p>
            
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl">For any inquiries</CardTitle>
                <CardDescription className="text-lg pt-4">
                  <a href="mailto:sci.conference2026@sci.cu.edu.eg" className="text-primary hover:underline font-medium">
                    sci.conference2026@sci.cu.edu.eg
                  </a>
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="pt-8 space-y-2">
              <p className="text-sm text-muted-foreground">
                Conference Hall, Cairo University, University Hostel
              </p>
              <p className="text-sm text-muted-foreground" dir="rtl">
                قاعة المؤتمرات، جامعة القاهرة، المدينة الجامعية
              </p>
            </div>
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
