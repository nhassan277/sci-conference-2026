import { ArrowLeft, ArrowUpRight, CalendarDays, Landmark, Presentation } from "lucide-react";
import { Link } from "wouter";
import Sci2027Footer from "@/components/Sci2027Footer";
import Sci2027Header from "@/components/Sci2027Header";
import { sci2027Content } from "@/data/sci2027Content";

export default function Sci2027ProgrammeWorkshops() {
  const { programme, workshopProgramme } = sci2027Content;

  return (
    <div className="min-h-screen bg-[#fffdf8] text-[#17374f]">
      <Sci2027Header />
      <main>
        <section className="relative overflow-hidden bg-[#063760] text-white">
          <div className="absolute inset-0 sci-network opacity-35" aria-hidden="true" />
          <div className="container relative py-16 md:py-20">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#f0ca57] transition hover:text-white"><ArrowLeft className="h-4 w-4" /> Back to SCI 2027</Link>
            <p className="mt-10 text-xs font-bold uppercase tracking-[0.2em] text-[#f0ca57]">Programme &amp; workshops</p>
            <h1 className="mt-4 max-w-4xl font-serif text-5xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-6xl">Five days that move from learning to action.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#c1d3dc]">Full preliminary programme · 6–10 April 2027</p>
          </div>
        </section>

        <section className="py-20 md:py-24">
          <div className="container">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {programme.map((day) => (
                <article key={day.date} className="border border-[#063760]/15 bg-white p-6 shadow-[0_10px_30px_rgba(6,55,96,0.06)]">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#ad8618]">{day.date}</p>
                  <h2 className="mt-4 font-serif text-2xl font-bold text-[#063760]">{day.day.en}</h2>
                  <p className="mt-5 border-l-2 border-[#d3a725] pl-3 text-sm font-semibold leading-6 text-[#17374f]">{day.purpose.en}</p>
                  <ul className="mt-6 space-y-3 border-t border-[#063760]/10 pt-5">
                    {day.sessions.map((session) => (
                      <li key={session.en} className="flex gap-2 text-sm leading-6 text-[#58717e]"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d3a725]" />{session.en}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#062f52] py-16 text-white md:py-20">
          <div className="container">
            <p className="sci-eyebrow text-[#f0ca57]">Workshop days</p>
            <h2 className="mt-3 max-w-2xl font-serif text-3xl font-bold sm:text-4xl">Professional learning around the main conference.</h2>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <article className="border border-white/15 bg-white/[0.06] p-6">
                <Presentation className="h-6 w-6 text-[#f0ca57]" />
                <p className="mt-5 text-xs font-bold uppercase tracking-[0.15em] text-[#f0ca57]">{workshopProgramme.preConference.date}</p>
                <h3 className="mt-2 font-serif text-xl font-bold">{workshopProgramme.preConference.label}</h3>
                <p className="mt-4 text-sm leading-6 text-[#c1d3dc]">{workshopProgramme.status}</p>
              </article>
              <article className="border border-white/15 bg-white/[0.06] p-6">
                <Landmark className="h-6 w-6 text-[#f0ca57]" />
                <p className="mt-5 text-xs font-bold uppercase tracking-[0.15em] text-[#f0ca57]">{workshopProgramme.culturalVisit.date}</p>
                <h3 className="mt-2 font-serif text-xl font-bold">{workshopProgramme.culturalVisit.label}</h3>
                <p className="mt-4 text-sm leading-6 text-[#c1d3dc]">{workshopProgramme.culturalVisit.activity}</p>
              </article>
              <article className="border border-white/15 bg-white/[0.06] p-6">
                <CalendarDays className="h-6 w-6 text-[#f0ca57]" />
                <p className="mt-5 text-xs font-bold uppercase tracking-[0.15em] text-[#f0ca57]">{workshopProgramme.postConference.date}</p>
                <h3 className="mt-2 font-serif text-xl font-bold">{workshopProgramme.postConference.label}</h3>
                <p className="mt-4 text-sm leading-6 text-[#c1d3dc]">{workshopProgramme.status}</p>
              </article>
            </div>
            <Link href="/programme" className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#d3a725] px-6 py-3.5 text-sm font-extrabold uppercase tracking-[0.1em] text-[#062f52] transition hover:-translate-y-0.5 hover:bg-[#f5d670]">Detailed programme timeline <ArrowUpRight className="h-4 w-4" /></Link>
            <Link href="/workshops" className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#f0ca57]/60 px-6 py-3.5 text-sm font-bold text-[#f0ca57] transition hover:bg-white/10 sm:ml-4">Explore workshops <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
        </section>
      </main>
      <Sci2027Footer />
    </div>
  );
}
