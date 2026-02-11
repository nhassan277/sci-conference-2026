import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, LucideIcon } from "lucide-react";

export interface TrackTopic {
  en: string;
  ar: string;
}

export interface TrackData {
  id: string;
  trackNumber: number;
  icon: LucideIcon;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  color: string;
  bgColor: string;
  borderColor: string;
  topics: TrackTopic[];
  exampleQuestions: string[];
  chairName: string;
  chairTitle: string;
  chairEmail: string;
}

interface TrackDetailProps {
  track: TrackData;
}

export default function TrackDetail({ track }: TrackDetailProps) {
  const Icon = track.icon;

  return (
    <div className={`min-h-screen bg-gradient-to-b from-${track.bgColor}-50 to-white`}>
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <img src="/images/logo_cu_new.png" alt="Cairo University" className="h-16 object-contain" />
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
          <div className={`w-24 h-24 rounded-2xl ${track.color} flex items-center justify-center mx-auto mb-6`}>
            <Icon className="w-12 h-12" />
          </div>
          <Badge className={`${track.color} px-4 py-1.5 text-sm font-medium`}>Track {track.trackNumber}</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">{track.title}</h1>
          <p className="text-2xl font-semibold text-secondary" dir="rtl">{track.titleAr}</p>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {track.description}
          </p>
          <p className="text-base text-muted-foreground max-w-3xl mx-auto" dir="rtl">
            {track.descriptionAr}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Research Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Research Topics</CardTitle>
                <CardDescription dir="rtl" className="text-base font-medium">موضوعات البحث</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {track.topics.map((topic, index) => (
                    <div key={index} className={`flex items-start gap-2 p-3 ${track.bgColor}-50 rounded-lg`}>
                      <CheckCircle2 className={`w-5 h-5 text-${track.bgColor}-600 mt-0.5 flex-shrink-0`} />
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
                  {track.exampleQuestions.map((question, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className={`text-${track.bgColor}-600 font-bold text-lg`}>•</span>
                      <span>{question}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* General Submission Information */}
            <Card className={`border-2 ${track.borderColor}`}>
              <CardHeader>
                <CardTitle>General Submission Information</CardTitle>
                <CardDescription dir="rtl" className="font-medium">معلومات التقديم العامة</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  To submit your research abstract for this track, please use the conference registration form.
                </p>
                <p className="text-sm text-muted-foreground" dir="rtl">
                  لتقديم ملخص بحثك لهذا المحور، يرجى استخدام نموذج التسجيل في المؤتمر.
                </p>
                <div className="pt-4 border-t">
                  <a href="https://sciconf26.website/#registration" target="_blank" rel="noopener noreferrer">
                    <Button className={`w-full bg-${track.bgColor}-600 hover:bg-${track.bgColor}-700`}>
                      Register Now | سجل الآن
                    </Button>
                  </a>
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
          </div>
        </div>
      </div>
    </div>
  );
}
