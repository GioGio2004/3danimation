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
 *  - Loads a single Spline scene into a FIXED background canvas (Layer 2, z-0).
 *  - Captures 3D object refs via `findObjectByName()`.
 *  - GSAP is the EXCLUSIVE puppeteer — no Spline emitEvent, no internal actions.
 *
 * Responsibilities:
 *  1. Render the fixed Spline canvas (Layer 2).
 *  2. On load: scale the chip to hero size and center it in the viewport.
 *  3. Hero Flow: invisible scroll wrapper (Layer 6, z-40, h-[300vh]) drives
 *     the hero card fade-in/out timeline.
 *  4. Expose chipRef + appRef via callback so HorizontalGallery can create
 *     its synchronized 3D rotation timeline on the same trigger.
 */

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
  const ctxRef = useRef<gsap.Context | null>(null);
  const [splineLoaded, setSplineLoaded] = useState(false);

  const onLoad = useCallback(
    (app: Application) => {
      appRef.current = app;

      const ntagChip = app.findObjectByName("NFC_Coaster");

      if (ntagChip) {
        // ── Command the Viewport: Scale & Center ──
        // Scale the chip up to hero size so it dominates the screen
        gsap.set(ntagChip.scale, {
          x: CHIP_SCALE,
          y: CHIP_SCALE,
          z: CHIP_SCALE,
        });

        // Center the chip in the camera's view
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

  /* ── Hero GSAP Timeline (2D DOM only) ──
   * Runs on mount. Drives the hero glass card fade-in → fade-out
   * tied to the invisible hero scroll wrapper (h-[300vh]).
   */
  useEffect(() => {
    const heroCard = document.getElementById("hero-glass-card");
    const scrollWrapper = document.getElementById("hero-scroll-wrapper");
    if (!heroCard || !scrollWrapper) return;

    const ctx = gsap.context(() => {
      // Force GSAP to own the initial state
      gsap.set(heroCard, { opacity: 0, y: 30 });

      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollWrapper,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      // Fade in the hero glassmorphic card (0.15 → 0.65)
      heroTl.to(
        heroCard,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        0.15
      );

      // Fade out the hero card before gallery section (0.75 → 1.0)
      heroTl.to(
        heroCard,
        {
          opacity: 0,
          y: -40,
          duration: 0.25,
          ease: "power2.in",
        },
        0.75
      );
    });

    ctxRef.current = ctx;
    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef}>
      {/* ═══════════════════════════════════════════════════════
          Layer 2 (z-0): Fixed Spline 3D Canvas
          100vw × 100vh, pointer-events: none by default.
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
          Layer 6 (z-40): Invisible Hero Scroll Wrapper
          Provides 300vh of scroll distance for the hero timeline.
          ═══════════════════════════════════════════════════════ */}
      <div
        id="hero-scroll-wrapper"
        className="relative z-40 h-[300vh]"
        aria-hidden="true"
      />
    </div>
  );
}
