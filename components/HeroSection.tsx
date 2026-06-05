/**
 * HeroSection — Server Component
 *
 * Pure Tailwind text layout for the first screen.
 * No 'use client' directive. Fully static, SEO-friendly.
 *
 * The glassmorphic card has id="hero-glass-card" so the GSAP timeline
 * in NfcScrollyTelling can animate it (opacity + translateY) in sync
 * with the 3D chip.
 *
 * IMPORTANT: Initial hidden state (opacity-0) is set via CSS class,
 * NOT inline style, so GSAP can freely override it via inline styles.
 */
export default function HeroSection() {
  return (
    <section
      id="hero"
      className="fixed inset-0 z-30 flex flex-col items-center justify-center
                 h-dvh w-full px-6 pointer-events-none"
    >
      {/* Floating glass card — starts invisible via CSS; GSAP animates it in */}
      <div
        id="hero-glass-card"
        className="p-12 backdrop-blur-xl bg-white/[0.03] border border-white/10
                    rounded-3xl max-w-2xl text-center shadow-2xl
                    shadow-black/40 will-change-transform
                    pointer-events-auto opacity-0 translate-y-[30px]"
      >
        {/* Overline */}
        <p className="text-[11px] tracking-[0.35em] uppercase text-white/40 mb-6 font-light">
          The Voloo Ecosystem
        </p>

        {/* Main heading */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extralight tracking-tight text-white mb-6 leading-[1.1]">
          Shemoqmedi
          <span className="text-white/30">.space</span>
        </h1>

        {/* Subtle divider */}
        <div className="w-16 h-px bg-white/15 mx-auto mb-6" />

        {/* Subheading */}
        <p className="text-lg md:text-xl text-white/50 font-light leading-relaxed max-w-md mx-auto">
          Handcrafted NFC hardware for the hospitality elite.
          <br />
          Physical craft meets digital frictionless.
        </p>

        {/* Scroll prompt */}
        <div className="mt-10 flex flex-col items-center gap-2">
          <p className="text-[10px] tracking-[0.3em] uppercase text-white/25 font-light">
            Scroll to explore
          </p>
          <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent animate-pulse" />
        </div>
      </div>
    </section>
  );
}
