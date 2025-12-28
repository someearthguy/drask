"use client";
import { hospitalInfo } from "@/lib/content";
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="
        relative z-20
        border-t border-foreground/10
        bg-background/80 backdrop-blur-md
        px-4 pt-8 pb-[calc(2rem+env(safe-area-inset-bottom))]
        md:px-12 md:pt-12 md:pb-12
      "
    >
      <div className="mx-auto max-w-7xl">
        {/* -------- TOP GRID -------- */}
        <div className="grid gap-8 md:grid-cols-3 md:gap-12">
          {/* Sitemap */}
          <div>
            <h3 className="mb-3 font-sans text-sm font-semibold text-foreground md:text-base">
              Sitemap
            </h3>
            <ul className="space-y-2">
              {[
                "Home",
                "Expertise",
                "Publications",
                "About",
                "Gallery",
                "Appointments",
                "Contact",
              ].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="font-mono text-xs text-foreground/70 transition-colors hover:text-foreground md:text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h3 className="mb-3 font-sans text-sm font-semibold text-foreground md:text-base">
              Disclaimer
            </h3>
            <p className="font-mono text-xs leading-relaxed text-foreground/70 md:text-sm">
              The information provided on this website is for general informational
              purposes only and does not constitute medical advice. Please consult
              Dr. Anoop Singh Khod or a qualified healthcare professional for
              personalized guidance.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-3 font-sans text-sm font-semibold text-foreground md:text-base">
              Contact
            </h3>
            <div className="space-y-2">
              <p className="font-mono text-xs text-foreground/70 md:text-sm">
                Shanti Devi GI Institute & Advanced Endoscopy Centre
              </p>
              <p className="font-mono text-xs text-foreground/70 md:text-sm">
                Hisar, Haryana, India
              </p>
              <a
                href={`tel:${hospitalInfo.phone.replace(/\s+/g, "")}`}
                className="block font-mono text-xs text-foreground/70 transition-colors hover:text-foreground md:text-sm"
              >
                {hospitalInfo.phone}
              </a>
            </div>
          </div>
        </div>

        {/* -------- BOTTOM BAR -------- */}
        <div
          className="
            mt-10
            flex flex-col items-center gap-3
            border-t border-foreground/10
            pt-6
            md:flex-row md:justify-between
          "
        >
          <p className="font-mono text-xs text-foreground/60 md:text-sm text-center">
            © {currentYear} Dr. Anoop Singh Khod. All rights reserved.
          </p>

          <p className="font-mono text-xs text-foreground/60 md:text-sm text-center">
            Made with ❤️ by{" "}
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/80 transition-colors hover:text-foreground"
            >
              SomeEarthDev
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
