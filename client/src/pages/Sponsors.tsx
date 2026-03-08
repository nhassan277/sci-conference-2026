import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Award, Heart, Handshake } from "lucide-react";

export default function Sponsors() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/5">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-secondary py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center text-white space-y-4">
            <Badge className="bg-white/20 text-white px-4 py-1.5 text-sm font-medium">
              SCI 2026
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold">
              Our Sponsors & Partners
            </h1>
            <p className="text-xl text-white/90">
              Supporting Innovation and Scientific Excellence
            </p>
          </div>
        </div>
      </section>

      {/* Platinum Sponsor */}
      <section className="py-16">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <Award className="w-16 h-16 text-primary mx-auto" />
            <h2 className="text-4xl font-bold text-primary">Platinum Sponsor</h2>
            <p className="text-lg text-muted-foreground">
              Our Premier Partner Supporting Scientific Excellence
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-4 border-primary/30 shadow-2xl hover:shadow-3xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-6">
                  <img 
                    src="https://files.manuscdn.com/user_upload_by_module/session_file/118031311/AnhypChIFEYqXvzy.png" 
                    alt="Sami Ayed Group" 
                    className="h-40 object-contain"
                  />
                </div>
                <CardTitle className="text-3xl">Sami Ayed Group for Feed and Poultry</CardTitle>
                <CardTitle className="text-2xl text-muted-foreground" dir="rtl">
                  مجموعة سامي عايد للأعلاف والدواجن
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose prose-lg max-w-none">
                  <p className="text-center text-lg leading-relaxed">
                    Sami Ayed Group is a leading Egyptian company in the poultry and feed industry, 
                    committed to supporting scientific research and innovation. Through their 
                    generous sponsorship of SCI 2026, Sami Ayed Group demonstrates their dedication 
                    to building effective partnerships between universities and industry, fostering 
                    the next generation of scientific breakthroughs.
                  </p>
                  <p className="text-center text-lg leading-relaxed" dir="rtl">
                    مجموعة سامي عايد هي شركة مصرية رائدة في صناعة الدواجن والأعلاف، ملتزمة بدعم 
                    البحث العلمي والابتكار. من خلال رعايتها السخية لمؤتمر SCI 2026، تُظهر 
                    مجموعة سامي عايد تفانيها في بناء شراكات فعالة بين الجامعات والصناعة، وتعزيز 
                    الجيل القادم من الاختراقات العلمية.
                  </p>
                </div>
                
                <div className="bg-primary/5 rounded-lg p-6 text-center">
                  <p className="text-2xl font-bold text-primary">
                    Contribution: 150,000 EGP
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Supporting scientific excellence and innovation
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Workshop Partners */}
      <section className="py-16 bg-accent/10">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <Handshake className="w-16 h-16 text-secondary mx-auto" />
            <h2 className="text-4xl font-bold text-primary">Workshop Partners</h2>
            <p className="text-2xl font-semibold text-secondary" dir="rtl">شركاء ورش العمل</p>
            <p className="text-lg text-muted-foreground">
              Delivering Professional Training and Certification
            </p>
          </div>

          {/* During-Conference Workshops */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold text-center text-muted-foreground mb-6 uppercase tracking-wide">
              During Conference | أثناء المؤتمر
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {/* NAWAH Scientific */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <img 
                      src="https://files.manuscdn.com/user_upload_by_module/session_file/118031311/ndKRwnmyKdJLbGXC.png" 
                      alt="NAWAH Scientific" 
                      className="h-40 object-contain"
                    />
                  </div>
                  <CardTitle className="text-2xl">NAWAH Scientific</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base space-y-3">
                    <p>
                      NAWAH Scientific is a leading provider of advanced scientific services 
                      and research solutions in Egypt and the Middle East.
                    </p>
                    <p>
                      They will deliver hands-on professional workshops during the conference, 
                      providing participants with practical training and certification in 
                      cutting-edge scientific techniques.
                    </p>
                  </CardDescription>
                </CardContent>
              </Card>

              {/* MARC */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <img 
                      src="https://files.manuscdn.com/user_upload_by_module/session_file/118031311/ovrQFMOFiOzebFkT.jpg" 
                      alt="MARC" 
                      className="h-40 object-contain"
                    />
                  </div>
                  <CardTitle className="text-2xl">MARC</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base space-y-3">
                    <p>
                      MARC specializes in medical research applications and clinical training, 
                      providing expertise in Good Clinical Practice (GCP) and research methodologies.
                    </p>
                    <p>
                      They will conduct a comprehensive 3-hour Good Clinical Practice (GCP) workshop, 
                      equipping researchers with essential knowledge for conducting ethical and 
                      compliant clinical research.
                    </p>
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Medsol */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <img 
                      src="https://files.manuscdn.com/user_upload_by_module/session_file/118031311/suhdZISVxwwlvpPk.png" 
                      alt="Medsol Corporation" 
                      className="h-40 object-contain"
                    />
                  </div>
                  <CardTitle className="text-2xl">Medsol Corporation</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base space-y-3">
                    <p>
                      Medsol Corporation provides cutting-edge solutions in genomics and proteomics, 
                      specializing in advanced sequencing technologies and molecular analysis.
                    </p>
                    <p>
                      They will deliver a comprehensive workshop on Oxford Nanopore sequencing 
                      and Quantum-Si protein sequencing platforms, bridging scientific discovery 
                      with practical implementation.
                    </p>
                  </CardDescription>
                </CardContent>
              </Card>

            </div>
          </div>

          {/* Pre/Post-Conference Workshops */}
          <div>
            <h3 className="text-xl font-semibold text-center text-muted-foreground mb-6 uppercase tracking-wide">
              Pre &amp; Post Conference | قبل وبعد المؤتمر
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">

              {/* Chitosan */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4 h-40 items-center">
                    <img
                      src="https://files.manuscdn.com/user_upload_by_module/session_file/118031311/GXxzRnTYsggXAHMu.png"
                      alt="Chitosan"
                      className="h-32 object-contain"
                    />
                  </div>
                  <CardTitle className="text-2xl">Chitosan</CardTitle>
                  <CardDescription className="text-sm font-medium text-muted-foreground">Biotech Product Development 101</CardDescription>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base space-y-3">
                    <p>
                      An interactive session designed for senior students, fresh graduates, and early-career 
                      researchers who want to learn how scientific ideas can be translated into real products.
                    </p>
                    <p>
                      The workshop introduces a practical roadmap for biotech product development and 
                      potential startup building — covering idea generation, screening, MVP design, 
                      and value proposition.
                    </p>
                    <p className="text-sm text-muted-foreground font-medium">
                      📅 April 6, 2026 &nbsp;|&nbsp; 🕘 9:00 AM – 12:00 PM &nbsp;|&nbsp; 👥 30 spots
                    </p>
                  </CardDescription>
                </CardContent>
              </Card>

              {/* EG-CompBio */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4 h-40 items-center">
                    <img
                      src="https://files.manuscdn.com/user_upload_by_module/session_file/118031311/VSqePLOAbshMxznI.png"
                      alt="EG-CompBio"
                      className="h-32 object-contain"
                    />
                  </div>
                  <CardTitle className="text-2xl">EG-CompBio</CardTitle>
                  <CardDescription className="text-sm font-medium text-muted-foreground">Egyptian Computational Biology Society</CardDescription>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base space-y-3">
                    <p>
                      EG-CompBio is Egypt's leading computational biology society, dedicated to advancing 
                      bioinformatics and single-cell genomics research across the region.
                    </p>
                    <p>
                      They will deliver a hands-on workshop on <strong>Single Cell RNA Sequencing (scRNA-seq)</strong>, 
                      covering data analysis pipelines, cell clustering, and biological interpretation 
                      of single-cell transcriptomic data.
                    </p>
                    <p className="text-sm text-muted-foreground font-medium">
                      📅 April 9, 2026 &nbsp;|&nbsp; 🕙 10:00 AM – 1:00 PM &nbsp;|&nbsp; 👥 30 spots
                    </p>
                  </CardDescription>
                </CardContent>
              </Card>

              {/* HVD */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4 h-40 items-center">
                    <img
                      src="https://files.manuscdn.com/user_upload_by_module/session_file/118031311/NlYUUYlTeGQwRRXp.png"
                      alt="HVD Life Sciences"
                      className="h-32 object-contain"
                    />
                  </div>
                  <CardTitle className="text-2xl">HVD</CardTitle>
                  <CardDescription className="text-sm font-medium text-muted-foreground">Genomics &amp; Proteomics Solutions</CardDescription>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base space-y-3">
                    <p>
                      HVD is a specialized provider of genomics and proteomics solutions, 
                      offering advanced molecular diagnostic services and research support.
                    </p>
                    <p>
                      They will conduct a workshop on <strong>Genomics &amp; Proteomics</strong>, 
                      exploring cutting-edge technologies in DNA/RNA sequencing and protein 
                      expression analysis for translational research applications.
                    </p>
                    <p className="text-sm text-muted-foreground font-medium">
                      📅 Date &amp; Time TBA &nbsp;|&nbsp; 📍 HVD Company, New Cairo &nbsp;|&nbsp; 👥 30 spots
                    </p>
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Agitech */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4 h-40 items-center">
                    <img
                      src="https://files.manuscdn.com/user_upload_by_module/session_file/118031311/qtvBAZFSrMqYBKkE.png"
                      alt="Agitech"
                      className="h-32 object-contain"
                    />
                  </div>
                  <CardTitle className="text-2xl">Agitech</CardTitle>
                  <CardDescription className="text-sm font-medium text-muted-foreground">NGS &amp; ddPCR in Targeted Therapy</CardDescription>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base space-y-3">
                    <p>
                      Agitech — For Integrated Scientific Instruments (SAE) — is a leading provider 
                      of advanced molecular biology instruments and solutions for research and diagnostics.
                    </p>
                    <p>
                      They will deliver a workshop on <strong>NGS &amp; ddPCR in Targeted Therapy</strong>: 
                      From Basic Research to Precision Medicine — covering applications of Next-Generation 
                      Sequencing and digital droplet PCR in targeted cancer therapy.
                    </p>
                    <p className="text-sm text-muted-foreground font-medium">
                      📅 April 6, 2026 &nbsp;|&nbsp; 🕛 12:00 PM – 2:00 PM &nbsp;|&nbsp; 👥 20 spots
                    </p>
                  </CardDescription>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </section>

      {/* Award Sponsors */}
      <section className="py-16">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <Award className="w-16 h-16 text-teal-600 mx-auto" />
            <h2 className="text-4xl font-bold text-primary">Award Sponsors</h2>
            <p className="text-2xl font-semibold text-secondary" dir="rtl">رعاة الجوائز</p>
            <p className="text-lg text-muted-foreground">
              Recognizing and Rewarding Scientific Excellence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">

            {/* NAWAH Scientific */}
            <Card className="border-2 border-green-200 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4 h-32 items-center">
                  <img
                    src="https://files.manuscdn.com/user_upload_by_module/session_file/118031311/ndKRwnmyKdJLbGXC.png"
                    alt="NAWAH Scientific"
                    className="h-28 object-contain"
                  />
                </div>
                <CardTitle className="text-xl text-green-700">NAWAH Scientific</CardTitle>
                <CardDescription className="text-xs font-medium text-muted-foreground">Award Sponsor · راعي الجوائز</CardDescription>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm space-y-2">
                  <p className="font-semibold text-green-700">🏆 Scientific Incubators for Master &amp; PhD Projects</p>
                  <p>حاضنات علمية لمشاريع الماجستير والدكتوراه</p>
                  <p className="text-xs text-muted-foreground">NAWAH will select outstanding Master’s and PhD projects for full scientific incubation support — mentorship, resources, and a pathway to real-world application.</p>
                </CardDescription>
              </CardContent>
            </Card>

            {/* AI بالعربي */}
            <Card className="border-2 border-violet-200 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4 h-32 items-center">
                  <img
                    src="https://files.manuscdn.com/user_upload_by_module/session_file/118031311/KlrhKxhzNQOHAlor.jpeg"
                    alt="AI بالعربي"
                    className="h-28 object-contain"
                  />
                </div>
                <CardTitle className="text-xl text-violet-700">AI بالعربي</CardTitle>
                <CardDescription className="text-xs font-medium text-muted-foreground">Award Sponsor · راعي الجوائز</CardDescription>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm space-y-2">
                  <p className="font-semibold text-violet-700">🤖 Technical AI Project Support</p>
                  <p>دعم تقني لمشروع في مجال الذكاء الاصطناعي</p>
                  <p className="text-xs text-muted-foreground">Full technical support for 1 outstanding AI project — turning your research idea into a working AI solution.</p>
                </CardDescription>
              </CardContent>
            </Card>

            {/* MARC */}
            <Card className="border-2 border-blue-200 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4 h-32 items-center">
                  <img
                    src="https://files.manuscdn.com/user_upload_by_module/session_file/118031311/VulsiXaRGfrttVQf.png"
                    alt="MARC"
                    className="h-28 object-contain"
                  />
                </div>
                <CardTitle className="text-xl text-blue-700">MARC</CardTitle>
                <CardDescription className="text-xs font-medium text-muted-foreground">Award Sponsor · راعي الجوائز</CardDescription>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm space-y-2">
                  <p className="font-semibold text-blue-700">🏆 Training Opportunity + Best Poster Cash Prizes</p>
                  <p>فرصة تدريبية + جوائز نقدية لأفضل الملصقات</p>
                  <p className="text-xs text-muted-foreground">2 training spots + poster prizes: 1st — 2,500 EGP · 2nd — 1,500 EGP · 3rd — 1,000 EGP</p>
                </CardDescription>
              </CardContent>
            </Card>

            {/* Mina Pharm */}
            <Card className="border-2 border-pink-200 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4 h-32 items-center">
                  <img
                    src="https://files.manuscdn.com/user_upload_by_module/session_file/118031311/VSYnJUbvoViFDJRE.png"
                    alt="Mina Pharm"
                    className="h-28 object-contain"
                  />
                </div>
                <CardTitle className="text-xl text-pink-700">Mina Pharm</CardTitle>
                <CardDescription className="text-xs font-medium text-muted-foreground">Award Sponsor · راعي الجوائز</CardDescription>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm space-y-2">
                  <p className="font-semibold text-pink-700">🎁 Health Product Samples + 2 Surprise Bags</p>
                  <p>عينات منتجات صحية + حقيبتا مفاجآت</p>
                  <p className="text-xs text-muted-foreground">Iron &amp; vitamin supplement samples for menopause health, plus 2 exclusive surprise gift bags for lucky winners.</p>
                </CardDescription>
              </CardContent>
            </Card>

            {/* Agitech */}
            <Card className="border-2 border-emerald-200 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4 h-32 items-center">
                  <img
                    src="https://files.manuscdn.com/user_upload_by_module/session_file/118031311/VgPdbFhKiVTOdmtC.png"
                    alt="Agitech"
                    className="h-28 object-contain"
                  />
                </div>
                <CardTitle className="text-xl text-emerald-700">Agitech</CardTitle>
                <CardDescription className="text-xs font-medium text-muted-foreground">Award Sponsor · راعي الجوائز</CardDescription>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm space-y-2">
                  <p className="font-semibold text-emerald-700">🧪 2 Free Professional Sample Kits</p>
                  <p>مجموعتا عينات احترافية مجانية</p>
                  <p className="text-xs text-muted-foreground">2 free professional sample kits for 2 prize winners — direct access to cutting-edge scientific tools.</p>
                </CardDescription>
              </CardContent>
            </Card>

            {/* Medsol Corporation */}
            <Card className="border-2 border-teal-200 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4 h-32 items-center">
                  <img
                    src="https://files.manuscdn.com/user_upload_by_module/session_file/118031311/suhdZISVxwwlvpPk.png"
                    alt="Medsol Corporation"
                    className="h-28 object-contain"
                  />
                </div>
                <CardTitle className="text-xl text-teal-700">Medsol Corporation</CardTitle>
                <CardDescription className="text-xs font-medium text-muted-foreground">Award Sponsor · راعي الجوائز</CardDescription>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm space-y-2">
                  <p className="font-semibold text-teal-700">💡 Best Innovative Research Idea Award</p>
                  <p>جائزة أفضل فكرة بحثية مبتكرة</p>
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <div className="bg-amber-50 border border-amber-200 rounded p-2 text-center">
                      <p className="text-xs text-muted-foreground">1st</p>
                      <p className="text-sm font-bold text-amber-600">3,000 EGP</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded p-2 text-center">
                      <p className="text-xs text-muted-foreground">2nd</p>
                      <p className="text-sm font-bold text-slate-500">2,000 EGP</p>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded p-2 text-center">
                      <p className="text-xs text-muted-foreground">3rd</p>
                      <p className="text-sm font-bold text-orange-700">1,000 EGP</p>
                    </div>
                  </div>
                </CardDescription>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* Become a Sponsor CTA */}
      <section className="py-16">
        <div className="container">
          <Card className="max-w-3xl mx-auto bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary/20">
            <CardHeader className="text-center">
              <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-3xl">Become a Sponsor</CardTitle>
              <CardDescription className="text-lg mt-4">
                Support scientific innovation and connect with Egypt's leading researchers, 
                academics, and industry professionals.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-base text-muted-foreground mb-6">
                For sponsorship opportunities and partnership inquiries, please contact:
              </p>
              <div className="space-y-2">
                <p className="text-lg font-semibold">
                  📧 science.faculty.conference2026@gmail.com
                </p>
                <p className="text-lg font-semibold">
                  🌐 sciconf26.website
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
