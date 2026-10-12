import React, { useState } from 'react';
import { AnimalWorksheetColorMode, AnimalImageScale } from '../types';
import { ANIMALS_DATABASE } from '../data/animals';

interface AnimalIllustrationProps {
  animalId: string;
  mode?: AnimalWorksheetColorMode;
  className?: string;
  size?: number | string;
  imageScale?: AnimalImageScale; // 'fill' (100% max), 'large' (88%), 'medium' (74%), 'contained' (60%)
  customZoom?: number; // optional custom percentage 50% - 130%
}

/**
 * High-quality illustration component rendering the user's authentic cards (row-*-column-*.png).
 * Supports both color mode and coloring-book outline/grayscale mode.
 * Crucially maintains aspect-ratio (object-contain) so images NEVER stretch or distort.
 */
export const AnimalIllustration: React.FC<AnimalIllustrationProps> = ({
  animalId,
  mode = 'color',
  className = 'w-full h-full',
  size,
  imageScale = 'fill',
  customZoom
}) => {
  const isColoring = mode === 'coloring_book';
  const animal = ANIMALS_DATABASE.find((a) => a.id === animalId);
  const [hasError, setHasError] = useState(false);

  // If error occurred or no image path, render clean friendly fallback
  if (!animal?.imagePath || hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-amber-50/80 border border-amber-200/60 rounded-2xl select-none p-2 ${className}`}
        style={size ? { width: size, height: size } : undefined}
      >
        <span className="text-3xl">{animal?.soundEmoji || '🐾'}</span>
        <span className="text-xs font-black text-amber-900 mt-1">
          {animal?.nameNikud || animal?.name || animalId}
        </span>
      </div>
    );
  }

  // Calculate zoom transform scale
  let scalePercent = 100;
  if (customZoom !== undefined) {
    scalePercent = customZoom;
  } else {
    switch (imageScale) {
      case 'fill':
        scalePercent = 100; // Maximally fills container
        break;
      case 'large':
        scalePercent = 88;
        break;
      case 'medium':
        scalePercent = 74;
        break;
      case 'contained':
        scalePercent = 60;
        break;
      default:
        scalePercent = 100;
    }
  }

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={size ? { width: size, height: size } : undefined}
    >
      <img
        src={animal.imagePath}
        alt={animal.name || animalId}
        onError={() => setHasError(true)}
        style={{
          transform: scalePercent !== 100 ? `scale(${scalePercent / 100})` : undefined,
          transformOrigin: 'center center'
        }}
        className={`w-full h-full object-contain select-none transition-transform duration-200 pointer-events-none ${
          isColoring
            ? 'grayscale contrast-150 brightness-110 filter'
            : 'drop-shadow-2xs filter'
        }`}
        loading="eager"
        draggable={false}
      />
    </div>
  );
};
