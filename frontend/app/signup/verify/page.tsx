"use client";

import { ExternalLink, FlaskConical, Loader2, MessageCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import AuroraBackground from "@/components/ui/aurora-background";
import { Component as MagicCursor } from "@/components/ui/magic-cursor";
import { apiErrorMessage } from "@/lib/api";
import { useDevSimulateVerify, useVerificationStatus } from "@/lib/queries";
import { useAuthStore } from "@/stores/auth";

const SERIF = "'Instrument Serif', serif";

export default function VerifyPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [deepLink, setDeepLink] = useState<string>("");
  const [userPhone, setUserPhone] = useState<string>("");
  const [devCode, setDevCode] = useState<string | null>(null);

  // Pull stored signup data
  useEffect(() => {
    const id = sessionStorage.getItem("verification_id");
    const link = sessionStorage.getItem("deep_link");
    const phone = sessionStorage.getItem("user_phone_input");
    const code = sessionStorage.getItem("dev_code");

    if (!id || !link) {
      router.replace("/signup");
      return;
    }
    setVerificationId(id);
    setDeepLink(link);
    setUserPhone(phone || "");
    setDevCode(code);
  }, [router]);

  const { data: status } = useVerificationStatus(verificationId);

  // Handle status transitions
  useEffect(() => {
    if (!status) return;
    if (status.status === "verified" && status.access_token && status.user) {
      setAuth(status.access_token, status.user);
      sessionStorage.clear();
      toast.success("Verified!");
      router.replace("/onboarding/business");
    } else if (status.status === "expired") {
      toast.error("Code expired. Please try again.");
      router.replace("/signup");
    }
  }, [status, setAuth, router]);

  const devSim = useDevSimulateVerify();

  async function handleDevSimulate() {
    if (!devCode || !userPhone) return;
    try {
      await devSim.mutateAsync({ phone: userPhone, code: devCode });
      // Polling will pick up the change within 2s
    } catch (err) {
      toast.error(apiErrorMessage(err));
    }
  }

  const expired = status?.status === "expired";
  const waiting = !expired && (status?.status === "pending" || !status);

  return (
    <main className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-white p-4">
      {/* Flowing green aurora + sparkle cursor */}
      <AuroraBackground />
      <MagicCursor colors={["252 254 255", "37 211 102", "52 217 124"]} />

      {/* Home / logo top-left */}
      <Link
        href="/"
        aria-label="Back to home"
        className="group absolute left-5 top-5 z-20 flex items-center gap-2.5"
      >
        <span
          className="inline-block h-8 w-8 rounded-full transition-transform duration-300 group-hover:rotate-12"
          style={{ background: "linear-gradient(135deg,#25d366,#128c7e)" }}
        />
        <span
          className="text-2xl leading-none tracking-tight text-slate-900"
          style={{ fontFamily: SERIF }}
        >
          Whatly
        </span>
      </Link>

      {/* Glass card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/50 bg-white/55 p-6 text-center shadow-[0_30px_90px_-28px_rgba(16,140,126,0.4)] backdrop-blur-2xl sm:p-8"
      >
        {/* WhatsApp icon badge with a "listening" pulse */}
        <div className="mb-6 flex justify-center">
          <span
            className="relative inline-flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-[0_16px_36px_-12px_rgba(37,211,102,0.7)]"
            style={{ background: "linear-gradient(135deg,#25d366,#128c7e)" }}
          >
            {waiting && (
              <span
                aria-hidden
                className="absolute inset-0 rounded-2xl bg-[#25d366]/40 animate-ping"
              />
            )}
            <MessageCircle className="relative h-7 w-7" strokeWidth={2} />
          </span>
        </div>

        <h1 className="text-3xl italic text-slate-900" style={{ fontFamily: SERIF }}>
          Verify via WhatsApp
        </h1>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-500">
          Tap below — WhatsApp opens with a pre-filled message. Just hit send and
          we&apos;ll log you in automatically.
        </p>

        <a
          href={deepLink}
          target="_blank"
          rel="noopener noreferrer"
          className="accent-gradient mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white shadow-soft-lg transition-transform duration-200 active:scale-[0.98]"
        >
          <MessageCircle className="h-5 w-5" strokeWidth={2} />
          Open WhatsApp &amp; Verify
          <ExternalLink className="h-4 w-4" strokeWidth={2} />
        </a>

        <div className="mt-5 flex items-center justify-center gap-2 text-sm text-slate-500">
          {waiting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-[#1faa59]" />
              <span>Waiting for your WhatsApp message…</span>
            </>
          ) : expired ? (
            <span className="font-medium text-rose-500">Verification expired</span>
          ) : null}
        </div>

        {devCode && (
          <div className="mt-6 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/80 p-4 text-left">
            <div className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-amber-900">
              <FlaskConical className="h-3.5 w-3.5" strokeWidth={2} />
              Dev mode
            </div>
            <p className="mb-3 text-xs leading-relaxed text-amber-900/80">
              Simulate the WhatsApp round-trip without the platform&apos;s WA number.
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded-lg border border-amber-300 bg-white px-2 py-1.5 text-center font-mono text-sm text-amber-900">
                {devCode}
              </code>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDevSimulate}
                loading={devSim.isPending}
              >
                Simulate Send
              </Button>
            </div>
          </div>
        )}

        <button
          onClick={() => router.replace("/signup")}
          className="mx-auto mt-6 inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-700"
        >
          <RefreshCw className="h-3.5 w-3.5" strokeWidth={2} />
          Wrong number? Start over
        </button>
      </motion.div>
    </main>
  );
}
