import React from 'react';
import { AnimalWorksheetColorMode } from '../types';

interface AnimalIllustrationProps {
  animalId: string;
  mode?: AnimalWorksheetColorMode;
  className?: string;
  size?: number | string;
}

/**
 * Premium high-quality vector illustrations for animals with distinct, countable legs (2 or 4).
 * Supports both full vibrant preschool cartoon color mode and clean black & white coloring-book outline mode.
 * Each animal is designed to be immediately recognizable, highly authentic, and child-friendly.
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
    // 2 LEGS (הולכים על שתיים 👣)
    // ==========================================

    case 'rooster': // תרנגול - 2 distinct legs with claws, bright red comb, wattle, iridescent tail
      return (
        <svg {...commonSvgProps}>
          {/* 2 Standing Chicken Legs with claws and spur */}
          <path d="M 42 66 L 40 88 M 32 88 L 44 88 M 35 84 L 43 88 M 41 78 L 45 76" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" fill="none" />
          <path d="M 58 66 L 60 88 M 52 88 L 64 88 M 55 84 L 63 88 M 61 78 L 65 76" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" fill="none" />
          {/* Arched Tail Feathers */}
          <path
            d="M 32 50 C 10 42 6 18 22 18 C 30 26 32 38 38 48 Z"
            fill={isColoring ? '#ffffff' : '#059669'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          <path
            d="M 28 56 C 6 56 4 32 18 32 C 26 40 30 46 34 56 Z"
            fill={isColoring ? '#ffffff' : '#2563eb'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          <path
            d="M 30 62 C 14 66 12 48 24 46 C 30 50 32 56 34 62 Z"
            fill={isColoring ? '#ffffff' : '#7c3aed'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Main Body */}
          <ellipse
            cx="48"
            cy="54"
            rx="18"
            ry="15"
            fill={isColoring ? '#ffffff' : '#f59e0b'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Wing */}
          <path
            d="M 40 48 C 52 44 58 56 50 64 C 42 66 36 58 40 48 Z"
            fill={isColoring ? '#ffffff' : '#d97706'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Neck & Head */}
          <path
            d="M 56 54 C 64 48 66 34 60 27 C 55 24 50 28 52 35 Z"
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
            d="M 58 24 C 56 14 64 12 65 20 C 68 12 76 14 74 22 C 78 17 84 21 80 26 Z"
            fill={isColoring ? '#ffffff' : '#ef4444'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Wattle (Red) */}
          <path
            d="M 68 38 C 72 41 71 47 66 45 Z"
            fill={isColoring ? '#ffffff' : '#ef4444'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Beak */}
          <polygon
            points="72,30 84,34 72,38"
            fill={isColoring ? '#ffffff' : '#ea580c'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Eye */}
          <circle cx="66" cy="30" r="2.8" fill={strokeColor} />
          <circle cx="67" cy="29" r="0.9" fill="#ffffff" />
        </svg>
      );

    case 'duck': // ברווז - 2 webbed feet, wide rounded beak, cute tail
      return (
        <svg {...commonSvgProps}>
          {/* 2 Wide Webbed Feet */}
          <path d="M 42 68 L 40 86 M 31 88 C 38 84 46 86 46 88" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" fill={isColoring ? '#ffffff' : '#f97316'} />
          <path d="M 58 68 L 60 86 M 51 88 C 58 84 66 86 66 88" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" fill={isColoring ? '#ffffff' : '#f97316'} />
          {/* Main Body */}
          <ellipse
            cx="48"
            cy="54"
            rx="24"
            ry="16"
            fill={isColoring ? '#ffffff' : '#fde047'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Wing */}
          <path
            d="M 38 50 C 48 46 56 54 46 62 C 40 64 34 58 38 50 Z"
            fill={isColoring ? '#ffffff' : '#eab308'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Upturned Tail Feathers */}
          <path
            d="M 24 52 C 16 46 14 38 25 44 Z"
            fill={isColoring ? '#ffffff' : '#fde047'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Head */}
          <circle
            cx="66"
            cy="34"
            r="13"
            fill={isColoring ? '#ffffff' : '#fde047'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Wide Duck Bill */}
          <path
            d="M 74 34 C 88 33 89 43 74 42 Z"
            fill={isColoring ? '#ffffff' : '#f97316'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Eye */}
          <circle cx="67" cy="30" r="2.8" fill={strokeColor} />
          <circle cx="68" cy="29" r="0.9" fill="#ffffff" />
          {!isColoring && <circle cx="64" cy="38" r="3" fill="#f43f5e" opacity="0.35" />}
        </svg>
      );

    case 'penguin': // פינגווין - 2 webbed feet, tuxedo body, flippers
      return (
        <svg {...commonSvgProps}>
          {/* 2 Big Orange Feet */}
          <ellipse cx="40" cy="88" rx="8" ry="4" fill={isColoring ? '#ffffff' : '#f97316'} stroke={strokeColor} strokeWidth={strokeW} />
          <ellipse cx="60" cy="88" rx="8" ry="4" fill={isColoring ? '#ffffff' : '#f97316'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Tuxedo Body */}
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
            d="M 28 44 C 18 52 18 68 26 72 C 28 66 30 52 28 44 Z"
            fill={isColoring ? '#ffffff' : '#0f172a'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          <path
            d="M 72 44 C 82 52 82 68 74 72 C 72 66 70 52 72 44 Z"
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
          {/* Yellow Cheek Accents */}
          {!isColoring && (
            <>
              <circle cx="37" cy="36" r="3.5" fill="#fde047" opacity="0.8" />
              <circle cx="63" cy="36" r="3.5" fill="#fde047" opacity="0.8" />
            </>
          )}
          {/* Eyes */}
          <circle cx="44" cy="34" r="3.2" fill={strokeColor} />
          <circle cx="56" cy="34" r="3.2" fill={strokeColor} />
          <circle cx="45" cy="33" r="1" fill="#ffffff" />
          <circle cx="57" cy="33" r="1" fill="#ffffff" />
          {/* Beak */}
          <polygon
            points="50,44 44,38 56,38"
            fill={isColoring ? '#ffffff' : '#f97316'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Red Bowtie */}
          {!isColoring && (
            <path d="M 43 48 L 57 52 L 43 52 L 57 48 Z" fill="#ef4444" stroke={strokeColor} strokeWidth="1.5" />
          )}
        </svg>
      );

    case 'parrot': // תוכי - 2 feet, hooked beak, colorful plumage
      return (
        <svg {...commonSvgProps}>
          {/* 2 Feet Standing with Claws */}
          <path d="M 46 70 L 46 88 M 40 88 L 50 88 M 42 85 L 48 88" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" fill="none" />
          <path d="M 58 70 L 58 88 M 52 88 L 62 88 M 54 85 L 60 88" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" fill="none" />
          {/* Long Tropical Tail */}
          <path
            d="M 38 60 C 24 72 20 90 22 92 C 26 92 34 78 40 68 Z"
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
          {/* Wing Feathers */}
          <path
            d="M 44 45 C 36 55 40 70 54 65 C 50 55 48 48 44 45 Z"
            fill={isColoring ? '#ffffff' : '#eab308'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Head & Crest */}
          <path d="M 56 22 C 54 14 62 14 62 20 C 66 14 72 16 70 24" fill="none" stroke={strokeColor} strokeWidth={strokeW} />
          <circle
            cx="60"
            cy="32"
            r="14"
            fill={isColoring ? '#ffffff' : '#ef4444'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* White Eye Patch */}
          <circle cx="62" cy="28" r="6" fill="#ffffff" stroke={strokeColor} strokeWidth="1.5" />
          <circle cx="62" cy="28" r="2.5" fill={strokeColor} />
          <circle cx="63" cy="27" r="0.8" fill="#ffffff" />
          {/* Hooked Parrot Beak */}
          <path
            d="M 68 28 C 84 30 84 46 72 44 C 70 36 68 32 68 28 Z"
            fill={isColoring ? '#ffffff' : '#f59e0b'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          <path d="M 72 44 C 74 46 70 47 69 44 Z" fill={isColoring ? '#ffffff' : '#334155'} stroke={strokeColor} strokeWidth="1" />
        </svg>
      );

    case 'owl': // ינשוף - 2 talons, big eyes, ear tufts
      return (
        <svg {...commonSvgProps}>
          {/* 2 Talons */}
          <path d="M 40 76 L 40 88 M 34 88 L 46 88" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" fill="none" />
          <path d="M 60 76 L 60 88 M 54 88 L 66 88" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" fill="none" />
          {/* Body */}
          <ellipse
            cx="50"
            cy="54"
            rx="24"
            ry="26"
            fill={isColoring ? '#ffffff' : '#854d0e'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Pointed Ear Tufts */}
          <polygon points="32,32 24,16 40,26" fill={isColoring ? '#ffffff' : '#854d0e'} stroke={strokeColor} strokeWidth={strokeW} />
          <polygon points="68,32 76,16 60,26" fill={isColoring ? '#ffffff' : '#854d0e'} stroke={strokeColor} strokeWidth={strokeW} />
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
          <path d="M 45 56 Q 50 60 55 56 M 45 64 Q 50 68 55 64" stroke={strokeColor} strokeWidth="1.5" fill="none" />
          {/* Big Owl Eyes */}
          <circle cx="38" cy="38" r="10" fill={isColoring ? '#ffffff' : '#fde047'} stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="62" cy="38" r="10" fill={isColoring ? '#ffffff' : '#fde047'} stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="38" cy="38" r="5" fill={strokeColor} />
          <circle cx="62" cy="38" r="5" fill={strokeColor} />
          <circle cx="40" cy="36" r="1.5" fill="#ffffff" />
          <circle cx="64" cy="36" r="1.5" fill="#ffffff" />
          {/* Hooked Beak */}
          <polygon points="50,48 46,40 54,40" fill={isColoring ? '#ffffff' : '#f97316'} stroke={strokeColor} strokeWidth={strokeW} />
        </svg>
      );

    case 'dove': // יונה - 2 distinct pink standing legs, soft white body, gentle wing, beak with olive twig
      return (
        <svg {...commonSvgProps}>
          {/* 2 Standing Pink Legs */}
          <path d="M 44 68 L 40 88 M 34 88 L 46 88 M 38 84 L 46 88" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" fill="none" />
          <path d="M 56 68 L 56 88 M 50 88 L 62 88 M 52 84 L 60 88" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" fill="none" />
          {/* Tail Feathers */}
          <polygon points="26,50 10,44 14,56 12,66 28,60" fill={isColoring ? '#ffffff' : '#f1f5f9'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Body */}
          <ellipse cx="50" cy="52" rx="22" ry="18" fill={isColoring ? '#ffffff' : '#f8fafc'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Gentle Wing */}
          <path
            d="M 38 46 C 46 40 56 46 50 58 C 42 62 34 54 38 46 Z"
            fill={isColoring ? '#ffffff' : '#e2e8f0'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Head */}
          <circle cx="66" cy="38" r="12" fill={isColoring ? '#ffffff' : '#f8fafc'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Beak */}
          <polygon points="76,36 86,39 76,42" fill={isColoring ? '#ffffff' : '#fb923c'} stroke={strokeColor} strokeWidth="1.5" />
          {/* Olive Leaf in Beak */}
          {!isColoring && (
            <path d="M 82 39 Q 88 34 92 36 Q 88 42 82 39 Z" fill="#22c55e" stroke={strokeColor} strokeWidth="1" />
          )}
          {/* Eye */}
          <circle cx="68" cy="35" r="2.5" fill={strokeColor} />
          <circle cx="69" cy="34" r="0.8" fill="#ffffff" />
        </svg>
      );

    case 'sparrow': // ציפור - 2 stick legs, perky beak
      return (
        <svg {...commonSvgProps}>
          {/* 2 Stick Legs */}
          <path d="M 44 68 L 40 86 M 34 88 L 46 88" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" fill="none" />
          <path d="M 56 68 L 56 86 M 50 88 L 62 88" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" fill="none" />
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
          <circle cx="68" cy="35" r="2.8" fill={strokeColor} />
          <circle cx="69" cy="34" r="0.9" fill="#ffffff" />
        </svg>
      );

    case 'kangaroo': // קנגורו - 2 powerful standing hind legs + joey in pouch
      return (
        <svg {...commonSvgProps}>
          {/* Heavy Balancing Tail on ground */}
          <path
            d="M 28 66 C 10 74 8 86 16 88 C 24 88 32 80 40 72 Z"
            fill={isColoring ? '#ffffff' : '#b45309'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* 2 Big Powerful Hind Legs (Clearly 2 legs) */}
          <path
            d="M 32 60 C 32 76 26 86 42 88 C 48 88 48 78 44 70"
            fill={isColoring ? '#ffffff' : '#d97706'}
            stroke={strokeColor}
            strokeWidth={strokeW}
            strokeLinecap="round"
          />
          <path
            d="M 48 60 C 48 76 42 86 58 88 C 64 88 64 78 58 70"
            fill={isColoring ? '#ffffff' : '#d97706'}
            stroke={strokeColor}
            strokeWidth={strokeW}
            strokeLinecap="round"
          />
          {/* Body */}
          <ellipse
            cx="48"
            cy="50"
            rx="16"
            ry="22"
            fill={isColoring ? '#ffffff' : '#d97706'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Pouch */}
          <path
            d="M 42 54 C 42 66 54 66 54 54 Z"
            fill={isColoring ? '#ffffff' : '#fef3c7'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Baby Joey Head peeking out of pouch */}
          {!isColoring && (
            <>
              <circle cx="48" cy="54" r="4" fill="#b45309" stroke={strokeColor} strokeWidth="1" />
              <circle cx="47" cy="53" r="0.8" fill="#ffffff" />
            </>
          )}
          {/* 2 Small upper paws in front */}
          <path d="M 54 44 L 63 47 M 52 47 L 61 51" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" />
          {/* Head & Long Ears */}
          <circle cx="58" cy="30" r="10" fill={isColoring ? '#ffffff' : '#d97706'} stroke={strokeColor} strokeWidth={strokeW} />
          <ellipse cx="54" cy="16" rx="4" ry="10" fill={isColoring ? '#ffffff' : '#d97706'} stroke={strokeColor} strokeWidth={strokeW} />
          <ellipse cx="62" cy="16" rx="4" ry="10" fill={isColoring ? '#ffffff' : '#d97706'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Snout & Eye */}
          <ellipse cx="66" cy="32" rx="4" ry="3" fill={isColoring ? '#ffffff' : '#b45309'} stroke={strokeColor} strokeWidth="1.5" />
          <circle cx="58" cy="28" r="2.2" fill={strokeColor} />
          <circle cx="59" cy="27" r="0.7" fill="#ffffff" />
        </svg>
      );

    case 'monkey': // קוף - standing upright on 2 legs, curly tail, big ears
      return (
        <svg {...commonSvgProps}>
          {/* Curly Prehensile Tail */}
          <path
            d="M 32 60 C 14 62 10 40 20 38 C 24 38 24 48 30 54"
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
          <path d="M 36 48 C 26 42 24 34 28 30" fill="none" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" />
          <path d="M 64 48 C 74 42 76 34 72 30" fill="none" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" />
          {/* Big Round Ears on sides */}
          <circle cx="34" cy="30" r="7" fill={isColoring ? '#ffffff' : '#78350f'} stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="34" cy="30" r="3.5" fill={isColoring ? '#ffffff' : '#fed7aa'} />
          <circle cx="66" cy="30" r="7" fill={isColoring ? '#ffffff' : '#78350f'} stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="66" cy="30" r="3.5" fill={isColoring ? '#ffffff' : '#fed7aa'} />
          {/* Head */}
          <circle cx="50" cy="30" r="14" fill={isColoring ? '#ffffff' : '#78350f'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Face */}
          <ellipse cx="50" cy="33" rx="10" ry="8" fill={isColoring ? '#ffffff' : '#fed7aa'} stroke={strokeColor} strokeWidth="1.5" />
          {/* Eyes & Smile */}
          <circle cx="45" cy="28" r="2.2" fill={strokeColor} />
          <circle cx="55" cy="28" r="2.2" fill={strokeColor} />
          <path d="M 46 35 Q 50 38 54 35" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'flamingo': // פלמינגו - 2 very long slender stilt legs, pink S-neck
      return (
        <svg {...commonSvgProps}>
          {/* 2 Long Stilt Legs */}
          <path d="M 46 58 L 44 90 M 38 90 L 48 90" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" fill="none" />
          <path d="M 56 58 L 56 90 M 50 90 L 60 90" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" fill="none" />
          {/* Body */}
          <ellipse cx="50" cy="48" rx="18" ry="14" fill={isColoring ? '#ffffff' : '#f472b6'} stroke={strokeColor} strokeWidth={strokeW} />
          <path d="M 42 42 C 48 40 54 48 46 54 Z" fill={isColoring ? '#ffffff' : '#ec4899'} stroke={strokeColor} strokeWidth="1.5" />
          {/* S-Shaped Neck */}
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
          {/* Head & Downward Beak */}
          <circle cx="62" cy="18" r="7" fill={isColoring ? '#ffffff' : '#f472b6'} stroke={strokeColor} strokeWidth={strokeW} />
          <path d="M 66 18 C 76 22 74 30 70 30" fill={isColoring ? '#ffffff' : '#0f172a'} stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="62" cy="16" r="1.8" fill={strokeColor} />
        </svg>
      );

    case 'ostrich': // יען - 2 strong muscular running legs, long neck
      return (
        <svg {...commonSvgProps}>
          {/* 2 Strong Legs */}
          <path d="M 45 60 L 42 88 M 35 88 L 47 88" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" fill="none" />
          <path d="M 57 60 L 59 88 M 52 88 L 64 88" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" fill="none" />
          {/* Fluffy Body */}
          <ellipse cx="50" cy="48" rx="20" ry="16" fill={isColoring ? '#ffffff' : '#334155'} stroke={strokeColor} strokeWidth={strokeW} />
          <ellipse cx="34" cy="48" rx="6" ry="6" fill={isColoring ? '#ffffff' : '#f8fafc'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Long Neck */}
          <path d="M 60 48 L 68 20" stroke={isColoring ? strokeColor : '#fed7aa'} strokeWidth="6" strokeLinecap="round" />
          <path d="M 60 48 L 68 20" stroke={strokeColor} strokeWidth={strokeW} fill="none" />
          {/* Head & Wide Beak */}
          <circle cx="70" cy="18" r="7" fill={isColoring ? '#ffffff' : '#fed7aa'} stroke={strokeColor} strokeWidth={strokeW} />
          <polygon points="76,16 86,18 76,21" fill={isColoring ? '#ffffff' : '#f97316'} stroke={strokeColor} strokeWidth="1.5" />
          <circle cx="70" cy="16" r="2" fill={strokeColor} />
        </svg>
      );

    // ==========================================
    // 4 LEGS (הולכים על ארבע 🐾)
    // ==========================================

    case 'cow': // פרה - 4 distinct legs with hooves, iconic black & white spots, floppy ears, curved horns, wide pink snout, udder & cowbell!
      return (
        <svg {...commonSvgProps}>
          {/* Tail with fluffy bushy hair tassel */}
          <path
            d="M 22 46 C 14 52 12 68 18 74"
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeW}
            strokeLinecap="round"
          />
          {/* Tail Brush */}
          <path
            d="M 18 72 C 16 76 18 82 22 80 C 23 76 21 72 18 72 Z"
            fill={isColoring ? '#ffffff' : '#1e293b'}
            stroke={strokeColor}
            strokeWidth="1.5"
          />

          {/* Background Hind Leg (Leg 1 of 4) */}
          <rect x="23" y="56" width="7" height="30" rx="3" fill={isColoring ? '#ffffff' : '#e2e8f0'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Background Cloven Hoof */}
          <path d="M 23 81 L 30 81 L 30 86 L 23 86 Z" fill={isColoring ? '#ffffff' : '#1e293b'} stroke={strokeColor} strokeWidth="1.5" />

          {/* Background Front Leg (Leg 2 of 4) */}
          <rect x="58" y="56" width="7" height="30" rx="3" fill={isColoring ? '#ffffff' : '#e2e8f0'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Background Cloven Hoof */}
          <path d="M 58 81 L 65 81 L 65 86 L 58 86 Z" fill={isColoring ? '#ffffff' : '#1e293b'} stroke={strokeColor} strokeWidth="1.5" />

          {/* Cow Udder (עטין ורוד עם פטמות) between rear legs */}
          <path
            d="M 30 64 C 28 72 38 74 40 66 Z"
            fill={isColoring ? '#ffffff' : '#fbcfe8'}
            stroke={strokeColor}
            strokeWidth="1.5"
          />
          <line x1="32" y1="72" x2="32" y2="75" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="36" y1="73" x2="36" y2="76" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />

          {/* Foreground Hind Leg (Leg 3 of 4) */}
          <rect x="33" y="56" width="8" height="30" rx="3" fill={isColoring ? '#ffffff' : '#ffffff'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Foreground Hind Hoof */}
          <path d="M 33 80 L 41 80 L 41 86 L 33 86 Z" fill={isColoring ? '#ffffff' : '#1e293b'} stroke={strokeColor} strokeWidth="1.5" />
          <line x1="37" y1="82" x2="37" y2="86" stroke="#ffffff" strokeWidth="1" />

          {/* Foreground Front Leg (Leg 4 of 4) */}
          <rect x="68" y="56" width="8" height="30" rx="3" fill={isColoring ? '#ffffff' : '#ffffff'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Foreground Front Hoof */}
          <path d="M 68 80 L 76 80 L 76 86 L 68 86 Z" fill={isColoring ? '#ffffff' : '#1e293b'} stroke={strokeColor} strokeWidth="1.5" />
          <line x1="72" y1="82" x2="72" y2="86" stroke="#ffffff" strokeWidth="1" />

          {/* Plump Curved Cow Body */}
          <path
            d="M 24 46 C 24 38 72 38 76 46 C 80 54 78 68 70 70 C 60 72 30 72 24 64 Z"
            fill={isColoring ? '#ffffff' : '#ffffff'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />

          {/* Big Organic Holstein Cow Spots (כתמי פרה קלאסיים) */}
          {!isColoring && (
            <>
              {/* Back spot */}
              <path
                d="M 32 39 C 38 39 44 48 36 54 C 28 58 26 48 32 39 Z"
                fill="#1e293b"
              />
              {/* Flank spot */}
              <path
                d="M 50 42 C 60 40 64 52 56 60 C 48 64 44 54 50 42 Z"
                fill="#1e293b"
              />
              {/* Bottom belly spot */}
              <path
                d="M 66 54 C 74 52 76 62 70 66 C 64 68 64 58 66 54 Z"
                fill="#1e293b"
              />
            </>
          )}

          {/* Cow Bell Ribbon & Golden Bell */}
          {!isColoring && (
            <>
              <path d="M 68 46 L 76 54" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
              <path d="M 72 54 L 70 59 L 76 59 Z" fill="#facc15" stroke={strokeColor} strokeWidth="1.2" />
              <circle cx="73" cy="60" r="1" fill="#713f12" />
            </>
          )}

          {/* Cow Horns (curved yellowish horns on crown) */}
          <path
            d="M 69 26 C 67 18 62 18 64 14 C 68 16 72 22 71 26 Z"
            fill={isColoring ? '#ffffff' : '#fef08a'}
            stroke={strokeColor}
            strokeWidth="1.5"
          />
          <path
            d="M 79 26 C 81 18 86 18 84 14 C 80 16 76 22 77 26 Z"
            fill={isColoring ? '#ffffff' : '#fef08a'}
            stroke={strokeColor}
            strokeWidth="1.5"
          />

          {/* Left Floppy Ear (sticking out horizontally) */}
          <path
            d="M 66 32 C 52 28 50 40 63 38 Z"
            fill={isColoring ? '#ffffff' : '#ffffff'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          <path
            d="M 64 33 C 54 30 53 38 62 37 Z"
            fill={isColoring ? '#ffffff' : '#fbcfe8'}
          />

          {/* Right Floppy Ear (sticking out horizontally) */}
          <path
            d="M 82 32 C 96 28 98 40 85 38 Z"
            fill={isColoring ? '#ffffff' : '#ffffff'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          <path
            d="M 84 33 C 94 30 95 38 86 37 Z"
            fill={isColoring ? '#ffffff' : '#fbcfe8'}
          />

          {/* Cow Head */}
          <circle
            cx="74"
            cy="36"
            r="13"
            fill={isColoring ? '#ffffff' : '#ffffff'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />

          {/* Head Patch over left eye (classic cow look) */}
          {!isColoring && (
            <path
              d="M 65 30 C 68 25 78 26 76 34 C 74 38 64 38 65 30 Z"
              fill="#1e293b"
            />
          )}

          {/* Hair tuft on forehead between horns */}
          <path
            d="M 72 24 C 74 20 76 20 75 25"
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Expressive Warm Eyes */}
          <circle cx="69" cy="33" r="2.8" fill={strokeColor} />
          <circle cx="70" cy="32" r="1" fill="#ffffff" />
          <circle cx="79" cy="33" r="2.8" fill={strokeColor} />
          <circle cx="80" cy="32" r="1" fill="#ffffff" />

          {/* Eyelashes */}
          <path d="M 67 30 L 65 28 M 81 30 L 83 28" stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round" />

          {/* Prominent Wide Pink Cow Snout / Muzzle (חוטם פרה רחב ורוד) */}
          <ellipse
            cx="75"
            cy="44"
            rx="11"
            ry="7.5"
            fill={isColoring ? '#ffffff' : '#fbcfe8'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />

          {/* 2 Dark Nostrils */}
          <ellipse cx="71" cy="43" rx="1.8" ry="2.2" fill={strokeColor} />
          <ellipse cx="79" cy="43" rx="1.8" ry="2.2" fill={strokeColor} />

          {/* Cheerful Smile */}
          <path
            d="M 72 47 Q 75 50 78 47"
            stroke={strokeColor}
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      );

    case 'dog': // כלב - 4 visible legs with paws, wagging tail, floppy ear, collar
      return (
        <svg {...commonSvgProps}>
          {/* Wagging Tail */}
          <path d="M 24 50 C 14 42 12 28 20 28" fill="none" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" />
          {/* 4 Standing Legs with Paws */}
          <rect x="25" y="58" width="8" height="28" rx="4" fill={isColoring ? '#ffffff' : '#b45309'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="36" y="58" width="8" height="28" rx="4" fill={isColoring ? '#ffffff' : '#d97706'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="58" y="58" width="8" height="28" rx="4" fill={isColoring ? '#ffffff' : '#b45309'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="69" y="58" width="8" height="28" rx="4" fill={isColoring ? '#ffffff' : '#d97706'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Body */}
          <rect x="28" y="44" width="46" height="24" rx="12" fill={isColoring ? '#ffffff' : '#d97706'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* White Chest Patch */}
          {!isColoring && <path d="M 60 48 C 66 52 66 64 58 64 Z" fill="#fef3c7" />}
          {/* Red Collar with Tag */}
          {!isColoring && (
            <>
              <path d="M 64 46 L 76 46" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
              <circle cx="70" cy="49" r="2" fill="#facc15" stroke={strokeColor} strokeWidth="1" />
            </>
          )}
          {/* Head */}
          <circle cx="72" cy="38" r="14" fill={isColoring ? '#ffffff' : '#d97706'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Floppy Ear */}
          <ellipse cx="64" cy="38" rx="5" ry="11" fill={isColoring ? '#ffffff' : '#92400e'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Snout with Nose */}
          <ellipse cx="82" cy="42" rx="7" ry="5" fill={isColoring ? '#ffffff' : '#fde68a'} stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="85" cy="40" r="2.5" fill={strokeColor} />
          {/* Smiling Mouth and Pink Tongue */}
          <path d="M 82 44 Q 85 47 88 44" stroke={strokeColor} strokeWidth="1.5" fill="none" />
          {!isColoring && <path d="M 83 45 Q 85 49 87 45 Z" fill="#f43f5e" />}
          {/* Eye */}
          <circle cx="74" cy="34" r="2.8" fill={strokeColor} />
          <circle cx="75" cy="33" r="1" fill="#ffffff" />
        </svg>
      );

    case 'cat': // חתול - 4 paws, pointed ears with pink, whiskers, curved tail
      return (
        <svg {...commonSvgProps}>
          {/* Curved Tail */}
          <path d="M 22 56 C 12 50 14 28 22 28" fill="none" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" />
          {/* 4 Standing Legs */}
          <rect x="24" y="60" width="7" height="26" rx="3.5" fill={isColoring ? '#ffffff' : '#94a3b8'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="34" y="60" width="7" height="26" rx="3.5" fill={isColoring ? '#ffffff' : '#cbd5e1'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="58" y="60" width="7" height="26" rx="3.5" fill={isColoring ? '#ffffff' : '#94a3b8'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="68" y="60" width="7" height="26" rx="3.5" fill={isColoring ? '#ffffff' : '#cbd5e1'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Body */}
          <ellipse cx="48" cy="54" rx="24" ry="14" fill={isColoring ? '#ffffff' : '#cbd5e1'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Pointy Ears with Pink Inner */}
          <polygon points="63,32 58,16 70,26" fill={isColoring ? '#ffffff' : '#cbd5e1'} stroke={strokeColor} strokeWidth={strokeW} />
          <polygon points="63,28 60,19 68,26" fill={isColoring ? '#ffffff' : '#fbcfe8'} />
          <polygon points="73,26 82,16 78,32" fill={isColoring ? '#ffffff' : '#cbd5e1'} stroke={strokeColor} strokeWidth={strokeW} />
          <polygon points="75,26 80,19 78,28" fill={isColoring ? '#ffffff' : '#fbcfe8'} />
          {/* Head */}
          <circle cx="70" cy="40" r="13" fill={isColoring ? '#ffffff' : '#cbd5e1'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Green Eyes */}
          <ellipse cx="67" cy="37" rx="2.5" ry="3.5" fill={isColoring ? '#ffffff' : '#22c55e'} stroke={strokeColor} strokeWidth="1" />
          <circle cx="67" cy="37" r="1.5" fill={strokeColor} />
          <ellipse cx="76" cy="37" rx="2.5" ry="3.5" fill={isColoring ? '#ffffff' : '#22c55e'} stroke={strokeColor} strokeWidth="1" />
          <circle cx="76" cy="37" r="1.5" fill={strokeColor} />
          {/* Nose & Whiskers */}
          <polygon points="72,43 70,41 74,41" fill="#f43f5e" />
          <path d="M 70 44 Q 72 46 74 44" stroke={strokeColor} strokeWidth="1.2" fill="none" />
          <line x1="78" y1="41" x2="88" y2="39" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="78" y1="44" x2="88" y2="45" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="64" y1="41" x2="54" y2="39" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="64" y1="44" x2="54" y2="45" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'horse': // סוס - 4 long legs with hooves, flowing mane & tail, long equine snout
      return (
        <svg {...commonSvgProps}>
          {/* Flowing Tail */}
          <path d="M 20 48 C 10 54 10 74 16 80" fill="none" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" />
          {/* 4 Long Legs with hooves */}
          <rect x="22" y="58" width="7" height="28" rx="2" fill={isColoring ? '#ffffff' : '#92400e'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="22" y="81" width="7" height="5" fill={strokeColor} />
          <rect x="32" y="58" width="7" height="28" rx="2" fill={isColoring ? '#ffffff' : '#b45309'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="32" y="81" width="7" height="5" fill={strokeColor} />
          <rect x="58" y="58" width="7" height="28" rx="2" fill={isColoring ? '#ffffff' : '#92400e'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="58" y="81" width="7" height="5" fill={strokeColor} />
          <rect x="68" y="58" width="7" height="28" rx="2" fill={isColoring ? '#ffffff' : '#b45309'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="68" y="81" width="7" height="5" fill={strokeColor} />
          {/* Body */}
          <ellipse cx="48" cy="52" rx="25" ry="14" fill={isColoring ? '#ffffff' : '#b45309'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Neck & Flowing Mane */}
          <path d="M 62 48 L 74 25 L 80 32 L 70 54 Z" fill={isColoring ? '#ffffff' : '#b45309'} stroke={strokeColor} strokeWidth={strokeW} />
          <path d="M 64 26 C 58 32 58 45 62 48" stroke={isColoring ? strokeColor : '#451a03'} strokeWidth="5" strokeLinecap="round" fill="none" />
          {/* Head & Perky Ears */}
          <polygon points="72,25 74,16 77,24" fill={isColoring ? '#ffffff' : '#b45309'} stroke={strokeColor} strokeWidth="1.5" />
          <polygon points="77,25 80,17 82,25" fill={isColoring ? '#ffffff' : '#b45309'} stroke={strokeColor} strokeWidth="1.5" />
          <ellipse cx="80" cy="28" rx="10" ry="7" fill={isColoring ? '#ffffff' : '#b45309'} stroke={strokeColor} strokeWidth={strokeW} transform="rotate(15 80 28)" />
          {/* Snout with Nostril */}
          <ellipse cx="86" cy="32" rx="4" ry="3" fill={isColoring ? '#ffffff' : '#fed7aa'} stroke={strokeColor} strokeWidth="1.2" />
          <circle cx="86" cy="32" r="1" fill={strokeColor} />
          {/* Eye */}
          <circle cx="76" cy="25" r="2.5" fill={strokeColor} />
          <circle cx="77" cy="24" r="0.8" fill="#ffffff" />
        </svg>
      );

    case 'sheep': // כבשה - 4 dark legs, fluffy cloud wool, floppy ears
      return (
        <svg {...commonSvgProps}>
          {/* 4 Dark Legs with Hooves */}
          <rect x="28" y="62" width="6" height="24" rx="2" fill={isColoring ? '#ffffff' : '#334155'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="37" y="62" width="6" height="24" rx="2" fill={isColoring ? '#ffffff' : '#475569'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="57" y="62" width="6" height="24" rx="2" fill={isColoring ? '#ffffff' : '#334155'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="66" y="62" width="6" height="24" rx="2" fill={isColoring ? '#ffffff' : '#475569'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Fluffy Wool Body (Cloud of Circles) */}
          <circle cx="34" cy="50" r="12" fill={isColoring ? '#ffffff' : '#f8fafc'} stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="48" cy="44" r="14" fill={isColoring ? '#ffffff' : '#f8fafc'} stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="60" cy="48" r="12" fill={isColoring ? '#ffffff' : '#f8fafc'} stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="48" cy="56" r="13" fill={isColoring ? '#ffffff' : '#f8fafc'} stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="36" cy="58" r="10" fill={isColoring ? '#ffffff' : '#f8fafc'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Head */}
          <ellipse cx="72" cy="42" rx="9" ry="11" fill={isColoring ? '#ffffff' : '#334155'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Wool Cap on Head */}
          <circle cx="72" cy="32" r="5" fill={isColoring ? '#ffffff' : '#f8fafc'} stroke={strokeColor} strokeWidth="1.5" />
          {/* Floppy Ears */}
          <ellipse cx="64" cy="40" rx="5" ry="3" fill={isColoring ? '#ffffff' : '#334155'} stroke={strokeColor} strokeWidth="1.5" />
          {/* Eye */}
          <circle cx="73" cy="40" r="2.5" fill="#ffffff" />
          <circle cx="74" cy="40" r="1.2" fill={strokeColor} />
          {/* Rosy Cheek */}
          {!isColoring && <circle cx="71" cy="45" r="2" fill="#f43f5e" opacity="0.4" />}
        </svg>
      );

    case 'elephant': // פיל - 4 giant pillar legs, raised curved trunk, big floppy ears
      return (
        <svg {...commonSvgProps}>
          {/* Tail */}
          <path d="M 20 54 L 14 66" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" />
          {/* 4 Big Pillar Legs */}
          <rect x="22" y="58" width="10" height="28" rx="3" fill={isColoring ? '#ffffff' : '#64748b'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="34" y="58" width="10" height="28" rx="3" fill={isColoring ? '#ffffff' : '#94a3b8'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="58" y="58" width="10" height="28" rx="3" fill={isColoring ? '#ffffff' : '#64748b'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="70" y="58" width="10" height="28" rx="3" fill={isColoring ? '#ffffff' : '#94a3b8'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Toenails */}
          <ellipse cx="27" cy="85" rx="3" ry="1.5" fill="#f8fafc" />
          <ellipse cx="39" cy="85" rx="3" ry="1.5" fill="#f8fafc" />
          <ellipse cx="63" cy="85" rx="3" ry="1.5" fill="#f8fafc" />
          <ellipse cx="75" cy="85" rx="3" ry="1.5" fill="#f8fafc" />
          {/* Big Round Body */}
          <ellipse cx="48" cy="50" rx="26" ry="20" fill={isColoring ? '#ffffff' : '#94a3b8'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Head */}
          <circle cx="70" cy="42" r="15" fill={isColoring ? '#ffffff' : '#94a3b8'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Giant Flapping Ear */}
          <ellipse cx="62" cy="42" rx="9" ry="14" fill={isColoring ? '#ffffff' : '#cbd5e1'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Small Ivory Tusk */}
          <path d="M 76 50 C 82 54 84 48 80 46" fill="#f8fafc" stroke={strokeColor} strokeWidth="1.5" />
          {/* Curled Trunk Raised High */}
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
          <circle cx="72" cy="38" r="2.8" fill={strokeColor} />
          <circle cx="73" cy="37" r="0.9" fill="#ffffff" />
        </svg>
      );

    case 'giraffe': // ג׳ירפה - 4 tall legs, long patterned neck, ossicones
      return (
        <svg {...commonSvgProps}>
          {/* Tail with tuft */}
          <path d="M 28 58 L 22 72" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" />
          <circle cx="21" cy="73" r="2" fill="#78350f" />
          {/* 4 Long Stilt Legs */}
          <rect x="25" y="62" width="6" height="26" rx="2" fill={isColoring ? '#ffffff' : '#d97706'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="33" y="62" width="6" height="26" rx="2" fill={isColoring ? '#ffffff' : '#f59e0b'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="53" y="62" width="6" height="26" rx="2" fill={isColoring ? '#ffffff' : '#d97706'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="61" y="62" width="6" height="26" rx="2" fill={isColoring ? '#ffffff' : '#f59e0b'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Body */}
          <ellipse cx="44" cy="56" rx="18" ry="12" fill={isColoring ? '#ffffff' : '#f59e0b'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Tall Neck */}
          <path d="M 52 54 L 66 18 L 74 22 L 60 58 Z" fill={isColoring ? '#ffffff' : '#f59e0b'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Mane */}
          <path d="M 64 22 L 54 52" stroke="#78350f" strokeWidth="2.5" strokeDasharray="3 3" />
          {/* Head & Ossicones */}
          <circle cx="72" cy="18" r="7" fill={isColoring ? '#ffffff' : '#f59e0b'} stroke={strokeColor} strokeWidth={strokeW} />
          <path d="M 69 12 L 69 7 M 74 12 L 74 7" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" />
          <circle cx="69" cy="6" r="1.8" fill={strokeColor} />
          <circle cx="74" cy="6" r="1.8" fill={strokeColor} />
          {/* Spots */}
          {!isColoring && (
            <>
              <circle cx="60" cy="30" r="2.8" fill="#b45309" />
              <circle cx="64" cy="40" r="3" fill="#b45309" />
              <circle cx="44" cy="54" r="3" fill="#b45309" />
              <circle cx="36" cy="54" r="2.5" fill="#b45309" />
            </>
          )}
          {/* Eye */}
          <circle cx="73" cy="17" r="1.8" fill={strokeColor} />
        </svg>
      );

    case 'lion': // אריה - 4 paws, majestic fluffy round mane, tufted tail
      return (
        <svg {...commonSvgProps}>
          {/* Tufted Tail */}
          <path d="M 22 52 C 14 46 12 36 18 34" fill="none" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" />
          <circle cx="18" cy="34" r="3.5" fill={isColoring ? '#ffffff' : '#92400e'} stroke={strokeColor} strokeWidth="1" />
          {/* 4 Strong Legs with Paws */}
          <rect x="25" y="58" width="7" height="28" rx="3.5" fill={isColoring ? '#ffffff' : '#d97706'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="35" y="58" width="7" height="28" rx="3.5" fill={isColoring ? '#ffffff' : '#f59e0b'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="58" y="58" width="7" height="28" rx="3.5" fill={isColoring ? '#ffffff' : '#d97706'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="68" y="58" width="7" height="28" rx="3.5" fill={isColoring ? '#ffffff' : '#f59e0b'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Body */}
          <rect x="28" y="46" width="46" height="22" rx="11" fill={isColoring ? '#ffffff' : '#f59e0b'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Glorious Fluffy Round Mane */}
          <circle cx="72" cy="38" r="18" fill={isColoring ? '#ffffff' : '#b45309'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Lion Ears peeking out */}
          <circle cx="62" cy="26" r="3.5" fill={isColoring ? '#ffffff' : '#f59e0b'} stroke={strokeColor} strokeWidth="1.5" />
          <circle cx="82" cy="26" r="3.5" fill={isColoring ? '#ffffff' : '#f59e0b'} stroke={strokeColor} strokeWidth="1.5" />
          {/* Head */}
          <circle cx="72" cy="38" r="11" fill={isColoring ? '#ffffff' : '#fef08a'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Snout, Nose & Whiskers */}
          <ellipse cx="72" cy="42" rx="4" ry="3" fill="#ffffff" stroke={strokeColor} strokeWidth="1.2" />
          <polygon points="72,42 70,40 74,40" fill={strokeColor} />
          <circle cx="68" cy="36" r="2.5" fill={strokeColor} />
          <circle cx="76" cy="36" r="2.5" fill={strokeColor} />
          <circle cx="69" cy="35" r="0.8" fill="#ffffff" />
          <circle cx="77" cy="35" r="0.8" fill="#ffffff" />
        </svg>
      );

    case 'tiger': // נמר - 4 legs, bold stripes, feline face
      return (
        <svg {...commonSvgProps}>
          {/* Striped Tail */}
          <path d="M 22 52 C 14 44 14 30 20 28" fill="none" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" />
          {/* 4 Strong Legs with Paws */}
          <rect x="24" y="58" width="7" height="28" rx="3.5" fill={isColoring ? '#ffffff' : '#ea580c'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="34" y="58" width="7" height="28" rx="3.5" fill={isColoring ? '#ffffff' : '#f97316'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="58" y="58" width="7" height="28" rx="3.5" fill={isColoring ? '#ffffff' : '#ea580c'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="68" y="58" width="7" height="28" rx="3.5" fill={isColoring ? '#ffffff' : '#f97316'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Body */}
          <rect x="26" y="46" width="48" height="22" rx="11" fill={isColoring ? '#ffffff' : '#f97316'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Bold Tiger Stripes */}
          {!isColoring && (
            <>
              <path d="M 38 46 L 36 56 M 46 46 L 44 56 M 54 46 L 52 56" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
            </>
          )}
          {/* Head & Round Ears */}
          <circle cx="72" cy="38" r="13" fill={isColoring ? '#ffffff' : '#f97316'} stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="64" cy="27" r="4" fill={isColoring ? '#ffffff' : '#f97316'} stroke={strokeColor} strokeWidth="1.5" />
          <circle cx="80" cy="27" r="4" fill={isColoring ? '#ffffff' : '#f97316'} stroke={strokeColor} strokeWidth="1.5" />
          <circle cx="68" cy="36" r="2.5" fill={strokeColor} />
          <circle cx="76" cy="36" r="2.5" fill={strokeColor} />
          <polygon points="72,42 70,40 74,40" fill="#0f172a" />
          <line x1="77" y1="41" x2="84" y2="40" stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round" />
          <line x1="67" y1="41" x2="60" y2="40" stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );

    case 'turtle': // צב - 4 crawling legs clearly visible, dome shell with patterns
      return (
        <svg {...commonSvgProps}>
          {/* 4 Crawling Legs clearly visible around shell */}
          <ellipse cx="26" cy="68" rx="7" ry="11" fill={isColoring ? '#ffffff' : '#15803d'} stroke={strokeColor} strokeWidth={strokeW} transform="rotate(-25 26 68)" />
          <ellipse cx="40" cy="74" rx="7" ry="11" fill={isColoring ? '#ffffff' : '#22c55e'} stroke={strokeColor} strokeWidth={strokeW} transform="rotate(-10 40 74)" />
          <ellipse cx="60" cy="74" rx="7" ry="11" fill={isColoring ? '#ffffff' : '#15803d'} stroke={strokeColor} strokeWidth={strokeW} transform="rotate(10 60 74)" />
          <ellipse cx="74" cy="68" rx="7" ry="11" fill={isColoring ? '#ffffff' : '#22c55e'} stroke={strokeColor} strokeWidth={strokeW} transform="rotate(25 74 68)" />
          {/* Little Pointy Tail */}
          <polygon points="18,56 10,58 18,62" fill={isColoring ? '#ffffff' : '#22c55e'} stroke={strokeColor} strokeWidth="1.5" />
          {/* Domed Shell */}
          <path
            d="M 22 62 C 22 34 78 34 78 62 Z"
            fill={isColoring ? '#ffffff' : '#854d0e'}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />
          {/* Hexagonal Shell Tiles */}
          <path d="M 38 62 C 38 46 62 46 62 62 M 50 46 L 50 62" stroke={strokeColor} strokeWidth="2" fill="none" />
          {/* Friendly Head stretching out */}
          <ellipse cx="85" cy="52" rx="10" ry="8" fill={isColoring ? '#ffffff' : '#22c55e'} stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="87" cy="50" r="2.5" fill={strokeColor} />
          <circle cx="88" cy="49" r="0.8" fill="#ffffff" />
          <path d="M 88 55 Q 85 57 82 55" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'bear': // דוב - 4 big paws, sturdy furry body, round ears
      return (
        <svg {...commonSvgProps}>
          {/* 4 Big Heavy Paws */}
          <rect x="24" y="58" width="9" height="28" rx="4" fill={isColoring ? '#ffffff' : '#78350f'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="36" y="58" width="9" height="28" rx="4" fill={isColoring ? '#ffffff' : '#92400e'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="56" y="58" width="9" height="28" rx="4" fill={isColoring ? '#ffffff' : '#78350f'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="68" y="58" width="9" height="28" rx="4" fill={isColoring ? '#ffffff' : '#92400e'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Body */}
          <ellipse cx="48" cy="50" rx="26" ry="18" fill={isColoring ? '#ffffff' : '#92400e'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Head & Round Ears */}
          <circle cx="72" cy="38" r="14" fill={isColoring ? '#ffffff' : '#92400e'} stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="64" cy="26" r="5" fill={isColoring ? '#ffffff' : '#78350f'} stroke={strokeColor} strokeWidth="1.5" />
          <circle cx="80" cy="26" r="5" fill={isColoring ? '#ffffff' : '#78350f'} stroke={strokeColor} strokeWidth="1.5" />
          {/* Snout with Big Black Nose */}
          <ellipse cx="80" cy="42" rx="6" ry="5" fill={isColoring ? '#ffffff' : '#fef08a'} stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx="82" cy="40" r="2.5" fill={strokeColor} />
          <circle cx="72" cy="35" r="2.5" fill={strokeColor} />
          <circle cx="73" cy="34" r="0.8" fill="#ffffff" />
        </svg>
      );

    case 'rabbit': // ארנב - 4 paws, long upright ears, cotton-ball tail
      return (
        <svg {...commonSvgProps}>
          {/* Fluffy Round Cotton-Ball Tail */}
          <circle cx="18" cy="54" r="5" fill={isColoring ? '#ffffff' : '#f8fafc'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* 4 Paws */}
          <rect x="24" y="62" width="7" height="24" rx="3.5" fill={isColoring ? '#ffffff' : '#cbd5e1'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="34" y="62" width="7" height="24" rx="3.5" fill={isColoring ? '#ffffff' : '#e2e8f0'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="58" y="62" width="7" height="24" rx="3.5" fill={isColoring ? '#ffffff' : '#cbd5e1'} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x="68" y="62" width="7" height="24" rx="3.5" fill={isColoring ? '#ffffff' : '#e2e8f0'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Body */}
          <ellipse cx="48" cy="54" rx="24" ry="14" fill={isColoring ? '#ffffff' : '#f8fafc'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Long Upright Ears with Pink Inner */}
          <ellipse cx="64" cy="18" rx="4.5" ry="12" fill={isColoring ? '#ffffff' : '#f8fafc'} stroke={strokeColor} strokeWidth={strokeW} />
          <ellipse cx="64" cy="18" rx="2.2" ry="8" fill={isColoring ? '#ffffff' : '#fbcfe8'} />
          <ellipse cx="73" cy="18" rx="4.5" ry="12" fill={isColoring ? '#ffffff' : '#f8fafc'} stroke={strokeColor} strokeWidth={strokeW} />
          <ellipse cx="73" cy="18" rx="2.2" ry="8" fill={isColoring ? '#ffffff' : '#fbcfe8'} />
          {/* Head */}
          <circle cx="70" cy="40" r="12" fill={isColoring ? '#ffffff' : '#f8fafc'} stroke={strokeColor} strokeWidth={strokeW} />
          {/* Nose & Whiskers */}
          <polygon points="78,42 76,40 80,40" fill="#f43f5e" />
          <line x1="80" y1="41" x2="86" y2="40" stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round" />
          <line x1="80" y1="43" x2="86" y2="44" stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round" />
          {/* Eye */}
          <circle cx="70" cy="36" r="2.8" fill={strokeColor} />
          <circle cx="71" cy="35" r="0.9" fill="#ffffff" />
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
