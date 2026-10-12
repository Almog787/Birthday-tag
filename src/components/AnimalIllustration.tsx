import React, { useState } from 'react';
import { AnimalWorksheetColorMode } from '../types';
import { ANIMALS_DATABASE } from '../data/animals';

interface AnimalIllustrationProps {
  animalId: string;
  mode?: AnimalWorksheetColorMode;
  className?: string;
  size?: number | string;
  showTextInside?: boolean;
}

/**
 * High-quality illustration component rendering the user's authentic cards (row-*-column-*.png)
 * Supports both color mode and coloring-book outline/grayscale mode.
 * Robust fallback hierarchy: Bundled ES asset -> Public path -> Emoji badge.
 */
export const AnimalIllustration: React.FC<AnimalIllustrationProps> = ({
  animalId,
  mode = 'color',
  className = 'w-full h-full',
  size
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
        <span className="text-xs font-black text-amber-900 mt-1">{animal?.nameNikud || animal?.name || animalId}</span>
      </div>
    );
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
        className={`w-full h-full object-contain select-none transition-all duration-200 ${
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
