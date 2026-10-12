import React, { useState, useRef, useMemo } from 'react';
import {
  Printer,
  Download,
  Scissors,
  RotateCcw,
  Sparkles,
  Shuffle,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  Settings,
  HelpCircle,
  Palette,
  Check,
  MousePointerClick,
  Layers,
  FileText,
  Scale
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  AnimalItem,
  AnimalWorksheetTemplate,
  AnimalWorksheetColorMode,
  AnimalWorksheetBorder,
  AnimalPageLayoutMode,
  AnimalCardsSize
} from '../types';
import { ANIMALS_DATABASE, DEFAULT_SELECTED_ANIMAL_IDS } from '../data/animals';
import { AnimalIllustration } from './AnimalIllustration';
import {
  trackAnimalTemplateChange,
  trackAnimalColorModeChange,
  trackAnimalRandomPick,
  trackAnimalToggle,
  trackAnimalBorderChange,
  trackAnimalPrint,
  trackAnimalPDFDownload,
  trackEvent
} from '../analytics';

interface AnimalSortingViewProps {
  onBackToTags?: () => void;
}

export const AnimalSortingView: React.FC<AnimalSortingViewProps> = () => {
  // 1. Template & Layout Structure
  const [template, setTemplate] = useState<AnimalWorksheetTemplate>('cut_and_paste');
  // 'separated': Page 1 = Full Sorting Board, Page 2 = Cutout Cards | 'combined': 1 Single Page
  const [pageLayoutMode, setPageLayoutMode] = useState<AnimalPageLayoutMode>('separated');
  const [activePreviewTab, setActivePreviewTab] = useState<'both' | 'board' | 'cards'>('both');

  // 2. Visual & Card Options
  const [colorMode, setColorMode] = useState<AnimalWorksheetColorMode>('color');
  const [borderStyle, setBorderStyle] = useState<AnimalWorksheetBorder>('kindergarten');
  const [cardsCount, setCardsCount] = useState<number>(8); // 6, 8, 10, 12
  const [cardSize, setCardSize] = useState<AnimalCardsSize>('medium');
  const [showHelperHints, setShowHelperHints] = useState<boolean>(false); // Small icon hint on card corner

  // 3. Text & Header Customization
  const [worksheetTitle, setWorksheetTitle] = useState<string>('מיון חיות: מי הולך על שתיים ומי על ארבע?');
  const [worksheetSubtitle, setWorksheetSubtitle] = useState<string>('דף פעילות וגזירה לגיל הרך');
  const [showStudentName, setShowStudentName] = useState<boolean>(true);
  const [showKindergartenName, setShowKindergartenName] = useState<boolean>(true);
  const [kindergartenName, setKindergartenName] = useState<string>('גן הילדים');

  // 4. Animal Selection State
  const [selectedAnimalIds, setSelectedAnimalIds] = useState<string[]>(DEFAULT_SELECTED_ANIMAL_IDS);
  const [animalSearch, setAnimalSearch] = useState<string>('');
  const [animalFilter, setAnimalFilter] = useState<'all' | '2' | '4'>('all');

  // 5. Interactive Digital Practice (on-screen testing)
  const [placedAnimals, setPlacedAnimals] = useState<Record<string, 2 | 4>>({});
  const [isInteractiveMode, setIsInteractiveMode] = useState<boolean>(false);

  // 6. Export & Print State
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<string>('');
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [previewZoom, setPreviewZoom] = useState<number>(80); // 80%

  // Refs for HTML2Canvas & PDF Generation
  const combinedSheetRef = useRef<HTMLDivElement>(null);
  const boardSheetRef = useRef<HTMLDivElement>(null);
  const cardsSheetRef = useRef<HTMLDivElement>(null);

  // All 2-legged & 4-legged animals in database
  const twoLeggedAnimals = useMemo(
    () => ANIMALS_DATABASE.filter((a) => a.legs === 2),
    []
  );
  const fourLeggedAnimals = useMemo(
    () => ANIMALS_DATABASE.filter((a) => a.legs === 4),
    []
  );

  // Selected animals list (sliced to cardsCount)
  const currentWorksheetAnimals = useMemo(() => {
    const list = ANIMALS_DATABASE.filter((a) => selectedAnimalIds.includes(a.id));
    return list.slice(0, cardsCount);
  }, [selectedAnimalIds, cardsCount]);

  // Balance audit: how many 2-legs vs 4-legs in the current sheet
  const balanceInfo = useMemo(() => {
    const twoCount = currentWorksheetAnimals.filter((a) => a.legs === 2).length;
    const fourCount = currentWorksheetAnimals.filter((a) => a.legs === 4).length;
    const isBalanced = twoCount === fourCount;
    return { twoCount, fourCount, isBalanced };
  }, [currentWorksheetAnimals]);

  // Balanced Random Pick (half 2-legs, half 4-legs)
  const handleRandomPick = () => {
    const half = Math.floor(cardsCount / 2);
    const shuffledTwo = [...twoLeggedAnimals].sort(() => 0.5 - Math.random()).slice(0, half);
    const shuffledFour = [...fourLeggedAnimals].sort(() => 0.5 - Math.random()).slice(0, cardsCount - half);
    const combined = [...shuffledTwo, ...shuffledFour].sort(() => 0.5 - Math.random());
    setSelectedAnimalIds(combined.map((a) => a.id));
    setPlacedAnimals({});
    trackAnimalRandomPick(cardsCount);
  };

  // Auto-balance existing selection if unbalanced
  const handleAutoBalance = () => {
    const half = Math.floor(cardsCount / 2);
    const selectedTwo = currentWorksheetAnimals.filter((a) => a.legs === 2);
    const selectedFour = currentWorksheetAnimals.filter((a) => a.legs === 4);

    let balancedTwo = [...selectedTwo];
    if (balancedTwo.length < half) {
      const remainingTwo = twoLeggedAnimals.filter((a) => !balancedTwo.some((x) => x.id === a.id));
      balancedTwo.push(...remainingTwo.slice(0, half - balancedTwo.length));
    } else {
      balancedTwo = balancedTwo.slice(0, half);
    }

    let balancedFour = [...selectedFour];
    if (balancedFour.length < cardsCount - half) {
      const remainingFour = fourLeggedAnimals.filter((a) => !balancedFour.some((x) => x.id === a.id));
      balancedFour.push(...remainingFour.slice(0, cardsCount - half - balancedFour.length));
    } else {
      balancedFour = balancedFour.slice(0, cardsCount - half);
    }

    setSelectedAnimalIds([...balancedTwo, ...balancedFour].map((a) => a.id));
    setPlacedAnimals({});
  };

  // Toggle single animal selection
  const handleToggleAnimal = (id: string) => {
    const isCurrentlySelected = selectedAnimalIds.includes(id);
    let updated: string[];

    if (isCurrentlySelected) {
      if (selectedAnimalIds.length <= 4) {
        alert('יש לבחור לפחות 4 חיות עבור דף הפעילות');
        return;
      }
      updated = selectedAnimalIds.filter((item) => item !== id);
    } else {
      updated = [...selectedAnimalIds, id];
    }

    const animal = ANIMALS_DATABASE.find((a) => a.id === id);
    if (animal) {
      trackAnimalToggle(id, animal.name, !isCurrentlySelected);
    }
    setSelectedAnimalIds(updated);
    setPlacedAnimals({});
  };

  // Reset defaults
  const handleResetDefaults = () => {
    setSelectedAnimalIds(DEFAULT_SELECTED_ANIMAL_IDS);
    setCardsCount(8);
    setPageLayoutMode('separated');
    setActivePreviewTab('both');
    setTemplate('cut_and_paste');
    setColorMode('color');
    setBorderStyle('kindergarten');
    setWorksheetTitle('מיון חיות: מי הולך על שתיים ומי על ארבע?');
    setWorksheetSubtitle('דף פעילות וגזירה לגיל הרך');
    setShowHelperHints(false);
    setPlacedAnimals({});
  };

  // Interactive drop/click handler
  const handleInteractiveClassify = (animalId: string, targetLegs: 2 | 4) => {
    setPlacedAnimals((prev) => ({
      ...prev,
      [animalId]: targetLegs
    }));
  };

  // Check interactive score
  const scoreInfo = useMemo(() => {
    const totalPlaced = Object.keys(placedAnimals).length;
    let correctCount = 0;
    Object.entries(placedAnimals).forEach(([aId, legs]) => {
      const animal = ANIMALS_DATABASE.find((a) => a.id === aId);
      if (animal && animal.legs === legs) {
        correctCount += 1;
      }
    });
    return {
      totalPlaced,
      correctCount,
      isAllCorrect: totalPlaced === currentWorksheetAnimals.length && correctCount === totalPlaced
    };
  }, [placedAnimals, currentWorksheetAnimals]);

  // PDF Export supporting Multi-page (2 pages) or Single page
  const handleDownloadPDF = async (targetType: 'all' | 'board_only' | 'cards_only' = 'all') => {
    setIsExporting(true);
    setExportError(null);
    setExportSuccess(false);
    setExportProgress('מכין את קובץ ה-PDF באיכות הדפסה גבוהה (A4)...');
    trackAnimalPDFDownload(template, colorMode, currentWorksheetAnimals.length);

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const captureOptions = {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false
      };

      if (template === 'cut_and_paste' && pageLayoutMode === 'separated') {
        // Mode 1: Separated Pages (Page 1 = Board, Page 2 = Cards)
        if (targetType === 'board_only' && boardSheetRef.current) {
          setExportProgress('מעבד את לוח המיון (דף 1)...');
          const canvas1 = await html2canvas(boardSheetRef.current, captureOptions);
          pdf.addImage(canvas1.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
          pdf.save('דף_מיון_חיות_לוח_ראשי_A4.pdf');
        } else if (targetType === 'cards_only' && cardsSheetRef.current) {
          setExportProgress('מעבד את דף הכרטיסיות לגזירה (דף 2)...');
          const canvas2 = await html2canvas(cardsSheetRef.current, captureOptions);
          pdf.addImage(canvas2.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
          pdf.save('דף_מיון_חיות_כרטיסיות_לגזירה_A4.pdf');
        } else {
          // Both pages in single multi-page PDF!
          if (!boardSheetRef.current || !cardsSheetRef.current) {
            throw new Error('רכיבי הדפים אינם מוכנים להפקה');
          }
          setExportProgress('מעבד את דף 1 (לוח המיון המלא)...');
          const canvas1 = await html2canvas(boardSheetRef.current, captureOptions);
          pdf.addImage(canvas1.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 210, 297, undefined, 'FAST');

          setExportProgress('מעבד את דף 2 (כרטיסיות הגזירה)...');
          pdf.addPage('a4', 'portrait');
          const canvas2 = await html2canvas(cardsSheetRef.current, captureOptions);
          pdf.addImage(canvas2.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 210, 297, undefined, 'FAST');

          pdf.save('דף_מיון_חיות_לוח_וכרטיסיות_2_דפי_A4.pdf');
        }
      } else {
        // Combined 1-page or Line matching
        const targetRef = combinedSheetRef.current || boardSheetRef.current;
        if (!targetRef) throw new Error('הדף אינו זמין להפקה');
        setExportProgress('מעבד דף A4...');
        const canvas = await html2canvas(targetRef, captureOptions);
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
        pdf.save(`דף_פעילות_מיון_חיות_${template === 'cut_and_paste' ? 'משולב' : 'מתיחת_קו'}_A4.pdf`);
      }

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 5000);
    } catch (err: any) {
      console.error('Animal PDF export failed:', err);
      setExportError(err?.message || 'שגיאה ביצוא ה-PDF. ניתן להשתמש בהדפסה ישירה במדפסת.');
    } finally {
      setIsExporting(false);
      setExportProgress('');
    }
  };

  // Browser Print
  const handlePrint = () => {
    trackAnimalPrint(template, colorMode, currentWorksheetAnimals.length);
    window.print();
  };

  // Border style CSS classes
  const getBorderClasses = () => {
    switch (borderStyle) {
      case 'kindergarten':
        return 'border-[6px] border-amber-300 ring-4 ring-rose-300 ring-offset-2 rounded-2xl';
      case 'dots':
        return 'border-[4px] border-dashed border-indigo-400 rounded-xl';
      case 'double':
        return 'border-[6px] border-double border-slate-700 rounded-none';
      case 'clean':
      default:
        return 'border border-slate-300 rounded-lg';
    }
  };

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      {/* Alert notifications */}
      {exportSuccess && (
        <div className="no-print bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-center text-sm font-bold flex items-center justify-center gap-2 shadow-md">
          <CheckCircle2 className="w-5 h-5" />
          <span>דפי הפעילות הופקו והורדו בהצלחה כקובץ PDF מושלם להדפסה! 🎉</span>
        </div>
      )}

      {exportError && (
        <div className="no-print bg-rose-600 text-white px-4 py-3 rounded-xl text-center text-sm font-semibold flex items-center justify-center gap-3 shadow-md">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{exportError}</span>
          <button
            onClick={handlePrint}
            className="px-3 py-1 bg-white text-rose-700 font-bold rounded-md text-xs shadow-xs"
          >
            פתח הדפסה בדפדפן
          </button>
        </div>
      )}

      {/* Main Grid: Controls Sidebar (Left) & Preview Section (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================
            SIDEBAR CONTROLS (Col 4)
           ======================================================== */}
        <aside className="no-print lg:col-span-5 xl:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>🐾</span>
                <span>הגדרות מיון חיות</span>
              </h2>
              <p className="text-xs text-slate-500">
                התאמת לוח המיון, כרטיסיות גזירה והורדת PDF
              </p>
            </div>
            <button
              onClick={handleResetDefaults}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-md transition-colors"
              title="איפוס להגדרות ברירת מחדל"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>איפוס</span>
            </button>
          </div>

          {/* 1. Template Choice: Cut & Paste vs Line Matching */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              סוג הפעילות:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  trackAnimalTemplateChange('cut_and_paste');
                  setTemplate('cut_and_paste');
                }}
                className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between ${
                  template === 'cut_and_paste'
                    ? 'border-rose-500 bg-rose-50/70 ring-2 ring-rose-200 font-bold shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">✂️ הדבקה וגזירה</span>
                  {template === 'cut_and_paste' && <Check className="w-4 h-4 text-rose-600" />}
                </div>
                <span className="text-[11px] text-slate-500 font-normal">
                  לוח מיון + כרטיסיות לגזירה
                </span>
              </button>

              <button
                onClick={() => {
                  trackAnimalTemplateChange('line_matching');
                  setTemplate('line_matching');
                }}
                className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between ${
                  template === 'line_matching'
                    ? 'border-indigo-500 bg-indigo-50/70 ring-2 ring-indigo-200 font-bold shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">✏️ מתיחת קו</span>
                  {template === 'line_matching' && <Check className="w-4 h-4 text-indigo-600" />}
                </div>
                <span className="text-[11px] text-slate-500 font-normal">
                  חיבור קווים בעיפרון לחיזוק מיומנות
                </span>
              </button>
            </div>
          </div>

          {/* 2. Page Separation Selector (Requested Feature!) */}
          {template === 'cut_and_paste' && (
            <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-rose-600" />
                  <span>מבנה הדפים להדפסה:</span>
                </label>
                <span className="text-[10px] bg-rose-200/80 text-rose-800 font-bold px-1.5 py-0.5 rounded">
                  {pageLayoutMode === 'separated' ? '2 דפי A4 מופרדים' : 'דף A4 יחיד משולב'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    trackEvent('change_animal_layout_mode', { mode: 'separated' });
                    setPageLayoutMode('separated');
                  }}
                  className={`p-2.5 rounded-xl border text-right transition-all text-xs ${
                    pageLayoutMode === 'separated'
                      ? 'border-rose-500 bg-white shadow-xs font-bold ring-2 ring-rose-200 text-rose-900'
                      : 'border-rose-200 bg-white/70 hover:bg-white text-slate-700'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1">
                    <span>📑 2 דפים מופרדים</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                    דף 1: לוח מיון ענק מרווח<br />
                    דף 2: כרטיסיות גזירה גדולות
                  </div>
                </button>

                <button
                  onClick={() => {
                    trackEvent('change_animal_layout_mode', { mode: 'combined' });
                    setPageLayoutMode('combined');
                  }}
                  className={`p-2.5 rounded-xl border text-right transition-all text-xs ${
                    pageLayoutMode === 'combined'
                      ? 'border-rose-500 bg-white shadow-xs font-bold ring-2 ring-rose-200 text-rose-900'
                      : 'border-rose-200 bg-white/70 hover:bg-white text-slate-700'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1">
                    <span>📄 דף A4 משולב</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                    לוח עליון + כרטיסיות למטה<br />
                    (חוסך נייר, הכל בדף אחד)
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* 3. Color Mode: Color vs Coloring Book Mode */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              סגנון צבע להדפסה:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  trackAnimalColorModeChange('color');
                  setColorMode('color');
                }}
                className={`p-2.5 rounded-xl border text-right transition-all flex items-center gap-2 ${
                  colorMode === 'color'
                    ? 'border-amber-500 bg-amber-50/80 font-bold ring-2 ring-amber-200 text-slate-900'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <span className="text-xl">🎨</span>
                <div>
                  <div className="text-xs font-bold">צבעוני מלא</div>
                  <div className="text-[10px] text-slate-500">איורים עשירים וחמודים</div>
                </div>
              </button>

              <button
                onClick={() => {
                  trackAnimalColorModeChange('coloring_book');
                  setColorMode('coloring_book');
                }}
                className={`p-2.5 rounded-xl border text-right transition-all flex items-center gap-2 ${
                  colorMode === 'coloring_book'
                    ? 'border-slate-800 bg-slate-100 font-bold ring-2 ring-slate-300 text-slate-900'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <span className="text-xl">🖍️</span>
                <div>
                  <div className="text-xs font-bold">דף צביעה (שחור-לבן)</div>
                  <div className="text-[10px] text-slate-500">קווי מתאר, חוסך דיו</div>
                </div>
              </button>
            </div>
          </div>

          {/* 4. Number of Cards in Sheet & Card Size */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                כמות כרטיסיות בפעילות:
              </label>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                {cardsCount} חיות
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { count: 6, label: '6 חיות' },
                { count: 8, label: '8 חיות' },
                { count: 10, label: '10 חיות' },
                { count: 12, label: '12 חיות' }
              ].map((opt) => (
                <button
                  key={opt.count}
                  onClick={() => {
                    setCardsCount(opt.count);
                    setPlacedAnimals({});
                  }}
                  className={`py-2 px-1 text-center rounded-xl border text-xs transition-all ${
                    cardsCount === opt.count
                      ? 'border-rose-500 bg-rose-50 font-bold text-rose-700 ring-2 ring-rose-200'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="font-bold">{opt.label}</div>
                </button>
              ))}
            </div>

            {/* Helper Hint Toggle */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showHelperHints}
                  onChange={(e) => setShowHelperHints(e.target.checked)}
                  className="w-3.5 h-3.5 accent-rose-500 rounded"
                />
                <span>הצג אייקון רמז קטן בפינת הכרטיס (👣 / 🐾)</span>
              </label>
            </div>
          </div>

          {/* 5. Live Balance Indicator & Quick Action Buttons */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-indigo-600" />
                <span>איזון חיות בדף:</span>
              </span>
              <span
                className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                  balanceInfo.isBalanced
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {balanceInfo.isBalanced
                  ? '✅ מאוזן מושלם (חצי-חצי)'
                  : `⚠️ ${balanceInfo.twoCount} על שתיים | ${balanceInfo.fourCount} על ארבע`}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleRandomPick}
                className="flex-1 py-2 px-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                title="בוחר אקראית חצי חיות על 2 וחצי חיות על 4"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>ערבוב אקראי מאוזן 🎲</span>
              </button>

              {!balanceInfo.isBalanced && (
                <button
                  onClick={handleAutoBalance}
                  className="py-2 px-2 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors flex items-center justify-center gap-1"
                  title="משלים אוטומטית לחיות מאוזנות"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>אזן אוטומטית ⚖️</span>
                </button>
              )}
            </div>
          </div>

          {/* 6. Titles & Header Customization */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                כותרת ראשית:
              </label>
              <input
                type="text"
                value={worksheetTitle}
                onChange={(e) => setWorksheetTitle(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                הוראות / תת כותרת:
              </label>
              <input
                type="text"
                value={worksheetSubtitle}
                onChange={(e) => setWorksheetSubtitle(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={showStudentName}
                  onChange={(e) => setShowStudentName(e.target.checked)}
                  className="w-4 h-4 accent-rose-500 rounded"
                />
                <span className="font-semibold text-slate-700">שם הילד/ה</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={showKindergartenName}
                  onChange={(e) => setShowKindergartenName(e.target.checked)}
                  className="w-4 h-4 accent-rose-500 rounded"
                />
                <span className="font-semibold text-slate-700">גן ותאריך</span>
              </label>
            </div>
          </div>

          {/* 7. Decorative Border Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              מסגרת מעוצבת לדף A4:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'kindergarten', label: '🎨 גן עליז', desc: 'צבעוני וחגיגי' },
                { id: 'dots', label: '✂️ קו מקווקו', desc: 'חוברת עבודה' },
                { id: 'double', label: '📜 קו כפול', desc: 'קלאסי ונקי' },
                { id: 'clean', label: '◻️ מינימליסטי', desc: 'פשוט' }
              ].map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    trackAnimalBorderChange(b.id);
                    setBorderStyle(b.id as AnimalWorksheetBorder);
                  }}
                  className={`p-2 rounded-lg border text-right text-xs transition-all ${
                    borderStyle === b.id
                      ? 'border-rose-500 bg-rose-50 font-bold text-rose-700 ring-2 ring-rose-200'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="font-bold">{b.label}</div>
                  <div className="text-[10px] text-slate-500">{b.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 8. Animal Database Picker */}
          <div className="pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800">
                בנק החיות המובנה ({ANIMALS_DATABASE.length}):
              </span>
              <span className="text-[11px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-md">
                נבחרו {currentWorksheetAnimals.length} מתוך {cardsCount}
              </span>
            </div>

            <div className="flex gap-1.5 mb-2">
              <button
                onClick={() => setAnimalFilter('all')}
                className={`flex-1 py-1 text-xs rounded-md font-semibold transition-colors ${
                  animalFilter === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                הכל
              </button>
              <button
                onClick={() => setAnimalFilter('2')}
                className={`flex-1 py-1 text-xs rounded-md font-semibold transition-colors ${
                  animalFilter === '2' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800'
                }`}
              >
                👣 2 רגליים
              </button>
              <button
                onClick={() => setAnimalFilter('4')}
                className={`flex-1 py-1 text-xs rounded-md font-semibold transition-colors ${
                  animalFilter === '4' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-800'
                }`}
              >
                🐾 4 רגליים
              </button>
            </div>

            <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1 text-xs">
              {ANIMALS_DATABASE.filter((a) => {
                if (animalFilter === '2' && a.legs !== 2) return false;
                if (animalFilter === '4' && a.legs !== 4) return false;
                if (animalSearch && !a.name.includes(animalSearch)) return false;
                return true;
              }).map((animal) => {
                const isSelected = selectedAnimalIds.includes(animal.id);
                const isInCurrentSheet = currentWorksheetAnimals.some((a) => a.id === animal.id);

                return (
                  <div
                    key={animal.id}
                    onClick={() => handleToggleAnimal(animal.id)}
                    className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? isInCurrentSheet
                          ? 'border-emerald-400 bg-emerald-50/70 font-bold'
                          : 'border-slate-300 bg-slate-50 text-slate-700'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="w-4 h-4 accent-emerald-600 rounded"
                      />
                      <div className="w-7 h-7 shrink-0">
                        <AnimalIllustration animalId={animal.id} mode="color" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-800">
                          {animal.nameNikud}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {animal.categoryLabel}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ${
                        animal.legs === 2
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-sky-100 text-sky-800'
                      }`}
                    >
                      {animal.legs === 2 ? '2 רגליים 👣' : '4 רגליים 🐾'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 9. Interactive Practice Mode on Screen */}
          <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-purple-900 block flex items-center gap-1">
                  <MousePointerClick className="w-3.5 h-3.5" />
                  <span>אימון ותרגול אינטראקטיבי על המסך:</span>
                </span>
                <span className="text-[11px] text-purple-700">
                  מאפשר לילדים לשבץ חיות ישירות בדפדפן!
                </span>
              </div>
              <input
                type="checkbox"
                checked={isInteractiveMode}
                onChange={(e) => setIsInteractiveMode(e.target.checked)}
                className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
              />
            </div>
            {isInteractiveMode && (
              <div className="mt-2 pt-2 border-t border-purple-200/60 flex items-center justify-between text-xs">
                <span className="text-purple-800 font-medium">
                  שובצו: {scoreInfo.totalPlaced}/{currentWorksheetAnimals.length} חיות
                </span>
                {scoreInfo.totalPlaced > 0 && (
                  <button
                    onClick={() => setPlacedAnimals({})}
                    className="text-[11px] text-purple-600 underline hover:text-purple-900"
                  >
                    נקה שיבוצים
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 10. Direct Print & PDF Export Buttons */}
          <div className="pt-2 border-t border-slate-200 space-y-2.5">
            <button
              onClick={() => handleDownloadPDF('all')}
              disabled={isExporting}
              className="w-full py-3 px-4 font-bold text-white bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{exportProgress || 'מפיק קובץ PDF...'}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>
                    {template === 'cut_and_paste' && pageLayoutMode === 'separated'
                      ? 'הורד את שני הדפים כקובץ PDF (A4 מלא)'
                      : 'הורד דף פעילות כקובץ PDF'}
                  </span>
                </>
              )}
            </button>

            {/* Quick single-page PDF options when in separated mode */}
            {template === 'cut_and_paste' && pageLayoutMode === 'separated' && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleDownloadPDF('board_only')}
                  disabled={isExporting}
                  className="py-1.5 px-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-center disabled:opacity-50"
                >
                  רק לוח מיון (דף 1)
                </button>
                <button
                  onClick={() => handleDownloadPDF('cards_only')}
                  disabled={isExporting}
                  className="py-1.5 px-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-center disabled:opacity-50"
                >
                  רק כרטיסיות (דף 2)
                </button>
              </div>
            )}

            <button
              onClick={handlePrint}
              className="w-full py-2.5 px-4 font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>הדפסה ישירה במדפסת (A4)</span>
            </button>
          </div>
        </aside>

        {/* ========================================================
            RIGHT PREVIEW SECTION (Col 8)
           ======================================================== */}
        <section className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
          
          {/* Top Preview Control Bar */}
          <div className="no-print bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-800">תצוגת דפי A4:</span>
              
              {/* If separated mode, allow tab switching between both, board only, cards only */}
              {template === 'cut_and_paste' && pageLayoutMode === 'separated' && (
                <div className="flex bg-slate-100 p-1 rounded-lg gap-1 text-xs">
                  <button
                    onClick={() => setActivePreviewTab('both')}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                      activePreviewTab === 'both' ? 'bg-white shadow-xs text-rose-600 font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    שני הדפים ברצף (2 דפי A4)
                  </button>
                  <button
                    onClick={() => setActivePreviewTab('board')}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                      activePreviewTab === 'board' ? 'bg-white shadow-xs text-rose-600 font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    דף 1: לוח המיון 📋
                  </button>
                  <button
                    onClick={() => setActivePreviewTab('cards')}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                      activePreviewTab === 'cards' ? 'bg-white shadow-xs text-rose-600 font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    דף 2: כרטיסיות גזירה ✂️
                  </button>
                </div>
              )}

              <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-md">
                {colorMode === 'color' ? '🎨 צבעוני מלא' : '🖍️ דף צביעה שחור-לבן'}
              </span>
            </div>

            {/* Preview Zoom Controls */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-slate-500 ml-1">זום תצוגה:</span>
              {[50, 70, 80, 100].map((zoomVal) => (
                <button
                  key={zoomVal}
                  onClick={() => setPreviewZoom(zoomVal)}
                  className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                    previewZoom === zoomVal
                      ? 'bg-rose-500 text-white font-bold shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {zoomVal}%
                </button>
              ))}
            </div>
          </div>

          {/* Interactive celebration banner */}
          {isInteractiveMode && scoreInfo.isAllCorrect && (
            <div className="no-print bg-emerald-500 text-white p-3 rounded-2xl text-center font-bold text-sm shadow-md flex items-center justify-center gap-2 animate-bounce">
              <Sparkles className="w-5 h-5" />
              <span>כל הכבוד! כל החיות מויינו בצורה מושלמת ונכונה! 🏆👏</span>
            </div>
          )}

          {/* Printable Sheets Container with Zoom Scaling */}
          <div className="flex flex-col items-center gap-8 overflow-x-auto pb-12">
            
            {/* ========================================================
                OPTION A: SEPARATED MODE (PAGE 1: BOARD + PAGE 2: CARDS)
               ======================================================== */}
            {template === 'cut_and_paste' && pageLayoutMode === 'separated' ? (
              <div
                style={{
                  transform: `scale(${previewZoom / 100})`,
                  transformOrigin: 'top center',
                  transition: 'transform 0.15s ease-out'
                }}
                className="print-sheet-wrapper flex flex-col items-center gap-10"
              >
                {/* PAGE 1: FULL A4 SORTING BOARD */}
                {(activePreviewTab === 'both' || activePreviewTab === 'board') && (
                  <div
                    ref={boardSheetRef}
                    id="animal-board-page-1"
                    className={`a4-page bg-white text-slate-900 shadow-2xl relative flex flex-col justify-between overflow-hidden ${getBorderClasses()}`}
                    style={{
                      width: '210mm',
                      height: '297mm',
                      minHeight: '297mm',
                      maxHeight: '297mm',
                      padding: '12mm',
                      boxSizing: 'border-box'
                    }}
                  >
                    {/* Decorative corner elements */}
                    {borderStyle === 'kindergarten' && (
                      <>
                        <div className="absolute top-2 left-3 text-base opacity-75">🎈⭐</div>
                        <div className="absolute top-2 right-3 text-base opacity-75">⭐🎉</div>
                        <div className="absolute bottom-2 left-3 text-base opacity-75">🐾🌿</div>
                        <div className="absolute bottom-2 right-3 text-base opacity-75">🌿👣</div>
                      </>
                    )}

                    {/* Header Area */}
                    <header className="border-b-2 border-slate-300 pb-3 mb-2">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1">
                          <h1 className="text-2xl font-black text-slate-900 leading-tight">
                            {worksheetTitle}
                          </h1>
                          <p className="text-xs font-semibold text-slate-600 mt-0.5">
                            {worksheetSubtitle} • לוח מיון ראשי להדבקה
                          </p>
                        </div>

                        {/* Student Name & Date Lines */}
                        <div className="flex flex-col gap-1 text-xs font-bold text-slate-700 min-w-[210px]">
                          {showStudentName && (
                            <div className="flex items-center gap-1 border-b border-slate-400 pb-0.5">
                              <span className="text-slate-500 font-medium">שם הילד/ה:</span>
                              <span className="flex-1 text-slate-800">___________________</span>
                            </div>
                          )}
                          {showKindergartenName && (
                            <div className="flex items-center justify-between gap-2 border-b border-slate-400 pb-0.5 text-[11px]">
                              <span className="text-slate-500 font-medium">גן: _________________</span>
                              <span className="text-slate-500 font-medium">תאריך: ____________</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </header>

                    {/* Sorting Board Columns (Taking Full Sheet!) */}
                    <div className="flex-1 flex flex-col justify-between my-2">
                      {/* Big Guidance Banner */}
                      <div className="bg-amber-100/70 border border-amber-300 rounded-xl py-2 px-4 text-center text-xs font-bold text-amber-950 mb-3 shadow-xs">
                        🎯 הנחיה: גזרו את כרטיסיות החיות מ"דף הכרטיסיות", והדביקו כל חיה בעמודה המתאימה לה!
                      </div>

                      {/* 2 Wide Spaced Columns */}
                      <div className="grid grid-cols-2 gap-5 flex-1 min-h-[205mm]">
                        {/* Column 1: הולכים על שתיים 👣 */}
                        <div className="flex flex-col border-3 border-dashed border-amber-400 bg-amber-50/40 rounded-2xl p-3 relative shadow-xs">
                          <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-200 to-amber-300 text-amber-950 font-black py-2 px-3 rounded-xl text-base shadow-xs mb-3 border border-amber-300">
                            <span className="text-2xl">👣</span>
                            <span>הולכים על שתיים (2 רגליים)</span>
                          </div>

                          {/* Grid of pasting spots */}
                          <div className="flex-1 grid grid-cols-2 gap-3 p-2 rounded-xl border border-amber-200 bg-white/70 items-center justify-items-center">
                            {isInteractiveMode ? (
                              currentWorksheetAnimals
                                .filter((a) => placedAnimals[a.id] === 2)
                                .map((a) => (
                                  <div
                                    key={a.id}
                                    className="w-[36mm] h-[36mm] border-2 border-emerald-500 bg-emerald-50 rounded-xl p-1 flex flex-col items-center justify-center shadow-xs animate-scale-up"
                                  >
                                    <div className="w-14 h-14">
                                      <AnimalIllustration animalId={a.id} mode={colorMode} />
                                    </div>
                                    <span className="text-xs font-black text-slate-800 mt-1">
                                      {a.nameNikud}
                                    </span>
                                  </div>
                                ))
                            ) : (
                              Array.from({ length: Math.ceil(cardsCount / 2) }).map((_, idx) => (
                                <div
                                  key={idx}
                                  className="w-[36mm] h-[36mm] border-2 border-dashed border-amber-300 rounded-xl flex flex-col items-center justify-center text-amber-500/80 p-2 text-center bg-amber-50/20"
                                >
                                  <span className="text-2xl opacity-40">👣</span>
                                  <span className="text-[11px] font-bold opacity-75 mt-1">
                                    הדביקו כאן
                                  </span>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Column 2: הולכים על ארבע 🐾 */}
                        <div className="flex flex-col border-3 border-dashed border-sky-400 bg-sky-50/40 rounded-2xl p-3 relative shadow-xs">
                          <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-sky-200 to-sky-300 text-sky-950 font-black py-2 px-3 rounded-xl text-base shadow-xs mb-3 border border-sky-300">
                            <span className="text-2xl">🐾</span>
                            <span>הולכים על ארבע (4 רגליים)</span>
                          </div>

                          {/* Grid of pasting spots */}
                          <div className="flex-1 grid grid-cols-2 gap-3 p-2 rounded-xl border border-sky-200 bg-white/70 items-center justify-items-center">
                            {isInteractiveMode ? (
                              currentWorksheetAnimals
                                .filter((a) => placedAnimals[a.id] === 4)
                                .map((a) => (
                                  <div
                                    key={a.id}
                                    className="w-[36mm] h-[36mm] border-2 border-emerald-500 bg-emerald-50 rounded-xl p-1 flex flex-col items-center justify-center shadow-xs animate-scale-up"
                                  >
                                    <div className="w-14 h-14">
                                      <AnimalIllustration animalId={a.id} mode={colorMode} />
                                    </div>
                                    <span className="text-xs font-black text-slate-800 mt-1">
                                      {a.nameNikud}
                                    </span>
                                  </div>
                                ))
                            ) : (
                              Array.from({ length: Math.ceil(cardsCount / 2) }).map((_, idx) => (
                                <div
                                  key={idx}
                                  className="w-[36mm] h-[36mm] border-2 border-dashed border-sky-300 rounded-xl flex flex-col items-center justify-center text-sky-500/80 p-2 text-center bg-sky-50/20"
                                >
                                  <span className="text-2xl opacity-40">🐾</span>
                                  <span className="text-[11px] font-bold opacity-75 mt-1">
                                    הדביקו כאן
                                  </span>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sheet Footer */}
                    <footer className="pt-2 border-t border-slate-200 text-center text-[10px] text-slate-400 font-mono flex items-center justify-between">
                      <span>דף 1 מתוך 2: לוח המיון הראשי • מותאם ל-A4</span>
                      <span>💡 כרטיסיות החיות נמצאות בדף 2 לגזירה</span>
                    </footer>
                  </div>
                )}

                {/* PAGE 2: FULL A4 CUTOUT CARDS SHEET */}
                {(activePreviewTab === 'both' || activePreviewTab === 'cards') && (
                  <div
                    ref={cardsSheetRef}
                    id="animal-cards-page-2"
                    className={`a4-page bg-white text-slate-900 shadow-2xl relative flex flex-col justify-between overflow-hidden ${getBorderClasses()}`}
                    style={{
                      width: '210mm',
                      height: '297mm',
                      minHeight: '297mm',
                      maxHeight: '297mm',
                      padding: '12mm',
                      boxSizing: 'border-box'
                    }}
                  >
                    {/* Header Area */}
                    <header className="border-b-2 border-slate-300 pb-3 mb-2">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1">
                          <h2 className="text-2xl font-black text-slate-900 leading-tight flex items-center gap-2">
                            <span>✂️</span>
                            <span>כרטיסיות חיות לגזירה והדבקה</span>
                          </h2>
                          <p className="text-xs font-semibold text-slate-600 mt-0.5">
                            גזרו בזהירות לאורך הקווים המקווקוים והדביקו בלוח המיון (דף 1)
                          </p>
                        </div>
                        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
                          <Scissors className="w-4 h-4 text-rose-500" />
                          <span>דף גזירה ({currentWorksheetAnimals.length} כרטיסיות)</span>
                        </div>
                      </div>
                    </header>

                    {/* Cutout Cards Grid (Spacious Full Page Grid!) */}
                    <div className="flex-1 flex flex-col justify-center items-center my-3">
                      <div
                        className={`grid gap-4 justify-center items-center ${
                          cardsCount <= 8
                            ? 'grid-cols-2 md:grid-cols-4'
                            : cardsCount === 10
                            ? 'grid-cols-2 md:grid-cols-5'
                            : 'grid-cols-3 md:grid-cols-4'
                        }`}
                      >
                        {currentWorksheetAnimals.map((animal) => {
                          const isPlaced = isInteractiveMode && placedAnimals[animal.id];

                          return (
                            <div
                              key={animal.id}
                              className={`relative border-2 border-dashed border-slate-400 rounded-2xl p-2.5 flex flex-col items-center justify-between bg-white text-center transition-all ${
                                isInteractiveMode ? 'cursor-pointer hover:border-rose-400 hover:shadow-md' : ''
                              } ${isPlaced ? 'opacity-30 line-through' : ''}`}
                              style={{
                                width: cardsCount <= 8 ? '42mm' : '38mm',
                                height: cardsCount <= 8 ? '45mm' : '40mm',
                                boxSizing: 'border-box'
                              }}
                              onClick={() => {
                                if (isInteractiveMode) {
                                  const current = placedAnimals[animal.id];
                                  if (!current) {
                                    handleInteractiveClassify(animal.id, animal.legs);
                                  } else {
                                    setPlacedAnimals((prev) => {
                                      const next = { ...prev };
                                      delete next[animal.id];
                                      return next;
                                    });
                                  }
                                }
                              }}
                            >
                              {/* Scissors cut symbol */}
                              <div className="absolute top-1 left-1.5 text-[10px] text-slate-400 flex items-center">
                                ✂️
                              </div>

                              {/* Optional helper hint */}
                              {showHelperHints && (
                                <div className="absolute top-1 right-1.5 text-[10px] font-bold bg-slate-100 text-slate-600 px-1 rounded">
                                  {animal.legs === 2 ? '👣' : '🐾'}
                                </div>
                              )}

                              {/* Animal Vector Illustration */}
                              <div className="w-16 h-16 flex items-center justify-center my-auto">
                                <AnimalIllustration animalId={animal.id} mode={colorMode} />
                              </div>

                              {/* Hebrew Vocalized Name */}
                              <div className="w-full bg-slate-50 border-t border-slate-100 rounded-b-xl py-1">
                                <span className="text-sm font-black text-slate-900 tracking-wide font-['Fredoka',sans-serif]">
                                  {animal.nameNikud}
                                </span>
                              </div>

                              {/* Interactive classification buttons */}
                              {isInteractiveMode && !isPlaced && (
                                <div className="absolute -bottom-2 flex gap-1 z-10">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleInteractiveClassify(animal.id, 2);
                                    }}
                                    className="text-[10px] bg-amber-500 text-white font-bold px-2 py-0.5 rounded-md shadow-xs"
                                    title="שבץ ב-2 רגליים"
                                  >
                                    2 👣
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleInteractiveClassify(animal.id, 4);
                                    }}
                                    className="text-[10px] bg-sky-500 text-white font-bold px-2 py-0.5 rounded-md shadow-xs"
                                    title="שבץ ב-4 רגליים"
                                  >
                                    4 🐾
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Sheet Footer with Cutting Guide */}
                    <footer className="pt-2 border-t border-slate-200 text-center text-[10px] text-slate-400 font-mono flex items-center justify-between">
                      <span>דף 2 מתוך 2: כרטיסיות גזירה • מותאם ל-A4</span>
                      <span>✂️ גוזרים במספריים בטיחותיים לילדים ומשבצים בלוח המיון</span>
                    </footer>
                  </div>
                )}
              </div>
            ) : template === 'cut_and_paste' && pageLayoutMode === 'combined' ? (
              
              /* ========================================================
                 OPTION B: COMBINED 1-PAGE MODE (A4 SINGLE PAGE)
                 ======================================================== */
              <div
                style={{
                  transform: `scale(${previewZoom / 100})`,
                  transformOrigin: 'top center',
                  transition: 'transform 0.15s ease-out'
                }}
                className="print-sheet-wrapper"
              >
                <div
                  ref={combinedSheetRef}
                  id="animal-combined-page"
                  className={`a4-page bg-white text-slate-900 shadow-2xl relative flex flex-col justify-between overflow-hidden ${getBorderClasses()}`}
                  style={{
                    width: '210mm',
                    height: '297mm',
                    minHeight: '297mm',
                    maxHeight: '297mm',
                    padding: '12mm',
                    boxSizing: 'border-box'
                  }}
                >
                  {/* Header */}
                  <header className="border-b-2 border-slate-300 pb-2 mb-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <h1 className="text-xl font-black text-slate-900 leading-tight">
                          {worksheetTitle}
                        </h1>
                        <p className="text-[11px] font-semibold text-slate-600 mt-0.5">
                          {worksheetSubtitle}
                        </p>
                      </div>

                      <div className="flex flex-col gap-0.5 text-xs font-bold text-slate-700 min-w-[200px]">
                        {showStudentName && (
                          <div className="flex items-center gap-1 border-b border-slate-400 pb-0.5">
                            <span className="text-slate-500 font-medium text-[11px]">שם:</span>
                            <span className="flex-1 text-slate-800">___________________</span>
                          </div>
                        )}
                        {showKindergartenName && (
                          <div className="flex items-center justify-between gap-1 text-[10px] text-slate-500">
                            <span>גן: _________________</span>
                            <span>תאריך: ____________</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </header>

                  {/* Top Sorting Columns */}
                  <div className="grid grid-cols-2 gap-4 my-1 flex-1 max-h-[145mm]">
                    <div className="flex flex-col border-2 border-dashed border-amber-400 bg-amber-50/40 rounded-2xl p-2.5 relative">
                      <div className="flex items-center justify-center gap-2 bg-amber-200/80 text-amber-950 font-black py-1 px-3 rounded-xl text-xs shadow-xs mb-2">
                        <span className="text-base">👣</span>
                        <span>הולכים על שתיים (2 רגליים)</span>
                      </div>
                      <div className="flex-1 grid grid-cols-2 gap-2 p-1.5 rounded-xl border border-amber-200/80 bg-white/70 items-center justify-items-center">
                        {isInteractiveMode ? (
                          currentWorksheetAnimals
                            .filter((a) => placedAnimals[a.id] === 2)
                            .map((a) => (
                              <div
                                key={a.id}
                                className="w-[36mm] h-[32mm] border-2 border-emerald-500 bg-emerald-50 rounded-xl p-1 flex flex-col items-center justify-center shadow-xs"
                              >
                                <div className="w-12 h-12">
                                  <AnimalIllustration animalId={a.id} mode={colorMode} />
                                </div>
                                <span className="text-[11px] font-black text-slate-800">
                                  {a.nameNikud}
                                </span>
                              </div>
                            ))
                        ) : (
                          Array.from({ length: 4 }).map((_, idx) => (
                            <div
                              key={idx}
                              className="w-full h-full min-h-[28mm] border border-dashed border-amber-300 rounded-xl flex flex-col items-center justify-center text-amber-400/80 p-1 text-center"
                            >
                              <span className="text-lg opacity-40">👣</span>
                              <span className="text-[9px] font-semibold opacity-60">הדביקו כאן</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col border-2 border-dashed border-sky-400 bg-sky-50/40 rounded-2xl p-2.5 relative">
                      <div className="flex items-center justify-center gap-2 bg-sky-200/80 text-sky-950 font-black py-1 px-3 rounded-xl text-xs shadow-xs mb-2">
                        <span className="text-base">🐾</span>
                        <span>הולכים על ארבע (4 רגליים)</span>
                      </div>
                      <div className="flex-1 grid grid-cols-2 gap-2 p-1.5 rounded-xl border border-sky-200/80 bg-white/70 items-center justify-items-center">
                        {isInteractiveMode ? (
                          currentWorksheetAnimals
                            .filter((a) => placedAnimals[a.id] === 4)
                            .map((a) => (
                              <div
                                key={a.id}
                                className="w-[36mm] h-[32mm] border-2 border-emerald-500 bg-emerald-50 rounded-xl p-1 flex flex-col items-center justify-center shadow-xs"
                              >
                                <div className="w-12 h-12">
                                  <AnimalIllustration animalId={a.id} mode={colorMode} />
                                </div>
                                <span className="text-[11px] font-black text-slate-800">
                                  {a.nameNikud}
                                </span>
                              </div>
                            ))
                        ) : (
                          Array.from({ length: 4 }).map((_, idx) => (
                            <div
                              key={idx}
                              className="w-full h-full min-h-[28mm] border border-dashed border-sky-300 rounded-xl flex flex-col items-center justify-center text-sky-400/80 p-1 text-center"
                            >
                              <span className="text-lg opacity-40">🐾</span>
                              <span className="text-[9px] font-semibold opacity-60">הדביקו כאן</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Cut Line Indicator */}
                  <div className="my-1.5 relative flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t-2 border-dashed border-slate-400"></div>
                    </div>
                    <div className="relative bg-white px-3 py-0.5 rounded-full border border-slate-300 text-[10px] font-bold text-slate-600 flex items-center gap-1.5 shadow-xs">
                      <Scissors className="w-3.5 h-3.5 text-rose-500 rotate-90" />
                      <span>גזרו לאורך הקו המקווקו את כרטיסיות החיות והדביקו למעלה</span>
                      <Scissors className="w-3.5 h-3.5 text-rose-500 -rotate-90" />
                    </div>
                  </div>

                  {/* Bottom Cutout Cards Area */}
                  <div className="pt-1">
                    <div
                      className={`grid gap-2 justify-center ${
                        cardsCount === 6
                          ? 'grid-cols-6'
                          : cardsCount === 10
                          ? 'grid-cols-5'
                          : 'grid-cols-4'
                      }`}
                    >
                      {currentWorksheetAnimals.map((animal) => (
                        <div
                          key={animal.id}
                          className="relative border-2 border-dashed border-slate-400 rounded-xl p-1.5 flex flex-col items-center justify-between bg-white text-center"
                          style={{
                            width: cardsCount === 10 ? '33mm' : '41mm',
                            height: cardsCount === 10 ? '33mm' : '39mm',
                            boxSizing: 'border-box'
                          }}
                        >
                          <div className="absolute top-0.5 left-1 text-[8px] text-slate-400">✂️</div>
                          {showHelperHints && (
                            <div className="absolute top-0.5 right-1 text-[8px] text-slate-400">
                              {animal.legs === 2 ? '👣' : '🐾'}
                            </div>
                          )}
                          <div className="w-13 h-13 flex items-center justify-center my-auto">
                            <AnimalIllustration animalId={animal.id} mode={colorMode} />
                          </div>
                          <div className="w-full bg-slate-50 border-t border-slate-100 rounded-b-lg py-0.5">
                            <span className="text-[11px] font-black text-slate-900 font-['Fredoka',sans-serif]">
                              {animal.nameNikud}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <footer className="pt-2 border-t border-slate-200 text-center text-[10px] text-slate-400 font-mono flex items-center justify-between">
                    <span>דף פעילות משולב • מותאם להדפסה ב-A4</span>
                    <span>מיון 2 רגליים מול 4 רגליים</span>
                  </footer>
                </div>
              </div>
            ) : (
              
              /* ========================================================
                 OPTION C: TEMPLATE B - LINE MATCHING (מתיחת קו)
                 ======================================================== */
              <div
                style={{
                  transform: `scale(${previewZoom / 100})`,
                  transformOrigin: 'top center',
                  transition: 'transform 0.15s ease-out'
                }}
                className="print-sheet-wrapper"
              >
                <div
                  ref={combinedSheetRef}
                  id="animal-line-matching-page"
                  className={`a4-page bg-white text-slate-900 shadow-2xl relative flex flex-col justify-between overflow-hidden ${getBorderClasses()}`}
                  style={{
                    width: '210mm',
                    height: '297mm',
                    minHeight: '297mm',
                    maxHeight: '297mm',
                    padding: '12mm',
                    boxSizing: 'border-box'
                  }}
                >
                  {/* Header */}
                  <header className="border-b-2 border-slate-300 pb-2.5 mb-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <h1 className="text-2xl font-black text-slate-900 leading-tight">
                          {worksheetTitle}
                        </h1>
                        <p className="text-xs font-semibold text-slate-600 mt-0.5">
                          {worksheetSubtitle} • מתיחת קו
                        </p>
                      </div>

                      <div className="flex flex-col gap-1 text-xs font-bold text-slate-700 min-w-[210px]">
                        {showStudentName && (
                          <div className="flex items-center gap-1 border-b border-slate-400 pb-0.5">
                            <span className="text-slate-500 font-medium">שם הילד/ה:</span>
                            <span className="flex-1 text-slate-800">___________________</span>
                          </div>
                        )}
                        {showKindergartenName && (
                          <div className="flex items-center justify-between gap-2 border-b border-slate-400 pb-0.5 text-[11px]">
                            <span className="text-slate-500 font-medium">גן: _________________</span>
                            <span className="text-slate-500 font-medium">תאריך: ____________</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </header>

                  {/* Banner */}
                  <div className="bg-indigo-50/90 rounded-xl py-2 px-3 text-center text-xs font-bold text-indigo-950 border border-indigo-200 mb-2">
                    ✏️ משימה: מתחו קו בעיפרון או צבע מכל חיה אל הקבוצה המתאימה שלה!
                  </div>

                  {/* Two Main Stations */}
                  <div className="grid grid-cols-2 gap-6 my-2">
                    <div className="border-3 border-amber-400 bg-amber-50/60 rounded-2xl p-3 flex items-center justify-between shadow-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="text-3xl">👣</span>
                        <div>
                          <span className="text-base font-black text-amber-950 block">
                            הולכים על שתיים
                          </span>
                          <span className="text-[11px] font-semibold text-amber-800">
                            (2 רגליים)
                          </span>
                        </div>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 border-amber-600 bg-amber-300 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-amber-800"></div>
                      </div>
                    </div>

                    <div className="border-3 border-sky-400 bg-sky-50/60 rounded-2xl p-3 flex items-center justify-between shadow-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="text-3xl">🐾</span>
                        <div>
                          <span className="text-base font-black text-sky-950 block">
                            הולכים על ארבע
                          </span>
                          <span className="text-[11px] font-semibold text-sky-800">
                            (4 רגליים)
                          </span>
                        </div>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 border-sky-600 bg-sky-300 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-sky-800"></div>
                      </div>
                    </div>
                  </div>

                  {/* Animals Grid with Line Anchors */}
                  <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-3 p-3 items-center">
                    {currentWorksheetAnimals.map((animal) => (
                      <div
                        key={animal.id}
                        className="flex items-center justify-between border-2 border-slate-300 rounded-2xl p-2 bg-white shadow-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12">
                            <AnimalIllustration animalId={animal.id} mode={colorMode} />
                          </div>
                          <div>
                            <span className="text-sm font-black text-slate-900 block font-['Fredoka',sans-serif]">
                              {animal.nameNikud}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {animal.description}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold text-slate-400">מתחו מכאן</span>
                          <div className="w-4 h-4 rounded-full border-2 border-slate-600 bg-slate-100 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <footer className="pt-2 border-t border-slate-200 text-center text-[10px] text-slate-400 font-mono flex items-center justify-between">
                    <span>דף פעילות מתיחת קו • מותאם ל-A4</span>
                    <span>פיתוח מיומנות אחיזת עיפרון והבחנה חזותית</span>
                  </footer>
                </div>
              </div>
            )}

          </div>
        </section>
      </div>
    </div>
  );
};
