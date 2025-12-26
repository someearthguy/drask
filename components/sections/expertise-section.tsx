"use client";

import { useReveal } from "@/hooks/use-reveal";
import { doctorInfo } from "@/lib/content";

export function ExpertiseSection() {
  const { ref, isVisible } = useReveal(0.3);

  return (
    <section
      ref={ref}
      className="flex min-h-screen w-screen shrink-0 snap-start items-center px-4 py-20 md:h-screen md:px-12 md:py-0 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="overflow-visible">
          <div
            className={`mb-8 transition-all duration-700 md:mb-16 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-12 opacity-0"
            }`}
          >
            <h2 className="mb-2 font-sans text-3xl font-light tracking-tight text-foreground md:text-6xl lg:text-7xl">
              Areas of Expertise
            </h2>
            <p className="font-mono text-xs text-foreground/60 md:text-base">
              / Surgical specializations
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 md:gap-x-16 md:gap-y-8 lg:grid-cols-3 lg:gap-x-24">
            {doctorInfo.expertise.map((item, i) => (
              <ExpertiseCard
                key={i}
                expertise={item}
                index={i}
                isVisible={isVisible}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExpertiseCard({
  expertise,
  index,
  isVisible,
}: {
  expertise: string;
  index: number;
  isVisible: boolean;
}) {
  const getRevealClass = () => {
    if (!isVisible) {
      return index % 2 === 0
        ? "-translate-x-16 opacity-0"
        : "translate-x-16 opacity-0";
    }
    return "translate-x-0 opacity-100";
  };

  return (
    <div
      className={`group flex items-center gap-3 border-l border-foreground/30 pl-3 transition-all duration-700 md:gap-4 md:pl-6 ${getRevealClass()}`}
      style={{
        transitionDelay: `${index * 100}ms`,
      }}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-foreground/10 transition-all duration-300 group-hover:bg-foreground/20">
        <span className="font-mono text-xs text-foreground/60">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <h3 className="font-sans text-base font-light text-foreground md:text-xl">
        {expertise}
      </h3>
    </div>
  );
}
