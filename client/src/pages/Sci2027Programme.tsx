import { ArrowLeft, CalendarDays, Clock3, Download, MapPin, Sparkles } from "lucide-react";
import { Link } from "wouter";
import Sci2027Footer from "@/components/Sci2027Footer";
import Sci2027Header from "@/components/Sci2027Header";
import { sci2027Content } from "@/data/sci2027Content";

type ProgrammeSession = { time: string; en: string; ar: string; tone?: "gold" | "blue" | "soft" };

const schedule: Record<string, ProgrammeSession[]> = {
  "7 April 2027": [
    { time: "08:30–09:00", en: "Registration and networking", ar: "التسجيل والتعارف", tone: "soft" },
    { time: "09:00–09:15", en: "Opening address by the Conference Organizing Committee Chair", ar: "كلمة افتتاحية لرئيس اللجنة المنظمة للمؤتمر" },
    { time: "09:15–09:30", en: "Welcome address by the Dean / University representative", ar: "كلمة ترحيب لعميد الكلية / ممثل الجامعة" },
    { time: "09:30–10:30", en: "Main session: two international keynote speakers", ar: "الجلسة الرئيسية: متحدثان رئيسيان دوليان", tone: "gold" },
    { time: "10:30–11:00", en: "Coffee break", ar: "استراحة قهوة", tone: "soft" },
    { time: "11:00–12:00", en: "Public and invited lectures", ar: "محاضرات عامة ومحاضرات مدعوة" },
    { time: "12:00–13:30", en: "Morning scientific sessions across six parallel tracks", ar: "الجلسات العلمية الصباحية في ستة محاور متوازية", tone: "blue" },
    { time: "13:30–14:30", en: "Lunch and networking", ar: "غداء وتعارف", tone: "soft" },
    { time: "14:30–16:00", en: "Afternoon scientific sessions across six parallel tracks", ar: "الجلسات العلمية المسائية في ستة محاور متوازية", tone: "blue" },
    { time: "14:30–17:00", en: "Workshop and training group 1, in parallel", ar: "ورش العمل والدورات التدريبية، المجموعة الأولى بالتوازي", tone: "gold" },
    { time: "16:00–17:00", en: "Scientific poster sessions", ar: "جلسات الملصقات العلمية" },
    { time: "17:00", en: "Optional gala dinner", ar: "عشاء احتفالي اختياري", tone: "soft" },
  ],
  "8 April 2027": [
    { time: "08:30–09:00", en: "Registration and networking", ar: "التسجيل والتعارف", tone: "soft" },
    { time: "09:00–09:15", en: "Opening of day two", ar: "افتتاح اليوم الثاني" },
    { time: "09:15–10:30", en: "Invited-speaker lectures in six parallel halls", ar: "محاضرات المتحدثين المدعوين في ست قاعات متوازية", tone: "gold" },
    { time: "10:30–11:00", en: "Coffee break", ar: "استراحة قهوة", tone: "soft" },
    { time: "11:00–13:30", en: "Morning scientific sessions in six parallel halls", ar: "الجلسات العلمية الصباحية في ست قاعات متوازية", tone: "blue" },
    { time: "13:30–14:30", en: "Lunch and networking", ar: "غداء وتعارف", tone: "soft" },
    { time: "14:30–15:15", en: "Scientific poster sessions", ar: "جلسات الملصقات العلمية" },
    { time: "15:15–16:30", en: "Innovation exhibition and research collaboration forum", ar: "معرض الابتكار ومنتدى التعاون البحثي", tone: "gold" },
    { time: "16:30–16:45", en: "Closing remarks", ar: "كلمات الختام" },
    { time: "16:45–17:00", en: "Closing session: recommendations and partnership announcements", ar: "الجلسة الختامية: إعلان التوصيات والشراكات", tone: "blue" },
  ],
  "9 April 2027": [
    { time: "09:00–13:00", en: "Workshop and training group 2", ar: "ورش العمل والدورات التدريبية، المجموعة الثانية", tone: "gold" },
    { time: "Afternoon", en: "Optional cultural experience: Grand Egyptian Museum visit", ar: "تجربة ثقافية اختيارية: زيارة المتحف المصري الكبير", tone: "soft" },
  ],
};

const toneClass = {
  gold: "border-l-[#d3a725] bg-[#fff8e6]",
  blue: "border-l-[#0d638b] bg-[#edf6fa]",
  soft: "border-l-[#c7d2d7] bg-[#fafbf9]",
};

