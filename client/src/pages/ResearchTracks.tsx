import { Link } from "wouter";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Microscope, Zap, Atom, Globe, Calculator, Heart, Sparkles, FlaskConical, Telescope } from "lucide-react";

export default function ResearchTracks() {
  const tracks = [
    {
      id: "life-sciences",
      icon: Microscope,
      title: "Life Sciences",
      titleAr: "العلوم الحياتية",
      description: "Biology, Biotechnology, Microbiology, Genetics",
      color: "bg-blue-100 text-blue-700",
      borderColor: "border-blue-300"
    },
    {
      id: "physical-sciences",
      icon: Zap,
      title: "Physical Sciences",
      titleAr: "العلوم الفيزيائية",
      description: "Physics, Applied Physics, Theoretical Physics",
      color: "bg-purple-100 text-purple-700",
      borderColor: "border-purple-300"
    },
    {
      id: "chemical-sciences",
      icon: Atom,
      title: "Chemical Sciences",
      titleAr: "العلوم الكيميائية",
      description: "Physical Chemistry, Analytical Chemistry, Organic Chemistry, Inorganic Chemistry",
      color: "bg-pink-100 text-pink-700",
      borderColor: "border-pink-300"
    },
    {
      id: "geoscience",
      icon: Globe,
      title: "Geoscience and Earth Systems",
      titleAr: "علوم الأرض وأنظمة الأرض",
      description: "Sustainable resource exploration, environmental monitoring, geohazard assessment",
      color: "bg-green-100 text-green-700",
      borderColor: "border-green-300"
    },
    {
      id: "mathematical-computational",
      icon: Calculator,
      title: "Mathematical & Computational Sciences",
      titleAr: "العلوم الرياضية والحاسوبية",
      description: "Mathematics, Statistics, AI, Data Science",
      color: "bg-orange-100 text-orange-700",
      borderColor: "border-orange-300"
    },
    {
      id: "medical-health",
      icon: Heart,
      title: "Medical & Health Sciences",
      titleAr: "العلوم الطبية والصحية",
      description: "Biochemistry, Pharmacology, Medical Physics",
      color: "bg-red-100 text-red-700",
      borderColor: "border-red-300"
    },
    {
      id: "interdisciplinary",
      icon: Sparkles,
      title: "Interdisciplinary & Emerging Fields",
      titleAr: "المجالات البينية والحديثة",
      description: "Space Science, Forensics, Sustainability",
      color: "bg-indigo-100 text-indigo-700",
      borderColor: "border-indigo-300"
    },
    {
      id: "materials-science",
      icon: FlaskConical,
      title: "Advanced Materials Science",
      titleAr: "علوم المواد المتقدمة",
      description: "Innovations in nanomaterials, polymers, and composites",
      color: "bg-teal-100 text-teal-700",
      borderColor: "border-teal-300"
    },
    {
      id: "astronomy-space",
      icon: Telescope,
      title: "Astronomy, Space & Meteorology",
      titleAr: "الفلك والفضاء والأرصاد الجوية",
      description: "Astrophysics, Space Exploration, Climate Science, Atmospheric Research",
      color: "bg-cyan-100 text-cyan-700",
      borderColor: "border-cyan-300"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
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
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        {/* Page Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Research Tracks</h1>
          <p className="text-2xl font-semibold text-secondary" dir="rtl">المحاور البحثية</p>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Explore our nine comprehensive research tracks. Click on any track to view detailed submission guidelines, topic examples, and track-specific information.
          </p>
          <p className="text-base text-muted-foreground" dir="rtl">
            استكشف المحاور البحثية التسعة الشاملة. انقر على أي محور لعرض إرشادات التقديم التفصيلية وأمثلة المواضيع والمعلومات الخاصة بكل محور.
          </p>
        </div>

        {/* Tracks Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map((track) => (
            <Link key={track.id} href={`/tracks/${track.id}`}>
              <Card className={`hover:shadow-lg transition-all border-2 ${track.borderColor} hover:scale-105 cursor-pointer h-full`}>
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
                <CardContent>
                  <Button variant="outline" className="w-full">
                    View Details | عرض التفاصيل
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* General Information */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">General Submission Information</CardTitle>
              <CardDescription className="text-lg font-semibold" dir="rtl">
                معلومات عامة عن التقديم
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-red-50 border-2 border-red-300 rounded-lg">
                <h3 className="font-semibold text-lg mb-1 text-red-700">⚠️ Abstract Submission Deadline</h3>
                <p className="text-red-600 font-bold text-xl">March 7, 2026</p>
                <p className="text-sm text-red-500 mt-1">Deadline is approaching — only 5 days left! Submit your abstract now.</p>
                <p className="text-sm text-red-500 mt-1" dir="rtl">الموعد النهائي يقترب — 5 أيام فقط! قدّم ملخصك الآن.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Notification of Acceptance</h3>
                <p className="text-muted-foreground">March 25, 2026</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Abstract Format</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Maximum 300 words</li>
                  <li>Include title, authors, affiliations</li>
                  <li>Clearly state objectives, methods, results, and conclusions</li>
                  <li>Submit in English or Arabic</li>
                </ul>
              </div>
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-semibold text-lg mb-1 text-red-700" dir="rtl">⚠️ موعد تقديم الملخصات</h3>
                <p className="text-red-600 font-bold text-xl" dir="rtl">7 مارس 2026</p>
              </div>
              <div className="pt-4">
                <Link href="/#registration">
                  <Button size="lg" className="w-full">
                    Register Now | سجل الآن
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
