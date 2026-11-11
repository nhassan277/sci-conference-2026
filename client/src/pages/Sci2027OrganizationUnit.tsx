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
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#f0ca57] transition hover:text-white"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to SCI 2027</Link>
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
          <div className="container grid gap-12 lg:grid-cols-2 lg:items-center">
            <figure className="relative aspect-[16/9] overflow-hidden border border-[#063760]/10 bg-[#063760] shadow-md">
              <img src={conferenceOrganizationUnit.visual.url} alt={conferenceOrganizationUnit.visual.alt} loading="lazy" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#062f52]/70 via-transparent to-transparent" aria-hidden="true" />
              <figcaption className="absolute bottom-3 left-4 text-[9px] font-bold uppercase tracking-[0.16em] text-white/85">Photography via Unsplash</figcaption>
            </figure>
            <div>
              <p className="max-w-xl text-base leading-7 text-[#456374] sm:text-lg">{conferenceOrganizationUnit.description}</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a href={conferenceOrganizationUnit.facultyUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#063760] px-5 py-3 text-xs font-extrabold uppercase tracking-[0.1em] text-white transition hover:-translate-y-0.5 hover:bg-[#0a507e]">Visit the Faculty of Science Website <ExternalLink className="h-4 w-4" aria-hidden="true" /></a>
                <a href={conferenceOrganizationUnit.unitUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-[#063760]/20 bg-white px-5 py-3 text-xs font-extrabold uppercase tracking-[0.1em] text-[#063760] transition hover:-translate-y-0.5 hover:border-[#d3a725]">Learn More About the Unit <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></a>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="container">
            <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
              <div><p className="sci-eyebrow">Meet the leaders</p><h2 className="mt-4 max-w-2xl font-serif text-4xl font-bold leading-[1.04] tracking-[-0.035em] text-[#063760] sm:text-5xl">The people coordinating scientific exchange.</h2></div>
              <p className="max-w-sm text-sm leading-6 text-[#617986]">Meet the Local Organizing Committee coordinating SCI 2027.</p>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {conferenceOrganizationUnit.leaders.map((leader) => {
                const member = conferenceOrganizationUnit.members.find((member) => member.name === leader.name);

                return (
                  <article key={leader.name} className="group overflow-hidden border border-[#063760]/10 bg-white shadow-sm">
                    <div className="aspect-[4/5] overflow-hidden bg-[#edf4f3]">
                      {leader.photo ? (
                        <img src={leader.photo} alt={`Portrait of ${leader.name}`} loading="lazy" className="h-full w-full object-cover object-top transition duration-500 motion-safe:group-hover:scale-[1.03]" />
                      ) : (
                        <div role="img" aria-label={`Portrait of ${leader.name}: photo to be announced`} className="flex h-full w-full flex-col items-center justify-center gap-4 px-6 text-center text-[#617986]">
                          <UsersRound className="h-12 w-12 text-[#0d638b]" aria-hidden="true" />
                          <p className="text-xs font-semibold leading-5">Photo to be announced</p>
                        </div>
                      )}
                    </div>
                    <div className="border-t-4 border-[#d3a725] p-5">
                      <h3 className="font-serif text-xl font-bold leading-tight text-[#063760]">{leader.name}</h3>
                      <p className="mt-2 text-xs font-extrabold uppercase tracking-[0.12em] leading-5 text-[#0d638b]">{leader.role}</p>
                      {member && <p className="mt-3 text-xs leading-5 text-[#617986]">{member.department}</p>}
                      {leader.assistants.length > 0 && (
                        <div className="mt-4 border-t border-[#063760]/10 pt-3">
                          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#ad8618]">Student Sponsorship Assistants</p>
                          <ul className="mt-2 space-y-1.5">
                            {leader.assistants.map((assistant) => <li key={assistant} className="text-xs font-semibold leading-5 text-[#456374]">{assistant}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Sci2027Footer />
    </div>
  );
}
