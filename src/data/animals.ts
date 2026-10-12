import { AnimalItem } from '../types';

// Direct ES imports ensuring Vite bundles, hashes, and correctly resolves all images
// in both development, production, iframe, relative paths, and preview environments!
import roosterImg from '../assets/animals/row-1-column-1.png';
import duckImg from '../assets/animals/row-1-column-2.png';
import penguinImg from '../assets/animals/row-1-column-3.png';
import parrotImg from '../assets/animals/row-1-column-4.png';
import owlImg from '../assets/animals/row-1-column-5.png';
import kangarooImg from '../assets/animals/row-2-column-2.png';
import monkeyImg from '../assets/animals/row-2-column-3.png';
import flamingoImg from '../assets/animals/row-2-column-4.png';
import ostrichImg from '../assets/animals/row-2-column-5.png';

import dogImg from '../assets/animals/row-3-column-1.png';
import catImg from '../assets/animals/row-3-column-2.png';
import cowImg from '../assets/animals/row-3-column-3.png';
import elephantImg from '../assets/animals/row-3-column-4.png';
import giraffeImg from '../assets/animals/row-3-column-5.png';
import lionImg from '../assets/animals/row-4-column-1.png';
import tigerImg from '../assets/animals/row-4-column-3.png';
import bearImg from '../assets/animals/row-4-column-4.png';
import sheepImg from '../assets/animals/row-4-column-5.png';

/**
 * 18 Animal Picture Cards dataset mapped directly to the uploaded animal card images.
 * 9 animals with 2 legs and 9 animals with 4 legs.
 * Uses both direct bundled image asset imports (imagePath) and public fallback.
 */
