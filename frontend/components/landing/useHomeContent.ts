"use client";

import { useTranslations } from "next-intl";
import {
  GALLERY,
  SHOWCASE,
  TESTIMONIALS,
  STEPS,
  STATS,
  PLANS,
  FAQS,
  MOBILE_STORY,
  type GalleryItem,
  type Testimonial,
  type Showcase,
  type ChatMsg,
} from "./content";

/** GALLERY order → i18n keys under `home.bento.items`. */
const GALLERY_KEYS = ["restaurants", "gyms", "clinics", "salons", "kirana", "boutiques"] as const;

/**
 * Localized landing content: static layout/images/prices come from content.ts,
 * all human-readable text comes from the active locale's `home` namespace
 * (falling back to English for any not-yet-translated key — see i18n/request.ts).
 */
export function useHomeContent() {
  const t = useTranslations("home");

  const gallery: GalleryItem[] = GALLERY.map((g, i) => ({
    ...g,
    title: t(`bento.items.${GALLERY_KEYS[i]}.title`),
    fact: t(`bento.items.${GALLERY_KEYS[i]}.fact`),
  }));

  const testimonials: Testimonial[] = TESTIMONIALS.map((item, i) => ({
    ...item,
    quote: t(`testimonials.items.${i}.quote`),
    type: t(`testimonials.items.${i}.type`),
  }));

  const steps = STEPS.map((s, i) => ({
    ...s,
    title: t(`how.steps.${i}.title`),
    body: t(`how.steps.${i}.body`),
  }));

  const stats = STATS.map((_, i) => ({
    value: t(`stats.items.${i}.value`),
    label: t(`stats.items.${i}.label`),
  }));

  const plans = PLANS.map((p) => ({
    ...p,
    name: t(`pricing.plans.${p.name.toLowerCase()}.name`),
    features: t.raw(`pricing.plans.${p.name.toLowerCase()}.features`) as string[],
  }));

  const faqs = FAQS.map((_, i) => ({
    q: t(`faq.items.${i}.q`),
    a: t(`faq.items.${i}.a`),
  }));

  const localizeChat = (chat: ChatMsg[], texts: string[]): ChatMsg[] =>
    chat.map((m, i) => ({ ...m, text: texts[i] ?? m.text }));

  const showcase: Showcase[] = SHOWCASE.map((s) => {
    const base = `showcase.items.${s.key}`;
    return {
      ...s,
      title: t(`${base}.title`),
      blurb: t(`${base}.blurb`),
      points: t.raw(`${base}.points`) as string[],
      chat: localizeChat(s.chat, t.raw(`${base}.chat`) as string[]),
    };
  });

  const mobileStory: Showcase = {
    ...MOBILE_STORY,
    chat: localizeChat(MOBILE_STORY.chat, t.raw("mobileStory.chat") as string[]),
  };

  return { gallery, testimonials, steps, stats, plans, faqs, showcase, mobileStory };
}
