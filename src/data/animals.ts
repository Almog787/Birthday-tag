import { AnimalItem } from '../types';

export const ANIMALS_DATABASE: AnimalItem[] = [
  // ==========================================
  // קבוצה 1: הולכים על שתיים (2 רגליים)
  // ==========================================
  {
    id: 'rooster',
    name: 'תרנגול',
    nameNikud: 'תַּרְנְגוֹל',
    legs: 2,
    category: 'birds',
    categoryLabel: 'עופות',
    description: 'עוף חווה עומד על 2 רגליים עם כרבולת אדומה',
    soundEmoji: '🐓'
  },
  {
    id: 'duck',
    name: 'ברווז',
    nameNikud: 'בַּרְוָז',
    legs: 2,
    category: 'birds',
    categoryLabel: 'עופות',
    description: 'שוחה במים ועומד ביבשה על 2 רגליים קרומיות',
    soundEmoji: '🦆'
  },
  {
    id: 'penguin',
    name: 'פינגווין',
    nameNikud: 'פִּינְגְּוִין',
    legs: 2,
    category: 'birds',
    categoryLabel: 'עופות קוטב',
    description: 'ציפור קוטב שהולכת זקוף על 2 רגליים קצרות וחזקות',
    soundEmoji: '🐧'
  },
  {
    id: 'parrot',
    name: 'תוכי',
    nameNikud: 'תּוּכִּי',
    legs: 2,
    category: 'birds',
    categoryLabel: 'עופות',
    description: 'ציפור צבעונית שעומדת על 2 רגליים עם טפרים',
    soundEmoji: '🦜'
  },
  {
    id: 'owl',
    name: 'ינשוף',
    nameNikud: 'יַנְשׁוּף',
    legs: 2,
    category: 'birds',
    categoryLabel: 'עופות לילה',
    description: 'עוף לילה בעל עיניים גדולות העומד על 2 רגליים',
    soundEmoji: '🦉'
  },
  {
    id: 'dove',
    name: 'יונה',
    nameNikud: 'יוֹנָה',
    legs: 2,
    category: 'birds',
    categoryLabel: 'עופות',
    description: 'עוף לבן ועדין עם 2 רגליים ורודות וענף זית במקור',
    soundEmoji: '🕊️'
  },
  {
    id: 'sparrow',
    name: 'ציפור',
    nameNikud: 'צִפּוֹר',
    legs: 2,
    category: 'birds',
    categoryLabel: 'עופות שיר',
    description: 'ציפור שיר קטנה ומצייצת העומדת על 2 רגליים דקות',
    soundEmoji: '🐦'
  },
  {
    id: 'kangaroo',
    name: 'קנגורו',
    nameNikud: 'קֶנְגּוּרוּ',
    legs: 2,
    category: 'wild',
    categoryLabel: 'חיות כיס',
    description: 'עומד וקופץ על 2 רגליים אחוריות חזקות וגדולות',
    soundEmoji: '🦘'
  },
  {
    id: 'monkey',
    name: 'קוף',
    nameNikud: 'קוֹף',
    legs: 2,
    category: 'wild',
    categoryLabel: 'חיות בר',
    description: 'עומד זקוף על 2 רגליים ומטפס בזריזות',
    soundEmoji: '🐒'
  },
  {
    id: 'flamingo',
    name: 'פלמינגו',
    nameNikud: 'פְלָמִינְגּוֹ',
    legs: 2,
    category: 'birds',
    categoryLabel: 'עופות מים',
    description: 'עוף מים ורוד ויפהפה העומד על 2 רגליים ארוכות',
    soundEmoji: '🦩'
  },
  {
    id: 'ostrich',
    name: 'יען',
    nameNikud: 'יַעַן',
    legs: 2,
    category: 'birds',
    categoryLabel: 'עופות רצים',
    description: 'העוף הגדול בעולם שרץ במהירות על 2 רגליים שריריות',
    soundEmoji: '🪶'
  },

  // ==========================================
  // קבוצה 2: הולכים על ארבע (4 רגליים)
  // ==========================================
  {
    id: 'dog',
    name: 'כלב',
    nameNikud: 'כֶּלֶב',
    legs: 4,
    category: 'pets',
    categoryLabel: 'חיות מחמד',
    description: 'ידידו הטוב של האדם, עומד ורץ בשמחה על 4 רגליים',
    soundEmoji: '🐶'
  },
  {
    id: 'cat',
    name: 'חתול',
    nameNikud: 'חָתוּל',
    legs: 4,
    category: 'pets',
    categoryLabel: 'חיות מחמד',
    description: 'חיית מחמד גמישה וחמודה שהולכת בעדינות על 4 כפות',
    soundEmoji: '🐱'
  },
  {
    id: 'cow',
    name: 'פרה',
    nameNikud: 'פָּרָה',
    legs: 4,
    category: 'farm',
    categoryLabel: 'חיות חווה',
    description: 'חיית חווה נותנת חלב, עומדת באחו על 4 רגליים עם פרסות',
    soundEmoji: '🐮'
  },
  {
    id: 'horse',
    name: 'סוס',
    nameNikud: 'סוּס',
    legs: 4,
    category: 'farm',
    categoryLabel: 'חיות חווה',
    description: 'חיה אצילית ומהירה הדוהרת בעוצמה על 4 רגליים',
    soundEmoji: '🐴'
  },
  {
    id: 'sheep',
    name: 'כבשה',
    nameNikud: 'כִּבְשָׂה',
    legs: 4,
    category: 'farm',
    categoryLabel: 'חיות חווה',
    description: 'עטופה בצמר רך ועומדת ברוגע בעדר על 4 רגליים',
    soundEmoji: '🐑'
  },
  {
    id: 'elephant',
    name: 'פיל',
    nameNikud: 'פִּיל',
    legs: 4,
    category: 'wild',
    categoryLabel: 'חיות ספארי',
    description: 'בעל חדק גדול ואוזניים רחבות, צועד על 4 רגליים חזקות',
    soundEmoji: '🐘'
  },
  {
    id: 'giraffe',
    name: 'ג׳ירפה',
    nameNikud: 'גִּ׳ירָפָה',
    legs: 4,
    category: 'wild',
    categoryLabel: 'חיות ספארי',
    description: 'החיה הגבוהה בעולם עם צוואר ארוך ו-4 רגליים דקות וגבוהות',
    soundEmoji: '🦒'
  },
  {
    id: 'lion',
    name: 'אריה',
    nameNikud: 'אַרְיֵה',
    legs: 4,
    category: 'wild',
    categoryLabel: 'חיות ספארי',
    description: 'מלך החיות בעל רעמה מפוארת הצועד בגאווה על 4 כפות',
    soundEmoji: '🦁'
  },
  {
    id: 'tiger',
    name: 'נמר',
    nameNikud: 'נָמֵר',
    legs: 4,
    category: 'wild',
    categoryLabel: 'חיות בר',
    description: 'טורף חזק ומהיר עם פסים ו-4 כפות חזקות',
    soundEmoji: '🐯'
  },
  {
    id: 'turtle',
    name: 'צב',
    nameNikud: 'צָב',
    legs: 4,
    category: 'reptiles',
    categoryLabel: 'זוחלים',
    description: 'נושא שריון על גבו וזוחל לאט על 4 רגליים קצרות',
    soundEmoji: '🐢'
  },
  {
    id: 'bear',
    name: 'דוב',
    nameNikud: 'דֹּב',
    legs: 4,
    category: 'wild',
    categoryLabel: 'חיות בר',
    description: 'חיית יער גדולה ופרוותית הצועדת בכוח על 4 כפות עבות',
    soundEmoji: '🐻'
  },
  {
    id: 'rabbit',
    name: 'ארנב',
    nameNikud: 'אַרְנָב',
    legs: 4,
    category: 'pets',
    categoryLabel: 'יונקים קטנים',
    description: 'בעל אוזניים ארוכות המקפץ בזריזות על 4 רגליים',
    soundEmoji: '🐰'
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
