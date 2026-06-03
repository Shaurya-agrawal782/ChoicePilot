import HeroNavbar from "./HeroNavbar";
import DecisionAtlasVisual from "./DecisionAtlasVisual";
import { ArrowRight } from "lucide-react";

export default function LandingHero() {
  return (
    <section className="relative w-full min-h-screen lg:h-screen lg:min-h-[600px] lg:max-h-[850px] flex flex-col bg-midnight text-warm-white overflow-hidden bg-[radial-gradient(ellipse_at_top_left,_var(--color-midnight-surface)_0%,_var(--color-midnight)_60%)]">
      {/* Navbar */}
      <HeroNavbar />

      {/* Hero Body Content */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 py-6 md:py-8 lg:py-10 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-10 lg:gap-12 xl:gap-16 z-10 overflow-y-auto lg:overflow-visible">
        
        {/* Left Column: Headline and CTAs */}
        <div className="flex-1 flex flex-col items-start text-left gap-5 lg:gap-6 max-w-2xl w-full">
          {/* Eyebrow Label */}
          <span className="data-label text-[10px] sm:text-xs font-semibold tracking-widest text-route-indigo font-mono uppercase bg-route-indigo/10 py-1 px-3 rounded-full">
            MP ENGINEERING COUNSELLING · DECISION PLANNER
          </span>

          {/* Headline */}
          <h1 className="display-heading text-4xl sm:text-5xl lg:text-[2.75rem] xl:text-[3.5rem] font-normal leading-[1.1] tracking-tight text-warm-white">
            One rank. <br />
            Hundreds of paths. <br />
            <span className="text-route-amber">Find yours.</span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-warm-white/70 leading-relaxed max-w-lg">
            Build an explainable engineering counselling plan using your rank, branch preference, budget and placement priorities.
          </p>

          {/* CTA Buttons & Trust Line Container */}
          <div className="flex flex-col gap-4 w-full mt-2">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
              <a 
                href="#start" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-midnight bg-warm-white hover:bg-warm-white/95 rounded-full transition-all duration-200 shadow-lg"
              >
                <span>Start My Route</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a 
                href="#explore" 
                className="inline-flex items-center justify-center px-6 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-warm-white border border-warm-white/20 hover:bg-warm-white/5 rounded-full transition-all duration-200"
              >
                Explore Colleges
              </a>
            </div>

            {/* Trust Line */}
            <p className="data-label text-[10px] sm:text-xs text-warm-white/50 font-mono tracking-wider leading-normal">
              Historical-data guidance · Source-backed decisions · No false guarantees
            </p>
          </div>
        </div>

        {/* Right Column: Decision Atlas Visual */}
        <div className="flex-1 w-full max-w-md lg:max-w-[460px] xl:max-w-[500px]">
          <DecisionAtlasVisual />
        </div>

      </div>
    </section>
  );
}
