import React, { useState, useRef, useMemo, useCallback } from 'react';
import {
  Printer,
  Download,
  Scissors,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  Sliders,
  Check,
  Search,
  Scale,
  Smile,
  Layers,
  HelpCircle,
  Lightbulb,
  BookOpen,
  ArrowRight,
  Shuffle,
  Grid2X2,
  Grid3X3,
  Bookmark,
  Award,
  Volume2
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';

import {
  AnimalItem,
  AnimalWorksheetColorMode,
  AnimalCardsPerSheet,
  AnimalCardBgStyle,
  AnimalCutLinesStyle
} from '../types';
import { ANIMALS_DATABASE, DEFAULT_SELECTED_ANIMAL_IDS } from '../data/animals';
import { AnimalIllustration } from './AnimalIllustration';
import {
  trackAnimalColorModeChange,
  trackAnimalCardsPerSheetChange,
  trackAnimalPrintTarget,
  trackAnimalPDFDownload,
  trackEvent
} from '../analytics';

// Audio feedback helper using Web Audio API (no external asset needed)
const playChime = (type: 'success' | 'click' | 'victory') => {
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'success') {
      const notes = [523.25, 659.25]; // C5, E5
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.25);
      });
    } else if (type === 'victory') {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 0.35);
      });
    }
  } catch {
    // Graceful fallback if Web Audio is muted/blocked
  }
};

interface AnimalSortingViewProps {
  onBackToTags?: () => void;
}

