"use client";

import HeroNavbar from "./HeroNavbar";
import DecisionAtlasVisual from "./DecisionAtlasVisual";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";

// Cubic-bezier equivalent of "easeOut" — typed as a tuple to satisfy Motion's Easing type
const EASE_OUT = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

export default function LandingHero() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0.02 : 0.09,
      },
    },
  };

  const itemVariants: Variants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { duration: 0.15 },
        },
      }
    : {
        hidden: { opacity: 0, y: 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: EASE_OUT },
        },
      };

  return (
    <section className="relative w-full min-h-screen lg:h-[90vh] lg:min-h-[600px] lg:max-h-[800px] flex flex-col bg-midnight text-warm-white overflow-hidden bg-[radial-gradient(ellipse_at_top_left,_var(--color-midnight-surface)_0%,_var(--color-midnight)_60%)]">
      {/* Navbar Entrance */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0.15 : 0.55, ease: EASE_OUT }}
        className="w-full z-10"
      >
        <HeroNavbar />
      </motion.div>

      {/* Hero Body Content */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 py-6 md:py-8 lg:pt-10 lg:pb-6 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-10 lg:gap-12 xl:gap-16 z-10 overflow-y-auto lg:overflow-visible">

        {/* Left Column: Staggered Entrance */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 flex flex-col items-start text-left gap-5 lg:gap-6 max-w-2xl w-full"
        >
          {/* Eyebrow Label */}
          <motion.span
            variants={itemVariants}
            className="data-label text-[10px] sm:text-xs font-semibold tracking-widest text-route-indigo font-mono uppercase bg-route-indigo/10 py-1 px-3 rounded-full"
          >
            MP ENGINEERING COUNSELLING · DECISION PLANNER
          </motion.span>

          {/* Headline — three lines staggered independently */}
          <h1 className="display-heading text-4xl sm:text-5xl lg:text-[2.75rem] xl:text-[3.5rem] font-normal leading-[1.1] tracking-tight text-warm-white">
            <motion.span variants={itemVariants} className="block">One rank.</motion.span>
            <motion.span variants={itemVariants} className="block">Hundreds of paths.</motion.span>
            <motion.span variants={itemVariants} className="block text-route-amber">Find yours.</motion.span>
          </h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base text-warm-white/70 leading-relaxed max-w-lg"
          >
            Build an explainable engineering counselling plan using your rank, branch preference, budget and placement priorities.
          </motion.p>

          {/* CTA Buttons & Trust Line */}
          <div className="flex flex-col gap-4 w-full mt-2">
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto"
            >
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
            </motion.div>

            {/* Trust Line */}
            <motion.p
              variants={itemVariants}
              className="data-label text-[10px] sm:text-xs text-warm-white/50 font-mono tracking-wider leading-normal"
            >
              Historical-data guidance · Source-backed decisions · No false guarantees
            </motion.p>
          </div>
        </motion.div>

        {/* Right Column: Decision Atlas Panel Entrance */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: shouldReduceMotion ? 0.2 : 0.7,
            delay: shouldReduceMotion ? 0.15 : 0.5,
            ease: EASE_OUT,
          }}
          className="flex-1 w-full max-w-md lg:max-w-[460px] xl:max-w-[500px]"
        >
          <DecisionAtlasVisual />
        </motion.div>

      </div>
    </section>
  );
}
