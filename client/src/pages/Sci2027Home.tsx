import {
  ArrowDown,
  ArrowUpRight,
  CalendarDays,
  Check,
  Download,
  ExternalLink,
  FileText,
  Landmark,
  Mail,
  MapPin,
  Network,
  Rocket,
  Sparkles,
  UsersRound,
} from "lucide-react";
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

export default function Sci2027Home() {
  const { identity, assets } = sci2027Content;

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
                <img src={assets.sci2027Logo} alt="SCI 2027 logo" className="h-16 w-16 rounded-full border border-white/15 object-cover shadow-2xl sm:h-20 sm:w-20" />
                <div className="h-px w-12 bg-[#e5bd4a]" />
                <p dir="rtl" className="text-sm font-bold text-[#e5bd4a]">المؤتمر الدولي الأول لكلية العلوم، جامعة القاهرة</p>
              </div>

              <h1 className="mt-7 max-w-4xl font-serif text-5xl font-bold leading-[0.97] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
                Science at the <span className="text-[#f0ca57]">Core</span> of Innovation
              </h1>
              <p dir="rtl" className="mt-5 text-right font-sans text-2xl font-bold leading-relaxed text-[#dce9ee] sm:text-3xl">
                العلوم في قلب الابتكار
              </p>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#c1d3dc] sm:text-xl">{identity.theme.en}</p>
              <p dir="rtl" className="mt-2 max-w-2xl text-right text-base leading-7 text-[#dce9ee]">{identity.theme.ar}</p>

              <div className="mt-9 grid max-w-2xl gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 border-l-2 border-[#e5bd4a] bg-white/[0.06] px-4 py-3 backdrop-blur-sm">
                  <CalendarDays className="h-5 w-5 shrink-0 text-[#f0ca57]" />
                  <div>
                    <p className="text-sm font-bold">{identity.dates.en}</p>
                    <p dir="rtl" className="mt-0.5 text-xs text-[#b9ccd7]">{identity.dates.ar}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 border-l-2 border-[#e5bd4a] bg-white/[0.06] px-4 py-3 backdrop-blur-sm">
                  <MapPin className="h-5 w-5 shrink-0 text-[#f0ca57]" />
                  <div>
                    <p className="text-sm font-bold">Cairo University Conference Center</p>
                    <p dir="rtl" className="mt-0.5 text-xs text-[#b9ccd7]">مركز المؤتمرات، جامعة القاهرة</p>
                  </div>
                </div>
              </div>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href={sci2027Content.registration.general.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e5bd4a] px-6 py-3.5 text-sm font-extrabold uppercase tracking-[0.12em] text-[#062f52] shadow-[0_12px_30px_rgba(0,0,0,0.22)] transition-all hover:-translate-y-0.5 hover:bg-[#f5d670]"
                >
                  Register now <ArrowUpRight className="h-4 w-4" />
                </a>
                <a href="#about" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-sm font-bold text-white transition hover:border-[#e5bd4a] hover:text-[#f5d670]">
                  Discover SCI 2027 <ArrowDown className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md animate-[sci-rise_900ms_120ms_ease-out_both]">
              <div className="absolute -inset-5 rotate-3 border border-[#e5bd4a]/30" aria-hidden="true" />
              <div className="absolute -bottom-7 -left-7 z-10 hidden max-w-[180px] bg-[#e5bd4a] px-5 py-4 text-[#062f52] shadow-xl sm:block">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em]">SCI 2027</p>
                <p className="mt-1 font-serif text-xl font-bold leading-tight">Research. Partnership. Impact.</p>
              </div>
              <img src={assets.detailedPoster} alt="Official SCI 2027 conference poster" className="relative z-0 w-full border border-white/20 bg-white shadow-[0_30px_65px_rgba(0,0,0,0.42)]" />
            </div>
          </div>
        </section>

        <section className="border-b border-[#063760]/10 bg-[#f7f2e7]">
          <div className="container grid divide-y divide-[#063760]/10 py-3 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:py-0">
            <a href={assets.brochureEnglish} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-3 py-3 sm:px-5 sm:py-4">
              <span className="flex items-center gap-3"><FileText className="h-4 w-4 text-[#ad8618]" /><span><b className="block text-xs text-[#063760]">English brochure</b><small className="text-[11px] text-[#708795]">Official conference guide</small></span></span>
              <Download className="h-4 w-4 text-[#ad8618] transition-transform group-hover:translate-y-0.5" />
            </a>
            <a href={assets.brochureArabic} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-3 py-3 sm:px-5 sm:py-4" dir="rtl">
              <span className="flex items-center gap-3"><FileText className="h-4 w-4 text-[#ad8618]" /><span><b className="block text-xs text-[#063760]">الكتيب العربي</b><small className="text-[11px] text-[#708795]">دليل المؤتمر الرسمي</small></span></span>
              <Download className="h-4 w-4 text-[#ad8618] transition-transform group-hover:translate-y-0.5" />
            </a>
            <Link href="/programme" className="group flex items-center justify-between gap-3 py-3 sm:px-5 sm:py-4">
              <span className="flex items-center gap-3"><CalendarDays className="h-4 w-4 text-[#ad8618]" /><span><b className="block text-xs text-[#063760]">Preliminary programme</b><small className="text-[11px] text-[#708795]">7–9 April 2027 overview</small></span></span>
              <ArrowUpRight className="h-4 w-4 text-[#ad8618] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </section>

        <section id="about" className="scroll-mt-24 py-20 md:py-28">
          <div className="container grid gap-12 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <p className="sci-eyebrow">Science, partnership and impact</p>
              <h2 className="mt-4 max-w-lg font-serif text-4xl font-bold leading-[1.04] tracking-[-0.035em] text-[#063760] sm:text-5xl">A new international chapter for science at Cairo University.</h2>
              <p dir="rtl" className="mt-5 max-w-lg text-right text-lg font-bold leading-8 text-[#617986]">فصل دولي جديد للعلوم في جامعة القاهرة.</p>
              <div className="mt-8 border-l-4 border-[#d3a725] bg-[#edf4f3] px-5 py-5">
                <p className="text-sm font-bold leading-6 text-[#063760]">{sci2027Content.organizer.name.en}</p>
                <p dir="rtl" className="mt-2 text-right text-sm leading-6 text-[#58717e]">{sci2027Content.organizer.name.ar}</p>
              </div>
            </div>

            <div>
              <p className="text-lg leading-8 text-[#456374] sm:text-xl">{sci2027Content.overview.en}</p>
              <p dir="rtl" className="mt-6 text-right text-lg leading-9 text-[#456374]">{sci2027Content.overview.ar}</p>
              <div className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
                {sci2027Content.objectives.map((objective, index) => (
                  <div key={objective.en} className="border-t border-[#063760]/15 pt-4">
                    <p className="font-serif text-2xl font-bold text-[#d3a725]">0{index + 1}</p>
                    <p className="mt-2 text-sm font-bold leading-6 text-[#063760]">{objective.en}</p>
                    <p dir="rtl" className="mt-2 text-right text-sm leading-6 text-[#617986]">{objective.ar}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#073960] py-16 text-white md:py-20">
          <div className="container">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="sci-eyebrow text-[#f0ca57]">Conference at a glance</p>
                <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">A platform designed for scientific exchange.</h2>
              </div>
              <p className="max-w-lg text-sm leading-6 text-[#b9ccd7]">Figures reflect the official conference brochure and planned programme structure, not confirmed attendance.</p>
            </div>
            <div className="mt-10 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-5">
              {sci2027Content.impact.map((item) => (
                <div key={item.value + item.label.en} className="bg-[#073960] px-5 py-7">
                  <p className="font-serif text-4xl font-bold text-[#f0ca57]">{item.value}</p>
                  <p className="mt-2 text-sm font-semibold leading-5 text-white">{item.label.en}</p>
                  <p dir="rtl" className="mt-1 text-right text-xs text-[#b9ccd7]">{item.label.ar}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="tracks" className="scroll-mt-24 py-20 md:py-28">
          <div className="container">
            <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <p className="sci-eyebrow">Scientific tracks</p>
                <h2 className="mt-4 max-w-2xl font-serif text-4xl font-bold leading-tight tracking-[-0.035em] text-[#063760] sm:text-5xl">Six connected tracks. One shared ambition.</h2>
                <p dir="rtl" className="mt-4 text-right text-lg font-bold text-[#617986] md:text-left">ستة محاور مترابطة، وطموح علمي مشترك.</p>
              </div>
              <p className="max-w-sm text-sm leading-6 text-[#617986]">Each track connects fundamental investigation to applications, partnerships and sustainable impact.</p>
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {sci2027Content.tracks.map((track) => (
                <article key={track.number} className={`group relative min-h-[290px] overflow-hidden border p-6 transition-all hover:-translate-y-1 hover:shadow-xl ${trackStyles[track.color]}`}>
                  <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-extrabold text-white ${trackNumberStyles[track.color]}`}>{track.number}</span>
                  <h3 className="mt-6 font-serif text-2xl font-bold leading-tight">{track.en}</h3>
                  <p dir="rtl" className="mt-2 text-right text-sm font-bold leading-6">{track.ar}</p>
                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] opacity-75">{track.focus.en}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {track.topics.slice(0, 3).map((topic) => <span key={topic} className="rounded-full border border-current/15 bg-white/45 px-2.5 py-1 text-[11px] font-semibold">{topic}</span>)}
                  </div>
                  <p className="absolute bottom-5 right-6 font-serif text-6xl font-bold opacity-[0.06]">0{track.number}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="dates" className="scroll-mt-24 bg-[#edf4f3] py-20 md:py-24">
          <div className="container grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="sci-eyebrow">Important dates</p>
              <h2 className="mt-4 font-serif text-4xl font-bold leading-[1.05] tracking-[-0.035em] text-[#063760] sm:text-5xl">Put SCI 2027 in your research calendar.</h2>
              <p dir="rtl" className="mt-4 text-right text-lg font-bold leading-8 text-[#617986]">أضف SCI 2027 إلى أجندتك البحثية.</p>
              <a href="#registration" className="mt-8 inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.12em] text-[#063760] underline decoration-[#d3a725] decoration-2 underline-offset-8">Registration options <ArrowDown className="h-4 w-4" /></a>
            </div>
            <div className="grid gap-3">
              {sci2027Content.importantDates.map((milestone, index) => (
                <div key={milestone.date + milestone.en} className="grid grid-cols-[auto_1fr] gap-4 border border-[#063760]/10 bg-[#fffdf8] p-4 sm:grid-cols-[148px_1fr_auto] sm:items-center sm:gap-6 sm:p-5">
                  <p className="font-serif text-lg font-bold text-[#ad8618]">{milestone.date}</p>
                  <div><p className="text-sm font-bold text-[#063760]">{milestone.en}</p><p dir="rtl" className="mt-1 text-right text-sm text-[#617986]">{milestone.ar}</p></div>
                  <span className="hidden font-serif text-2xl font-bold text-[#063760]/15 sm:block">0{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="container grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[1.75rem] bg-[#f8f3e7] p-7 sm:p-10">
              <div className="flex items-center gap-3 text-[#ad8618]"><Network className="h-5 w-5" /><p className="text-xs font-bold uppercase tracking-[0.2em]">Call for abstracts</p></div>
              <h2 className="mt-5 max-w-2xl font-serif text-4xl font-bold leading-[1.04] tracking-[-0.035em] text-[#063760]">{sci2027Content.abstractCall.title.en}</h2>
              <p dir="rtl" className="mt-3 text-right text-xl font-bold text-[#617986]">{sci2027Content.abstractCall.title.ar}</p>
              <p className="mt-6 max-w-2xl text-base leading-7 text-[#456374]">{sci2027Content.abstractCall.description.en}</p>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {sci2027Content.abstractCall.requirements.map((requirement) => (
                  <li key={requirement} className="flex gap-2.5 text-sm leading-6 text-[#35536a]"><Check className="mt-1 h-4 w-4 shrink-0 text-[#ad8618]" />{requirement}</li>
                ))}
              </ul>
              <div className="mt-8 border-l-4 border-[#d3a725] bg-white/70 px-5 py-4"><p className="text-sm font-bold text-[#063760]">{sci2027Content.abstractCall.status.en}</p><p dir="rtl" className="mt-2 text-right text-sm text-[#617986]">{sci2027Content.abstractCall.status.ar}</p></div>
            </div>

            <div className="flex flex-col justify-between rounded-[1.75rem] bg-[#063760] p-7 text-white sm:p-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f0ca57]">Publication & impact</p>
                <h3 className="mt-5 font-serif text-3xl font-bold leading-tight">From a focused abstract to a wider contribution.</h3>
                <p className="mt-5 text-sm leading-7 text-[#c1d3dc]">Accepted abstracts may be considered for the conference abstract book. Further full-paper and publication opportunities are subject to editorial approval, journal requirements and peer review.</p>
              </div>
              <a href={`mailto:${sci2027Content.contact.email}?subject=SCI%202027%20inquiry`} className="mt-10 inline-flex items-center justify-between border-t border-white/20 pt-5 text-sm font-bold text-[#f0ca57]">Ask an SCI 2027 question <Mail className="h-4 w-4" /></a>
            </div>
          </div>
        </section>

        <section className="bg-[#062f52] py-20 text-white md:py-28">
          <div className="container">
            <div className="grid gap-7 md:grid-cols-[1fr_auto] md:items-end">
              <div><p className="sci-eyebrow text-[#f0ca57]">Programme & workshops</p><h2 className="mt-4 max-w-3xl font-serif text-4xl font-bold leading-[1.05] tracking-[-0.035em] sm:text-5xl">Three days that move from ideas to action.</h2></div>
              <Link href="/programme" className="inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.12em] text-[#f0ca57]">Full preliminary programme <ArrowUpRight className="h-4 w-4" /></Link>
            </div>
            <div className="mt-12 grid gap-4 lg:grid-cols-3">
              {sci2027Content.programme.map((day) => (
                <article key={day.date} className="border border-white/15 bg-white/[0.06] p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#f0ca57]">{day.date}</p>
                  <h3 className="mt-4 font-serif text-2xl font-bold">{day.day.en}</h3>
                  <p dir="rtl" className="mt-2 text-right text-sm text-[#d5e0e6]">{day.day.ar}</p>
                  <p className="mt-5 border-l-2 border-[#e5bd4a] pl-3 text-sm font-semibold leading-6 text-white">{day.purpose.en}</p>
                  <ul className="mt-6 space-y-3 border-t border-white/10 pt-5">{day.sessions.slice(0, 3).map((session) => <li key={session.en} className="flex gap-2 text-sm leading-6 text-[#c1d3dc]"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#e5bd4a]" />{session.en}</li>)}</ul>
                </article>
              ))}
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              {sci2027Content.workshops.map((workshop) => (
                <div key={workshop.en} className="border border-white/10 px-4 py-5"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#f0ca57]">Track {workshop.track}</p><p className="mt-3 text-sm font-bold leading-6">{workshop.en}</p><p dir="rtl" className="mt-3 text-right text-xs leading-5 text-[#b9ccd7]">{workshop.ar}</p><p className="mt-4 text-[11px] text-[#9db5c2]">{workshop.timing.en}</p></div>
              ))}
            </div>
          </div>
        </section>

        <section id="registration" className="scroll-mt-24 py-20 md:py-28">
          <div className="container">
            <div className="text-center"><p className="sci-eyebrow">Join the conversation</p><h2 className="mt-4 font-serif text-4xl font-bold tracking-[-0.035em] text-[#063760] sm:text-5xl">Find the right way to participate.</h2><p dir="rtl" className="mt-4 text-lg font-bold text-[#617986]">اختر المسار المناسب لمشاركتك.</p></div>
            <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-2">
              {[sci2027Content.registration.general, sci2027Content.registration.speaker].map((option, index) => (
                <article key={option.name.en} className={`relative overflow-hidden border p-7 sm:p-9 ${index === 0 ? "border-[#063760] bg-[#063760] text-white" : "border-[#d3a725]/35 bg-[#f8f3e7] text-[#063760]"}`}>
                  <div className="flex items-start justify-between gap-5"><div><p className={`text-xs font-bold uppercase tracking-[0.18em] ${index === 0 ? "text-[#f0ca57]" : "text-[#ad8618]"}`}>Official SCI 2027 form</p><h3 className="mt-4 font-serif text-3xl font-bold">{option.name.en}</h3><p dir="rtl" className={`mt-2 text-right text-base font-bold ${index === 0 ? "text-[#d5e0e6]" : "text-[#617986]"}`}>{option.name.ar}</p></div><UsersRound className={`h-7 w-7 ${index === 0 ? "text-[#f0ca57]" : "text-[#ad8618]"}`} /></div>
                  <p className={`mt-7 text-sm leading-7 ${index === 0 ? "text-[#c1d3dc]" : "text-[#456374]"}`}>{option.description.en}</p>
                  <p dir="rtl" className={`mt-4 text-right text-sm leading-7 ${index === 0 ? "text-[#d5e0e6]" : "text-[#617986]"}`}>{option.description.ar}</p>
                  <a href={option.url} target="_blank" rel="noreferrer" className={`mt-8 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-extrabold uppercase tracking-[0.12em] transition ${index === 0 ? "bg-[#e5bd4a] text-[#062f52] hover:bg-[#f5d670]" : "bg-[#063760] text-white hover:bg-[#0a507e]"}`}>Open official form <ExternalLink className="h-4 w-4" /></a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f7f2e7] py-16 md:py-20">
          <div className="container grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div><p className="sci-eyebrow">Distinguished patronage</p><h2 className="mt-4 font-serif text-3xl font-bold tracking-[-0.03em] text-[#063760] sm:text-4xl">An institutional meeting point for science and society.</h2><p dir="rtl" className="mt-4 text-right text-lg font-bold text-[#617986]">تحت رعاية جامعة القاهرة وكلية العلوم.</p></div>
            <div className="grid gap-3 sm:grid-cols-2">{sci2027Content.patronage.map((patron) => <div key={patron.name} className="border border-[#063760]/10 bg-white p-5"><Landmark className="h-5 w-5 text-[#ad8618]" /><p className="mt-5 text-sm font-extrabold leading-6 text-[#063760]">{patron.name}</p><p className="mt-1 text-xs leading-5 text-[#617986]">{patron.role}</p><p dir="rtl" className="mt-4 text-right text-xs font-bold leading-5 text-[#456374]">{patron.nameAr}</p><p dir="rtl" className="mt-1 text-right text-xs leading-5 text-[#617986]">{patron.roleAr}</p></div>)}</div>
          </div>
        </section>

        <section className="py-14">
          <div className="container"><Link href="/archive-2026" className="group flex flex-col justify-between gap-6 border border-[#063760]/15 bg-white px-6 py-6 shadow-sm transition hover:border-[#d3a725] hover:shadow-lg md:flex-row md:items-center md:px-8"><div className="flex items-start gap-4"><Rocket className="mt-0.5 h-6 w-6 shrink-0 text-[#ad8618]" /><div><p className="text-sm font-extrabold text-[#063760]">{sci2027Content.archive.title.en}</p><p className="mt-1 max-w-2xl text-sm leading-6 text-[#617986]">{sci2027Content.archive.description.en}</p><p dir="rtl" className="mt-2 text-right text-sm leading-6 text-[#617986] md:text-left">{sci2027Content.archive.description.ar}</p></div></div><span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[#063760]">Open archive <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span></Link></div>
        </section>
      </main>

      <Sci2027Footer />
    </div>
  );
}
