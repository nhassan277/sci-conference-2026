import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

export default function KeynoteSpeakers() {
  const speakers = [
    {
      id: 1,
      type: "General Keynote",
      typeAr: "محاضرة عامة رئيسية",
      name: "Prof. Dr. Mortada Mourad El Aref",
      nameAr: "أ.د. مرتضى مراد العارف",
      title: "Professor of Ore Geology",
      titleAr: "أستاذ جيولوجيا الخامات",
      affiliation: "Geology Department, Faculty of Science, Cairo University",
      affiliationAr: "قسم الجيولوجيا، كلية العلوم، جامعة القاهرة",
      lecture: "Karstology (Science of Unlimited Multi-Discipline Approaches), promising Setting for Industrial Raw Materials",
      lectureAr: "علم الكارست (علم النهج متعدد التخصصات غير المحدود)، بيئة واعدة للمواد الخام الصناعية"
    },
    {
      id: 2,
      type: "Invited Talk",
      typeAr: "محاضرة متخصصة",
      name: "Prof. Dr. Mortada Mourad El Aref",
      nameAr: "أ.د. مرتضى مراد العارف",
      title: "Professor of Ore Geology",
      titleAr: "أستاذ جيولوجيا الخامات",
      affiliation: "Geology Department, Faculty of Science, Cairo University",
      affiliationAr: "قسم الجيولوجيا، كلية العلوم، جامعة القاهرة",
      lecture: "Egyptian Iron Ore for Supporting National Economy - Opportunities and Challenges",
      lectureAr: "خام الحديد المصري لدعم الاقتصاد الوطني - الفرص والتحديات"
    },
    {
      id: 3,
      type: "Invited Talk",
      typeAr: "محاضرة متخصصة",
      name: "Prof. Dr. Mahmoud Nasr",
      nameAr: "أ.د. محمود نصر",
      title: "Professor of Ore Beneficiation and Manufacturing",
      titleAr: "أستاذ تجهيز الخامات والتصنيع",
      affiliation: "Egyptian Central Metallurgical Research & Development Institute (CMRDI)",
      affiliationAr: "مركز بحوث وتطوير الفلزات",
      lecture: "Egyptian Iron Ore as a Feedstock to the Iron and Steel Industry",
      lectureAr: "خام الحديد المصري كمادة خام لصناعة الحديد والصلب"
    },
    {
      id: 4,
      type: "Invited Talk",
      typeAr: "محاضرة متخصصة",
      name: "Prof. Dr. Mohamed I. El-Anbaawy",
      nameAr: "أ.د. محمد إبراهيم الأنبعاوي",
      title: "Professor of Geology",
      titleAr: "أستاذ الجيولوجيا",
      affiliation: "Geology Department, Faculty of Science, Cairo University",
      affiliationAr: "قسم الجيولوجيا، كلية العلوم، جامعة القاهرة",
      lecture: "Economic utilization of Shale in desert land reclamation and cement industry",
      lectureAr: "الاستخدام الاقتصادي للصخر الزيتي في استصلاح الأراضي الصحراوية وصناعة الأسمنت"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-accent/5">
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
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <Badge className="bg-secondary text-secondary-foreground px-4 py-1.5 text-sm font-medium">
              April 7-8, 2026 | ٧-٨ أبريل ٢٠٢٦
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary">
              Keynote Speakers
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
          <div className="grid gap-8 max-w-5xl mx-auto">
            {speakers.map((speaker) => (
              <Card key={speaker.id} className="hover:shadow-lg transition-shadow border-2">
                <CardHeader>
                  <div className="flex items-start gap-6">
                    {/* Placeholder for speaker photo */}
                    <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
                      <User className="w-12 h-12 text-primary/40" />
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                        {speaker.type} | {speaker.typeAr}
                      </Badge>
                      
                      <div>
                        <CardTitle className="text-2xl mb-1">{speaker.name}</CardTitle>
                        <p className="text-lg text-muted-foreground" dir="rtl">{speaker.nameAr}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-primary">{speaker.title}</p>
                        <p className="text-sm text-muted-foreground" dir="rtl">{speaker.titleAr}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm">{speaker.affiliation}</p>
                        <p className="text-sm text-muted-foreground" dir="rtl">{speaker.affiliationAr}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-2 pt-4 border-t">
                    <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide">
                      Lecture Title
                    </p>
                    <p className="font-medium text-base leading-relaxed">{speaker.lecture}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed" dir="rtl">{speaker.lectureAr}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container">
          <div className="text-center space-y-4">
            <p className="text-lg font-semibold">
              Science at the Core of Innovation (SCI 2026)
            </p>
            <p dir="rtl">العلوم في قلب الإبتكار</p>
            <p className="text-sm opacity-90">
              Faculty of Science, Cairo University
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
