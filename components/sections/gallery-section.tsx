"use client";

import { useReveal } from "@/hooks/use-reveal";
import { ArtGallerySlider } from "../gallery/art-gallery-slider";

export function GallerySection() {
  const { ref, isVisible } = useReveal(0.3);

  return (
    <section
      ref={ref}
      className=""
    >
      <div className=" h-screen w-screen overflow-hidden">
        <ArtGallerySlider />
      </div>
    </section>
  );
}
