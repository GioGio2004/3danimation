"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Application, SPEObject } from "@splinetool/runtime";

gsap.registerPlugin(ScrollTrigger);

interface OryzoFallSectionProps {
  splineApp: Application | null;
  chipRef: SPEObject | null;
}

const FALL_STATEMENTS = [
  {
    line1: "Zero",
    line2: "Friction.",
    sub: "One tap. Infinite possibilities.",
    position: "top-1/3 left-[8vw]",
    align: "text-left",
  },
  {
    line1: "Endless",
    line2: "Capability.",
    sub: "Every venue. Every interaction. Elevated.",
    position: "top-1/2 right-[8vw] -translate-y-1/2",
    align: "text-right",
  },
  {
    line1: "The New",
    line2: "Standard.",
    sub: "Physical craft. Digital soul.",
    position: "bottom-1/4 left-[12vw]",
    align: "text-left",
  },
];

export default function OryzoFallSection({
  splineApp,
  chipRef,
}: OryzoFallSectionProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
        },
      });

      // ── Text statements: each fades in, holds, fades out ──────────────────
      const textTimings = [
        { start: 0, fadeIn: 0.12, hold: 0.18, fadeOut: 0.12 },
        { start: 0.3, fadeIn: 0.12, hold: 0.15, fadeOut: 0.12 },
        { start: 0.58, fadeIn: 0.12, hold: 0.12, fadeOut: 0.1 },
      ];

      textTimings.forEach(({ start, fadeIn, hold, fadeOut }, i) => {
        const el = textRefs.current[i];
        if (!el) return;
        const line1 = el.querySelector(".fall-line1") as HTMLElement;
        const line2 = el.querySelector(".fall-line2") as HTMLElement;
        const sub = el.querySelector(".fall-sub") as HTMLElement;

        tl.fromTo(
          line1,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: fadeIn * 0.5, ease: "power3.out" },
          start,
        )
          .fromTo(
            line2,
            { y: 45, opacity: 0 },
            { y: 0, opacity: 1, duration: fadeIn * 0.5, ease: "power3.out" },
            start + fadeIn * 0.25,
          )
          .fromTo(
            sub,
            { y: 15, opacity: 0 },
            { y: 0, opacity: 0.4, duration: fadeIn * 0.4, ease: "power2.out" },
            start + fadeIn * 0.5,
          )
          .to(el, { opacity: 1, duration: hold, ease: "none" }, start + fadeIn)
          .to(
            el,
            {
              opacity: 0,
              y: -30,
              duration: fadeOut,
              ease: "power2.in",
            },
            start + fadeIn + hold,
          );
      });

      // ── 3D Chip: Centered fall with side pointing downwards ────────────────
      if (chipRef && splineApp) {
        const startY = chipRef.position.y;
        const startZ = chipRef.position.z;
        const startRotY = chipRef.rotation.y;
        const startScaleX = chipRef.scale.x;
        const startScaleY = chipRef.scale.y;
        const startScaleZ = chipRef.scale.z;

        // Phase 1 (0%–50%): Tilt 90 degrees (side pointing down) and start falling
        tl.to(
          chipRef.rotation,
          {
            x: Math.PI / 2, // 90 degree tilt so the side faces straight down
            y: startRotY + Math.PI * 0.5, // Slow, steady horizontal spin
            z: 0,
            duration: 0.5,
            ease: "power2.inOut",
            immediateRender: false,
          },
          0,
        );

        tl.to(
          chipRef.position,
          {
            x: 0, // Enforce dead center
            y: startY - 40, // Smooth vertical fall
            z: startZ, // Maintain depth
            duration: 0.5,
            ease: "power2.inOut",
            immediateRender: false,
          },
          0,
        );

        // Phase 2 (50%–80%): Continue the vertical fall down the center line
        tl.to(
          chipRef.rotation,
          {
            x: Math.PI / 2, // Lock the side-down orientation
            y: startRotY + Math.PI * 1.5, // Continue slow spin
            z: 0,
            duration: 0.3,
            ease: "none",
            immediateRender: false,
          },
          0.5,
        );

        tl.to(
          chipRef.position,
          {
            x: 0,
            y: startY - 100, // Deeper fall
            z: startZ,
            duration: 0.3,
            ease: "none",
            immediateRender: false,
          },
          0.5,
        );

        // Phase 3 (80%–100%): Subtle scale up for editorial gallery
        tl.to(
          chipRef.scale,
          {
            x: startScaleX * 1.15,
            y: startScaleY * 1.15,
            z: startScaleZ * 1.15,
            duration: 0.2,
            ease: "power2.out",
            immediateRender: false,
          },
          0.8,
        );
      }
    });

    return () => ctx.revert();
  }, [splineApp, chipRef]);

  return (
    <section
      ref={wrapperRef}
      id="oryzo-fall"
      className="relative z-40 h-[300vh] w-full"
    >
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full bg-transparent overflow-hidden pointer-events-none"
      >
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent"
          style={{ height: "100%" }}
        />

        {FALL_STATEMENTS.map((item, i) => (
          <div
            key={`fall-text-${i}`}
            ref={(el) => {
              textRefs.current[i] = el;
            }}
            className={`absolute ${item.position} ${item.align} select-none opacity-0`}
            style={{ maxWidth: "clamp(280px, 40vw, 560px)" }}
          >
            <p
              className="fall-line1 block text-[clamp(3rem,7vw,9rem)] font-black tracking-tighter text-white leading-[0.9] uppercase"
              style={{
                fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
              }}
            >
              {item.line1}
            </p>
            <p
              className="fall-line2 block text-[clamp(3rem,7vw,9rem)] font-black tracking-tighter leading-[0.9] uppercase"
              style={{
                fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
                WebkitTextStroke: "1px rgba(255,255,255,0.3)",
                color: "transparent",
              }}
            >
              {item.line2}
            </p>
            <p
              className="fall-sub mt-4 text-[10px] tracking-[0.4em] uppercase text-white font-light opacity-0"
              style={{
                fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
              }}
            >
              {item.sub}
            </p>
          </div>
        ))}

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-20">
          <p
            className="text-[8px] tracking-[0.5em] uppercase text-white font-light"
            style={{
              fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
            }}
          >
            Continue
          </p>
          <div className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent" />
        </div>
      </div>
    </section>
  );
}
