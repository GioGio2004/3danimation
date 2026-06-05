"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Application, SPEObject } from "@splinetool/runtime";

gsap.registerPlugin(ScrollTrigger);

interface TheImpactSectionProps {
  splineApp: Application | null;
  chipRef: SPEObject | null;
}

const TESTIMONIALS = [
  {
    quote: "“The perfect integration of physical craft and digital magic.”",
    author: "The Griffin Hotel",
  },
  {
    quote: "“Beautifully minimal. Our guests are absolutely obsessed.”",
    author: "Cafe L'Olivier",
  },
  {
    quote: "“The absolute gold standard for modern hospitality venues.”",
    author: "Atelier Noir",
  },
];

type VariantKey = "Standard" | "Pro" | "Elite";

interface VariantDetail {
  price: string;
  description: string;
  features: string[];
}

const VARIANT_DETAILS: Record<VariantKey, VariantDetail> = {
  Standard: {
    price: "$49",
    description:
      "Sleek matte finish. Essential NFC capabilities optimized for quick interactions and seamless guest logins.",
    features: [
      "Matte Polymer Body",
      "Standard Range NFC",
      "Voloo App Core Suite",
    ],
  },
  Pro: {
    price: "$79",
    description:
      "Brushed aluminum bezel. Enhanced range and multi-app support for venues seeking premium performance.",
    features: [
      "Brushed Aluminum Bezel",
      "High-Range Antenna",
      "Custom URL Mapping",
      "Priority Venue Setup",
    ],
  },
  Elite: {
    price: "$149",
    description:
      "Hand-polished obsidian steel. Custom laser engraving and dedicated priority concierge support.",
    features: [
      "Obsidian Steel Frame",
      "Max-Range Coil",
      "Custom Engraving",
      "VIP Support",
      "Lifetime Replacement Warranty",
    ],
  },
};

