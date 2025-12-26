"use client"

import { useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArtworkCard } from "./artwork-card"
import { NavigationDots } from "./navigation-dots"
import { artworks } from "@/lib/content"
import { useSliderNavigation } from "@/hooks/use-slider-navigation"
import { useSliderDrag } from "@/hooks/use-slider-drag"
import { useSliderWheel } from "@/hooks/use-slider-wheel"
import { useColorExtraction, useCurrentColors } from "@/hooks/use-color-extraction"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"
import { useState } from "react"

export function ArtGallerySlider() {
  const sliderRef = useRef<HTMLDivElement>(null)
  const [isAutoPlayActive, setIsAutoPlayActive] = useState(true)

  const { currentIndex, goToNext, goToPrev, goToSlide, pauseAutoPlay, resumeAutoPlay } = useSliderNavigation({
    totalSlides: artworks.length,
    enableKeyboard: true,
    autoPlay: true,
    autoPlayInterval: 5000,
  })

  const { isDragging, dragX, handleDragStart, handleDragMove, handleDragEnd } = useSliderDrag({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrev,
    onDragStart: pauseAutoPlay,
    onDragEnd: resumeAutoPlay,
  })

  useSliderWheel({
    sliderRef,
    onScrollLeft: goToNext,
    onScrollRight: goToPrev,
  })

  const colors = useColorExtraction(artworks)
  const currentColors = useCurrentColors(colors, artworks[currentIndex]?.id)

  const toggleAutoPlay = () => {
    if (isAutoPlayActive) {
      pauseAutoPlay()
      setIsAutoPlayActive(false)
    } else {
      resumeAutoPlay()
      setIsAutoPlayActive(true)
    }
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Animated ambient background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 30% 20%, ${currentColors[0]}66 0%, transparent 50%),
              radial-gradient(ellipse at 70% 80%, ${currentColors[1]}66 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, ${currentColors[2]}44 0%, transparent 70%)
            `,
          }}
        />
      </AnimatePresence>

      {/* Blur overlay */}
      <div className="absolute inset-0 backdrop-blur-3xl" />

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 md:p-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          {/* Keyboard hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-8 hidden items-center gap-3 text-white/30 lg:flex"
      >
        <kbd className="rounded border border-white/10 bg-white/5 px-2 py-1 font-mono text-xs">←</kbd>
        <kbd className="rounded border border-white/10 bg-white/5 px-2 py-1 font-mono text-xs">→</kbd>
        <span className="text-xs">navigate</span>
      </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-md md:px-4 md:py-2"
        >
          <span className="text-xs text-white/60 md:text-sm">{String(currentIndex + 1).padStart(2, "0")}</span>
          <span className="text-white/30">/</span>
          <span className="text-xs text-white/40 md:text-sm">{String(artworks.length).padStart(2, "0")}</span>
        </motion.div>
      </header>

      {/* Slider */}
      <div
        ref={sliderRef}
        className="relative flex h-full w-full cursor-grab items-center active:cursor-grabbing"
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        <motion.div
          className="flex items-center gap-4 px-[calc(50vw-45vw)] md:gap-8 md:px-[calc(50vw-200px)] lg:gap-16 lg:px-[calc(50vw-250px)]"
          animate={{
            x:
              -currentIndex *
                (typeof window !== "undefined"
                  ? window.innerWidth > 1024
                    ? 564
                    : window.innerWidth > 768
                      ? 432
                      : window.innerWidth * 0.9 + 16
                  : 364) +
              dragX,
          }}
          transition={isDragging ? { duration: 0 } : { duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        >
          {artworks.map((artwork, index) => (
            <ArtworkCard
              key={artwork.id}
              artwork={artwork}
              isActive={index === currentIndex}
              dragOffset={dragX}
              index={index}
              currentIndex={currentIndex}
            />
          ))}
        </motion.div>
      </div>

      <div className="absolute inset-y-0 left-0 right-0 z-10 flex items-center justify-between px-2 md:px-4">
        <button
          onClick={goToPrev}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md transition-colors hover:bg-white/10 md:h-12 md:w-12"
          aria-label="Previous artwork"
        >
          <ChevronLeft className="h-5 w-5 text-white/70 md:h-6 md:w-6" />
        </button>
        <button
          onClick={goToNext}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md transition-colors hover:bg-white/10 md:h-12 md:w-12"
          aria-label="Next artwork"
        >
          <ChevronRight className="h-5 w-5 text-white/70 md:h-6 md:w-6" />
        </button>
      </div>

      <div className="absolute bottom-4 left-0 right-0 z-20 flex flex-col items-center gap-3 md:bottom-8">
        <NavigationDots total={artworks.length} current={currentIndex} onSelect={goToSlide} colors={currentColors} />
        <button
          onClick={toggleAutoPlay}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-md transition-colors hover:bg-white/10"
          aria-label={isAutoPlayActive ? "Pause autoplay" : "Resume autoplay"}
        >
          {isAutoPlayActive ? <Pause className="h-3 w-3 text-white/70" /> : <Play className="h-3 w-3 text-white/70" />}
          <span className="text-xs text-white/70">{isAutoPlayActive ? "Auto" : "Paused"}</span>
        </button>
      </div>
    </div>
  )
}
