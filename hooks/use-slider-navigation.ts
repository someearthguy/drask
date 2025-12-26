"use client"

import { useState, useCallback, useEffect } from "react"

interface UseSliderNavigationProps {
  totalSlides: number
  enableKeyboard?: boolean
  autoPlay?: boolean
  autoPlayInterval?: number
}

interface UseSliderNavigationReturn {
  currentIndex: number
  goToNext: () => void
  goToPrev: () => void
  goToSlide: (index: number) => void
  goToFirst: () => void
  goToLast: () => void
  pauseAutoPlay: () => void
  resumeAutoPlay: () => void
}

export function useSliderNavigation({
  totalSlides,
  enableKeyboard = true,
  autoPlay = true,
  autoPlayInterval = 5000,
}: UseSliderNavigationProps): UseSliderNavigationReturn {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPaused, setIsAutoPaused] = useState(false)

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides)
  }, [totalSlides])

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides)
  }, [totalSlides])

  const goToSlide = useCallback(
    (index: number) => {
      setCurrentIndex(Math.max(0, Math.min(index, totalSlides - 1)))
    },
    [totalSlides],
  )

  const goToFirst = useCallback(() => {
    setCurrentIndex(0)
  }, [])

  const goToLast = useCallback(() => {
    setCurrentIndex(totalSlides - 1)
  }, [totalSlides])

  const pauseAutoPlay = useCallback(() => {
    setIsAutoPaused(true)
  }, [])

  const resumeAutoPlay = useCallback(() => {
    setIsAutoPaused(false)
  }, [])

  useEffect(() => {
    if (!autoPlay || isAutoPaused) return

    const interval = setInterval(() => {
      goToNext()
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [autoPlay, autoPlayInterval, isAutoPaused, goToNext])

  useEffect(() => {
    if (!enableKeyboard) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case "d":
        case "D":
          goToNext()
          break
        case "ArrowLeft":
        case "a":
        case "A":
          goToPrev()
          break
        case "Home":
          goToFirst()
          break
        case "End":
          goToLast()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [enableKeyboard, goToNext, goToPrev, goToFirst, goToLast])

  return {
    currentIndex,
    goToNext,
    goToPrev,
    goToSlide,
    goToFirst,
    goToLast,
    pauseAutoPlay,
    resumeAutoPlay,
  }
}
