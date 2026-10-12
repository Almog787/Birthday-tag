import { AnimalItem } from '../types';

/**
 * 18 Animal Picture Cards dataset mapped directly to the uploaded animal card images (row-*-column-*.png).
 * 9 animals with 2 legs and 9 animals with 4 legs.
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
    imagePath: '/animals/row-1-column-1.png'
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
    imagePath: '/animals/row-1-column-2.png'
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
    imagePath: '/animals/row-1-column-3.png'
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
    imagePath: '/animals/row-1-column-4.png'
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
    imagePath: '/animals/row-1-column-5.png'
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
    imagePath: '/animals/row-2-column-2.png'
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
    imagePath: '/animals/row-2-column-3.png'
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
    imagePath: '/animals/row-2-column-4.png'
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
    imagePath: '/animals/row-2-column-5.png'
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
    imagePath: '/animals/row-3-column-1.png'
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
    imagePath: '/animals/row-3-column-2.png'
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
    imagePath: '/animals/row-3-column-3.png'
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
    imagePath: '/animals/row-3-column-4.png'
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
    imagePath: '/animals/row-3-column-5.png'
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
    imagePath: '/animals/row-4-column-1.png'
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
    imagePath: '/animals/row-4-column-3.png'
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
    imagePath: '/animals/row-4-column-4.png'
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
    imagePath: '/animals/row-4-column-5.png'
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