export default function Sci2027Programme() {
  return (
    <div className="min-h-screen bg-[#fffdf8] text-[#17374f]">
      <Sci2027Header />
      <main>
        <section className="relative overflow-hidden bg-[#063760] text-white">
          <div className="absolute inset-0 sci-network opacity-35" aria-hidden="true" />
          <div className="container relative py-16 md:py-20">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#f0ca57] transition hover:text-white"><ArrowLeft className="h-4 w-4" /> Back to SCI 2027</Link>
            <p className="mt-10 text-xs font-bold uppercase tracking-[0.2em] text-[#f0ca57]">SCI 2027 · preliminary programme</p>
            <h1 className="mt-4 max-w-3xl font-serif text-5xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-6xl">Three days for discovery, dialogue and collaboration.</h1>
            <p dir="rtl" className="mt-5 max-w-2xl text-right text-xl font-bold leading-8 text-[#d5e0e6]">ثلاثة أيام للاكتشاف والحوار والتعاون.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3 border-l-2 border-[#e5bd4a] bg-white/[0.06] px-4 py-3"><CalendarDays className="h-5 w-5 text-[#f0ca57]" /><span className="text-sm font-bold">7–9 April 2027</span></div>
              <div className="flex items-center gap-3 border-l-2 border-[#e5bd4a] bg-white/[0.06] px-4 py-3"><MapPin className="h-5 w-5 text-[#f0ca57]" /><span className="text-sm font-bold">Cairo University Conference Center</span></div>
            </div>
          </div>
        </section>

        <section className="py-8 sm:py-10">
          <div className="container">
            <div className="border-l-4 border-[#d3a725] bg-[#f8f3e7] px-5 py-4 text-sm leading-6 text-[#456374]">
              <strong className="text-[#063760]">Programme status:</strong> this preliminary outline is based on the official SCI 2027 brochure. Speaker names, final hall allocations and detailed workshop logistics will be announced in the final conference programme.
              <p dir="rtl" className="mt-2 text-right">حالة البرنامج: يستند هذا الجدول التمهيدي إلى الكتيب الرسمي لمؤتمر SCI 2027. وستُعلن أسماء المتحدثين وتوزيع القاعات والتفاصيل النهائية للورش في البرنامج النهائي للمؤتمر.</p>
            </div>
          </div>
        </section>

        <section className="pb-20 md:pb-28">
          <div className="container grid gap-8 lg:grid-cols-[1fr_310px]">
            <div className="space-y-8">
              {sci2027Content.programme.map((day, dayIndex) => (
                <article key={day.date} className="border border-[#063760]/12 bg-white shadow-sm">
                  <div className="flex flex-col justify-between gap-4 border-b border-[#063760]/10 bg-[#f7f2e7] px-6 py-5 sm:flex-row sm:items-center sm:px-8">
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#ad8618]">{day.date}</p>
                      <h2 className="mt-2 font-serif text-3xl font-bold text-[#063760]">{day.day.en}</h2>
                      <p dir="rtl" className="mt-1 text-right text-sm font-bold text-[#617986]">{day.day.ar}</p>
                    </div>
                    <p className="max-w-sm border-l-2 border-[#d3a725] pl-3 text-sm font-semibold leading-6 text-[#456374]">{day.purpose.en}</p>
                  </div>
                  <div className="p-5 sm:p-8">
                    <div className="space-y-3">
                      {(schedule[day.date] ?? []).map((session) => (
                        <div key={session.time + session.en} className={`grid gap-3 border-l-4 p-4 sm:grid-cols-[112px_1fr_auto] sm:items-center ${toneClass[session.tone ?? "soft"]}`}>
                          <div className="flex items-center gap-2 text-sm font-extrabold text-[#063760]"><Clock3 className="h-4 w-4 text-[#ad8618]" />{session.time}</div>
                          <div><p className="text-sm font-bold leading-6 text-[#063760]">{session.en}</p><p dir="rtl" className="mt-1 text-right text-sm leading-6 text-[#617986]">{session.ar}</p></div>
                          <span className="hidden font-serif text-3xl font-bold text-[#063760]/10 sm:block">0{dayIndex + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
              <div className="bg-[#063760] p-6 text-white">
                <Sparkles className="h-6 w-6 text-[#f0ca57]" />
                <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-[#f0ca57]">Featured learning</p>
                <h2 className="mt-3 font-serif text-2xl font-bold leading-tight">Workshops and training</h2>
                <div className="mt-5 space-y-4 border-t border-white/15 pt-5">
                  {sci2027Content.workshops.map((workshop) => <div key={workshop.en}><p className="text-sm font-bold leading-5">{workshop.en}</p><p className="mt-1 text-xs text-[#b9ccd7]">Track {workshop.track} · {workshop.timing.en}</p></div>)}
                </div>
              </div>
              <a href={sci2027Content.assets.brochureEnglish} target="_blank" rel="noreferrer" className="flex items-center justify-between border border-[#063760]/15 bg-white px-5 py-4 text-sm font-bold text-[#063760] transition hover:border-[#d3a725]"><span>Download English brochure</span><Download className="h-4 w-4 text-[#ad8618]" /></a>
              <a href={sci2027Content.assets.brochureArabic} target="_blank" rel="noreferrer" className="flex items-center justify-between border border-[#063760]/15 bg-white px-5 py-4 text-sm font-bold text-[#063760] transition hover:border-[#d3a725]" dir="rtl"><span>تحميل الكتيب العربي</span><Download className="h-4 w-4 text-[#ad8618]" /></a>
            </aside>
          </div>
        </section>
      </main>
      <Sci2027Footer />
    </div>
  );
}
