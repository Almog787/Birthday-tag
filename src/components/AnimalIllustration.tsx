import React from 'react';
import { AnimalWorksheetColorMode } from '../types';

interface AnimalIllustrationProps {
  animalId: string;
  mode?: AnimalWorksheetColorMode;
  className?: string;
  size?: number | string;
}

/**
 * High-quality vector illustrations for animals with distinct countable legs (2 or 4).
 * Supports both full color mode and black & white coloring-book outline mode.
 */
export const AnimalIllustration: React.FC<AnimalIllustrationProps> = ({
  animalId,
  mode = 'color',
  className = 'w-full h-full',
  size
}) => {
  const isColoring = mode === 'coloring_book';

  // Base stroke styling
  const strokeColor = '#0f172a';
  const strokeW = 2.4;
  const commonSvgProps = {
    viewBox: '0 0 100 100',
    className,
    style: size ? { width: size, height: size } : undefined,
    xmlns: 'http://www.w3.org/2000/svg'
  };

  switch (animalId) {
    // ==========================================
    // 2 LEGS (הולכים על שתיים)
    // ==========================================

    case 'rooster': // תרנגול - 2 distinct legs with claws, comb, wattle
      return (
        <svg {...commonSvgProps}>
          {/* 2 Legs */}
          <path d="M 44 68 L 44 88 M 40 88 L 48 88" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" fill="none" />
          <path d="M 56 68 L 56 88 M 52 88 L 60 88" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" fill="none" />
          {/* Tail Feathers */}
          <path
            d="M 32 50 C 15 45 10 25 22 25 C 28 32 30 40 35 48"
            fill={isColoring ? '#ffffff' : '#059669'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          <path
            d="M 28 55 C 10 55 8 35 18 35 C 24 42 28 48 32 55"
            fill={isColoring ? '#ffffff' : '#2563eb'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Body */}
          <ellipse
            cx="48"
            cy="56"
            rx="18"
            ry="15"
            fill={isColoring ? '#ffffff' : '#f59e0b'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Wing */}
          <path
            d="M 42 50 C 50 48 54 58 48 64 C 42 66 38 58 42 50 Z"
            fill={isColoring ? '#ffffff' : '#d97706'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Neck & Head */}
          <path
            d="M 58 55 C 64 50 66 35 60 28 C 55 24 50 28 52 35 Z"
            fill={isColoring ? '#ffffff' : '#f59e0b'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          <circle
            cx="64"
            cy="32"
            r="10"
            fill={isColoring ? '#ffffff' : '#f59e0b'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Comb (Red) */}
          <path
            d="M 60 23 C 58 15 65 14 66 22 C 69 14 76 17 73 24 Z"
            fill={isColoring ? '#ffffff' : '#ef4444'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Wattle (Red) */}
          <path
            d="M 68 38 C 72 40 70 46 66 44 Z"
            fill={isColoring ? '#ffffff' : '#ef4444'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Beak */}
          <polygon
            points="72,30 83,34 72,38"
            fill={isColoring ? '#ffffff' : '#ea580c'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Eye */}
          <circle cx="66" cy="30" r="2.5" fill={strokeColor} />
          <circle cx="67" cy="29" r="0.8" fill="#ffffff" />
        </svg>
      );

    case 'duck': // ברווז - 2 webbed feet, bill
      return (
        <svg {...commonSvgProps}>
          {/* 2 Webbed Feet */}
          <path d="M 42 70 L 40 86 M 34 88 C 40 84 46 86 46 88" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" fill={isColoring ? '#ffffff' : '#f97316'} />
          <path d="M 58 70 L 60 86 M 54 88 C 60 84 66 86 66 88" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" fill={isColoring ? '#ffffff' : '#f97316'} />
          {/* Body */}
          <ellipse
            cx="48"
            cy="56"
            rx="24"
            ry="16"
            fill={isColoring ? '#ffffff' : '#fde047'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Wing */}
          <path
            d="M 38 52 C 48 48 56 56 46 64 C 40 66 34 60 38 52 Z"
            fill={isColoring ? '#ffffff' : '#eab308'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Tail */}
          <path
            d="M 25 54 C 20 50 18 44 26 48 Z"
            fill={isColoring ? '#ffffff' : '#fde047'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Head */}
          <circle
            cx="66"
            cy="36"
            r="13"
            fill={isColoring ? '#ffffff' : '#fde047'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Duck Bill */}
          <path
            d="M 74 36 C 88 35 88 44 74 44 Z"
            fill={isColoring ? '#ffffff' : '#f97316'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Eye */}
          <circle cx="68" cy="33" r="2.5" fill={strokeColor} />
          <circle cx="69" cy="32" r="0.8" fill="#ffffff" />
          {/* Cute cheek */}
          {!isColoring && <circle cx="64" cy="40" r="3" fill="#f43f5e" opacity="0.4" />}
        </svg>
      );

    case 'penguin': // פינגווין - 2 feet, tuxedo body
      return (
        <svg {...commonSvgProps}>
          {/* 2 Feet */}
          <ellipse cx="40" cy="88" rx="8" ry="4" fill={isColoring ? '#ffffff' : '#f97316'} stroke={strokeColor} strokeWidth={strokeW} />
          <ellipse cx="60" cy="88" rx="8" ry="4" fill={isColoring ? '#ffffff' : '#f97316'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Main Body */}
          <ellipse
            cx="50"
            cy="52"
            rx="22"
            ry="32"
            fill={isColoring ? '#ffffff' : '#1e293b'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Flippers */}
          <path
            d="M 28 45 C 20 52 20 66 27 70 C 29 65 30 52 28 45 Z"
            fill={isColoring ? '#ffffff' : '#0f172a'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          <path
            d="M 72 45 C 80 52 80 66 73 70 C 71 65 70 52 72 45 Z"
            fill={isColoring ? '#ffffff' : '#0f172a'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* White Belly */}
          <ellipse
            cx="50"
            cy="58"
            rx="14"
            ry="22"
            fill="#ffffff"
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Eyes */}
          <circle cx="44" cy="34" r="3" fill={strokeColor} />
          <circle cx="56" cy="34" r="3" fill={strokeColor} />
          <circle cx="45" cy="33" r="1" fill="#ffffff" />
          <circle cx="57" cy="33" r="1" fill="#ffffff" />
          {/* Beak */}
          <polygon
            points="50,44 44,38 56,38"
            fill={isColoring ? '#ffffff' : '#f97316'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Bowtie */}
          {!isColoring && (
            <path d="M 44 48 L 56 52 L 44 52 L 56 48 Z" fill="#ef4444" stroke={strokeColor} strokeWidth="1.5" />
          )}
        </svg>
      );

    case 'parrot': // תוכי - 2 legs, vibrant beak and feathers
      return (
        <svg {...commonSvgProps}>
          {/* 2 Feet standing on a branch */}
          <path d="M 46 72 L 46 84 M 42 84 L 49 84" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" fill="none" />
          <path d="M 58 72 L 58 84 M 54 84 L 61 84" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" fill="none" />
          {/* Long Tail */}
          <path
            d="M 38 60 C 25 72 20 90 22 92 C 26 92 34 78 40 68 Z"
            fill={isColoring ? '#ffffff' : '#3b82f6'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Body */}
          <ellipse
            cx="52"
            cy="52"
            rx="18"
            ry="22"
            fill={isColoring ? '#ffffff' : '#22c55e'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Wing */}
          <path
            d="M 44 45 C 38 55 42 70 54 65 C 50 55 48 48 44 45 Z"
            fill={isColoring ? '#ffffff' : '#eab308'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Head */}
          <circle
            cx="60"
            cy="32"
            r="14"
            fill={isColoring ? '#ffffff' : '#ef4444'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Curved Parrot Beak */}
          <path
            d="M 68 30 C 82 32 82 46 72 44 C 70 36 68 32 68 30 Z"
            fill={isColoring ? '#ffffff' : '#f59e0b'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Eye */}
          <circle cx="62" cy="28" r="4" fill="#ffffff" stroke={strokeColor} strokeWidth="1.5" />
          <circle cx="62" cy="28" r="2" fill={strokeColor} />
        </svg>
      );

    case 'owl': // ינשוף - 2 talons, big eyes
      return (
        <svg {...commonSvgProps}>
          {/* 2 Talons */}
          <path d="M 40 76 L 40 88 M 35 88 L 45 88" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" fill="none" />
          <path d="M 60 76 L 60 88 M 55 88 L 65 88" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" fill="none" />
          {/* Body */}
          <ellipse
            cx="50"
            cy="55"
            rx="24"
            ry="26"
            fill={isColoring ? '#ffffff' : '#854d0e'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Ear Tufts */}
          <polygon points="32,32 25,18 40,26" fill={isColoring ? '#ffffff' : '#854d0e'} stroke={strokeColor} strokeWidth={strokeW} />
          <polygon points="68,32 75,18 60,26" fill={isColoring ? '#ffffff' : '#854d0e'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Belly */}
          <ellipse
            cx="50"
            cy="60"
            rx="15"
            ry="18"
            fill={isColoring ? '#ffffff' : '#fef08a'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Belly Feathers */}
          <path d="M 45 56 Q 50 60 55 56 M 45 64 Q 50 68 55 64" stroke={strokeColor} strokeWidth="1.5" fill="none" />
          {/* Big Owl Eyes */}
          <circle cx="38" cy="38" r="10" fill={isColoring ? '#ffffff' : '#fde047'} stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="62" cy="38" r="10" fill={isColoring ? '#ffffff' : '#fde047'} stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="38" cy="38" r="5" fill={strokeColor} />
          <circle cx="62" cy="38" r="5" fill={strokeColor} />
          <circle cx="40" cy="36" r="1.5" fill="#ffffff" />
          <circle cx="64" cy="36" r="1.5" fill="#ffffff" />
          {/* Beak */}
          <polygon points="50,48 46,40 54,40" fill={isColoring ? '#ffffff' : '#f97316'} stroke={strokeColor} strokeWidth={strokeW} />
        </svg>
      );

    case 'sparrow': // ציפור - 2 stick legs
      return (
        <svg {...commonSvgProps}>
          {/* 2 Stick Legs */}
          <path d="M 44 68 L 40 86 M 35 88 L 44 86 L 47 88" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" fill="none" />
          <path d="M 56 68 L 56 86 M 52 88 L 57 86 L 62 88" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" fill="none" />
          {/* Tail */}
          <polygon points="26,52 10,48 18,62 30,58" fill={isColoring ? '#ffffff' : '#0284c7'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Body */}
          <ellipse cx="50" cy="52" rx="22" ry="18" fill={isColoring ? '#ffffff' : '#38bdf8'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Wing */}
          <path
            d="M 40 46 C 48 42 56 50 48 60 C 40 62 36 54 40 46 Z"
            fill={isColoring ? '#ffffff' : '#0369a1'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Head */}
          <circle cx="66" cy="38" r="12" fill={isColoring ? '#ffffff' : '#38bdf8'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Beak */}
          <polygon points="77,36 88,40 77,44" fill={isColoring ? '#ffffff' : '#ea580c'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Eye */}
          <circle cx="68" cy="35" r="2.5" fill={strokeColor} />
          <circle cx="69" cy="34" r="0.8" fill="#ffffff" />
        </svg>
      );

    case 'kangaroo': // קנגורו - 2 large hind legs, tail, pouch
      return (
        <svg {...commonSvgProps}>
          {/* Strong Tail for balance */}
          <path
            d="M 30 68 C 14 74 12 86 18 88 C 24 88 32 80 40 74 Z"
            fill={isColoring ? '#ffffff' : '#b45309'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* 2 Big Hind Legs */}
          <path
            d="M 34 62 C 34 76 28 86 42 88 C 48 88 48 80 44 72"
            fill={isColoring ? '#ffffff' : '#d97706'}
            stroke={strokeColor}
            strokeWidth={strokeW}
            strokeLinecap="round"
          />
          <path
            d="M 48 62 C 48 76 44 86 58 88 C 64 88 64 80 58 72"
            fill={isColoring ? '#ffffff' : '#d97706'}
            stroke={strokeColor}
            strokeWidth={strokeW}
            strokeLinecap="round"
          />
          {/* Body */}
          <ellipse
            cx="48"
            cy="52"
            rx="16"
            ry="22"
            fill={isColoring ? '#ffffff' : '#d97706'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Pouch */}
          <path
            d="M 44 56 C 44 66 54 66 54 56 Z"
            fill={isColoring ? '#ffffff' : '#fef3c7'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* 2 Small Paws in front */}
          <path d="M 54 48 L 62 52 M 52 50 L 60 55" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" />
          {/* Head & Ears */}
          <circle cx="58" cy="32" r="10" fill={isColoring ? '#ffffff' : '#d97706'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Tall Ears */}
          <ellipse cx="54" cy="18" rx="4" ry="10" fill={isColoring ? '#ffffff' : '#d97706'} stroke={strokeColor} strokeWidth={strokeW} />
          <ellipse cx="62" cy="18" rx="4" ry="10" fill={isColoring ? '#ffffff' : '#d97706'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Snout & Eye */}
          <ellipse cx="66" cy="34" rx="4" ry="3" fill={isColoring ? '#ffffff' : '#b45309'} stroke={strokeColor} strokeWidth="1.5" />
          <circle cx="58" cy="30" r="2" fill={strokeColor} />
        </svg>
      );

    case 'monkey': // קוף - standing upright on 2 legs
      return (
        <svg {...commonSvgProps}>
          {/* Long Curly Tail */}
          <path
            d="M 32 60 C 15 62 10 40 20 38 C 24 38 24 48 30 54"
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeW}
            strokeLinecap="round"
          />
          {/* 2 Standing Legs */}
          <path d="M 42 66 L 40 88 M 34 88 L 44 88" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" fill="none" />
          <path d="M 58 66 L 60 88 M 56 88 L 66 88" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" fill="none" />
          {/* Body */}
          <ellipse cx="50" cy="54" rx="16" ry="18" fill={isColoring ? '#ffffff' : '#78350f'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Belly */}
          <ellipse cx="50" cy="56" rx="10" ry="12" fill={isColoring ? '#ffffff' : '#fed7aa'} stroke={strokeColor} strokeWidth="1.5" />
          {/* 2 Raised Arms */}
          <path d="M 36 48 C 28 42 26 34 30 30" fill="none" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" />
          <path d="M 64 48 C 72 42 74 34 70 30" fill="none" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" />
          {/* Ears */}
          <circle cx="34" cy="30" r="6" fill={isColoring ? '#ffffff' : '#78350f'} stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="34" cy="30" r="3" fill={isColoring ? '#ffffff' : '#fed7aa'} />
          <circle cx="66" cy="30" r="6" fill={isColoring ? '#ffffff' : '#78350f'} stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="66" cy="30" r="3" fill={isColoring ? '#ffffff' : '#fed7aa'} />
          {/* Head */}
          <circle cx="50" cy="30" r="14" fill={isColoring ? '#ffffff' : '#78350f'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Face */}
          <ellipse cx="50" cy="33" rx="10" ry="8" fill={isColoring ? '#ffffff' : '#fed7aa'} stroke={strokeColor} strokeWidth="1.5" />
          {/* Smile and Eyes */}
          <circle cx="45" cy="28" r="2" fill={strokeColor} />
          <circle cx="55" cy="28" r="2" fill={strokeColor} />
          <path d="M 46 35 Q 50 38 54 35" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'flamingo': // פלמינגו - 2 very long legs
      return (
        <svg {...commonSvgProps}>
          {/* 2 Long Stilt Legs */}
          <path d="M 46 58 L 44 90 M 40 90 L 48 90" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" fill="none" />
          <path d="M 56 58 L 56 90 M 52 90 L 60 90" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" fill="none" />
          {/* Feathered Body */}
          <ellipse cx="50" cy="48" rx="18" ry="14" fill={isColoring ? '#ffffff' : '#f472b6'} stroke={strokeColor} strokeWidth={strokeW} />
          <path d="M 42 42 C 48 40 54 48 46 54 Z" fill={isColoring ? '#ffffff' : '#ec4899'} stroke={strokeColor} strokeWidth="1.5" />
          {/* S-Shaped Long Neck */}
          <path
            d="M 58 46 C 70 38 72 20 62 18 C 56 16 54 24 64 24"
            fill="none"
            stroke={isColoring ? strokeColor : '#f472b6'}
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M 58 46 C 70 38 72 20 62 18 C 56 16 54 24 64 24"
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeW}
            strokeLinecap="round"
          />
          {/* Head & Downward Curved Beak */}
          <circle cx="62" cy="18" r="7" fill={isColoring ? '#ffffff' : '#f472b6'} stroke={strokeColor} strokeWidth={strokeW} />
          <path d="M 66 18 C 76 22 74 30 70 30" fill={isColoring ? '#ffffff' : '#0f172a'} stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="62" cy="16" r="1.5" fill={strokeColor} />
        </svg>
      );

    case 'ostrich': // יען - 2 strong running legs
      return (
        <svg {...commonSvgProps}>
          {/* 2 Strong Legs */}
          <path d="M 45 60 L 42 88 M 36 88 L 46 88" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" fill="none" />
          <path d="M 57 60 L 59 88 M 53 88 L 63 88" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" fill="none" />
          {/* Fluffy Body */}
          <ellipse cx="50" cy="48" rx="20" ry="16" fill={isColoring ? '#ffffff' : '#334155'} stroke={strokeColor} strokeWidth={strokeW} />
          <ellipse cx="34" cy="48" rx="6" ry="6" fill={isColoring ? '#ffffff' : '#f8fafc'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Long Neck */}
          <path d="M 60 48 L 68 20" stroke={isColoring ? strokeColor : '#fed7aa'} strokeWidth="6" strokeLinecap="round" />
          <path d="M 60 48 L 68 20" stroke={strokeColor} strokeWidth={strokeW} fill="none" />
          {/* Head & Beak */}
          <circle cx="70" cy="18" r="7" fill={isColoring ? '#ffffff' : '#fed7aa'} stroke={strokeColor} strokeWidth={strokeW} />
          <polygon points="76,16 86,18 76,21" fill={isColoring ? '#ffffff' : '#f97316'} stroke={strokeColor} strokeWidth="1.5" />
          <circle cx="70" cy="16" r="1.8" fill={strokeColor} />
        </svg>
      );

    // ==========================================
    // 4 LEGS (הולכים על ארבע)
    // ==========================================

    case 'dog': // כלב - 4 visible legs, wagging tail
      return (
        <svg {...commonSvgProps}>
          {/* 4 Standing Legs */}
          {/* Back left & right legs */}
          <rect x="26" y="58" width="7" height="28" rx="3.5" fill={isColoring ? '#ffffff' : '#b45309'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="36" y="58" width="7" height="28" rx="3.5" fill={isColoring ? '#ffffff' : '#d97706'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Front left & right legs */}
          <rect x="58" y="58" width="7" height="28" rx="3.5" fill={isColoring ? '#ffffff' : '#b45309'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="68" y="58" width="7" height="28" rx="3.5" fill={isColoring ? '#ffffff' : '#d97706'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Wagging Tail */}
          <path d="M 24 50 C 14 42 12 28 20 28" fill="none" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" />
          {/* Body */}
          <rect x="28" y="44" width="46" height="24" rx="12" fill={isColoring ? '#ffffff' : '#d97706'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Head */}
          <circle cx="72" cy="38" r="14" fill={isColoring ? '#ffffff' : '#d97706'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Floppy Ear */}
          <ellipse cx="64" cy="38" rx="5" ry="11" fill={isColoring ? '#ffffff' : '#92400e'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Snout */}
          <ellipse cx="82" cy="42" rx="7" ry="5" fill={isColoring ? '#ffffff' : '#fde68a'} stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="85" cy="40" r="2.5" fill={strokeColor} />
          {/* Eye */}
          <circle cx="74" cy="34" r="2.5" fill={strokeColor} />
          <circle cx="75" cy="33" r="0.8" fill="#ffffff" />
        </svg>
      );

    case 'cat': // חתול - 4 paws, whiskers, pointy ears
      return (
        <svg {...commonSvgProps}>
          {/* 4 Standing Legs */}
          <rect x="25" y="60" width="7" height="26" rx="3.5" fill={isColoring ? '#ffffff' : '#94a3b8'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="35" y="60" width="7" height="26" rx="3.5" fill={isColoring ? '#ffffff' : '#cbd5e1'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="58" y="60" width="7" height="26" rx="3.5" fill={isColoring ? '#ffffff' : '#94a3b8'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="68" y="60" width="7" height="26" rx="3.5" fill={isColoring ? '#ffffff' : '#cbd5e1'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Graceful Tail */}
          <path d="M 22 56 C 12 50 14 30 22 30" fill="none" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" />
          {/* Body */}
          <ellipse cx="48" cy="54" rx="24" ry="14" fill={isColoring ? '#ffffff' : '#cbd5e1'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Head */}
          <circle cx="70" cy="40" r="13" fill={isColoring ? '#ffffff' : '#cbd5e1'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Pointy Ears */}
          <polygon points="63,32 58,18 70,28" fill={isColoring ? '#ffffff' : '#cbd5e1'} stroke={strokeColor} strokeWidth={strokeW} />
          <polygon points="73,28 82,18 78,32" fill={isColoring ? '#ffffff' : '#cbd5e1'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Eyes */}
          <ellipse cx="68" cy="38" rx="2" ry="3" fill="#15803d" />
          <ellipse cx="76" cy="38" rx="2" ry="3" fill="#15803d" />
          {/* Nose & Whiskers */}
          <polygon points="72,43 70,41 74,41" fill="#f43f5e" />
          <line x1="78" y1="42" x2="88" y2="40" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="78" y1="44" x2="88" y2="45" stroke={strokeColor} strokeWidth="1.2" />
        </svg>
      );

    case 'cow': // פרה - 4 legs with hooves, spots
      return (
        <svg {...commonSvgProps}>
          {/* 4 Sturdy Legs with hooves */}
          <rect x="24" y="58" width="8" height="28" rx="2" fill={isColoring ? '#ffffff' : '#e2e8f0'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="24" y="80" width="8" height="6" fill={isColoring ? '#ffffff' : '#334155'} />
          <rect x="35" y="58" width="8" height="28" rx="2" fill={isColoring ? '#ffffff' : '#f8fafc'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="35" y="80" width="8" height="6" fill={isColoring ? '#ffffff' : '#334155'} />
          <rect x="58" y="58" width="8" height="28" rx="2" fill={isColoring ? '#ffffff' : '#e2e8f0'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="58" y="80" width="8" height="6" fill={isColoring ? '#ffffff' : '#334155'} />
          <rect x="69" y="58" width="8" height="28" rx="2" fill={isColoring ? '#ffffff' : '#f8fafc'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="69" y="80" width="8" height="6" fill={isColoring ? '#ffffff' : '#334155'} />
          {/* Body */}
          <rect x="26" y="44" width="50" height="26" rx="10" fill={isColoring ? '#ffffff' : '#f8fafc'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Black spots on body */}
          {!isColoring && (
            <>
              <path d="M 36 44 C 42 48 40 56 32 54 Z" fill="#1e293b" />
              <path d="M 52 50 C 60 46 62 58 54 62 Z" fill="#1e293b" />
            </>
          )}
          {/* Head & Horns */}
          <circle cx="75" cy="36" r="12" fill={isColoring ? '#ffffff' : '#f8fafc'} stroke={strokeColor} strokeWidth={strokeW} />
          <path d="M 70 26 C 68 20 74 22 72 26 M 78 26 C 80 20 74 22 76 26" stroke={strokeColor} strokeWidth={strokeW} fill="none" />
          {/* Snout */}
          <ellipse cx="83" cy="40" rx="7" ry="5" fill={isColoring ? '#ffffff' : '#fbcfe8'} stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="82" cy="40" r="1.5" fill={strokeColor} />
          <circle cx="85" cy="40" r="1.5" fill={strokeColor} />
          {/* Eye */}
          <circle cx="74" cy="33" r="2.5" fill={strokeColor} />
        </svg>
      );

    case 'horse': // סוס - 4 galloping legs, mane, hooves
      return (
        <svg {...commonSvgProps}>
          {/* 4 Long Legs with hooves */}
          <rect x="22" y="58" width="7" height="28" rx="2" fill={isColoring ? '#ffffff' : '#92400e'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="22" y="81" width="7" height="5" fill={strokeColor} />
          <rect x="32" y="58" width="7" height="28" rx="2" fill={isColoring ? '#ffffff' : '#b45309'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="32" y="81" width="7" height="5" fill={strokeColor} />
          <rect x="58" y="58" width="7" height="28" rx="2" fill={isColoring ? '#ffffff' : '#92400e'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="58" y="81" width="7" height="5" fill={strokeColor} />
          <rect x="68" y="58" width="7" height="28" rx="2" fill={isColoring ? '#ffffff' : '#b45309'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="68" y="81" width="7" height="5" fill={strokeColor} />
          {/* Tail */}
          <path d="M 20 50 C 10 55 12 70 18 75" fill="none" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" />
          {/* Body */}
          <ellipse cx="48" cy="52" rx="25" ry="14" fill={isColoring ? '#ffffff' : '#b45309'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Neck & Mane */}
          <path d="M 62 48 L 74 25 L 80 32 L 70 54 Z" fill={isColoring ? '#ffffff' : '#b45309'} stroke={strokeColor} strokeWidth={strokeW} />
          <path d="M 64 26 C 60 32 60 45 62 48" stroke={isColoring ? strokeColor : '#451a03'} strokeWidth="4" strokeLinecap="round" fill="none" />
          {/* Head & Ears */}
          <polygon points="72,25 74,16 77,24" fill={isColoring ? '#ffffff' : '#b45309'} stroke={strokeColor} strokeWidth="1.5" />
          <ellipse cx="80" cy="28" rx="10" ry="7" fill={isColoring ? '#ffffff' : '#b45309'} stroke={strokeColor} strokeWidth={strokeW} transform="rotate(15 80 28)" />
          {/* Eye */}
          <circle cx="76" cy="26" r="2" fill={strokeColor} />
        </svg>
      );

    case 'sheep': // כבשה - 4 legs, fluffy wool
      return (
        <svg {...commonSvgProps}>
          {/* 4 Dark Legs */}
          <rect x="28" y="62" width="6" height="24" rx="2" fill={strokeColor} />
          <rect x="37" y="62" width="6" height="24" rx="2" fill={strokeColor} />
          <rect x="57" y="62" width="6" height="24" rx="2" fill={strokeColor} />
          <rect x="66" y="62" width="6" height="24" rx="2" fill={strokeColor} />
          {/* Fluffy Wool Body */}
          <circle cx="34" cy="50" r="12" fill={isColoring ? '#ffffff' : '#f8fafc'} stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="48" cy="44" r="14" fill={isColoring ? '#ffffff' : '#f8fafc'} stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="60" cy="48" r="12" fill={isColoring ? '#ffffff' : '#f8fafc'} stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="48" cy="56" r="13" fill={isColoring ? '#ffffff' : '#f8fafc'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Head */}
          <ellipse cx="72" cy="42" rx="9" ry="11" fill={isColoring ? '#ffffff' : '#334155'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Floppy Ears */}
          <ellipse cx="66" cy="38" rx="5" ry="3" fill={isColoring ? '#ffffff' : '#334155'} stroke={strokeColor} strokeWidth="1.5" />
          {/* Eye */}
          <circle cx="72" cy="40" r="2" fill="#ffffff" />
          <circle cx="72" cy="40" r="1" fill={strokeColor} />
        </svg>
      );

    case 'elephant': // פיל - 4 giant legs, trunk, big ears
      return (
        <svg {...commonSvgProps}>
          {/* 4 Big Pillar Legs */}
          <rect x="22" y="58" width="10" height="28" rx="3" fill={isColoring ? '#ffffff' : '#64748b'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="34" y="58" width="10" height="28" rx="3" fill={isColoring ? '#ffffff' : '#94a3b8'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="58" y="58" width="10" height="28" rx="3" fill={isColoring ? '#ffffff' : '#64748b'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="70" y="58" width="10" height="28" rx="3" fill={isColoring ? '#ffffff' : '#94a3b8'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Little Tail */}
          <path d="M 20 54 L 14 66" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" />
          {/* Big Round Body */}
          <ellipse cx="48" cy="50" rx="26" ry="20" fill={isColoring ? '#ffffff' : '#94a3b8'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Head */}
          <circle cx="70" cy="42" r="15" fill={isColoring ? '#ffffff' : '#94a3b8'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Giant Flapping Ear */}
          <ellipse cx="62" cy="42" rx="9" ry="14" fill={isColoring ? '#ffffff' : '#cbd5e1'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Curled Trunk */}
          <path
            d="M 80 46 C 88 48 94 62 88 66 C 84 68 82 62 84 58"
            fill="none"
            stroke={isColoring ? strokeColor : '#94a3b8'}
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M 80 46 C 88 48 94 62 88 66 C 84 68 82 62 84 58"
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeW}
            strokeLinecap="round"
          />
          {/* Eye */}
          <circle cx="72" cy="38" r="2.5" fill={strokeColor} />
          <circle cx="73" cy="37" r="0.8" fill="#ffffff" />
        </svg>
      );

    case 'giraffe': // ג׳ירפה - 4 tall legs, long neck, spots
      return (
        <svg {...commonSvgProps}>
          {/* 4 Long Stilt Legs */}
          <rect x="25" y="62" width="6" height="26" rx="2" fill={isColoring ? '#ffffff' : '#d97706'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="33" y="62" width="6" height="26" rx="2" fill={isColoring ? '#ffffff' : '#f59e0b'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="53" y="62" width="6" height="26" rx="2" fill={isColoring ? '#ffffff' : '#d97706'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="61" y="62" width="6" height="26" rx="2" fill={isColoring ? '#ffffff' : '#f59e0b'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Body */}
          <ellipse cx="44" cy="56" rx="18" ry="12" fill={isColoring ? '#ffffff' : '#f59e0b'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Very Tall Neck */}
          <path d="M 52 54 L 66 18 L 74 22 L 60 58 Z" fill={isColoring ? '#ffffff' : '#f59e0b'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Head & Ossicones */}
          <circle cx="72" cy="18" r="7" fill={isColoring ? '#ffffff' : '#f59e0b'} stroke={strokeColor} strokeWidth={strokeW} />
          <path d="M 69 12 L 69 7 M 74 12 L 74 7" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" />
          <circle cx="69" cy="6" r="1.5" fill={strokeColor} />
          <circle cx="74" cy="6" r="1.5" fill={strokeColor} />
          {/* Spots */}
          {!isColoring && (
            <>
              <circle cx="60" cy="32" r="2.5" fill="#b45309" />
              <circle cx="64" cy="42" r="3" fill="#b45309" />
              <circle cx="44" cy="55" r="3" fill="#b45309" />
              <circle cx="36" cy="54" r="2.5" fill="#b45309" />
            </>
          )}
          {/* Eye */}
          <circle cx="73" cy="17" r="1.5" fill={strokeColor} />
        </svg>
      );

    case 'lion': // אריה - 4 paws, magnificent mane
      return (
        <svg {...commonSvgProps}>
          {/* 4 Strong Legs */}
          <rect x="25" y="58" width="7" height="28" rx="3.5" fill={isColoring ? '#ffffff' : '#d97706'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="35" y="58" width="7" height="28" rx="3.5" fill={isColoring ? '#ffffff' : '#f59e0b'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="58" y="58" width="7" height="28" rx="3.5" fill={isColoring ? '#ffffff' : '#d97706'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="68" y="58" width="7" height="28" rx="3.5" fill={isColoring ? '#ffffff' : '#f59e0b'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Tufted Tail */}
          <path d="M 22 52 C 14 46 12 36 18 34" fill="none" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" />
          <circle cx="18" cy="34" r="3" fill={isColoring ? '#ffffff' : '#92400e'} stroke={strokeColor} strokeWidth="1" />
          {/* Body */}
          <rect x="28" y="46" width="46" height="22" rx="11" fill={isColoring ? '#ffffff' : '#f59e0b'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Glorious Mane */}
          <circle cx="72" cy="38" r="17" fill={isColoring ? '#ffffff' : '#b45309'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Head */}
          <circle cx="72" cy="38" r="11" fill={isColoring ? '#ffffff' : '#fef08a'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Snout & Whiskers */}
          <circle cx="72" cy="42" r="3" fill={strokeColor} />
          <circle cx="68" cy="36" r="2" fill={strokeColor} />
          <circle cx="76" cy="36" r="2" fill={strokeColor} />
        </svg>
      );

    case 'tiger': // נמר - 4 legs, stripes
      return (
        <svg {...commonSvgProps}>
          {/* 4 Strong Legs */}
          <rect x="24" y="58" width="7" height="28" rx="3.5" fill={isColoring ? '#ffffff' : '#ea580c'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="34" y="58" width="7" height="28" rx="3.5" fill={isColoring ? '#ffffff' : '#f97316'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="58" y="58" width="7" height="28" rx="3.5" fill={isColoring ? '#ffffff' : '#ea580c'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="68" y="58" width="7" height="28" rx="3.5" fill={isColoring ? '#ffffff' : '#f97316'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Tail */}
          <path d="M 22 52 C 14 44 14 30 20 28" fill="none" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" />
          {/* Body */}
          <rect x="26" y="46" width="48" height="22" rx="11" fill={isColoring ? '#ffffff' : '#f97316'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Stripes */}
          {!isColoring && (
            <>
              <path d="M 38 46 L 36 56 M 46 46 L 44 56 M 54 46 L 52 56" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
            </>
          )}
          {/* Head & Ears */}
          <circle cx="72" cy="38" r="13" fill={isColoring ? '#ffffff' : '#f97316'} stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="64" cy="27" r="4" fill={isColoring ? '#ffffff' : '#f97316'} stroke={strokeColor} strokeWidth="1.5" />
          <circle cx="80" cy="27" r="4" fill={isColoring ? '#ffffff' : '#f97316'} stroke={strokeColor} strokeWidth="1.5" />
          <circle cx="68" cy="36" r="2.2" fill={strokeColor} />
          <circle cx="76" cy="36" r="2.2" fill={strokeColor} />
          <polygon points="72,42 70,40 74,40" fill="#0f172a" />
        </svg>
      );

    case 'turtle': // צב - 4 crawling legs, rounded shell
      return (
        <svg {...commonSvgProps}>
          {/* 4 Crawling Legs */}
          <ellipse cx="28" cy="68" rx="6" ry="10" fill={isColoring ? '#ffffff' : '#15803d'} stroke={strokeColor} strokeWidth={strokeW} transform="rotate(-20 28 68)" />
          <ellipse cx="40" cy="72" rx="6" ry="10" fill={isColoring ? '#ffffff' : '#22c55e'} stroke={strokeColor} strokeWidth={strokeW} transform="rotate(-10 40 72)" />
          <ellipse cx="60" cy="72" rx="6" ry="10" fill={isColoring ? '#ffffff' : '#15803d'} stroke={strokeColor} strokeWidth={strokeW} transform="rotate(10 60 72)" />
          <ellipse cx="72" cy="68" rx="6" ry="10" fill={isColoring ? '#ffffff' : '#22c55e'} stroke={strokeColor} strokeWidth={strokeW} transform="rotate(20 72 68)" />
          {/* Tail */}
          <polygon points="20,56 12,58 20,62" fill={isColoring ? '#ffffff' : '#22c55e'} stroke={strokeColor} strokeWidth="1.5" />
          {/* Shell */}
          <path
            d="M 22 62 C 22 36 78 36 78 62 Z"
            fill={isColoring ? '#ffffff' : '#854d0e'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Shell Patterns */}
          <path d="M 38 62 C 38 46 62 46 62 62 M 50 46 L 50 62" stroke={strokeColor} strokeWidth="2" fill="none" />
          {/* Head */}
          <ellipse cx="84" cy="54" rx="10" ry="7" fill={isColoring ? '#ffffff' : '#22c55e'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Eye */}
          <circle cx="86" cy="52" r="2" fill={strokeColor} />
        </svg>
      );

    case 'bear': // דוב - 4 big paws, furry body
      return (
        <svg {...commonSvgProps}>
          {/* 4 Paws */}
          <rect x="24" y="58" width="9" height="28" rx="4" fill={isColoring ? '#ffffff' : '#78350f'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="36" y="58" width="9" height="28" rx="4" fill={isColoring ? '#ffffff' : '#92400e'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="56" y="58" width="9" height="28" rx="4" fill={isColoring ? '#ffffff' : '#78350f'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="68" y="58" width="9" height="28" rx="4" fill={isColoring ? '#ffffff' : '#92400e'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Body */}
          <ellipse cx="48" cy="50" rx="26" ry="18" fill={isColoring ? '#ffffff' : '#92400e'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Head & Round Ears */}
          <circle cx="72" cy="38" r="14" fill={isColoring ? '#ffffff' : '#92400e'} stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="64" cy="26" r="4.5" fill={isColoring ? '#ffffff' : '#78350f'} stroke={strokeColor} strokeWidth="1.5" />
          <circle cx="80" cy="26" r="4.5" fill={isColoring ? '#ffffff' : '#78350f'} stroke={strokeColor} strokeWidth="1.5" />
          {/* Snout */}
          <ellipse cx="80" cy="42" rx="6" ry="5" fill={isColoring ? '#ffffff' : '#fef08a'} stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="82" cy="40" r="2.5" fill={strokeColor} />
          <circle cx="72" cy="35" r="2.5" fill={strokeColor} />
        </svg>
      );

    case 'rabbit': // ארנב - 4 paws, long ears
      return (
        <svg {...commonSvgProps}>
          {/* 4 Paws */}
          <rect x="25" y="62" width="7" height="24" rx="3.5" fill={isColoring ? '#ffffff' : '#cbd5e1'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="35" y="62" width="7" height="24" rx="3.5" fill={isColoring ? '#ffffff' : '#e2e8f0'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="58" y="62" width="7" height="24" rx="3.5" fill={isColoring ? '#ffffff' : '#cbd5e1'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="68" y="62" width="7" height="24" rx="3.5" fill={isColoring ? '#ffffff' : '#e2e8f0'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Fluffy tail */}
          <circle cx="18" cy="54" r="5" fill={isColoring ? '#ffffff' : '#f8fafc'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Body */}
          <ellipse cx="48" cy="54" rx="24" ry="14" fill={isColoring ? '#ffffff' : '#f8fafc'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Long Ears */}
          <ellipse cx="64" cy="18" rx="4" ry="12" fill={isColoring ? '#ffffff' : '#f8fafc'} stroke={strokeColor} strokeWidth={strokeW} />
          <ellipse cx="64" cy="18" rx="2" ry="8" fill={isColoring ? '#ffffff' : '#fbcfe8'} />
          <ellipse cx="72" cy="18" rx="4" ry="12" fill={isColoring ? '#ffffff' : '#f8fafc'} stroke={strokeColor} strokeWidth={strokeW} />
          <ellipse cx="72" cy="18" rx="2" ry="8" fill={isColoring ? '#ffffff' : '#fbcfe8'} />
          {/* Head */}
          <circle cx="70" cy="40" r="12" fill={isColoring ? '#ffffff' : '#f8fafc'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Nose & Eye */}
          <polygon points="78,42 76,40 80,40" fill="#f43f5e" />
          <circle cx="70" cy="36" r="2.5" fill={strokeColor} />
          <circle cx="71" cy="35" r="0.8" fill="#ffffff" />
        </svg>
      );

    default:
      return (
        <svg {...commonSvgProps}>
          <circle cx="50" cy="50" r="40" fill={isColoring ? '#ffffff' : '#cbd5e1'} stroke={strokeColor} strokeWidth={strokeW} />
          <text x="50" y="55" textAnchor="middle" fontSize="20" fill={strokeColor}>🐾</text>
        </svg>
      );
  }
};
