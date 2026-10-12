import React from 'react';
import { AnimalWorksheetColorMode } from '../types';

interface StoryAnimationIllustrationProps {
  animalId: string;
  mode?: AnimalWorksheetColorMode;
  className?: string;
  size?: number | string;
}

/**
 * Storybook 2D Animation Art Style illustrations
 * Inspired by the warm storybook elephant illustration:
 * - Expressive cute black bead eyes with white catchlight glints
 * - Rosy soft blushing cheeks
 * - Gentle pastel warm palette with soft inner gradients and watercolor feel
 * - Clean expressive character contours (black/slate ink outlines)
 * - Clear, countable legs (2 or 4) so educational leg counting is preserved!
 * - Supports coloring book mode (clean outlines on white)
 */
export const StoryAnimationIllustration: React.FC<StoryAnimationIllustrationProps> = ({
  animalId,
  mode = 'color',
  className = 'w-full h-full',
  size
}) => {
  const isColoring = mode === 'coloring_book';

  const strokeColor = '#1e1b4b'; // Soft deep ink stroke
  const strokeW = 2.4;

  const commonSvgProps = {
    viewBox: '0 0 100 100',
    className,
    style: size ? { width: size, height: size } : undefined,
    xmlns: 'http://www.w3.org/2000/svg'
  };

  // Reusable gradient defs for the storybook animation look
  const renderDefs = (idPrefix: string, primaryColor1: string, primaryColor2: string, bellyColor?: string) => (
    <defs>
      <linearGradient id={`${idPrefix}-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={isColoring ? '#ffffff' : primaryColor1} />
        <stop offset="100%" stopColor={isColoring ? '#ffffff' : primaryColor2} />
      </linearGradient>
      {bellyColor && (
        <linearGradient id={`${idPrefix}-belly`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={isColoring ? '#ffffff' : '#ffffff'} />
          <stop offset="100%" stopColor={isColoring ? '#ffffff' : bellyColor} />
        </linearGradient>
      )}
      <radialGradient id={`${idPrefix}-blush`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#f43f5e" stopOpacity={isColoring ? '0' : '0.55'} />
        <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
      </radialGradient>
      <filter id={`${idPrefix}-shadow`} x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="#1e1b4b" floodOpacity="0.12" />
      </filter>
    </defs>
  );

  switch (animalId) {
    // ==========================================
    // 4 LEGS - STORYBOOK ANIMATION STYLE
    // ==========================================

    case 'elephant': // פיל בסגנון האנימציה המדויק של התמונה!
      return (
        <svg {...commonSvgProps}>
          {renderDefs('story-elephant', '#93c5fd', '#60a5fa')}
          {/* Soft Ground Shadow */}
          {!isColoring && <ellipse cx="50" cy="88" rx="36" ry="4" fill="#cbd5e1" opacity="0.4" />}

          {/* Tiny Wagging Tail */}
          <path d="M 19 54 Q 13 58 15 65" stroke={strokeColor} strokeWidth={strokeW} fill="none" strokeLinecap="round" />
          {!isColoring && <circle cx="15" cy="65" r="1.5" fill="#475569" />}

          {/* Back Hind Leg (Leg 1 of 4) */}
          <rect x="23" y="60" width="10" height="26" rx="4" fill={isColoring ? '#ffffff' : '#93c5fd'} stroke={strokeColor} strokeWidth={strokeW} />
          {!isColoring && (
            <g fill="#eff6ff">
              <circle cx="26" cy="84" r="1.5" />
              <circle cx="30" cy="84" r="1.5" />
            </g>
          )}

          {/* Back Front Leg (Leg 2 of 4) */}
          <rect x="57" y="60" width="10" height="26" rx="4" fill={isColoring ? '#ffffff' : '#93c5fd'} stroke={strokeColor} strokeWidth={strokeW} />
          {!isColoring && (
            <g fill="#eff6ff">
              <circle cx="60" cy="84" r="1.5" />
              <circle cx="64" cy="84" r="1.5" />
            </g>
          )}

          {/* Foreground Hind Leg (Leg 3 of 4) */}
          <rect x="33" y="62" width="11" height="26" rx="4" fill={isColoring ? '#ffffff' : 'url(#story-elephant-grad)'} stroke={strokeColor} strokeWidth={strokeW} />
          {!isColoring && (
            <g fill="#ffffff">
              <circle cx="36" cy="86" r="1.8" />
              <circle cx="41" cy="86" r="1.8" />
            </g>
          )}

          {/* Foreground Front Leg (Leg 4 of 4) */}
          <rect x="67" y="62" width="11" height="26" rx="4" fill={isColoring ? '#ffffff' : 'url(#story-elephant-grad)'} stroke={strokeColor} strokeWidth={strokeW} />
          {!isColoring && (
            <g fill="#ffffff">
              <circle cx="70" cy="86" r="1.8" />
              <circle cx="75" cy="86" r="1.8" />
            </g>
          )}

          {/* Big Rounded Storybook Body */}
          <path
            d="M 22 56 C 20 38 42 34 58 38 C 70 41 74 54 74 65 C 74 72 58 74 44 74 C 30 74 22 68 22 56 Z"
            fill={isColoring ? '#ffffff' : 'url(#story-elephant-grad)'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />

          {/* Left / Back Ear Rim */}
          <path
            d="M 52 32 C 48 24 58 20 64 24"
            fill={isColoring ? '#ffffff' : '#bfdbfe'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />

          {/* Big Storybook Elephant Head */}
          <circle
            cx="68"
            cy="40"
            r="16"
            fill={isColoring ? '#ffffff' : 'url(#story-elephant-grad)'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />

          {/* Happy Up-Curled Trunk */}
          <path
            d="M 78 44 C 84 45 92 50 91 58 C 90 65 83 67 80 62 C 78 58 83 54 85 54"
            fill="none"
            stroke={isColoring ? strokeColor : '#60a5fa'}
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M 78 44 C 84 45 92 50 91 58 C 90 65 83 67 80 62 C 78 58 83 54 85 54"
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeW}
            strokeLinecap="round"
          />

          {/* Big Soft Flapping Ear */}
          <path
            d="M 56 34 C 48 34 46 48 52 54 C 57 58 64 54 62 42 Z"
            fill={isColoring ? '#ffffff' : '#bfdbfe'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Inner Ear Soft Pink Tint */}
          {!isColoring && (
            <path d="M 55 37 C 50 38 49 46 53 50 C 56 52 59 50 58 42 Z" fill="#fbcfe8" opacity="0.8" />
          )}

          {/* Soft Rosy Cheek Blush */}
          {!isColoring && <circle cx="70" cy="46" r="3.5" fill="#f43f5e" opacity="0.45" />}

          {/* Large Friendly Storybook Eye with Catchlight Glints */}
          <ellipse cx="71" cy="36" rx="3.5" ry="4" fill={strokeColor} />
          <circle cx="72" cy="34.5" r="1.3" fill="#ffffff" />
          <circle cx="70" cy="37.5" r="0.7" fill="#ffffff" />

          {/* Small Cheerful Mouth under trunk */}
          <path d="M 73 47 Q 76 50 78 47" stroke={strokeColor} strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </svg>
      );

    case 'cow': // פרה בסגנון אנימציה סיפורי
      return (
        <svg {...commonSvgProps}>
          {renderDefs('story-cow', '#ffffff', '#f1f5f9')}
          {!isColoring && <ellipse cx="50" cy="88" rx="36" ry="4" fill="#cbd5e1" opacity="0.4" />}

          {/* Tail with cute heart tuft */}
          <path d="M 18 52 Q 10 58 14 68" stroke={strokeColor} strokeWidth={strokeW} fill="none" strokeLinecap="round" />
          <circle cx="14" cy="69" r="2.5" fill={isColoring ? '#ffffff' : '#1e1b4b'} />

          {/* Back Legs (2 of 4) */}
          <rect x="23" y="60" width="8" height="26" rx="3" fill={isColoring ? '#ffffff' : '#e2e8f0'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="23" y="82" width="8" height="4" fill={strokeColor} />
          <rect x="58" y="60" width="8" height="26" rx="3" fill={isColoring ? '#ffffff' : '#e2e8f0'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="58" y="82" width="8" height="4" fill={strokeColor} />

          {/* Cute Pink Udder */}
          {!isColoring && (
            <path d="M 31 66 C 30 72 38 73 39 67 Z" fill="#fbcfe8" stroke={strokeColor} strokeWidth="1.2" />
          )}

          {/* Foreground Legs (2 of 4) */}
          <rect x="33" y="62" width="9" height="25" rx="3" fill="#ffffff" stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="33" y="83" width="9" height="4" fill={strokeColor} />
          <rect x="68" y="62" width="9" height="25" rx="3" fill="#ffffff" stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="68" y="83" width="9" height="4" fill={strokeColor} />

          {/* Chubby Round Body */}
          <ellipse cx="46" cy="54" rx="25" ry="18" fill="url(#story-cow-grad)" stroke={strokeColor} strokeWidth={strokeW} />

          {/* Cute Soft Cow Spots */}
          {!isColoring && (
            <>
              <path d="M 30 42 C 34 38 42 42 38 48 C 34 52 28 48 30 42 Z" fill="#1e1b4b" opacity="0.85" />
              <path d="M 46 54 C 52 50 56 56 52 62 C 48 64 44 60 46 54 Z" fill="#1e1b4b" opacity="0.85" />
            </>
          )}

          {/* Curved Horns */}
          <path d="M 67 22 Q 68 15 72 17" stroke={strokeColor} strokeWidth={strokeW} fill="none" strokeLinecap="round" />
          <path d="M 80 22 Q 82 15 85 18" stroke={strokeColor} strokeWidth={strokeW} fill="none" strokeLinecap="round" />

          {/* Drooping Cute Ears */}
          <ellipse cx="63" cy="27" rx="5" ry="3" fill={isColoring ? '#ffffff' : '#fbcfe8'} stroke={strokeColor} strokeWidth={strokeW} transform="rotate(-20 63 27)" />
          <ellipse cx="87" cy="27" rx="5" ry="3" fill={isColoring ? '#ffffff' : '#fbcfe8'} stroke={strokeColor} strokeWidth={strokeW} transform="rotate(20 87 27)" />

          {/* Big Cute Head */}
          <circle cx="75" cy="32" r="14" fill="#ffffff" stroke={strokeColor} strokeWidth={strokeW} />

          {/* Big Pink Snout with Nostrils */}
          <ellipse cx="78" cy="38" rx="8" ry="6" fill={isColoring ? '#ffffff' : '#fbcfe8'} stroke={strokeColor} strokeWidth={strokeW} />
          <ellipse cx="76" cy="37" rx="1.3" ry="1.8" fill={strokeColor} />
          <ellipse cx="81" cy="37" rx="1.3" ry="1.8" fill={strokeColor} />
          <path d="M 76 41 Q 78 43 81 41" stroke={strokeColor} strokeWidth="1.4" fill="none" strokeLinecap="round" />

          {/* Storybook Eyes */}
          <ellipse cx="70" cy="28" rx="2.8" ry="3.2" fill={strokeColor} />
          <circle cx="71" cy="27" r="1" fill="#ffffff" />
          <ellipse cx="79" cy="27" rx="2.5" ry="3" fill={strokeColor} />
          <circle cx="80" cy="26" r="0.9" fill="#ffffff" />

          {/* Rosy Cheeks */}
          {!isColoring && <circle cx="68" cy="34" r="3" fill="#f43f5e" opacity="0.4" />}
          {/* Cute Cowbell */}
          {!isColoring && <polygon points="63,48 67,48 68,54 62,54" fill="#fbbf24" stroke={strokeColor} strokeWidth="1.2" />}
        </svg>
      );

    case 'dog': // כלבלב חמוד בסגנון אנימציה
      return (
        <svg {...commonSvgProps}>
          {renderDefs('story-dog', '#fbbf24', '#f59e0b')}
          {!isColoring && <ellipse cx="50" cy="88" rx="34" ry="4" fill="#cbd5e1" opacity="0.4" />}

          {/* Happy Wagging Tail */}
          <path d="M 22 52 Q 12 40 16 32" stroke={strokeColor} strokeWidth={strokeW} fill="none" strokeLinecap="round" />

          {/* 4 Paws (2 back, 2 front) */}
          <rect x="25" y="62" width="7" height="24" rx="3.5" fill={isColoring ? '#ffffff' : '#f59e0b'} stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="28.5" cy="85" r="4" fill={isColoring ? '#ffffff' : '#fef3c7'} stroke={strokeColor} strokeWidth={strokeW} />

          <rect x="56" y="62" width="7" height="24" rx="3.5" fill={isColoring ? '#ffffff' : '#f59e0b'} stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="59.5" cy="85" r="4" fill={isColoring ? '#ffffff' : '#fef3c7'} stroke={strokeColor} strokeWidth={strokeW} />

          <rect x="34" y="64" width="8" height="23" rx="4" fill={isColoring ? '#ffffff' : '#fbbf24'} stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="38" cy="86" r="4.5" fill={isColoring ? '#ffffff' : '#ffffff'} stroke={strokeColor} strokeWidth={strokeW} />

          <rect x="66" y="64" width="8" height="23" rx="4" fill={isColoring ? '#ffffff' : '#fbbf24'} stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="70" cy="86" r="4.5" fill={isColoring ? '#ffffff' : '#ffffff'} stroke={strokeColor} strokeWidth={strokeW} />

          {/* Puppy Body */}
          <ellipse cx="46" cy="54" rx="22" ry="16" fill="url(#story-dog-grad)" stroke={strokeColor} strokeWidth={strokeW} />
          {/* White Chest */}
          {!isColoring && <ellipse cx="54" cy="56" rx="8" ry="10" fill="#ffffff" opacity="0.9" />}

          {/* Floppy Soft Brown Ear */}
          <path d="M 58 26 C 54 20 48 36 52 44 C 55 48 60 42 60 32 Z" fill={isColoring ? '#ffffff' : '#b45309'} stroke={strokeColor} strokeWidth={strokeW} />

          {/* Puppy Head */}
          <circle cx="68" cy="35" r="15" fill="url(#story-dog-grad)" stroke={strokeColor} strokeWidth={strokeW} />

          {/* Front Floppy Ear */}
          <path d="M 76 22 C 84 20 86 36 82 42 C 78 46 74 38 74 26 Z" fill={isColoring ? '#ffffff' : '#b45309'} stroke={strokeColor} strokeWidth={strokeW} />

          {/* Rosy Cheeks */}
          {!isColoring && (
            <>
              <circle cx="62" cy="40" r="3" fill="#f43f5e" opacity="0.45" />
              <circle cx="75" cy="40" r="3" fill="#f43f5e" opacity="0.45" />
            </>
          )}

          {/* Nose */}
          <polygon points="68,36 65,33 71,33" fill={strokeColor} />
          {/* Mouth & Cute Tongue */}
          <path d="M 68 36 L 68 40 M 65 39 Q 68 41 71 39" stroke={strokeColor} strokeWidth="1.5" fill="none" strokeLinecap="round" />
          {!isColoring && <ellipse cx="69" cy="42" rx="2" ry="3" fill="#f43f5e" stroke={strokeColor} strokeWidth="1" />}

          {/* Big Sparkly Storybook Eyes */}
          <ellipse cx="63" cy="31" rx="3.2" ry="3.8" fill={strokeColor} />
          <circle cx="64" cy="29.5" r="1.2" fill="#ffffff" />
          <ellipse cx="73" cy="31" rx="3.2" ry="3.8" fill={strokeColor} />
          <circle cx="74" cy="29.5" r="1.2" fill="#ffffff" />
        </svg>
      );

    case 'cat': // חתלתול מתוק
      return (
        <svg {...commonSvgProps}>
          {renderDefs('story-cat', '#fdba74', '#fb923c')}
          {!isColoring && <ellipse cx="50" cy="88" rx="32" ry="4" fill="#cbd5e1" opacity="0.4" />}

          {/* Curled High Cat Tail */}
          <path d="M 22 56 C 10 50 12 28 20 30 C 24 32 20 44 24 50" stroke={strokeColor} strokeWidth={strokeW} fill="none" strokeLinecap="round" />

          {/* 4 Delicate Paws */}
          <rect x="26" y="64" width="6" height="22" rx="3" fill={isColoring ? '#ffffff' : '#ea580c'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="54" y="64" width="6" height="22" rx="3" fill={isColoring ? '#ffffff' : '#ea580c'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="34" y="66" width="7" height="21" rx="3" fill="#ffffff" stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="62" y="66" width="7" height="21" rx="3" fill="#ffffff" stroke={strokeColor} strokeWidth={strokeW} />

          {/* Round Fluffy Body */}
          <ellipse cx="45" cy="56" rx="20" ry="16" fill="url(#story-cat-grad)" stroke={strokeColor} strokeWidth={strokeW} />
          {!isColoring && <ellipse cx="48" cy="58" rx="7" ry="10" fill="#ffffff" opacity="0.9" />}

          {/* Pointy Cat Ears */}
          <polygon points="58,24 62,12 68,22" fill={isColoring ? '#ffffff' : '#fb923c'} stroke={strokeColor} strokeWidth={strokeW} />
          {!isColoring && <polygon points="60,22 62,15 66,21" fill="#fbcfe8" />}
          <polygon points="73,22 79,12 83,24" fill={isColoring ? '#ffffff' : '#fb923c'} stroke={strokeColor} strokeWidth={strokeW} />
          {!isColoring && <polygon points="75,21 79,15 81,22" fill="#fbcfe8" />}

          {/* Big Cute Head */}
          <circle cx="70" cy="34" r="14" fill="url(#story-cat-grad)" stroke={strokeColor} strokeWidth={strokeW} />

          {/* Whiskers */}
          <line x1="78" y1="36" x2="88" y2="34" stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round" />
          <line x1="78" y1="38" x2="88" y2="39" stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round" />
          <line x1="62" y1="36" x2="52" y2="34" stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round" />
          <line x1="62" y1="38" x2="52" y2="39" stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round" />

          {/* Rosy Cheeks */}
          {!isColoring && (
            <>
              <circle cx="64" cy="38" r="2.8" fill="#f43f5e" opacity="0.45" />
              <circle cx="76" cy="38" r="2.8" fill="#f43f5e" opacity="0.45" />
            </>
          )}

          {/* Tiny Pink Nose & W-Mouth */}
          <polygon points="70,35 68,33 72,33" fill="#f43f5e" />
          <path d="M 67 37 Q 70 39 73 37" stroke={strokeColor} strokeWidth="1.4" fill="none" strokeLinecap="round" />

          {/* Big Green Storybook Eyes */}
          <ellipse cx="65" cy="29" rx="3.2" ry="3.8" fill={isColoring ? strokeColor : '#10b981'} stroke={strokeColor} strokeWidth="1" />
          <ellipse cx="65" cy="29" rx="1.8" ry="3.2" fill={strokeColor} />
          <circle cx="66" cy="28" r="1" fill="#ffffff" />
          <ellipse cx="75" cy="29" rx="3.2" ry="3.8" fill={isColoring ? strokeColor : '#10b981'} stroke={strokeColor} strokeWidth="1" />
          <ellipse cx="75" cy="29" rx="1.8" ry="3.2" fill={strokeColor} />
          <circle cx="76" cy="28" r="1" fill="#ffffff" />
        </svg>
      );

    case 'lion': // אריה - מלך החיות חמוד ורך
      return (
        <svg {...commonSvgProps}>
          {renderDefs('story-lion', '#fde047', '#eab308')}
          {!isColoring && <ellipse cx="50" cy="88" rx="35" ry="4" fill="#cbd5e1" opacity="0.4" />}

          {/* Tail with tuft */}
          <path d="M 18 52 Q 10 46 12 36" stroke={strokeColor} strokeWidth={strokeW} fill="none" strokeLinecap="round" />
          <circle cx="12" cy="35" r="3" fill={isColoring ? '#ffffff' : '#b45309'} />

          {/* 4 Sturdy Paws */}
          <rect x="24" y="62" width="8" height="24" rx="3.5" fill={isColoring ? '#ffffff' : '#ca8a04'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="56" y="62" width="8" height="24" rx="3.5" fill={isColoring ? '#ffffff' : '#ca8a04'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="33" y="64" width="9" height="23" rx="4" fill="url(#story-lion-grad)" stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="66" y="64" width="9" height="23" rx="4" fill="url(#story-lion-grad)" stroke={strokeColor} strokeWidth={strokeW} />

          {/* Body */}
          <ellipse cx="46" cy="56" rx="23" ry="17" fill="url(#story-lion-grad)" stroke={strokeColor} strokeWidth={strokeW} />

          {/* Big Fluffy Cloud Mane */}
          <circle cx="70" cy="35" r="20" fill={isColoring ? '#ffffff' : '#f97316'} stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="56" cy="30" r="8" fill={isColoring ? '#ffffff' : '#ea580c'} />
          <circle cx="84" cy="30" r="8" fill={isColoring ? '#ffffff' : '#ea580c'} />
          <circle cx="58" cy="44" r="8" fill={isColoring ? '#ffffff' : '#ea580c'} />
          <circle cx="82" cy="44" r="8" fill={isColoring ? '#ffffff' : '#ea580c'} />
          <circle cx="70" cy="18" r="8" fill={isColoring ? '#ffffff' : '#ea580c'} />

          {/* Round Ears */}
          <circle cx="60" cy="22" r="4.5" fill={isColoring ? '#ffffff' : '#fde047'} stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="80" cy="22" r="4.5" fill={isColoring ? '#ffffff' : '#fde047'} stroke={strokeColor} strokeWidth={strokeW} />

          {/* Cute Face */}
          <circle cx="70" cy="36" r="13" fill="url(#story-lion-grad)" stroke={strokeColor} strokeWidth={strokeW} />

          {/* Brown Nose & Whiskers */}
          <polygon points="70,36 67,33 73,33" fill="#92400e" />
          <path d="M 70 36 L 70 39 M 67 38 Q 70 40 73 38" stroke={strokeColor} strokeWidth="1.4" fill="none" />
          <line x1="77" y1="37" x2="85" y2="36" stroke={strokeColor} strokeWidth="1" />
          <line x1="63" y1="37" x2="55" y2="36" stroke={strokeColor} strokeWidth="1" />

          {/* Rosy Cheeks */}
          {!isColoring && (
            <>
              <circle cx="64" cy="39" r="2.5" fill="#f43f5e" opacity="0.4" />
              <circle cx="76" cy="39" r="2.5" fill="#f43f5e" opacity="0.4" />
            </>
          )}

          {/* Large Storybook Eyes */}
          <ellipse cx="65" cy="30" rx="3.2" ry="3.8" fill={strokeColor} />
          <circle cx="66" cy="29" r="1.2" fill="#ffffff" />
          <ellipse cx="75" cy="30" rx="3.2" ry="3.8" fill={strokeColor} />
          <circle cx="76" cy="29" r="1.2" fill="#ffffff" />
        </svg>
      );

    case 'horse': // סוסון
      return (
        <svg {...commonSvgProps}>
          {renderDefs('story-horse', '#d97706', '#b45309')}
          {!isColoring && <ellipse cx="50" cy="88" rx="36" ry="4" fill="#cbd5e1" opacity="0.4" />}
          {/* Flowing Tail */}
          <path d="M 18 52 C 10 56 12 76 16 80" stroke={strokeColor} strokeWidth="4" fill="none" strokeLinecap="round" />

          {/* 4 Hoofed Legs */}
          <rect x="22" y="60" width="7" height="26" rx="2" fill={isColoring ? '#ffffff' : '#92400e'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="22" y="82" width="7" height="4" fill={strokeColor} />
          <rect x="58" y="60" width="7" height="26" rx="2" fill={isColoring ? '#ffffff' : '#92400e'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="58" y="82" width="7" height="4" fill={strokeColor} />
          <rect x="32" y="62" width="8" height="25" rx="2" fill="url(#story-horse-grad)" stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="32" y="83" width="8" height="4" fill={strokeColor} />
          <rect x="68" y="62" width="8" height="25" rx="2" fill="url(#story-horse-grad)" stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="68" y="83" width="8" height="4" fill={strokeColor} />

          {/* Body */}
          <ellipse cx="46" cy="54" rx="24" ry="16" fill="url(#story-horse-grad)" stroke={strokeColor} strokeWidth={strokeW} />

          {/* Mane */}
          <path d="M 64 22 C 58 28 60 44 65 48" stroke={isColoring ? strokeColor : '#78350f'} strokeWidth="6" strokeLinecap="round" fill="none" />

          {/* Neck & Head */}
          <path d="M 62 48 L 74 24 L 84 32 L 72 52 Z" fill="url(#story-horse-grad)" stroke={strokeColor} strokeWidth={strokeW} />
          <ellipse cx="80" cy="28" rx="10" ry="7" fill="url(#story-horse-grad)" stroke={strokeColor} strokeWidth={strokeW} transform="rotate(15 80 28)" />

          {/* Ears */}
          <polygon points="72,22 74,15 76,22" fill={isColoring ? '#ffffff' : '#b45309'} stroke={strokeColor} strokeWidth="1.5" />
          <polygon points="77,22 80,16 82,23" fill={isColoring ? '#ffffff' : '#b45309'} stroke={strokeColor} strokeWidth="1.5" />

          {/* Muzzle */}
          <ellipse cx="87" cy="32" rx="4" ry="3" fill={isColoring ? '#ffffff' : '#fed7aa'} stroke={strokeColor} strokeWidth="1.2" />
          <circle cx="87" cy="32" r="0.8" fill={strokeColor} />

          {/* Big Storybook Eye */}
          <ellipse cx="76" cy="24" rx="2.8" ry="3.2" fill={strokeColor} />
          <circle cx="77" cy="23" r="1" fill="#ffffff" />
          {!isColoring && <circle cx="80" cy="31" r="2" fill="#f43f5e" opacity="0.4" />}
        </svg>
      );

    case 'sheep': // כבשה ענן צמר
      return (
        <svg {...commonSvgProps}>
          {renderDefs('story-sheep', '#ffffff', '#f8fafc')}
          {!isColoring && <ellipse cx="50" cy="88" rx="34" ry="4" fill="#cbd5e1" opacity="0.4" />}

          {/* 4 Dark Little Hooves */}
          <rect x="27" y="64" width="6" height="22" rx="2" fill={isColoring ? '#ffffff' : '#475569'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="37" y="64" width="6" height="22" rx="2" fill={isColoring ? '#ffffff' : '#475569'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="56" y="64" width="6" height="22" rx="2" fill={isColoring ? '#ffffff' : '#475569'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="66" y="64" width="6" height="22" rx="2" fill={isColoring ? '#ffffff' : '#475569'} stroke={strokeColor} strokeWidth={strokeW} />

          {/* Cloud Puffs Body */}
          <circle cx="34" cy="50" r="13" fill="url(#story-sheep-grad)" stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="48" cy="42" r="15" fill="url(#story-sheep-grad)" stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="62" cy="48" r="13" fill="url(#story-sheep-grad)" stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="48" cy="58" r="14" fill="url(#story-sheep-grad)" stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="36" cy="60" r="11" fill="url(#story-sheep-grad)" stroke={strokeColor} strokeWidth={strokeW} />

          {/* Dark Cute Head */}
          <ellipse cx="73" cy="40" rx="9" ry="11" fill={isColoring ? '#ffffff' : '#475569'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Wool Cap on Head */}
          <circle cx="73" cy="30" r="5" fill="#ffffff" stroke={strokeColor} strokeWidth="1.5" />
          {/* Drooping Ears */}
          <ellipse cx="65" cy="38" rx="5" ry="3" fill={isColoring ? '#ffffff' : '#334155'} stroke={strokeColor} strokeWidth="1.5" />

          {/* Big White Sparkly Eye */}
          <circle cx="74" cy="38" r="3" fill="#ffffff" />
          <circle cx="75" cy="38" r="1.8" fill={strokeColor} />
          <circle cx="75.5" cy="37.5" r="0.6" fill="#ffffff" />
          {!isColoring && <circle cx="72" cy="44" r="2.5" fill="#f43f5e" opacity="0.45" />}
        </svg>
      );

    case 'giraffe': // ג'ירפה חמודה עם צוואר ארוך
      return (
        <svg {...commonSvgProps}>
          {renderDefs('story-giraffe', '#fde047', '#f59e0b')}
          {!isColoring && <ellipse cx="50" cy="88" rx="34" ry="4" fill="#cbd5e1" opacity="0.4" />}
          {/* Tail */}
          <path d="M 24 58 L 18 70" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" />
          <circle cx="18" cy="71" r="2" fill="#78350f" />

          {/* 4 Stilt Legs */}
          <rect x="25" y="62" width="6" height="25" rx="2" fill={isColoring ? '#ffffff' : '#d97706'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="35" y="62" width="6" height="25" rx="2" fill={isColoring ? '#ffffff' : '#d97706'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="52" y="62" width="6" height="25" rx="2" fill={isColoring ? '#ffffff' : '#f59e0b'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="62" y="62" width="6" height="25" rx="2" fill={isColoring ? '#ffffff' : '#f59e0b'} stroke={strokeColor} strokeWidth={strokeW} />

          {/* Body */}
          <ellipse cx="44" cy="54" rx="20" ry="14" fill="url(#story-giraffe-grad)" stroke={strokeColor} strokeWidth={strokeW} />

          {/* Long Slanted Neck */}
          <path d="M 52 50 L 68 20 L 76 23 L 62 56 Z" fill="url(#story-giraffe-grad)" stroke={strokeColor} strokeWidth={strokeW} />

          {/* Soft Spots */}
          {!isColoring && (
            <>
              <circle cx="40" cy="52" r="3.5" fill="#b45309" opacity="0.8" />
              <circle cx="50" cy="54" r="3" fill="#b45309" opacity="0.8" />
              <circle cx="62" cy="38" r="2.5" fill="#b45309" opacity="0.8" />
              <circle cx="67" cy="27" r="2" fill="#b45309" opacity="0.8" />
            </>
          )}

          {/* Little Antler Knobs (Ossicones) */}
          <line x1="72" y1="18" x2="72" y2="12" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="72" cy="11" r="1.8" fill="#78350f" />
          <line x1="77" y1="18" x2="78" y2="13" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="78" cy="12" r="1.8" fill="#78350f" />

          {/* Head & Soft Muzzle */}
          <circle cx="75" cy="22" r="9" fill="url(#story-giraffe-grad)" stroke={strokeColor} strokeWidth={strokeW} />
          <ellipse cx="80" cy="24" rx="4" ry="3" fill={isColoring ? '#ffffff' : '#fed7aa'} stroke={strokeColor} strokeWidth="1.2" />
          <circle cx="81" cy="24" r="0.8" fill={strokeColor} />

          {/* Storybook Eye */}
          <ellipse cx="73" cy="20" rx="2.5" ry="3" fill={strokeColor} />
          <circle cx="74" cy="19" r="0.9" fill="#ffffff" />
          {!isColoring && <circle cx="75" cy="25" r="2" fill="#f43f5e" opacity="0.4" />}
        </svg>
      );

    case 'tiger': // נמר חמוד
      return (
        <svg {...commonSvgProps}>
          {renderDefs('story-tiger', '#fb923c', '#f97316')}
          {!isColoring && <ellipse cx="50" cy="88" rx="35" ry="4" fill="#cbd5e1" opacity="0.4" />}
          {/* Striped Tail */}
          <path d="M 20 54 Q 10 44 14 34" stroke={strokeColor} strokeWidth={strokeW} fill="none" strokeLinecap="round" />

          {/* 4 Paws */}
          <rect x="25" y="62" width="7" height="24" rx="3.5" fill={isColoring ? '#ffffff' : '#ea580c'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="55" y="62" width="7" height="24" rx="3.5" fill={isColoring ? '#ffffff' : '#ea580c'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="34" y="64" width="8" height="23" rx="4" fill="url(#story-tiger-grad)" stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="65" y="64" width="8" height="23" rx="4" fill="url(#story-tiger-grad)" stroke={strokeColor} strokeWidth={strokeW} />

          {/* Body with Stripes */}
          <ellipse cx="46" cy="55" rx="22" ry="16" fill="url(#story-tiger-grad)" stroke={strokeColor} strokeWidth={strokeW} />
          {!isColoring && (
            <>
              <path d="M 38 46 L 40 52 L 36 56" stroke={strokeColor} strokeWidth="1.8" fill="none" />
              <path d="M 46 44 L 48 50 L 44 56" stroke={strokeColor} strokeWidth="1.8" fill="none" />
            </>
          )}

          {/* Head & Round Ears */}
          <circle cx="61" cy="23" r="4" fill={isColoring ? '#ffffff' : '#f97316'} stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="77" cy="23" r="4" fill={isColoring ? '#ffffff' : '#f97316'} stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="69" cy="34" r="14" fill="url(#story-tiger-grad)" stroke={strokeColor} strokeWidth={strokeW} />

          {/* White Snout & Nose */}
          <ellipse cx="69" cy="38" rx="6" ry="4" fill="#ffffff" stroke={strokeColor} strokeWidth="1.2" />
          <polygon points="69,37 67,35 71,35" fill="#f43f5e" />
          <path d="M 67 39 Q 69 41 71 39" stroke={strokeColor} strokeWidth="1.2" fill="none" />

          {/* Big Eyes */}
          <ellipse cx="64" cy="30" rx="3" ry="3.6" fill={strokeColor} />
          <circle cx="65" cy="29" r="1" fill="#ffffff" />
          <ellipse cx="74" cy="30" rx="3" ry="3.6" fill={strokeColor} />
          <circle cx="75" cy="29" r="1" fill="#ffffff" />
          {!isColoring && (
            <>
              <circle cx="63" cy="38" r="2.5" fill="#f43f5e" opacity="0.4" />
              <circle cx="75" cy="38" r="2.5" fill="#f43f5e" opacity="0.4" />
            </>
          )}
        </svg>
      );

    case 'turtle': // צב
      return (
        <svg {...commonSvgProps}>
          {renderDefs('story-turtle', '#4ade80', '#22c55e')}
          {!isColoring && <ellipse cx="50" cy="88" rx="34" ry="4" fill="#cbd5e1" opacity="0.4" />}
          {/* Little Tail */}
          <polygon points="18,65 14,67 18,69" fill={isColoring ? '#ffffff' : '#22c55e'} stroke={strokeColor} strokeWidth="1.5" />

          {/* 4 Crawling Flippers/Legs */}
          <rect x="24" y="68" width="8" height="18" rx="4" fill={isColoring ? '#ffffff' : '#16a34a'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="56" y="68" width="8" height="18" rx="4" fill={isColoring ? '#ffffff' : '#16a34a'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="33" y="70" width="9" height="18" rx="4.5" fill="url(#story-turtle-grad)" stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="64" y="70" width="9" height="18" rx="4.5" fill="url(#story-turtle-grad)" stroke={strokeColor} strokeWidth={strokeW} />

          {/* Big Dome Shell with Pastel Tiles */}
          <path d="M 22 68 C 22 40 68 40 68 68 Z" fill={isColoring ? '#ffffff' : '#84cc16'} stroke={strokeColor} strokeWidth={strokeW} />
          {!isColoring && (
            <>
              <circle cx="45" cy="52" r="5" fill="#65a30d" opacity="0.5" />
              <circle cx="34" cy="58" r="4" fill="#65a30d" opacity="0.5" />
              <circle cx="56" cy="58" r="4" fill="#65a30d" opacity="0.5" />
            </>
          )}

          {/* Cute Smiling Head */}
          <ellipse cx="76" cy="62" rx="9" ry="8" fill="url(#story-turtle-grad)" stroke={strokeColor} strokeWidth={strokeW} />
          {/* Big Storybook Eye */}
          <ellipse cx="77" cy="59" rx="2.8" ry="3.2" fill={strokeColor} />
          <circle cx="78" cy="58" r="1" fill="#ffffff" />
          <path d="M 76 66 Q 79 67 82 65" stroke={strokeColor} strokeWidth="1.5" fill="none" strokeLinecap="round" />
          {!isColoring && <circle cx="74" cy="64" r="2.2" fill="#f43f5e" opacity="0.45" />}
        </svg>
      );

    case 'bear': // דוב
      return (
        <svg {...commonSvgProps}>
          {renderDefs('story-bear', '#a16207', '#854d0e')}
          {!isColoring && <ellipse cx="50" cy="88" rx="36" ry="4" fill="#cbd5e1" opacity="0.4" />}
          {/* 4 Thick Bear Paws */}
          <rect x="23" y="62" width="10" height="25" rx="5" fill={isColoring ? '#ffffff' : '#713f12'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="57" y="62" width="10" height="25" rx="5" fill={isColoring ? '#ffffff' : '#713f12'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="33" y="64" width="11" height="24" rx="5.5" fill="url(#story-bear-grad)" stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="67" y="64" width="11" height="24" rx="5.5" fill="url(#story-bear-grad)" stroke={strokeColor} strokeWidth={strokeW} />

          {/* Big Bear Body */}
          <ellipse cx="46" cy="56" rx="26" ry="18" fill="url(#story-bear-grad)" stroke={strokeColor} strokeWidth={strokeW} />

          {/* Round Ears */}
          <circle cx="61" cy="24" r="5" fill={isColoring ? '#ffffff' : '#713f12'} stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="77" cy="24" r="5" fill={isColoring ? '#ffffff' : '#713f12'} stroke={strokeColor} strokeWidth={strokeW} />

          {/* Head & Snout */}
          <circle cx="69" cy="35" r="14" fill="url(#story-bear-grad)" stroke={strokeColor} strokeWidth={strokeW} />
          <ellipse cx="72" cy="38" rx="7" ry="5" fill={isColoring ? '#ffffff' : '#fde68a'} stroke={strokeColor} strokeWidth="1.2" />
          <polygon points="73,36 70,34 76,34" fill={strokeColor} />
          <path d="M 70 39 Q 73 41 76 39" stroke={strokeColor} strokeWidth="1.4" fill="none" />

          {/* Eyes & Blush */}
          <ellipse cx="65" cy="30" rx="3" ry="3.5" fill={strokeColor} />
          <circle cx="66" cy="29" r="1" fill="#ffffff" />
          <ellipse cx="75" cy="30" rx="3" ry="3.5" fill={strokeColor} />
          <circle cx="76" cy="29" r="1" fill="#ffffff" />
          {!isColoring && <circle cx="64" cy="38" r="2.8" fill="#f43f5e" opacity="0.4" />}
        </svg>
      );

    case 'rabbit': // ארנב מתוק
      return (
        <svg {...commonSvgProps}>
          {renderDefs('story-rabbit', '#ffffff', '#f1f5f9')}
          {!isColoring && <ellipse cx="50" cy="88" rx="32" ry="4" fill="#cbd5e1" opacity="0.4" />}
          {/* Fluffy Tail */}
          <circle cx="16" cy="62" r="5" fill="#ffffff" stroke={strokeColor} strokeWidth={strokeW} />

          {/* 4 Paws (2 back hopping feet, 2 front paws) */}
          <ellipse cx="28" cy="84" rx="7" ry="4" fill="#ffffff" stroke={strokeColor} strokeWidth={strokeW} />
          <ellipse cx="44" cy="84" rx="7" ry="4" fill="#ffffff" stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="58" y="68" width="6" height="18" rx="3" fill="#ffffff" stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="68" y="68" width="6" height="18" rx="3" fill="#ffffff" stroke={strokeColor} strokeWidth={strokeW} />

          {/* Chubby Body */}
          <ellipse cx="42" cy="62" rx="20" ry="16" fill="url(#story-rabbit-grad)" stroke={strokeColor} strokeWidth={strokeW} />

          {/* Tall Soft Ears */}
          <ellipse cx="64" cy="20" rx="4.5" ry="13" fill="#ffffff" stroke={strokeColor} strokeWidth={strokeW} transform="rotate(-10 64 20)" />
          {!isColoring && <ellipse cx="64" cy="20" rx="2.5" ry="9" fill="#fbcfe8" transform="rotate(-10 64 20)" />}
          <ellipse cx="74" cy="20" rx="4.5" ry="13" fill="#ffffff" stroke={strokeColor} strokeWidth={strokeW} transform="rotate(10 74 20)" />
          {!isColoring && <ellipse cx="74" cy="20" rx="2.5" ry="9" fill="#fbcfe8" transform="rotate(10 74 20)" />}

          {/* Head & Pink Nose */}
          <circle cx="68" cy="42" r="13" fill="#ffffff" stroke={strokeColor} strokeWidth={strokeW} />
          <polygon points="68,44 66,42 70,42" fill="#f43f5e" />
          <path d="M 66 46 Q 68 48 70 46" stroke={strokeColor} strokeWidth="1.2" fill="none" />

          {/* Big Storybook Eyes */}
          <ellipse cx="63" cy="38" rx="3.2" ry="3.8" fill={strokeColor} />
          <circle cx="64" cy="36.5" r="1.2" fill="#ffffff" />
          <ellipse cx="73" cy="38" rx="3.2" ry="3.8" fill={strokeColor} />
          <circle cx="74" cy="36.5" r="1.2" fill="#ffffff" />
          {!isColoring && (
            <>
              <circle cx="60" cy="44" r="3" fill="#f43f5e" opacity="0.45" />
              <circle cx="76" cy="44" r="3" fill="#f43f5e" opacity="0.45" />
            </>
          )}
        </svg>
      );

    // ==========================================
    // 2 LEGS - STORYBOOK ANIMATION STYLE
    // ==========================================

    case 'rooster': // תרנגול
      return (
        <svg {...commonSvgProps}>
          {renderDefs('story-rooster', '#fde047', '#f59e0b')}
          {!isColoring && <ellipse cx="50" cy="88" rx="28" ry="4" fill="#cbd5e1" opacity="0.4" />}
          {/* 2 Visible Yellow Standing Legs with Claws */}
          <path d="M 44 68 L 42 86 M 35 86 L 46 86 M 38 82 L 45 86" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" fill="none" />
          <path d="M 58 68 L 60 86 M 53 86 L 64 86 M 56 82 L 63 86" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" fill="none" />

          {/* Arched Tail Feathers */}
          <path d="M 32 50 C 14 42 12 24 24 22 C 30 28 32 38 38 48 Z" fill={isColoring ? '#ffffff' : '#059669'} stroke={strokeColor} strokeWidth={strokeW} />
          <path d="M 28 56 C 10 54 10 36 20 34 C 26 40 28 46 34 56 Z" fill={isColoring ? '#ffffff' : '#3b82f6'} stroke={strokeColor} strokeWidth={strokeW} />

          {/* Round Storybook Body */}
          <ellipse cx="48" cy="54" rx="16" ry="15" fill="url(#story-rooster-grad)" stroke={strokeColor} strokeWidth={strokeW} />

          {/* Red Comb */}
          <path d="M 58 22 C 58 14 66 14 68 20 C 72 15 78 18 78 24 Z" fill={isColoring ? '#ffffff' : '#ef4444'} stroke={strokeColor} strokeWidth={strokeW} />

          {/* Head & Beak */}
          <circle cx="66" cy="30" r="10" fill="url(#story-rooster-grad)" stroke={strokeColor} strokeWidth={strokeW} />
          <polygon points="74,30 82,32 74,35" fill={isColoring ? '#ffffff' : '#f97316'} stroke={strokeColor} strokeWidth="1.5" />
          <path d="M 72 35 C 73 40 69 41 68 37 Z" fill={isColoring ? '#ffffff' : '#ef4444'} stroke={strokeColor} strokeWidth="1.2" />

          {/* Big Storybook Eye & Rosy Cheek */}
          <ellipse cx="66" cy="27" rx="2.8" ry="3.2" fill={strokeColor} />
          <circle cx="67" cy="26" r="1" fill="#ffffff" />
          {!isColoring && <circle cx="64" cy="33" r="2.5" fill="#f43f5e" opacity="0.45" />}
        </svg>
      );

    case 'duck': // ברווזון
      return (
        <svg {...commonSvgProps}>
          {renderDefs('story-duck', '#fde047', '#facc15')}
          {!isColoring && <ellipse cx="50" cy="88" rx="28" ry="4" fill="#cbd5e1" opacity="0.4" />}
          {/* 2 Webbed Feet Standing */}
          <path d="M 42 68 L 40 85 M 32 86 L 46 86 M 34 83 L 44 85" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" fill="none" />
          <path d="M 56 68 L 58 85 M 50 86 L 64 86 M 52 83 L 62 85" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" fill="none" />

          {/* Round Duck Body */}
          <ellipse cx="46" cy="54" rx="18" ry="15" fill="url(#story-duck-grad)" stroke={strokeColor} strokeWidth={strokeW} />
          {/* Little Up-turned Tail */}
          <path d="M 28 50 C 22 46 22 56 30 58 Z" fill="url(#story-duck-grad)" stroke={strokeColor} strokeWidth={strokeW} />

          {/* Duck Head */}
          <circle cx="64" cy="34" r="12" fill="url(#story-duck-grad)" stroke={strokeColor} strokeWidth={strokeW} />

          {/* Flat Orange Bill */}
          <path d="M 72 36 C 82 36 84 40 78 42 C 72 43 71 40 72 36 Z" fill={isColoring ? '#ffffff' : '#fb923c'} stroke={strokeColor} strokeWidth={strokeW} />

          {/* Storybook Eye & Cheek */}
          <ellipse cx="63" cy="30" rx="3.2" ry="3.8" fill={strokeColor} />
          <circle cx="64" cy="29" r="1.2" fill="#ffffff" />
          {!isColoring && <circle cx="60" cy="37" r="3" fill="#f43f5e" opacity="0.45" />}
        </svg>
      );

    case 'penguin': // פינגווין עם פפיון
      return (
        <svg {...commonSvgProps}>
          {renderDefs('story-penguin', '#1e293b', '#0f172a')}
          {!isColoring && <ellipse cx="50" cy="88" rx="28" ry="4" fill="#cbd5e1" opacity="0.4" />}
          {/* 2 Standing Orange Feet */}
          <ellipse cx="42" cy="84" rx="6" ry="3.5" fill={isColoring ? '#ffffff' : '#f97316'} stroke={strokeColor} strokeWidth={strokeW} />
          <ellipse cx="58" cy="84" rx="6" ry="3.5" fill={isColoring ? '#ffffff' : '#f97316'} stroke={strokeColor} strokeWidth={strokeW} />

          {/* Body & Flippers */}
          <ellipse cx="50" cy="54" rx="18" ry="26" fill="url(#story-penguin-grad)" stroke={strokeColor} strokeWidth={strokeW} />
          <path d="M 28 44 C 20 52 20 66 28 70 Z" fill="url(#story-penguin-grad)" stroke={strokeColor} strokeWidth={strokeW} />
          <path d="M 72 44 C 80 52 80 66 72 70 Z" fill="url(#story-penguin-grad)" stroke={strokeColor} strokeWidth={strokeW} />

          {/* Big White Belly */}
          <ellipse cx="50" cy="58" rx="13" ry="20" fill="#ffffff" stroke={strokeColor} strokeWidth={strokeW} />

          {/* Beak & Eyes */}
          <polygon points="50,42 45,36 55,36" fill={isColoring ? '#ffffff' : '#f97316'} stroke={strokeColor} strokeWidth={strokeW} />
          <ellipse cx="44" cy="32" rx="3" ry="3.5" fill={strokeColor} />
          <circle cx="45" cy="31" r="1" fill="#ffffff" />
          <ellipse cx="56" cy="32" rx="3" ry="3.5" fill={strokeColor} />
          <circle cx="57" cy="31" r="1" fill="#ffffff" />

          {/* Red Bowtie & Blush */}
          {!isColoring && (
            <>
              <circle cx="38" cy="36" r="3" fill="#fde047" opacity="0.8" />
              <circle cx="62" cy="36" r="3" fill="#fde047" opacity="0.8" />
              <path d="M 44 48 L 56 52 L 44 52 L 56 48 Z" fill="#ef4444" stroke={strokeColor} strokeWidth="1.5" />
            </>
          )}
        </svg>
      );

    case 'parrot': // תוכי טרופי
      return (
        <svg {...commonSvgProps}>
          {renderDefs('story-parrot', '#ef4444', '#dc2626')}
          {!isColoring && <ellipse cx="50" cy="88" rx="28" ry="4" fill="#cbd5e1" opacity="0.4" />}
          {/* 2 Standing Feet with Claws */}
          <path d="M 44 68 L 44 86 M 38 86 L 48 86 M 40 83 L 46 86" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" fill="none" />
          <path d="M 56 68 L 56 86 M 50 86 L 60 86 M 52 83 L 58 86" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" fill="none" />

          {/* Long Blue Tail */}
          <path d="M 38 60 C 24 72 20 90 22 92 C 26 92 34 78 40 68 Z" fill={isColoring ? '#ffffff' : '#3b82f6'} stroke={strokeColor} strokeWidth={strokeW} />

          {/* Red Body */}
          <ellipse cx="48" cy="50" rx="15" ry="18" fill="url(#story-parrot-grad)" stroke={strokeColor} strokeWidth={strokeW} />
          {/* Yellow Wing */}
          <path d="M 38 45 C 38 62 48 68 56 60 Z" fill={isColoring ? '#ffffff' : '#fbbf24'} stroke={strokeColor} strokeWidth={strokeW} />

          {/* Head & Hooked Beak */}
          <circle cx="62" cy="30" r="11" fill="url(#story-parrot-grad)" stroke={strokeColor} strokeWidth={strokeW} />
          <path d="M 70 28 C 80 28 84 34 80 40 C 76 42 74 36 70 36 Z" fill={isColoring ? '#ffffff' : '#f97316'} stroke={strokeColor} strokeWidth={strokeW} />

          {/* Big Storybook Eye & White Patch */}
          <circle cx="62" cy="28" r="6" fill="#ffffff" stroke={strokeColor} strokeWidth="1" />
          <ellipse cx="62" cy="28" rx="2.8" ry="3.2" fill={strokeColor} />
          <circle cx="63" cy="27" r="1" fill="#ffffff" />
          {!isColoring && <circle cx="58" cy="34" r="2.5" fill="#f43f5e" opacity="0.4" />}
        </svg>
      );

    case 'owl': // ינשוף
      return (
        <svg {...commonSvgProps}>
          {renderDefs('story-owl', '#854d0e', '#713f12')}
          {!isColoring && <ellipse cx="50" cy="88" rx="28" ry="4" fill="#cbd5e1" opacity="0.4" />}
          {/* 2 Standing Talons */}
          <path d="M 40 72 L 40 86 M 34 86 L 44 86" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" fill="none" />
          <path d="M 60 72 L 60 86 M 54 86 L 64 86" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" fill="none" />

          {/* Plump Body */}
          <ellipse cx="50" cy="54" rx="19" ry="22" fill="url(#story-owl-grad)" stroke={strokeColor} strokeWidth={strokeW} />
          {/* Light Belly */}
          <ellipse cx="50" cy="60" rx="12" ry="14" fill={isColoring ? '#ffffff' : '#fef3c7'} stroke={strokeColor} strokeWidth="1.2" />

          {/* Ear Tufts */}
          <polygon points="34,30 38,16 45,26" fill={isColoring ? '#ffffff' : '#713f12'} stroke={strokeColor} strokeWidth={strokeW} />
          <polygon points="66,30 62,16 55,26" fill={isColoring ? '#ffffff' : '#713f12'} stroke={strokeColor} strokeWidth={strokeW} />

          {/* Giant Huge Storybook Eyes */}
          <circle cx="40" cy="36" r="9" fill="#ffffff" stroke={strokeColor} strokeWidth={strokeW} />
          <ellipse cx="40" cy="36" rx="4.5" ry="5" fill={strokeColor} />
          <circle cx="42" cy="34" r="1.6" fill="#ffffff" />
          <circle cx="60" cy="36" r="9" fill="#ffffff" stroke={strokeColor} strokeWidth={strokeW} />
          <ellipse cx="60" cy="36" rx="4.5" ry="5" fill={strokeColor} />
          <circle cx="62" cy="34" r="1.6" fill="#ffffff" />

          {/* Beak & Blush */}
          <polygon points="50,44 46,38 54,38" fill={isColoring ? '#ffffff' : '#f97316'} stroke={strokeColor} strokeWidth="1.2" />
          {!isColoring && (
            <>
              <circle cx="32" cy="44" r="3" fill="#f43f5e" opacity="0.4" />
              <circle cx="68" cy="44" r="3" fill="#f43f5e" opacity="0.4" />
            </>
          )}
        </svg>
      );

    case 'dove': // יונה עם ענף זית
      return (
        <svg {...commonSvgProps}>
          {renderDefs('story-dove', '#ffffff', '#f8fafc')}
          {!isColoring && <ellipse cx="50" cy="88" rx="28" ry="4" fill="#cbd5e1" opacity="0.4" />}
          {/* 2 Pink Legs Standing */}
          <path d="M 44 68 L 42 86 M 36 86 L 46 86" stroke={isColoring ? strokeColor : '#f43f5e'} strokeWidth={strokeW} strokeLinecap="round" fill="none" />
          <path d="M 56 68 L 58 86 M 52 86 L 62 86" stroke={isColoring ? strokeColor : '#f43f5e'} strokeWidth={strokeW} strokeLinecap="round" fill="none" />

          {/* Dove Body & Tail */}
          <polygon points="18,48 28,58 38,52" fill="url(#story-dove-grad)" stroke={strokeColor} strokeWidth={strokeW} />
          <ellipse cx="48" cy="52" rx="17" ry="15" fill="url(#story-dove-grad)" stroke={strokeColor} strokeWidth={strokeW} />
          <path d="M 40 46 C 42 60 56 62 60 52 Z" fill="#ffffff" stroke={strokeColor} strokeWidth="1.5" />

          {/* Head & Beak */}
          <circle cx="64" cy="34" r="11" fill="url(#story-dove-grad)" stroke={strokeColor} strokeWidth={strokeW} />
          <polygon points="73,34 82,36 73,39" fill={isColoring ? '#ffffff' : '#fb923c'} stroke={strokeColor} strokeWidth="1.5" />

          {/* Olive Twig in Beak */}
          {!isColoring && (
            <path d="M 80 37 Q 86 35 90 32 M 85 36 Q 87 33 89 34 M 88 34 Q 91 32 92 34" stroke="#15803d" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          )}

          {/* Storybook Eye & Cheek */}
          <ellipse cx="64" cy="30" rx="3" ry="3.5" fill={strokeColor} />
          <circle cx="65" cy="29" r="1.1" fill="#ffffff" />
          {!isColoring && <circle cx="60" cy="36" r="2.8" fill="#f43f5e" opacity="0.45" />}
        </svg>
      );

    case 'sparrow': // ציפור שיר
      return (
        <svg {...commonSvgProps}>
          {renderDefs('story-sparrow', '#d97706', '#b45309')}
          {!isColoring && <ellipse cx="50" cy="88" rx="26" ry="4" fill="#cbd5e1" opacity="0.4" />}
          {/* 2 Stick Legs Standing */}
          <path d="M 44 68 L 42 86 M 36 86 L 46 86" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" fill="none" />
          <path d="M 56 68 L 58 86 M 52 86 L 62 86" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" fill="none" />

          {/* Body & Wing */}
          <ellipse cx="46" cy="52" rx="15" ry="14" fill="url(#story-sparrow-grad)" stroke={strokeColor} strokeWidth={strokeW} />
          <path d="M 38 48 C 38 60 50 62 54 54 Z" fill={isColoring ? '#ffffff' : '#78350f'} stroke={strokeColor} strokeWidth="1.5" />

          {/* Head & Perky Beak */}
          <circle cx="62" cy="34" r="10" fill="url(#story-sparrow-grad)" stroke={strokeColor} strokeWidth={strokeW} />
          <polygon points="70,34 78,36 70,38" fill={isColoring ? '#ffffff' : '#f97316'} stroke={strokeColor} strokeWidth="1.5" />

          {/* Eye & Rosy Cheek */}
          <ellipse cx="62" cy="31" rx="2.8" ry="3.2" fill={strokeColor} />
          <circle cx="63" cy="30" r="1" fill="#ffffff" />
          {!isColoring && <circle cx="58" cy="36" r="2.5" fill="#f43f5e" opacity="0.45" />}
        </svg>
      );

    case 'kangaroo': // קנגורו
      return (
        <svg {...commonSvgProps}>
          {renderDefs('story-kangaroo', '#d97706', '#b45309')}
          {!isColoring && <ellipse cx="50" cy="88" rx="34" ry="4" fill="#cbd5e1" opacity="0.4" />}
          {/* Strong Thick Tail resting on ground */}
          <path d="M 36 68 C 22 72 14 84 10 88" stroke={strokeColor} strokeWidth="6" fill="none" strokeLinecap="round" />

          {/* 2 Giant Strong Kangaroo Feet */}
          <ellipse cx="40" cy="85" rx="10" ry="4" fill="url(#story-kangaroo-grad)" stroke={strokeColor} strokeWidth={strokeW} />
          <ellipse cx="56" cy="85" rx="10" ry="4" fill="url(#story-kangaroo-grad)" stroke={strokeColor} strokeWidth={strokeW} />

          {/* Body & Pouch with Joey */}
          <path d="M 34 68 C 34 46 54 44 60 54 C 64 64 58 78 46 78 Z" fill="url(#story-kangaroo-grad)" stroke={strokeColor} strokeWidth={strokeW} />
          {/* Little Front Paws Tucked in */}
          <path d="M 58 54 Q 64 56 62 60" stroke={strokeColor} strokeWidth={strokeW} fill="none" strokeLinecap="round" />

          {/* Long Ears */}
          <ellipse cx="56" cy="20" rx="3.5" ry="10" fill={isColoring ? '#ffffff' : '#b45309'} stroke={strokeColor} strokeWidth={strokeW} transform="rotate(-15 56 20)" />
          <ellipse cx="66" cy="20" rx="3.5" ry="10" fill={isColoring ? '#ffffff' : '#b45309'} stroke={strokeColor} strokeWidth={strokeW} transform="rotate(15 66 20)" />

          {/* Head & Nose */}
          <circle cx="64" cy="34" r="11" fill="url(#story-kangaroo-grad)" stroke={strokeColor} strokeWidth={strokeW} />
          <ellipse cx="72" cy="36" rx="4" ry="3" fill={isColoring ? '#ffffff' : '#fed7aa'} stroke={strokeColor} strokeWidth="1.2" />
          <circle cx="73" cy="36" r="1" fill={strokeColor} />

          {/* Eyes & Cheek */}
          <ellipse cx="62" cy="30" rx="3" ry="3.5" fill={strokeColor} />
          <circle cx="63" cy="29" r="1" fill="#ffffff" />
          {!isColoring && <circle cx="62" cy="37" r="2.8" fill="#f43f5e" opacity="0.45" />}
        </svg>
      );

    case 'monkey': // קוף
      return (
        <svg {...commonSvgProps}>
          {renderDefs('story-monkey', '#a16207', '#854d0e')}
          {!isColoring && <ellipse cx="50" cy="88" rx="28" ry="4" fill="#cbd5e1" opacity="0.4" />}
          {/* Curled Monkey Tail */}
          <path d="M 36 68 C 20 68 16 46 26 44" stroke={strokeColor} strokeWidth="4" fill="none" strokeLinecap="round" />

          {/* 2 Standing Legs */}
          <rect x="40" y="64" width="7" height="22" rx="3.5" fill="url(#story-monkey-grad)" stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="54" y="64" width="7" height="22" rx="3.5" fill="url(#story-monkey-grad)" stroke={strokeColor} strokeWidth={strokeW} />

          {/* Body */}
          <ellipse cx="50" cy="54" rx="16" ry="18" fill="url(#story-monkey-grad)" stroke={strokeColor} strokeWidth={strokeW} />
          <ellipse cx="50" cy="56" rx="10" ry="12" fill={isColoring ? '#ffffff' : '#fef3c7'} stroke={strokeColor} strokeWidth="1.2" />

          {/* Big Round Ears */}
          <circle cx="34" cy="34" r="7" fill={isColoring ? '#ffffff' : '#854d0e'} stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="34" cy="34" r="4" fill={isColoring ? '#ffffff' : '#fef3c7'} />
          <circle cx="66" cy="34" r="7" fill={isColoring ? '#ffffff' : '#854d0e'} stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="66" cy="34" r="4" fill={isColoring ? '#ffffff' : '#fef3c7'} />

          {/* Head & Heart Face Mask */}
          <circle cx="50" cy="34" r="14" fill="url(#story-monkey-grad)" stroke={strokeColor} strokeWidth={strokeW} />
          <ellipse cx="45" cy="33" rx="6" ry="6" fill={isColoring ? '#ffffff' : '#fef3c7'} />
          <ellipse cx="55" cy="33" rx="6" ry="6" fill={isColoring ? '#ffffff' : '#fef3c7'} />
          <ellipse cx="50" cy="38" rx="8" ry="6" fill={isColoring ? '#ffffff' : '#fef3c7'} />

          {/* Smile & Nostrils */}
          <path d="M 46 40 Q 50 43 54 40" stroke={strokeColor} strokeWidth="1.5" fill="none" strokeLinecap="round" />

          {/* Storybook Eyes */}
          <ellipse cx="44" cy="31" rx="2.8" ry="3.2" fill={strokeColor} />
          <circle cx="45" cy="30" r="1" fill="#ffffff" />
          <ellipse cx="56" cy="31" rx="2.8" ry="3.2" fill={strokeColor} />
          <circle cx="57" cy="30" r="1" fill="#ffffff" />
          {!isColoring && (
            <>
              <circle cx="40" cy="38" r="2.5" fill="#f43f5e" opacity="0.45" />
              <circle cx="60" cy="38" r="2.5" fill="#f43f5e" opacity="0.45" />
            </>
          )}
        </svg>
      );

    case 'flamingo': // פלמינגו ורוד
      return (
        <svg {...commonSvgProps}>
          {renderDefs('story-flamingo', '#f472b6', '#ec4899')}
          {!isColoring && <ellipse cx="50" cy="88" rx="26" ry="4" fill="#cbd5e1" opacity="0.4" />}
          {/* 2 Long Stilt Legs */}
          <line x1="46" y1="58" x2="44" y2="86" stroke={isColoring ? strokeColor : '#f43f5e'} strokeWidth={strokeW} strokeLinecap="round" />
          <line x1="56" y1="58" x2="58" y2="86" stroke={isColoring ? strokeColor : '#f43f5e'} strokeWidth={strokeW} strokeLinecap="round" />

          {/* Round Pink Body */}
          <ellipse cx="50" cy="50" rx="16" ry="14" fill="url(#story-flamingo-grad)" stroke={strokeColor} strokeWidth={strokeW} />

          {/* S-Curved Neck */}
          <path d="M 58 46 C 64 36 64 24 72 24 C 76 24 78 28 76 34" stroke={isColoring ? strokeColor : '#ec4899'} strokeWidth="5" fill="none" strokeLinecap="round" />

          {/* Head & Down-curved Beak */}
          <circle cx="74" cy="24" r="8" fill="url(#story-flamingo-grad)" stroke={strokeColor} strokeWidth={strokeW} />
          <path d="M 78 26 C 84 27 86 33 82 36" stroke={strokeColor} strokeWidth="4" fill="none" strokeLinecap="round" />
          <circle cx="83" cy="35" r="2" fill={strokeColor} />

          {/* Eye & Blush */}
          <ellipse cx="73" cy="22" rx="2.5" ry="3" fill={strokeColor} />
          <circle cx="74" cy="21" r="0.9" fill="#ffffff" />
          {!isColoring && <circle cx="70" cy="27" r="2.2" fill="#f43f5e" opacity="0.5" />}
        </svg>
      );

    case 'ostrich': // יען
      return (
        <svg {...commonSvgProps}>
          {renderDefs('story-ostrich', '#1e293b', '#0f172a')}
          {!isColoring && <ellipse cx="50" cy="88" rx="28" ry="4" fill="#cbd5e1" opacity="0.4" />}
          {/* 2 Strong Muscular Legs */}
          <line x1="44" y1="60" x2="42" y2="86" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <line x1="56" y1="60" x2="58" y2="86" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />

          {/* Big Fluffy Feathered Body */}
          <ellipse cx="48" cy="52" rx="18" ry="15" fill="url(#story-ostrich-grad)" stroke={strokeColor} strokeWidth={strokeW} />
          {/* White Plume Feathers */}
          <path d="M 28 50 C 22 46 22 58 30 58 Z" fill="#ffffff" stroke={strokeColor} strokeWidth="1.5" />

          {/* Tall Neck */}
          <line x1="58" y1="46" x2="68" y2="22" stroke={isColoring ? strokeColor : '#fed7aa'} strokeWidth="4.5" strokeLinecap="round" />

          {/* Head & Beak */}
          <ellipse cx="72" cy="20" rx="7" ry="6" fill={isColoring ? '#ffffff' : '#fed7aa'} stroke={strokeColor} strokeWidth={strokeW} />
          <polygon points="78,20 86,22 78,24" fill={isColoring ? '#ffffff' : '#fb923c'} stroke={strokeColor} strokeWidth="1.2" />

          {/* Huge Expressive Storybook Eye */}
          <ellipse cx="70" cy="18" rx="3.5" ry="4" fill={strokeColor} />
          <circle cx="71.5" cy="16.5" r="1.3" fill="#ffffff" />
          <circle cx="69" cy="19" r="0.7" fill="#ffffff" />
          {!isColoring && <circle cx="67" cy="23" r="2" fill="#f43f5e" opacity="0.45" />}
        </svg>
      );

    default:
      return null;
  }
};
