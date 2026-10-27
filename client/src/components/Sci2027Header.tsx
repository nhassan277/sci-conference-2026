import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { sci2027Content } from "@/data/sci2027Content";

const navigation = [
  { href: "#about", label: "About" },
  { href: "#tracks", label: "Tracks" },
  { href: "/programme", label: "Programme" },
  { href: "#dates", label: "Dates" },
  { href: "#registration", label: "Register" },
];

export default function Sci2027Header() {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#0a4065]/10 bg-[#fffdf8]/92 backdrop-blur-xl">
      <div className="container flex h-[76px] items-center justify-between gap-4">
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="SCI 2027 home">
          <img
            src={sci2027Content.assets.sci2027Logo}
            alt="SCI 2027"
            className="h-11 w-11 shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0 leading-tight">
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#ad8618]">
              Cairo University · Faculty of Science
            </p>
            <p className="font-serif text-lg font-bold text-[#063760] sm:text-xl">SCI 2027</p>
          </div>
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-6 lg:flex">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-xs font-bold uppercase tracking-[0.1em] text-[#35536a] transition-colors hover:text-[#ad8618]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={sci2027Content.registration.general.url}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-full bg-[#063760] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-[0_8px_20px_rgba(6,55,96,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#0a507e] sm:inline-flex"
          >
            Register now
          </a>
          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#063760]/15 text-[#063760] lg:hidden"
            aria-label={isOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-[#063760]/10 bg-[#fffdf8] px-4 py-5 shadow-xl lg:hidden">
          <nav aria-label="Mobile navigation" className="container grid gap-1">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 text-sm font-bold text-[#063760] transition-colors hover:bg-[#e9f1f2]"
              >
                {item.label}
              </a>
            ))}
            <a
              href={sci2027Content.registration.general.url}
              target="_blank"
              rel="noreferrer"
              className="mt-3 rounded-xl bg-[#063760] px-4 py-3 text-center text-sm font-bold text-white"
            >
              Register now
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
