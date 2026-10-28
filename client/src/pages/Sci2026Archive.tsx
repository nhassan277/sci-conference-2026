import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, Images, X, ZoomIn } from "lucide-react";
import { Link } from "wouter";
import Sci2027Footer from "@/components/Sci2027Footer";
import Sci2027Header from "@/components/Sci2027Header";
import { GALLERY_PHOTOS } from "@/galleryPhotos";

const featuredGalleryIndices = [0, 28, 42, 72, 108, 109, 126, 149, 208, 237] as const;

const featuredPhotoAlt = [
  "SCI 2026 award recognition moment",
  "SCI 2026 conference team and participants",
  "SCI 2026 speaker at the conference podium",
  "SCI 2026 audience during a scientific session",
  "SCI 2026 recognition presentation",
  "Hands-on scientific learning at SCI 2026",
  "SCI 2026 recognition moment",
  "SCI 2026 community and conference participants",
  "SCI 2026 scientific session presentation",
  "SCI 2026 researchers with their poster presentation",
] as const;

const featuredPhotos = featuredGalleryIndices.map((galleryIndex, index) => ({
  url: GALLERY_PHOTOS[galleryIndex],
  alt: featuredPhotoAlt[index],
  emphasis: index === 0 || index === 3 ? "large" : "standard",
}));

export default function Sci2026Archive() {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedPhoto(null);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const selected = selectedPhoto === null ? null : featuredPhotos[selectedPhoto];

  return (
    <div className="min-h-screen bg-[#fffdf8] text-[#17374f]">
      <Sci2027Header />
      <main>
        <section className="relative overflow-hidden bg-[#f1ede3] py-16 md:py-24">
          <div className="absolute inset-0 sci-network opacity-20" aria-hidden="true" />
          <div className="container relative max-w-4xl">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#063760] transition hover:text-[#ad8618]"><ArrowLeft className="h-4 w-4" /> Back to SCI 2027</Link>
            <p className="mt-10 text-xs font-extrabold uppercase tracking-[0.2em] text-[#ad8618]">Archived conference moments</p>
            <h1 className="mt-4 font-serif text-5xl font-bold leading-[1.02] tracking-[-0.04em] text-[#063760] sm:text-6xl">SCI 2026 archive</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#456374]">SCI 2026 took place at the Faculty of Science, Cairo University on 7–8 April 2026. This archive preserves a selection of the people, research, exchange and collaboration that brought the conference to life.</p>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container">
            <div className="flex flex-col justify-between gap-6 border-b border-[#063760]/12 pb-8 md:flex-row md:items-end">
              <div>
                <p className="sci-eyebrow">Conference archive</p>
                <h2 className="mt-4 font-serif text-4xl font-bold leading-[1.04] tracking-[-0.035em] text-[#063760] sm:text-5xl">SCI 2026 in Moments</h2>
                <p className="mt-5 max-w-2xl text-base leading-7 text-[#617986]">A curated selection from the conference photo archive, from scientific exchange and hands-on learning to recognition and the people behind the event.</p>
              </div>
              <a href="/live-gallery" className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-[#063760] px-6 py-3.5 text-sm font-extrabold uppercase tracking-[0.1em] text-white transition hover:-translate-y-0.5 hover:bg-[#0a507e] md:self-auto">Explore the full gallery <ArrowUpRight className="h-4 w-4" /></a>
            </div>

            <div className="mt-10 grid auto-rows-[180px] gap-3 sm:auto-rows-[220px] md:grid-cols-4 md:auto-rows-[190px] lg:auto-rows-[220px]">
              {featuredPhotos.map((photo, index) => (
                <button
                  key={photo.url}
                  type="button"
                  onClick={() => setSelectedPhoto(index)}
                  className={`group relative overflow-hidden bg-[#e8ecec] text-left focus:outline-none focus:ring-4 focus:ring-[#d3a725]/35 ${photo.emphasis === "large" ? "md:col-span-2 md:row-span-2" : "md:col-span-1 md:row-span-1"}`}
                  aria-label={`Open ${photo.alt}`}
                >
                  <img src={photo.url} alt={photo.alt} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" loading="lazy" />
                  <span className="absolute inset-0 bg-gradient-to-t from-[#03182a]/60 via-transparent to-transparent opacity-70 transition group-hover:opacity-100" aria-hidden="true" />
                  <span className="absolute bottom-4 left-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#063760] opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-visible:opacity-100"><ZoomIn className="h-4 w-4" /></span>
                  <span className="absolute bottom-4 right-4 text-[10px] font-bold uppercase tracking-[0.16em] text-white drop-shadow">SCI 2026</span>
                </button>
              ))}
            </div>

            <div className="mt-10 flex flex-col justify-between gap-5 border border-[#063760]/12 bg-[#f8f3e7] px-6 py-6 sm:flex-row sm:items-center sm:px-8">
              <div className="flex items-start gap-4"><Images className="mt-0.5 h-6 w-6 shrink-0 text-[#ad8618]" /><div><p className="font-serif text-2xl font-bold text-[#063760]">More moments in the full archive</p><p className="mt-2 max-w-2xl text-sm leading-6 text-[#617986]">Browse the complete curated SCI 2026 gallery to revisit the wider programme, participants and event activity.</p></div></div>
              <a href="/live-gallery" className="inline-flex shrink-0 items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[#063760] underline decoration-[#d3a725] decoration-2 underline-offset-8">Open full gallery <ArrowUpRight className="h-4 w-4" /></a>
            </div>
          </div>
        </section>
      </main>

      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#03182a]/95 p-4 sm:p-8" role="dialog" aria-modal="true" aria-label="SCI 2026 photo viewer" onClick={() => setSelectedPhoto(null)}>
          <button type="button" onClick={() => setSelectedPhoto(null)} className="absolute right-5 top-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white transition hover:bg-white hover:text-[#063760]" aria-label="Close photo viewer"><X className="h-5 w-5" /></button>
          <figure className="max-h-full max-w-6xl" onClick={(event) => event.stopPropagation()}>
            <img src={selected.url} alt={selected.alt} className="max-h-[78vh] w-auto max-w-full object-contain shadow-2xl" />
            <figcaption className="mt-4 text-center text-sm font-semibold text-[#dbe8ec]">{selected.alt}</figcaption>
          </figure>
        </div>
      )}

      <Sci2027Footer />
    </div>
  );
}
