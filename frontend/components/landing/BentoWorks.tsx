"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useHomeContent } from "./useHomeContent";

const SPANS = ["md:col-span-8", "md:col-span-4", "md:col-span-4", "md:col-span-8", "md:col-span-6", "md:col-span-6"];
// Display order interleaves the gallery (Restaurants, Gyms, Salons, Clinics, Kirana, Boutiques).
const ORDER = [0, 1, 3, 2, 4, 5];

const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 1, ease: [0.25, 0.1, 0.25, 1] as const },
};

export default function BentoWorks() {
  const t = useTranslations("home.bento");
  const { gallery } = useHomeContent();
  const cards = ORDER.map((idx, i) => ({ ...gallery[idx], span: SPANS[i] }));

  return (
    <section id="works" className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        {/* Header */}
        <motion.div {...reveal} className="mb-10 md:mb-14">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-slate-300" />
            <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
              {t("eyebrow")}
            </span>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="max-w-xl font-display-serif text-4xl leading-[1.05] text-slate-900 md:text-6xl">
              {t.rich("title", { em: (c) => <span className="italic text-emerald-600">{c}</span> })}
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-slate-500 md:text-base">
              {t("subtitle")}
            </p>
          </div>
        </motion.div>

        {/* Bento grid */}
        <div className="grid auto-rows-[240px] grid-cols-1 gap-5 md:auto-rows-[340px] md:grid-cols-12 md:gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.08 }}
              className={`group relative h-full overflow-hidden rounded-3xl border border-slate-200 bg-white ${card.span}`}
            >
              <div className="relative h-full w-full overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {/* halftone dots */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-20 mix-blend-multiply"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, #000 1px, transparent 1px)",
                    backgroundSize: "4px 4px",
                  }}
                />
                {/* gradient scrim for label legibility */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent"
                />
                {/* persistent type label */}
                <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-1.5 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur-sm transition-transform duration-500 group-hover:-translate-y-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#25d366]" />
                  {card.title}
                </span>

                {/* hover veil — surfaces the pain Whatly solves for this type */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/80 px-7 text-center opacity-0 backdrop-blur-md transition-opacity duration-500 group-hover:opacity-100">
                  <span className="accent-gradient-animated rounded-full p-[1.5px]">
                    <span className="inline-flex items-center rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-900">
                      {card.title}
                    </span>
                  </span>
                  <p className="max-w-sm font-display-serif text-lg italic leading-snug text-slate-800 md:text-xl">
                    “{card.fact}”
                  </p>
                  <span className="text-xs font-medium text-[#1faa59]">
                    {t("hoverCta")}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
