import { Award, Trophy, GraduationCap, FileText, Presentation, Lightbulb, Newspaper } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Awards() {
  const awards = [
    {
      icon: GraduationCap,
      title: "Best Graduation Project Award",
      titleAr: "جائزة أفضل مشروع تخرج",
      description: "Recognizing outstanding undergraduate research and innovation",
      descriptionAr: "تقديراً للبحث والابتكار المتميز على مستوى البكالوريوس",
      color: "bg-blue-100 text-blue-700"
    },
    {
      icon: FileText,
      title: "Best MSc Thesis Award",
      titleAr: "جائزة أفضل رسالة ماجستير",
      description: "Honoring exceptional master's level research contributions",
      descriptionAr: "تكريماً للمساهمات البحثية الاستثنائية على مستوى الماجستير",
      color: "bg-purple-100 text-purple-700"
    },
    {
      icon: Trophy,
      title: "Best PhD Thesis Award",
      titleAr: "جائزة أفضل رسالة دكتوراه",
      description: "Celebrating groundbreaking doctoral research excellence",
      descriptionAr: "احتفاءً بالتميز البحثي الرائد على مستوى الدكتوراه",
      color: "bg-amber-100 text-amber-700"
    },
    {
      icon: Presentation,
      title: "Best Poster Award",
      titleAr: "جائزة أفضل ملصق علمي",
      description: "Awarded for outstanding visual research communication",
      descriptionAr: "تُمنح للتميز في التواصل البحثي المرئي",
      color: "bg-green-100 text-green-700"
    },
    {
      icon: Award,
      title: "Best Presentation Award",
      titleAr: "جائزة أفضل عرض تقديمي",
      description: "Recognizing excellence in oral research presentation",
      descriptionAr: "تقديراً للتميز في العرض البحثي الشفهي",
      color: "bg-red-100 text-red-700"
    },
    {
      icon: Lightbulb,
      title: "Best Innovative Product Award",
      titleAr: "جائزة أفضل منتج مبتكر",
      description: "Honoring practical innovations with real-world impact",
      descriptionAr: "تكريماً للابتكارات العملية ذات الأثر الواقعي",
      color: "bg-orange-100 text-orange-700"
    },
    {
      icon: Newspaper,
      title: "Best Paper Award",
      titleAr: "جائزة أفضل بحث علمي",
      description: "Celebrating exceptional written research contributions",
      descriptionAr: "احتفاءً بالمساهمات البحثية المكتوبة الاستثنائية",
      color: "bg-indigo-100 text-indigo-700"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-accent/5 to-white">
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
      <section className="py-16 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/10">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge className="bg-secondary text-secondary-foreground px-4 py-1.5 text-sm font-medium">
              Conference Awards | جوائز المؤتمر
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold text-primary">
              Conference Awards
            </h1>
            <p className="text-3xl font-semibold text-secondary" dir="rtl">
              جوائز المؤتمر
            </p>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              Recognizing Excellence in Scientific Research and Innovation
            </p>
            <p className="text-xl text-muted-foreground" dir="rtl">
              تقديراً للتميز في البحث العلمي والابتكار
            </p>
          </div>
        </div>
      </section>

      {/* Awards Categories */}
      <section className="py-20">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-primary">Award Categories</h2>
            <p className="text-2xl font-semibold text-secondary" dir="rtl">فئات الجوائز</p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Seven prestigious awards celebrating outstanding contributions across all scientific disciplines
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {awards.map((award, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-2 hover:border-primary/50">
                <CardHeader>
                  <div className={`w-16 h-16 rounded-xl ${award.color} flex items-center justify-center mb-4`}>
                    <award.icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-xl">{award.title}</CardTitle>
                  <CardDescription className="text-base font-medium" dir="rtl">
                    {award.titleAr}
                  </CardDescription>
                  <CardDescription className="text-sm pt-2">
                    {award.description}
                  </CardDescription>
                  <CardDescription className="text-sm" dir="rtl">
                    {award.descriptionAr}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-b from-accent/5 to-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-primary">How It Works</h2>
              <p className="text-2xl font-semibold text-secondary" dir="rtl">آلية العمل</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    1
                  </div>
                  <CardTitle className="text-lg">Participate in the Conference</CardTitle>
                  <CardDescription dir="rtl" className="font-medium">شارك في المؤتمر</CardDescription>
                  <CardDescription className="pt-2">
                    All registered participants presenting research are automatically considered for awards
                  </CardDescription>
                  <CardDescription dir="rtl">
                    جميع المشاركين المسجلين الذين يقدمون أبحاثاً يتم النظر فيهم تلقائياً للجوائز
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    2
                  </div>
                  <CardTitle className="text-lg">Expert Evaluation</CardTitle>
                  <CardDescription dir="rtl" className="font-medium">التقييم من قبل الخبراء</CardDescription>
                  <CardDescription className="pt-2">
                    Distinguished panel of judges evaluates all presentations and research contributions
                  </CardDescription>
                  <CardDescription dir="rtl">
                    لجنة متميزة من المحكمين تقيّم جميع العروض والمساهمات البحثية
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    3
                  </div>
                  <CardTitle className="text-lg">Closing Ceremony</CardTitle>
                  <CardDescription dir="rtl" className="font-medium">حفل الختام</CardDescription>
                  <CardDescription className="pt-2">
                    Winners announced and honored during the conference closing ceremony
                  </CardDescription>
                  <CardDescription dir="rtl">
                    يتم الإعلان عن الفائزين وتكريمهم خلال حفل ختام المؤتمر
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Trophy className="w-20 h-20 text-primary mx-auto" />
            <h2 className="text-4xl font-bold text-primary">Ready to Compete?</h2>
            <p className="text-2xl font-semibold text-secondary" dir="rtl">هل أنت مستعد للمنافسة؟</p>
            <p className="text-lg text-muted-foreground">
              Register for the conference and showcase your research to compete for these prestigious awards
            </p>
            <p className="text-lg text-muted-foreground" dir="rtl">
              سجل في المؤتمر واعرض بحثك للمنافسة على هذه الجوائز المرموقة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <a
                href="/registration"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
              >
                Register Now | سجل الآن
              </a>
              <a
                href="/"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8"
              >
                Back to Home | العودة للرئيسية
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
