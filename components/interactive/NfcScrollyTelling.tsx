"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Suspense, lazy } from "react";
import { Application, SPEObject } from "@splinetool/runtime";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CHIP_SCALE } from "@/components/HorizontalGallery";

gsap.registerPlugin(ScrollTrigger);

const Spline = lazy(() => import("@splinetool/react-spline"));

/**
 * NfcScrollyTelling — Client Component (Master 3D Scene Controller)
 *
 * Architecture:
 *  - Loads a single Spline scene into a FIXED background canvas (z-0).
 *  - Captures 3D object refs via `findObjectByName()`.
 *  - GSAP is the EXCLUSIVE puppeteer — no Spline emitEvent, no internal actions.
 *
 * Brutalist Typography Hero:
 *  - On load: chip is scaled to CHIP_SCALE (massive), centered dead-center.
 *  - A massive "SHEMOQMEDI" text element overlays the chip at z-30.
 *  - A single ScrollTrigger on #hero-scroll-container (h-[200vh]) drives BOTH:
 *      • DOM text: scale up + fade out (first 50% of scroll)
 *      • 3D chip:  scale down to normal + multi-axis rotation (same scrub)
 *
 * Exposes chipRef + appRef via onChipReady so HorizontalGallery can bind
 * its own synchronized rotation timeline.
 */

/** The normal UI-size scale the chip settles at after the hero scroll. */
const CHIP_FINAL_SCALE = 0.5;

interface NfcScrollyTellingProps {
  sceneUrl: string;
  /** Called when the Spline chip is ready — passes app + chip for gallery sync */
  onChipReady?: (app: Application, chip: SPEObject) => void;
}

export default function NfcScrollyTelling({
  sceneUrl,
  onChipReady,
}: NfcScrollyTellingProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const chipObjRef = useRef<SPEObject | null>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  const [splineLoaded, setSplineLoaded] = useState(false);

  const onLoad = useCallback(
    (app: Application) => {
      appRef.current = app;

      const ntagChip = app.findObjectByName("NFC_Coaster");

      if (ntagChip) {
        chipObjRef.current = ntagChip;

        // ── Initial State: Chip dominates the viewport ──────────────────────
        // Scale up massively so it fills center of screen
        gsap.set(ntagChip.scale, {
          x: CHIP_SCALE,
          y: CHIP_SCALE,
          z: CHIP_SCALE,
        });

        // Dead center in the camera's view
        gsap.set(ntagChip.position, { x: 0, y: 0 });

        app.requestRender();

        // Notify parent so HorizontalGallery can bind its rotation timeline
        onChipReady?.(app, ntagChip);
      } else {
        console.warn(
          "[NfcScrollyTelling] NFC_Coaster not found. Available objects:",
          app.getAllObjects().map((o) => o.name)
        );
      }

      setSplineLoaded(true);
    },
    [onChipReady]
  );

  // Cleanup WebGL context on unmount
  useEffect(() => {
    return () => {
      appRef.current?.dispose();
    };
  }, []);

  /* ── Hero GSAP Timeline (Brutalist Push-Through) ─────────────────────────
   * A single ScrollTrigger on #hero-scroll-container drives both the DOM
   * text and the 3D chip in perfect lock-step.
   *
   * Waits for splineLoaded so chipObjRef.current is guaranteed populated.
   */
  useEffect(() => {
    if (!splineLoaded) return;

    const heroText = document.getElementById("hero-shemoqmedi-text");
    const scrollContainer = document.getElementById("hero-scroll-container");
    if (!heroText || !scrollContainer) return;

    const chip = chipObjRef.current;
    const app = appRef.current;

    const ctx = gsap.context(() => {
      // Shared ScrollTrigger config — the single source of truth
      const sharedTrigger: ScrollTrigger.Vars = {
        trigger: scrollContainer,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
      };

      const heroTl = gsap.timeline({ scrollTrigger: sharedTrigger });

      // ── Act 1 (0% → 50%): Text scales up and burns out ─────────────────
      // The massive lettermark explodes toward the camera and vanishes,
      // revealing the 3D chip settling behind it.
      heroTl.to(
        heroText,
        {
          scale: 3.5,
          opacity: 0,
          letterSpacing: "0.15em",
          duration: 0.5,
          ease: "power2.in",
        },
        0 // Start at the very beginning of the scroll
      );

      // ── Act 1 (0% → 100%): Chip scales down to product size + rotates ──
      // The chip "settles" from its massive hero state to a refined UI size
      // with a premium multi-axis tumble.
      if (chip && app) {
        heroTl.to(
          chip.scale,
          {
            x: CHIP_FINAL_SCALE,
            y: CHIP_FINAL_SCALE,
            z: CHIP_FINAL_SCALE,
            duration: 1,
            ease: "power2.inOut",
          },
          0 // Synchronized: starts at the same scroll position as the text
        );

        heroTl.to(
          chip.rotation,
          {
            y: chip.rotation.y + Math.PI * 1.5,
            z: chip.rotation.z + Math.PI * 0.25,
            duration: 1,
            ease: "power1.inOut",
          },
          0 // Also synchronized from scroll start
        );
      }
    });

    ctxRef.current = ctx;
    return () => ctx.revert();
  }, [splineLoaded]);

  return (
    <div ref={wrapperRef}>
      {/* ═══════════════════════════════════════════════════════
          Layer 1 (z-0): Fixed Spline 3D Canvas
          100vw × 100vh, pointer-events: none.
          The chip is scaled to CHIP_SCALE and centered on load.
          ═══════════════════════════════════════════════════════ */}
      <div className="fixed inset-0 w-full h-dvh z-0 pointer-events-none">
        <Suspense
          fallback={
            <div className="w-full h-full bg-black" aria-hidden="true" />
          }
        >
          <Spline scene={sceneUrl} onLoad={onLoad} />
        </Suspense>
      </div>

      {/* ═══════════════════════════════════════════════════════
          Layer 5 (z-30): Brutalist Typography — "SHEMOQMEDI"
          Absolute centered, spans the full viewport width,
          pointer-events: none so it never blocks interactions.
          Initial state: full opacity, normal scale.
          GSAP will scale-up + fade-out on scroll.
          ═══════════════════════════════════════════════════════ */}
      <div
        className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <h1
          id="hero-shemoqmedi-text"
          style={{
            fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
            fontSize: "clamp(4rem, 14vw, 18rem)",
            fontWeight: 900,
            letterSpacing: "-0.02em",
            color: "#ffffff",
            lineHeight: 1,
            textAlign: "center",
            width: "100vw",
            margin: 0,
            padding: "0 2vw",
            willChange: "transform, opacity",
            transformOrigin: "center center",
          }}
        >
          SHEMOQMEDI
        </h1>
      </div>

      {/* ═══════════════════════════════════════════════════════
          Layer 6 (z-40): Hero Scroll Container
          200vh of scroll distance drives the push-through timeline.
          h-[200vh] as specified in the brief.
          ═══════════════════════════════════════════════════════ */}
      <div
        id="hero-scroll-container"
        className="relative z-40 h-[200vh]"
        aria-hidden="true"
      />
    </div>
  );
}
