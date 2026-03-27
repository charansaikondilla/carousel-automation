import React from 'react';
import { TopBar } from './components/TopBar';
import { RightPanel } from './components/RightPanel';
import { CanvasEditor } from './components/CanvasEditor';

export default function App() {
  return (
    <div className="flex flex-col h-[100dvh] w-full bg-gray-50 overflow-hidden">
      <TopBar />
      
      <div className="grid grid-rows-2 flex-1 overflow-hidden min-h-0">
        {/* Preview Area (Top for all screen sizes) */}
        <div className="w-full min-h-0 border-b border-gray-200 relative bg-white overflow-hidden">
          <CanvasEditor />
        </div>

        {/* Editor Area (Bottom for all screen sizes) */}
        <div className="min-h-0 bg-white overflow-hidden">
          <div className="h-full min-h-0">
            <RightPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
