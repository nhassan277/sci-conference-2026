import {
  ArrowLeft,
  ArrowUpRight,
  BadgeDollarSign,
  Mail,
  Network,
  Presentation,
} from "lucide-react";
import { Link } from "wouter";
import Sci2027Footer from "@/components/Sci2027Footer";
import Sci2027Header from "@/components/Sci2027Header";
import { sci2027Content } from "@/data/sci2027Content";

const tierStyles = {
  Platinum: "border-[#d3a725] bg-[#062f52] text-white",
  Gold: "border-[#063760] bg-[#edf4f3] text-[#063760]",
  Silver: "border-[#0d638b] bg-[#edf6fa] text-[#063760]",
  Bronze: "border-[#b78338] bg-[#fbf2e4] text-[#063760]",
} as const;

const tierLabels = {
  Platinum: "text-[#f0ca57]",
  Gold: "text-[#ad8618]",
  Silver: "text-[#0d638b]",
  Bronze: "text-[#9b6420]",
} as const;

export default function Sci2027Sponsorship() {
  const { sponsorship } = sci2027Content;
  const requestHref = `mailto:${sponsorship.contactEmail}?subject=SCI%202027%20Sponsorship%20Prospectus%20Request`;

  return (
    <div className="min-h-screen bg-[#fffdf8] text-[#17374f]">
      <Sci2027Header />
      <main>
        <section className="relative isolate overflow-hidden bg-[#062f52] text-white">
          <div className="absolute inset-0 sci-network opacity-50" aria-hidden="true" />
          <div className="absolute -right-28 top-12 h-96 w-96 rounded-full bg-[#d3a725]/15 blur-3xl" aria-hidden="true" />
          <div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-[#0d638b]/30 blur-3xl" aria-hidden="true" />
          <div className="container relative grid gap-12 py-16 md:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="max-w-3xl">
              <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#f0ca57] transition hover:text-white"><ArrowLeft className="h-4 w-4" /> Back to SCI 2027</Link>
              <p className="mt-10 text-xs font-bold uppercase tracking-[0.2em] text-[#f0ca57]">{sponsorship.eyebrow}</p>
              <h1 className="mt-4 max-w-3xl font-serif text-5xl font-bold leading-[1.02] tracking-[-0.045em] sm:text-6xl">{sponsorship.title}</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#c1d3dc] sm:text-xl">{sponsorship.description}</p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
                <a href={requestHref} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e5bd4a] px-6 py-3.5 text-sm font-extrabold uppercase tracking-[0.1em] text-[#062f52] transition hover:-translate-y-0.5 hover:bg-[#f5d670]">{sponsorship.ctaLabel}<Mail className="h-4 w-4" /></a>
                <span className="text-sm text-[#c1d3dc]">{sponsorship.contactEmail}</span>
              </div>
            </div>
            <div className="border border-white/15 bg-white/[0.06] p-7 backdrop-blur-sm sm:p-8">
              <Network className="h-7 w-7 text-[#f0ca57]" />
              <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-[#f0ca57]">A partnership platform</p>
              <p className="mt-4 font-serif text-2xl font-bold leading-tight">Connect your organisation with the people and ideas moving science forward.</p>
              <div className="mt-7 grid gap-4 border-t border-white/15 pt-6 sm:grid-cols-2">
                <div><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#9db5c2]">Conference dates</p><p className="mt-2 text-sm font-bold">7–8 April 2027</p></div>
                <div><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#9db5c2]">Location</p><p className="mt-2 text-sm font-bold">Cairo University, Giza</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[#063760]/10 bg-[#f7f2e7] py-16 md:py-20">
          <div className="container">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div><p className="sci-eyebrow">SCI 2026 visibility</p><h2 className="mt-4 font-serif text-4xl font-bold leading-[1.04] tracking-[-0.035em] text-[#063760]">Documented momentum for meaningful partnership.</h2></div>
              <p className="max-w-2xl text-sm leading-7 text-[#617986]">The figures below are presented with their source context. The registration total is an archival record and is not represented as confirmed attendance.</p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {sponsorship.credibility.map((item) => <article key={item.label} className="border border-[#063760]/10 bg-white p-6 shadow-sm"><p className="font-serif text-4xl font-bold text-[#ad8618]">{item.value}</p><h3 className="mt-3 text-sm font-extrabold leading-5 text-[#063760]">{item.label}</h3><p className="mt-3 text-xs leading-5 text-[#617986]">{item.note}</p></article>)}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="container">
            <div className="grid gap-7 md:grid-cols-[1fr_auto] md:items-end">
              <div><p className="sci-eyebrow">Sponsorship packages</p><h2 className="mt-4 max-w-3xl font-serif text-4xl font-bold leading-[1.04] tracking-[-0.035em] text-[#063760] sm:text-5xl">Choose a level of partnership that fits your strategic goals.</h2></div>
              <a href={requestHref} className="inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.12em] text-[#063760] underline decoration-[#d3a725] decoration-2 underline-offset-8">Request the full prospectus <ArrowUpRight className="h-4 w-4" /></a>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {sponsorship.packages.map((tier) => <article key={tier.tier} className={`relative overflow-hidden border p-7 shadow-sm ${tierStyles[tier.tier]}`}>
                <BadgeDollarSign className={`h-7 w-7 ${tierLabels[tier.tier]}`} />
                <p className={`mt-6 text-xs font-bold uppercase tracking-[0.2em] ${tierLabels[tier.tier]}`}>{tier.tier}</p>
                <p className="mt-3 font-serif text-3xl font-bold">{tier.investment}</p>
                <p className={`mt-6 text-sm leading-7 ${tier.tier === "Platinum" ? "text-[#d5e0e6]" : "text-[#456374]"}`}>{tier.summary}</p>
                <div className={`mt-7 space-y-3 border-t pt-5 text-xs font-bold ${tier.tier === "Platinum" ? "border-white/15 text-[#d5e0e6]" : "border-[#063760]/10 text-[#456374]"}`}><p>{tier.exhibition}</p><p>{tier.registrations}</p></div>
              </article>)}
            </div>
          </div>
        </section>

        <section className="bg-[#073960] py-20 text-white md:py-28">
          <div className="container">
            <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
              <div><p className="sci-eyebrow text-[#f0ca57]">Package comparison</p><h2 className="mt-4 font-serif text-4xl font-bold leading-[1.04] tracking-[-0.035em] sm:text-5xl">Every package. Fully transparent.</h2></div>
              <p className="max-w-2xl text-sm leading-7 text-[#c1d3dc]">The full package comparison below reproduces the benefits published in the official SCI 2027 Sponsorship Prospectus.</p>
            </div>
            <div className="mt-12 overflow-x-auto border border-white/15 bg-white/[0.05]">
              <table className="min-w-[980px] w-full border-collapse text-left text-sm">
                <thead className="bg-white/[0.07] text-xs uppercase tracking-[0.14em] text-[#f0ca57]"><tr><th className="w-[32%] px-6 py-5">Benefit</th><th className="px-4 py-5">Platinum</th><th className="px-4 py-5">Gold</th><th className="px-4 py-5">Silver</th><th className="px-4 py-5">Bronze</th></tr></thead>
                <tbody>{sponsorship.benefitMatrix.map((row) => <tr key={row.benefit} className="border-t border-white/10 align-top"><th scope="row" className="px-6 py-5 font-bold leading-6 text-white">{row.benefit}</th><td className="px-4 py-5 leading-6 text-[#d5e0e6]">{row.platinum}</td><td className="px-4 py-5 leading-6 text-[#d5e0e6]">{row.gold}</td><td className="px-4 py-5 leading-6 text-[#d5e0e6]">{row.silver}</td><td className="px-4 py-5 leading-6 text-[#d5e0e6]">{row.bronze}</td></tr>)}</tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="container">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
              <div><p className="sci-eyebrow">Special opportunities</p><h2 className="mt-4 font-serif text-4xl font-bold leading-[1.04] tracking-[-0.035em] text-[#063760] sm:text-5xl">Support a moment that matches your purpose.</h2></div>
              <p className="max-w-2xl text-sm leading-7 text-[#617986]">In addition to the four packages, SCI 2027 offers focused opportunities for organisations that want to support a specific part of the conference experience.</p>
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {sponsorship.specialOpportunities.map((opportunity, index) => <article key={opportunity.title} className="group border border-[#063760]/12 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#d3a725] hover:shadow-xl"><div className="flex items-start justify-between gap-4"><Presentation className="h-6 w-6 shrink-0 text-[#ad8618]" /><span className="font-serif text-3xl font-bold text-[#063760]/10">{String(index + 1).padStart(2, "0")}</span></div><h3 className="mt-8 font-serif text-2xl font-bold leading-tight text-[#063760]">{opportunity.title}</h3><p className="mt-4 text-sm font-extrabold text-[#ad8618]">{opportunity.contribution}</p></article>)}
            </div>
          </div>
        </section>

        <section className="bg-[#f7f2e7] py-20 md:py-24">
          <div className="container grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-3xl"><p className="sci-eyebrow">Start the conversation</p><h2 className="mt-4 font-serif text-4xl font-bold leading-[1.04] tracking-[-0.035em] text-[#063760] sm:text-5xl">Let’s create a partnership with lasting scientific value.</h2><p className="mt-5 text-lg leading-8 text-[#456374]">Request the full sponsorship prospectus by email and the SCI 2027 team will help you identify the most relevant partnership route.</p></div>
            <div className="space-y-4"><a href={requestHref} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#063760] px-6 py-4 text-sm font-extrabold uppercase tracking-[0.1em] text-white transition hover:-translate-y-0.5 hover:bg-[#0a507e]">{sponsorship.ctaLabel}<Mail className="h-4 w-4" /></a><p className="text-center text-sm font-bold text-[#617986]">{sponsorship.contactEmail}</p></div>
          </div>
        </section>
      </main>
      <Sci2027Footer />
    </div>
  );
}
