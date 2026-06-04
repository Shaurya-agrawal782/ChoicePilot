"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

const EASE_OUT = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

export default function DecisionStorySection() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0.02 : 0.08,
      },
    },
  };

  const cardVariants: Variants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { duration: 0.2 },
        },
      }
    : {
        hidden: { opacity: 0, y: 18 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: EASE_OUT },
        },
      };

  return (
    <section id="how-it-works" className="relative w-full bg-paper text-ink overflow-hidden -mt-6 lg:-mt-12">
      {/* Subtle curved paper-edge transition from dark hero to warm paper */}
      <div className="relative w-full h-16 bg-midnight pointer-events-none">
        <svg 
          className="absolute bottom-0 left-0 w-full h-12 text-paper fill-current" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0,120 L0,40 Q600,0 1200,40 L1200,120 Z" />
        </svg>
      </div>

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-20 md:pb-28 lg:pb-36">
        {/* Section Header */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: shouldReduceMotion ? 0.25 : 0.6, ease: EASE_OUT }}
          className="max-w-3xl mb-12"
        >
          <span className="data-label text-[10px] sm:text-xs font-semibold tracking-widest text-muted font-mono uppercase">
            HOW A CHOICE IS FORMED
          </span>
          <h2 className="display-heading text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight text-ink mt-3">
            A rank is only the beginning.
          </h2>
          <p className="text-sm sm:text-base text-muted leading-relaxed mt-4">
            The right counselling choice depends on what you can reach, what you can afford, and what you actually want to study.
          </p>
        </motion.div>

        {/* Four Factor Cards Sequence */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {/* Card 01 — Rank */}
          <motion.div variants={cardVariants} className="bg-surface border border-border rounded-xl p-4 sm:p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-baseline mb-3 border-b border-border/40 pb-2">
              <span className="data-label text-[9px] tracking-wider text-muted font-mono uppercase">RANK</span>
              <span className="data-label text-[10px] font-mono text-primary/70">01</span>
            </div>
            <div>
              <div className="data-label text-base sm:text-lg font-semibold text-ink font-mono tracking-tight">
                48,240
              </div>
              <p className="text-[11px] sm:text-xs text-muted leading-relaxed mt-1.5">
                Defines your historical eligibility window.
              </p>
            </div>
          </motion.div>

          {/* Card 02 — Branch */}
          <motion.div variants={cardVariants} className="bg-surface border border-border rounded-xl p-4 sm:p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-baseline mb-3 border-b border-border/40 pb-2">
              <span className="data-label text-[9px] tracking-wider text-muted font-mono uppercase">BRANCH PRIORITY</span>
              <span className="data-label text-[10px] font-mono text-primary/70">02</span>
            </div>
            <div>
              <div className="data-label text-base sm:text-lg font-semibold text-ink font-mono tracking-tight">
                CSE → AI/ML → IT
              </div>
              <p className="text-[11px] sm:text-xs text-muted leading-relaxed mt-1.5">
                Keeps your academic preference visible.
              </p>
            </div>
          </motion.div>

          {/* Card 03 — Budget */}
          <motion.div variants={cardVariants} className="bg-surface border border-border rounded-xl p-4 sm:p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-baseline mb-3 border-b border-border/40 pb-2">
              <span className="data-label text-[9px] tracking-wider text-muted font-mono uppercase">ANNUAL BUDGET</span>
              <span className="data-label text-[10px] font-mono text-primary/70">03</span>
            </div>
            <div>
              <div className="data-label text-base sm:text-lg font-semibold text-ink font-mono tracking-tight">
                ₹1.25L / year
              </div>
              <p className="text-[11px] sm:text-xs text-muted leading-relaxed mt-1.5">
                Filters options your family can plan for.
              </p>
            </div>
          </motion.div>

          {/* Card 04 — Goal */}
          <motion.div variants={cardVariants} className="bg-surface border border-border rounded-xl p-4 sm:p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-baseline mb-3 border-b border-border/40 pb-2">
              <span className="data-label text-[9px] tracking-wider text-muted font-mono uppercase">DECISION PRIORITY</span>
              <span className="data-label text-[10px] font-mono text-primary/70">04</span>
            </div>
            <div>
              <div className="data-label text-base sm:text-lg font-semibold text-ink font-mono tracking-tight">
                Placements
              </div>
              <p className="text-[11px] sm:text-xs text-muted leading-relaxed mt-1.5">
                Changes which realistic choice ranks first.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Static Input-to-Output Connection */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: shouldReduceMotion ? 0.2 : 0.5,
            delay: shouldReduceMotion ? 0.05 : 0.2,
            ease: EASE_OUT
          }}
          className="flex items-center justify-center my-8 sm:my-10 w-full"
        >
          <div className="h-[1px] flex-grow bg-border/60" />
          <span className="data-label text-[8px] sm:text-[9px] tracking-widest text-muted font-mono px-4 uppercase whitespace-nowrap">
            INPUTS RESOLVED INTO ROUTE
          </span>
          <div className="h-[1px] flex-grow bg-border/60" />
        </motion.div>

        {/* Generated Route Outcome Card */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.99 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: shouldReduceMotion ? 0.25 : 0.6,
            delay: shouldReduceMotion ? 0.1 : 0.35,
            ease: EASE_OUT
          }}
          className="max-w-xl mx-auto w-full"
        >
          <div className="bg-surface border border-primary/30 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border/40 pb-3">
              <span className="data-label text-[10px] sm:text-xs font-semibold tracking-widest text-primary font-mono uppercase">
                ★ GENERATED ROUTE
              </span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-dream" />
                  <span className="data-label text-[9px] font-mono text-muted uppercase font-semibold">Dream</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-target" />
                  <span className="data-label text-[9px] font-mono text-muted uppercase font-semibold">Target</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-safe" />
                  <span className="data-label text-[9px] font-mono text-muted uppercase font-semibold">Safe</span>
                </div>
              </div>
            </div>
            <div className="text-left sm:text-center sm:py-2">
              <h3 className="display-heading text-2xl sm:text-3xl lg:text-4xl text-ink font-normal leading-tight">
                3 Dream · 6 Target · 9 Safe
              </h3>
              <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">
                Every result is ranked with visible reasons, not hidden guesses.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
