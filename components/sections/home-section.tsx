"use client";

import { MagneticButton } from "@/components/magnetic-button";
import { useReveal } from "@/hooks/use-reveal";
import { doctorInfo } from "@/lib/content";
import BusinessCard from "../business-card";

interface HomeSectionProps {
  scrollToSection: (index: number) => void;
}

export function HomeSection({ scrollToSection }: HomeSectionProps) {
  const { ref, isVisible } = useReveal(0.3);

  return (
    <section
      ref={ref}
      data-section="0"
      className="relative flex w-full items-center mt-24 px-4 py-20 md:px-12 md:py-24"
    >
      <div className="mx-auto w-full max-w-5xl">
        <div className="flex flex-col items-center gap-10 md:flex-row md:items-end md:gap-12">
          {/* ---------- Left: Card ---------- */}
          <div
            className={`transition-all duration-700 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-12 opacity-0"
            }`}
          >
            <BusinessCard />
          </div>

          {/* ---------- Right: Text ---------- */}
          <div className="flex-1 text-center md:text-left">
            <div
              className={`transition-all duration-700 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: "150ms" }}
            >
              <h1 className="font-sans text-4xl font-light leading-[1.1] tracking-tight text-foreground md:text-6xl lg:text-7xl">
                {doctorInfo.name}
              </h1>

              <p className="mt-2 font-sans text-xl font-light text-foreground/90 md:text-2xl">
                {doctorInfo.title}
              </p>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-foreground/80 md:text-lg">
                {doctorInfo.tagline}
              </p>
            </div>

            {/* ---------- Actions ---------- */}
            <div
              className={`mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start transition-all duration-700 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-0"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              <MagneticButton
                size="lg"
                variant="primary"
                onClick={() => scrollToSection(5)}
                className="w-full sm:w-auto"
              >
                Book Appointment
              </MagneticButton>

              <MagneticButton
                size="lg"
                variant="secondary"
                onClick={() => scrollToSection(6)}
                className="w-full sm:w-auto"
              >
                Contact Doctor
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Scroll Hint ---------- */}
      <button
        onClick={() => scrollToSection(1)}
        className={`
          pointer-events-auto
          absolute bottom-2 left-1/2 -translate-x-1/2
          flex flex-col items-center gap-2
          text-xs font-mono text-foreground/50
          transition-all duration-700
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        `}
        style={{ transitionDelay: "600ms" }}
        aria-label="Scroll to explore"
      >
        <span>Scroll to explore</span>

        {/* animated line */}
        <span className="relative h-6 w-px overflow-hidden bg-foreground/20">
          <span className="absolute inset-0 animate-scroll-line bg-foreground/60" />
        </span>
      </button>

      {/* ---------- Animation ---------- */}
      <style jsx>{`
        @keyframes scroll-line {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          100% {
            transform: translateY(100%);
            opacity: 0;
          }
        }

        .animate-scroll-line {
          animation: scroll-line 1.6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
