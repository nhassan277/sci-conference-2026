import { ArrowLeft, ArrowUpRight, CalendarDays, Clock3, MapPin, Users } from "lucide-react";
import { Link } from "wouter";
import Sci2027Header from "@/components/Sci2027Header";
import Sci2027Footer from "@/components/Sci2027Footer";
import { sci2027Content } from "@/data/sci2027Content";

export default function Sci2027Workshops() {
  const { workshops } = sci2027Content;

  return (
    <div lang="en" className="min-h-screen bg-[#fffdf8] text-[#17374f]">
      <Sci2027Header />
      <main>
        <section className="relative overflow-hidden bg-[#063760] text-white">
          <div className="sci-network absolute inset-0 opacity-35" aria-hidden="true" />
          <div className="container relative py-16 md:py-20">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#f0ca57] transition hover:text-white"><ArrowLeft className="h-4 w-4" /> Back to SCI 2027</Link>
            <p className="mt-10 text-xs font-bold uppercase tracking-[0.2em] text-[#f0ca57]">Learning into practice</p>
            <h1 className="mt-4 font-serif text-5xl font-bold tracking-[-0.04em] sm:text-6xl">{workshops.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#c1d3dc]">{workshops.description}</p>
          </div>
        </section>

        <section className="py-12 sm:py-16 md:py-20" aria-label="Announced workshops">
          <div className="container">
            {workshops.items.map((workshop, index) => (
              <article key={workshop.id} id={workshop.id} aria-labelledby={`${workshop.id}-title`} className="border border-[#063760]/15 bg-white shadow-[0_16px_45px_rgba(6,55,96,0.07)]">
                <div className="grid border-b border-[#063760]/10 bg-[#f8f3e7] p-6 sm:p-8 lg:grid-cols-[1fr_220px] lg:items-center lg:gap-10">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ad8618]">Workshop {String(index + 1).padStart(2, "0")}</p>
                    <h2 id={`${workshop.id}-title`} className="mt-4 max-w-4xl font-serif text-3xl font-bold leading-tight tracking-[-0.02em] text-[#063760] sm:text-4xl">{workshop.title}</h2>
                    <p className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-[#617986]">In partnership with</p>
                    <p className="mt-2 max-w-xl text-base font-bold leading-7 text-[#17374f]">{workshop.provider}</p>
                  </div>
                  <div className="mt-6 w-36 justify-self-start lg:mt-0 lg:w-full lg:max-w-[190px] lg:justify-self-end">
                    <img src={workshop.logo.url} alt={workshop.logo.alt} width={workshop.logo.width} height={workshop.logo.height} loading="lazy" decoding="async" className="block h-auto w-full object-contain" />
                  </div>
                </div>

                <div className="grid gap-8 p-6 sm:p-8 xl:grid-cols-[1.15fr_0.85fr] xl:gap-10">
                  <div>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                      <div className="col-span-2 border-l-2 border-[#d3a725] bg-[#f7f2e7] p-4 md:col-span-1">
                        <Clock3 className="h-5 w-5 text-[#ad8618]" aria-hidden="true" />
                        <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-[#617986]">Format</p>
                        <p className="mt-2 text-sm font-bold leading-6 text-[#063760]">{workshop.format}</p>
                      </div>
                      <div className="border-l-2 border-[#d3a725] bg-[#f7f2e7] p-4">
                        <Users className="h-5 w-5 text-[#ad8618]" aria-hidden="true" />
                        <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-[#617986]">Capacity</p>
                        <p className="mt-2 text-sm font-bold leading-6 text-[#063760]">{workshop.capacity} seats only</p>
                      </div>
                      <div className="border-l-2 border-[#d3a725] bg-[#f7f2e7] p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#617986]">Workshop fee</p>
                        <p className="mt-4 font-serif text-3xl font-bold text-[#063760]">{workshop.fee}</p>
                      </div>
                    </div>

                    <dl className="mt-8 grid gap-6 border-y border-[#063760]/10 py-6 sm:grid-cols-2">
                      <div>
                        <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#617986]"><CalendarDays className="h-4 w-4 text-[#ad8618]" aria-hidden="true" /> Date &amp; time</dt>
                        <dd className="mt-3 text-sm font-bold text-[#063760]">{workshop.dateAndTime}</dd>
                      </div>
                      <div>
                        <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#617986]"><MapPin className="h-4 w-4 text-[#ad8618]" aria-hidden="true" /> Venue</dt>
                        <dd className="mt-3 text-sm font-bold text-[#063760]">{workshop.venue}</dd>
                      </div>
                    </dl>

                    <div className="mt-6 border-l-4 border-[#d3a725] bg-[#edf4f6] p-5">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#617986]">Registration</p>
                      <p className="mt-2 font-serif text-2xl font-bold text-[#063760]">{workshop.registration.status}</p>
                      <p className="mt-3 text-sm leading-6 text-[#456374]">The Google Form link will be added here once available.</p>
                    </div>
                    <p className="mt-6 text-sm leading-6 text-[#617986]">{workshop.scheduleNote}</p>
                  </div>

                  <figure className="self-start border border-[#063760]/15 bg-[#fffdf8]">
                    <a href={workshop.announcement.url} target="_blank" rel="noopener noreferrer" aria-label="Open the complete partnership announcement in a new tab" className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ad8618]">
                      <img src={workshop.announcement.url} alt={workshop.announcement.alt} width={workshop.announcement.width} height={workshop.announcement.height} loading="lazy" decoding="async" className="block h-auto w-full" />
                    </a>
                    <figcaption className="border-t border-[#063760]/10 px-5 py-4 text-sm leading-6 text-[#617986]">Official partnership announcement. Conference dates shown are not the workshop schedule. Select the image to view it in full size.</figcaption>
                  </figure>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-[#063760]/10 bg-[#f7f2e7] py-12 sm:py-16">
          <div className="container flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="sci-eyebrow">More opportunities to learn</p>
              <h2 className="mt-3 font-serif text-3xl font-bold text-[#063760]">Additional workshops</h2>
              <p className="mt-4 text-base font-semibold text-[#617986]">{workshops.additionalStatus}</p>
            </div>
            <Link href="/programme" className="inline-flex items-center gap-2 self-start rounded-full bg-[#063760] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#0a507e] md:self-auto">View conference programme <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
        </section>
      </main>
      <Sci2027Footer />
    </div>
  );
}
