"use client";

import { useReveal } from "@/hooks/use-reveal";
import { hospitalInfo } from "@/lib/content";
import { MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react";
import { MagneticButton } from "@/components/magnetic-button";

export function AppointmentsSection() {
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
              Appointments & Location
            </h2>
            <p className="font-mono text-xs text-foreground/60 md:text-base">
              / Visit us
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 md:gap-16">
            {/* Left side - Hospital info */}
            <div className="space-y-5 md:space-y-6">
              <div
                className={`transition-all duration-700 ${
                  isVisible
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-16 opacity-0"
                }`}
                style={{ transitionDelay: "200ms" }}
              >
                <h3 className="mb-3 font-sans text-xl font-light text-foreground md:mb-4 md:text-3xl">
                  {hospitalInfo.name}
                </h3>

                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-1 h-5 w-5 shrink-0 text-foreground/60" />
                    <p className="text-sm text-foreground/90 md:text-base">
                      {hospitalInfo.address}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 shrink-0 text-foreground/60" />
                    <a
                      href={`tel:${hospitalInfo.phone}`}
                      className="min-h-[44px] flex items-center text-sm text-foreground/90 transition-colors hover:text-foreground md:text-base"
                    >
                      {hospitalInfo.phone}
                    </a>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 shrink-0 text-foreground/60" />
                    <a
                      href={`mailto:${hospitalInfo.email}`}
                      className="min-h-[44px] flex items-center text-sm text-foreground/90 transition-colors hover:text-foreground md:text-base"
                    >
                      {hospitalInfo.email}
                    </a>
                  </div>
                </div>
              </div>

              <div
                className={`transition-all duration-700 ${
                  isVisible
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-16 opacity-0"
                }`}
                style={{ transitionDelay: "350ms" }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-foreground/60" />
                  <h4 className="font-sans text-base font-light text-foreground md:text-lg">
                    Consultation Hours
                  </h4>
                </div>
                <div className="space-y-2 border-l border-foreground/20 pl-4">
                  {hospitalInfo.timings.map((timing, i) => (
                    <div
                      key={i}
                      className="flex justify-between text-xs text-foreground/80 md:text-sm"
                    >
                      <span>{timing.day}</span>
                      <span className="font-mono">{timing.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className={`transition-all duration-700 ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-12 opacity-0"
                }`}
                style={{ transitionDelay: "500ms" }}
              >
                <a
                  href={hospitalInfo.bookingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MagneticButton
                    size="lg"
                    variant="primary"
                    className="w-full md:w-auto flex items-center justify-center gap-2"
                  >
                    <span className="">Book Appointment</span>
                    <ExternalLink className="h-4 w-4" />
                  </MagneticButton>
                </a>
              </div>
            </div>

            {/* Right side - Map */}
            <div
              className={`transition-all duration-700 ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "translate-x-16 opacity-0"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              <div className="h-80 w-full overflow-hidden rounded-lg border border-foreground/20 md:h-96">
                <iframe
                  src={hospitalInfo.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Hospital Location"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
