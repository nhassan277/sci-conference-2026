import { ArrowUpRight, Facebook, Mail, MapPin, Youtube } from "lucide-react";
import { Link } from "wouter";
import { sci2027Content } from "@/data/sci2027Content";

export default function Sci2027Footer() {
  const { contact } = sci2027Content;

  return (
    <footer className="relative overflow-hidden bg-[#052f52] text-white">
      <div className="absolute inset-0 sci-network opacity-20" aria-hidden="true" />
      <div className="container relative py-14 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_0.8fr_0.9fr]">
          <div><div className="flex items-center gap-4"><img src={sci2027Content.assets.sci2027Logo} alt="SCI 2027" className="h-20 w-auto object-contain sm:h-24" /><div><p className="font-serif text-3xl font-bold">SCI 2027</p><p className="mt-1 max-w-sm text-sm leading-6 text-[#d5e0e6]">{sci2027Content.identity.conferenceType.en}</p></div></div><p className="mt-6 max-w-xl text-sm leading-7 text-[#b9ccd7]">{sci2027Content.overview.en}</p></div>
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e5bd4a]">Explore</p><ul className="mt-5 space-y-3 text-sm text-[#d5e0e6]"><li><a href="/#about" className="transition-colors hover:text-[#e5bd4a]">About SCI 2027</a></li><li><a href="/#tracks" className="transition-colors hover:text-[#e5bd4a]">Scientific tracks</a></li><li><Link href="/programme" className="transition-colors hover:text-[#e5bd4a]">Preliminary programme</Link></li><li><Link href="/videos" className="transition-colors hover:text-[#e5bd4a]">Watch SCI 2027</Link></li><li><Link href="/sponsorship" className="transition-colors hover:text-[#e5bd4a]">Partnerships, Sponsorship &amp; Media</Link></li><li><a href="/#registration" className="transition-colors hover:text-[#e5bd4a]">Registration</a></li><li><Link href="/archive-2026" className="inline-flex items-center gap-1.5 text-[#e5bd4a] transition-colors hover:text-white">SCI 2026 archive <ArrowUpRight className="h-3.5 w-3.5" /></Link></li></ul></div>
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e5bd4a]">Contact</p><ul className="mt-5 space-y-4 text-sm text-[#d5e0e6]"><li className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#e5bd4a]" /><span>{sci2027Content.identity.location.en}</span></li>{contact.officialEmails.map((officialEmail) => <li key={officialEmail} className="flex items-center gap-3"><Mail className="h-4 w-4 shrink-0 text-[#e5bd4a]" /><a href={`mailto:${contact.email}`} className="hover:text-[#e5bd4a]">{officialEmail}</a></li>)}<li className="flex items-center gap-3"><Facebook className="h-4 w-4 shrink-0 text-[#e5bd4a]" /><a href={`https://${contact.facebook}`} target="_blank" rel="noreferrer" className="hover:text-[#e5bd4a]">SCI2027</a></li></ul><div className="mt-7"><a href={contact.youtube.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#e5bd4a]/60 px-4 py-2.5 text-xs font-extrabold uppercase tracking-[0.1em] text-[#f0ca57] transition hover:-translate-y-0.5 hover:border-[#f0ca57] hover:bg-white/10 hover:text-white"><Youtube className="h-4 w-4" />{contact.youtube.label}</a><p className="mt-3 max-w-xs text-xs leading-5 text-[#b9ccd7]">{contact.youtube.description}</p></div><div className="mt-7 flex gap-3"><a href={sci2027Content.assets.brochureEnglish} target="_blank" rel="noreferrer" className="rounded-full border border-white/20 px-3 py-2 text-xs font-bold transition hover:border-[#e5bd4a] hover:text-[#e5bd4a]">Download brochure</a></div></div>
        </div>
        <div className="mt-14 flex justify-between gap-3 border-t border-white/10 pt-6 text-xs text-[#9db5c2]"><p>© 2027 Faculty of Science, Cairo University. All rights reserved.</p><p>Science at the Core of Innovation</p></div>
      </div>
    </footer>
  );
}
