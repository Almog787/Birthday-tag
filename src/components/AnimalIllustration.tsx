import React from 'react';
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
 */
export const AnimalIllustration: React.FC<AnimalIllustrationProps> = ({
  animalId,
  mode = 'color',
  className = 'w-full h-full',
  size
}) => {
  const isColoring = mode === 'coloring_book';
  const animal = ANIMALS_DATABASE.find((a) => a.id === animalId);
  const imageSrc = animal?.imagePath;

  if (imageSrc) {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden ${className}`}
        style={size ? { width: size, height: size } : undefined}
      >
        <img
          src={imageSrc}
          alt={animal?.name || animalId}
          className={`w-full h-full object-contain select-none transition-all duration-200 ${
            isColoring
              ? 'grayscale contrast-150 brightness-110 filter'
              : 'drop-shadow-2xs filter'
          }`}
          loading="lazy"
          draggable={false}
        />
      </div>
    );
  }

  // Fallback if not found
  return (
    <div
      className={`flex items-center justify-center bg-slate-100 rounded-xl text-2xl select-none ${className}`}
      style={size ? { width: size, height: size } : undefined}
    >
      <span>{animal?.soundEmoji || '🐾'}</span>
    </div>
  );
};
