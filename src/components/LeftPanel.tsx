import React from 'react';
import { useCarouselStore } from '../store';
import { Plus, Copy, Trash2, GripVertical } from 'lucide-react';
import { clsx } from 'clsx';

export const LeftPanel: React.FC = () => {
  const { slides, activeSlideId, setActiveSlide, addSlide, duplicateSlide, deleteSlide } = useCarouselStore();

  return (
    <div className="w-full bg-white flex flex-col">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-semibold text-sm text-gray-700 uppercase tracking-wider">Slides</h2>
        <span className="text-xs text-gray-400 font-medium">{slides.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={clsx(
              'group relative rounded-lg border-2 transition-all duration-200 cursor-pointer overflow-hidden',
              activeSlideId === slide.id
                ? 'border-indigo-500 shadow-sm'
                : 'border-transparent hover:border-gray-300 bg-gray-50'
            )}
            onClick={() => setActiveSlide(slide.id)}
          >
            {/* Thumbnail Preview (Mock) */}
            <div className="aspect-square w-full bg-white relative">
              <div
                className={clsx(
                  'absolute inset-0 p-4 flex flex-col items-center justify-center text-center',
                  slide.backgroundStyle === 'paper' ? 'paper-texture' : ''
                )}
                style={{ backgroundColor: slide.backgroundColor }}
              >
                <div className="relative inline-block mb-2">
                  <div
                    className="absolute inset-0 rounded-sm opacity-20"
                    style={{ backgroundColor: slide.highlightColor }}
                  ></div>
                  <span className="relative text-[10px] font-bold leading-tight line-clamp-2 px-1" style={{ color: slide.textColor }}>
                    {slide.headline}
                  </span>
                </div>
                <span className="text-[8px] opacity-70 line-clamp-2" style={{ color: slide.textColor }}>
                  {slide.body}
                </span>
              </div>
            </div>

            {/* Overlay Controls */}
            <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  duplicateSlide(slide.id);
                }}
                className="p-1.5 bg-white rounded-md shadow-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
                title="Duplicate"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              {index > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    useCarouselStore.getState().reorderSlides(index, index - 1);
                  }}
                  className="p-1.5 bg-white rounded-md shadow-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
                  title="Move Up"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
              )}
              {index < slides.length - 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    useCarouselStore.getState().reorderSlides(index, index + 1);
                  }}
                  className="p-1.5 bg-white rounded-md shadow-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
                  title="Move Down"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
              {slides.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSlide(slide.id);
                  }}
                  className="p-1.5 bg-white rounded-md shadow-sm text-gray-600 hover:text-red-600 hover:bg-red-50"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Slide Number */}
            <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/50 backdrop-blur-sm text-white text-[10px] font-medium rounded">
              {index + 1}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={() => addSlide()}
          className="w-full py-2.5 flex items-center justify-center gap-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Slide
        </button>
      </div>
    </div>
  );
};
