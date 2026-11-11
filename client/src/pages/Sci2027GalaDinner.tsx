import { ArrowLeft, ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import { Link } from "wouter";
import Sci2027Footer from "@/components/Sci2027Footer";
import Sci2027Header from "@/components/Sci2027Header";
import { sci2027Content } from "@/data/sci2027Content";

export default function Sci2027GalaDinner() {
  const { galaDinner } = sci2027Content;

  return (
    <div className="min-h-screen bg-[#fffdf8] text-[#17374f]">
      <Sci2027Header />
      <main>
        <section className="relative overflow-hidden bg-[#063760] text-white">
          <div className="absolute inset-0 sci-network opacity-35" aria-hidden="true" />
          <div className="container relative py-16 md:py-20">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#f0ca57] transition hover:text-white"><ArrowLeft className="h-4 w-4" /> Back to SCI 2027</Link>
            <p className="mt-10 text-xs font-bold uppercase tracking-[0.2em] text-[#f0ca57]">{galaDinner.eyebrow}</p>
            <h1 className="mt-4 max-w-4xl font-serif text-5xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-6xl">{galaDinner.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#c1d3dc]">{galaDinner.description}</p>

            <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-2">
              <div className="border border-[#d3a725]/40 bg-white/[0.07] px-5 py-5"><p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#f0ca57]">Optional add-on</p><p className="mt-3 font-serif text-3xl font-bold text-white">{galaDinner.addOnAmount}</p><p className="mt-2 text-xs leading-5 text-[#c1d3dc]">{galaDinner.addOnDetail}</p></div>
              <div className="border border-white/15 bg-white/[0.07] px-5 py-5"><CalendarDays className="h-5 w-5 text-[#f0ca57]" /><p className="mt-4 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#f0ca57]">Gala dinner schedule</p><p className="mt-2 text-sm font-bold leading-6 text-white">{galaDinner.dateTimeStatus}</p></div>
            </div>

            <div className="mt-5 max-w-2xl border-l-4 border-[#d3a725] bg-white/[0.07] px-5 py-5">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#f0ca57]" />
                <div>
                  <p className="text-sm font-extrabold text-white">{galaDinner.venue}</p>
                  <p className="mt-1 text-sm leading-6 text-[#c1d3dc]">{galaDinner.location}</p>
                </div>
              </div>
            </div>
            <a href={galaDinner.directionsUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#d3a725] px-5 py-3 text-xs font-extrabold uppercase tracking-[0.1em] text-[#063760] transition hover:-translate-y-0.5 hover:bg-[#f0ca57]">{galaDinner.directionsLabel} <ArrowUpRight className="h-4 w-4" /></a>
          </div>
        </section>

        <section className="border-b border-[#063760]/10 bg-[#f7f2e7] py-20 md:py-24">
          <div className="container">
            <p className="sci-eyebrow">The venue</p>
            <h2 className="mt-4 max-w-2xl font-serif text-4xl font-bold leading-[1.04] tracking-[-0.035em] text-[#063760] sm:text-5xl">Fleet Club El Gezira on the Nile.</h2>
            <div className="mt-10 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
              <figure className="overflow-hidden border border-[#063760]/10 bg-white shadow-[0_20px_45px_rgba(6,55,96,0.12)]">
                <div className="aspect-[4/5] bg-[#edf4f3]"><img src={galaDinner.primaryImage.url} alt={galaDinner.primaryImage.alt} loading="lazy" className="h-full w-full object-contain" /></div>
                <figcaption className="border-t border-[#063760]/10 px-4 py-3 text-xs font-bold leading-5 text-[#456374]">Fleet Club El Gezira on the Nile</figcaption>
              </figure>
              <div className="grid gap-4 sm:grid-cols-2">
                {galaDinner.galleryImages.map((image) => (
                  <figure key={image.url} className="aspect-square overflow-hidden border border-[#063760]/10 bg-[#edf4f3] shadow-sm">
                    <img src={image.url} alt={image.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Sci2027Footer />
    </div>
  );
}
