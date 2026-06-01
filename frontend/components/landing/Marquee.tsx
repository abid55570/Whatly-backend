"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/** Infinite GSAP marquee band. Renders the list twice and slides -50% for a
 *  seamless loop. Pass `customers` to scroll real businesses (avatar + name);
 *  otherwise `text` is repeated `repeat` times. */
export default function Marquee({
  text = "WHATSAPP AUTOMATION",
  customers,
  repeat = 6,
  duration = 44,
}: {
  text?: string;
  customers?: { name: string; image: string }[];
  repeat?: number;
  duration?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(trackRef.current, {
        xPercent: -50,
        duration,
        ease: "none",
        repeat: -1,
      });
    });
    return () => ctx.revert();
  }, [duration]);

  const Group = () =>
    customers && customers.length ? (
      <>
        {customers.map((c, i) => (
          <span key={i} className="flex items-center gap-3 pr-8 md:gap-4 md:pr-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c.image}
              alt={c.name}
              loading="lazy"
              className="h-11 w-11 rounded-full object-cover object-center ring-2 ring-emerald-400/50 md:h-14 md:w-14"
            />
            <span className="font-display-serif text-2xl italic leading-none text-slate-900 md:text-4xl">
              {c.name}
            </span>
            <span className="pl-4 text-[#25d366] md:pl-6">•</span>
          </span>
        ))}
      </>
    ) : (
      <>
        {Array.from({ length: repeat }).map((_, i) => (
          <span
            key={i}
            className="font-display-serif text-3xl italic leading-none text-slate-900 md:text-5xl"
          >
            {text} <span className="px-3 text-[#25d366]">•</span>
          </span>
        ))}
      </>
    );

  return (
    <section className="overflow-hidden border-y border-slate-200 bg-white py-5 md:py-7">
      <div ref={trackRef} className="flex w-max items-center whitespace-nowrap will-change-transform">
        <Group />
        <Group />
      </div>
    </section>
  );
}
