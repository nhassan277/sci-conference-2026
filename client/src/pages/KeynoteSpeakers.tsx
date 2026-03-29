import { trpc } from "@/lib/trpc";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Loader2, Linkedin, Twitter, Globe, GraduationCap, Building2, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";

function SpeakerCard({ speaker }: { speaker: any }) {
  return (
    <Card className="hover:shadow-lg transition-shadow border-2">
      <CardHeader>
        <div className="flex items-start gap-6">
          {/* Speaker photo */}
          <div className="flex-shrink-0">
            {speaker.photoUrl ? (
              <img
                src={speaker.photoUrl}
                alt={speaker.fullName}
                className="w-32 h-32 rounded-lg object-cover shadow-md"
              />
            ) : (
              <div className="w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                <User className="w-16 h-16 text-primary/40" />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <CardTitle className="text-2xl mb-1">
                {speaker.title} {speaker.fullName}
              </CardTitle>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-primary">{speaker.affiliation}</p>
            </div>

            {/* Social Links */}
            {(speaker.linkedinUrl || speaker.twitterUrl || speaker.websiteUrl) && (
              <div className="flex gap-2">
                {speaker.linkedinUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(speaker.linkedinUrl!, '_blank')}
                  >
                    <Linkedin className="w-4 h-4" />
                  </Button>
                )}
                {speaker.twitterUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(speaker.twitterUrl!, '_blank')}
                  >
                    <Twitter className="w-4 h-4" />
                  </Button>
                )}
                {speaker.websiteUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(speaker.websiteUrl!, '_blank')}
                  >
                    <Globe className="w-4 h-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Presentation Title */}
          <div className="space-y-2 pt-4 border-t">
            <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide">
              Presentation Title
            </p>
            <p className="font-medium text-base leading-relaxed">{speaker.presentationTitle}</p>
            {speaker.presentationTitleAr && (
              <p className="text-muted-foreground text-sm leading-relaxed" dir="rtl">
                {speaker.presentationTitleAr}
              </p>
            )}
          </div>

          {/* Abstract */}
          {speaker.presentationAbstract && (
            <div className="space-y-2 pt-4 border-t">
              <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide">
                Abstract
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground text-justify">
                {speaker.presentationAbstract}
              </p>
            </div>
          )}

          {/* Biography */}
          {speaker.bio && (
            <div className="space-y-2 pt-4 border-t">
              <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide">
                Biography
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground text-justify">
                {speaker.bio}
              </p>
              {speaker.bioAr && (
                <p className="text-sm leading-relaxed text-muted-foreground text-justify" dir="rtl">
                  {speaker.bioAr}
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

const commercialSponsors = [
  {
    name: "Startup Grind",
    nameAr: "ستارتب جرايند",
    desc: "Global Entrepreneurship Community — Cairo Chapter. Supporting student innovation in AI, ML & Bioinformatics.",
    descAr: "مجتمع ريادة الأعمال العالمي — فرع القاهرة. دعم مشاريع الطلاب في الذكاء الاصطناعي والمعلوماتية الحيوية.",
  },
  {
    name: "Colors Educational Hub",
    nameAr: "كولورز للتعليم",
    desc: "Advanced training in Metagenomics & Microbiome Analysis.",
    descAr: "تدريب متقدم في علم الميتاجينوميكس وتحليل الميكروبيوم.",
  },
  {
    name: "Agitech",
    nameAr: "أجيتك",
    desc: "Precision Medicine solutions using NGS and ddPCR technologies.",
    descAr: "حلول الطب الدقيق باستخدام تقنيات NGS وddPCR.",
  },
  {
    name: "AI بالعربي",
    nameAr: "AI بالعربي",
    desc: "AI Meets Biotech — Bridging artificial intelligence and biotechnology.",
    descAr: "الذكاء الاصطناعي يلتقي بالتكنولوجيا الحيوية.",
  },
  {
    name: "Chitosan",
    nameAr: "كيتوسان",
    desc: "Biotech Product Development and startup building roadmap.",
    descAr: "تطوير المنتجات التقنية الحيوية وبناء الشركات الناشئة.",
  },
  {
    name: "Sami Abd Company",
    nameAr: "شركة سامي عبد",
    desc: "Industry partner presenting innovations and solutions.",
    descAr: "شريك صناعي يقدم الابتكارات والحلول.",
  },
  {
    name: "EgCompBio",
    nameAr: "إيجكومبيو",
    desc: "Computational Biology & Single Cell Genomics solutions.",
    descAr: "حلول علم الأحياء الحسابي وجينوميكس الخلية الواحدة.",
  },
  {
    name: "Plasma",
    nameAr: "بلازما",
    desc: "Industry partner presenting innovations and solutions.",
    descAr: "شريك صناعي يقدم الابتكارات والحلول.",
  },
];

export default function KeynoteSpeakers() {
  const { data: speakers, isLoading } = trpc.keynoteSpeakers.list.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // All speakers are now 'Plenary' type — split by sector (normalize to lowercase+trim for robustness)
  const normSector = (s: string | null | undefined) => (s || '').trim().toLowerCase();
  const plenaryAcademia = speakers?.filter(s => normSector(s.speakerSector) !== 'industry') ?? [];
  const plenaryIndustry = speakers?.filter(s => normSector(s.speakerSector) === 'industry') ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-accent/5">
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

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/10">
        <div className="container">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <Badge className="bg-secondary text-secondary-foreground px-4 py-1.5 text-sm font-medium">
              April 7-8, 2026 | ٧-٨ أبريل ٢٠٢٦
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary">
              Plenary Speakers
            </h1>
            <p className="text-2xl md:text-3xl text-secondary font-semibold" dir="rtl">
              المتحدثون الرئيسيون
            </p>
            <p className="text-lg text-muted-foreground">
              Distinguished experts sharing their insights and research
            </p>
          </div>
        </div>
      </section>

      {/* Speakers Section */}
      <section className="py-20">
        <div className="container">
          <div className="space-y-16 max-w-5xl mx-auto">

            {/* Plenary Speakers — Academia */}
            {plenaryAcademia.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <GraduationCap className="w-8 h-8 text-primary" />
                  <h2 className="text-3xl font-bold text-primary">Plenary Speakers — Academia</h2>
                </div>
                <p className="text-xl text-secondary font-semibold mb-2" dir="rtl">المتحدثون الرئيسيون — الأكاديميون والباحثون</p>
                <Badge className="bg-blue-100 text-blue-800 mb-6">20-Minute Talk | محاضرة ٢٠ دقيقة</Badge>
                <div className="grid gap-8">
                  {plenaryAcademia.map((speaker) => (
                    <SpeakerCard key={speaker.id} speaker={speaker} />
                  ))}
                </div>
              </div>
            )}

            {/* Plenary Speakers — Industry */}
            {plenaryIndustry.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Building2 className="w-8 h-8 text-primary" />
                  <h2 className="text-3xl font-bold text-primary">Plenary Speakers — Industry</h2>
                </div>
                <p className="text-xl text-secondary font-semibold mb-2" dir="rtl">المتحدثون الرئيسيون — القطاع الصناعي والريادي</p>
                <Badge className="bg-blue-100 text-blue-800 mb-6">20-Minute Talk | محاضرة ٢٠ دقيقة</Badge>
                <div className="grid gap-8">
                  {plenaryIndustry.map((speaker) => (
                    <SpeakerCard key={speaker.id} speaker={speaker} />
                  ))}
                </div>
              </div>
            )}

            {/* Commercial Sponsor Talks */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Megaphone className="w-8 h-8 text-amber-600" />
                <h2 className="text-3xl font-bold text-primary">Sponsor Commercial Talks</h2>
              </div>
              <p className="text-xl text-secondary font-semibold mb-2" dir="rtl">المحادثات التجارية للرعاة</p>
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge className="bg-amber-100 text-amber-800">10-Minute Talk | محادثة ١٠ دقائق</Badge>
                <Badge variant="outline" className="text-muted-foreground">Small Hall | القاعة الصغيرة</Badge>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {commercialSponsors.map((sponsor, i) => (
                  <Card key={i} className="border border-amber-200 bg-amber-50/30 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-primary">{sponsor.name}</CardTitle>
                      <p className="text-sm font-medium text-secondary" dir="rtl">{sponsor.nameAr}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{sponsor.desc}</p>
                      <p className="text-sm text-muted-foreground mt-1" dir="rtl">{sponsor.descAr}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
