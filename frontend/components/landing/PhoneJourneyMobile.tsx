"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MOBILE_STORY, SIGNUP_HREF } from "./content";
import { useHomeContent } from "./useHomeContent";
import { ShinyButton } from "@/components/ui/shiny-button";

/** Stage caption keys (0→3) under the `home.stages` namespace. */
const STAGE_KEYS = ["ask", "reply", "book", "confirmed"] as const;

// R3F Canvas must never be server-rendered.
const Phone3D = dynamic(() => import("./Phone3D"), { ssr: false });

const SERIF = "'Instrument Serif', serif";
const TOTAL = MOBILE_STORY.chat.length; // 6

/** Floating 3D WhatsApp icons: varied sizes, tilted, with a soft green glow.
 *  Some blurred + dimmed for depth. */
const ORBS: {
  size: number;
  left?: string;
  right?: string;
  top: string;
  delay: string;
  rot: number;
  blur?: number;
  opacity?: number;
}[] = [
  { size: 92, left: "2%", top: "38%", delay: "0s", rot: -16 },
  { size: 64, right: "4%", top: "27%", delay: "1.2s", rot: 20 },
  { size: 46, right: "14%", top: "58%", delay: "2.4s", rot: -10, blur: 1, opacity: 0.85 },
  { size: 34, left: "16%", top: "63%", delay: "1.7s", rot: 26, blur: 2, opacity: 0.7 },
  { size: 24, left: "30%", top: "27%", delay: "0.7s", rot: 6, blur: 3, opacity: 0.55 },
];

/** revealCount -> caption stage index. The 4 messages map 1:1 to the 4
 *  captions (Ask / Reply / Book / Confirmed); rounding so the caption flips
 *  as the matching bubble fades in. */
function stageFor(rc: number) {
  return Math.min(3, Math.max(0, Math.round(rc) - 1));
}

/**
 * Mobile-only phone journey (separate from the desktop PhoneJourney, which is
 * untouched). One clinic ↔ customer conversation plays out message-by-message
 * as you scroll: the phone stays centered + big with a green glow, the hero
 * copy fades as it rises, a big one-word caption marks each stage, and a
 * closing line lands at the end.
 */
