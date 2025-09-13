"use client";

import { useState, useEffect } from "react";
import { CldImage } from "next-cloudinary";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface BannerSliderProps {
  banners: string[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const BannerSlider = ({
  banners,
  autoPlay = true,
  autoPlayInterval = 5000,
}: BannerSliderProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [banners.length, autoPlay, autoPlayInterval]);

  if (!banners || banners.length === 0) {
    return null;
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Banner Images */}
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div key={index} className="w-full h-full flex-shrink-0 relative">
            <CldImage
              src={banner}
              width="1920"
              height="1080"
              alt={`Banner ${index + 1}`}
              className="w-full h-full object-cover"
              priority={index === 0}
            />
            {/* Gradient Overlay for Better Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm hover:scale-110 shadow-lg"
            aria-label="Önceki banner"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm hover:scale-110 shadow-lg"
            aria-label="Sonraki banner"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-white scale-125 shadow-lg"
                  : "bg-white/40 hover:bg-white/60 hover:scale-110"
              }`}
              aria-label={`Banner ${index + 1}'e git`}
            />
          ))}
        </div>
      )}

      {/* Banner Counter */}
      {banners.length > 1 && (
        <div className="absolute top-6 right-6 bg-black/40 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
          <span className="font-bold">{currentSlide + 1}</span>
          <span className="text-white/60 mx-1">/</span>
          <span>{banners.length}</span>
        </div>
      )}
    </div>
  );
};

export default BannerSlider;
