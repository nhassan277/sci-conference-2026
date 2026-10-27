import { ArrowLeft, CalendarDays, Clock3, Download, MapPin, Sparkles } from "lucide-react";
import { Link } from "wouter";
import Sci2027Footer from "@/components/Sci2027Footer";
import Sci2027Header from "@/components/Sci2027Header";
import { sci2027Content } from "@/data/sci2027Content";

type ProgrammeSession = { time: string; title: string; tone?: "gold" | "blue" | "soft" };

const schedule: Record<string, ProgrammeSession[]> = {
  "6 April 2027": [
    { time: "To be announced", title: "Pre-conference workshop programme", tone: "gold" },
    { time: "To be announced", title: "Detailed timing and registration information", tone: "soft" },
  ],
  "7 April 2027": [
    { time: "08:30–09:00", title: "Registration and networking", tone: "soft" },
    { time: "09:00–09:15", title: "Opening address by the Conference Organizing Committee Chair" },
    { time: "09:15–09:30", title: "Welcome address by the Dean / University representative" },
    { time: "09:30–10:30", title: "Keynote Speaker Session · To be announced", tone: "gold" },
    { time: "10:30–11:00", title: "Coffee break", tone: "soft" },
    { time: "11:00–12:00", title: "Scientific programme and parallel-track sessions" },
    { time: "12:00–13:30", title: "Morning scientific sessions across six parallel tracks", tone: "blue" },
    { time: "13:30–14:30", title: "Lunch and networking", tone: "soft" },
    { time: "14:30–16:00", title: "Afternoon scientific sessions across six parallel tracks", tone: "blue" },
    { time: "16:00–17:00", title: "Scientific poster sessions" },
    { time: "17:00", title: "Optional gala dinner", tone: "soft" },
  ],
  "8 April 2027": [
    { time: "08:30–09:00", title: "Registration and networking", tone: "soft" },
    { time: "09:00–09:15", title: "Opening of day two" },
    { time: "09:15–10:30", title: "Invited Speaker Sessions · To be announced", tone: "gold" },
    { time: "10:30–11:00", title: "Coffee break", tone: "soft" },
    { time: "11:00–13:30", title: "Morning scientific sessions in six parallel halls", tone: "blue" },
    { time: "13:30–14:30", title: "Lunch and networking", tone: "soft" },
    { time: "14:30–15:15", title: "Scientific poster sessions" },
    { time: "15:15–16:30", title: "Innovation exhibition and research collaboration forum", tone: "gold" },
    { time: "16:30–16:45", title: "Closing remarks" },
    { time: "16:45–17:00", title: "Closing session: recommendations and partnership announcements", tone: "blue" },
  ],
  "9 April 2027": [
    { time: "To be announced", title: "Post-conference workshop programme", tone: "gold" },
    { time: "Afternoon", title: "Optional cultural experience: Grand Egyptian Museum visit", tone: "soft" },
  ],
};

const toneClass = {
  gold: "border-l-[#d3a725] bg-[#fff8e6]",
  blue: "border-l-[#0d638b] bg-[#edf6fa]",
  soft: "border-l-[#c7d2d7] bg-[#fafbf9]",
};

