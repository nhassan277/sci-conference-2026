import { ArrowLeft, ArrowUpRight, Clapperboard, Clock3, Play, Volume2, X, Youtube } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import Sci2027Footer from "@/components/Sci2027Footer";
import Sci2027Header from "@/components/Sci2027Header";
import { sci2027Content } from "@/data/sci2027Content";

type PromoVideo = (typeof sci2027Content.videos)[number];

const aspectClasses = {
  landscape: "aspect-video",
  square: "aspect-square",
  portrait: "aspect-[9/16]",
} as const;

function VideoMeta({ video }: { video: PromoVideo }) {
  return (
    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold uppercase tracking-[0.12em] text-[#617986]">
      <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5 text-[#ad8618]" />{video.duration}</span>
      <span className="inline-flex items-center gap-1.5"><Volume2 className="h-3.5 w-3.5 text-[#ad8618]" />{video.language}</span>
    </div>
  );
}

export default function Sci2027Videos() {
  const [selectedVideo, setSelectedVideo] = useState<PromoVideo | null>(null);
  const { contact } = sci2027Content;
  const featuredVideo = sci2027Content.videos.find((video) => video.featured) ?? sci2027Content.videos[0];
  const remainingVideos = sci2027Content.videos.filter((video) => video.id !== featuredVideo.id);

  useEffect(() => {
    if (!selectedVideo) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedVideo(null);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedVideo]);

  return (
    <div className="min-h-screen overflow-hidden bg-[#fffdf8] text-[#17374f]">
      <Sci2027Header />
      <main>
        <section className="relative isolate overflow-hidden bg-[#062f52] text-white">
          <div className="absolute inset-0 sci-network opacity-50" aria-hidden="true" />
          <div className="absolute -right-28 top-0 h-96 w-96 rounded-full bg-[#d3a725]/15 blur-3xl" aria-hidden="true" />
          <div className="container relative grid gap-10 py-16 md:py-24 lg:grid-cols-[1fr_0.95fr] lg:items-end">
            <div className="max-w-3xl">
              <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#f0ca57] transition hover:text-white"><ArrowLeft className="h-4 w-4" /> Back to SCI 2027</Link>
              <p className="mt-10 text-xs font-bold uppercase tracking-[0.2em] text-[#f0ca57]">Watch SCI 2027</p>
              <h1 className="mt-4 max-w-3xl font-serif text-5xl font-bold leading-[1.02] tracking-[-0.045em] sm:text-6xl">Watch the ideas, people and science behind SCI 2027.</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#c1d3dc] sm:text-xl">Four short films offer different ways into the conference: the community it convenes, the science it explores, the momentum it builds and the invitation to join.</p>
            </div>
            <div className="border border-white/15 bg-white/[0.06] p-6 backdrop-blur-sm sm:p-7">
              <Clapperboard className="h-7 w-7 text-[#f0ca57]" />
              <p className="mt-6 font-serif text-2xl font-bold leading-tight">Watch on your terms.</p>
              <p className="mt-3 text-sm leading-7 text-[#c1d3dc]">Choose any film to open an in-page player with native playback controls. Videos never start automatically.</p>
              <a href={contact.youtube.url} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#e5bd4a]/60 px-4 py-2.5 text-xs font-extrabold uppercase tracking-[0.1em] text-[#f0ca57] transition hover:-translate-y-0.5 hover:border-[#f0ca57] hover:bg-white/10 hover:text-white"><Youtube className="h-4 w-4" />{contact.youtube.label}</a>
              <p className="mt-3 text-xs leading-5 text-[#b9ccd7]">{contact.youtube.description}</p>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="container">
            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div><p className="sci-eyebrow">Featured film</p><h2 className="mt-4 font-serif text-4xl font-bold leading-[1.04] tracking-[-0.035em] text-[#063760] sm:text-5xl">{featuredVideo.title}</h2></div>
              <p className="max-w-xl text-sm leading-7 text-[#617986]">{featuredVideo.description}</p>
            </div>
            <div className="mt-12 grid gap-8 lg:grid-cols-[1.22fr_0.78fr] lg:items-center">
              <button type="button" onClick={() => setSelectedVideo(featuredVideo)} className="group relative block overflow-hidden border border-[#063760]/15 bg-[#062f52] text-left shadow-[0_22px_48px_rgba(6,55,96,0.18)] focus:outline-none focus:ring-4 focus:ring-[#d3a725]/35" aria-label={`Play ${featuredVideo.title}`}>
                <div className="aspect-video overflow-hidden"><img src={featuredVideo.posterUrl} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]" /></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#051f35]/80 via-[#051f35]/10 to-transparent" aria-hidden="true" />
                <span className="absolute left-6 top-6 rounded-full border border-white/30 bg-[#062f52]/75 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur">Featured · {featuredVideo.duration}</span>
                <span className="absolute bottom-6 left-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#e5bd4a] text-[#062f52] shadow-xl transition-transform duration-300 group-hover:scale-110"><Play className="ml-0.5 h-6 w-6 fill-current" /></span>
              </button>
              <div className="border-l-4 border-[#d3a725] bg-[#f7f2e7] p-7 sm:p-9"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ad8618]">{featuredVideo.language} · {featuredVideo.duration}</p><h3 className="mt-4 font-serif text-3xl font-bold leading-tight text-[#063760]">Discover, create and connect.</h3><p className="mt-5 text-base leading-7 text-[#456374]">See how scientific exchange, active research and human connection come together at the Faculty of Science, Cairo University.</p><button type="button" onClick={() => setSelectedVideo(featuredVideo)} className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.12em] text-[#063760] underline decoration-[#d3a725] decoration-2 underline-offset-8">Play featured film <Play className="h-4 w-4 fill-current" /></button></div>
            </div>
          </div>
        </section>

        <section className="bg-[#edf4f3] py-20 md:py-28">
          <div className="container">
            <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end"><div><p className="sci-eyebrow">More from SCI 2027</p><h2 className="mt-4 font-serif text-4xl font-bold leading-[1.04] tracking-[-0.035em] text-[#063760] sm:text-5xl">Choose your perspective.</h2></div><p className="max-w-sm text-sm leading-7 text-[#617986]">Every film opens in a focused player while keeping this page available beneath it.</p></div>
            <div className="mt-12 grid items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
              {remainingVideos.map((video) => <article key={video.id} className="flex h-full flex-col overflow-hidden border border-[#063760]/12 bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#d3a725] hover:shadow-xl">
                <button type="button" onClick={() => setSelectedVideo(video)} className={`group relative w-full overflow-hidden bg-[#062f52] text-left focus:outline-none focus:ring-4 focus:ring-[#d3a725]/35 ${video.aspect === "portrait" ? "mx-auto max-w-[310px]" : ""}`} aria-label={`Play ${video.title}`}>
                  <div className={`${aspectClasses[video.aspect]} overflow-hidden`}><img src={video.posterUrl} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" /></div>
                  <div className="absolute inset-0 bg-[#051f35]/20 transition group-hover:bg-[#051f35]/35" aria-hidden="true" />
                  <span className="absolute inset-0 m-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#e5bd4a] text-[#062f52] shadow-xl transition-transform duration-300 group-hover:scale-110"><Play className="ml-0.5 h-5 w-5 fill-current" /></span>
                  <span className="absolute bottom-3 left-3 rounded-full bg-[#062f52]/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur">{video.duration}</span>
                </button>
                <div className="flex flex-1 flex-col p-6"><h3 className="font-serif text-2xl font-bold leading-tight text-[#063760]">{video.title}</h3><p className="mt-4 text-sm leading-7 text-[#617986]">{video.description}</p><VideoMeta video={video} /><button type="button" onClick={() => setSelectedVideo(video)} className="mt-6 inline-flex w-fit items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[#063760] underline decoration-[#d3a725] decoration-2 underline-offset-8">Watch now <ArrowUpRight className="h-3.5 w-3.5" /></button></div>
              </article>)}
            </div>
          </div>
        </section>
      </main>

      {selectedVideo && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#03182a]/90 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={`Video player: ${selectedVideo.title}`}>
        <button type="button" onClick={() => setSelectedVideo(null)} className="absolute inset-0 cursor-default" aria-label="Close video player" />
        <div className="relative z-10 w-full max-w-5xl overflow-hidden border border-white/20 bg-[#062f52] shadow-2xl">
          <div className="flex items-start justify-between gap-6 border-b border-white/10 px-5 py-4 sm:px-6"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#f0ca57]">SCI 2027 promotional film</p><h2 className="mt-1 font-serif text-lg font-bold text-white sm:text-xl">{selectedVideo.title}</h2></div><button type="button" onClick={() => setSelectedVideo(null)} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-[#f0ca57] hover:text-[#f0ca57]" aria-label="Close video player"><X className="h-5 w-5" /></button></div>
          <div className="bg-black"><video src={selectedVideo.url} poster={selectedVideo.posterUrl} controls playsInline preload="metadata" className="mx-auto max-h-[72vh] w-full bg-black">Your browser does not support the video tag.</video></div>
          <div className="flex flex-col justify-between gap-3 px-5 py-4 text-sm text-[#c1d3dc] sm:flex-row sm:items-center sm:px-6"><span>{selectedVideo.description}</span><span className="shrink-0 font-bold text-[#f0ca57]">{selectedVideo.language} · {selectedVideo.duration}</span></div>
        </div>
      </div>}

      <Sci2027Footer />
    </div>
  );
}
