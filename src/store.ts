import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export type FontStyle = 'inter' | 'playfair' | 'dm-serif' | 'libre';
export type LayoutStyle = 'minimal' | 'bold' | 'split' | 'center';
export type BackgroundStyle = 'solid' | 'paper';

export interface Slide {
  id: string;
  headline: string;
  body: string;
  highlightColor: string;
  textColor: string;
  backgroundColor: string;
  backgroundStyle: BackgroundStyle;
  fontFamily: FontStyle;
  layout: LayoutStyle;
  headlineFontSize: number;
  bodyFontSize: number;
}

interface CarouselState {
  slides: Slide[];
  activeSlideId: string | null;
  addSlide: (slide?: Partial<Slide>) => void;
  updateSlide: (id: string, updates: Partial<Slide>) => void;
  deleteSlide: (id: string) => void;
  duplicateSlide: (id: string) => void;
  reorderSlides: (startIndex: number, endIndex: number) => void;
  setActiveSlide: (id: string) => void;
  batchCreate: (quotes: { headline: string; body: string }[]) => void;
}

const defaultSlide: Omit<Slide, 'id'> = {
  headline: "You don't need a different life.",
  body: "You need to be present in the one you're living.",
  highlightColor: '#FF3B30',
  textColor: '#141414',
  backgroundColor: '#f5f5f0',
  backgroundStyle: 'paper',
  fontFamily: 'libre',
  layout: 'minimal',
  headlineFontSize: 52,
  bodyFontSize: 24,
};

const initialSlide: Slide = { ...defaultSlide, id: uuidv4() };

export const useCarouselStore = create<CarouselState>((set, get) => ({
  slides: [initialSlide],
  activeSlideId: initialSlide.id,

  addSlide: (slide) => {
    const newSlide = { ...defaultSlide, ...slide, id: uuidv4() };
    set((state) => ({
      slides: [...state.slides, newSlide],
      activeSlideId: newSlide.id,
    }));
  },

  updateSlide: (id, updates) => {
    set((state) => ({
      slides: state.slides.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  },

  deleteSlide: (id) => {
    set((state) => {
      const newSlides = state.slides.filter((s) => s.id !== id);
      return {
        slides: newSlides,
        activeSlideId: state.activeSlideId === id ? (newSlides[0]?.id || null) : state.activeSlideId,
      };
    });
  },

  duplicateSlide: (id) => {
    set((state) => {
      const slideToDuplicate = state.slides.find((s) => s.id === id);
      if (!slideToDuplicate) return state;
      const newSlide = { ...slideToDuplicate, id: uuidv4() };
      const index = state.slides.findIndex((s) => s.id === id);
      const newSlides = [...state.slides];
      newSlides.splice(index + 1, 0, newSlide);
      return { slides: newSlides, activeSlideId: newSlide.id };
    });
  },

  reorderSlides: (startIndex, endIndex) => {
    set((state) => {
      const result = Array.from(state.slides);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return { slides: result };
    });
  },

  setActiveSlide: (id) => {
    set({ activeSlideId: id });
  },

  batchCreate: (quotes) => {
    set((state) => {
      const template = state.slides[0] || defaultSlide;
      const newSlides = quotes.map((q) => ({
        ...template,
        id: uuidv4(),
        headline: q.headline,
        body: q.body,
      }));
      return {
        slides: newSlides,
        activeSlideId: newSlides[0]?.id || null,
      };
    });
  },
}));
