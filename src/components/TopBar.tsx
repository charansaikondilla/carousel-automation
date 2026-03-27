import React from 'react';
import { Download, Plus, LayoutTemplate, Layers } from 'lucide-react';
import { useCarouselStore } from '../store';
import * as htmlToImage from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const TopBar: React.FC = () => {
  const { slides, addSlide } = useCarouselStore();

  const handleDownloadSingle = async () => {
    const node = document.getElementById('carousel-slide-export');
    if (!node) return;
    try {
      const dataUrl = await htmlToImage.toPng(node, {
        quality: 1,
        pixelRatio: 2,
        width: 1080,
        height: 1080,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        },
      });
      saveAs(dataUrl, 'slide.png');
    } catch (error) {
      console.error('Error downloading slide:', error);
    }
  };

  const handleDownloadAll = async () => {
    const zip = new JSZip();
    
    try {
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        const node = document.getElementById(`slide-export-${slide.id}`);
        if (!node) continue;
        
        const dataUrl = await htmlToImage.toPng(node, {
          quality: 1,
          pixelRatio: 2,
          width: 1080,
          height: 1080,
          style: {
            transform: 'scale(1)',
            transformOrigin: 'top left',
          },
        });
        
        // Remove the data:image/png;base64, prefix
        const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
        zip.file(`carousel-${i + 1}.png`, base64Data, { base64: true });
      }
      
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'carousel-slides.zip');
    } catch (error) {
      console.error('Error downloading all slides:', error);
    }
  };

  return (
    <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-3 md:px-6 shrink-0 gap-2">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
          <Layers className="w-5 h-5 text-white" />
        </div>
        <span className="font-semibold text-base md:text-lg tracking-tight">Carousel Editor</span>
      </div>

      <div className="flex items-center gap-2 md:gap-3 overflow-x-auto">
        <button
          onClick={() => addSlide()}
          className="flex items-center gap-2 px-2.5 md:px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden md:inline">New Slide</span>
        </button>
        
        <div className="h-6 w-px bg-gray-300 mx-1 hidden md:block"></div>

        <button
          onClick={handleDownloadSingle}
          className="flex items-center gap-2 px-2.5 md:px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap"
        >
          <Download className="w-4 h-4" />
          <span className="hidden md:inline">Export Slide</span>
        </button>
        
        <button
          onClick={handleDownloadAll}
          className="flex items-center gap-2 px-2.5 md:px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 transition-colors whitespace-nowrap"
        >
          <Download className="w-4 h-4" />
          <span className="hidden md:inline">Export All (ZIP)</span>
        </button>
      </div>
    </div>
  );
};
