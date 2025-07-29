'use client';

import React from 'react';
import { DragProvider } from './drag-context';
import { ComponentPalette } from './component-palette';
import { CanvasArea } from './canvas-area';
import { PropertyEditor } from './property-editor';

export const BuilderInterface = () => {
  return (
    <div className="flex-1 overflow-hidden">
      <DragProvider>
        <div className="flex h-full">
          {/* Left panel - Component palette */}
          <div className="border-r bg-background">
            <ComponentPalette />
          </div>

          {/* Center panel - Canvas */}
          <div className="flex-1 min-w-0">
            <CanvasArea />
          </div>

          {/* Right panel - Property editor */}
          <div className="border-l bg-background">
            <PropertyEditor />
          </div>
        </div>
      </DragProvider>
    </div>
  );
};