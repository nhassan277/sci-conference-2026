import { useState } from "react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Download, 
  Search,
  Mic,
  Users,
  Presentation,
  Coffee,
  Award
} from "lucide-react";

// Placeholder session data
const sessions = {
  day1: [
    {
      id: 1,
      time: "09:00 - 09:30",
      type: "opening",
      title: "Opening Ceremony & Welcome Address",
      titleAr: "حفل الافتتاح وكلمة الترحيب",
      track: "general",
      location: "Main Hall",
      description: "Official opening of SCI 2026 Conference with welcome addresses from university leadership and conference organizers.",
      speakers: [
        {
          name: "[Speaker Name - TBA]",
          title: "[Title]",
          affiliation: "Cairo University",
          photo: null,
          bio: "Speaker details will be announced soon.",
        }
      ]
    },
    {
      id: 2,
      time: "09:30 - 10:30",
      type: "keynote",
      title: "Keynote: The Future of Scientific Innovation in Egypt",
      titleAr: "محاضرة رئيسية: مستقبل الابتكار العلمي في مصر",
      track: "general",
      location: "Main Hall",
      description: "An inspiring keynote address exploring the role of science in driving innovation and economic development in Egypt.",
      speakers: [
        {
          name: "[Keynote Speaker - TBA]",
          title: "[Distinguished Professor/Researcher]",
          affiliation: "[Institution]",
          photo: null,
          bio: "Keynote speaker details will be announced soon.",
        }
      ]
    },
    {
      id: 3,
      time: "10:30 - 11:00",
      type: "break",
      title: "Coffee Break & Networking",
      titleAr: "استراحة قهوة وتواصل",
      track: "general",
      location: "Conference Foyer",
      description: "Refreshments and networking opportunity.",
      speakers: []
    },
    {
      id: 4,
      time: "11:00 - 13:00",
      type: "research",
      title: "Research Session: Life Sciences & Biotechnology",
      titleAr: "جلسة بحثية: علوم الحياة والتكنولوجيا الحيوية",
      track: "life-sciences",
      location: "Hall A",
      description: "Presentations on cutting-edge research in biology, biotechnology, microbiology, and genetics.",
      speakers: [
        {
          name: "[Session Chair - TBA]",
          title: "[Professor]",
          affiliation: "[University]",
          photo: null,
          bio: "Session chair and presenter details will be announced soon.",
        }
      ]
    },
    {
      id: 5,
      time: "11:00 - 13:00",
      type: "research",
      title: "Research Session: Physical Sciences & Materials",
      titleAr: "جلسة بحثية: العلوم الفيزيائية والمواد",
      track: "physical-sciences",
      location: "Hall B",
      description: "Latest research in physics, chemistry, and materials science.",
      speakers: [
        {
          name: "[Session Chair - TBA]",
          title: "[Professor]",
          affiliation: "[University]",
          photo: null,
          bio: "Session chair and presenter details will be announced soon.",
        }
      ]
    },
    {
      id: 6,
      time: "13:00 - 14:00",
      type: "break",
      title: "Lunch Break",
      titleAr: "استراحة الغداء",
      track: "general",
      location: "Conference Foyer",
      description: "Lunch and informal networking.",
      speakers: []
    },
    {
      id: 7,
      time: "14:00 - 16:00",
      type: "workshop",
      title: "Workshop: Advanced Research Methodologies",
      titleAr: "ورشة عمل: منهجيات البحث المتقدمة",
      track: "interdisciplinary",
      location: "Workshop Room 1",
      description: "Hands-on workshop by NAWAH Scientific on modern research techniques and methodologies.",
      speakers: [
        {
          name: "[Workshop Facilitator - TBA]",
          title: "[Expert]",
          affiliation: "NAWAH Scientific",
          photo: null,
          bio: "Workshop facilitator details will be announced soon.",
        }
      ]
    },
    {
      id: 8,
      time: "14:00 - 16:00",
      type: "panel",
      title: "Panel Discussion: University-Industry Partnerships",
      titleAr: "نقاش جماعي: الشراكات بين الجامعات والصناعة",
      track: "general",
      location: "Hall A",
      description: "Expert panel discussing strategies for building effective partnerships between academia and industry.",
      speakers: [
        {
          name: "[Panelist 1 - TBA]",
          title: "[Industry Leader]",
          affiliation: "[Company]",
          photo: null,
          bio: "Panelist details will be announced soon.",
        },
        {
          name: "[Panelist 2 - TBA]",
          title: "[Academic Leader]",
          affiliation: "[University]",
          photo: null,
          bio: "Panelist details will be announced soon.",
        }
      ]
    },
    {
      id: 9,
      time: "16:00 - 16:30",
      type: "break",
      title: "Afternoon Coffee Break",
      titleAr: "استراحة قهوة المساء",
      track: "general",
      location: "Conference Foyer",
      description: "Refreshments and networking.",
      speakers: []
    },
    {
      id: 10,
      time: "16:30 - 18:00",
      type: "research",
      title: "Research Session: AI & Data Science",
      titleAr: "جلسة بحثية: الذكاء الاصطناعي وعلوم البيانات",
      track: "computational",
      location: "Hall A",
      description: "Presentations on artificial intelligence, machine learning, and data science applications.",
      speakers: [
        {
          name: "[Session Chair - TBA]",
          title: "[Professor]",
          affiliation: "[University]",
          photo: null,
          bio: "Session chair and presenter details will be announced soon.",
        }
      ]
    }
  ],
  day2: [
    {
      id: 11,
      time: "09:00 - 10:00",
      type: "keynote",
      title: "Keynote: Sustainable Development through Science",
      titleAr: "محاضرة رئيسية: التنمية المستدامة من خلال العلوم",
      track: "environmental",
      location: "Main Hall",
      description: "Exploring the role of scientific research in achieving sustainable development goals.",
      speakers: [
        {
          name: "[Keynote Speaker - TBA]",
          title: "[Distinguished Scientist]",
          affiliation: "[Institution]",
          photo: null,
          bio: "Keynote speaker details will be announced soon.",
        }
      ]
    },
    {
      id: 12,
      time: "10:00 - 10:30",
      type: "break",
      title: "Coffee Break",
      titleAr: "استراحة قهوة",
      track: "general",
      location: "Conference Foyer",
      description: "Morning refreshments.",
      speakers: []
    },
    {
      id: 13,
      time: "10:30 - 12:30",
      type: "research",
      title: "Research Session: Environmental Sciences & Sustainability",
      titleAr: "جلسة بحثية: العلوم البيئية والاستدامة",
      track: "environmental",
      location: "Hall A",
      description: "Research presentations on environmental science, climate change, and sustainability.",
      speakers: [
        {
          name: "[Session Chair - TBA]",
          title: "[Professor]",
          affiliation: "[University]",
          photo: null,
          bio: "Session chair and presenter details will be announced soon.",
        }
      ]
    },
    {
      id: 14,
      time: "10:30 - 12:30",
      type: "research",
      title: "Research Session: Medical & Health Sciences",
      titleAr: "جلسة بحثية: العلوم الطبية والصحية",
      track: "medical",
      location: "Hall B",
      description: "Latest research in biochemistry, pharmacology, and medical physics.",
      speakers: [
        {
          name: "[Session Chair - TBA]",
          title: "[Professor]",
          affiliation: "[University]",
          photo: null,
          bio: "Session chair and presenter details will be announced soon.",
        }
      ]
    },
    {
      id: 15,
      time: "12:30 - 13:30",
      type: "break",
      title: "Lunch Break",
      titleAr: "استراحة الغداء",
      track: "general",
      location: "Conference Foyer",
      description: "Lunch and networking.",
      speakers: []
    },
    {
      id: 16,
      time: "13:30 - 15:30",
      type: "workshop",
      title: "Workshop: Scientific Writing & Publication",
      titleAr: "ورشة عمل: الكتابة العلمية والنشر",
      track: "interdisciplinary",
      location: "Workshop Room 1",
      description: "Practical workshop on writing and publishing scientific research papers.",
      speakers: [
        {
          name: "[Workshop Facilitator - TBA]",
          title: "[Expert]",
          affiliation: "NAWAH Scientific",
          photo: null,
          bio: "Workshop facilitator details will be announced soon.",
        }
      ]
    },
    {
      id: 17,
      time: "13:30 - 15:30",
      type: "research",
      title: "Research Session: Interdisciplinary & Emerging Fields",
      titleAr: "جلسة بحثية: المجالات البينية والناشئة",
      track: "interdisciplinary",
      location: "Hall A",
      description: "Presentations on space science, forensics, and other emerging fields.",
      speakers: [
        {
          name: "[Session Chair - TBA]",
          title: "[Professor]",
          affiliation: "[University]",
          photo: null,
          bio: "Session chair and presenter details will be announced soon.",
        }
      ]
    },
    {
      id: 18,
      time: "15:30 - 16:00",
      type: "break",
      title: "Afternoon Coffee Break",
      titleAr: "استراحة قهوة المساء",
      track: "general",
      location: "Conference Foyer",
      description: "Final networking break.",
      speakers: []
    },
    {
      id: 19,
      time: "16:00 - 17:00",
      type: "awards",
      title: "Awards Ceremony & Best Paper Presentations",
      titleAr: "حفل توزيع الجوائز وعرض أفضل الأبحاث",
      track: "general",
      location: "Main Hall",
      description: "Recognition of outstanding research presentations and conference awards.",
      speakers: []
    },
    {
      id: 20,
      time: "17:00 - 17:30",
      type: "closing",
      title: "Closing Ceremony",
      titleAr: "حفل الختام",
      track: "general",
      location: "Main Hall",
      description: "Official closing of SCI 2026 Conference with closing remarks and future outlook.",
      speakers: [
        {
          name: "[Conference Chair - TBA]",
          title: "[Professor]",
          affiliation: "Cairo University",
          photo: null,
          bio: "Closing remarks by conference organizers.",
        }
      ]
    }
  ]
};

