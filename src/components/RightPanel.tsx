import React, { useState } from 'react';
import { useCarouselStore, FontStyle, BackgroundStyle, LayoutStyle } from '../store';
import { Settings, Type, Palette, Layout, FileText, Download, Layers } from 'lucide-react';
import { clsx } from 'clsx';

const COLORS = [
  '#D32F2F', '#F57C00', '#FFB300', '#388E3C', '#1976D2', '#7B1FA2', '#1A1A1A', '#FFFFFF', '#F5F5F0'
];

const FONTS: { value: FontStyle; label: string }[] = [
  { value: 'inter', label: 'Inter' },
  { value: 'playfair', label: 'Playfair Display' },
  { value: 'dm-serif', label: 'DM Serif Display' },
  { value: 'libre', label: 'Libre Baskerville' },
];

const LAYOUTS: { value: LayoutStyle; label: string }[] = [
  { value: 'minimal', label: 'Minimal Quote' },
  { value: 'bold', label: 'Bold Highlight' },
  { value: 'split', label: 'Split Text' },
  { value: 'center', label: 'Center Quote' },
];

export const RightPanel: React.FC = () => {
  const { slides, activeSlideId, updateSlide, batchCreate } = useCarouselStore();
  const [batchInput, setBatchInput] = useState('');
  const [activeTab, setActiveTab] = useState<'edit' | 'batch'>('edit');

  const activeSlide = slides.find((s) => s.id === activeSlideId);

  if (!activeSlide) return null;

  const handleBatchCreate = () => {
    const lines = batchInput.split('\n').filter((l) => l.trim().length > 0);
    const quotes = lines.map((line) => {
      const parts = line.split('|');
      return {
        headline: parts[0]?.trim() || 'Your headline here',
        body: parts[1]?.trim() || 'Your body text here',
      };
    });
    if (quotes.length > 0) {
      batchCreate(quotes);
      setBatchInput('');
      setActiveTab('edit');
    }
  };

  return (
    <div className="w-full h-full min-h-0 bg-white flex flex-col">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('edit')}
          className={clsx(
            'flex-1 py-3 text-sm font-medium border-b-2 transition-colors',
            activeTab === 'edit'
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          )}
        >
          Edit Slide
        </button>
        <button
          onClick={() => setActiveTab('batch')}
          className={clsx(
            'flex-1 py-3 text-sm font-medium border-b-2 transition-colors',
            activeTab === 'batch'
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          )}
        >
          Batch Create
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {activeTab === 'edit' ? (
          <>
            {/* Text Content */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FileText className="w-4 h-4" />
                Content
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Headline</label>
                  <textarea
                    value={activeSlide.headline}
                    onChange={(e) => updateSlide(activeSlide.id, { headline: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent resize-none h-20"
                    placeholder="Enter headline..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Body Text</label>
                  <textarea
                    value={activeSlide.body}
                    onChange={(e) => updateSlide(activeSlide.id, { body: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent resize-none h-24"
                    placeholder="Enter body text..."
                  />
                </div>
              </div>
            </div>

            {/* Typography */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Type className="w-4 h-4" />
                Typography
              </div>
              
              <div>
                <label className="flex justify-between text-xs font-medium text-gray-500 mb-2">
                  <span>Headline Size</span>
                  <span>{activeSlide.headlineFontSize}px</span>
                </label>
                <input
                  type="range"
                  min="20"
                  max="96"
                  value={activeSlide.headlineFontSize}
                  onChange={(e) => updateSlide(activeSlide.id, { headlineFontSize: Number(e.target.value) })}
                  className="w-full accent-black"
                />
              </div>

              <div>
                <label className="flex justify-between text-xs font-medium text-gray-500 mb-2">
                  <span>Body Size</span>
                  <span>{activeSlide.bodyFontSize}px</span>
                </label>
                <input
                  type="range"
                  min="12"
                  max="56"
                  value={activeSlide.bodyFontSize}
                  onChange={(e) => updateSlide(activeSlide.id, { bodyFontSize: Number(e.target.value) })}
                  className="w-full accent-black"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Font Family</label>
                <div className="grid grid-cols-2 gap-2">
                  {FONTS.map((font) => (
                    <button
                      key={font.value}
                      onClick={() => updateSlide(activeSlide.id, { fontFamily: font.value })}
                      className={clsx(
                        'px-3 py-2 text-xs font-medium rounded-md border transition-colors text-left',
                        activeSlide.fontFamily === font.value
                          ? 'border-black bg-gray-50 text-black'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      )}
                      style={{ fontFamily: `var(--font-${font.value})` }}
                    >
                      {font.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Palette className="w-4 h-4" />
                Colors
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Highlight Color</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => updateSlide(activeSlide.id, { highlightColor: color })}
                      className={clsx(
                        'w-8 h-8 rounded-full border-2 transition-transform hover:scale-110',
                        activeSlide.highlightColor === color ? 'border-black shadow-sm' : 'border-transparent shadow-sm'
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <input
                    type="color"
                    value={activeSlide.highlightColor}
                    onChange={(e) => updateSlide(activeSlide.id, { highlightColor: e.target.value })}
                    className="w-8 h-8 rounded-full border-0 p-0 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Text Color</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => updateSlide(activeSlide.id, { textColor: color })}
                      className={clsx(
                        'w-8 h-8 rounded-full border-2 transition-transform hover:scale-110',
                        activeSlide.textColor === color ? 'border-indigo-500 shadow-sm' : 'border-transparent shadow-sm'
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Background Color</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => updateSlide(activeSlide.id, { backgroundColor: color })}
                      className={clsx(
                        'w-8 h-8 rounded-full border-2 transition-transform hover:scale-110',
                        activeSlide.backgroundColor === color ? 'border-indigo-500 shadow-sm' : 'border-transparent shadow-sm'
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Layout & Style */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Layout className="w-4 h-4" />
                Style
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Background Texture</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateSlide(activeSlide.id, { backgroundStyle: 'solid' })}
                    className={clsx(
                      'flex-1 px-3 py-2 text-xs font-medium rounded-md border transition-colors',
                      activeSlide.backgroundStyle === 'solid'
                        ? 'border-black bg-gray-50 text-black'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    )}
                  >
                    Solid
                  </button>
                  <button
                    onClick={() => updateSlide(activeSlide.id, { backgroundStyle: 'paper' })}
                    className={clsx(
                      'flex-1 px-3 py-2 text-xs font-medium rounded-md border transition-colors',
                      activeSlide.backgroundStyle === 'paper'
                        ? 'border-black bg-gray-50 text-black'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    )}
                  >
                    Paper Texture
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Layout Template</label>
                <div className="grid grid-cols-2 gap-2">
                  {LAYOUTS.map((layout) => (
                    <button
                      key={layout.value}
                      onClick={() => updateSlide(activeSlide.id, { layout: layout.value })}
                      className={clsx(
                        'px-3 py-2 text-xs font-medium rounded-md border transition-colors text-left',
                        activeSlide.layout === layout.value
                          ? 'border-black bg-gray-50 text-black'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      )}
                    >
                      {layout.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded-md border border-blue-100">
              Paste multiple quotes to generate slides instantly. Use a pipe <code>|</code> to separate headline and body text.
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">Quotes (One per line)</label>
              <textarea
                value={batchInput}
                onChange={(e) => setBatchInput(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent resize-none h-64 font-mono"
                placeholder="Headline 1 | Body text 1&#10;Headline 2 | Body text 2&#10;Headline 3 | Body text 3"
              />
            </div>
            <button
              onClick={handleBatchCreate}
              disabled={!batchInput.trim()}
              className="w-full py-2.5 flex items-center justify-center gap-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Layers className="w-4 h-4" />
              Generate Slides
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
