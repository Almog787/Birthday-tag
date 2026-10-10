import {
  TagItem,
  ThemePreset,
  BackgroundPattern,
  GradientStyle,
  ColorPalette,
  TableTemplate,
  TableDesignTheme
} from './types';

// Helper to calculate RGBA for subtle background patterns
export function hexToRgba(hex: string, alpha: number = 0.35): string {
  if (!hex || hex === 'none') return 'transparent';
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const r = parseInt(clean.substring(0, 2), 16) || 150;
  const g = parseInt(clean.substring(2, 4), 16) || 150;
  const b = parseInt(clean.substring(4, 6), 16) || 150;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// 29 Children provided in user prompt
export const INITIAL_TAGS: TagItem[] = [
  { id: '1', name: 'אביב', date: '18.06' },
  { id: '2', name: 'דור', date: '07.07' },
  { id: '3', name: 'עלמה', date: '27.07' },
  { id: '4', name: 'אביב', date: '09.05' },
  { id: '5', name: 'עדיאל', date: '11.08' },
  { id: '6', name: 'אוריה', date: '12.05' },
  { id: '7', name: 'אורי', date: '26.10' },
  { id: '8', name: 'ריי משה', date: '05.01' },
  { id: '9', name: 'לביא', date: '22.09' },
  { id: '10', name: 'רואי', date: '23.06' },
  { id: '11', name: 'אימרי', date: '05.07' },
  { id: '12', name: 'אגם הודיה', date: '30.05' },
  { id: '13', name: 'אלרואי', date: '15.07' },
  { id: '14', name: 'אליה', date: '24.04' },
  { id: '15', name: 'הלני', date: '31.07' },
  { id: '16', name: 'מיה', date: '18.06' },
  { id: '17', name: 'אורין', date: '06.10' },
  { id: '18', name: 'עמית ישראל', date: '17.10' },
  { id: '19', name: 'שון', date: '22.09' },
  { id: '20', name: 'נתן דויד', date: '25.09' },
  { id: '21', name: 'מיה', date: '25.07' },
  { id: '22', name: 'רוני', date: '08.04' },
  { id: '23', name: 'אריאל', date: '08.10' },
  { id: '24', name: 'ריי דוד', date: '01.10' },
  { id: '25', name: 'שקד', date: '13.10' },
  { id: '26', name: 'דין', date: '12.07' },
  { id: '27', name: 'מיכל', date: '31.05' },
  { id: '28', name: 'אלמה', date: '13.09' },
  { id: '29', name: 'עמנואל', date: '13.09' }
];

export const THEMES: ThemePreset[] = [
  {
    id: 'festive',
    name: '🎈 יומולדת חגיגית',
    bgColor: 'from-amber-50 via-rose-50 to-sky-50',
    cardBg: 'bg-white',
    borderColor: 'border-rose-300',
    borderColorHex: '#fda4af',
    textColor: 'text-rose-950',
    accentColor: 'text-rose-600',
    subtextColor: 'text-rose-700',
    icon: '🎈',
    badgeBg: 'bg-rose-100/80',
    fontFamily: "'Fredoka', sans-serif",
    patternStyle: 'dots'
  },
  {
    id: 'confetti',
    name: '🎉 מסיבת קונפטי צבעונית',
    bgColor: 'from-yellow-100 via-pink-50 to-cyan-100',
    cardBg: 'bg-white',
    borderColor: 'border-pink-400',
    borderColorHex: '#f472b6',
    textColor: 'text-slate-900',
    accentColor: 'text-pink-600',
    subtextColor: 'text-purple-700',
    icon: '🎉',
    badgeBg: 'bg-pink-100',
    fontFamily: "'Fredoka', sans-serif",
    patternStyle: 'confetti'
  },
  {
    id: 'stars',
    name: '🌟 כוכבי הקסם',
    bgColor: 'from-indigo-900 via-purple-900 to-slate-900',
    cardBg: 'bg-indigo-950',
    borderColor: 'border-amber-400',
    borderColorHex: '#fbbf24',
    textColor: 'text-amber-300',
    accentColor: 'text-amber-400',
    subtextColor: 'text-indigo-200',
    icon: '⭐',
    badgeBg: 'bg-amber-400/20',
    fontFamily: "'Secular One', sans-serif",
    patternStyle: 'stars'
  },
  {
    id: 'safari',
    name: '🌿 ספארי וחיות היער',
    bgColor: 'from-emerald-50 via-amber-50 to-teal-50',
    cardBg: 'bg-emerald-50/60',
    borderColor: 'border-emerald-400',
    borderColorHex: '#34d399',
    textColor: 'text-emerald-950',
    accentColor: 'text-emerald-700',
    subtextColor: 'text-emerald-800',
    icon: '🦁',
    badgeBg: 'bg-emerald-200/60',
    fontFamily: "'Rubik', sans-serif",
    patternStyle: 'stripes'
  },
  {
    id: 'unicorn',
    name: '🦄 חד קרן פסטל חלומי',
    bgColor: 'from-fuchsia-50 via-purple-50 to-indigo-50',
    cardBg: 'bg-white/90',
    borderColor: 'border-purple-300',
    borderColorHex: '#d8b4fe',
    textColor: 'text-purple-950',
    accentColor: 'text-fuchsia-600',
    subtextColor: 'text-purple-700',
    icon: '✨',
    badgeBg: 'bg-fuchsia-100',
    fontFamily: "'Fredoka', sans-serif",
    patternStyle: 'grid'
  },
  {
    id: 'ocean',
    name: '🌊 עולם המצולות וכחול ים',
    bgColor: 'from-sky-100 via-cyan-50 to-blue-100',
    cardBg: 'bg-sky-50/70',
    borderColor: 'border-sky-400',
    borderColorHex: '#38bdf8',
    textColor: 'text-sky-950',
    accentColor: 'text-sky-600',
    subtextColor: 'text-sky-800',
    icon: '🐬',
    badgeBg: 'bg-sky-200/60',
    fontFamily: "'Rubik', sans-serif",
    patternStyle: 'waves'
  },
  {
    id: 'royal',
    name: '👑 נסיכות ונסיכים מוזהב',
    bgColor: 'from-amber-100 via-orange-50 to-yellow-100',
    cardBg: 'bg-amber-50/90',
    borderColor: 'border-amber-500',
    borderColorHex: '#f59e0b',
    textColor: 'text-amber-950',
    accentColor: 'text-amber-700',
    subtextColor: 'text-amber-800',
    icon: '👑',
    badgeBg: 'bg-amber-200/70',
    fontFamily: "'Assistant', sans-serif",
    patternStyle: 'dots'
  },
  {
    id: 'candy',
    name: '🍩 סוכריות ומתוקים',
    bgColor: 'from-pink-100 via-rose-100 to-amber-100',
    cardBg: 'bg-white',
    borderColor: 'border-pink-400',
    borderColorHex: '#f472b6',
    textColor: 'text-pink-950',
    accentColor: 'text-rose-600',
    subtextColor: 'text-pink-800',
    icon: '🎂',
    badgeBg: 'bg-pink-100',
    fontFamily: "'Varela Round', sans-serif",
    patternStyle: 'dots'
  },
  {
    id: 'space',
    name: '🚀 אסטרונאוטים וחלל',
    bgColor: 'from-slate-900 via-blue-950 to-slate-900',
    cardBg: 'bg-slate-900',
    borderColor: 'border-cyan-400',
    borderColorHex: '#22d3ee',
    textColor: 'text-cyan-200',
    accentColor: 'text-cyan-400',
    subtextColor: 'text-blue-300',
    icon: '🚀',
    badgeBg: 'bg-cyan-950/80',
    fontFamily: "'Secular One', sans-serif",
    patternStyle: 'stars'
  },
  {
    id: 'minimal',
    name: '🎨 מינימליסטי נקי ומודרני',
    bgColor: 'from-slate-100 to-slate-200',
    cardBg: 'bg-white',
    borderColor: 'border-slate-300',
    borderColorHex: '#cbd5e1',
    textColor: 'text-slate-800',
    accentColor: 'text-slate-600',
    subtextColor: 'text-slate-500',
    icon: '🎈',
    badgeBg: 'bg-slate-100',
    fontFamily: "'Assistant', sans-serif",
    patternStyle: 'none'
  },
  {
    id: 'spring',
    name: '🌸 אביב ופרחים מלבלבים',
    bgColor: 'from-emerald-50 via-rose-50 to-amber-50',
    cardBg: 'bg-rose-50/50',
    borderColor: 'border-rose-300',
    borderColorHex: '#fda4af',
    textColor: 'text-rose-950',
    accentColor: 'text-rose-600',
    subtextColor: 'text-emerald-800',
    icon: '💖',
    badgeBg: 'bg-rose-100',
    fontFamily: "'Fredoka', sans-serif",
    patternStyle: 'dots'
  },
  {
    id: 'champions',
    name: '🏆 אלופים ומנצחים',
    bgColor: 'from-blue-50 via-amber-50 to-indigo-50',
    cardBg: 'bg-white',
    borderColor: 'border-amber-400',
    borderColorHex: '#f59e0b',
    textColor: 'text-slate-900',
    accentColor: 'text-amber-600',
    subtextColor: 'text-blue-700',
    icon: '🏆',
    badgeBg: 'bg-amber-100',
    fontFamily: "'Rubik', sans-serif",
    patternStyle: 'stripes'
  }
];

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: 'rose',
    name: 'רוז פסטל',
    cardBg: 'bg-rose-50/60',
    borderColor: 'border-rose-300',
    borderColorHex: '#fda4af',
    textColor: 'text-rose-950',
    accentColor: 'text-rose-600',
    subtextColor: 'text-rose-700',
    badgeBg: 'bg-rose-100',
    previewColor: '#fda4af'
  },
  {
    id: 'sky',
    name: 'שמיים וים',
    cardBg: 'bg-sky-50/70',
    borderColor: 'border-sky-300',
    borderColorHex: '#7dd3fc',
    textColor: 'text-sky-950',
    accentColor: 'text-sky-600',
    subtextColor: 'text-sky-700',
    badgeBg: 'bg-sky-100',
    previewColor: '#7dd3fc'
  },
  {
    id: 'gold',
    name: 'שמש וזהב',
    cardBg: 'bg-amber-50/70',
    borderColor: 'border-amber-300',
    borderColorHex: '#fcd34d',
    textColor: 'text-amber-950',
    accentColor: 'text-amber-600',
    subtextColor: 'text-amber-700',
    badgeBg: 'bg-amber-100',
    previewColor: '#fcd34d'
  },
  {
    id: 'mint',
    name: 'יער ומנטה',
    cardBg: 'bg-emerald-50/70',
    borderColor: 'border-emerald-300',
    borderColorHex: '#6ee7b7',
    textColor: 'text-emerald-950',
    accentColor: 'text-emerald-600',
    subtextColor: 'text-emerald-700',
    badgeBg: 'bg-emerald-100',
    previewColor: '#6ee7b7'
  },
  {
    id: 'purple',
    name: 'לבנדר קסום',
    cardBg: 'bg-purple-50/70',
    borderColor: 'border-purple-300',
    borderColorHex: '#d8b4fe',
    textColor: 'text-purple-950',
    accentColor: 'text-purple-600',
    subtextColor: 'text-purple-700',
    badgeBg: 'bg-purple-100',
    previewColor: '#d8b4fe'
  },
  {
    id: 'coral',
    name: 'אלמוג וכתום',
    cardBg: 'bg-orange-50/70',
    borderColor: 'border-orange-400',
    borderColorHex: '#fb923c',
    textColor: 'text-orange-950',
    accentColor: 'text-orange-600',
    subtextColor: 'text-orange-800',
    badgeBg: 'bg-orange-100',
    previewColor: '#fb923c'
  },
  {
    id: 'white',
    name: 'לבן קלאסי',
    cardBg: 'bg-white',
    borderColor: 'border-slate-300',
    borderColorHex: '#cbd5e1',
    textColor: 'text-slate-900',
    accentColor: 'text-slate-700',
    subtextColor: 'text-slate-600',
    badgeBg: 'bg-slate-100',
    previewColor: '#f1f5f9'
  },
  {
    id: 'dark',
    name: 'לילה עמוק',
    cardBg: 'bg-slate-900',
    borderColor: 'border-amber-400',
    borderColorHex: '#fbbf24',
    textColor: 'text-amber-300',
    accentColor: 'text-amber-400',
    subtextColor: 'text-slate-300',
    badgeBg: 'bg-slate-800',
    previewColor: '#0f172a'
  }
];

