import { trpc } from "@/lib/trpc";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Loader2, Linkedin, Twitter, Globe, GraduationCap, Building2 } from "lucide-react";
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

export default function KeynoteSpeakers() {
  const { data: speakers, isLoading } = trpc.keynoteSpeakers.list.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const keynoteSpeakersList = speakers?.filter(s => s.speakerType === 'keynote') ?? [];
  const invitedAcademia = speakers?.filter(s => s.speakerType === 'invited' && s.speakerSector !== 'industry') ?? [];
  const invitedIndustry = speakers?.filter(s => s.speakerType === 'invited' && s.speakerSector === 'industry') ?? [];

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
              Keynote & Invited Speakers
            </h1>
            <p className="text-2xl md:text-3xl text-secondary font-semibold" dir="rtl">
              المتحدثون الرئيسيون والمدعوون
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
          {speakers && speakers.length > 0 ? (
            <div className="space-y-16 max-w-5xl mx-auto">

              {/* Keynote Speakers */}
              {keynoteSpeakersList.length > 0 && (
                <div>
                  <h2 className="text-3xl font-bold text-primary mb-2">Keynote Speakers</h2>
                  <p className="text-xl text-secondary font-semibold mb-8" dir="rtl">المتحدثون الرئيسيون</p>
                  <div className="grid gap-8">
                    {keynoteSpeakersList.map((speaker) => (
                      <SpeakerCard key={speaker.id} speaker={speaker} />
                    ))}
                  </div>
                </div>
              )}

              {/* Invited Speakers — Academia & Research */}
              {invitedAcademia.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <GraduationCap className="w-8 h-8 text-primary" />
                    <h2 className="text-3xl font-bold text-primary">Invited Speakers — Academia & Research</h2>
                  </div>
                  <p className="text-xl text-secondary font-semibold mb-8" dir="rtl">المتحدثون المدعوون — الأكاديميون والباحثون</p>
                  <div className="grid gap-8">
                    {invitedAcademia.map((speaker) => (
                      <SpeakerCard key={speaker.id} speaker={speaker} />
                    ))}
                  </div>
                </div>
              )}

              {/* Invited Speakers — Industry */}
              {invitedIndustry.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Building2 className="w-8 h-8 text-primary" />
                    <h2 className="text-3xl font-bold text-primary">Invited Speakers — Industry</h2>
                  </div>
                  <p className="text-xl text-secondary font-semibold mb-8" dir="rtl">المتحدثون المدعوون — القطاع الصناعي والريادي</p>

                  {/* Startup Grind special highlight */}
                  {invitedIndustry.some(s => s.fullName.toLowerCase().includes('startup grind')) && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-xl">
                      <p className="text-sm font-semibold text-primary mb-1">🚀 Student Project Support Initiative</p>
                      <p className="text-sm text-muted-foreground">
                        Startup Grind Cairo will review and select outstanding undergraduate and postgraduate student projects in
                        <strong> AI, Machine Learning, and Bioinformatics</strong>, providing mentorship, networking, and entrepreneurial support to the selected teams.
                      </p>
                    </div>
                  )}

                  <div className="grid gap-8">
                    {invitedIndustry.map((speaker) => (
                      <SpeakerCard key={speaker.id} speaker={speaker} />
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No keynote speakers announced yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
