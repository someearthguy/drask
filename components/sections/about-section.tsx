"use client"

import { MagneticButton } from "@/components/magnetic-button"
import { useReveal } from "@/hooks/use-reveal"
import { doctorInfo, stats } from "@/lib/content"

export function AboutSection() {
  const { ref, isVisible } = useReveal(0.3)

  return (
    <section ref={ref} className="flex min-h-screen w-full items-center px-4 py-16 md:px-12 md:py-20 lg:px-16">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-8 md:grid-cols-2 md:gap-16 lg:gap-24">
          {/* Left side - Story */}
          <div>
            <div
              className={`mb-6 transition-all duration-700 md:mb-12 ${
                isVisible ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"
              }`}
            >
              <h2 className="mb-3 font-sans text-3xl font-light leading-[1.1] tracking-tight text-foreground md:mb-4 md:text-6xl lg:text-7xl">
                Dedicated to
                <br />
                patient care &
                <br />
                <span className="text-foreground/40">excellence</span>
              </h2>
            </div>

            <div
              className={`space-y-4 transition-all duration-700 md:space-y-5 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <p className="max-w-md text-sm leading-relaxed text-foreground/90 md:text-lg">{doctorInfo.bio}</p>

              <div className="space-y-3 pt-4">
                <h3 className="font-sans text-lg font-light text-foreground md:text-xl">Education</h3>
                {doctorInfo.education.map((edu, i) => (
                  <div key={i} className="border-l border-foreground/20 pl-4">
                    <p className="font-sans text-sm font-medium text-foreground md:text-base">{edu.degree}</p>
                    <p className="font-mono text-xs text-foreground/60">
                      {edu.institution} • {edu.year}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Stats */}
          <div className="flex flex-col justify-center space-y-6 md:space-y-12">
            {stats.map((stat, i) => {
              const getRevealClass = () => {
                if (!isVisible) {
                  return i % 2 === 0 ? "translate-x-16 opacity-0" : "-translate-x-16 opacity-0"
                }
                return "translate-x-0 opacity-100"
              }

              return (
                <div
                  key={i}
                  className={`flex items-baseline gap-4 border-l border-foreground/30 pl-4 transition-all duration-700 md:gap-8 md:pl-8 ${getRevealClass()}`}
                  style={{
                    transitionDelay: `${300 + i * 150}ms`,
                    marginLeft: i % 2 === 0 ? "0" : "auto",
                    maxWidth: i % 2 === 0 ? "100%" : "85%",
                  }}
                >
                  <div className="text-3xl font-light text-foreground md:text-6xl lg:text-7xl">{stat.value}</div>
                  <div>
                    <div className="font-sans text-base font-light text-foreground md:text-xl">{stat.label}</div>
                    <div className="font-mono text-xs text-foreground/60">{stat.sublabel}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
