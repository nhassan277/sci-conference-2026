import { Award, Trophy, GraduationCap, FileText, Presentation, Lightbulb, Newspaper, Sparkles, Brain, Dna, FlaskConical, Gift, Rocket } from "lucide-react";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
    },
    {
      icon: Lightbulb,
      title: "Best Innovative Research Idea Award",
      titleAr: "جائزة أفضل فكرة بحثية مبتكرة",
      description: "Sponsored by Medsol Corporation — Cash prizes for the most creative and impactful scientific ideas (3,000 / 2,000 / 1,000 EGP)",
      descriptionAr: "برعاية Medsol Corporation — جوائز نقدية لأكثر الأفكار العلمية إبداعاً وأثراً (3000 / 2000 / 1000 جنيه)",
      color: "bg-teal-100 text-teal-700"
    }
  ];

  const sponsorAwards = [
    {
      sponsor: "NAWAH Scientific",
      sponsorEn: "NAWAH Scientific",
      logo: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/ndKRwnmyKdJLbGXC.png",
      icon: GraduationCap,
      prize: "Scientific Incubators for Master & PhD Projects",
      prizeAr: "حاضنات علمية لمشاريع الماجستير والدكتوراه",
      description: "NAWAH Scientific will select outstanding Master's and PhD research projects to receive full scientific incubation support — mentorship, resources, and a pathway to real-world application. Winners will be announced in July 2026.",
      descriptionAr: "ستختار NAWAH Scientific مشاريع بحثية متميزة على مستوى الماجستير والدكتوراه لتحظى بدعم الحاضنة العلمية الكاملة — إرشاد وموارد ومسار نحو التطبيق الفعلي. سيُعلَن عن الفائزين في يوليو 2026.",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
      cardBorder: "border-amber-200 hover:border-amber-400",
      iconBg: "bg-amber-100 text-amber-700",
      tag: "Announced July 2026",
      tagAr: "الإعلان يوليو ٢٠٢٦"
    },
    {
      sponsor: "AI بالعربي",
      sponsorEn: "AI بالعربي",
      logo: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/KlrhKxhzNQOHAlor.jpeg",
      icon: Brain,
      prize: "Technical AI Project Support",
      prizeAr: "دعم تقني لمشروع في مجال الذكاء الاصطناعي",
      description: "AI بالعربي will provide full technical support to one outstanding project in the field of Artificial Intelligence — turning your research idea into a working AI solution.",
      descriptionAr: "ستقدم AI بالعربي دعماً تقنياً كاملاً لمشروع متميز في مجال الذكاء الاصطناعي — لتحويل فكرتك البحثية إلى حل ذكاء اصطناعي حقيقي.",
      badgeColor: "bg-red-100 text-red-800 border-red-200",
      cardBorder: "border-red-200 hover:border-red-400",
      iconBg: "bg-red-100 text-red-700",
      tag: "1 Prize",
      tagAr: "جائزة واحدة"
    },
    {
      sponsor: "MARC",
      sponsorEn: "MARC",
      logo: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/VulsiXaRGfrttVQf.png",
      icon: Trophy,
      prize: "Training Opportunity + Tiered Poster Cash Prizes (2,500 / 1,500 / 1,000 EGP)",
      prizeAr: "فرصة تدريبية + جوائز نقدية للملصقات: 2500 / 1500 / 1000 جنيه",
      description: "MARC will select 2 participants for a professional training opportunity, and award cash prizes for the Best Poster competition: 1st Place — 2,500 EGP, 2nd Place — 1,500 EGP, 3rd Place — 1,000 EGP.",
      descriptionAr: "ستختار MARC مشاركَين للحصول على فرصة تدريبية متخصصة، وستمنح جوائز نقدية لأفضل الملصقات العلمية: المركز الأول — 2500 جنيه، المركز الثاني — 1500 جنيه، المركز الثالث — 1000 جنيه.",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
      cardBorder: "border-blue-200 hover:border-blue-400",
      iconBg: "bg-blue-100 text-blue-700",
      tag: "3 Prizes",
      tagAr: "٣ جوائز"
    },
    {
      sponsor: "Mina Pharm",
      sponsorEn: "Mina Pharm",
      logo: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/VSYnJUbvoViFDJRE.png",
      icon: FlaskConical,
      prize: "Health Product Samples + 2 Surprise Bags",
      prizeAr: "عينات منتجات صحية + حقيبتا مفاجآت",
      description: "Mina Pharm will present iron and vitamin supplement samples for menopause health, along with 2 exclusive surprise gift bags for 2 lucky prize winners at the conference.",
      descriptionAr: "ستقدم Mina Pharm عينات من مكملات الحديد والفيتامينات لصحة سن اليأس، إلى جانب حقيبتَي هدايا مفاجئة لاثنين من الفائزين في المؤتمر.",
      badgeColor: "bg-pink-100 text-pink-800 border-pink-200",
      cardBorder: "border-pink-200 hover:border-pink-400",
      iconBg: "bg-pink-100 text-pink-700",
      tag: "2 Prizes",
      tagAr: "جائزتان"
    },
    {
      sponsor: "Agitech",
      sponsorEn: "Agitech",
      logo: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/VgPdbFhKiVTOdmtC.png",
      icon: Gift,
      prize: "2 Free Sample Kits",
      prizeAr: "مجموعتا عينات مجانية",
      description: "Agitech will award 2 free professional sample kits to 2 prize winners at the conference — giving researchers direct access to cutting-edge scientific tools.",
      descriptionAr: "ستمنح Agitech مجموعتَي عينات احترافية مجانية لاثنين من الفائزين في المؤتمر — مما يتيح للباحثين الوصول المباشر إلى أحدث الأدوات العلمية.",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      cardBorder: "border-emerald-200 hover:border-emerald-400",
      iconBg: "bg-emerald-100 text-emerald-700",
      tag: "2 Prizes",
      tagAr: "جائزتان"
    },
    {
      sponsor: "Medsol Corporation",
      sponsorEn: "Medsol Corporation",
      logo: "https://files.manuscdn.com/user_upload_by_module/session_file/118031311/suhdZISVxwwlvpPk.png",
      icon: Lightbulb,
      prize: "Best Innovative Research Idea (3,000 / 2,000 / 1,000 EGP)",
      prizeAr: "جائزة أفضل فكرة بحثية مبتكرة (3000 / 2000 / 1000 جنيه)",
      description: "Medsol Corporation will award cash prizes for the Best Innovative Research Idea competition: 1st Place — 3,000 EGP, 2nd Place — 2,000 EGP, 3rd Place — 1,000 EGP. Recognizing researchers who present the most creative and impactful scientific ideas.",
      descriptionAr: "ستمنح Medsol Corporation جوائز نقدية لأفضل فكرة بحثية مبتكرة: المركز الأول — 3000 جنيه، المركز الثاني — 2000 جنيه، المركز الثالث — 1000 جنيه. تقديراً للباحثين الذين يقدمون أكثر الأفكار العلمية إبداعاً وأثراً.",
      badgeColor: "bg-teal-100 text-teal-800 border-teal-200",
      cardBorder: "border-teal-200 hover:border-teal-400",
      iconBg: "bg-teal-100 text-teal-700",
      tag: "3 Prizes",
      tagAr: "٣ جوائز"
    },
    {
      sponsor: "Startup Grind",
      sponsorEn: "Startup Grind",
      logo: "https://d2xsxph8kpxj0f.cloudfront.net/118031311/BK5ELr97meyN2f7P5B76DF/download(2)_577d8ace.png",
      icon: Rocket,
      prize: "Student Project Selection & Entrepreneurial Support",
      prizeAr: "اختيار مشاريع الطلاب ودعمها ريادياً",
      description: "Startup Grind will review and select outstanding undergraduate and postgraduate student projects in Artificial Intelligence, Machine Learning, and Bioinformatics. Selected teams will receive mentorship, networking opportunities, and entrepreneurial support to help transform their research ideas into real-world solutions.",
      descriptionAr: "ستقوم Startup Grind بمراجعة واختيار مشاريع الطلاب المتميزة في مجالات الذكاء الاصطناعي والتعلم الآلي والمعلوماتية الحيوية، وتقديم الإرشاد وفرص التواصل والدعم الريادي لتحويل الأفكار البحثية إلى حلول حقيقية.",
      badgeColor: "bg-red-100 text-red-800 border-red-200",
      cardBorder: "border-red-200 hover:border-red-400",
      iconBg: "bg-red-100 text-red-700",
      tag: "Selected Projects",
      tagAr: "مشاريع مختارة"
    },
    {
      sponsor: "Colors Educational Hub",
      sponsorEn: "Colors Educational Hub",
      logo: "https://d2xsxph8kpxj0f.cloudfront.net/118031311/BK5ELr97meyN2f7P5B76DF/logo_colors_52f6762b.png",
      icon: GraduationCap,
      prize: "Internship Training Awards (1 Graduation Project + 2 Master's Projects)",
      prizeAr: "جوائز التدريب المتخصص (أفضل مشروع تخرج + أفضل مشروعَي ماجستير)",
      description: "Colors Educational Hub will award 3 internship training opportunities: 1 spot for the Best Graduation Project and 2 spots for the Best Master's Projects. Winners are selected by Colors Educational Hub based on their own evaluation criteria.",
      descriptionAr: "ستمنح Colors Educational Hub ٣ فرص تدريب متخصصة: فرصة لصاحب أفضل مشروع تخرج، وفرصتان لصاحبَي أفضل مشروعَي ماجستير. يختار Colors Educational Hub الفائزين بناءً على تقييمهم الخاص.",
      badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
      cardBorder: "border-indigo-200 hover:border-indigo-400",
      iconBg: "bg-indigo-100 text-indigo-700",
      tag: "3 Opportunities",
      tagAr: "٣ فرص"
    },
    {
      sponsor: "Chitosan",
      sponsorEn: "Chitosan",
      logo: "https://d2xsxph8kpxj0f.cloudfront.net/118031311/BK5ELr97meyN2f7P5B76DF/pasted_file_t1mp8m_image_bbedca70.png",
      icon: FlaskConical,
      prize: "Chitosan Supply + Technical Support for 1 Project in Biopackaging or Bioremediation",
      prizeAr: "توريد كيتوسان ودعم تقني لمشروع واحد في التغليف الحيوي أو المعالجة الحيوية",
      description: "Chitosan will sponsor one outstanding project in the fields of biopackaging or bioremediation by supplying the selected team with a quantity of chitosan material and providing full technical support throughout the project. The application will be tested on fruit samples to demonstrate real-world impact.",
      descriptionAr: "ستدعم شركة كيتوسان مشروعاً متميزاً في مجال التغليف الحيوي أو المعالجة الحيوية، وذلك بتزويد الفريق الفائز بكمية من مادة الكيتوسان وتقديم الدعم التقني الكامل طوال فترة المشروع. سيُطبَّق المشروع على عينات من الثمار والفاكهة لإثبات الأثر الفعلي.",
      badgeColor: "bg-teal-100 text-teal-800 border-teal-200",
      cardBorder: "border-teal-200 hover:border-teal-400",
      iconBg: "bg-teal-100 text-teal-700",
      tag: "1 Project Sponsored",
      tagAr: "مشروع واحد مدعوم"
    },
    {
      sponsor: "GEnoEra Technology",
      sponsorEn: "GEnoEra Technology",
      logo: "https://d2xsxph8kpxj0f.cloudfront.net/118031311/BK5ELr97meyN2f7P5B76DF/ge_logo-1_c2bdf8df.png",
      icon: Dna,
      prize: "7 Molecular Biology Kits (4 DNA/PCR Bags + 3 RNA/cDNA/qPCR Bags)",
      prizeAr: "٧ حقائب للبيولوجيا الجزيئية (٤ حقائب DNA/PCR + ٣ حقائب RNA/cDNA/qPCR)",
      description: "GEnoEra Technology is sponsoring 7 molecular biology prize bags. Four bags each contain a DNA Extraction Kit and PCR Master Mix. Three bags each contain an RNA Extraction Kit, cDNA Synthesis Kit, and qPCR Master Mix — providing complete workflows for gene expression analysis.",
      descriptionAr: "تتبرع شركة GEnoEra Technology بـ٧ حقائب للبيولوجيا الجزيئية كجوائز للمشاريع المتميزة. تحتوي أربع حقائب على كيت استخلاص الـDNA وخليط PCR الجاهز. وتحتوي ثلاث حقائب على كيت استخلاص الـRNA وكيت تخليق الـcDNA وخليط qPCR الجاهز — لتوفير سير عمل متكامل لتحليل التعبير الجيني.",
      badgeColor: "bg-violet-100 text-violet-800 border-violet-200",
      cardBorder: "border-violet-200 hover:border-violet-400",
      iconBg: "bg-violet-100 text-violet-700",
      tag: "7 Prize Bags",
      tagAr: "٧ حقائب كجوائز"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-accent/5 to-white">
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
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Title with Icons */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="flex items-center justify-center gap-6">
                <Trophy className="w-16 h-16 md:w-20 md:h-20 text-amber-500 flex-shrink-0" />
                <Award className="w-16 h-16 md:w-20 md:h-20 text-amber-500 flex-shrink-0" />
              </div>
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary">
                  Conference Awards
                </h1>
                <p className="text-2xl md:text-3xl font-semibold text-secondary mt-2" dir="rtl">
                  جوائز المؤتمر
                </p>
              </div>
            </div>
            
            {/* Call to Action */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
              <h2 className="text-3xl font-bold text-primary mb-2">
                Ready to Compete?
              </h2>
              <p className="text-2xl font-semibold text-secondary mb-4" dir="rtl">
                هل أنت مستعد للمنافسة؟
              </p>
              <p className="text-lg text-muted-foreground mb-2">
                Register for the conference and showcase your research to compete for these prestigious awards
              </p>
              <p className="text-lg text-muted-foreground mb-6" dir="rtl">
                سجل في المؤتمر واعرض بحثك للمنافسة على هذه الجوائز المرموقة
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="text-lg px-8">
                  <a href="https://sciconf26.website/#registration">Register Now | سجل الآن</a>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-lg px-8">
                  <a href="/">Back to Home | العودة للرئيسية</a>
                </Button>
              </div>
            </div>
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

      {/* Sponsor Awards — NEW SECTION */}
      <section className="py-20 bg-gradient-to-b from-amber-50/40 to-white">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Sparkles className="w-8 h-8 text-amber-500" />
              <h2 className="text-4xl md:text-5xl font-bold text-primary">Sponsor Prizes</h2>
              <Sparkles className="w-8 h-8 text-amber-500" />
            </div>
            <p className="text-2xl font-semibold text-secondary" dir="rtl">جوائز الرعاة</p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our generous sponsors are offering exclusive prizes and opportunities to outstanding conference participants
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto" dir="rtl">
              يقدم رعاتنا الكرام جوائز وفرصاً حصرية للمشاركين المتميزين في المؤتمر
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {sponsorAwards.map((item, index) => (
              <Card key={index} className={`hover:shadow-xl transition-all border-2 ${item.cardBorder} overflow-hidden`}>
                {/* Card top accent bar */}
                <div className={`h-1.5 w-full ${item.iconBg.replace("text-", "bg-").split(" ")[0]}`} />
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    {/* Logo or icon */}
                    <div className="flex items-center gap-3">
                      {item.logo ? (
                        <img
                          src={item.logo}
                          alt={item.sponsorEn}
                          className="h-14 w-auto object-contain rounded-lg bg-white border border-gray-100 p-1 shadow-sm"
                        />
                      ) : (
                        <div className={`w-14 h-14 rounded-xl ${item.iconBg} flex items-center justify-center shadow-sm`}>
                          <item.icon className="w-7 h-7" />
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Sponsored by</p>
                        <p className="font-bold text-lg text-foreground">{item.sponsor}</p>
                      </div>
                    </div>
                    <Badge className={`${item.badgeColor} border text-xs font-semibold shrink-0`}>
                      {item.tag}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 pt-0">
                  {/* Prize title */}
                  <div className={`rounded-lg px-4 py-3 ${item.iconBg.split(" ")[0].replace("text-", "bg-")}/10 border ${item.badgeColor.split(" ")[0].replace("text-", "border-")}`}>
                    <p className="font-bold text-base text-foreground">{item.prize}</p>
                    <p className="text-sm font-semibold text-muted-foreground mt-0.5" dir="rtl">{item.prizeAr}</p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed" dir="rtl">{item.descriptionAr}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Teaser note */}
          <div className="mt-12 text-center">
            <div className="inline-block bg-amber-50 border border-amber-200 rounded-2xl px-8 py-5 max-w-2xl">
              <p className="text-amber-800 font-semibold text-base">
                🌟 More sponsor prizes will be announced soon — stay tuned!
              </p>
              <p className="text-amber-700 text-sm mt-1" dir="rtl">
                🌟 المزيد من جوائز الرعاة سيتم الإعلان عنها قريباً — ترقبوا!
              </p>
            </div>
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


    </div>
  );
}
