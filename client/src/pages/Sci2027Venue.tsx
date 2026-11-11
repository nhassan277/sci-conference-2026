import { ArrowLeft, ArrowUpRight, MapPin } from "lucide-react";
import { Link } from "wouter";
import Sci2027Footer from "@/components/Sci2027Footer";
import Sci2027Header from "@/components/Sci2027Header";
import { sci2027Content } from "@/data/sci2027Content";

export default function Sci2027Venue() {
  const { location } = sci2027Content.identity;

  return (
    <div className="min-h-screen bg-[#fffdf8] text-[#17374f]">
      <Sci2027Header />
      <main>
        <section className="relative overflow-hidden bg-[#063760] text-white">
          <div className="absolute inset-0 sci-network opacity-35" aria-hidden="true" />
          <div className="container relative py-16 md:py-20">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#f0ca57] transition hover:text-white"><ArrowLeft className="h-4 w-4" /> Back to SCI 2027</Link>
            <p className="mt-10 text-xs font-bold uppercase tracking-[0.2em] text-[#f0ca57]">Venue &amp; Halls</p>
            <h1 className="mt-4 max-w-4xl font-serif text-5xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-6xl">{location.name}</h1>
            <div className="mt-8 max-w-2xl border-l-4 border-[#d3a725] bg-white/[0.07] px-5 py-5">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#f0ca57]" />
                <div>
                  <p className="text-sm font-extrabold text-white">{location.name}</p>
                  <p className="mt-1 text-sm leading-6 text-[#c1d3dc]">{location.shortAddress}</p>
                </div>
              </div>
            </div>
            <a href={location.mapUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#d3a725] px-5 py-3 text-xs font-extrabold uppercase tracking-[0.1em] text-[#063760] transition hover:-translate-y-0.5 hover:bg-[#f0ca57]">{location.directionsLabel} <ArrowUpRight className="h-4 w-4" /></a>
          </div>
        </section>

        <section className="border-b border-[#063760]/10 bg-[#f7f2e7] py-20 md:py-24">
          <div className="container">
            <p className="sci-eyebrow">Inside the venue</p>
            <h2 className="mt-4 max-w-2xl font-serif text-4xl font-bold leading-[1.04] tracking-[-0.035em] text-[#063760] sm:text-5xl">A setting designed for scientific exchange.</h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#456374]">Explore the Conference Center - Cairo University, from its main auditorium and supporting meeting facilities to its entrance, shared spaces, corridors and atrium.</p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {location.venueGallery.map((photo) => (
                <figure key={photo.url} className="aspect-square overflow-hidden border border-[#063760]/10 bg-[#edf4f3] shadow-sm">
                  <img src={photo.url} alt={photo.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-24">
          <div className="container">
            <p className="sci-eyebrow">Auditorium &amp; facilities</p>
            <h2 className="mt-4 max-w-2xl font-serif text-4xl font-bold leading-[1.04] tracking-[-0.035em] text-[#063760] sm:text-5xl">Halls built for discovery and dialogue.</h2>
            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              {location.venueVisuals.map((visual) => (
                <figure key={visual.url} className="relative overflow-hidden border border-[#063760]/10 bg-[#063760] shadow-md">
                  <img src={visual.url} alt={visual.alt} loading="lazy" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#062f52]/80 via-transparent to-transparent" aria-hidden="true" />
                  <figcaption className="absolute bottom-4 left-5 right-5 text-xs font-bold leading-5 text-white/90">{visual.caption}</figcaption>
                </figure>
              ))}
            </div>
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              {location.venueMontages.map((montage) => (
                <figure key={montage.url} className="overflow-hidden border border-[#063760]/10 bg-[#edf4f3] shadow-sm">
                  <img src={montage.url} alt={montage.alt} loading="lazy" className="block h-auto w-full" />
                </figure>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Sci2027Footer />
    </div>
  );
}