export const BG_PATTERNS: BackgroundPattern[] = [
  {
    id: 'none',
    name: 'חלק (ללא דוגמה)',
    cssPattern: () => 'none'
  },
  {
    id: 'dots',
    name: 'נקודות עדינות',
    cssPattern: (hex) => `radial-gradient(circle, ${hexToRgba(hex, 0.4)} 1.5px, transparent 1.5px)`
  },
  {
    id: 'grid',
    name: 'רשת משבצות',
    cssPattern: (hex) => `linear-gradient(${hexToRgba(hex, 0.35)} 1px, transparent 1px), linear-gradient(90deg, ${hexToRgba(hex, 0.35)} 1px, transparent 1px)`
  },
  {
    id: 'stripes',
    name: 'פסים אלכסוניים',
    cssPattern: (hex) => `repeating-linear-gradient(45deg, transparent, transparent 10px, ${hexToRgba(hex, 0.3)} 10px, ${hexToRgba(hex, 0.3)} 12px)`
  },
  {
    id: 'confetti',
    name: 'קונפטי חגיגי',
    cssPattern: (hex) => `radial-gradient(circle at 20% 30%, ${hexToRgba(hex, 0.45)} 2px, transparent 2px), radial-gradient(circle at 80% 70%, ${hexToRgba(hex, 0.4)} 2.5px, transparent 2.5px)`
  },
  {
    id: 'stars',
    name: 'כוכבים וניצוצות',
    cssPattern: (hex) => `radial-gradient(circle at 50% 50%, ${hexToRgba(hex, 0.45)} 1.5px, transparent 1.5px), radial-gradient(circle at 20% 80%, ${hexToRgba(hex, 0.35)} 1px, transparent 1px)`
  },
  {
    id: 'waves',
    name: 'גלי ים',
    cssPattern: (hex) => `radial-gradient(circle at 100% 50%, transparent 20%, ${hexToRgba(hex, 0.35)} 21%, ${hexToRgba(hex, 0.35)} 34%, transparent 35%, transparent)`
  }
];

