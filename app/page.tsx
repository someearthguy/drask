"use client";

import { Shader, ChromaFlow, Swirl } from "shaders/react";
import { CustomCursor } from "@/components/custom-cursor";
import { GrainOverlay } from "@/components/grain-overlay";
import { useRef, useEffect, useState } from "react";
import { navigationItems } from "@/lib/content";
import { ExpertiseSection } from "@/components/sections/expertise-section";
import { AboutSection } from "@/components/sections/about-section";
import { PublicationsSection } from "@/components/sections/publications-section";
import { GallerySection } from "@/components/sections/gallery-section";
import { AppointmentsSection } from "@/components/sections/appointments-section";
import { ContactSection } from "@/components/sections/contact-section";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { HomeSection } from "@/components/sections/home-section";
import { ShaderLoader } from "@/components/shader-loader";

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const shaderContainerRef = useRef<HTMLDivElement>(null);

  const [currentSection, setCurrentSection] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  /* ---------------- Shader readiness ---------------- */

  useEffect(() => {
    const check = () => {
      const canvas = shaderContainerRef.current?.querySelector("canvas");
      if (canvas && canvas.width > 0) {
        setIsLoaded(true);
        return true;
      }
      return false;
    };

    if (check()) return;

    const i = setInterval(check, 100);
    const t = setTimeout(() => setIsLoaded(true), 1500);

    return () => {
      clearInterval(i);
      clearTimeout(t);
    };
  }, []);

  /* ---------------- Scroll → navbar sync (FIX) ---------------- */

  useEffect(() => {
  const container = scrollContainerRef.current;
  if (!container) return;

  const sections = Array.from(
    container.querySelectorAll<HTMLElement>("[data-section]")
  );

  const observer = new IntersectionObserver(
    (entries) => {
      // Collect intersecting sections
      const visibleSections = entries
        .filter((e) => e.isIntersecting)
        .map((e) => Number(e.target.dataset.section))
        .filter((n) => !Number.isNaN(n));

      if (!visibleSections.length) return;

      // 👇 Pick the LOWEST index (earliest section)
      const next = Math.min(...visibleSections);

      setCurrentSection((prev) =>
        prev === next ? prev : next
      );
    },
    {
      root: container,
      rootMargin: "-35% 0px -55% 0px",
      threshold: 0,
    }
  );

  sections.forEach((section) => observer.observe(section));

  // Hard guarantee for Home
  const handleScrollTop = () => {
    if (container.scrollTop < 8) {
      setCurrentSection(0);
    }
  };

  container.addEventListener("scroll", handleScrollTop, { passive: true });

  return () => {
    observer.disconnect();
    container.removeEventListener("scroll", handleScrollTop);
  };
}, []);


  /* ---------------- Scroll helper ---------------- */

  const scrollToSection = (index: number) => {
    const target = scrollContainerRef.current?.querySelector(
      `[data-section="${index}"]`
    );
    target?.scrollIntoView({ behavior: "smooth" });
  };

  /* ---------------- Touch shader interaction ---------------- */

  const [touchStrength, setTouchStrength] = useState(0);
  const lastTouchTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const animate = () => {
      const now = performance.now();
      const delta = (now - lastTouchTimeRef.current) / 1000;
      setTouchStrength((v) => Math.max(0, v - delta * 1.8));
      lastTouchTimeRef.current = now;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    lastTouchTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameRef.current!);
  }, []);

  const handleTouch = (x: number, y: number) => {
    if (!shaderContainerRef.current) return;
    setTouchStrength(1);
  };

  /* ---------------- Render ---------------- */

  return (
    <main className="relative h-screen w-full overflow-hidden bg-background">
      <CustomCursor />
      <GrainOverlay />

      {/* ---------- Shader background ---------- */}
      <div
        ref={shaderContainerRef}
        className={`fixed inset-0 z-0 transition-all duration-1000 ${
          isLoaded
            ? "opacity-100 blur-0 scale-100"
            : "opacity-0 blur-xl scale-[1.02]"
        }`}
        onPointerDown={(e) => handleTouch(e.clientX, e.clientY)}
      >
        <ShaderLoader visible={!isLoaded} />

        <Shader className="h-full w-full">
          {" "}
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
          />{" "}
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
          />{" "}
        </Shader>
        <div className="absolute inset-0 bg-black/15" />
      </div>

      {/* ---------- NAV ---------- */}
      <Navbar
        isLoaded={isLoaded}
        currentSection={currentSection}
        navigationItems={navigationItems}
        scrollToSection={scrollToSection}
      />

      {/* ---------- CONTENT ---------- */}
      <div
        ref={scrollContainerRef}
        className="relative z-10 h-full overflow-y-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {/* SECTIONS) */}
        <section data-section="0" className="scroll-mt-40">
          <HomeSection scrollToSection={scrollToSection} />
        </section>

        <section data-section="1" className="scroll-mt-40 ">
          <ExpertiseSection />
        </section>

        <section data-section="2" className="scroll-mt-40">
          <PublicationsSection />
        </section>

        <section data-section="3" className="scroll-mt-40">
          <AboutSection />
        </section>

        <section data-section="4" className="scroll-mt-40">
          <GallerySection />
        </section>

        <section data-section="5" className="scroll-mt-40">
          <AppointmentsSection />
        </section>

        <section data-section="6" className="scroll-mt-40">
          <ContactSection />
        </section>

        <Footer />
      </div>
    </main>
  );
}
