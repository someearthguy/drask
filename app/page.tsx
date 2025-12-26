"use client";

import { Shader, ChromaFlow, Swirl } from "shaders/react";
import { CustomCursor } from "@/components/custom-cursor";
import { GrainOverlay } from "@/components/grain-overlay";
import { MagneticButton } from "@/components/magnetic-button";
import { useRef, useEffect, useState } from "react";
import { doctorInfo, navigationItems } from "@/lib/content";
import { ExpertiseSection } from "@/components/sections/expertise-section";
import { AboutSection } from "@/components/sections/about-section";
import { PublicationsSection } from "@/components/sections/publications-section";
import { GallerySection } from "@/components/sections/gallery-section";
import { AppointmentsSection } from "@/components/sections/appointments-section";
import { ContactSection } from "@/components/sections/contact-section";
import { Footer } from "@/components/footer";
import Image from "next/image";
import { ArtGallerySlider } from "@/components/gallery/art-gallery-slider";

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const shaderContainerRef = useRef<HTMLDivElement>(null);

  const [touchStrength, setTouchStrength] = useState(0);
  const [touchPosition, setTouchPosition] = useState({ x: 0.5, y: 0.5 });
  const animationFrameRef = useRef<number>();
  const lastTouchTimeRef = useRef<number>(0);
  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  useEffect(() => {
    const checkShaderReady = () => {
      if (shaderContainerRef.current) {
        const canvas = shaderContainerRef.current.querySelector("canvas");
        if (canvas && canvas.width > 0 && canvas.height > 0) {
          setIsLoaded(true);
          return true;
        }
      }
      return false;
    };

    if (checkShaderReady()) return;

    const intervalId = setInterval(() => {
      if (checkShaderReady()) {
        clearInterval(intervalId);
      }
    }, 100);

    const fallbackTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 1500);

    return () => {
      clearInterval(intervalId);
      clearTimeout(fallbackTimer);
    };
  }, []);

  const scrollToSection = (index: number) => {
    if (scrollContainerRef.current) {
      const section = scrollContainerRef.current.children[index] as HTMLElement;
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setCurrentSection(index);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;

      const scrollTop = scrollContainerRef.current.scrollTop;
      const sections = Array.from(
        scrollContainerRef.current.children
      ) as HTMLElement[];
      let newSection = 0;

      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (
          typeof window !== "undefined" &&
          rect.top <= window.innerHeight / 3
        ) {
          newSection = index;
        }
      });

      if (newSection !== currentSection) {
        setCurrentSection(newSection);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [currentSection]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const animate = () => {
      const now = performance.now();
      const delta = (now - lastTouchTimeRef.current) / 1000; // Convert to seconds

      setTouchStrength((prev) => {
        // Exponential decay with easeOutExpo curve
        const decayRate = 1.8;
        const newStrength = Math.max(0, prev - delta * decayRate);
        return newStrength;
      });

      lastTouchTimeRef.current = now;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    lastTouchTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [prefersReducedMotion]);

  const handleTouch = (clientX: number, clientY: number) => {
    if (!shaderContainerRef.current || prefersReducedMotion) return;

    const rect = shaderContainerRef.current.getBoundingClientRect();
    // Normalize touch coordinates to 0-1 range
    const normalizedX = clientX / rect.width;
    const normalizedY = 1.0 - clientY / rect.height; // Invert Y for shader space

    setTouchPosition({ x: normalizedX, y: normalizedY });
    setTouchStrength(1.0); // Impulse on touch
  };

  return (
    <main className="relative min-h-screen w-full bg-background">
      <CustomCursor />
      <GrainOverlay />

      <div
        ref={shaderContainerRef}
        className={`fixed inset-0 z-0 transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ contain: "strict", touchAction: "none" }}
        onPointerDown={(e) => {
          handleTouch(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => {
          if (e.pressure > 0) {
            handleTouch(e.clientX, e.clientY);
          }
        }}
        onPointerUp={() => {
          // Touch release - let decay animation handle fade
        }}
      >
        <Shader className="h-full w-full">
          <Swirl
            colorA="#0284c7"
            colorB="#06b6d4"
            speed={0.7}
            detail={0.9}
            blend={55 + touchStrength * 25}
            coarseX={45 * 0.85}
            coarseY={45 * 0.85}
            mediumX={45 * 0.85}
            mediumY={45 * 0.85}
            fineX={45 * 0.85}
            fineY={45 * 0.85}
          />
          <ChromaFlow
            baseColor="#0891b2"
            upColor="#06b6d4"
            downColor="#e0f2fe"
            leftColor="#0ea5e9"
            rightColor="#0284c7"
            intensity={0.95 + touchStrength * 0.5}
            radius={2.0}
            momentum={30 + touchStrength * 20}
            maskType="alpha"
            opacity={1.0 + touchStrength * 0.07}
          />
        </Shader>
        <div className="absolute inset-0 bg-black/15" />
      </div>

      {/* ---------- NAV ---------- */}
      <nav
        className={`sticky top-0 z-30 h-16 md:h-[72px] flex items-center
        border-b border-white/10 bg-white
        px-3 md:px-12 shadow-sm backdrop-blur-md transition-opacity
        ${isLoaded ? "opacity-100" : "opacity-0"}`}
      >
        <button onClick={() => scrollToSection(0)}>
          <div className="relative h-12 md:h-14 w-52 md:w-72">
            <Image
              src={doctorInfo.logohz}
              alt={doctorInfo.name}
              fill
              priority
            />
          </div>
        </button>

        <div className="hidden lg:flex flex-1 justify-center gap-8">
          {navigationItems.map((item) => (
            <button
              key={item.name}
              onClick={() => scrollToSection(item.index)}
              className={`relative text-sm font-medium ${
                currentSection === item.index
                  ? "text-gray-900"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {item.name}
              <span
                className={`absolute -bottom-1 left-0 h-px bg-cyan-600 transition-all ${
                  currentSection === item.index ? "w-full" : "w-0"
                }`}
              />
            </button>
          ))}
        </div>

        <div className="ml-auto flex gap-2 lg:gap-4">
          <MagneticButton
            variant="accent"
            onClick={() => scrollToSection(5)}
            className="h-9 min-w-[88px] px-3 text-xs flex items-center justify-center
               md:h-10 md:min-w-[110px] md:px-5 md:text-sm"
          >
            Visit
          </MagneticButton>

          <MagneticButton
            variant="accent"
            onClick={() => scrollToSection(6)}
            className="h-9 min-w-[88px] px-3 text-xs flex items-center justify-center
               md:h-10 md:min-w-[110px] md:px-5 md:text-sm"
          >
            Contact
          </MagneticButton>
        </div>
      </nav>

      {/* ---------- CONTENT ---------- */}

      <div
        ref={scrollContainerRef}
        data-scroll-container
        className={`relative z-10 overflow-y-auto transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <section className="relative flex w-full flex-col justify-center px-4 py-16 md:justify-end md:px-12 md:pb-24 md:pt-20">
          <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 md:flex-row md:items-end md:gap-12">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="relative h-48 w-48 overflow-hidden rounded-2xl border-4 border-white/30 shadow-2xl md:h-64 md:w-64">
                <Image
                  src={doctorInfo.profilepic}
                  alt={doctorInfo.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="mb-3 inline-block animate-in fade-in slide-in-from-bottom-4 rounded-full border border-black/20 bg-black/15 px-3 py-1 backdrop-blur-md duration-700 delay-100 md:mb-4 md:px-4 md:py-1.5">
                <p className="font-mono text-xs text-black/90">
                  {doctorInfo.specialization}
                </p>
              </div>
              <h1 className="mb-4 animate-in fade-in slide-in-from-bottom-8 font-sans text-4xl font-light leading-[1.1] tracking-tight text-black duration-1000 delay-200 md:mb-6 md:text-6xl lg:text-7xl">
                <span className="text-balance">{doctorInfo.name}</span>
              </h1>
              <p className="mb-2 animate-in fade-in slide-in-from-bottom-4 font-sans text-xl font-light text-black/90 duration-1000 delay-300 md:text-2xl">
                {doctorInfo.title}
              </p>
              <p className="mb-6 animate-in fade-in slide-in-from-bottom-4 text-base leading-relaxed text-black/80 duration-1000 delay-400 md:mb-8 md:text-lg">
                <span className="text-pretty">{doctorInfo.tagline}</span>
              </p>
              <div className="flex animate-in fade-in slide-in-from-bottom-4 flex-col gap-3 duration-1000 delay-500 sm:flex-row sm:justify-center md:justify-start">
                <MagneticButton
                  size="lg"
                  variant="primary"
                  onClick={() => scrollToSection(5)}
                  className="w-full justify-center sm:w-auto"
                >
                  Book Appointment
                </MagneticButton>
                <MagneticButton
                  size="lg"
                  variant="secondary"
                  onClick={() => scrollToSection(6)}
                  className="w-full justify-center sm:w-auto"
                >
                  Contact Doctor
                </MagneticButton>
              </div>
            </div>
          </div>
        </section>

        <ExpertiseSection />
        <PublicationsSection />
        <AboutSection scrollToSection={scrollToSection} />
        <GallerySection />
        <AppointmentsSection />
        <ContactSection />

        <Footer />
      </div>

      <style jsx global>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  );
}
