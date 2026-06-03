"use client";

import { motion, useReducedMotion } from "motion/react";

export default function DecisionAtlasVisual() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      {/* Mobile-only Simplified Layout */}
      <div className="block lg:hidden w-full bg-midnight-surface/50 border border-warm-white/10 rounded-2xl p-5 backdrop-blur-sm shadow-xl">
        {/* Compact Top Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: shouldReduceMotion ? 0.2 : 0.4,
            delay: shouldReduceMotion ? 0.05 : 0.7,
            ease: "easeOut"
          }}
          className="flex items-center justify-between border-b border-warm-white/5 pb-3 mb-4"
        >
          <div className="flex flex-col gap-0.5">
            <span className="data-label text-[9px] tracking-wider text-warm-white/40 font-mono uppercase">JEE Main Rank</span>
            <span className="data-label text-sm font-semibold text-warm-white font-mono">48,240</span>
          </div>
          <span className="data-label text-[9px] font-semibold text-route-amber font-mono bg-route-amber/10 border border-route-amber/25 px-2.5 py-0.5 rounded-full uppercase">
            ★ Target Route
          </span>
        </motion.div>

        {/* Selected Recommendation Card & Route Summary Layout */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: shouldReduceMotion ? 0.2 : 0.4,
              delay: shouldReduceMotion ? 0.1 : 0.85,
              ease: "easeOut"
            }}
            className="flex-1 bg-midnight/90 border border-route-amber/20 rounded-xl p-4 flex flex-col gap-3"
          >
            <div>
              <h3 className="text-xs font-semibold text-warm-white tracking-wide uppercase">
                LNCT BHOPAL
              </h3>
              <p className="text-[11px] text-warm-white/70 mt-0.5">
                Computer Science Engineering
              </p>
            </div>
            
            <div className="py-1 px-2.5 bg-route-amber/10 border border-route-amber/20 rounded w-fit">
              <span className="data-label text-[10px] font-bold text-route-amber font-mono">
                84 / 100 MATCH
              </span>
            </div>

            {/* Match Indicators (Max 3) */}
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 border-t border-warm-white/5 pt-2.5 text-[10px] text-warm-white/50">
              <span className="flex items-center gap-1 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-route-amber" />Exact branch</span>
              <span className="flex items-center gap-1 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-route-amber" />Within budget</span>
              <span className="flex items-center gap-1 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-route-amber" />Bhopal</span>
            </div>
          </motion.div>

          {/* Three-Status Route Summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: shouldReduceMotion ? 0.2 : 0.4,
              delay: shouldReduceMotion ? 0.15 : 1.0,
              ease: "easeOut"
            }}
            className="flex sm:flex-col justify-between sm:justify-center gap-3 py-3 bg-midnight/40 border border-warm-white/5 rounded-xl px-4 sm:min-w-[120px]"
          >
            <div className="flex items-center gap-2 opacity-40">
              <div className="w-2 h-2 rounded-full bg-dream" />
              <span className="data-label text-[9px] font-semibold text-warm-white/60 font-mono">DREAM</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-route-amber" />
              <span className="data-label text-[9px] font-semibold text-route-amber font-mono">TARGET</span>
            </div>
            <div className="flex items-center gap-2 opacity-40">
              <div className="w-2 h-2 rounded-full bg-route-emerald" />
              <span className="data-label text-[9px] font-semibold text-warm-white/60 font-mono">SAFE</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Desktop-only Map Layout */}
      <div className="hidden lg:block relative w-full aspect-[1.3/1] bg-midnight-surface/50 border border-warm-white/10 rounded-2xl p-6 overflow-hidden backdrop-blur-sm shadow-xl">
        {/* Background SVG Grid and Connecting Lines */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none" 
          viewBox="0 0 500 380" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(245, 243, 238, 0.02)" strokeWidth="1" />
            </pattern>
            <linearGradient id="targetGradient" x1="80" y1="190" x2="280" y2="190" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="var(--color-route-indigo)" />
              <stop offset="100%" stopColor="var(--color-route-amber)" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Route to Dream (Dashed) */}
          <motion.path 
            d="M 80 190 C 180 190, 220 76, 380 76" 
            stroke="var(--color-dream)" 
            strokeWidth="1.5" 
            strokeDasharray="4 4" 
            fill="none" 
            initial={shouldReduceMotion ? { opacity: 0, pathLength: 1 } : { pathLength: 0, opacity: 0.4 }}
            animate={{ pathLength: 1, opacity: 0.4 }}
            transition={{
              pathLength: { duration: 0.5, delay: 0.95, ease: "easeOut" },
              opacity: { duration: shouldReduceMotion ? 0.2 : 0.1, delay: shouldReduceMotion ? 0.05 : 0.95 }
            }}
          />
          
          {/* Route to Safe */}
          <motion.path 
            d="M 80 190 C 180 190, 220 304, 380 304" 
            stroke="var(--color-route-emerald)" 
            strokeWidth="1.5" 
            fill="none" 
            initial={shouldReduceMotion ? { opacity: 0, pathLength: 1 } : { pathLength: 0, opacity: 0.5 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{
              pathLength: { duration: 0.5, delay: 0.95, ease: "easeOut" },
              opacity: { duration: shouldReduceMotion ? 0.2 : 0.1, delay: shouldReduceMotion ? 0.05 : 0.95 }
            }}
          />

          {/* Route to Target (Active Recommendation) */}
          <motion.path 
            d="M 80 190 L 260 190" 
            stroke="url(#targetGradient)" 
            strokeWidth="2" 
            fill="none" 
            initial={shouldReduceMotion ? { opacity: 0, pathLength: 1 } : { pathLength: 0, opacity: 0.9 }}
            animate={{ pathLength: 1, opacity: 0.9 }}
            transition={{
              pathLength: { duration: 0.4, delay: 0.8, ease: "easeOut" },
              opacity: { duration: shouldReduceMotion ? 0.2 : 0.1, delay: shouldReduceMotion ? 0.05 : 0.8 }
            }}
          />
          <motion.path 
            d="M 260 190 L 380 190" 
            stroke="var(--color-route-amber)" 
            strokeWidth="2.5" 
            fill="none" 
            initial={shouldReduceMotion ? { opacity: 0, pathLength: 1 } : { pathLength: 0, opacity: 0.95 }}
            animate={{ pathLength: 1, opacity: 0.95 }}
            transition={{
              pathLength: { duration: 0.3, delay: 1.15, ease: "easeOut" },
              opacity: { duration: shouldReduceMotion ? 0.2 : 0.1, delay: shouldReduceMotion ? 0.05 : 1.15 }
            }}
          />
        </svg>

        {/* Top Left: JEE Main Rank Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: shouldReduceMotion ? 0.2 : 0.4,
            delay: shouldReduceMotion ? 0.05 : 0.7,
            ease: "easeOut"
          }}
          className="absolute top-4 left-4 flex flex-col gap-0.5 bg-midnight/90 py-2 px-3 rounded-lg border border-warm-white/5 shadow-sm"
        >
          <span className="data-label text-[8px] tracking-wider text-warm-white/40 font-mono uppercase">JEE Main Rank</span>
          <span className="data-label text-sm font-semibold text-warm-white font-mono">48,240</span>
        </motion.div>

        {/* Origin Node: Your Profile */}
        <div className="absolute left-[8%] top-[50%] -translate-y-1/2 flex flex-col items-center gap-2 z-10">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: shouldReduceMotion ? 0.2 : 0.3,
              delay: shouldReduceMotion ? 0.05 : 0.7,
              ease: "easeOut"
            }}
            className="flex flex-col items-center gap-2"
          >
            <div className="relative flex items-center justify-center">
              <div className="w-5 h-5 rounded-full bg-route-indigo/20 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-route-indigo" />
              </div>
            </div>
            <span className="data-label text-[8px] tracking-widest text-warm-white/40 font-mono whitespace-nowrap">YOUR PROFILE</span>
          </motion.div>
        </div>

        {/* Dream Node */}
        <div className="absolute left-[70%] top-[20%] -translate-y-1/2 flex items-center gap-2.5 z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: shouldReduceMotion ? 0.2 : 0.3,
              delay: shouldReduceMotion ? 0.05 : 1.45,
              ease: "easeOut"
            }}
            className="flex items-center gap-2.5"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-dream/60 border border-dream" />
            <div className="flex flex-col">
              <span className="data-label text-[8px] tracking-wider text-dream font-mono">DREAM</span>
              <span className="text-[10px] text-warm-white/70 font-medium">SGSITS Indore</span>
              <span className="text-[8px] text-warm-white/45 font-mono">Computer Science</span>
            </div>
          </motion.div>
        </div>

        {/* Target Node: LNCT Bhopal CSE Recommendation Card */}
        <div className="absolute left-[30%] top-[50%] -translate-y-1/2 z-20 w-[190px] xl:w-[215px]">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: shouldReduceMotion ? 0.2 : 0.5,
              delay: shouldReduceMotion ? 0.05 : 1.15,
              ease: "easeOut"
            }}
            className="bg-midnight/95 border border-route-amber/30 rounded-xl p-3.5 shadow-xl flex flex-col gap-2 backdrop-blur-md"
          >
            {/* Header */}
            <div className="flex flex-col gap-0.5">
              <h4 className="text-[9px] font-semibold text-route-amber uppercase tracking-wider font-sans">
                ★ Target Route
              </h4>
              <h3 className="text-xs font-semibold text-warm-white tracking-wide">
                LNCT BHOPAL
              </h3>
              <p className="text-[10px] text-warm-white/70">
                Computer Science Engineering
              </p>
            </div>

            {/* Match Score */}
            <div className="py-0.5 px-2 bg-route-amber/10 border border-route-amber/20 rounded w-fit">
              <span className="data-label text-[8px] font-semibold text-route-amber font-mono">
                MATCH SCORE 84 / 100
              </span>
            </div>

            {/* Supporting Indicators */}
            <div className="flex flex-col gap-1 border-t border-warm-white/5 pt-2 text-[9px] text-warm-white/50">
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-route-amber" />
                <span>Branch: Exact Match</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-route-amber" />
                <span>Budget: Within Limit</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-route-amber" />
                <span>City: Bhopal</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Target Endpoint Node */}
        <div className="absolute left-[70%] top-[50%] -translate-y-1/2 flex items-center gap-2.5 z-10 pl-[4px]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: shouldReduceMotion ? 0.2 : 0.3,
              delay: shouldReduceMotion ? 0.05 : 1.4,
              ease: "easeOut"
            }}
            className="flex items-center gap-2.5"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-route-amber/60 border border-route-amber" />
            <div className="flex flex-col">
              <span className="data-label text-[8px] tracking-wider text-route-amber font-mono">SELECTED ROUTE</span>
            </div>
          </motion.div>
        </div>

        {/* Safe Node */}
        <div className="absolute left-[70%] top-[80%] -translate-y-1/2 flex items-center gap-2.5 z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: shouldReduceMotion ? 0.2 : 0.3,
              delay: shouldReduceMotion ? 0.05 : 1.45,
              ease: "easeOut"
            }}
            className="flex items-center gap-2.5"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-route-emerald/60 border border-route-emerald" />
            <div className="flex flex-col">
              <span className="data-label text-[8px] tracking-wider text-route-emerald font-mono">SAFE</span>
              <span className="text-[10px] text-warm-white/70 font-medium">MITS Gwalior</span>
              <span className="text-[8px] text-warm-white/45 font-mono">Information Tech.</span>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