const tracks = [
  { value: "all", label: "All Tracks", labelAr: "جميع المسارات" },
  { value: "general", label: "General", labelAr: "عام" },
  { value: "life-sciences", label: "Life Sciences", labelAr: "علوم الحياة" },
  { value: "physical-sciences", label: "Physical Sciences", labelAr: "العلوم الفيزيائية" },
  { value: "chemical-sciences", label: "Chemical Sciences", labelAr: "العلوم الكيميائية" },
  { value: "geoscience", label: "Geoscience and Earth Systems", labelAr: "علوم الأرض وأنظمة الأرض" },
  { value: "computational", label: "Computational Sciences", labelAr: "العلوم الحاسوبية" },
  { value: "medical", label: "Medical Sciences", labelAr: "العلوم الطبية" },
  { value: "interdisciplinary", label: "Interdisciplinary", labelAr: "متعدد التخصصات" },
  { value: "advanced-materials", label: "Advanced Materials Science", labelAr: "علوم المواد المتقدمة" },
];

const sessionTypeIcons = {
  keynote: Mic,
  research: Presentation,
  workshop: Users,
  panel: Users,
  break: Coffee,
  opening: Award,
  closing: Award,
  awards: Award,
};

const sessionTypeColors = {
  keynote: "bg-purple-100 text-purple-700 border-purple-300",
  research: "bg-blue-100 text-blue-700 border-blue-300",
  workshop: "bg-green-100 text-green-700 border-green-300",
  panel: "bg-orange-100 text-orange-700 border-orange-300",
  break: "bg-gray-100 text-gray-700 border-gray-300",
  opening: "bg-yellow-100 text-yellow-700 border-yellow-300",
  closing: "bg-yellow-100 text-yellow-700 border-yellow-300",
  awards: "bg-yellow-100 text-yellow-700 border-yellow-300",
};

