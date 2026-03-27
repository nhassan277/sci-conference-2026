import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, ChevronUp, BookOpen, User, Building2, Download } from "lucide-react";


type Speaker = {
  id: number;
  fullName: string;
  title: string;
  affiliation: string;
  presentationTitle: string;
  presentationTitleAr?: string | null;
  presentationAbstract?: string | null;
  bio?: string | null;
  photoUrl?: string | null;
  displayOrder: number;
  isVisible: boolean;
  speakerType: string;
  speakerSector: string;
};

const SECTOR_LABELS: Record<string, string> = {
  academia: "Academia",
  industry: "Industry",
  government: "Government",
  international: "International",
};

const SECTOR_COLORS: Record<string, string> = {
  academia: "bg-blue-100 text-blue-800 border-blue-200",
  industry: "bg-amber-100 text-amber-800 border-amber-200",
  government: "bg-green-100 text-green-800 border-green-200",
  international: "bg-purple-100 text-purple-800 border-purple-200",
};

export default function Abstracts() {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [sectorFilter, setSectorFilter] = useState<string>("all");
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch("/api/abstracts/export-pdf");
      if (!response.ok) throw new Error("Failed to generate PDF");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "SCI2026_Book_of_Abstracts.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const { data: allSpeakers, isLoading } = trpc.keynoteSpeakers.list.useQuery();

  const allSpeakersList: Speaker[] = (allSpeakers as Speaker[]) || [];
  const withAbstracts: Speaker[] = allSpeakersList.filter(
    (s) => s.presentationAbstract && s.presentationAbstract.trim().length > 0
  );

  const sectors = Array.from(new Set(allSpeakersList.map((s) => s.speakerSector || "academia")));

  const filtered = allSpeakersList.filter((s) => {
    const matchesSector = sectorFilter === "all" || (s.speakerSector || "academia") === sectorFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      s.fullName.toLowerCase().includes(q) ||
      (s.presentationTitle || "").toLowerCase().includes(q) ||
      (s.presentationAbstract || "").toLowerCase().includes(q) ||
      (s.affiliation || "").toLowerCase().includes(q);
    return matchesSector && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FCF8EE]">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <img src="/images/logo_faculty_science.jpeg" alt="Faculty of Science" className="h-16 object-contain" />
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-primary">SCI 2026</h1>
                <p className="text-sm text-muted-foreground">Faculty of Science</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-4 text-sm">
              <a href="/" className="hover:text-primary transition-colors">Home</a>
              <a href="/speakers" className="hover:text-primary transition-colors">Speakers</a>
              <a href="/schedule" className="hover:text-primary transition-colors">Schedule</a>
              <a href="/abstracts" className="font-semibold text-primary">Abstracts</a>
              <a href="/awards" className="hover:text-primary transition-colors">Awards</a>
            </nav>
            <img src="/images/logo_pioneers.png" alt="Pioneers in Science" className="h-16 object-contain" />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#41081A] to-[#641428] py-14 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center mb-4">
            <BookOpen className="w-12 h-12 text-[#F0D264]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#F0D264] mb-3">Book of Abstracts</h1>
          <p className="text-xl text-white/80 mb-2">كتاب الملخصات — SCI 2026</p>
          <p className="text-white/60 text-sm">
            Science at the Core of Innovation · April 7–8, 2026 · Cairo University
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/40 rounded-full px-4 py-1.5 text-[#F0D264] text-sm">
              <BookOpen className="w-4 h-4" />
              <span>{withAbstracts.length} Abstracts Available · {allSpeakersList.length} Total Speakers</span>
            </div>
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#c9a227] disabled:opacity-60 disabled:cursor-not-allowed text-[#41081A] font-bold rounded-full px-5 py-2 text-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              {isDownloading ? "Generating PDF…" : "Download Book of Abstracts"}
            </button>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="container py-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by speaker, title, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white border-[#D4AF37]/40 focus:border-[#D4AF37]"
            />
          </div>
          {/* Sector filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={sectorFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSectorFilter("all")}
              className={sectorFilter === "all" ? "bg-[#641428] hover:bg-[#41081A] text-white" : ""}
            >
              All ({allSpeakersList.length})
            </Button>
            {sectors.map((sec) => (
              <Button
                key={sec}
                variant={sectorFilter === sec ? "default" : "outline"}
                size="sm"
                onClick={() => setSectorFilter(sec)}
                className={sectorFilter === sec ? "bg-[#641428] hover:bg-[#41081A] text-white" : ""}
              >
                {SECTOR_LABELS[sec] || sec} ({allSpeakersList.filter((s) => (s.speakerSector || "academia") === sec).length})
              </Button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mt-3">
          Showing {filtered.length} of {allSpeakersList.length} speakers
          {search && <span> matching "<strong>{search}</strong>"</span>}
        </p>
      </div>

      {/* Abstracts List */}
      <div className="container pb-16">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-[#D4AF37]/20 p-6 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-100 rounded w-1/2 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-full mb-1" />
                <div className="h-3 bg-gray-100 rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No abstracts found matching your search.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((speaker, idx) => {
              const isExpanded = expandedId === speaker.id;
              const sector = speaker.speakerSector || "academia";
              const hasAbstract = !!(speaker.presentationAbstract && speaker.presentationAbstract.trim().length > 0);
              const abstract = speaker.presentationAbstract || "";
              const preview = abstract.length > 300 ? abstract.slice(0, 300) + "…" : abstract;

              return (
                <div
                  key={speaker.id}
                  className="bg-white rounded-lg border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 hover:shadow-md transition-all overflow-hidden"
                >
                  {/* Abstract header */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Abstract number + sector */}
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="text-xs font-mono text-muted-foreground bg-gray-100 px-2 py-0.5 rounded">
                            #{String(idx + 1).padStart(3, "0")}
                          </span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded border ${SECTOR_COLORS[sector] || SECTOR_COLORS.academia}`}>
                            {SECTOR_LABELS[sector] || sector}
                          </span>
                          {speaker.speakerType && speaker.speakerType !== "keynote" && (
                            <Badge variant="outline" className="text-xs capitalize">
                              {speaker.speakerType}
                            </Badge>
                          )}
                        </div>

                        {/* Presentation title */}
                        <h3 className="text-base font-bold text-[#41081A] leading-snug mb-2">
                          {speaker.presentationTitle || "Untitled Presentation"}
                        </h3>

                        {/* Speaker info */}
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            <span className="font-medium text-foreground">{speaker.fullName}</span>
                          </span>
                          {speaker.affiliation && (
                            <span className="flex items-center gap-1">
                              <Building2 className="w-3.5 h-3.5" />
                              <span>{speaker.affiliation}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Expand button */}
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : speaker.id)}
                        className="flex-shrink-0 flex items-center gap-1 text-sm text-[#641428] font-medium hover:text-[#41081A] transition-colors mt-1"
                      >
                        {hasAbstract ? (
                        isExpanded ? (
                          <>Hide <ChevronUp className="w-4 h-4" /></>
                        ) : (
                          <>Read <ChevronDown className="w-4 h-4" /></>
                        )
                      ) : null}
                      </button>
                    </div>

                    {/* Abstract preview / full */}
                    <div className="mt-3 text-sm text-gray-700 leading-relaxed">
                      {hasAbstract ? (
                        isExpanded ? (
                          <p className="whitespace-pre-wrap">{abstract}</p>
                        ) : (
                          <p>{preview}</p>
                        )
                      ) : (
                        <p className="italic text-muted-foreground">Abstract coming soon — الملخص قيد الإعداد</p>
                      )}
                    </div>
                  </div>

                  {/* Gold bottom accent */}
                  <div className="h-0.5 bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/60 to-[#D4AF37]/0" />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-[#41081A] border-t-4 border-[#D4AF37] py-8 text-center">
        <p className="text-[#F0D264] text-sm">SCI 2026 · Faculty of Science, Cairo University · April 7–8, 2026</p>
        <p className="text-white/50 text-xs mt-1">🌐 sciconf26.website</p>
      </footer>
    </div>
  );
}
