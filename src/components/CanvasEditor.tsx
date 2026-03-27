import React, { useEffect, useRef, useState } from 'react';
import { useCarouselStore } from '../store';
import { clsx } from 'clsx';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';

export const CanvasEditor: React.FC = () => {
  const { slides, activeSlideId, setActiveSlide, updateSlide } = useCarouselStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const swipeStartX = useRef<number | null>(null);

  const activeIndex = slides.findIndex((s) => s.id === activeSlideId);
  const activeSlide = slides[activeIndex];

  const isEditingElement = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) return false;
    return Boolean(target.closest('[contenteditable="true"]'));
  };

  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      // 1080x1080 is the target size. We want some padding.
      const padding = window.innerWidth < 768 ? 20 : 96;
      const availableWidth = clientWidth - padding;
      const availableHeight = clientHeight - padding;
      const newScale = Math.min(availableWidth / 1080, availableHeight / 1080);
      setScale(newScale > 0 ? Math.max(newScale, 0.12) : 0.12);
    };

    calculateScale();
    const observer = new ResizeObserver(calculateScale);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    window.addEventListener('resize', calculateScale);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', calculateScale);
    };
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditingElement(event.target)) return;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        if (activeIndex > 0) setActiveSlide(slides[activeIndex - 1].id);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        if (activeIndex < slides.length - 1) setActiveSlide(slides[activeIndex + 1].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, setActiveSlide, slides]);

  if (!activeSlide) return null;

  const handlePrev = () => {
    if (activeIndex > 0) setActiveSlide(slides[activeIndex - 1].id);
  };

  const handleNext = () => {
    if (activeIndex < slides.length - 1) setActiveSlide(slides[activeIndex + 1].id);
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement && containerRef.current) {
        await containerRef.current.requestFullscreen();
      } else if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  const handlePointerDown: React.PointerEventHandler<HTMLDivElement> = (event) => {
    if (isEditingElement(event.target)) return;
    swipeStartX.current = event.clientX;
  };

  const handlePointerUp: React.PointerEventHandler<HTMLDivElement> = (event) => {
    if (isEditingElement(event.target)) return;
    if (swipeStartX.current === null) return;

    const deltaX = swipeStartX.current - event.clientX;
    swipeStartX.current = null;

    const threshold = 50;
    if (Math.abs(deltaX) < threshold) return;

    if (deltaX > 0) {
      handleNext();
      return;
    }

    handlePrev();
  };

  return (
    <div
      className="h-full w-full bg-gray-50 flex flex-col relative overflow-hidden touch-pan-y"
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        swipeStartX.current = null;
      }}
    >
      {/* Navigation Controls */}
      <div className="absolute inset-y-0 left-2 md:left-4 flex items-center z-10">
        <button
          onClick={handlePrev}
          disabled={activeIndex === 0}
          className="p-2.5 md:p-3 rounded-full bg-white shadow-md text-gray-700 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-105"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>
      
      <div className="absolute inset-y-0 right-2 md:right-4 flex items-center z-10">
        <button
          onClick={handleNext}
          disabled={activeIndex === slides.length - 1}
          className="p-2.5 md:p-3 rounded-full bg-white shadow-md text-gray-700 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-105"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>

      {/* Slide Counter */}
      <div className="absolute top-3 md:top-6 left-1/2 -translate-x-1/2 px-3 md:px-4 py-1.5 md:py-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm text-xs md:text-sm font-medium text-gray-700 z-10">
        {activeIndex + 1} / {slides.length}
      </div>

      {/* Fullscreen Toggle */}
      <div className="absolute top-3 md:top-6 right-2 md:right-4 z-10">
        <button
          onClick={toggleFullscreen}
          className="px-3 py-2 rounded-full bg-white/90 backdrop-blur-md shadow-sm text-gray-700 hover:text-black transition-colors inline-flex items-center gap-1.5"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          <span className="text-xs font-medium hidden md:inline">{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
        </button>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <div
          className="relative shadow-2xl transition-transform origin-center"
          style={{
            width: 1080,
            height: 1080,
            transform: `scale(${scale})`,
          }}
        >
          {/* The actual slide content to be exported */}
          <div
            id="carousel-slide-export"
            className={clsx(
              'w-full h-full relative flex flex-col items-center justify-center p-[80px]',
              activeSlide.backgroundStyle === 'paper' ? 'paper-texture' : ''
            )}
            style={{
              backgroundColor: activeSlide.backgroundColor,
              fontFamily: `var(--font-${activeSlide.fontFamily})`,
            }}
          >
            {/* Safe Area Guide (Visible only in editor, not exported) */}
            <div className="absolute inset-[80px] border border-dashed border-gray-400/30 pointer-events-none hidden group-hover:block" />

            <div className={clsx(
              'w-full max-w-[800px] flex flex-col gap-12',
              activeSlide.layout === 'center' ? 'items-center text-center' : 'items-start text-left',
              activeSlide.layout === 'split' ? 'flex-row items-center justify-between max-w-full' : ''
            )}>
              {/* Headline */}
              <div className={clsx(
                'relative',
                activeSlide.layout === 'split' ? 'flex-1 pr-8' : 'w-full'
              )}>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateSlide(activeSlide.id, { headline: e.currentTarget.textContent || '' })}
                  className={clsx(
                    'highlight-text inline font-semibold leading-[1.25] outline-none focus:ring-4 ring-indigo-500/50'
                  )}
                  style={{
                    fontSize: `${activeSlide.headlineFontSize}px`,
                    backgroundColor: activeSlide.highlightColor,
                    color: activeSlide.textColor,
                    padding: '6px 10px',
                    borderRadius: '2px',
                    boxShadow: `4px 0 0 ${activeSlide.highlightColor}, -4px 0 0 ${activeSlide.highlightColor}`,
                  }}
                >
                  {activeSlide.headline}
                </span>
              </div>

              {/* Body Text */}
              <div className={clsx(
                activeSlide.layout === 'split' ? 'flex-1 pl-8 border-l-4' : 'w-full max-w-[600px]',
                activeSlide.layout === 'center' ? 'mx-auto' : ''
              )}
              style={{ borderColor: activeSlide.highlightColor }}>
                <p
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateSlide(activeSlide.id, { body: e.currentTarget.textContent || '' })}
                  className="leading-[1.45] opacity-95 font-medium outline-none focus:ring-4 ring-indigo-500/50 p-2 -m-2 rounded"
                  style={{ 
                    fontSize: `${activeSlide.bodyFontSize}px`,
                    color: activeSlide.textColor 
                  }}
                >
                  {activeSlide.body}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Hidden container for all slides to enable batch export */}
      <div className="absolute left-[-9999px] top-[-9999px]">
        {slides.map((slide) => (
          <div
            key={`export-${slide.id}`}
            id={`slide-export-${slide.id}`}
            className={clsx(
              'w-[1080px] h-[1080px] relative flex flex-col items-center justify-center p-[80px]',
              slide.backgroundStyle === 'paper' ? 'paper-texture' : ''
            )}
            style={{
              backgroundColor: slide.backgroundColor,
              fontFamily: `var(--font-${slide.fontFamily})`,
            }}
          >
            <div className={clsx(
              'w-full max-w-[800px] flex flex-col gap-12',
              slide.layout === 'center' ? 'items-center text-center' : 'items-start text-left',
              slide.layout === 'split' ? 'flex-row items-center justify-between max-w-full' : ''
            )}>
              <div className={clsx(
                'relative',
                slide.layout === 'split' ? 'flex-1 pr-8' : 'w-full'
              )}>
                <span
                  className={clsx(
                    'highlight-text inline font-semibold leading-[1.25]'
                  )}
                  style={{
                    fontSize: `${slide.headlineFontSize}px`,
                    backgroundColor: slide.highlightColor,
                    color: slide.textColor,
                    padding: '6px 10px',
                    borderRadius: '2px',
                    boxShadow: `4px 0 0 ${slide.highlightColor}, -4px 0 0 ${slide.highlightColor}`,
                  }}
                >
                  {slide.headline}
                </span>
              </div>
              <div className={clsx(
                slide.layout === 'split' ? 'flex-1 pl-8 border-l-4' : 'w-full max-w-[600px]',
                slide.layout === 'center' ? 'mx-auto' : ''
              )}
              style={{ borderColor: slide.highlightColor }}>
                <p
                  className="leading-[1.45] opacity-95 font-medium"
                  style={{ 
                    fontSize: `${slide.bodyFontSize}px`,
                    color: slide.textColor 
                  }}
                >
                  {slide.body}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
