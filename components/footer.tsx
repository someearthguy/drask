"use client"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative z-20 border-t border-foreground/10 bg-background/80 backdrop-blur-md px-4 py-8 md:px-12 md:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-3 md:gap-12">
          {/* Sitemap */}
          <div>
            <h3 className="mb-3 font-sans text-sm font-semibold text-foreground md:text-base">Sitemap</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#home"
                  className="font-mono text-xs text-foreground/70 transition-colors hover:text-foreground md:text-sm"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#expertise"
                  className="font-mono text-xs text-foreground/70 transition-colors hover:text-foreground md:text-sm"
                >
                  Expertise
                </a>
              </li>
              <li>
                <a
                  href="#publications"
                  className="font-mono text-xs text-foreground/70 transition-colors hover:text-foreground md:text-sm"
                >
                  Publications
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="font-mono text-xs text-foreground/70 transition-colors hover:text-foreground md:text-sm"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#gallery"
                  className="font-mono text-xs text-foreground/70 transition-colors hover:text-foreground md:text-sm"
                >
                  Gallery
                </a>
              </li>
              <li>
                <a
                  href="#appointments"
                  className="font-mono text-xs text-foreground/70 transition-colors hover:text-foreground md:text-sm"
                >
                  Appointments
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="font-mono text-xs text-foreground/70 transition-colors hover:text-foreground md:text-sm"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h3 className="mb-3 font-sans text-sm font-semibold text-foreground md:text-base">Disclaimer</h3>
            <p className="font-mono text-xs leading-relaxed text-foreground/70 md:text-sm">
              The information provided on this website is for general informational purposes only. It is not intended as
              medical advice. Please consult with Dr. Anoop Singh Khod or a qualified healthcare professional for
              personalized medical guidance.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-3 font-sans text-sm font-semibold text-foreground md:text-base">Contact</h3>
            <div className="space-y-2">
              <p className="font-mono text-xs text-foreground/70 md:text-sm">
                Shanti Devi GI Institute & Advanced Endoscopy Centre
              </p>
              <p className="font-mono text-xs text-foreground/70 md:text-sm">Hisar, Haryana, India</p>
              <a
                href="tel:+917419971007"
                className="block font-mono text-xs text-foreground/70 transition-colors hover:text-foreground md:text-sm"
              >
                +91 7419971007
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-foreground/10 pt-8 md:flex-row">
          <p className="font-mono text-xs text-foreground/60 md:text-sm">
            © {currentYear} Dr. Anoop Singh Khod. All rights reserved.
          </p>
          <p className="font-mono text-xs text-foreground/60 md:text-sm">
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
  )
}
