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
                    alt="Medsol" 
                    className="h-40 object-contain"
                  />
                </div>
                <CardTitle className="text-2xl">Medsol</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base space-y-3">
                  <p>
                    Medsol provides cutting-edge solutions in genomics and proteomics, 
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

            {/* Agitech */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <img 
                    src="https://files.manuscdn.com/user_upload_by_module/session_file/118031311/edodYeJkMcSIdRYR.png" 
                    alt="Agitech" 
                    className="h-40 object-contain"
                  />
                </div>
                <CardTitle className="text-2xl">Agitech</CardTitle>
                <CardDescription className="text-sm font-medium text-muted-foreground">For Integrated Scientific Instruments, SAE</CardDescription>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base space-y-3">
                  <p>
                    Agitech is a leading provider of integrated scientific instruments and solutions, 
                    bridging cutting-edge laboratory technology with practical biomedical applications.
                  </p>
                  <p>
                    They will deliver a workshop on <strong>"From Basic Research to Precision Medicine: Applications of NGS and ddPCR in Targeted Therapy"</strong>, 
                    demonstrating how Next-Generation Sequencing and Droplet Digital PCR are applied in precision oncology.
                  </p>
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
