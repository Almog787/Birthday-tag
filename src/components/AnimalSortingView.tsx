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
import { toJpeg, toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';

import {
  AnimalItem,
  AnimalWorksheetColorMode,
  AnimalCardsPerSheet,
  AnimalImageScale,
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
  const [cardsPerSheet, setCardsPerSheet] = useState<AnimalCardsPerSheet>(4); // 1 = A4 poster, 2 = half-page (1x2), 4 = 2x2, 6 = 2x3, 8 = 2x4, 9 = 3x3
  const [imageScale, setImageScale] = useState<AnimalImageScale>('fill'); // Default: fills card maximally
  const [imageZoomPercent, setImageZoomPercent] = useState<number>(100); // 100% default
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
  const [activeTab, setActiveTab] = useState<'both' | 'headers' | 'cards' | 'interactive'>('both');
  const [previewZoom, setPreviewZoom] = useState<number>(85); // 85%
  const [sidebarTab, setSidebarTab] = useState<'layout' | 'animals'>('layout');

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

  // High-Resolution PDF Download with multi-tiered fallback (toJpeg -> toPng -> html2canvas)
  const handleDownloadPDF = async (target: 'all' | 'headers' | 'cards') => {
    setIsExporting(true);
    setExportError(null);
    setExportSuccess(false);
    trackAnimalPDFDownload(target, colorMode, selectedAnimals.length);

    try {
      setExportProgress('מכין את דפי ה-PDF ברזולוציה גבוהה...');
      const pdf = new jsPDF('portrait', 'mm', 'a4');
      let pageIndex = 0;

      // Helper function to capture an A4 element reliably
      const captureElement = async (el: HTMLElement, label: string): Promise<string> => {
        setExportProgress(`מעבד ${label}...`);
        
        // Save inline styles
        const origTransform = el.style.transform;
        const origMargin = el.style.margin;
        const origBoxShadow = el.style.boxShadow;
        
        try {
          el.style.transform = 'none';
          el.style.margin = '0';
          el.style.boxShadow = 'none';
          
          await new Promise((r) => setTimeout(r, 80));

          // Tier 1: toJpeg
          try {
            return await toJpeg(el, {
              quality: 0.95,
              pixelRatio: 2,
              backgroundColor: '#ffffff',
              cacheBust: true,
              filter: (node) => !(node instanceof HTMLElement && node.classList.contains('no-print'))
            });
          } catch (jpegErr) {
            console.warn('toJpeg failed, attempting toPng:', jpegErr);
            // Tier 2: toPng
            try {
              return await toPng(el, {
                pixelRatio: 1.5,
                backgroundColor: '#ffffff',
                filter: (node) => !(node instanceof HTMLElement && node.classList.contains('no-print'))
              });
            } catch (pngErr) {
              console.warn('toPng failed, attempting html2canvas:', pngErr);
              // Tier 3: html2canvas
              const canvas = await html2canvas(el, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
                ignoreElements: (node) => node.classList.contains('no-print')
              });
              return canvas.toDataURL('image/jpeg', 0.95);
            }
          }
        } finally {
          el.style.transform = origTransform;
          el.style.margin = origMargin;
          el.style.boxShadow = origBoxShadow;
        }
      };

      // 1. Export Headers Sheet if requested
      if ((target === 'all' || target === 'headers') && headersSheetRef.current) {
        const imgData = await captureElement(headersSheetRef.current, 'שלטי כותרת לראש הלוח');
        if (imgData) {
          const format = imgData.startsWith('data:image/png') ? 'PNG' : 'JPEG';
          pdf.addImage(imgData, format, 0, 0, 210, 297, undefined, 'FAST');
          pageIndex++;
        }
      }

      // 2. Export Cards Sheets if requested
      if ((target === 'all' || target === 'cards') && cardsPagesContainerRef.current) {
        const pageElements = cardsPagesContainerRef.current.querySelectorAll('.animal-card-page-element');
        for (let i = 0; i < pageElements.length; i++) {
          const imgData = await captureElement(
            pageElements[i] as HTMLElement,
            `דף כרטיסיות ${i + 1} מתוך ${pageElements.length}`
          );
          if (imgData) {
            if (pageIndex > 0) {
              pdf.addPage('a4', 'portrait');
            }
            const format = imgData.startsWith('data:image/png') ? 'PNG' : 'JPEG';
            pdf.addImage(imgData, format, 0, 0, 210, 297, undefined, 'FAST');
            pageIndex++;
          }
        }
      }

      if (pageIndex === 0) {
        throw new Error('לא נמצאו דפים לייצוא');
      }

      setExportProgress('שומר ומוריד קובץ PDF...');
      const fileName = `ערכת_מיון_חיות_${cardsPerSheet}_בדף_${target}.pdf`;

      try {
        pdf.save(fileName);
      } catch (saveErr) {
        console.warn('pdf.save failed, using blob fallback:', saveErr);
        const blob = pdf.output('blob');
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 1500);
      }

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 5000);
    } catch (err: any) {
      console.error('PDF Generation Error:', err);
      setExportError(err?.message || 'אירעה שגיאה ביצירת קובץ ה-PDF. ניתן להשתמש בכפתור ההדפסה הישירה.');
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
          CLEAN UNIFIED HEADER & ACTION BAR (NO GAME TUTORIAL BANNER)
      ========================================================================= */}
      <div className="no-print bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-3">
        {/* Title & Quick Stats */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white text-lg shadow-xs shrink-0">
            🐾
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-tight">
                ערכת מיון חיות ללוח מגנטי
              </h1>
              <span className="bg-sky-50 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-sky-200">
                2 מול 4 רגליים
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium mt-0.5">
              <span>👣 {balanceInfo.twoCount} על שתיים</span>
              <span>•</span>
              <span>🐾 {balanceInfo.fourCount} על ארבע</span>
              <span>•</span>
              <span className="font-bold text-rose-600">{totalA4Pages} דפי A4</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs between Preview Modes */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold overflow-x-auto max-w-full">
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
            <span>כרטיסיות החיות ({cardPages.length})</span>
          </button>
        </div>

        {/* Print & PDF Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handlePrint('headers')}
            className="px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            title="מדפיס רק את דף שלטי הכותרת"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">הדפס</span> שלטים
          </button>

          <button
            onClick={() => handlePrint('cards')}
            className="px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            title="מדפיס רק את דפי הכרטיסיות"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">הדפס</span> כרטיסיות
          </button>

          <button
            onClick={() => handlePrint('all')}
            className="px-3 py-1.5 text-xs sm:text-sm font-black text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition-all flex items-center gap-1.5"
            title="מדפיס את כל הערכה: שלטים + כרטיסיות"
          >
            <Printer className="w-4 h-4" />
            <span>הדפס הכל</span>
          </button>

          <button
            onClick={() => handleDownloadPDF(activeTab === 'both' ? 'all' : activeTab === 'headers' ? 'headers' : 'cards')}
            disabled={isExporting}
            className="px-3 py-1.5 text-xs sm:text-sm font-black text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-lg shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{exportProgress || 'מעבד...'}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>הורד PDF</span>
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
        <aside className="no-print lg:col-span-4 space-y-4">
          {/* Organized Segmented Control Tabs */}
          <div className="bg-slate-200/80 p-1 rounded-2xl flex items-center gap-1 shadow-inner">
            <button
              type="button"
              onClick={() => setSidebarTab('layout')}
              className={`flex-1 py-2 px-3 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                sidebarTab === 'layout'
                  ? 'bg-white text-rose-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-4 h-4 text-rose-500" />
              <span>הגדרות גודל ועיצוב</span>
            </button>
            <button
              type="button"
              onClick={() => setSidebarTab('animals')}
              className={`flex-1 py-2 px-3 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                sidebarTab === 'animals'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>בחירת חיות ({selectedAnimalIds.length})</span>
            </button>
          </div>

          {/* TAB 1: LAYOUT, SIZES & STYLING */}
          {sidebarTab === 'layout' && (
            <div className="space-y-4 animate-fadeIn">
              {/* 1. Card Layout & Page Capacity */}
              <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <Grid2X2 className="w-4 h-4 text-rose-500" />
                    <span>כמות כרטיסיות בדף A4 (גודל הכרטיסייה)</span>
                  </label>
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                    {cardsPerSheet === 1
                      ? 'פוסטר A4 מלא'
                      : cardsPerSheet === 2
                      ? 'חצי דף (1x2)'
                      : cardsPerSheet === 4
                      ? 'גדול (2x2) • מומלץ'
                      : cardsPerSheet === 6
                      ? 'בינוני (2x3)'
                      : cardsPerSheet === 8
                      ? 'קומפקטי (2x4)'
                      : 'מיני (3x3)'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {/* Option: 4 Cards per page (Recommended for kindergarten) */}
                  <button
                    type="button"
                    onClick={() => {
                      trackAnimalCardsPerSheetChange(4);
                      setCardsPerSheet(4);
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-between ${
                      cardsPerSheet === 4
                        ? 'border-rose-500 bg-rose-50/70 text-rose-950 font-bold shadow-xs ring-2 ring-rose-400/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="text-base mb-0.5">🎴</span>
                    <span className="text-xs font-black">4 בדף (2x2)</span>
                    <span className="text-[9px] text-rose-700 font-bold mt-1 bg-rose-100/80 px-1 rounded">
                      מומלץ לגן
                    </span>
                  </button>

                  {/* Option: 1 Card per page (Maximum A4 fill) */}
                  <button
                    type="button"
                    onClick={() => {
                      trackAnimalCardsPerSheetChange(1);
                      setCardsPerSheet(1);
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-between ${
                      cardsPerSheet === 1
                        ? 'border-rose-500 bg-rose-50/70 text-rose-950 font-bold shadow-xs ring-2 ring-rose-400/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="text-base mb-0.5">🖼️</span>
                    <span className="text-xs font-black">1 בדף (ענק)</span>
                    <span className="text-[9px] text-rose-700 font-bold mt-1 bg-rose-100/80 px-1 rounded">
                      מקסימום A4
                    </span>
                  </button>

                  {/* Option: 2 Cards per page */}
                  <button
                    type="button"
                    onClick={() => {
                      trackAnimalCardsPerSheetChange(2);
                      setCardsPerSheet(2);
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-between ${
                      cardsPerSheet === 2
                        ? 'border-rose-500 bg-rose-50/70 text-rose-950 font-bold shadow-xs ring-2 ring-rose-400/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="text-base mb-0.5">📑</span>
                    <span className="text-xs font-black">2 בדף</span>
                    <span className="text-[9px] text-slate-500 mt-1">חצי דף</span>
                  </button>

                  {/* Option: 6 Cards per page */}
                  <button
                    type="button"
                    onClick={() => {
                      trackAnimalCardsPerSheetChange(6);
                      setCardsPerSheet(6);
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-between ${
                      cardsPerSheet === 6
                        ? 'border-rose-500 bg-rose-50/70 text-rose-950 font-bold shadow-xs ring-2 ring-rose-400/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="text-base mb-0.5">🃏</span>
                    <span className="text-xs font-black">6 בדף (2x3)</span>
                    <span className="text-[9px] text-slate-500 mt-1">בינוני</span>
                  </button>

                  {/* Option: 8 Cards per page */}
                  <button
                    type="button"
                    onClick={() => {
                      trackAnimalCardsPerSheetChange(8);
                      setCardsPerSheet(8);
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-between ${
                      cardsPerSheet === 8
                        ? 'border-rose-500 bg-rose-50/70 text-rose-950 font-bold shadow-xs ring-2 ring-rose-400/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="text-base mb-0.5">📇</span>
                    <span className="text-xs font-black">8 בדף (2x4)</span>
                    <span className="text-[9px] text-slate-500 mt-1">קומפקטי</span>
                  </button>

                  {/* Option: 9 Cards per page */}
                  <button
                    type="button"
                    onClick={() => {
                      trackAnimalCardsPerSheetChange(9);
                      setCardsPerSheet(9);
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-between ${
                      cardsPerSheet === 9
                        ? 'border-rose-500 bg-rose-50/70 text-rose-950 font-bold shadow-xs ring-2 ring-rose-400/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="text-base mb-0.5">🀄</span>
                    <span className="text-xs font-black">9 בדף (3x3)</span>
                    <span className="text-[9px] text-slate-500 mt-1">מיני-קלפים</span>
                  </button>
                </div>
              </div>

              {/* 2. Image Size Control inside Cards */}
              <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-emerald-600" />
                    <span>גודל התמונה בתוך הכרטיסייה</span>
                  </label>
                  <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {imageScale === 'fill' ? 'מילוי מלא (ברירת מחדל)' : `${imageZoomPercent}%`}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setImageScale('fill');
                      setImageZoomPercent(100);
                    }}
                    className={`py-2 px-1 text-center rounded-xl border transition-all text-xs font-black ${
                      imageScale === 'fill'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-400/30'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>🌟 מלא</span>
                    <span className="block text-[9px] font-normal text-emerald-700">דיפולט</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setImageScale('large');
                      setImageZoomPercent(88);
                    }}
                    className={`py-2 px-1 text-center rounded-xl border transition-all text-xs font-bold ${
                      imageScale === 'large'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-400/30'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>גדול</span>
                    <span className="block text-[9px] font-normal text-slate-500">88%</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setImageScale('medium');
                      setImageZoomPercent(74);
                    }}
                    className={`py-2 px-1 text-center rounded-xl border transition-all text-xs font-bold ${
                      imageScale === 'medium'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-400/30'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>בינוני</span>
                    <span className="block text-[9px] font-normal text-slate-500">74%</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setImageScale('contained');
                      setImageZoomPercent(60);
                    }}
                    className={`py-2 px-1 text-center rounded-xl border transition-all text-xs font-bold ${
                      imageScale === 'contained'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-400/30'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>מרווח</span>
                    <span className="block text-[9px] font-normal text-slate-500">60%</span>
                  </button>
                </div>

                {/* Fine-tuning Slider */}
                <div className="pt-1.5 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1">
                    <span>זום מותאם אישית לתמונה:</span>
                    <span className="font-mono text-emerald-700 font-bold">{imageZoomPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="125"
                    step="5"
                    value={imageZoomPercent}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setImageZoomPercent(val);
                      if (val === 100) setImageScale('fill');
                      else if (val >= 85) setImageScale('large');
                      else if (val >= 70) setImageScale('medium');
                      else setImageScale('contained');
                    }}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 mt-1">
                    <span>50% קטן</span>
                    <span>100% מילוי מושלם</span>
                    <span>125% תקריב</span>
                  </div>
                </div>
              </div>

              {/* 3. Visual Style & Printing Details */}
              <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs space-y-3.5">
                <h3 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-indigo-500" />
                  <span>התאמת עיצוב וקווי חיתוך</span>
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
                      <span>צבעוני מלא</span>
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
                      ⌜ ⌝ פינות
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
                      רציף
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
            </div>
          )}

          {/* TAB 2: ANIMAL SELECTION BANK */}
          {sidebarTab === 'animals' && (
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs space-y-3.5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>בנק החיות ({selectedAnimalIds.length} מתוך {ANIMALS_DATABASE.length})</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    סמנו אילו חיות יופיעו בערכה להדפסה
                  </p>
                </div>
              </div>

              {/* Balance Status Banner */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800">{balanceInfo.total} חיות:</span>
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
                  רק 2 ({twoLeggedAnimals.length})
                </button>

                <button
                  type="button"
                  onClick={handleSelectOnlyFour}
                  className="px-2 py-1 text-[11px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg transition-colors"
                >
                  רק 4 ({fourLeggedAnimals.length})
                </button>

                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="px-2 py-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 rounded-lg transition-colors"
                >
                  נקה
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
              <div className="max-h-[460px] overflow-y-auto space-y-1.5 pr-0.5">
                {filteredCatalogAnimals.map((animal) => {
                  const isSelected = selectedAnimalIds.includes(animal.id);
                  return (
                    <div
                      key={animal.id}
                      onClick={() => handleToggleAnimal(animal.id)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? animal.legs === 2
                            ? 'border-sky-400 bg-sky-50/70 text-slate-900 shadow-2xs'
                            : 'border-emerald-400 bg-emerald-50/70 text-slate-900 shadow-2xs'
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
                        <div className="w-9 h-9 rounded-lg bg-white p-0.5 border border-slate-200 shadow-2xs shrink-0 flex items-center justify-center overflow-hidden">
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
          )}
        </aside>

        {/* =====================================================================
            RIGHT/MAIN VIEW: PREVIEW OF A4 SHEETS & INTERACTIVE BOARD (lg:col-span-8)
        ===================================================================== */}
        <section className="lg:col-span-8 space-y-6">
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
                  <h2 className="text-xl font-black text-white">
                    לוח מיון חיות מגנטי
                  </h2>
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
                            {cardsPerSheet === 1
                              ? 'כרטיסיית ענק A4 (1 בדף)'
                              : cardsPerSheet === 2
                              ? 'גודל חצי דף (2 בדף)'
                              : cardsPerSheet === 4
                              ? 'גודל גדול (4 בדף)'
                              : cardsPerSheet === 6
                              ? 'גודל בינוני (6 בדף)'
                              : cardsPerSheet === 8
                              ? 'גודל קומפקטי (8 בדף)'
                              : 'מיני קלפים (9 בדף)'}
                          </span>
                          <span>
                            דף כרטיסיות {pageIdx + 1} מתוך {cardPages.length}
                          </span>
                        </div>
                      </div>

                      {/* Dynamic Responsive Grid Layout based on cardsPerSheet:
                          - 1: 1 col, 1 row (fills entire A4 page maximally!)
                          - 2: 1 col, 2 rows (half A4 page each)
                          - 4: 2 cols, 2 rows (large 2x2)
                          - 6: 2 cols, 3 rows (medium 2x3)
                          - 8: 2 cols, 4 rows (compact 2x4)
                          - 9: 3 cols, 3 rows (mini 3x3)
                      */}
                      <div
                        className={`flex-1 grid p-1.5 ${
                          cardsPerSheet === 1
                            ? 'grid-cols-1 grid-rows-1 gap-0'
                            : cardsPerSheet === 2
                            ? 'grid-cols-1 grid-rows-2 gap-6'
                            : cardsPerSheet === 4
                            ? 'grid-cols-2 grid-rows-2 gap-5'
                            : cardsPerSheet === 6
                            ? 'grid-cols-2 grid-rows-3 gap-4'
                            : cardsPerSheet === 8
                            ? 'grid-cols-2 grid-rows-4 gap-3'
                            : 'grid-cols-3 grid-rows-3 gap-2.5'
                        }`}
                      >
                        {pageAnimals.map((animal) => {
                          const bgClass = getCardBgClass(animal.legs);

                          return (
                            <div
                              key={animal.id}
                              className={`relative rounded-3xl flex flex-col items-center justify-between shadow-xs transition-all overflow-hidden ${bgClass} ${
                                cardsPerSheet === 1
                                  ? 'p-6 sm:p-8 h-full border-4 border-slate-300'
                                  : cardsPerSheet === 2
                                  ? 'p-5 sm:p-6 h-full'
                                  : cardsPerSheet <= 4
                                  ? 'p-4'
                                  : cardsPerSheet <= 6
                                  ? 'p-3'
                                  : 'p-2'
                              } ${
                                cutLinesStyle === 'dashed'
                                  ? 'border-2 border-dashed border-slate-400'
                                  : cutLinesStyle === 'crop_marks'
                                  ? 'border border-slate-200'
                                  : 'border-2 border-slate-400'
                              }`}
                            >
                              {/* Scissor Cutting Icon in Top-Left Corner (for multi-card layouts) */}
                              {cutLinesStyle === 'dashed' && cardsPerSheet > 1 && (
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
                                <div className="absolute top-2.5 right-2.5 bg-slate-100 border border-slate-300 rounded-full px-2 py-0.5 text-[11px] font-black text-slate-700 flex items-center gap-1 shadow-2xs z-10">
                                  <span>{animal.legs === 2 ? '👣 2' : '🐾 4'}</span>
                                </div>
                              )}

                              {/* Animal Sound Emoji Badge */}
                              {animal.soundEmoji && (
                                <div
                                  className={`absolute top-2.5 left-2.5 opacity-85 z-10 ${
                                    cardsPerSheet === 1 ? 'text-3xl' : cardsPerSheet === 2 ? 'text-2xl' : 'text-lg'
                                  }`}
                                >
                                  {animal.soundEmoji}
                                </div>
                              )}

                              {/* Centered Large Animal Illustration with Clean Aspect Ratio (Never Stretches!) */}
                              <div
                                className={`w-full flex items-center justify-center my-auto overflow-hidden ${
                                  cardsPerSheet === 1
                                    ? 'flex-1 h-full min-h-[460px] max-h-[580px]'
                                    : cardsPerSheet === 2
                                    ? 'flex-1 h-full min-h-[220px] max-h-[260px]'
                                    : cardsPerSheet === 4
                                    ? 'h-48 sm:h-52'
                                    : cardsPerSheet === 6
                                    ? 'h-32 sm:h-36'
                                    : cardsPerSheet === 8
                                    ? 'h-24 sm:h-28'
                                    : 'h-20 sm:h-24'
                                }`}
                              >
                                <AnimalIllustration
                                  animalId={animal.id}
                                  mode={colorMode}
                                  imageScale={imageScale}
                                  customZoom={imageZoomPercent}
                                  className="w-full h-full max-h-full object-contain filter drop-shadow-2xs"
                                />
                              </div>

                              {/* Animal Name Tag (Large Vowel-Pointed Hebrew Text) */}
                              <div
                                className={`w-full text-center border-t border-slate-200/80 ${
                                  cardsPerSheet === 1
                                    ? 'mt-4 pt-4'
                                    : cardsPerSheet === 2
                                    ? 'mt-3 pt-2.5'
                                    : cardsPerSheet <= 6
                                    ? 'mt-2 pt-2'
                                    : 'mt-1 pt-1'
                                }`}
                              >
                                <h3
                                  className={`font-black text-slate-900 tracking-tight leading-tight ${
                                    cardsPerSheet === 1
                                      ? 'text-4xl sm:text-5xl mb-1'
                                      : cardsPerSheet === 2
                                      ? 'text-3xl sm:text-4xl mb-0.5'
                                      : cardsPerSheet === 4
                                      ? 'text-2xl sm:text-3xl'
                                      : cardsPerSheet === 6
                                      ? 'text-xl sm:text-2xl'
                                      : cardsPerSheet === 8
                                      ? 'text-lg sm:text-xl'
                                      : 'text-sm sm:text-base'
                                  }`}
                                >
                                  {animal.nameNikud}
                                </h3>
                                <span
                                  className={`font-semibold text-slate-500 block ${
                                    cardsPerSheet <= 2 ? 'text-sm' : cardsPerSheet <= 6 ? 'text-[11px]' : 'text-[9px]'
                                  }`}
                                >
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
                            className="border-2 border-dashed border-slate-200 rounded-3xl p-4 flex flex-col items-center justify-center text-slate-300 min-h-[120px]"
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
        </section>
      </div>
    </div>
  );
};