export default function Sci2027Programme() {
  const { speakers, workshopProgramme } = sci2027Content;

  return (
    <div className="min-h-screen bg-[#fffdf8] text-[#17374f]">
      <Sci2027Header />
      <main>
        <section className="relative overflow-hidden bg-[#063760] text-white">
          <div className="absolute inset-0 sci-network opacity-35" aria-hidden="true" />
          <div className="container relative py-16 md:py-20">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#f0ca57] transition hover:text-white"><ArrowLeft className="h-4 w-4" /> Back to SCI 2027</Link>
            <p className="mt-10 text-xs font-bold uppercase tracking-[0.2em] text-[#f0ca57]">SCI 2027 · Preliminary programme</p>
            <h1 className="mt-4 max-w-4xl font-serif text-5xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-6xl">Four days for workshops, discovery, dialogue and collaboration.</h1>
            <div className="mt-9 grid gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-3 border-l-2 border-[#e5bd4a] bg-white/[0.06] px-4 py-3"><CalendarDays className="h-5 w-5 text-[#f0ca57]" /><span className="text-sm font-bold">6–9 April 2027</span></div>
              <div className="flex items-center gap-3 border-l-2 border-[#e5bd4a] bg-white/[0.06] px-4 py-3"><Sparkles className="h-5 w-5 text-[#f0ca57]" /><span className="text-sm font-bold">Main conference: 7–8 April</span></div>
              <div className="flex items-center gap-3 border-l-2 border-[#e5bd4a] bg-white/[0.06] px-4 py-3"><MapPin className="h-5 w-5 text-[#f0ca57]" /><span className="text-sm font-bold">Cairo University Conference Center</span></div>
            </div>
          </div>
        </section>

        <section className="py-8 sm:py-10">
          <div className="container">
            <div className="border-l-4 border-[#d3a725] bg-[#f8f3e7] px-5 py-4 text-sm leading-6 text-[#456374]">
              <strong className="text-[#063760]">Programme status:</strong> the main conference takes place on 7–8 April. {workshopProgramme.status}
            </div>
          </div>
        </section>

        <section className="pb-12 sm:pb-16">
          <div className="container">
            <div className="flex flex-col justify-between gap-5 border-b border-[#063760]/12 pb-6 md:flex-row md:items-end">
              <div><p className="sci-eyebrow">{speakers.eyebrow}</p><h2 className="mt-3 font-serif text-3xl font-bold tracking-[-0.03em] text-[#063760] sm:text-4xl">{speakers.title}</h2></div>
              <p className="max-w-md text-sm font-semibold leading-6 text-[#617986]">{speakers.status}</p>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {speakers.groups.map((group) => <article key={group.title} className="border border-[#063760]/12 bg-white p-6 shadow-sm"><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#ad8618]">{group.title}</p><p className="mt-5 font-serif text-3xl font-bold text-[#063760]">{group.status}</p><p className="mt-4 max-w-lg text-sm leading-6 text-[#617986]">{group.description}</p></article>)}
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
                    </div>
                    <p className="max-w-sm border-l-2 border-[#d3a725] pl-3 text-sm font-semibold leading-6 text-[#456374]">{day.purpose.en}</p>
                  </div>
                  <div className="p-5 sm:p-8">
                    <div className="space-y-3">
                      {(schedule[day.date] ?? []).map((session) => (
                        <div key={session.time + session.title} className={`grid gap-3 border-l-4 p-4 sm:grid-cols-[132px_1fr_auto] sm:items-center ${toneClass[session.tone ?? "soft"]}`}>
                          <div className="flex items-center gap-2 text-sm font-extrabold text-[#063760]"><Clock3 className="h-4 w-4 text-[#ad8618]" />{session.time}</div>
                          <p className="text-sm font-bold leading-6 text-[#063760]">{session.title}</p>
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
                <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-[#f0ca57]">Workshop days</p>
                <h2 className="mt-3 font-serif text-2xl font-bold leading-tight">Two learning days around the main conference.</h2>
                <div className="mt-5 space-y-4 border-t border-white/15 pt-5">
                  <div><p className="text-sm font-bold">{workshopProgramme.preConference.label}</p><p className="mt-1 text-xs text-[#b9ccd7]">{workshopProgramme.preConference.date}</p></div>
                  <div><p className="text-sm font-bold">{workshopProgramme.postConference.label}</p><p className="mt-1 text-xs text-[#b9ccd7]">{workshopProgramme.postConference.date}</p></div>
                  <div className="border-t border-white/10 pt-4"><p className="text-xs leading-5 text-[#b9ccd7]">{workshopProgramme.status}</p></div>
                  <div className="border-t border-white/10 pt-4"><p className="text-xs font-bold leading-5 text-[#f0ca57]">{workshopProgramme.postConference.optionalActivity}</p></div>
                </div>
              </div>
              <a href={sci2027Content.assets.brochureEnglish} target="_blank" rel="noreferrer" className="flex items-center justify-between border border-[#063760]/15 bg-white px-5 py-4 text-sm font-bold text-[#063760] transition hover:border-[#d3a725]"><span>Download conference brochure</span><Download className="h-4 w-4 text-[#ad8618]" /></a>
            </aside>
          </div>
        </section>
      </main>
      <Sci2027Footer />
    </div>
  );
}