export const GRADIENT_STYLES: GradientStyle[] = [
  { id: 'solid', name: 'אחיד', gradientClass: '' },
  { id: 'subtle_top', name: 'מעבר צבע עדין מלמעלה', gradientClass: 'bg-gradient-to-b from-white/60 to-transparent' },
  { id: 'corner_glow', name: 'הילה בפינות', gradientClass: 'bg-gradient-to-tr from-white/40 via-transparent to-white/40' },
  { id: 'festive_radial', name: 'אור ממרכז הכרטיס', gradientClass: 'bg-gradient-to-r from-transparent via-white/50 to-transparent' }
];

export const FONTS = [
  { id: "'Assistant', sans-serif", name: 'אסיסטנט (נקי ואלגנטי)' },
  { id: "'Rubik', sans-serif", name: 'רוביק (מודרני וברור)' },
  { id: "'Fredoka', sans-serif", name: 'פרדוקה (שובב ועגול)' },
  { id: "'Secular One', sans-serif", name: 'סקיולר (חזק ובולט)' },
  { id: "'Varela Round', sans-serif", name: 'ורלה ראונד (נעים ורך)' },
  { id: "'Heebo', sans-serif", name: 'היבו (קלאסי ומדויק)' }
];

export const ICONS = ['🎈', '🎂', '👑', '🎁', '⭐', '✨', '🦁', '💖', '🎉', '🦄', '🍩', '🏆'];