export const AnimalSortingView: React.FC<AnimalSortingViewProps> = () => {
  // 1. Core Magnetic Kit Options
  const [cardsPerSheet, setCardsPerSheet] = useState<AnimalCardsPerSheet>(4); // 4 = Extra Large 2x2, 6 = Medium-Large 2x3
  const [selectedAnimalIds, setSelectedAnimalIds] = useState<string[]>(DEFAULT_SELECTED_ANIMAL_IDS);
  const [colorMode, setColorMode] = useState<AnimalWorksheetColorMode>('color');
  const [cardBgStyle, setCardBgStyle] = useState<AnimalCardBgStyle>('clean_white');
  const [cutLinesStyle, setCutLinesStyle] = useState<AnimalCutLinesStyle>('dashed');
  const [showLegsHint, setShowLegsHint] = useState<boolean>(false); // False by default so kids count legs themselves!

  // 2. Titles & Kindergarten Customization
  const [kitTitle, setKitTitle] = useState<string>('ערכת משחק מגנטי: מיון חיות לפי רגליים');
  const [kindergartenName, setKindergartenName] = useState<string>('גן הילדים');
  const [showKindergartenName, setShowKindergartenName] = useState<boolean>(true);

  // 3. Tab and Preview Modes
  // 'headers' = Category Header signs only
  // 'cards' = Picture cards pages only
  // 'both' = Complete kit (Headers + Cards)
  // 'interactive' = Live digital magnetic board on screen!
  const [activeTab, setActiveTab] = useState<'both' | 'headers' | 'cards' | 'interactive'>('both');
  const [previewZoom, setPreviewZoom] = useState<number>(85); // 85%
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // 4. Animal Bank Search & Filter
  const [animalSearch, setAnimalSearch] = useState<string>('');
  const [animalLegFilter, setAnimalLegFilter] = useState<'all' | '2' | '4'>('all');

  // 5. Interactive Digital Magnetic Board State
  const [digitalPlacements, setDigitalPlacements] = useState<Record<string, 2 | 4>>({});
  const [interactiveSelectedAnimal, setInteractiveSelectedAnimal] = useState<string | null>(null);
  const [interactiveFeedback, setInteractiveFeedback] = useState<string | null>(null);

  // 6. Export and Print State
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<string>('');
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [printScope, setPrintScope] = useState<'all' | 'headers' | 'cards'>('all');

  // Printable Pages DOM Refs
  const headersSheetRef = useRef<HTMLDivElement>(null);
  const cardsPagesContainerRef = useRef<HTMLDivElement>(null);

  // Database queries
  const twoLeggedAnimals = useMemo(() => ANIMALS_DATABASE.filter((a) => a.legs === 2), []);
  const fourLeggedAnimals = useMemo(() => ANIMALS_DATABASE.filter((a) => a.legs === 4), []);

  // Filtered animals in catalog
  const filteredCatalogAnimals = useMemo(() => {
    return ANIMALS_DATABASE.filter((a) => {
      const matchesSearch = a.name.includes(animalSearch) || a.nameNikud.includes(animalSearch) || a.categoryLabel.includes(animalSearch);
      const matchesLegs = animalLegFilter === 'all' || a.legs === Number(animalLegFilter);
      return matchesSearch && matchesLegs;
    });
  }, [animalSearch, animalLegFilter]);

  // Selected animals list
  const selectedAnimals = useMemo(() => {
    return ANIMALS_DATABASE.filter((a) => selectedAnimalIds.includes(a.id));
  }, [selectedAnimalIds]);

  // Balance breakdown
  const balanceInfo = useMemo(() => {
    const twoCount = selectedAnimals.filter((a) => a.legs === 2).length;
    const fourCount = selectedAnimals.filter((a) => a.legs === 4).length;
    const total = selectedAnimals.length;
    const isBalanced = twoCount === fourCount && total > 0;
    return { twoCount, fourCount, total, isBalanced };
  }, [selectedAnimals]);

  // Chunk selected animals into pages based on cardsPerSheet
  const cardPages = useMemo(() => {
    const pages: AnimalItem[][] = [];
    for (let i = 0; i < selectedAnimals.length; i += cardsPerSheet) {
      pages.push(selectedAnimals.slice(i, i + cardsPerSheet));
    }
    return pages;
  }, [selectedAnimals, cardsPerSheet]);

  const totalA4Pages = useMemo(() => {
    return 1 + cardPages.length; // 1 page of headers + N pages of cards
  }, [cardPages.length]);

  // Animal selection helpers
  const handleToggleAnimal = (id: string) => {
    playChime('click');
    setSelectedAnimalIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = () => {
    playChime('click');
    setSelectedAnimalIds(ANIMALS_DATABASE.map((a) => a.id));
  };

  const handleSelectBalanced = () => {
    playChime('click');
    // 5 of 2-legs, 5 of 4-legs (10 total)
    const fiveTwo = twoLeggedAnimals.slice(0, 5).map((a) => a.id);
    const fiveFour = fourLeggedAnimals.slice(0, 5).map((a) => a.id);
    setSelectedAnimalIds([...fiveTwo, ...fiveFour]);
  };

  const handleSelectOnlyTwo = () => {
    playChime('click');
    setSelectedAnimalIds(twoLeggedAnimals.map((a) => a.id));
  };

  const handleSelectOnlyFour = () => {
    playChime('click');
    setSelectedAnimalIds(fourLeggedAnimals.map((a) => a.id));
  };

  const handleClearSelection = () => {
    playChime('click');
    setSelectedAnimalIds([]);
    setDigitalPlacements({});
  };

  // Interactive Digital Board Handlers
  const handleAssignInteractive = (animalId: string, legs: 2 | 4) => {
    playChime('click');
    setDigitalPlacements((prev) => ({
      ...prev,
      [animalId]: legs
    }));
    setInteractiveSelectedAnimal(null);
    setInteractiveFeedback(null);
  };

  const handleRemoveInteractive = (animalId: string) => {
    playChime('click');
    setDigitalPlacements((prev) => {
      const next = { ...prev };
      delete next[animalId];
      return next;
    });
    setInteractiveFeedback(null);
  };

  const handleCheckInteractive = () => {
    if (selectedAnimals.length === 0) return;

    let correctCount = 0;
    let mistakes = 0;

    selectedAnimals.forEach((animal) => {
      const placed = digitalPlacements[animal.id];
      if (placed === animal.legs) {
        correctCount++;
      } else if (placed !== undefined) {
        mistakes++;
      }
    });

    const unplaced = selectedAnimals.length - Object.keys(digitalPlacements).length;

    if (correctCount === selectedAnimals.length) {
      playChime('victory');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setInteractiveFeedback(`🎉 כל הכבוד! כל ${correctCount} החיות מוינו בדיוק מושלם ל-2 או 4 רגליים!`);
    } else if (mistakes === 0 && unplaced > 0) {
      playChime('success');
      setInteractiveFeedback(`👍 מצוין עד כה! נשארו עוד ${unplaced} חיות למיון.`);
    } else {
      playChime('click');
      setInteractiveFeedback(`💡 יש ${mistakes} חיות שצריך לספור להן רגליים שוב. נסו שוב!`);
    }
  };

  const handleResetInteractive = () => {
    playChime('click');
    setDigitalPlacements({});
    setInteractiveSelectedAnimal(null);
    setInteractiveFeedback(null);
  };

  // Direct Browser Print with Target Specification
  const handlePrint = (target: 'all' | 'headers' | 'cards') => {
    setPrintScope(target);
    trackAnimalPrintTarget(target);
    // Give state a brief tick to apply visibility classes before browser print dialog
    setTimeout(() => {
      window.print();
    }, 150);
  };

  // High-Resolution PDF Download
  const handleDownloadPDF = async (target: 'all' | 'headers' | 'cards') => {
    setIsExporting(true);
    setExportError(null);
    setExportSuccess(false);
    trackAnimalPDFDownload(target, colorMode, selectedAnimals.length);

    try {
      setExportProgress('מכין את דפי ה-PDF ברזולוציה גבוהה...');
      const pdf = new jsPDF('portrait', 'mm', 'a4');
      let pageIndex = 0;

      // 1. Export Headers Sheet if requested
      if ((target === 'all' || target === 'headers') && headersSheetRef.current) {
        setExportProgress('מעבד את שלטי הכותרת ללוח המגנטי...');
        const canvas = await html2canvas(headersSheetRef.current, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        });
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
        pageIndex++;
      }

      // 2. Export Cards Sheets if requested
      if ((target === 'all' || target === 'cards') && cardsPagesContainerRef.current) {
        const pageElements = cardsPagesContainerRef.current.querySelectorAll('.animal-card-page-element');
        for (let i = 0; i < pageElements.length; i++) {
          setExportProgress(`מעבד דף כרטיסיות ${i + 1} מתוך ${pageElements.length}...`);
          if (pageIndex > 0) {
            pdf.addPage('a4', 'portrait');
          }
          const canvas = await html2canvas(pageElements[i] as HTMLElement, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
          });
          const imgData = canvas.toDataURL('image/jpeg', 0.95);
          pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
          pageIndex++;
        }
      }

      setExportProgress('שומר את קובץ ה-PDF...');
      pdf.save(`animal-magnetic-sorting-kit-${target}.pdf`);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 5000);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      setExportError('אירעה שגיאה ביצירת קובץ ה-PDF. ניתן להשתמש בכפתור ההדפסה הישירה של הדפדפן.');
    } finally {
      setIsExporting(false);
      setExportProgress('');
    }
  };

  // Card Background CSS class helper
  const getCardBgClass = useCallback(
    (legs: 2 | 4) => {
      if (colorMode === 'coloring_book') return 'bg-white border-slate-800';
      if (cardBgStyle === 'clean_white') return 'bg-white border-slate-300';
      if (cardBgStyle === 'pastel_tint') {
        return legs === 2
          ? 'bg-gradient-to-b from-sky-50 to-blue-50/60 border-sky-300'
          : 'bg-gradient-to-b from-emerald-50 to-teal-50/60 border-emerald-300';
      }
      // Vibrant border
      return legs === 2
        ? 'bg-white border-blue-500 border-4'
        : 'bg-white border-emerald-500 border-4';
    },
    [colorMode, cardBgStyle]
  );

  return (
    <div className="w-full pb-16 font-sans select-none" dir="rtl">
      {/* =========================================================================
          HERO & HEADER BANNER
      ========================================================================= */}
      <section className="no-print bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 rounded-2xl p-5 sm:p-6 text-white shadow-md mb-6 relative overflow-hidden">
        <div className="absolute -left-10 -bottom-10 opacity-15 pointer-events-none text-9xl">
          🐾
        </div>
        <div className="absolute -right-10 -top-10 opacity-15 pointer-events-none text-9xl">
          👣
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>ערכת איורים מקצועית למשחק פרונטלי בגן</span>
              <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-1.5 py-0.5 rounded-full">
                לוח מגנטי
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-xs">
              ערכת משחק מגנטי: מיון חיות לפי רגליים (2 מול 4)
            </h1>
            <p className="text-sm sm:text-base text-white/90 max-w-2xl font-medium">
              הדפסת כרטיסיות ענק ושלטי כותרת מותאמים ללוח מגנטי. גוזרים, מניילנים, מצמידים מגנט – ומשחקים יחד במפגש הגן!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsGuideOpen(!isGuideOpen)}
              className="px-3.5 py-2 bg-white/15 hover:bg-white/25 backdrop-blur-md text-white text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs border border-white/20"
            >
              <Lightbulb className="w-4 h-4 text-amber-300" />
              <span>מדריך הכנה וטיפים לגננת</span>
            </button>
          </div>
        </div>

        {/* Quick Preparation Steps Bar */}
        <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold text-white/95">
          <div className="flex items-center gap-2 bg-white/10 px-2.5 py-1.5 rounded-lg">
            <span className="w-5 h-5 rounded-full bg-white text-rose-600 flex items-center justify-center text-[11px] font-black shrink-0">1</span>
            <span>מדפיסים על דפי A4</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-2.5 py-1.5 rounded-lg">
            <span className="w-5 h-5 rounded-full bg-white text-rose-600 flex items-center justify-center text-[11px] font-black shrink-0">2</span>
            <span>מניילנים בלמינציה</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-2.5 py-1.5 rounded-lg">
            <span className="w-5 h-5 rounded-full bg-white text-rose-600 flex items-center justify-center text-[11px] font-black shrink-0">3</span>
            <span>גוזרים לפי הקווים</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-2.5 py-1.5 rounded-lg">
            <span className="w-5 h-5 rounded-full bg-white text-rose-600 flex items-center justify-center text-[11px] font-black shrink-0">4</span>
            <span>מדביקים מגנט ומשחקים!</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          PREPARATION GUIDE & TEACHER TIPS COLLAPSIBLE
      ========================================================================= */}
      {isGuideOpen && (
        <section className="no-print bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 mb-6 text-slate-800 shadow-sm animate-fadeIn">
          <div className="flex items-center justify-between mb-3 border-b border-amber-200 pb-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-700" />
              <h3 className="font-black text-amber-900 text-lg">
                מדריך הכנה והפעלת הילדים במפגש הבוקר
              </h3>
            </div>
            <button
              onClick={() => setIsGuideOpen(false)}
              className="text-xs text-amber-800 hover:text-amber-950 font-bold underline"
            >
              סגור מדריך
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs space-y-2">
              <h4 className="font-black text-rose-700 flex items-center gap-1.5">
                <Scissors className="w-4 h-4" />
                <span>איך להכין את הערכה המגנטית שתחזיק שנים:</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                <li><strong>הדפסה:</strong> מומלץ להדפיס על נייר עבה (160 עד 200 גרם) או בריסטול לבן.</li>
                <li><strong>למינציה:</strong> ניילון הכרטיסיות מגן עליהן מקריעה, שומן ומים ומעניק מראה קשיח ומקצועי.</li>
                <li><strong>פס מגנטי:</strong> רכשו פס מגנטי דביק (מדבקה מאחור) בחנות יצירה, גזרו פיסות של 2-3 ס"מ והדביקו בגב כל כרטיסיה ושלט.</li>
                <li><strong>אחסון:</strong> שומרים בקופסה ייעודית עם תווית "מיון חיות - 2 מול 4" בפינת הטבע/מדע בגן.</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs space-y-2">
              <h4 className="font-black text-indigo-700 flex items-center gap-1.5">
                <Smile className="w-4 h-4" />
                <span>רעיונות לפעילויות מרתקות במפגש:</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                <li><strong>"הבלש סופר הרגליים":</strong> מחלקים כרטיסיה לילד/ה, הילד ניגש ללוח, סופר יחד עם כל הגן את הרגליים ומדביק תחת השלט הנכון.</li>
                <li><strong>"חיקוי בתנועה":</strong> הילדים מחקים את הליכת החיה (קפיצה על שתיים כמו קנגורו, צעידה על ארבע כמו פיל).</li>
                <li><strong>"מי החיה המוזרה?":</strong> האם ציפור היא על שתיים? למה לפרה יש פרסות? למה לברווז יש קרומי שחייה? שיח מעשיר על חיות ומאפייניהן!</li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          MAIN ACTION & PRINT BAR (STICKY NO-PRINT)
      ========================================================================= */}
      <div className="no-print bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-md mb-6 flex flex-wrap items-center justify-between gap-3">
        {/* Navigation Tabs between Preview Modes */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs sm:text-sm font-bold overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('both')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'both' ? 'bg-white text-rose-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>כל הערכה ({totalA4Pages} דפי A4)</span>
          </button>

          <button
            onClick={() => setActiveTab('headers')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'headers' ? 'bg-white text-rose-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>שלטי כותרת ללוח</span>
          </button>

          <button
            onClick={() => setActiveTab('cards')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'cards' ? 'bg-white text-rose-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Grid2X2 className="w-3.5 h-3.5" />
            <span>כרטיסיות החיות ({cardPages.length} דפים)</span>
          </button>

          <button
            onClick={() => setActiveTab('interactive')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'interactive'
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-xs'
                : 'text-amber-800 hover:text-amber-900 bg-amber-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>לוח מגנטי חי על המסך! 🎮</span>
          </button>
        </div>

        {/* Print & PDF Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handlePrint('headers')}
            className="px-2.5 sm:px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            title="מדפיס רק את דף שלטי הכותרת לראש הלוח"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>הדפס שלטים</span>
          </button>

          <button
            onClick={() => handlePrint('cards')}
            className="px-2.5 sm:px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            title="מדפיס רק את דפי כרטיסיות החיות שנבחרו"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>הדפס כרטיסיות</span>
          </button>

          <button
            onClick={() => handlePrint('all')}
            className="px-3 sm:px-3.5 py-1.5 text-xs sm:text-sm font-black text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition-all flex items-center gap-1.5"
            title="מדפיס את כל הערכה: שלטים + כל כרטיסיות החיות"
          >
            <Printer className="w-4 h-4" />
            <span>הדפס ערכה מלאה</span>
          </button>

          <button
            onClick={() => handleDownloadPDF(activeTab === 'both' ? 'all' : activeTab === 'headers' ? 'headers' : 'cards')}
            disabled={isExporting}
            className="px-3 sm:px-3.5 py-1.5 text-xs sm:text-sm font-black text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-lg shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{exportProgress || 'מעבד PDF...'}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>הורד PDF איכותי</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {exportSuccess && (
        <div className="no-print bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-center text-sm font-bold flex items-center justify-center gap-2 shadow-md mb-6 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5" />
          <span>קובץ ה-PDF של ערכת המשחק המגנטי נוצר בהצלחה באיכות הדפסה גבוהה! 🎉</span>
        </div>
      )}

      {exportError && (
        <div className="no-print bg-rose-600 text-white px-4 py-3 rounded-xl text-center text-sm font-semibold flex items-center justify-between gap-3 shadow-md mb-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{exportError}</span>
          </div>
          <button
            onClick={() => window.print()}
            className="px-3 py-1 bg-white text-rose-700 font-bold rounded-lg text-xs hover:bg-rose-50"
          >
            הדפס ישירות
          </button>
        </div>
      )}

      {/* =========================================================================
          MAIN WORKSPACE LAYOUT (2-COLUMN: CONTROLS & PREVIEW)
      ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* =====================================================================
            LEFT/RIGHT SIDEBAR: CUSTOMIZATION & ANIMAL SELECTION (lg:col-span-4)
        ===================================================================== */}
        <aside className="no-print lg:col-span-4 space-y-5">
          {/* 1. Card Size Selector (4 vs 6 per page) */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <Grid2X2 className="w-4 h-4 text-rose-500" />
                <span>גודל כרטיסיות להדפסה (בדף A4)</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  trackAnimalCardsPerSheetChange(4);
                  setCardsPerSheet(4);
                }}
                className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between ${
                  cardsPerSheet === 4
                    ? 'border-rose-500 bg-rose-50/70 text-rose-950 font-bold shadow-xs ring-2 ring-rose-400/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-sm font-black">גדול מאוד (4 בדף)</span>
                  {cardsPerSheet === 4 && <Check className="w-4 h-4 text-rose-600" />}
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  כ-9.5 ס"מ. רשת 2x2 ענקית ובולטת מרחוק למפגש פרונטלי על הלוח!
                </p>
                <span className="mt-2 inline-block text-[10px] font-black bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded-md self-start">
                  מומלץ לגן
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  trackAnimalCardsPerSheetChange(6);
                  setCardsPerSheet(6);
                }}
                className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between ${
                  cardsPerSheet === 6
                    ? 'border-rose-500 bg-rose-50/70 text-rose-950 font-bold shadow-xs ring-2 ring-rose-400/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-sm font-black">בינוני (6 בדף)</span>
                  {cardsPerSheet === 6 && <Check className="w-4 h-4 text-rose-600" />}
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  כ-8 ס"מ. רשת 2x3. מומלץ לקבוצות קטנות או לוחות מגנטיים אישיים.
                </p>
                <span className="mt-2 inline-block text-[10px] font-black bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-md self-start">
                  חסכוני בדפים
                </span>
              </button>
            </div>
          </div>

          {/* 2. Visual Style & Color Options */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-indigo-500" />
              <span>התאמת עיצוב הכרטיסיות</span>
            </h3>

            {/* Color Mode */}
            <div>
              <label className="text-[11px] font-bold text-slate-600 mb-1.5 block">מצב צבעוניות:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    trackAnimalColorModeChange('color');
                    setColorMode('color');
                  }}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-1.5 ${
                    colorMode === 'color'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-xs ring-1 ring-indigo-500'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-sm">🎨</span>
                  <span>צבעוני עשיר ומלא</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    trackAnimalColorModeChange('coloring_book');
                    setColorMode('coloring_book');
                  }}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-1.5 ${
                    colorMode === 'coloring_book'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-xs ring-1 ring-indigo-500'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-sm">✏️</span>
                  <span>שחור-לבן לצביעה</span>
                </button>
              </div>
            </div>

            {/* Card Background Style */}
            <div>
              <label className="text-[11px] font-bold text-slate-600 mb-1.5 block">סגנון רקע כרטיסיה:</label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setCardBgStyle('clean_white')}
                  className={`py-1.5 px-2 text-[11px] font-bold rounded-lg border text-center transition-all ${
                    cardBgStyle === 'clean_white'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  לבן נקי
                </button>
                <button
                  type="button"
                  onClick={() => setCardBgStyle('pastel_tint')}
                  className={`py-1.5 px-2 text-[11px] font-bold rounded-lg border text-center transition-all ${
                    cardBgStyle === 'pastel_tint'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  פסטל רך
                </button>
                <button
                  type="button"
                  onClick={() => setCardBgStyle('vibrant_border')}
                  className={`py-1.5 px-2 text-[11px] font-bold rounded-lg border text-center transition-all ${
                    cardBgStyle === 'vibrant_border'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  מסגרת עבה
                </button>
              </div>
            </div>

            {/* Cut Lines Style */}
            <div>
              <label className="text-[11px] font-bold text-slate-600 mb-1.5 block">קווי חיתוך וגזירה:</label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setCutLinesStyle('dashed')}
                  className={`py-1.5 px-2 text-[11px] font-bold rounded-lg border text-center transition-all ${
                    cutLinesStyle === 'dashed'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  ✂️ מקווקו
                </button>
                <button
                  type="button"
                  onClick={() => setCutLinesStyle('crop_marks')}
                  className={`py-1.5 px-2 text-[11px] font-bold rounded-lg border text-center transition-all ${
                    cutLinesStyle === 'crop_marks'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  ⌜ ⌝ פינות חיתוך
                </button>
                <button
                  type="button"
                  onClick={() => setCutLinesStyle('solid')}
                  className={`py-1.5 px-2 text-[11px] font-bold rounded-lg border text-center transition-all ${
                    cutLinesStyle === 'solid'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  מסגרת רגילה
                </button>
              </div>
            </div>

            {/* Toggle Legs Hint (👣 / 🐾) */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-slate-800 block">
                  רמז סמל רגליים בפינה (👣 / 🐾)
                </label>
                <span className="text-[11px] text-slate-500">
                  {showLegsHint ? 'מוצג רמז בפינה' : 'מוסתר – הילדים סופרים בעצמם! (מומלץ)'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={showLegsHint}
                onChange={(e) => setShowLegsHint(e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded-md focus:ring-rose-500 cursor-pointer"
              />
            </div>
          </div>

          {/* 3. Animal Selection Bank (Checklist & Quick Buttons) */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>בנק החיות לבחירה ({ANIMALS_DATABASE.length} זמינות)</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  סמנו אילו חיות יופיעו בערכה להדפסה
                </p>
              </div>
            </div>

            {/* Balance Status Banner */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">{balanceInfo.total} חיות נבחרו:</span>
                <span className="text-sky-700 font-bold bg-sky-100 px-1.5 py-0.5 rounded-md">
                  👣 {balanceInfo.twoCount} על שתיים
                </span>
                <span className="text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded-md">
                  🐾 {balanceInfo.fourCount} על ארבע
                </span>
              </div>
              {balanceInfo.isBalanced && (
                <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full">
                  מאוזן 50:50!
                </span>
              )}
            </div>

            {/* Quick Selection Buttons */}
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={handleSelectBalanced}
                className="px-2 py-1 text-[11px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-lg transition-colors flex items-center gap-1"
                title="בוחר 5 חיות של 2 רגליים ו-5 חיות של 4 רגליים (10 סה״כ)"
              >
                <Scale className="w-3 h-3 text-rose-600" />
                <span>בחירה מאוזנת (5 מכל סוג)</span>
              </button>

              <button
                type="button"
                onClick={handleSelectAll}
                className="px-2 py-1 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
              >
                בחר הכל ({ANIMALS_DATABASE.length})
              </button>

              <button
                type="button"
                onClick={handleSelectOnlyTwo}
                className="px-2 py-1 text-[11px] font-bold bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-lg transition-colors"
              >
                רק 2 רגליים ({twoLeggedAnimals.length})
              </button>

              <button
                type="button"
                onClick={handleSelectOnlyFour}
                className="px-2 py-1 text-[11px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg transition-colors"
              >
                רק 4 רגליים ({fourLeggedAnimals.length})
              </button>

              <button
                type="button"
                onClick={handleClearSelection}
                className="px-2 py-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 rounded-lg transition-colors"
              >
                נקה הכל
              </button>
            </div>

            {/* Search & Filter */}
            <div className="flex items-center gap-1.5">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={animalSearch}
                  onChange={(e) => setAnimalSearch(e.target.value)}
                  placeholder="חיפוש חיה לפי שם..."
                  className="w-full pr-8 pl-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setAnimalLegFilter('all')}
                  className={`px-2 py-1 rounded-md ${
                    animalLegFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  הכל
                </button>
                <button
                  type="button"
                  onClick={() => setAnimalLegFilter('2')}
                  className={`px-2 py-1 rounded-md ${
                    animalLegFilter === '2' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  2
                </button>
                <button
                  type="button"
                  onClick={() => setAnimalLegFilter('4')}
                  className={`px-2 py-1 rounded-md ${
                    animalLegFilter === '4' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  4
                </button>
              </div>
            </div>

            {/* Scrollable Animal Checklist */}
            <div className="max-h-64 overflow-y-auto space-y-1.5 pr-0.5">
              {filteredCatalogAnimals.map((animal) => {
                const isSelected = selectedAnimalIds.includes(animal.id);
                return (
                  <div
                    key={animal.id}
                    onClick={() => handleToggleAnimal(animal.id)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? animal.legs === 2
                          ? 'border-sky-400 bg-sky-50/70 text-slate-900'
                          : 'border-emerald-400 bg-emerald-50/70 text-slate-900'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 opacity-70'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}} // handled by parent onClick
                        className="w-4 h-4 text-rose-600 rounded-md focus:ring-rose-500 cursor-pointer pointer-events-none"
                      />
                      <div className="w-8 h-8 rounded-lg bg-white p-0.5 border border-slate-200 shadow-2xs shrink-0 flex items-center justify-center">
                        <AnimalIllustration animalId={animal.id} mode={colorMode} />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-sm">{animal.nameNikud}</span>
                          <span className="text-xs text-slate-400">({animal.name})</span>
                        </div>
                        <span className="text-[10px] text-slate-500 block">{animal.description}</span>
                      </div>
                    </div>

                    <div className="text-left shrink-0">
                      <span
                        className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                          animal.legs === 2
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {animal.legs === 2 ? '👣 2 רגליים' : '🐾 4 רגליים'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* =====================================================================
            RIGHT/MAIN VIEW: PREVIEW OF A4 SHEETS & INTERACTIVE BOARD (lg:col-span-8)
        ===================================================================== */}
        <main className="lg:col-span-8 space-y-6">
          {/* Zoom and Preview Summary Bar */}
          <div className="no-print bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-600 font-semibold">
              <Eye className="w-4 h-4 text-slate-500" />
              <span>תצוגה מקדימה מדויקת לדף A4 להדפסה</span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-800 font-bold">
                {activeTab === 'interactive'
                  ? 'מצב לוח מגנטי דיגיטלי'
                  : activeTab === 'headers'
                  ? 'דף שלטי כותרת (1 דף)'
                  : activeTab === 'cards'
                  ? `דפי כרטיסיות (${cardPages.length} דפים)`
                  : `כל הערכה (${totalA4Pages} דפי A4)`}
              </span>
            </div>

            {activeTab !== 'interactive' && (
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">זום:</span>
                <button
                  type="button"
                  onClick={() => setPreviewZoom((z) => Math.max(50, z - 10))}
                  className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 font-bold flex items-center justify-center text-slate-700"
                >
                  -
                </button>
                <span className="font-bold text-slate-800 w-8 text-center">{previewZoom}%</span>
                <button
                  type="button"
                  onClick={() => setPreviewZoom((z) => Math.min(100, z + 10))}
                  className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 font-bold flex items-center justify-center text-slate-700"
                >
                  +
                </button>
              </div>
            )}
          </div>

          {/* ===================================================================
              INTERACTIVE DIGITAL MAGNETIC BOARD (TAB = 'interactive')
          =================================================================== */}
          {activeTab === 'interactive' && (
            <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border-4 border-slate-700 relative overflow-hidden animate-fadeIn">
              {/* Whiteboard Metal Trim & Header */}
              <div className="flex items-center justify-between border-b border-slate-700 pb-4 mb-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-rose-500/30 text-rose-300 text-xs font-bold rounded-full mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>לוח מגנטי אינטראקטיבי פעיל לגן ולבית</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    משחק מיון חיות: על שתיים או על ארבע?
                  </h2>
                  <p className="text-xs text-slate-400">
                    הקליקו על חיה ממגש הכרטיסיות בתחתית, והקליקו על העמודה המתאימה בלוח!
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCheckInteractive}
                    className="px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-1.5"
                  >
                    <Award className="w-4 h-4" />
                    <span>בדיקת מיון!</span>
                  </button>
                  <button
                    onClick={handleResetInteractive}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
                    title="נקה לוח והתחל מחדש"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Feedback Alert */}
              {interactiveFeedback && (
                <div className="mb-4 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-center text-sm font-bold animate-fadeIn">
                  {interactiveFeedback}
                </div>
              )}

              {/* 2 Main Columns on Whiteboard */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                {/* Column 1: 2 LEGS */}
                <div
                  onClick={() => {
                    if (interactiveSelectedAnimal) {
                      handleAssignInteractive(interactiveSelectedAnimal, 2);
                    }
                  }}
                  className={`bg-slate-800/80 rounded-2xl p-4 border-2 transition-all min-h-[300px] flex flex-col ${
                    interactiveSelectedAnimal ? 'border-sky-400 ring-2 ring-sky-400/40 cursor-pointer' : 'border-slate-700'
                  }`}
                >
                  <div className="bg-sky-600 text-white p-3 rounded-xl mb-3 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">👣</span>
                      <div>
                        <h3 className="font-black text-base">הוֹלְכִים עַל שְׁתַּיִם</h3>
                        <span className="text-[10px] text-sky-100">עופות וחיות על 2 רגליים</span>
                      </div>
                    </div>
                    <span className="text-xs font-black bg-sky-900/60 px-2 py-0.5 rounded-full">
                      {selectedAnimals.filter((a) => digitalPlacements[a.id] === 2).length} חיות
                    </span>
                  </div>

                  {/* Placed Animals Grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 flex-1 content-start">
                    {selectedAnimals
                      .filter((a) => digitalPlacements[a.id] === 2)
                      .map((animal) => (
                        <div
                          key={animal.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveInteractive(animal.id);
                          }}
                          className="bg-white text-slate-900 p-2 rounded-xl text-center shadow-md relative group cursor-pointer hover:scale-105 transition-all"
                          title="הקלק להסרה חזרה למגש"
                        >
                          <div className="w-12 h-12 mx-auto">
                            <AnimalIllustration animalId={animal.id} mode={colorMode} />
                          </div>
                          <span className="text-xs font-black block mt-1">{animal.nameNikud}</span>
                          <span className="text-[9px] text-rose-600 opacity-0 group-hover:opacity-100 block">
                            הסר ✕
                          </span>
                        </div>
                      ))}

                    {selectedAnimals.filter((a) => digitalPlacements[a.id] === 2).length === 0 && (
                      <div className="col-span-full h-36 flex flex-col items-center justify-center text-slate-500 border border-dashed border-slate-700 rounded-xl">
                        <span className="text-2xl mb-1">👣</span>
                        <span className="text-xs">הצמידו כאן חיות שהולכות על 2</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Column 2: 4 LEGS */}
                <div
                  onClick={() => {
                    if (interactiveSelectedAnimal) {
                      handleAssignInteractive(interactiveSelectedAnimal, 4);
                    }
                  }}
                  className={`bg-slate-800/80 rounded-2xl p-4 border-2 transition-all min-h-[300px] flex flex-col ${
                    interactiveSelectedAnimal ? 'border-emerald-400 ring-2 ring-emerald-400/40 cursor-pointer' : 'border-slate-700'
                  }`}
                >
                  <div className="bg-emerald-600 text-white p-3 rounded-xl mb-3 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🐾</span>
                      <div>
                        <h3 className="font-black text-base">הוֹלְכִים עַל אַרְבַּע</h3>
                        <span className="text-[10px] text-emerald-100">יונקים וחיות על 4 רגליים</span>
                      </div>
                    </div>
                    <span className="text-xs font-black bg-emerald-900/60 px-2 py-0.5 rounded-full">
                      {selectedAnimals.filter((a) => digitalPlacements[a.id] === 4).length} חיות
                    </span>
                  </div>

                  {/* Placed Animals Grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 flex-1 content-start">
                    {selectedAnimals
                      .filter((a) => digitalPlacements[a.id] === 4)
                      .map((animal) => (
                        <div
                          key={animal.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveInteractive(animal.id);
                          }}
                          className="bg-white text-slate-900 p-2 rounded-xl text-center shadow-md relative group cursor-pointer hover:scale-105 transition-all"
                          title="הקלק להסרה חזרה למגש"
                        >
                          <div className="w-12 h-12 mx-auto">
                            <AnimalIllustration animalId={animal.id} mode={colorMode} />
                          </div>
                          <span className="text-xs font-black block mt-1">{animal.nameNikud}</span>
                          <span className="text-[9px] text-rose-600 opacity-0 group-hover:opacity-100 block">
                            הסר ✕
                          </span>
                        </div>
                      ))}

                    {selectedAnimals.filter((a) => digitalPlacements[a.id] === 4).length === 0 && (
                      <div className="col-span-full h-36 flex flex-col items-center justify-center text-slate-500 border border-dashed border-slate-700 rounded-xl">
                        <span className="text-2xl mb-1">🐾</span>
                        <span className="text-xs">הצמידו כאן חיות שהולכות על 4</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Magnet Tray: Unplaced Animals */}
              <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <span>🧲</span>
                    <span>
                      מגש כרטיסיות מגנטיות להצמדה (
                      {selectedAnimals.filter((a) => digitalPlacements[a.id] === undefined).length} חיות נותרו)
                    </span>
                  </span>
                  {interactiveSelectedAnimal && (
                    <span className="text-xs font-bold text-rose-300 animate-pulse">
                      נבחרה חיה! כעת הקליקו על אחת העמודות למעלה ⬆️
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2.5 max-h-48 overflow-y-auto p-1">
                  {selectedAnimals
                    .filter((a) => digitalPlacements[a.id] === undefined)
                    .map((animal) => {
                      const isSelectedForMove = interactiveSelectedAnimal === animal.id;
                      return (
                        <button
                          key={animal.id}
                          type="button"
                          onClick={() => {
                            playChime('click');
                            setInteractiveSelectedAnimal(isSelectedForMove ? null : animal.id);
                          }}
                          className={`p-2 rounded-xl text-center bg-white text-slate-900 border-2 transition-all flex flex-col items-center shadow-md ${
                            isSelectedForMove
                              ? 'border-rose-500 scale-110 ring-4 ring-rose-400/50 bg-rose-50'
                              : 'border-slate-300 hover:scale-105'
                          }`}
                        >
                          <div className="w-12 h-12">
                            <AnimalIllustration animalId={animal.id} mode={colorMode} />
                          </div>
                          <span className="text-xs font-black mt-1">{animal.nameNikud}</span>
                        </button>
                      );
                    })}

                  {selectedAnimals.filter((a) => digitalPlacements[a.id] === undefined).length === 0 && (
                    <div className="w-full text-center py-4 text-emerald-400 text-xs font-bold">
                      ✨ כל הכרטיסיות הוצמדו ללוח! לחצו על "בדיקת מיון!" לבדיקת ההצלחה!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              PRINTABLE A4 CONTAINER (HTML & CSS PRINT VIEW)
          =================================================================== */}
          <div
            style={{
              zoom: previewZoom !== 100 ? `${previewZoom}%` : undefined
            }}
            className="flex flex-col items-center gap-8"
          >
            {/* -----------------------------------------------------------------
                A4 SHEET 1: CATEGORY HEADER SIGNS (שלטי כותרת ללוח המגנטי)
            ----------------------------------------------------------------- */}
            {(activeTab === 'both' || activeTab === 'headers') && (
              <div
                ref={headersSheetRef}
                id="magnetic-header-sheet"
                className={`a4-page bg-white text-slate-900 shadow-2xl relative border border-slate-300 p-8 flex flex-col justify-between overflow-hidden ${
                  printScope === 'cards' ? 'no-print' : ''
                }`}
                style={{
                  width: '210mm',
                  minHeight: '297mm',
                  height: '297mm',
                  boxSizing: 'border-box'
                }}
              >
                {/* Header Page Title Top Label (Small, outside cut lines) */}
                <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold border-b border-slate-200 pb-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span>🧲 ערכת משחק מגנטי לגן</span>
                    <span>•</span>
                    <span className="font-bold text-slate-700">{kindergartenName}</span>
                  </div>
                  <span>דף שלטי כותרת לראש הלוח (גוזרים במרכז ומדביקים מגנט)</span>
                </div>

                {/* ==========================================
                    HEADER CARD 1: הולכים על שתיים 👣 (TOP HALF)
                ========================================== */}
                <div className="flex-1 rounded-3xl border-4 border-sky-400 bg-gradient-to-br from-sky-50 via-white to-blue-50 p-6 flex flex-col justify-between shadow-xs relative overflow-hidden">
                  {/* Subtle Background Watermark */}
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-10 text-[130px] pointer-events-none">
                    👣
                  </div>

                  {/* Top Bar inside card */}
                  <div className="flex items-center justify-between z-10">
                    <span className="px-3 py-1 bg-sky-200 text-sky-900 rounded-full font-black text-xs">
                      שלט לוח מגנטי 1
                    </span>
                    <div className="flex items-center gap-1.5 text-sky-600 font-bold text-xs">
                      <span>2 רגליים</span>
                      <span>👣</span>
                    </div>
                  </div>

                  {/* Central Content */}
                  <div className="flex items-center justify-around z-10 my-auto">
                    {/* Visual 1: Rooster or Cute Bird SVG */}
                    <div className="w-28 h-28 bg-white p-2 rounded-2xl border-2 border-sky-300 shadow-sm shrink-0">
                      <AnimalIllustration animalId="rooster" mode={colorMode} />
                    </div>

                    {/* Bold Giant Title */}
                    <div className="text-center px-4">
                      <div className="inline-block px-4 py-1 bg-sky-500 text-white rounded-full text-xs font-black mb-2 shadow-xs">
                        קבוצה ראשונה
                      </div>
                      <h2 className="text-4xl sm:text-5xl font-black text-sky-950 tracking-tight mb-2">
                        הוֹלְכִים עַל שְׁתַּיִם 👣
                      </h2>
                      <p className="text-base sm:text-lg font-bold text-sky-800">
                        עופות ובעלי חיים העומדים על שתי רגליים
                      </p>
                    </div>

                    {/* Visual 2: Penguin or Duck SVG */}
                    <div className="w-28 h-28 bg-white p-2 rounded-2xl border-2 border-sky-300 shadow-sm shrink-0">
                      <AnimalIllustration animalId="penguin" mode={colorMode} />
                    </div>
                  </div>

                  {/* Bottom Footer Guide */}
                  <div className="flex items-center justify-between text-[11px] font-bold text-sky-700 border-t border-sky-200 pt-2 z-10">
                    <span>💡 הצמידו שלט זה בראש צד ימין של הלוח המגנטי</span>
                    <span>תרנגול, ברווז, פינגווין, קנגורו, תוכי, ינשוף ועוד</span>
                  </div>
                </div>

                {/* ==========================================
                    CENTER CUTTING LINE (קו חיתוך בין 2 השלטים)
                ========================================== */}
                <div className="my-5 relative flex items-center justify-center">
                  <div className="w-full border-t-2 border-dashed border-slate-400" />
                  <div className="absolute bg-white px-3 py-1 rounded-full border border-slate-300 text-slate-600 text-xs font-bold flex items-center gap-2 shadow-xs">
                    <Scissors className="w-3.5 h-3.5" />
                    <span>קו גזירה – גזרו כאן להפרדת 2 השלטים</span>
                    <Scissors className="w-3.5 h-3.5 scale-x-[-1]" />
                  </div>
                </div>

                {/* ==========================================
                    HEADER CARD 2: הולכים על ארבע 🐾 (BOTTOM HALF)
                ========================================== */}
                <div className="flex-1 rounded-3xl border-4 border-emerald-400 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6 flex flex-col justify-between shadow-xs relative overflow-hidden">
                  {/* Subtle Background Watermark */}
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-10 text-[130px] pointer-events-none">
                    🐾
                  </div>

                  {/* Top Bar inside card */}
                  <div className="flex items-center justify-between z-10">
                    <span className="px-3 py-1 bg-emerald-200 text-emerald-900 rounded-full font-black text-xs">
                      שלט לוח מגנטי 2
                    </span>
                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
                      <span>4 רגליים</span>
                      <span>🐾</span>
                    </div>
                  </div>

                  {/* Central Content */}
                  <div className="flex items-center justify-around z-10 my-auto">
                    {/* Visual 1: Cow SVG */}
                    <div className="w-28 h-28 bg-white p-2 rounded-2xl border-2 border-emerald-300 shadow-sm shrink-0">
                      <AnimalIllustration animalId="cow" mode={colorMode} />
                    </div>

                    {/* Bold Giant Title */}
                    <div className="text-center px-4">
                      <div className="inline-block px-4 py-1 bg-emerald-500 text-white rounded-full text-xs font-black mb-2 shadow-xs">
                        קבוצה שנייה
                      </div>
                      <h2 className="text-4xl sm:text-5xl font-black text-emerald-950 tracking-tight mb-2">
                        הוֹלְכִים עַל אַרְבַּע 🐾
                      </h2>
                      <p className="text-base sm:text-lg font-bold text-emerald-800">
                        יונקים ובעלי חיים ההולכים על ארבע רגליים
                      </p>
                    </div>

                    {/* Visual 2: Lion or Dog SVG */}
                    <div className="w-28 h-28 bg-white p-2 rounded-2xl border-2 border-emerald-300 shadow-sm shrink-0">
                      <AnimalIllustration animalId="dog" mode={colorMode} />
                    </div>
                  </div>

                  {/* Bottom Footer Guide */}
                  <div className="flex items-center justify-between text-[11px] font-bold text-emerald-700 border-t border-emerald-200 pt-2 z-10">
                    <span>💡 הצמידו שלט זה בראש צד שמאל של הלוח המגנטי</span>
                    <span>כלב, חתול, פרה, סוס, פיל, אריה, ג'ירפה, צב ועוד</span>
                  </div>
                </div>

                {/* Bottom Sheet Footer Note */}
                <div className="pt-2 text-center text-[10px] text-slate-400 font-medium">
                  המלצה: לאחר ההדפסה, העבירו במכונת למינציה, גזרו לאורך הקו המקווקו והדביקו מדבקת פס מגנטי מאחור.
                </div>
              </div>
            )}

            {/* -----------------------------------------------------------------
                A4 SHEETS: ANIMAL PICTURE CARDS (דפי כרטיסיות החיות)
            ----------------------------------------------------------------- */}
            {(activeTab === 'both' || activeTab === 'cards') && (
              <div ref={cardsPagesContainerRef} className="w-full flex flex-col items-center gap-8">
                {cardPages.map((pageAnimals, pageIdx) => {
                  return (
                    <div
                      key={`card-page-${pageIdx}`}
                      id={`animal-cards-page-${pageIdx + 1}`}
                      className={`animal-card-page-element a4-page bg-white text-slate-900 shadow-2xl relative border border-slate-300 p-8 flex flex-col justify-between overflow-hidden ${
                        printScope === 'headers' ? 'no-print' : ''
                      }`}
                      style={{
                        width: '210mm',
                        minHeight: '297mm',
                        height: '297mm',
                        boxSizing: 'border-box'
                      }}
                    >
                      {/* Page Header (Subtle, outside cut lines) */}
                      <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold border-b border-slate-200 pb-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-700">{kitTitle}</span>
                          {showKindergartenName && (
                            <>
                              <span>•</span>
                              <span>{kindergartenName}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md">
                            {cardsPerSheet === 4 ? 'גודל ענק (4 בדף)' : 'גודל בינוני (6 בדף)'}
                          </span>
                          <span>
                            דף כרטיסיות {pageIdx + 1} מתוך {cardPages.length}
                          </span>
                        </div>
                      </div>

                      {/* Cards Grid: 2x2 for 4 cards, or 2x3 for 6 cards */}
                      <div
                        className={`flex-1 grid gap-5 p-2 ${
                          cardsPerSheet === 4 ? 'grid-cols-2 grid-rows-2' : 'grid-cols-2 grid-rows-3'
                        }`}
                      >
                        {pageAnimals.map((animal) => {
                          const bgClass = getCardBgClass(animal.legs);

                          return (
                            <div
                              key={animal.id}
                              className={`relative rounded-3xl p-4 flex flex-col items-center justify-between shadow-xs transition-all overflow-hidden ${bgClass} ${
                                cutLinesStyle === 'dashed'
                                  ? 'border-2 border-dashed border-slate-400'
                                  : cutLinesStyle === 'crop_marks'
                                  ? 'border border-slate-200'
                                  : 'border-2 border-slate-400'
                              }`}
                            >
                              {/* Scissor Cutting Icon in Top-Left Corner */}
                              {cutLinesStyle === 'dashed' && (
                                <div className="absolute top-2 left-2 text-slate-400 flex items-center gap-0.5 opacity-60">
                                  <Scissors className="w-3.5 h-3.5" />
                                </div>
                              )}

                              {/* Corner Crop Marks for Professional Printing */}
                              {cutLinesStyle === 'crop_marks' && (
                                <>
                                  <div className="absolute top-1.5 left-1.5 text-slate-400 text-xs font-mono select-none">
                                    ⌜
                                  </div>
                                  <div className="absolute top-1.5 right-1.5 text-slate-400 text-xs font-mono select-none">
                                    ⌝
                                  </div>
                                  <div className="absolute bottom-1.5 left-1.5 text-slate-400 text-xs font-mono select-none">
                                    ⌞
                                  </div>
                                  <div className="absolute bottom-1.5 right-1.5 text-slate-400 text-xs font-mono select-none">
                                    ⌟
                                  </div>
                                </>
                              )}

                              {/* Optional Leg Count Hint in Top Corner */}
                              {showLegsHint && (
                                <div className="absolute top-2.5 right-2.5 bg-slate-100 border border-slate-300 rounded-full px-2 py-0.5 text-[11px] font-black text-slate-700 flex items-center gap-1 shadow-2xs">
                                  <span>{animal.legs === 2 ? '👣 2' : '🐾 4'}</span>
                                </div>
                              )}

                              {/* Animal Sound Emoji Badge */}
                              {animal.soundEmoji && (
                                <div className="absolute top-2.5 left-2.5 text-lg opacity-80">
                                  {animal.soundEmoji}
                                </div>
                              )}

                              {/* Centered Large SVG Animal Illustration with Distinct Legs */}
                              <div
                                className={`w-full flex items-center justify-center my-auto ${
                                  cardsPerSheet === 4 ? 'h-44 sm:h-48' : 'h-32 sm:h-36'
                                }`}
                              >
                                <AnimalIllustration
                                  animalId={animal.id}
                                  mode={colorMode}
                                  className="w-full h-full max-h-full object-contain filter drop-shadow-2xs"
                                />
                              </div>

                              {/* Animal Name Tag (Large Vowel-Pointed Hebrew Text) */}
                              <div className="w-full text-center mt-2 pt-2 border-t border-slate-200/80">
                                <h3
                                  className={`font-black text-slate-900 tracking-tight ${
                                    cardsPerSheet === 4 ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
                                  }`}
                                >
                                  {animal.nameNikud}
                                </h3>
                                <span className="text-[11px] font-semibold text-slate-500 block">
                                  {animal.categoryLabel}
                                </span>
                              </div>
                            </div>
                          );
                        })}

                        {/* Fill empty cells if last page has fewer cards */}
                        {Array.from({ length: cardsPerSheet - pageAnimals.length }).map((_, emptyIdx) => (
                          <div
                            key={`empty-${emptyIdx}`}
                            className="border-2 border-dashed border-slate-200 rounded-3xl p-4 flex flex-col items-center justify-center text-slate-300"
                          >
                            <span className="text-xs font-medium">כרטיסיה ריקה לגזירה</span>
                          </div>
                        ))}
                      </div>

                      {/* Page Footer */}
                      <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                        <span>✂️ גזרו לאורך הקווים, העבירו בלמינציה והדביקו פס מגנטי בגב הכרטיסיה</span>
                        <span>{pageIdx + 1} / {cardPages.length}</span>
                      </div>
                    </div>
                  );
                })}

                {cardPages.length === 0 && (
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
                    <p className="font-bold text-base mb-1">לא נבחרו חיות להדפסה</p>
                    <p className="text-xs">סמנו חיות בבנק החיות בצד ימין כדי לראות את כרטיסיות ה-A4.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