export default function Schedule() {
  const [searchTerm, setSearchTerm] = useState("");
  const [trackFilter, setTrackFilter] = useState("all");

  const filterSessions = (daySessions: typeof sessions.day1) => {
    return daySessions.filter((session) => {
      const matchesSearch =
        session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.titleAr.includes(searchTerm) ||
        session.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTrack = trackFilter === "all" || session.track === trackFilter;

      return matchesSearch && matchesTrack;
    });
  };

  const handleAddToCalendar = (session: typeof sessions.day1[0], day: string) => {
    const date = day === "day1" ? "2026-04-07" : "2026-04-08";
    const [startTime] = session.time.split(" - ");
    const [hours, minutes] = startTime.split(":");
    
    const startDate = new Date(`${date}T${hours}:${minutes}:00`);
    const endDate = new Date(startDate.getTime() + 90 * 60000); // Default 90 min duration

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SCI 2026//Conference//EN
BEGIN:VEVENT
UID:${session.id}@sciconf26.website
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:${session.title}
DESCRIPTION:${session.description}
LOCATION:${session.location}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `sci2026-${session.id}.ics`;
    link.click();
  };

  const handleDownloadPDF = () => {
    alert("PDF export functionality will generate a complete schedule PDF. This feature requires server-side PDF generation which will be implemented in the next phase.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">Conference Schedule</h1>
              <p className="text-muted-foreground">April 7-8, 2026 | Cairo University</p>
            </div>
            <Button onClick={handleDownloadPDF} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filter Sessions</CardTitle>
            <CardDescription>Search and filter by track to find sessions of interest</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[250px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search sessions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={trackFilter} onValueChange={setTrackFilter}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Filter by track" />
                </SelectTrigger>
                <SelectContent>
                  {tracks.map((track) => (
                    <SelectItem key={track.value} value={track.value}>
                      {track.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Tabs */}
        <Tabs defaultValue="day1" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="day1">
              <Calendar className="w-4 h-4 mr-2" />
              Day 1 - April 7
            </TabsTrigger>
            <TabsTrigger value="day2">
              <Calendar className="w-4 h-4 mr-2" />
              Day 2 - April 8
            </TabsTrigger>
          </TabsList>

          {/* Day 1 */}
          <TabsContent value="day1" className="space-y-4">
            {filterSessions(sessions.day1).map((session) => {
              const Icon = sessionTypeIcons[session.type as keyof typeof sessionTypeIcons];
              const colorClass = sessionTypeColors[session.type as keyof typeof sessionTypeColors];

              return (
                <Card key={session.id} className={`border-l-4 ${colorClass}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className="w-5 h-5" />
                          <Badge variant="outline" className={colorClass}>
                            {session.type}
                          </Badge>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="w-4 h-4 mr-1" />
                            {session.time}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4 mr-1" />
                            {session.location}
                          </div>
                        </div>
                        <CardTitle className="text-xl mb-1">{session.title}</CardTitle>
                        <CardDescription className="text-base" dir="rtl">
                          {session.titleAr}
                        </CardDescription>
                      </div>
                      {session.type !== "break" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddToCalendar(session, "day1")}
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Add to Calendar
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{session.description}</p>

                    {session.speakers.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-semibold flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Speakers
                        </h4>
                        <div className="grid gap-3">
                          {session.speakers.map((speaker, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg"
                            >
                              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                <User className="w-8 h-8 text-muted-foreground" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{speaker.name}</p>
                                <p className="text-sm text-muted-foreground">{speaker.title}</p>
                                <p className="text-sm text-muted-foreground">{speaker.affiliation}</p>
                                <p className="text-sm text-muted-foreground mt-1">{speaker.bio}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* Day 2 */}
          <TabsContent value="day2" className="space-y-4">
            {filterSessions(sessions.day2).map((session) => {
              const Icon = sessionTypeIcons[session.type as keyof typeof sessionTypeIcons];
              const colorClass = sessionTypeColors[session.type as keyof typeof sessionTypeColors];

              return (
                <Card key={session.id} className={`border-l-4 ${colorClass}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className="w-5 h-5" />
                          <Badge variant="outline" className={colorClass}>
                            {session.type}
                          </Badge>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="w-4 h-4 mr-1" />
                            {session.time}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4 mr-1" />
                            {session.location}
                          </div>
                        </div>
                        <CardTitle className="text-xl mb-1">{session.title}</CardTitle>
                        <CardDescription className="text-base" dir="rtl">
                          {session.titleAr}
                        </CardDescription>
                      </div>
                      {session.type !== "break" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddToCalendar(session, "day2")}
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Add to Calendar
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{session.description}</p>

                    {session.speakers.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-semibold flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Speakers
                        </h4>
                        <div className="grid gap-3">
                          {session.speakers.map((speaker, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg"
                            >
                              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                <User className="w-8 h-8 text-muted-foreground" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{speaker.name}</p>
                                <p className="text-sm text-muted-foreground">{speaker.title}</p>
                                <p className="text-sm text-muted-foreground">{speaker.affiliation}</p>
                                <p className="text-sm text-muted-foreground mt-1">{speaker.bio}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>

        {/* Note about placeholders */}
        <Card className="mt-8 border-dashed border-2">
          <CardHeader>
            <CardTitle className="text-lg">Note</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Speaker names, photos, and detailed biographies will be updated as they are confirmed. 
              Please check back regularly for updates. For inquiries, contact{" "}
              <a href="mailto:science.faculty.conference2026@gmail.com" className="text-primary hover:underline">
                science.faculty.conference2026@gmail.com
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
