import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroNavbar() {
  return (
    <nav className="w-full flex items-center justify-between py-5 px-6 md:px-12 bg-transparent z-10">
      {/* Left: Wordmark & Descriptor */}
      <div className="flex items-baseline gap-2.5">
        <Link href="/" className="display-heading text-xl sm:text-2xl font-normal tracking-wide text-warm-white hover:opacity-90 transition-opacity">
          ChoicePilot
        </Link>
        <span className="data-label hidden sm:inline text-[9px] font-medium tracking-widest text-warm-white/40 uppercase">
          The Decision Atlas
        </span>
      </div>

      {/* Center/Right Navigation Links */}
      <div className="hidden md:flex items-center gap-8">
        <Link href="#explore" className="text-xs sm:text-sm font-medium text-warm-white/60 hover:text-warm-white transition-colors">
          Explore Colleges
        </Link>
        <Link href="#how-it-works" className="text-xs sm:text-sm font-medium text-warm-white/60 hover:text-warm-white transition-colors">
          How It Works
        </Link>
        <Link href="#methodology" className="text-xs sm:text-sm font-medium text-warm-white/60 hover:text-warm-white transition-colors">
          Data Methodology
        </Link>
      </div>

      {/* Far Right CTA */}
      <div>
        <Link 
          href="#start" 
          className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-midnight bg-warm-white hover:bg-warm-white/95 rounded-full transition-all duration-200 shadow-md whitespace-nowrap"
        >
          <span>Start My Route</span>
          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </Link>
      </div>
    </nav>
  );
}