// Kindergarten Table Templates
export const TABLE_TEMPLATES: TableTemplate[] = [
  {
    id: 'wipes_hebrew',
    name: '📦 מעקב ציוד ומגבונים (חודשים עבריים)',
    title: 'טבלת מעקב ציוד ומגבונים לשנת הלימודים',
    subtitle: 'גן ילדים • מעקב חודשי',
    columns: ['תשרי', 'חשוון', 'כסלו', 'טבת', 'שבט', 'אדר', 'ניסן', 'אייר', 'סיוון', 'תמוז', 'אב', 'אלול'],
    orientation: 'landscape',
    description: 'מעקב חודשי שוטף לחלוקת או הבאת מגבונים וציוד לפי לוח השנה העברי'
  },
  {
    id: 'wipes_gregorian',
    name: '📅 מעקב ציוד ומגבונים (ספטמבר - אוגוסט)',
    title: 'טבלת מעקב מגבונים וציוד אישי',
    subtitle: 'שנת הלימודים • מעקב שוטף',
    columns: ['ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר', 'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט'],
    orientation: 'landscape',
    description: 'חלוקה לפי 12 חודשי השנה הלועזית מתחילת השנה ועד לחופש הגדול'
  },
  {
    id: 'shabbat_duty',
    name: '🕯️ תורנות אמא ואבא שבת',
    title: 'לוח תורנות אמא ואבא שבת',
    subtitle: 'קבלת שבת חגיגית בגן',
    columns: ['תאריך / פרשה', 'אמא שבת', 'אבא שבת', 'כיבוד והפתעות', 'חתימת הורים / הערות'],
    orientation: 'portrait',
    description: 'טבלת תורנות שבת מעוצבת לתלייה על לוח המודעות בגן'
  },
  {
    id: 'custom',
    name: '✏️ טבלת מעקב מותאמת אישית',
    title: 'טבלת מעקב ופעילות בגן',
    subtitle: 'רשימת ילדים ומעקב שוטף',
    columns: ['אישור יציאה', 'תשלום סל תרבות', 'בדיקת ראייה/שמיעה', 'הערות מיוחדות'],
    orientation: 'portrait',
    description: 'התאמה אישית מלאה של שמות העמודות, כותרות והערות'
  }
];

