import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Award, Heart, Handshake, Building2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

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
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
              <CardContent className="pt-0">
                <a href="https://www.linkedin.com/company/nawah-scientific/?originalSubdomain=eg" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-green-600 hover:text-green-800 font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  Follow NAWAH on LinkedIn
                </a>
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
              <CardContent className="pt-0">
                <a href="https://www.linkedin.com/company/marcresearch/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  Follow MARC on LinkedIn
                </a>
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
              <CardContent className="pt-0">
                <a href="https://www.linkedin.com/company/medsolme/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-teal-600 hover:text-teal-800 font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  Follow Medsol on LinkedIn
                </a>
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
            {/* GEnoEra Technology */}
              <Card className="hover:shadow-lg transition-shadow">            <CardHeader className="text-center">
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
              <CardContent className="pt-0">
                <a href="https://www.linkedin.com/in/chitosan-egypt/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-teal-600 hover:text-teal-800 font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  Follow Chitosan on LinkedIn
                </a>
              </CardContent>
              </Card>

                {/* EgCompBio */}
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
              <CardContent className="pt-0">
                <a href="https://www.linkedin.com/company/egcompbio/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-teal-600 hover:text-teal-800 font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  Follow EgCompBio on LinkedIn
                </a>
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
                      📅 Sunday, April 12, 2026 (Post-Conference) · Time TBA &nbsp;|&nbsp; 📍 HVD Company, New Cairo &nbsp;|&nbsp; 👥 30 spots
                    </p>
                  </CardDescription>
                </CardContent>
              <CardContent className="pt-0">
                <a href="https://www.linkedin.com/company/hvdegypt/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-orange-600 hover:text-orange-800 font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  Follow HVD on LinkedIn
                </a>
              </CardContent>
              </Card>

              {/* Chitosan */}
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
              <CardContent className="pt-0">
                <a href="https://www.linkedin.com/company/agitech-egypt/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-800 font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  Follow Agitech on LinkedIn
                </a>
              </CardContent>
            </Card>

            {/* Colors Educational Hub */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4 h-40 items-center">
                    <img
                      src="https://d2xsxph8kpxj0f.cloudfront.net/118031311/BK5ELr97meyN2f7P5B76DF/logo_colors_52f6762b.png"
                      alt="Colors Educational Hub"
                      className="h-32 object-contain"
                    />
                  </div>
                  <CardTitle className="text-2xl">Colors Educational Hub</CardTitle>
                  <CardDescription className="text-sm font-medium text-muted-foreground">Metagenomics, Microbiome &amp; 16S rRNA Sequencing</CardDescription>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base space-y-3">
                    <p>
                      Colors Educational Hub is a specialized scientific training center based in Maadi, Cairo, 
                      providing hands-on courses and workshops in modern molecular biology and bioinformatics.
                    </p>
                    <p>
                      They will conduct a workshop on <strong>Metagenomics, Microbiome &amp; 16S rRNA Sequencing</strong>, 
                      covering microbial community diversity analysis and state-of-the-art bioinformatics workflows. 
                      Full title to be announced soon.
                    </p>
                    <p className="text-sm text-muted-foreground font-medium">
                      📅 Date &amp; Time TBA &nbsp;|&nbsp; 📍 Maadi, Cairo &nbsp;|&nbsp; 👥 25 spots &nbsp;|&nbsp; 💰 200 EGP
                    </p>
                  </CardDescription>
                </CardContent>
              <CardContent className="pt-0">
                <a href="https://www.linkedin.com/company/colors-educational-hub/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  Follow Colors Educational Hub on LinkedIn
                </a>
              </CardContent>
              </Card>

            </div>
          </div>

          {/* Post-Conference Workshops — GESR */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold text-center text-muted-foreground mb-6 uppercase tracking-wide">
              Post-Conference | بعد المؤتمر
            </h3>
            <div className="grid md:grid-cols-1 gap-8 max-w-2xl mx-auto">

              {/* GESR */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4 h-40 items-center">
                    <img
                      src="https://d2xsxph8kpxj0f.cloudfront.net/118031311/BK5ELr97meyN2f7P5B76DF/GESR-logo_7866e6d3.jpg"
                      alt="GESR"
                      className="h-32 object-contain"
                    />
                  </div>
                  <CardTitle className="text-2xl">GESR</CardTitle>
                  <CardDescription className="text-sm font-medium text-muted-foreground">German Egyptian Social &amp; Scientific Relationships</CardDescription>
                  <CardDescription className="text-sm font-medium text-muted-foreground">From Lab to Global Opportunities: How to Prepare for Scholarships and Research Abroad</CardDescription>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base space-y-3">
                    <p>
                      GESR (German Egyptian Social &amp; Scientific Relationships) is a platform dedicated to building bridges between Egyptian researchers and the global scientific community, with a focus on German-Egyptian academic ties.
                    </p>
                    <p>
                      Under the initiative <strong>MASAR — Nextgen Researchers</strong> (launching at this workshop), GESR will deliver a 3-hour session guiding students and early-career researchers on how to prepare for international scholarships and research opportunities abroad.
                    </p>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">Workshop Outline</p>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        <li><strong>Part 1 (30 min):</strong> Understanding Global Research Opportunities — scholarships, fellowships, internships, exchange programs (DAAD, Erasmus, Marie Curie)</li>
                        <li><strong>Part 2 (45 min):</strong> Building a Strong Academic CV — structure, highlighting research experience, common mistakes</li>
                        <li><strong>Part 3 (45 min):</strong> Writing a Winning Motivation Letter — structure, storytelling, linking research interests to the opportunity</li>
                        <li><strong>Part 4 (30 min):</strong> Preparing for Research Abroad — choosing a supervisor, networking, building a research profile</li>
                        <li><strong>Part 5 (30 min):</strong> Interactive Q&amp;A — CV feedback, application advice, opportunity discussion</li>
                      </ul>
                    </div>
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 space-y-1">
                      <p className="text-sm font-semibold text-indigo-800">🎓 Special Selections from Conference Projects</p>
                      <ul className="list-disc list-inside text-sm text-indigo-700 space-y-1">
                        <li>5 students selected to join the <strong>GESR Mentorship Program</strong></li>
                        <li>5 students invited to attend the <strong>next GESR Summer Conference</strong> (date TBA)</li>
                      </ul>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">
                      📅 Thursday, April 9, 2026 &nbsp;|&nbsp; 🕒 3:00 PM – 6:00 PM &nbsp;|&nbsp; 🎤 Dr. Nourhan Hassan &amp; Dr. Hazem Badawy (Board of GESR)
                    </p>
                  </CardDescription>
                </CardContent>
                <CardContent className="pt-0">
                  <a href="https://www.linkedin.com/company/102566987/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    Follow GESR on LinkedIn
                  </a>
                </CardContent>
              </Card>

            </div>
          </div>

        </div>
      </section>

      {/* Community & Innovation Partners */}
      <section className="py-16">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <Building2 className="w-16 h-16 text-red-600 mx-auto" />
            <h2 className="text-4xl font-bold text-primary">Community & Innovation Partners</h2>
            <p className="text-2xl font-semibold text-secondary" dir="rtl">شركاء المجتمع والابتكار</p>
            <p className="text-lg text-muted-foreground">
              Supporting Entrepreneurship and Student Innovation
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card className="border-4 border-red-200 shadow-2xl hover:shadow-3xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-6">
                  <img
                    src="https://d2xsxph8kpxj0f.cloudfront.net/118031311/BK5ELr97meyN2f7P5B76DF/download(2)_577d8ace.png"
                    alt="Startup Grind"
                    className="h-32 object-contain"
                  />
                </div>
                <CardTitle className="text-3xl">Startup Grind</CardTitle>
                <CardDescription className="text-lg text-muted-foreground mt-2">
                  Global Entrepreneurship Community — Cairo Chapter
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose prose-lg max-w-none">
                  <p className="text-center text-lg leading-relaxed">
                    Startup Grind is the world's largest startup community, educating, inspiring, and connecting
                    entrepreneurs. The Cairo chapter brings together innovators, founders, and industry leaders
                    to foster a thriving entrepreneurship ecosystem in Egypt.
                  </p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <p className="text-lg font-bold text-red-700 mb-3">🚀 Student Project Support Initiative</p>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    Startup Grind will review and select outstanding undergraduate and postgraduate
                    student projects in <strong>Artificial Intelligence, Machine Learning, and Bioinformatics</strong>.
                    Selected teams will receive mentorship, networking opportunities, and entrepreneurial
                    support to help transform their research ideas into real-world solutions.
                  </p>
                  <p className="text-base leading-relaxed text-muted-foreground mt-3" dir="rtl">
                    ستقوم Startup Grind بمراجعة واختيار مشاريع الطلاب المتميزة في مجالات الذكاء الاصطناعي
                    والتعلم الآلي والمعلوماتية الحيوية، وتقديم الدعم والإرشاد اللازمين لتحويل الأفكار البحثية إلى حلول حقيقية.
                  </p>
                </div>

                <div className="text-center">
                  <Button
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-50"
                    onClick={() => window.open('https://www.facebook.com/StartupgrindCAI/', '_blank')}
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Follow Startup Grind
                  </Button>
                </div>
              </CardContent>
            </Card>
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
                  <p className="text-xs text-muted-foreground">NAWAH will select outstanding Master's and PhD projects for full scientific incubation support — mentorship, resources, and a pathway to real-world application.</p>
                </CardDescription>
              </CardContent>
              <CardContent className="pt-0">
                <a href="https://www.linkedin.com/company/nawah-scientific/?originalSubdomain=eg" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-green-600 hover:text-green-800 font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  Follow NAWAH on LinkedIn
                </a>
              </CardContent>
            </Card>

            {/* AI بالعربي */}
            <Card className="border-2 border-violet-200 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4 h-44 items-center">
                  <img
                    src="https://files.manuscdn.com/user_upload_by_module/session_file/118031311/KlrhKxhzNQOHAlor.jpeg"
                    alt="AI بالعربي"
                    className="h-40 object-contain"
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
              <CardContent className="pt-0">
                <a href="https://www.linkedin.com/company/ai-بالعربي/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-violet-600 hover:text-violet-800 font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  Follow AI بالعربي on LinkedIn
                </a>
              </CardContent>
            </Card>

            {/* MARC */}
            <Card className="border-2 border-blue-200 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4 h-44 items-center">
                  <img
                    src="https://files.manuscdn.com/user_upload_by_module/session_file/118031311/VulsiXaRGfrttVQf.png"
                    alt="MARC"
                    className="h-40 object-contain"
                  />
                </div>
                <CardTitle className="text-xl text-blue-700">MARC</CardTitle>
                <CardDescription className="text-xs font-medium text-muted-foreground">Award Sponsor · راعي الجوائز</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Best Poster Cash Prizes */}
                <CardDescription className="text-sm space-y-2">
                  <p className="font-semibold text-blue-700">🏆 Best Poster Award — Cash Prizes</p>
                  <p className="text-xs" dir="rtl">جوائز نقدية لأفضل الملصقات العلمية</p>
                </CardDescription>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-amber-50 border border-amber-200 rounded p-2 text-center">
                    <p className="text-xs text-muted-foreground">1st Place</p>
                    <p className="text-sm font-bold text-amber-600">2,500 EGP</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded p-2 text-center">
                    <p className="text-xs text-muted-foreground">2nd Place</p>
                    <p className="text-sm font-bold text-slate-500">1,500 EGP</p>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded p-2 text-center">
                    <p className="text-xs text-muted-foreground">3rd Place</p>
                    <p className="text-sm font-bold text-orange-700">1,000 EGP</p>
                  </div>
                </div>
                {/* Training Opportunities */}
                <div className="border-t border-blue-100 pt-3">
                  <CardDescription className="text-sm space-y-1">
                    <p className="font-semibold text-blue-700">🎓 2 Professional Training Opportunities</p>
                    <p className="text-xs" dir="rtl">فرصتا تدريب متخصصتان</p>
                    <p className="text-xs text-muted-foreground pt-1">MARC will select 2 outstanding participants for a professional training opportunity at their facility.</p>
                  </CardDescription>
                </div>
              </CardContent>
              <CardContent className="pt-0">
                <a href="https://www.linkedin.com/company/marcresearch/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  Follow MARC on LinkedIn
                </a>
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
              </CardContent>              <CardContent className="pt-0">
                <a href="https://www.linkedin.com/company/minapharm-pharmaceuticals/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-pink-600 hover:text-pink-800 font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  Follow Mina Pharm on LinkedIn
                </a>
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
                  <p className="font-semibold text-emerald-700">🎁 4 Gift Bags Containing Free Sample Kits</p>
                  <p dir="rtl">٤ حقائب هدايا تحتوي على مجموعات عينات مجانية</p>
                  <p className="text-xs text-muted-foreground">4 gift bags containing free professional sample kits for 4 prize winners — direct access to cutting-edge scientific tools.</p>
                </CardDescription>
              </CardContent>
              <CardContent className="pt-0">
                <a href="https://www.linkedin.com/company/agitech-egypt/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-800 font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  Follow Agitech on LinkedIn
                </a>
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
              <CardContent className="pt-0">
                <a href="https://www.linkedin.com/company/medsolme/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-teal-600 hover:text-teal-800 font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  Follow Medsol on LinkedIn
                </a>
              </CardContent>
            </Card>

            {/* Startup Grind */}
            <Card className="border-2 border-red-200 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4 h-32 items-center">
                  <img
                    src="https://d2xsxph8kpxj0f.cloudfront.net/118031311/BK5ELr97meyN2f7P5B76DF/download(2)_577d8ace.png"
                    alt="Startup Grind"
                    className="h-28 object-contain"
                  />
                </div>
                <CardTitle className="text-xl text-red-700">Startup Grind</CardTitle>
                <CardDescription className="text-xs font-medium text-muted-foreground">Community Partner · شريك مجتمعي</CardDescription>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm space-y-2">
                  <p className="font-semibold text-red-700">🚀 Student Project Selection & Support</p>
                  <p>اختيار ودعم مشاريع الطلاب في الذكاء الاصطناعي والمعلوماتية الحيوية</p>
                  <p className="text-xs text-muted-foreground">Startup Grind will select outstanding student projects in AI, Machine Learning & Bioinformatics and provide mentorship, networking, and entrepreneurial support.</p>
                </CardDescription>
              </CardContent>
              <CardContent className="pt-0">
                <a href="https://www.linkedin.com/company/startup-grind/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-800 font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  Follow Startup Grind on LinkedIn
                </a>
              </CardContent>
            </Card>

            {/* Colors Educational Hub */}
            <Card className="border-2 border-indigo-200 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4 h-32 items-center">
                  <img
                    src="https://d2xsxph8kpxj0f.cloudfront.net/118031311/BK5ELr97meyN2f7P5B76DF/logo_colors_52f6762b.png"
                    alt="Colors Educational Hub"
                    className="h-28 object-contain"
                  />
                </div>
                <CardTitle className="text-xl text-indigo-700">Colors Educational Hub</CardTitle>
                <CardDescription className="text-xs font-medium text-muted-foreground">Award Sponsor · راعي الجوائز</CardDescription>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm space-y-3">
                  <p className="font-semibold text-indigo-700">🎓 Internship Training Awards</p>
                  <p className="text-xs" dir="rtl">جوائز التدريب المتخصص — يختار Colors Educational Hub الفائزين بناءً على تقييمهم</p>
                  <div className="space-y-2 pt-1">
                    <div className="bg-indigo-50 border border-indigo-200 rounded p-2">
                      <p className="text-xs text-muted-foreground">🏆 1st Award</p>
                      <p className="text-sm font-bold text-indigo-700">Best Graduation Project</p>
                      <p className="text-xs text-indigo-600">أفضل مشروع تخرج</p>
                      <p className="text-xs text-muted-foreground mt-1">1 internship training spot at Colors Educational Hub</p>
                      <p className="text-xs text-muted-foreground" dir="rtl">فرصة تدريب متخصصة في Colors Educational Hub</p>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded p-2">
                      <p className="text-xs text-muted-foreground">🏅 2nd &amp; 3rd Awards</p>
                      <p className="text-sm font-bold text-purple-700">Best Master's Projects</p>
                      <p className="text-xs text-purple-600">أفضل مشروعَي ماجستير</p>
                      <p className="text-xs text-muted-foreground mt-1">2 internship training spots at Colors Educational Hub</p>
                      <p className="text-xs text-muted-foreground" dir="rtl">فرصتا تدريب متخصصتان في Colors Educational Hub</p>
                    </div>
                  </div>
                </CardDescription>
              </CardContent>
              <CardContent className="pt-0">
                <a href="https://www.linkedin.com/company/colors-educational-hub/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  Follow Colors Educational Hub on LinkedIn
                </a>
              </CardContent>
            </Card>

            {/* Chitosan */}
            <Card className="border-2 border-teal-200 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4 h-32 items-center">
                  <img
                    src="https://d2xsxph8kpxj0f.cloudfront.net/118031311/BK5ELr97meyN2f7P5B76DF/pasted_file_t1mp8m_image_bbedca70.png"
                    alt="Chitosan"
                    className="h-28 object-contain"
                  />
                </div>
                <CardTitle className="text-xl text-teal-700">Chitosan</CardTitle>
                <CardDescription className="text-xs font-medium text-muted-foreground">In-Kind Sponsor · راعي عيني</CardDescription>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm space-y-2">
                  <p className="font-semibold text-teal-700">🧪 Chitosan Supply + Technical Support</p>
                  <p dir="rtl">توريد كيتوسان ودعم تقني لمشروع واحد في التغليف الحيوي أو المعالجة الحيوية</p>
                  <div className="bg-teal-50 border border-teal-200 rounded p-2 mt-2">
                    <p className="text-xs font-semibold text-teal-700">🏆 1 Project Selected</p>
                    <p className="text-xs text-muted-foreground mt-1">Chitosan will supply the winning team with chitosan material and provide full technical support. The project will be tested on fruit samples to demonstrate real-world impact.</p>
                    <p className="text-xs text-muted-foreground mt-1" dir="rtl">سيحصل الفريق الفائز على كمية من مادة الكيتوسان ودعم تقني كامل، ويُطبَّق المشروع على عينات من الثمار والفاكهة.</p>
                  </div>
                </CardDescription>
              </CardContent>
              <CardContent className="pt-0">
                <a href="https://www.linkedin.com/in/chitosan-egypt/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-teal-600 hover:text-teal-800 font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  Follow Chitosan on LinkedIn
                </a>
              </CardContent>
            </Card>

            {/* GEnoEra Technology */}
            <Card className="border-2 border-violet-200 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4 h-44 items-center">
                  <img
                    src="https://d2xsxph8kpxj0f.cloudfront.net/118031311/BK5ELr97meyN2f7P5B76DF/ge_logo-1_c2bdf8df.png"
                    alt="GEnoEra Technology"
                    className="h-40 object-contain"
                  />
                </div>
                <CardTitle className="text-xl text-violet-700">GEnoEra Technology</CardTitle>
                <CardDescription className="text-xs font-medium text-muted-foreground">In-Kind Sponsor · راعي عيني</CardDescription>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm space-y-2">
                  <p className="font-semibold text-violet-700">🧬 7 Molecular Biology Prize Bags</p>
                  <p dir="rtl">٧ حقائب للبيولوجيا الجزيئية كجوائز</p>
                  <div className="bg-violet-50 border border-violet-200 rounded p-2 mt-2">
                    <p className="text-xs font-semibold text-violet-700">🏆 4 DNA/PCR Bags + 3 RNA/cDNA/qPCR Bags</p>
                    <p className="text-xs text-muted-foreground mt-1">4 bags: DNA Extraction Kit + PCR Master Mix. 3 bags: RNA Extraction Kit + cDNA Synthesis Kit + qPCR Master Mix.</p>
                    <p className="text-xs text-muted-foreground mt-1" dir="rtl">٤ حقائب: كيت استخلاص DNA + خليط PCR الجاهز. ٣ حقائب: كيت استخلاص RNA + كيت تخليق cDNA + خليط qPCR الجاهز.</p>
                  </div>
                </CardDescription>
              </CardContent>
              <CardContent className="pt-0">
                <a href="https://www.linkedin.com/company/geno-era-technology/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-violet-600 hover:text-violet-800 font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  Follow GEnoEra on LinkedIn
                </a>
              </CardContent>
            </Card>

            {/* EgCompBio */}
            <Card className="border-2 border-teal-200 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4 h-44 items-center">
                  <img
                    src="/images/logo_egcompbio.png"
                    alt="EgCompBio"
                    className="h-40 object-contain"
                  />
                </div>
                <CardTitle className="text-xl text-teal-700">EgCompBio</CardTitle>
                <CardDescription className="text-xs font-medium text-muted-foreground">Award Sponsor · راعي الجوائز</CardDescription>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm space-y-2">
                  <p className="font-semibold text-teal-700">🏆 1 Free Course for 1 Outstanding Student</p>
                  <p dir="rtl">كورس مجاني كامل لطالب متميز واحد</p>
                  <div className="bg-teal-50 border border-teal-200 rounded p-2 mt-2">
                    <p className="text-xs font-semibold text-teal-700">🧬 EgCompBio Training Catalog</p>
                    <p className="text-xs text-muted-foreground mt-1">EgCompBio — the Egyptian Computational Biology Society — is sponsoring 1 full free course from their training catalog for 1 outstanding student participant at SCI 2026, covering cutting-edge topics in computational biology, bioinformatics, and single-cell genomics.</p>
                    <p className="text-xs text-muted-foreground mt-1" dir="rtl">تتبرع الجمعية المصرية للبيولوجيا الحسابية EgCompBio بكورس مجاني كامل من كتالوجها التدريبي لطالب متميز واحد من مشاركي SCI 2026، يغطي أحدث موضوعات البيولوجيا الحسابية والمعلوماتية الحيوية وجينوميات الخلية المفردة.</p>
                  </div>
                </CardDescription>
              </CardContent>
              <CardContent className="pt-0">
                <a href="https://www.linkedin.com/company/egcompbio/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-teal-600 hover:text-teal-800 font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  Follow EgCompBio on LinkedIn
                </a>
              </CardContent>
            </Card>

            {/* Plasma */}
            <Card className="border-2 border-blue-200 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4 h-44 items-center">
                  <img
                    src="https://d2xsxph8kpxj0f.cloudfront.net/118031311/BK5ELr97meyN2f7P5B76DF/logo-2_953b35eb.jpeg"
                    alt="Plasma"
                    className="h-40 object-contain"
                  />
                </div>
                <CardTitle className="text-xl text-blue-700">Plasma</CardTitle>
                <CardDescription className="text-xs font-medium text-muted-foreground">Award Sponsor · راعي الجوائز</CardDescription>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm space-y-2">
                  <p className="font-semibold text-blue-700">🏆 Internship + Full Research Funding + Lab Support + Conference Gifts</p>
                  <p dir="rtl">إنترنشيب + تمويل بحثي كامل + دعم معملي + توزيع هدايا يوم المؤتمر</p>
                  <div className="bg-blue-50 border border-blue-200 rounded p-2 mt-2 space-y-2">
                    <div>
                      <p className="text-xs font-semibold text-blue-700">👤 1. Internship Opportunities</p>
                      <p className="text-xs text-muted-foreground mt-1">Plasma will provide internship opportunities for selected graduation project students, with hands-on training delivered by Plasma's specialized team.</p>
                      <p className="text-xs text-muted-foreground mt-1" dir="rtl">ستوفر Plasma فرص إنترنشيب لطلاب مشاريع التخرج المختارين، مع تدريب عملي متخصص من فريق Plasma.</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-blue-700">💰 2. Full Research Funding</p>
                      <p className="text-xs text-muted-foreground mt-1">Plasma will select one outstanding applied research project and provide full financial support from A to Z — covering all research needs from start to finish.</p>
                      <p className="text-xs text-muted-foreground mt-1" dir="rtl">ستختار Plasma مشروعًا بحثيًا تطبيقيًا واحدًا متميزًا وتوفر له دعمًا ماليًا كاملاً من الألف للياء — يغطي جميع احتياجات البحث من البداية حتى النهاية.</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-blue-700">🧪 3. Lab Contribution & Resources</p>
                      <p className="text-xs text-muted-foreground mt-1">For projects that require experimental work, Plasma will contribute lab resources and support through what is available in their laboratories.</p>
                      <p className="text-xs text-muted-foreground mt-1" dir="rtl">للمشاريع التي تحتاج إلى عمل تجريبي، ستساهم Plasma بموارد ودعم معملي من خلال ما هو متاح في معاملها.</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-blue-700">🎁 4. Gift Distribution on Conference Day</p>
                      <p className="text-xs text-muted-foreground mt-1">Plasma will distribute gifts to conference attendees on the day of the event as a gesture of goodwill and celebration of the scientific community.</p>
                      <p className="text-xs text-muted-foreground mt-1" dir="rtl">ستوزع Plasma هدايا على الحضور يوم المؤتمر كبادرة حسن نية واحتفالاً بالمجتمع العلمي.</p>
                    </div>
                  </div>
                </CardDescription>
              </CardContent>
              <CardContent className="pt-0">
                <a
                  href="https://www.linkedin.com/company/plasma-company/?originalSubdomain=eg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  Follow Plasma on LinkedIn
                </a>
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
                  📧 sci.conf.2026@gmail.com
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