export default function PhoneJourneyMobile() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null); // phone + icons (fades away at the end)
  const progressRef = useRef(0);
  // Reveal is a ref (not state): Phone3D reads it in its render loop and repaints
  // the chat imperatively, so scrolling never triggers a React re-render here.
  const revealRef = useRef(1);

  const t = useTranslations("home");
  const { mobileStory } = useHomeContent();
  const router = useRouter();

  // Coarse UI state — changes only a handful of times (caption + closing), so
  // these re-renders are cheap.
  const [stage, setStage] = useState(0);
  const [phase, setPhase] = useState<"hero" | "chat" | "closing">("hero");

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const st = ScrollTrigger.create({
      trigger: rootRef.current,
      start: "top top",
      end: "bottom bottom",
      pin: pinRef.current,
      anticipatePin: 1,
      // Snap to discrete message stops (hero → Ask → Reply → Book → Confirmed →
      // closing) so a swipe settles ON a message rather than mid-reveal. Each
      // message gets a generous, EQUAL slice of scroll. NOT directional: snap to
      // the NEAREST stop so a swipe with momentum can't skip a message (which
      // made Book/Confirmed rush past).
      snap: {
        snapTo: [0, 0.12, 0.32, 0.52, 0.72, 0.95],
        duration: { min: 0.3, max: 0.6 },
        delay: 0.05,
        ease: "power2.inOut",
      },
      onUpdate: (self) => {
        const p = self.progress;
        progressRef.current = p;

        // Hero copy fades out as the phone rises (~p 0.01 -> 0.08).
        if (heroRef.current) {
          const o = Math.min(1, Math.max(0, 1 - (p - 0.01) / 0.07));
          heroRef.current.style.opacity = String(o);
          heroRef.current.style.visibility = o < 0.02 ? "hidden" : "visible";
        }
        // (The green glow now lives inside the 3D scene as a plane behind the
        // phone — see Phone3D — so it tracks the device in 3D space.)

        // Reveal messages across p[0.12, 0.72] (one per snap stop), then a brief
        // hold on "Confirmed" before the phone fades + lifts away and the closing
        // line rises up. Fractional → the newest bubble fades + slides up.
        // Rounded to 0.05 (20 steps) so the fade is smooth but redraws stay cheap.
        const raw = 1 + ((p - 0.12) / (0.72 - 0.12)) * (TOTAL - 1);
        const rc = Math.round(Math.max(1, Math.min(TOTAL, raw)) * 20) / 20;
        revealRef.current = rc;
        const newStage = stageFor(rc);
        setStage((prev) => (prev === newStage ? prev : newStage));

        // "Confirmed" lands at p 0.72 and HOLDS until 0.80 (a beat to read it),
        // then the phone (with its glow + icons) fades + lifts away over
        // 0.80 -> 0.93 so the closing words take the stage.
        if (stageRef.current) {
          const out = Math.min(1, Math.max(0, (p - 0.8) / 0.13));
          stageRef.current.style.opacity = String(1 - out);
          stageRef.current.style.transform = `translateY(${-out * 70}px)`;
          stageRef.current.style.visibility = out >= 1 ? "hidden" : "visible";
        }

        const ph = p < 0.12 ? "hero" : p > 0.8 ? "closing" : "chat";
        setPhase((prev) => (prev === ph ? prev : ph));
      },
    });
    return () => st.kill();
  }, []);

  return (
    <div ref={rootRef} id="features" style={{ height: "560vh" }}>
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden bg-white">
        {/* Phone STAGE — floating icons + the 3D phone (with its in-scene glow).
            Fades and lifts away as one once the conversation completes, leaving
            the closing words on a clean canvas. */}
        <div ref={stageRef} className="absolute inset-0 will-change-[transform,opacity]">
          {/* Floating 3D WhatsApp icons around the phone (facil-style particles) */}
          <div aria-hidden className="pointer-events-none absolute inset-0 z-10">
            {ORBS.map((o, i) => (
              <span
                key={i}
                className="animate-float-soft absolute block"
                style={{ left: o.left, right: o.right, top: o.top, animationDelay: o.delay }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/whatsapp-3d.png"
                  alt=""
                  width={o.size}
                  height={o.size}
                  style={{
                    height: o.size,
                    width: o.size,
                    opacity: o.opacity ?? 1,
                    transform: `rotate(${o.rot}deg)`,
                    filter: `drop-shadow(0 12px 22px rgba(37,211,102,0.45))${
                      o.blur ? ` blur(${o.blur}px)` : ""
                    }`,
                  }}
                />
              </span>
            ))}
          </div>

          {/* The single 3D iPhone — centered, big, conversation revealing */}
          <Phone3D progressRef={progressRef} uc={mobileStory} mobileMode revealRef={revealRef} />
        </div>

        <div className="relative h-screen">
          {/* Hero copy — fades out as the phone rises */}
          <div
            ref={heroRef}
            className="pointer-events-none absolute left-1/2 top-[8%] z-20 w-[92%] max-w-md -translate-x-1/2 text-center"
          >
           <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
           >
            <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[0.7rem] uppercase tracking-[0.25em] text-slate-500">
              {t("hero.badge")}
            </span>
            <h1
              className="mb-5 text-5xl italic leading-[0.95] tracking-tight text-slate-900"
              style={{ fontFamily: SERIF }}
            >
              {t.rich("hero.title", {
                em: (c) => <em className="not-italic text-emerald-500">{c}</em>,
                em2: (c) => <em className="not-italic text-slate-400">{c}</em>,
              })}
            </h1>
            <p className="mx-auto mb-7 max-w-sm text-base leading-relaxed text-slate-600">
              {t("hero.subtitle")}
            </p>
            <div className="pointer-events-auto inline-block">
              <ShinyButton onClick={() => router.push(SIGNUP_HREF)}>
                {t("hero.cta")}
              </ShinyButton>
            </div>
            <div className="mt-8 text-xs uppercase tracking-[0.3em] text-slate-400">
              {t("hero.scroll")} ↓
            </div>
           </motion.div>
          </div>

          {/* Big one-word stage caption, below the phone, during the chat. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-[7%] z-20 flex justify-center px-6">
            <AnimatePresence mode="wait">
              {phase === "chat" && (
                <motion.span
                  key={stage}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="text-6xl italic text-slate-900"
                  style={{ fontFamily: SERIF }}
                >
                  {t(`stages.${STAGE_KEYS[stage]}`)}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Closing line — rises up into the centre as the phone fades away. */}
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-8">
            <AnimatePresence>
              {phase === "closing" && (
                <motion.p
                  key="closing"
                  initial={{ opacity: 0, y: 48 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 48 }}
                  transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                  className="max-w-[18rem] text-center text-5xl italic leading-[1.06] text-slate-900"
                  style={{ fontFamily: SERIF }}
                >
                  {t("closing")}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
