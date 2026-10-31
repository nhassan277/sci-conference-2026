import { ArrowLeft, ArrowUpRight, ExternalLink, UsersRound } from "lucide-react";
import { Link } from "wouter";
import Sci2027Footer from "@/components/Sci2027Footer";
import Sci2027Header from "@/components/Sci2027Header";
import { sci2027Content } from "@/data/sci2027Content";

export default function Sci2027OrganizationUnit() {
  const { conferenceOrganizationUnit, assets } = sci2027Content;

  return (
    <div className="min-h-screen bg-[#fffdf8] text-[#17374f]">
      <Sci2027Header />
      <main>
        <section className="relative overflow-hidden bg-[#063760] text-white">
          <div className="absolute inset-0 sci-network opacity-35" aria-hidden="true" />
          <div className="container relative py-16 md:py-20">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#f0ca57] transition hover:text-white"><ArrowLeft className="h-4 w-4" /> Back to SCI 2027</Link>
            <div className="mt-10 flex flex-col gap-7 sm:flex-row sm:items-center">
              <img src={assets.conferenceUnitLogo} alt="Conference Organization Unit" className="h-24 w-24 shrink-0 object-contain sm:h-28 sm:w-28" />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f0ca57]">{conferenceOrganizationUnit.institution}</p>
                <h1 className="mt-4 max-w-4xl font-serif text-5xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-6xl">{conferenceOrganizationUnit.title}</h1>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[#063760]/10 bg-[#f7f2e7] py-20 md:py-24">
          <div className="container grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <div>
              <figure className="relative aspect-[16/9] overflow-hidden border border-[#063760]/10 bg-[#063760] shadow-md">
                <img src={conferenceOrganizationUnit.visual.url} alt={conferenceOrganizationUnit.visual.alt} loading="lazy" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#062f52]/70 via-transparent to-transparent" aria-hidden="true" />
                <figcaption className="absolute bottom-3 left-4 text-[9px] font-bold uppercase tracking-[0.16em] text-white/85">Photography via Unsplash</figcaption>
              </figure>
              <p className="mt-7 max-w-xl text-base leading-7 text-[#456374] sm:text-lg">{conferenceOrganizationUnit.description}</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a href={conferenceOrganizationUnit.facultyUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#063760] px-5 py-3 text-xs font-extrabold uppercase tracking-[0.1em] text-white transition hover:-translate-y-0.5 hover:bg-[#0a507e]">Visit the Faculty of Science Website <ExternalLink className="h-4 w-4" /></a>
                <a href={conferenceOrganizationUnit.unitUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-[#063760]/20 bg-white px-5 py-3 text-xs font-extrabold uppercase tracking-[0.1em] text-[#063760] transition hover:-translate-y-0.5 hover:border-[#d3a725]">Learn More About the Unit <ArrowUpRight className="h-4 w-4" /></a>
              </div>
            </div>

            <div>
              <p className="sci-eyebrow">How the Unit works</p>
              <h2 className="mt-4 max-w-xl font-serif text-4xl font-bold leading-[1.04] tracking-[-0.035em] text-[#063760] sm:text-5xl">Professional planning for meaningful scientific exchange.</h2>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {conferenceOrganizationUnit.objectives.map((objective, index) => (
                  <article key={objective.title} className="relative min-h-[188px] overflow-hidden border border-[#063760]/10 bg-white p-6 shadow-sm">
                    <p className="font-serif text-3xl font-bold text-[#d3a725]">0{index + 1}</p>
                    <h3 className="mt-5 font-serif text-2xl font-bold leading-tight text-[#063760]">{objective.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[#617986]">{objective.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="container">
            <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
              <div><p className="sci-eyebrow">Meet the Unit</p><h2 className="mt-4 max-w-2xl font-serif text-4xl font-bold leading-[1.04] tracking-[-0.035em] text-[#063760] sm:text-5xl">The people coordinating scientific exchange.</h2></div>
              <p className="max-w-sm text-sm leading-6 text-[#617986]">A text-only introduction to the published Unit roles. Official portraits may be added in a future update.</p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {conferenceOrganizationUnit.members.map((member, index) => (
                <article key={member.name} className={`relative overflow-hidden border p-6 shadow-sm ${index === 0 ? "border-[#063760] bg-[#063760] text-white" : "border-[#063760]/10 bg-white text-[#063760]"}`}>
                  <div className="flex items-start justify-between gap-5"><div><p className={`text-[10px] font-extrabold uppercase tracking-[0.16em] ${index === 0 ? "text-[#f0ca57]" : "text-[#ad8618]"}`}>{member.department}</p><h3 className="mt-4 font-serif text-2xl font-bold leading-tight sm:text-3xl">{member.name}</h3></div><UsersRound className={`h-6 w-6 shrink-0 ${index === 0 ? "text-[#f0ca57]" : "text-[#ad8618]"}`} /></div>
                  <p className={`mt-5 text-xs font-extrabold uppercase tracking-[0.13em] ${index === 0 ? "text-[#f0ca57]" : "text-[#0d638b]"}`}>{member.role}</p>
                  <p className={`mt-4 max-w-2xl text-sm leading-6 ${index === 0 ? "text-[#c1d3dc]" : "text-[#617986]"}`}>{member.summary}</p>
                  <span className="absolute bottom-3 right-5 font-serif text-6xl font-bold opacity-[0.06]">0{index + 1}</span>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Sci2027Footer />
    </div>
  );
}
