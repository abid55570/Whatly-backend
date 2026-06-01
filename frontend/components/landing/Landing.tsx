"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Navbar1 } from "@/components/ui/navbar1";
import SmoothScroll from "./SmoothScroll";
import LoadingScreen from "./LoadingScreen";
import PhoneJourney from "./PhoneJourney";
import PhoneJourneyMobile from "./PhoneJourneyMobile";
import Marquee from "./Marquee";
import BentoWorks from "./BentoWorks";
import Testimonials from "./Testimonials";
import HowItWorks from "./HowItWorks";
import Stats from "./Stats";
import PricingSection from "@/components/ui/pricing-section-4";
import FAQ from "./FAQ";
import HoverFooter from "./HoverFooter";

// Real (smiling) Unsplash portraits, matched to each business type and
// face-cropped for the avatar. `crop=faces` centres on the face.
const U = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=faces&w=200&h=200&q=75`;

/** The marquee audience — Indian SMBs on Whatly, each with a happy owner photo
 *  matched to the trade (chef, doctor, stylist, …). */
const CUSTOMERS: { name: string; image: string }[] = [
  { name: "Tandoori House", image: U("1701878198293-d1f3641efdb3") }, // chef
  { name: "CityCare Clinic", image: U("1673865641073-4479f93a7776") }, // doctor
  { name: "Sharma Kirana", image: U("1753351055056-d612233d8036") }, // shopkeepers
  { name: "Glow Beauty Salon", image: U("1580489944761-15a19d654956") }, // stylist
  { name: "FitZone Gym", image: U("1518617840859-acd542e13a99") }, // trainer
  { name: "Anjali Boutique", image: U("1679492430093-fce51613a570") }, // woman owner
  { name: "Sai Medical", image: U("1612531385446-f7e6d131e1d0") }, // pharmacist
  { name: "Spice Garden", image: U("1565144317118-0655428f4cb6") }, // chef
  { name: "Royal Barbers", image: U("1639511177364-0866c0da16fa") }, // barber
  { name: "Green Leaf Café", image: U("1740512376474-f34f5c8d542a") }, // barista
  { name: "Patel Electronics", image: U("1753351052046-8c6818304a4f") }, // shop owner
  { name: "Bansal Sweets", image: U("1709837167684-47d7ccf0ed89") }, // baker
];

/** Whatly landing — a single phone moves in 3D through the hero + use-case
 *  journey, then the supporting sections follow. */
export default function Landing() {
  const [isLoading, setIsLoading] = useState(true);
  // Mount only ONE journey (one WebGL canvas): the desktop side-to-side flow,
  // or the mobile single-conversation flow. Defaults to desktop for SSR.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <div className="bg-white font-sans text-slate-900">
      <SmoothScroll />
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <Navbar1 />
      <main>
        {/* 3D phone hero + journey — desktop side-to-side, mobile single-chat */}
        {isMobile ? <PhoneJourneyMobile /> : <PhoneJourney />}

        {/* New components, beneath the mockup flow */}
        <Marquee customers={CUSTOMERS} />
        <BentoWorks />
        <Testimonials />

        <HowItWorks />
        <Stats />
        <PricingSection />
        <FAQ />
        <HoverFooter />
      </main>
    </div>
  );
}