export const ANIMALS_DATABASE: AnimalItem[] = [
  // ==========================================
  // קבוצה 1: הולכים על שתיים (2 רגליים - 9 חיות)
  // ==========================================
  {
    id: 'rooster',
    name: 'תרנגול',
    nameNikud: 'תַּרְנְגוֹל',
    legs: 2,
    category: 'birds',
    categoryLabel: 'עופות',
    description: 'עוף חווה עומד על 2 רגליים עם כרבולת אדומה',
    soundEmoji: '🐓',
    imagePath: roosterImg
  },
  {
    id: 'duck',
    name: 'ברווז',
    nameNikud: 'בַּרְוָז',
    legs: 2,
    category: 'birds',
    categoryLabel: 'עופות',
    description: 'שוחה במים ועומד ביבשה על 2 רגליים קרומיות',
    soundEmoji: '🦆',
    imagePath: duckImg
  },
  {
    id: 'penguin',
    name: 'פינגווין',
    nameNikud: 'פִּינְגְּוִין',
    legs: 2,
    category: 'birds',
    categoryLabel: 'עופות קוטב',
    description: 'ציפור קוטב שהולכת זקוף על 2 רגליים קצרות וחזקות',
    soundEmoji: '🐧',
    imagePath: penguinImg
  },
  {
    id: 'parrot',
    name: 'תוכי',
    nameNikud: 'תּוּכִּי',
    legs: 2,
    category: 'birds',
    categoryLabel: 'עופות',
    description: 'ציפור צבעונית שעומדת על 2 רגליים עם טפרים',
    soundEmoji: '🦜',
    imagePath: parrotImg
  },
  {
    id: 'owl',
    name: 'ינשוף',
    nameNikud: 'יַנְשׁוּף',
    legs: 2,
    category: 'birds',
    categoryLabel: 'עופות לילה',
    description: 'עוף לילה בעל עיניים גדולות העומד על 2 רגליים',
    soundEmoji: '🦉',
    imagePath: owlImg
  },
  {
    id: 'kangaroo',
    name: 'קנגורו',
    nameNikud: 'קֶנְגּוּרוּ',
    legs: 2,
    category: 'wild',
    categoryLabel: 'חיות כיס',
    description: 'עומד וקופץ על 2 רגליים אחוריות חזקות וגדולות',
    soundEmoji: '🦘',
    imagePath: kangarooImg
  },
  {
    id: 'monkey',
    name: 'קוף',
    nameNikud: 'קוֹף',
    legs: 2,
    category: 'wild',
    categoryLabel: 'חיות בר',
    description: 'עומד זקוף על 2 רגליים ומטפס בזריזות',
    soundEmoji: '🐒',
    imagePath: monkeyImg
  },
  {
    id: 'flamingo',
    name: 'פלמינגו',
    nameNikud: 'פְלָמִינְגּוֹ',
    legs: 2,
    category: 'birds',
    categoryLabel: 'עופות מים',
    description: 'עוף מים ורוד ויפהפה העומד על 2 רגליים ארוכות',
    soundEmoji: '🦩',
    imagePath: flamingoImg
  },
  {
    id: 'ostrich',
    name: 'יען',
    nameNikud: 'יַעַן',
    legs: 2,
    category: 'birds',
    categoryLabel: 'עופות רצים',
    description: 'העוף הגדול בעולם שרץ במהירות על 2 רגליים שריריות',
    soundEmoji: '🪶',
    imagePath: ostrichImg
  },

  // ==========================================
  // קבוצה 2: הולכים על ארבע (4 רגליים - 9 חיות)
  // ==========================================
  {
    id: 'dog',
    name: 'כלב',
    nameNikud: 'כֶּלֶב',
    legs: 4,
    category: 'pets',
    categoryLabel: 'חיות מחמד',
    description: 'ידידו הטוב של האדם, עומד ורץ בשמחה על 4 רגליים',
    soundEmoji: '🐶',
    imagePath: dogImg
  },
  {
    id: 'cat',
    name: 'חתול',
    nameNikud: 'חָתוּל',
    legs: 4,
    category: 'pets',
    categoryLabel: 'חיות מחמד',
    description: 'חיית מחמד גמישה וחמודה שהולכת בעדינות על 4 כפות',
    soundEmoji: '🐱',
    imagePath: catImg
  },
  {
    id: 'cow',
    name: 'פרה',
    nameNikud: 'פָּרָה',
    legs: 4,
    category: 'farm',
    categoryLabel: 'חיות חווה',
    description: 'חיית חווה נותנת חלב, עומדת באחו על 4 רגליים עם פרסות',
    soundEmoji: '🐮',
    imagePath: cowImg
  },
  {
    id: 'elephant',
    name: 'פיל',
    nameNikud: 'פִּיל',
    legs: 4,
    category: 'wild',
    categoryLabel: 'חיות ספארי',
    description: 'בעל חדק גדול ואוזניים רחבות, צועד על 4 רגליים חזקות',
    soundEmoji: '🐘',
    imagePath: elephantImg
  },
  {
    id: 'giraffe',
    name: 'ג׳ירפה',
    nameNikud: 'גִּ׳ירָפָה',
    legs: 4,
    category: 'wild',
    categoryLabel: 'חיות ספארי',
    description: 'החיה הגבוהה בעולם עם צוואר ארוך ו-4 רגליים דקות וגבוהות',
    soundEmoji: '🦒',
    imagePath: giraffeImg
  },
  {
    id: 'lion',
    name: 'אריה',
    nameNikud: 'אַרְיֵה',
    legs: 4,
    category: 'wild',
    categoryLabel: 'חיות ספארי',
    description: 'מלך החיות בעל רעמה מפוארת הצועד בגאווה על 4 כפות',
    soundEmoji: '🦁',
    imagePath: lionImg
  },
  {
    id: 'tiger',
    name: 'נמר',
    nameNikud: 'נָמֵר',
    legs: 4,
    category: 'wild',
    categoryLabel: 'חיות בר',
    description: 'טורף חזק ומהיר עם פסים ו-4 כפות חזקות',
    soundEmoji: '🐯',
    imagePath: tigerImg
  },
  {
    id: 'bear',
    name: 'דוב',
    nameNikud: 'דֹּב',
    legs: 4,
    category: 'wild',
    categoryLabel: 'חיות בר',
    description: 'חיית יער גדולה ופרוותית הצועדת בכוח על 4 כפות עבות',
    soundEmoji: '🐻',
    imagePath: bearImg
  },
  {
    id: 'sheep',
    name: 'כבשה',
    nameNikud: 'כִּבְשָׂה',
    legs: 4,
    category: 'farm',
    categoryLabel: 'חיות חווה',
    description: 'עטופה בצמר רך ועומדת ברוגע בעדר על 4 רגליים',
    soundEmoji: '🐑',
    imagePath: sheepImg
  }
];

// Default selection: balanced 5 of 2-legs and 5 of 4-legs (10 total)
export const DEFAULT_SELECTED_ANIMAL_IDS: string[] = [
  'rooster',
  'duck',
  'penguin',
  'kangaroo',
  'owl',
  'dog',
  'cat',
  'cow',
  'elephant',
  'lion'
];
