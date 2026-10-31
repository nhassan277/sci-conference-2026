import {
  ArrowDown,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  FileText,
  GraduationCap,
  Handshake,
  Landmark,
  Mail,
  MapPin,
  Network,
  Play,
  Rocket,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import Sci2027Footer from "@/components/Sci2027Footer";
import Sci2027Header from "@/components/Sci2027Header";
import { sci2027Content } from "@/data/sci2027Content";

const trackStyles = {
  emerald: "border-[#0f8a76]/25 bg-[#eaf7f2] text-[#09695a]",
  cyan: "border-[#187fa2]/25 bg-[#e9f6fa] text-[#126987]",
  rose: "border-[#b13f59]/25 bg-[#fff0f2] text-[#983148]",
  violet: "border-[#7753ae]/25 bg-[#f3effa] text-[#62418f]",
  blue: "border-[#1c5d9f]/25 bg-[#edf4fb] text-[#174b80]",
  amber: "border-[#ba8618]/25 bg-[#fff8e6] text-[#936609]",
} as const;

const trackNumberStyles = {
  emerald: "bg-[#0f8a76]",
  cyan: "bg-[#187fa2]",
  rose: "bg-[#b13f59]",
  violet: "bg-[#7753ae]",
  blue: "bg-[#1c5d9f]",
  amber: "bg-[#ba8618]",
} as const;

const trackImageOverlayStyles = {
  emerald: "from-[#075c50]/85 via-[#075c50]/25 to-transparent",
  cyan: "from-[#0b5875]/85 via-[#0b5875]/25 to-transparent",
  rose: "from-[#8c2941]/85 via-[#8c2941]/25 to-transparent",
  violet: "from-[#573982]/85 via-[#573982]/25 to-transparent",
  blue: "from-[#124674]/85 via-[#124674]/25 to-transparent",
  amber: "from-[#805d0f]/85 via-[#805d0f]/25 to-transparent",
} as const;

const registrationOptions = [
  sci2027Content.registration.general,
  sci2027Content.registration.speaker,
  sci2027Content.registration.studentResearch,
] as const;

const registrationIcons = [UsersRound, Sparkles, GraduationCap] as const;
const registrationCardStyles = [
  "border-[#063760] bg-[#063760] text-white",
  "border-[#d3a725]/35 bg-[#f8f3e7] text-[#063760]",
  "border-[#0d638b]/25 bg-[#edf6fa] text-[#063760]",
] as const;
const registrationAccentStyles = ["text-[#f0ca57]", "text-[#ad8618]", "text-[#0d638b]"] as const;

export default function Sci2027Home() {
  const { identity, assets, speakers, sponsorship, workshopProgramme, publicationOpportunity, registrationFees, abstractCall } = sci2027Content;
  const featuredVideo = sci2027Content.videos.find((video) => video.featured) ?? sci2027Content.videos[0];
  const [venueGalleryPage, setVenueGalleryPage] = useState(0);
  const venueGalleryPages = [
    identity.location.venueGallery.slice(0, 4),
    identity.location.venueGallery.slice(4, 8),
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-[#fffdf8] text-[#17374f]">
      <Sci2027Header />

      <main>
        <section className="relative isolate overflow-hidden bg-[#062f52] text-white">
          <div className="absolute inset-0 sci-network opacity-60" aria-hidden="true" />
          <div className="absolute -left-40 top-28 h-96 w-96 rounded-full bg-[#0b607f]/50 blur-3xl" aria-hidden="true" />
          <div className="absolute -right-32 top-4 h-80 w-80 rounded-full bg-[#d4a928]/15 blur-3xl" aria-hidden="true" />
          <div className="container relative grid gap-12 py-16 lg:grid-cols-[1.12fr_0.88fr] lg:items-center lg:py-24">
            <div className="max-w-3xl animate-[sci-rise_700ms_ease-out_both]">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-[#e5bd4a]/40 bg-[#e5bd4a]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#f5d670]">
                  {identity.conferenceType.en}
                </span>
                <span className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-[#dbe8ec]">Cairo, Egypt</span>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <img src={assets.sci2027Logo} alt="SCI 2027 logo" className="h-24 w-auto object-contain sm:h-28 lg:h-32" />
                <div className="h-px w-12 bg-[#e5bd4a]" />
                <p className="text-sm font-bold text-[#e5bd4a]">The 1st International Conference of the Faculty of Science, Cairo University</p>
              </div>

              <h1 className="mt-7 max-w-4xl font-serif text-5xl font-bold leading-[0.97] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
                Science at the <span className="text-[#f0ca57]">Core</span> of Innovation
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#c1d3dc] sm:text-xl">{identity.theme.en}</p>

              <div className="mt-9 grid max-w-2xl gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 border-l-2 border-[#e5bd4a] bg-white/[0.06] px-4 py-3 backdrop-blur-sm">
                  <CalendarDays className="h-5 w-5 shrink-0 text-[#f0ca57]" />
                  <div><p className="text-sm font-bold">{identity.dates.en}</p><p className="mt-0.5 text-xs text-[#b9ccd7]">Workshop days: 6 and 10 April</p></div>
                </div>
                <div className="flex items-center gap-3 border-l-2 border-[#e5bd4a] bg-white/[0.06] px-4 py-3 backdrop-blur-sm">
                  <MapPin className="h-5 w-5 shrink-0 text-[#f0ca57]" />
                  <div><p className="text-sm font-bold leading-5">{identity.location.name}</p><p className="mt-0.5 text-xs leading-5 text-[#b9ccd7]">{identity.location.shortAddress}</p><a href={identity.location.mapUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#f0ca57] transition hover:text-white">{identity.location.directionsLabel} <ArrowUpRight className="h-3 w-3" /></a></div>
                </div>
              </div>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a href="#registration-fees" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e5bd4a] px-6 py-3.5 text-sm font-extrabold uppercase tracking-[0.12em] text-[#062f52] shadow-[0_12px_30px_rgba(0,0,0,0.22)] transition-all hover:-translate-y-0.5 hover:bg-[#f5d670]">Register now <ArrowUpRight className="h-4 w-4" /></a>
                <a href="#about" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-sm font-bold text-white transition hover:border-[#e5bd4a] hover:text-[#f5d670]">Discover SCI 2027 <ArrowDown className="h-4 w-4" /></a>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md animate-[sci-rise_900ms_120ms_ease-out_both]">
              <div className="absolute -inset-5 rotate-3 border border-[#e5bd4a]/30" aria-hidden="true" />
              <div className="absolute -bottom-7 -left-7 z-10 hidden max-w-[180px] bg-[#e5bd4a] px-5 py-4 text-[#062f52] shadow-xl sm:block"><p className="text-[10px] font-bold uppercase tracking-[0.18em]">SCI 2027</p><p className="mt-1 font-serif text-xl font-bold leading-tight">Research. Partnership. Impact.</p></div>
              <img src={assets.detailedPoster} alt="Official SCI 2027 conference poster" className="relative z-0 w-full border border-white/20 bg-white shadow-[0_30px_65px_rgba(0,0,0,0.42)]" />
            </div>
          </div>
        </section>

        <section className="bg-[#f7f2e7] py-16 md:py-20">
          <div className="container grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="sci-eyebrow">Distinguished patronage</p>
              <h2 className="mt-4 font-serif text-3xl font-bold tracking-[-0.03em] text-[#063760] sm:text-4xl">An institutional meeting point for science and society.</h2>
              <p className="mt-4 max-w-xl text-lg leading-8 text-[#617986]">Held under the patronage of Cairo University and the Faculty of Science.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {sci2027Content.patronage.map((patron) => (
                <article key={patron.name} className="border border-[#063760]/10 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="aspect-[4/5] w-20 shrink-0 overflow-hidden border-2 border-[#d3a725]/55 bg-[#edf4f3] shadow-sm">
                      <img src={patron.photo.url} alt={patron.photo.alt} loading="lazy" className="h-full w-full object-cover object-center" />
                    </div>
                    <div className="min-w-0">
                      <Landmark className="h-5 w-5 text-[#ad8618]" />
                      <p className="mt-3 text-sm font-extrabold leading-6 text-[#063760]">{patron.name}</p>
                      <p className="mt-1 text-xs leading-5 text-[#617986]">{patron.role}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="conference-committees" className="scroll-mt-24 border-b border-[#063760]/10 bg-white py-16 md:py-20">
          <div className="container">
            <div className="max-w-2xl">
              <p className="sci-eyebrow">Conference committees</p>
              <h2 className="mt-4 font-serif text-4xl font-bold leading-[1.04] tracking-[-0.035em] text-[#063760] sm:text-5xl">Guidance and coordination for SCI 2027.</h2>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <article className="border border-[#063760] bg-[#063760] p-7 text-white shadow-[0_20px_45px_rgba(6,55,96,0.16)] sm:p-8">
                <Sparkles className="h-6 w-6 text-[#f0ca57]" />
                <p className="mt-8 text-xs font-extrabold uppercase tracking-[0.18em] text-[#f0ca57]">Scientific Committee</p>
                <p className="mt-4 font-serif text-3xl font-bold">To be announced.</p>
              </article>
              <article className="border border-[#d3a725]/45 bg-[#f8f3e7] p-7 text-[#063760] shadow-sm sm:p-8">
                <UsersRound className="h-6 w-6 text-[#ad8618]" />
                <p className="mt-8 text-xs font-extrabold uppercase tracking-[0.18em] text-[#ad8618]">Organizing Committee</p>
                <p className="mt-4 max-w-md font-serif text-3xl font-bold leading-tight">Conference Organization Unit and its members.</p>
                <Link href="/conference-organization-unit" className="mt-8 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.11em] text-[#063760] underline decoration-[#d3a725] decoration-2 underline-offset-4 transition hover:text-[#ad8618]">Meet the Conference Organization Unit <ArrowUpRight className="h-3.5 w-3.5" /></Link>
              </article>
            </div>
          </div>
        </section>

        <section id="venue" className="scroll-mt-24 border-b border-[#063760]/10 bg-white py-20 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <p className="sci-eyebrow">Venue &amp; Halls</p>
              <h2 className="mt-4 font-serif text-4xl font-bold leading-[1.04] tracking-[-0.035em] text-[#063760] sm:text-5xl">A setting designed for scientific exchange.</h2>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-[#456374]">Explore the Conference Center - Cairo University, from its main auditorium and supporting meeting facilities to its entrance, shared spaces, corridors and atrium.</p>
              <div className="mt-8 max-w-2xl border-l-4 border-[#d3a725] bg-[#f7f2e7] px-5 py-5">
                <div className="flex items-start gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#ad8618]" /><div><p className="text-sm font-extrabold text-[#063760]">{identity.location.name}</p><p className="mt-1 text-sm leading-6 text-[#617986]">{identity.location.shortAddress}</p></div></div>
              </div>
              <a href={identity.location.mapUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#063760] px-5 py-3 text-xs font-extrabold uppercase tracking-[0.1em] text-white transition hover:-translate-y-0.5 hover:bg-[#0a507e]">{identity.location.directionsLabel} <ArrowUpRight className="h-4 w-4" /></a>
              <div className="mt-10">
                <div className="overflow-hidden border border-[#063760]/10 bg-[#f7f2e7] shadow-[0_20px_55px_rgba(6,55,96,0.16)]">
                  <div className="grid grid-cols-2 gap-1 bg-[#fffdf8] p-1">
                    {venueGalleryPages[venueGalleryPage].map((photo) => (
                      <figure key={photo.url} className="aspect-square overflow-hidden bg-[#edf4f3]">
                        <img src={photo.url} alt={photo.alt} loading="lazy" className="h-full w-full object-cover" />
                      </figure>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-center gap-4">
                  <button type="button" onClick={() => setVenueGalleryPage(venueGalleryPage - 1)} disabled={venueGalleryPage === 0} aria-label="Previous venue photographs" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#063760]/15 bg-white text-[#063760] shadow-sm transition hover:border-[#d3a725] hover:text-[#ad8618] disabled:cursor-not-allowed disabled:opacity-35 focus:outline-none focus:ring-4 focus:ring-[#d3a725]/25"><ChevronLeft className="h-4 w-4" /></button>
                  <div className="flex items-center gap-2" aria-label="Venue photo groups">
                    {venueGalleryPages.map((_, pageIndex) => (
                      <button key={pageIndex} type="button" onClick={() => setVenueGalleryPage(pageIndex)} aria-label={`Show venue photo group ${pageIndex + 1}`} aria-current={venueGalleryPage === pageIndex ? "true" : undefined} className={`h-2.5 rounded-full transition-all focus:outline-none focus:ring-4 focus:ring-[#d3a725]/25 ${venueGalleryPage === pageIndex ? "w-8 bg-[#d3a725]" : "w-2.5 bg-[#063760]/20 hover:bg-[#063760]/45"}`} />
                    ))}
                  </div>
                  <button type="button" onClick={() => setVenueGalleryPage(venueGalleryPage + 1)} disabled={venueGalleryPage === venueGalleryPages.length - 1} aria-label="Next venue photographs" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#063760]/15 bg-white text-[#063760] shadow-sm transition hover:border-[#d3a725] hover:text-[#ad8618] disabled:cursor-not-allowed disabled:opacity-35 focus:outline-none focus:ring-4 focus:ring-[#d3a725]/25"><ChevronRight className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[#063760]/10 bg-[#f7f2e7]">
          <div className="container grid divide-y divide-[#063760]/10 py-3 sm:grid-cols-2 sm:divide-x sm:divide-y-0 sm:py-0">
            <a href={assets.brochureEnglish} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-3 py-3 sm:px-5 sm:py-4"><span className="flex items-center gap-3"><FileText className="h-4 w-4 text-[#ad8618]" /><span><b className="block text-xs text-[#063760]">Conference brochure</b><small className="text-[11px] text-[#708795]">Official SCI 2027 guide</small></span></span><Download className="h-4 w-4 text-[#ad8618] transition-transform group-hover:translate-y-0.5" /></a>
            <Link href="/programme" className="group flex items-center justify-between gap-3 py-3 sm:px-5 sm:py-4"><span className="flex items-center gap-3"><CalendarDays className="h-4 w-4 text-[#ad8618]" /><span><b className="block text-xs text-[#063760]">Preliminary programme</b><small className="text-[11px] text-[#708795]">6–10 April 2027 overview</small></span></span><ArrowUpRight className="h-4 w-4 text-[#ad8618] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>
          </div>
        </section>

        <section id="about" className="scroll-mt-24 py-20 md:py-28">
          <div className="container grid gap-12 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <p className="sci-eyebrow">Science, partnership and impact</p>
              <h2 className="mt-4 max-w-lg font-serif text-4xl font-bold leading-[1.04] tracking-[-0.035em] text-[#063760] sm:text-5xl">A new international chapter for science at Cairo University.</h2>
              <div className="mt-8 border-l-4 border-[#d3a725] bg-[#edf4f3] px-5 py-5"><p className="text-sm font-bold leading-6 text-[#063760]">{sci2027Content.organizer.name.en}</p><p className="mt-2 text-sm leading-6 text-[#58717e]">{sci2027Content.organizer.head.en}</p></div>
            </div>
            <div>
              <p className="text-lg leading-8 text-[#456374] sm:text-xl">{sci2027Content.overview.en}</p>
              <div className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
                {sci2027Content.objectives.map((objective, index) => <div key={objective.en} className="border-t border-[#063760]/15 pt-4"><p className="font-serif text-2xl font-bold text-[#d3a725]">0{index + 1}</p><p className="mt-2 text-sm font-bold leading-6 text-[#063760]">{objective.en}</p></div>)}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#073960] py-16 text-white md:py-20">
          <div className="container">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="sci-eyebrow text-[#f0ca57]">Conference at a glance</p><h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">A platform designed for scientific exchange.</h2></div><p className="max-w-lg text-sm leading-6 text-[#b9ccd7]">Figures reflect the official conference brochure and planned programme structure, not confirmed attendance.</p></div>
            <div className="mt-10 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
              {sci2027Content.impact.map((item) => <div key={item.value + item.label.en} className="bg-[#073960] px-5 py-7"><p className="font-serif text-4xl font-bold text-[#f0ca57]">{item.value}</p><p className="mt-2 text-sm font-semibold leading-5 text-white">{item.label.en}</p></div>)}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="container grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div><p className="sci-eyebrow">{speakers.eyebrow}</p><h2 className="mt-4 max-w-lg font-serif text-4xl font-bold leading-[1.04] tracking-[-0.035em] text-[#063760] sm:text-5xl">{speakers.title}</h2><p className="mt-6 max-w-lg text-base leading-7 text-[#617986]">{speakers.status}</p></div>
            <div className="grid gap-4 sm:grid-cols-2">{speakers.groups.map((group, index) => <article key={group.title} className={`relative overflow-hidden border p-7 ${index === 0 ? "border-[#063760] bg-[#063760] text-white" : "border-[#d3a725]/35 bg-[#f8f3e7] text-[#063760]"}`}><UsersRound className={`h-6 w-6 ${index === 0 ? "text-[#f0ca57]" : "text-[#ad8618]"}`} /><p className={`mt-7 text-xs font-bold uppercase tracking-[0.16em] ${index === 0 ? "text-[#f0ca57]" : "text-[#ad8618]"}`}>{group.title}</p><p className="mt-3 font-serif text-3xl font-bold">{group.status}</p><p className={`mt-5 text-sm leading-6 ${index === 0 ? "text-[#c1d3dc]" : "text-[#617986]"}`}>{group.description}</p><span className="absolute bottom-3 right-5 font-serif text-6xl font-bold opacity-[0.07]">0{index + 1}</span></article>)}</div>
          </div>
        </section>

        <section className="bg-[#061f37] py-20 text-white md:py-28">
          <div className="container grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <Link href="/videos" className="group relative block overflow-hidden border border-white/15 bg-[#062f52] shadow-[0_25px_55px_rgba(0,0,0,0.3)] focus:outline-none focus:ring-4 focus:ring-[#d3a725]/35"><div className="aspect-video overflow-hidden"><img src={featuredVideo.posterUrl} alt="SCI 2027 promotional film preview" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" /></div><div className="absolute inset-0 bg-gradient-to-t from-[#03182a]/85 via-transparent to-transparent" aria-hidden="true" /><span className="absolute bottom-6 left-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#e5bd4a] text-[#062f52] shadow-xl transition-transform group-hover:scale-110"><Play className="ml-0.5 h-6 w-6 fill-current" /></span><span className="absolute bottom-7 left-24 text-xs font-bold uppercase tracking-[0.16em] text-white">{featuredVideo.duration} · {featuredVideo.language}</span></Link>
            <div><p className="sci-eyebrow text-[#f0ca57]">Watch SCI 2027</p><h2 className="mt-4 max-w-xl font-serif text-4xl font-bold leading-[1.04] tracking-[-0.035em] sm:text-5xl">Experience the conference before you arrive.</h2><p className="mt-6 max-w-xl text-lg leading-8 text-[#c1d3dc]">{featuredVideo.description}</p><Link href="/videos" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#e5bd4a] px-6 py-3.5 text-sm font-extrabold uppercase tracking-[0.1em] text-[#062f52] transition hover:-translate-y-0.5 hover:bg-[#f5d670]">Watch all four films <ArrowUpRight className="h-4 w-4" /></Link></div>
          </div>
        </section>

        <section id="tracks" className="scroll-mt-24 py-20 md:py-28">
          <div className="container">
            <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end"><div><p className="sci-eyebrow">Scientific tracks</p><h2 className="mt-4 max-w-2xl font-serif text-4xl font-bold leading-tight tracking-[-0.035em] text-[#063760] sm:text-5xl">Six connected tracks. One shared ambition.</h2></div><p className="max-w-sm text-sm leading-6 text-[#617986]">Each track connects fundamental investigation to applications, partnerships and sustainable impact.</p></div>
            <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {sci2027Content.tracks.map((track) => (
                <article key={track.number} className={`group relative overflow-hidden border p-6 pb-16 transition-all hover:-translate-y-1 hover:shadow-xl ${trackStyles[track.color]}`}>
                  <figure className="relative -mx-6 -mt-6 mb-6 h-44 overflow-hidden bg-[#062f52]">
                    <img src={track.visual.url} alt={track.visual.alt} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
                    <div className={`absolute inset-0 bg-gradient-to-t ${trackImageOverlayStyles[track.color]}`} aria-hidden="true" />
                    <figcaption className="absolute bottom-3 left-4 text-[9px] font-bold uppercase tracking-[0.16em] text-white/85">{track.visual.source === "SCI 2027 Original" ? "Original SCI 2027 visual" : "Photography via Unsplash"}</figcaption>
                  </figure>
                  <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-extrabold text-white ${trackNumberStyles[track.color]}`}>{track.number}</span>
                  <h3 className="mt-6 font-serif text-2xl font-bold leading-tight">{track.en}</h3>
                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] opacity-75">{track.focus.en}</p>
                  <div className="mt-6 border-t border-current/15 pt-4"><p className="text-[10px] font-extrabold uppercase tracking-[0.16em] opacity-70">Specialties</p><div className="mt-3 flex flex-wrap gap-2">{track.topics.map((topic) => <span key={topic} className="rounded-full border border-current/15 bg-white/45 px-2.5 py-1 text-[10px] font-semibold leading-4">{topic}</span>)}</div></div>
                  <p className="absolute bottom-4 right-6 font-serif text-6xl font-bold opacity-[0.06]">0{track.number}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="publication-opportunity" className="scroll-mt-24 border-y border-[#d3a725]/25 bg-[#062f52] py-16 text-white md:py-20">
          <div className="container grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-3 text-[#f0ca57]"><FileText className="h-5 w-5" /><p className="text-xs font-bold uppercase tracking-[0.2em]">{publicationOpportunity.title}</p></div>
              <h2 className="mt-5 max-w-2xl font-serif text-4xl font-bold leading-[1.04] tracking-[-0.035em] sm:text-5xl">{publicationOpportunity.journalName}</h2>
              <p className="mt-6 max-w-2xl text-base leading-7 text-[#c1d3dc] sm:text-lg">{publicationOpportunity.description}</p>
            </div>
            <aside className="border border-white/15 bg-white/[0.06] p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#f0ca57]">For participating researchers</p>
              <p className="mt-4 border-l-2 border-[#e5bd4a] pl-4 text-sm leading-6 text-[#dbe8ec]">{publicationOpportunity.notice}</p>
              <div className="mt-6 border border-[#e5bd4a]/45 bg-[#e5bd4a]/10 p-4">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#f0ca57]">{publicationOpportunity.feeCalloutLabel}</p>
                <p className="mt-2 font-serif text-2xl font-bold leading-tight text-white">{registrationFees.publicationOption.feeSummary}</p>
                <p className="mt-3 text-xs leading-5 text-[#dbe8ec]">{registrationFees.publicationOption.condition}</p>
                <a href="#registration-fees" className="mt-4 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.11em] text-[#f0ca57] underline decoration-[#f0ca57]/50 underline-offset-4 transition hover:text-white">{publicationOpportunity.paymentDetailsLinkLabel} <ArrowDown className="h-3.5 w-3.5" /></a>
              </div>
              <a href={publicationOpportunity.url} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#e5bd4a] px-5 py-3 text-sm font-extrabold uppercase tracking-[0.1em] text-[#062f52] transition hover:-translate-y-0.5 hover:bg-[#f5d670]">{publicationOpportunity.ctaLabel} <ArrowUpRight className="h-4 w-4" /></a>
            </aside>
          </div>
        </section>

        <section id="dates" className="scroll-mt-24 bg-[#edf4f3] py-20 md:py-24">
          <div className="container grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <div><p className="sci-eyebrow">Important dates</p><h2 className="mt-4 font-serif text-4xl font-bold leading-[1.05] tracking-[-0.035em] text-[#063760] sm:text-5xl">Put SCI 2027 in your research calendar.</h2><a href="#registration" className="mt-8 inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.12em] text-[#063760] underline decoration-[#d3a725] decoration-2 underline-offset-8">Registration options <ArrowDown className="h-4 w-4" /></a></div>
            <div className="grid gap-3">{sci2027Content.importantDates.map((milestone, index) => <div key={milestone.date + milestone.en} className="grid grid-cols-[auto_1fr] gap-4 border border-[#063760]/10 bg-[#fffdf8] p-4 sm:grid-cols-[148px_1fr_auto] sm:items-center sm:gap-6 sm:p-5"><p className="font-serif text-lg font-bold text-[#ad8618]">{milestone.date}</p><p className="text-sm font-bold text-[#063760]">{milestone.en}</p><span className="hidden font-serif text-2xl font-bold text-[#063760]/15 sm:block">0{index + 1}</span></div>)}</div>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="container grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[1.75rem] bg-[#f8f3e7] p-7 sm:p-10"><div className="flex items-center gap-3 text-[#ad8618]"><Network className="h-5 w-5" /><p className="text-xs font-bold uppercase tracking-[0.2em]">Call for abstracts</p></div><h2 className="mt-5 max-w-2xl font-serif text-4xl font-bold leading-[1.04] tracking-[-0.035em] text-[#063760]">{abstractCall.title.en}</h2><p className="mt-6 max-w-2xl text-base leading-7 text-[#456374]">{abstractCall.description.en}</p><ul className="mt-7 grid gap-3 sm:grid-cols-2">{abstractCall.requirements.map((requirement) => <li key={requirement} className="flex gap-2.5 text-sm leading-6 text-[#35536a]"><Check className="mt-1 h-4 w-4 shrink-0 text-[#ad8618]" />{requirement}</li>)}</ul><div className="mt-8 border-l-4 border-[#d3a725] bg-white/70 px-5 py-4"><p className="text-sm font-bold text-[#063760]">{abstractCall.status.en}</p></div></div>
            <div className="flex flex-col rounded-[1.75rem] bg-[#063760] p-7 text-white sm:p-10"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f0ca57]">Abstract submission</p><h3 className="mt-5 font-serif text-3xl font-bold leading-tight">Choose the path that fits your contribution.</h3><p className="mt-5 text-sm leading-7 text-[#c1d3dc]">Use the relevant official SCI 2027 form to submit your abstract. Please select the route that matches your role and contribution.</p></div><div className="mt-8 grid gap-3">{abstractCall.submissionOptions.map((option, index) => <a key={option.label} href={option.url} target="_blank" rel="noreferrer" className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 border border-white/15 bg-white/[0.06] p-4 transition hover:border-[#e5bd4a] hover:bg-white/[0.1]"><span className="font-serif text-2xl font-bold text-[#f0ca57]">0{index + 1}</span><span><span className="block text-sm font-bold leading-5 text-white">{option.label}</span><span className="mt-1 block text-xs leading-5 text-[#c1d3dc]">{option.audience}</span></span><ArrowUpRight className="h-4 w-4 text-[#f0ca57] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></a>)}</div></div>
          </div>
        </section>

        <section className="bg-[#062f52] py-20 text-white md:py-28">
          <div className="container">
            <div className="grid gap-7 md:grid-cols-[1fr_auto] md:items-end"><div><p className="sci-eyebrow text-[#f0ca57]">Programme & workshops</p><h2 className="mt-4 max-w-3xl font-serif text-4xl font-bold leading-[1.05] tracking-[-0.035em] sm:text-5xl">Four days that move from learning to action.</h2></div><Link href="/programme" className="inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.12em] text-[#f0ca57]">Full preliminary programme <ArrowUpRight className="h-4 w-4" /></Link></div>
            <div className="mt-12 grid gap-4 lg:grid-cols-4">{sci2027Content.programme.map((day) => <article key={day.date} className="border border-white/15 bg-white/[0.06] p-6"><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#f0ca57]">{day.date}</p><h3 className="mt-4 font-serif text-2xl font-bold">{day.day.en}</h3><p className="mt-5 border-l-2 border-[#e5bd4a] pl-3 text-sm font-semibold leading-6 text-white">{day.purpose.en}</p><ul className="mt-6 space-y-3 border-t border-white/10 pt-5">{day.sessions.slice(0, 3).map((session) => <li key={session.en} className="flex gap-2 text-sm leading-6 text-[#c1d3dc]"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#e5bd4a]" />{session.en}</li>)}</ul></article>)}</div>
            <div className="mt-6 grid gap-3 md:grid-cols-2"><div className="border border-white/10 bg-white/[0.05] px-5 py-5"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#f0ca57]">{workshopProgramme.preConference.date}</p><p className="mt-3 text-sm font-bold leading-6">{workshopProgramme.preConference.label}</p><p className="mt-3 text-xs leading-5 text-[#b9ccd7]">{workshopProgramme.status}</p></div><div className="border border-white/10 bg-white/[0.05] px-5 py-5"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#f0ca57]">{workshopProgramme.postConference.date}</p><p className="mt-3 text-sm font-bold leading-6">{workshopProgramme.postConference.label}</p><p className="mt-3 text-xs leading-5 text-[#b9ccd7]">{workshopProgramme.postConference.optionalActivity}</p></div></div>
          </div>
        </section>

        <section className="bg-[#f7f2e7] py-20 md:py-28">
          <div className="container grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="sci-eyebrow">{sponsorship.eyebrow}</p>
              <h2 className="mt-4 max-w-2xl font-serif text-4xl font-bold leading-[1.04] tracking-[-0.035em] text-[#063760] sm:text-5xl">Help turn scientific discovery into lasting impact.</h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#456374]">{sponsorship.description}</p>
              <figure className="relative mt-8 aspect-[16/8] max-w-2xl overflow-hidden border border-[#063760]/10 bg-[#062f52] shadow-md">
                <img src={sponsorship.visual.url} alt={sponsorship.visual.alt} loading="lazy" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#062f52]/65 via-[#062f52]/20 to-transparent" aria-hidden="true" />
                <figcaption className="absolute bottom-3 left-4 text-[9px] font-bold uppercase tracking-[0.16em] text-white/85">Photography via Unsplash</figcaption>
              </figure>
              <Link href="/sponsorship" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#063760] px-6 py-3.5 text-sm font-extrabold uppercase tracking-[0.1em] text-white transition hover:-translate-y-0.5 hover:bg-[#0a507e]">Explore partnership opportunities <ArrowUpRight className="h-4 w-4" /></Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {sponsorship.packages.map((tier) => <div key={tier.tier} className="border border-[#063760]/10 bg-white p-5 shadow-sm"><Handshake className="h-5 w-5 text-[#ad8618]" /><p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-[#617986]">{tier.tier}</p><p className="mt-2 font-serif text-2xl font-bold text-[#063760]">{tier.investment}</p><p className="mt-3 text-xs font-bold leading-5 text-[#617986]">{tier.exhibition}</p></div>)}
            </div>
          </div>
        </section>

        <section id="registration-fees" className="scroll-mt-24 border-y border-[#d3a725]/25 bg-[#062f52] py-20 text-white md:py-28">
          <div className="container">
            <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
              <div>
                <p className="sci-eyebrow text-[#f0ca57]">{registrationFees.eyebrow}</p>
                <h2 className="mt-4 max-w-xl font-serif text-4xl font-bold leading-[1.04] tracking-[-0.035em] sm:text-5xl">{registrationFees.title}</h2>
                <p className="mt-6 max-w-xl text-lg leading-8 text-[#c1d3dc]">{registrationFees.description}</p>
              </div>
              <div className="overflow-x-auto border border-white/15 bg-white/[0.06] shadow-[0_20px_45px_rgba(0,0,0,0.12)]">
                <table className="w-full min-w-[680px] border-collapse text-left">
                  <caption className="sr-only">SCI 2027 registration fee comparison in Egyptian pounds</caption>
                  <thead className="bg-white/[0.08] text-[#f0ca57]">
                    <tr>
                      <th scope="col" className="w-[32%] border-b border-white/15 px-5 py-4 text-[10px] font-extrabold uppercase tracking-[0.15em] sm:px-6">Registration option</th>
                      {registrationFees.audienceGroups.map((group) => <th key={group} scope="col" className="border-b border-l border-white/15 px-4 py-4 text-center text-[10px] font-extrabold uppercase leading-4 tracking-[0.12em] sm:px-5">{group}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {registrationFees.options.map((option, optionIndex) => <tr key={option.label} className={optionIndex === 2 ? "bg-[#e5bd4a]/10" : "bg-transparent"}><th scope="row" className="border-b border-white/10 px-5 py-5 text-sm font-bold leading-5 text-white sm:px-6">{option.label}</th>{option.amounts.map((amount, amountIndex) => <td key={`${option.label}-${registrationFees.audienceGroups[amountIndex]}`} className={`border-b border-l border-white/10 px-4 py-5 text-center font-serif text-xl font-bold sm:px-5 ${amount === "Not available" ? "text-[#b9ccd7]" : "text-[#f0ca57]"}`}>{amount}</td>)}</tr>)}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
              <article className="border border-[#e5bd4a]/45 bg-[#e5bd4a]/10 p-5 sm:p-6">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#f0ca57]">{registrationFees.publicationOption.title}</p>
                <p className="mt-3 text-sm leading-6 text-[#dbe8ec]">{registrationFees.publicationOption.condition}</p>
                <a href="#publication-opportunity" className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.11em] text-[#f0ca57] underline decoration-[#f0ca57]/50 underline-offset-4 transition hover:text-white">Learn about GJSR <ArrowUpRight className="h-3.5 w-3.5" /></a>
              </article>
              {registrationFees.addOns.map((addOn) => <article key={addOn.label} className="border border-white/15 bg-white/[0.06] p-5 sm:p-6"><p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#c1d3dc]">Optional add-on</p><p className="mt-4 font-serif text-2xl font-bold text-white">{addOn.label}</p><p className="mt-3 font-serif text-2xl font-bold text-[#f0ca57]">{addOn.amount}</p><p className="mt-3 text-xs leading-5 text-[#c1d3dc]">{addOn.detail}</p></article>)}
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <article className="border border-[#d3a725]/45 bg-[#f8f3e7] p-6 text-[#063760] sm:p-8">
                <div className="flex items-start justify-between gap-5"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#ad8618]">Payment preparation</p><p className="mt-4 font-serif text-3xl font-bold">Select your matrix total</p></div><FileText className="h-7 w-7 shrink-0 text-[#ad8618]" /></div>
                <p className="mt-5 text-sm leading-7 text-[#456374]">Choose the applicable attendance pathway and audience group above. For the combined GJSR option, payment follows acceptance by the journal.</p>
                <a href="#publication-opportunity" className="mt-6 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.11em] text-[#063760] underline decoration-[#d3a725] decoration-2 underline-offset-4 transition hover:text-[#ad8618]">Learn about the publication opportunity <ArrowUpRight className="h-3.5 w-3.5" /></a>
              </article>

              <article className="border border-white/15 bg-white/[0.06] p-6 sm:p-8">
                <div className="grid gap-7 md:grid-cols-[0.76fr_1.24fr] md:items-start">
                  <div><div className="flex items-center gap-3 text-[#f0ca57]"><Landmark className="h-5 w-5" /><p className="text-xs font-bold uppercase tracking-[0.16em]">Payment details</p></div><p className="mt-5 text-sm leading-6 text-[#c1d3dc]">{registrationFees.payment.instruction}</p><p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-[#f0ca57]">{registrationFees.payment.method} · {registrationFees.payment.bank}</p><p className="mt-2 font-serif text-3xl font-bold tracking-[0.08em] text-white">{registrationFees.payment.identifier}</p></div>
                  <div className="border-l border-white/15 pl-0 md:pl-7"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#f0ca57]">To confirm payment, email</p><ul className="mt-4 space-y-2.5">{registrationFees.receiptDetails.map((detail) => <li key={detail} className="flex gap-2.5 text-sm leading-6 text-[#dbe8ec]"><Check className="mt-1 h-4 w-4 shrink-0 text-[#e5bd4a]" />{detail}</li>)}</ul><p className="mt-5 border-l-2 border-[#e5bd4a] pl-3 text-xs font-bold leading-6 text-white">{registrationFees.confirmationNote}</p><a href={`mailto:${registrationFees.payment.confirmationEmail}?subject=SCI%202027%20payment%20confirmation`} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#e5bd4a] px-5 py-3 text-sm font-extrabold uppercase tracking-[0.1em] text-[#062f52] transition hover:-translate-y-0.5 hover:bg-[#f5d670]">Email payment proof <Mail className="h-4 w-4" /></a></div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="registration" className="scroll-mt-24 py-20 md:py-28">
          <div className="container">
            <div className="text-center"><p className="sci-eyebrow">Join the conversation</p><h2 className="mt-4 font-serif text-4xl font-bold tracking-[-0.035em] text-[#063760] sm:text-5xl">Find the right way to participate.</h2><p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#617986]">Select the official registration form that reflects your role in SCI 2027.</p></div>
            <div className="mx-auto mt-12 grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-3">
              {registrationOptions.map((option, index) => {
                const RegistrationIcon = registrationIcons[index];
                const notice = "notice" in option ? option.notice.en : undefined;
                return (
                  <article key={option.name.en} className={`relative flex flex-col overflow-hidden border p-7 sm:p-8 ${registrationCardStyles[index]}`}>
                    <div className="flex items-start justify-between gap-5"><div><p className={`text-xs font-bold uppercase tracking-[0.18em] ${registrationAccentStyles[index]}`}>Official SCI 2027 form</p><h3 className="mt-4 font-serif text-2xl font-bold leading-tight">{option.name.en}</h3></div><RegistrationIcon className={`h-7 w-7 shrink-0 ${registrationAccentStyles[index]}`} /></div>
                    <p className={`mt-7 text-sm leading-7 ${index === 0 ? "text-[#c1d3dc]" : "text-[#456374]"}`}>{option.description.en}</p>
                    {notice && <p className="mt-5 border-l-2 border-current/30 pl-3 text-xs font-bold leading-6 text-[#0d638b]">{notice}</p>}
                    <a href={option.url} target="_blank" rel="noreferrer" className={`mt-auto inline-flex w-fit items-center gap-2 rounded-full px-5 py-3 pt-3 text-sm font-extrabold uppercase tracking-[0.12em] transition ${index === 0 ? "bg-[#e5bd4a] text-[#062f52] hover:bg-[#f5d670]" : "bg-[#063760] text-white hover:bg-[#0a507e]"}`}>Open official form <ExternalLink className="h-4 w-4" /></a>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-14"><div className="container"><Link href="/archive-2026" className="group flex flex-col justify-between gap-6 border border-[#063760]/15 bg-white px-6 py-6 shadow-sm transition hover:border-[#d3a725] hover:shadow-lg md:flex-row md:items-center md:px-8"><div className="flex items-start gap-4"><Rocket className="mt-0.5 h-6 w-6 shrink-0 text-[#ad8618]" /><div><p className="text-sm font-extrabold text-[#063760]">{sci2027Content.archive.title.en}</p><p className="mt-1 max-w-2xl text-sm leading-6 text-[#617986]">{sci2027Content.archive.description.en}</p></div></div><span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[#063760]">Open archive <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span></Link></div></section>
      </main>

      <Sci2027Footer />
    </div>
  );
}