export default function TheImpactSection({
  splineApp,
  chipRef,
}: TheImpactSectionProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<(HTMLDivElement | null)[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const uiContainerRef = useRef<HTMLDivElement>(null);

  const [activeVariant, setActiveVariant] = useState<VariantKey>("Standard");

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      // 1. Phase 1: Testimonials void scrolling (0% to 60%)
      TESTIMONIALS.forEach((_, index) => {
        const el = testimonialsRef.current[index];
        if (!el) return;

        const startOffset = index * 0.18;

        tl.fromTo(
          el,
          {
            y: "30vh",
            opacity: 0,
            color: "#6b7280",
          },
          {
            y: "0vh",
            opacity: 1,
            color: "#ffffff",
            duration: 0.12,
            ease: "power2.out",
          },
          startOffset,
        ).to(
          el,
          {
            y: "-30vh",
            opacity: 0,
            color: "#6b7280",
            duration: 0.12,
            ease: "power2.in",
          },
          startOffset + 0.12,
        );
      });

      // 2. Phase 2: Steady, Professional Float & Settle (0% to 75%)
      if (chipRef && splineApp) {
        const startY = chipRef.position.y;
        const startZ = chipRef.position.z;
        const startRotX = chipRef.rotation.x;
        const startRotY = chipRef.rotation.y;

        // 2a. Slow, elegant float (0% - 60%)
        tl.to(
          chipRef.position,
          {
            y: startY - 15, // Very gentle drift instead of massive drop
            z: startZ - 10,
            duration: 0.6,
            ease: "none",
            immediateRender: false,
          },
          0,
        ).to(
          chipRef.rotation,
          {
            x: startRotX + Math.PI * 0.1, // Subtle, slow tilt
            y: startRotY + Math.PI, // One calm rotation instead of multiple spins
            duration: 0.6,
            ease: "none",
            immediateRender: false,
          },
          0,
        );

        // 2b. Smooth Settle (60% - 75%): Ease cleanly to a face-on resting position
        tl.to(
          chipRef.position,
          {
            y: 0, // Lock to exact center
            z: 0, // Lock to exact center
            duration: 0.15,
            ease: "power2.inOut", // Smooth transition, no hard bouncing
            immediateRender: false,
          },
          0.6,
        ).to(
          chipRef.rotation,
          {
            x: 0, // Perfectly flat
            y: startRotY + Math.PI * 2, // Finish the elegant spin to face the user
            z: 0, // Perfectly flat
            duration: 0.15,
            ease: "power2.inOut", // Smooth ease
            immediateRender: false,
          },
          0.6,
        );
      }

      // 3. Phase 3: The UI Reveal (80% - 100%)
      if (headingRef.current && uiContainerRef.current) {
        tl.fromTo(
          headingRef.current,
          {
            opacity: 0,
            y: 35,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.15,
            ease: "power3.out",
          },
          0.8,
        ).fromTo(
          uiContainerRef.current,
          {
            opacity: 0,
            y: 45,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.15,
            ease: "power3.out",
          },
          0.85,
        );
      }
    });

    return () => ctx.revert();
  }, [splineApp, chipRef]);

  return (
    <section ref={wrapperRef} className="relative z-40 h-[400vh] w-full">
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full bg-transparent overflow-hidden flex flex-col justify-between py-12 pointer-events-none"
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6">
          {TESTIMONIALS.map((item, index) => (
            <div
              key={`testimonial-${index}`}
              ref={(el) => {
                testimonialsRef.current[index] = el;
              }}
              className="absolute text-center max-w-2xl opacity-0 select-none flex flex-col items-center justify-center"
            >
              <blockquote className="text-2xl md:text-3xl lg:text-4xl font-extralight tracking-tight leading-relaxed italic text-inherit">
                {item.quote}
              </blockquote>
              <cite className="not-italic block mt-4 text-xs md:text-sm uppercase tracking-[0.3em] text-neutral-500 font-light">
                {item.author}
              </cite>
            </div>
          ))}
        </div>

        <h2
          ref={headingRef}
          id="cta-heading"
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-[0.1em] text-white uppercase text-center mt-6 select-none opacity-0"
        >
          Choose Your NTAG
        </h2>

        <div
          ref={uiContainerRef}
          className="w-full max-w-xl mx-auto flex flex-col items-center gap-6 px-6 opacity-0 pb-6 pointer-events-auto"
        >
          <div className="flex p-1 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-full shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] relative w-full justify-between">
            {(["Standard", "Pro", "Elite"] as VariantKey[]).map((variant) => (
              <button
                key={variant}
                id={`variant-btn-${variant.toLowerCase()}`}
                onClick={() => setActiveVariant(variant)}
                className={`flex-1 py-3 px-6 text-xs md:text-sm font-medium rounded-full transition-all duration-300 relative z-10 ${
                  activeVariant === variant
                    ? "text-black bg-white shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                {variant}
              </button>
            ))}
          </div>

          <div className="min-h-[140px] w-full text-center flex flex-col items-center justify-start transition-all duration-500">
            <p className="text-3xl font-extralight text-white mb-2 tracking-tight">
              {VARIANT_DETAILS[activeVariant].price}
            </p>
            <p className="text-white/60 text-xs md:text-sm max-w-sm font-light mb-5 leading-relaxed">
              {VARIANT_DETAILS[activeVariant].description}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {VARIANT_DETAILS[activeVariant].features.map((feature, idx) => (
                <span
                  key={`feature-${idx}`}
                  className="text-[9px] tracking-widest uppercase bg-white/[0.05] border border-white/[0.08] px-3 py-1 rounded-full text-white/40 font-light"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          <button
            id="preorder-cta-btn"
            className="w-full py-4 bg-white hover:bg-neutral-200 text-black font-semibold text-xs md:text-sm rounded-full tracking-widest uppercase transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transform hover:scale-[1.01]"
          >
            Pre-Order Now
          </button>
        </div>
      </div>
    </section>
  );
}
