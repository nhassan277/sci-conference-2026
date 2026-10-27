import { ArrowLeft, ArrowUpRight, Award, Images, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import Sci2027Footer from "@/components/Sci2027Footer";
import Sci2027Header from "@/components/Sci2027Header";

const archiveLinks = [
  {
    icon: Images,
    title: "Conference photo gallery",
    titleAr: "معرض صور المؤتمر",
    description: "Browse the curated photo archive from the SCI 2026 conference.",
    descriptionAr: "استعرض أرشيف الصور المختار من مؤتمر SCI 2026.",
    href: "/live-gallery",
    action: "Open gallery",
  },
  {
    icon: Award,
    title: "Certificate requests",
    titleAr: "طلبات الشهادات",
    description: "Past SCI 2026 attendees can submit or follow up on certificate requests here.",
    descriptionAr: "يمكن لحضور SCI 2026 تقديم طلبات الشهادات أو متابعتها من هنا.",
    href: "/certificate-request",
    action: "Request certificate",
  },
];

export default function Sci2026Archive() {
  return (
    <div className="min-h-screen bg-[#fffdf8] text-[#17374f]">
      <Sci2027Header />
      <main>
        <section className="relative overflow-hidden bg-[#f1ede3] py-16 md:py-24">
          <div className="absolute inset-0 sci-network opacity-20" aria-hidden="true" />
          <div className="container relative max-w-4xl">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#063760] transition hover:text-[#ad8618]"><ArrowLeft className="h-4 w-4" /> Back to SCI 2027</Link>
            <p className="mt-10 text-xs font-extrabold uppercase tracking-[0.2em] text-[#ad8618]">Archived conference resources</p>
            <h1 className="mt-4 font-serif text-5xl font-bold leading-[1.02] tracking-[-0.04em] text-[#063760] sm:text-6xl">SCI 2026 archive</h1>
            <p dir="rtl" className="mt-4 text-right text-2xl font-bold text-[#617986]">أرشيف مؤتمر SCI 2026</p>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#456374]">SCI 2026 took place at the Faculty of Science, Cairo University on 7–8 April 2026. Its current content has been preserved here for participants and institutional reference while the public site moves forward as SCI 2027.</p>
            <p dir="rtl" className="mt-4 max-w-2xl text-right text-base leading-8 text-[#617986]">انعقد SCI 2026 في كلية العلوم، جامعة القاهرة يومي 7–8 أبريل 2026. وقد حُفظت موارده هنا للمشاركين والرجوع المؤسسي، بينما ينتقل الموقع العام إلى SCI 2027.</p>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container max-w-5xl">
            <div className="grid gap-5 md:grid-cols-2">
              {archiveLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a key={item.href} href={item.href} className="group border border-[#063760]/15 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-[#d3a725] hover:shadow-xl">
                    <Icon className="h-8 w-8 text-[#ad8618]" />
                    <h2 className="mt-7 font-serif text-3xl font-bold text-[#063760]">{item.title}</h2>
                    <p dir="rtl" className="mt-2 text-right text-base font-bold text-[#617986]">{item.titleAr}</p>
                    <p className="mt-5 text-sm leading-7 text-[#456374]">{item.description}</p>
                    <p dir="rtl" className="mt-3 text-right text-sm leading-7 text-[#617986]">{item.descriptionAr}</p>
                    <span className="mt-8 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[#063760]">{item.action} <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
                  </a>
                );
              })}
            </div>

            <div className="mt-8 flex gap-4 border-l-4 border-[#d3a725] bg-[#f8f3e7] p-6">
              <ShieldCheck className="h-6 w-6 shrink-0 text-[#ad8618]" />
              <div><p className="text-sm font-bold text-[#063760]">Archive note</p><p className="mt-2 text-sm leading-6 text-[#617986]">SCI 2026 registrations, administration records and historical content are retained for operational and archival purposes. Public SCI 2027 registration is handled only through the current official forms linked on the SCI 2027 homepage.</p></div>
            </div>
          </div>
        </section>
      </main>
      <Sci2027Footer />
    </div>
  );
}
