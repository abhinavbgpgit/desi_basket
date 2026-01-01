import React, { useState, useEffect, useCallback } from 'react';
import banner1 from '../assets/banner/banner_1.png';
import banner2 from '../assets/banner/banner_2.png';
import banner3 from '../assets/banner/banner_3.png';
import banner4 from '../assets/banner/banner_4.png';
import banner5 from '../assets/banner/banner_5.png';

const BannerCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState('next');

  const banners = [
    { id: 1, image: banner1, alt: 'Fresh Farm Products' },
    { id: 2, image: banner2, alt: 'Organic Vegetables' },
    { id: 3, image: banner3, alt: 'Local Farmers' },
    { id: 4, image: banner4, alt: 'Quality Produce' },
    { id: 5, image: banner5, alt: 'Farm to Table' }
  ];

  const nextSlide = useCallback(() => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setDirection('next');
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
      setTimeout(() => setIsTransitioning(false), 600);
    }
  }, [isTransitioning, banners.length]);

  const prevSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setDirection('prev');
      setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
      setTimeout(() => setIsTransitioning(false), 600);
    }
  };

  const goToSlide = (index) => {
    if (!isTransitioning && index !== currentIndex) {
      setIsTransitioning(true);
      setDirection(index > currentIndex ? 'next' : 'prev');
      setCurrentIndex(index);
      setTimeout(() => setIsTransitioning(false), 600);
    }
  };

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Main Carousel Container */}
      <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[20rem]">
        {/* Slides */}
        {banners.map((banner, index) => {
          const isActive = index === currentIndex;
          const isPrev = index === (currentIndex - 1 + banners.length) % banners.length;
          const isNext = index === (currentIndex + 1) % banners.length;

          let slideClass = 'opacity-0 scale-95 translate-x-full';
          
          if (isActive) {
            slideClass = 'opacity-100 scale-100 translate-x-0 z-10';
          } else if (isPrev) {
            slideClass = 'opacity-0 scale-95 -translate-x-full';
          } else if (isNext) {
            slideClass = 'opacity-0 scale-95 translate-x-full';
          }

          return (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${slideClass}`}
            >
              <img
                src={banner.image}
                alt={banner.alt}
                className="w-full h-full object-containr"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
              
              {/* Gradient Overlay for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows - Hidden on mobile, visible on tablet and up */}
      <button
        onClick={prevSlide}
        disabled={isTransitioning}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed group"
        aria-label="Previous slide"
      >
        <svg 
          className="w-5 h-5 lg:w-6 lg:h-6 group-hover:-translate-x-0.5 transition-transform" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        disabled={isTransitioning}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed group"
        aria-label="Next slide"
      >
        <svg 
          className="w-5 h-5 lg:w-6 lg:h-6 group-hover:translate-x-0.5 transition-transform" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isTransitioning}
            className={`transition-all duration-300 rounded-full disabled:cursor-not-allowed ${
              index === currentIndex
                ? 'w-8 h-2 bg-white shadow-lg'
                : 'w-2 h-2 bg-white/60 hover:bg-white/80 hover:scale-125'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Touch/Swipe Indicators for Mobile */}
      <div className="md:hidden absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
        <svg className="w-4 h-4 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
        </svg>
        <span className="text-white text-xs font-medium">Swipe</span>
        <svg className="w-4 h-4 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>

      {/* Slide Counter - Desktop only */}
      <div className="hidden lg:block absolute top-4 right-4 z-20 bg-black/40 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
        {currentIndex + 1} / {banners.length}
      </div>
    </div>
  );
};

export default BannerCarousel;