export const TABLE_DESIGN_THEMES: TableDesignTheme[] = [
  {
    id: 'rainbow',
    name: '🎨 פסטל צבעוני לגן',
    headerBg: 'bg-rose-500 text-white',
    headerText: 'text-white',
    borderColor: 'border-rose-200',
    borderHex: '#fda4af',
    altRowBg: 'bg-rose-50/30',
    accentBadge: 'bg-rose-100 text-rose-800',
    frameBorderClass: 'border-4 border-dashed border-rose-300'
  },
  {
    id: 'sky',
    name: '🌤️ תכלת ושמיים',
    headerBg: 'bg-sky-600 text-white',
    headerText: 'text-white',
    borderColor: 'border-sky-200',
    borderHex: '#7dd3fc',
    altRowBg: 'bg-sky-50/30',
    accentBadge: 'bg-sky-100 text-sky-800',
    frameBorderClass: 'border-4 border-dashed border-sky-300'
  },
  {
    id: 'mint',
    name: '🌿 ירוק מנטה וטבע',
    headerBg: 'bg-emerald-600 text-white',
    headerText: 'text-white',
    borderColor: 'border-emerald-200',
    borderHex: '#6ee7b7',
    altRowBg: 'bg-emerald-50/30',
    accentBadge: 'bg-emerald-100 text-emerald-800',
    frameBorderClass: 'border-4 border-dashed border-emerald-300'
  },
  {
    id: 'amber',
    name: '☀️ שמש וצהוב חם',
    headerBg: 'bg-amber-500 text-white',
    headerText: 'text-white',
    borderColor: 'border-amber-200',
    borderHex: '#fcd34d',
    altRowBg: 'bg-amber-50/30',
    accentBadge: 'bg-amber-100 text-amber-800',
    frameBorderClass: 'border-4 border-dashed border-amber-300'
  },
  {
    id: 'classic',
    name: '🖨️ שחור-לבן קלאסי (חסכוני בדיו)',
    headerBg: 'bg-slate-800 text-white',
    headerText: 'text-white',
    borderColor: 'border-slate-300',
    borderHex: '#cbd5e1',
    altRowBg: 'bg-slate-50',
    accentBadge: 'bg-slate-200 text-slate-800',
    frameBorderClass: 'border-2 border-solid border-slate-400'
  }
];
