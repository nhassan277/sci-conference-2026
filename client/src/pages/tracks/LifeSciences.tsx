import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Microscope, CheckCircle2 } from "lucide-react";

export default function LifeSciences() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
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

      <div className="container py-12">
        {/* Back Button */}
        <Link href="/tracks">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Tracks
          </Button>
        </Link>

        {/* Track Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="w-24 h-24 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-6">
            <Microscope className="w-12 h-12" />
          </div>
          <Badge className="bg-blue-100 text-blue-700 px-4 py-1.5 text-sm font-medium">Track 1</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Life Sciences</h1>
          <p className="text-2xl font-semibold text-secondary" dir="rtl">العلوم الحياتية</p>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Advancing our understanding of living organisms through cutting-edge research in biology, biotechnology, microbiology, and genetics.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Track Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Track Overview</CardTitle>
                <CardDescription dir="rtl" className="text-base font-medium">نظرة عامة على المحور</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  The Life Sciences track welcomes research that explores the fundamental principles of living organisms, 
                  from molecular mechanisms to ecosystem dynamics. We encourage submissions that bridge basic research 
                  with practical applications in healthcare, agriculture, environmental conservation, and biotechnology.
                </p>
                <p dir="rtl">
                  يرحب محور العلوم الحياتية بالأبحاث التي تستكشف المبادئ الأساسية للكائنات الحية، من الآليات الجزيئية 
                  إلى ديناميكيات النظام البيئي. نشجع التقديمات التي تربط البحث الأساسي بالتطبيقات العملية في الرعاية 
                  الصحية والزراعة والحفاظ على البيئة والتكنولوجيا الحيوية.
                </p>
              </CardContent>
            </Card>

            {/* Research Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Research Topics</CardTitle>
                <CardDescription dir="rtl" className="text-base font-medium">موضوعات البحث</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { en: "Molecular Biology & Genetics", ar: "البيولوجيا الجزيئية والوراثة" },
                    { en: "Microbiology & Immunology", ar: "علم الأحياء الدقيقة والمناعة" },
                    { en: "Biotechnology & Bioengineering", ar: "التكنولوجيا الحيوية والهندسة الحيوية" },
                    { en: "Cell Biology & Biochemistry", ar: "بيولوجيا الخلية والكيمياء الحيوية" },
                    { en: "Ecology & Environmental Biology", ar: "علم البيئة والأحياء البيئية" },
                    { en: "Developmental Biology", ar: "بيولوجيا النمو والتطور" },
                    { en: "Plant Sciences & Agriculture", ar: "علوم النبات والزراعة" },
                    { en: "Marine & Aquatic Biology", ar: "الأحياء البحرية والمائية" },
                    { en: "Bioinformatics & Computational Biology", ar: "المعلوماتية الحيوية والأحياء الحاسوبية" },
                    { en: "Neuroscience & Behavioral Biology", ar: "علم الأعصاب والسلوك الحيوي" }
                  ].map((topic, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">{topic.en}</p>
                        <p className="text-xs text-muted-foreground" dir="rtl">{topic.ar}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Example Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Example Research Questions</CardTitle>
                <CardDescription dir="rtl" className="text-base font-medium">أمثلة على أسئلة البحث</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold text-lg">•</span>
                    <span>CRISPR-Cas9 applications in gene therapy for inherited diseases</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold text-lg">•</span>
                    <span>Microbial resistance mechanisms and novel antibiotic development</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold text-lg">•</span>
                    <span>Biotechnological approaches to sustainable agriculture</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold text-lg">•</span>
                    <span>Biodiversity conservation strategies in changing ecosystems</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold text-lg">•</span>
                    <span>Stem cell research and regenerative medicine applications</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Submission Guidelines */}
            <Card className="border-2 border-blue-200">
              <CardHeader>
                <CardTitle>Submission Guidelines</CardTitle>
                <CardDescription dir="rtl" className="font-medium">إرشادات التقديم</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Abstract Length</h4>
                  <p className="text-sm text-muted-foreground">250-300 words</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Format</h4>
                  <p className="text-sm text-muted-foreground">English or Arabic, structured abstract preferred</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Required Sections</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Background/Objectives</li>
                    <li>• Methods</li>
                    <li>• Results</li>
                    <li>• Conclusions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Keywords</h4>
                  <p className="text-sm text-muted-foreground">3-5 keywords required</p>
                </div>
                <div className="pt-4 border-t">
                  <Link href="/#registration">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Submit Abstract
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Important Dates */}
            <Card>
              <CardHeader>
                <CardTitle>Important Dates</CardTitle>
                <CardDescription dir="rtl" className="font-medium">التواريخ المهمة</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold">Abstract Submission</p>
                  <p className="text-muted-foreground">February 28, 2026</p>
                </div>
                <div>
                  <p className="font-semibold">Notification</p>
                  <p className="text-muted-foreground">March 25, 2026</p>
                </div>
                <div>
                  <p className="font-semibold">Conference Dates</p>
                  <p className="text-muted-foreground">April 7-8, 2026</p>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Track Chair</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="font-semibold">Prof. Dr. Ahmed Hassan</p>
                <p className="text-muted-foreground">Department of Biology</p>
                <p className="text-muted-foreground mt-2">
                  <a href="mailto:lifesciences@sci2026.com" className="text-blue-600 hover:underline">
                    lifesciences@sci2026.com
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
