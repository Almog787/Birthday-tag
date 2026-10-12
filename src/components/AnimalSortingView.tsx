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
  MousePointerClick
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  AnimalItem,
  AnimalWorksheetTemplate,
  AnimalWorksheetColorMode,
  AnimalWorksheetBorder
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
  trackAnimalPDFDownload
} from '../analytics';

interface AnimalSortingViewProps {
  onBackToTags?: () => void;
}

export const AnimalSortingView: React.FC<AnimalSortingViewProps> = () => {
  // Activity Settings State
  const [template, setTemplate] = useState<AnimalWorksheetTemplate>('cut_and_paste');
  const [colorMode, setColorMode] = useState<AnimalWorksheetColorMode>('color');
  const [borderStyle, setBorderStyle] = useState<AnimalWorksheetBorder>('kindergarten');
  const [cardsCount, setCardsCount] = useState<number>(8); // 6, 8, 10

  // Text Customization
  const [worksheetTitle, setWorksheetTitle] = useState<string>('מיון חיות: מי הולך על שתיים ומי על ארבע?');
  const [worksheetSubtitle, setWorksheetSubtitle] = useState<string>('דף פעילות וגזירה לגיל הרך');
  const [showStudentName, setShowStudentName] = useState<boolean>(true);
  const [showKindergartenName, setShowKindergartenName] = useState<boolean>(true);
  const [kindergartenName, setKindergartenName] = useState<string>('גן הילדים');

  // Selected Animals
  const [selectedAnimalIds, setSelectedAnimalIds] = useState<string[]>(DEFAULT_SELECTED_ANIMAL_IDS);
  const [animalSearch, setAnimalSearch] = useState<string>('');
  const [animalFilter, setAnimalFilter] = useState<'all' | '2' | '4'>('all');

  // Interactive Digital Mode (Testing / Solving in browser)
  const [placedAnimals, setPlacedAnimals] = useState<Record<string, 2 | 4>>({});
  const [isInteractiveMode, setIsInteractiveMode] = useState<boolean>(false);

  // Export State
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<string>('');
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [previewZoom, setPreviewZoom] = useState<number>(85); // 85%

  const sheetRef = useRef<HTMLDivElement>(null);

  // Selected animals list (sliced to cardsCount)
  const currentWorksheetAnimals = useMemo(() => {
    const list = ANIMALS_DATABASE.filter((a) => selectedAnimalIds.includes(a.id));
    return list.slice(0, cardsCount);
  }, [selectedAnimalIds, cardsCount]);

  // Animals grouped by legs
  const twoLeggedAnimals = useMemo(
    () => ANIMALS_DATABASE.filter((a) => a.legs === 2),
    []
  );
  const fourLeggedAnimals = useMemo(
    () => ANIMALS_DATABASE.filter((a) => a.legs === 4),
    []
  );

  // Balanced Random Pick (half 2-legs, half 4-legs)
  const handleRandomPick = () => {
    const half = Math.floor(cardsCount / 2);
    const shuffledTwo = [...twoLeggedAnimals].sort(() => 0.5 - Math.random()).slice(0, half);
    const shuffledFour = [...fourLeggedAnimals].sort(() => 0.5 - Math.random()).slice(0, cardsCount - half);
    const combined = [...shuffledTwo, ...shuffledFour].sort(() => 0.5 - Math.random());
    const newIds = combined.map((a) => a.id);
    setSelectedAnimalIds(newIds);
    setPlacedAnimals({});
    trackAnimalRandomPick(cardsCount);
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

  // Select all or reset default
  const handleResetDefaults = () => {
    setSelectedAnimalIds(DEFAULT_SELECTED_ANIMAL_IDS);
    setCardsCount(8);
    setWorksheetTitle('מיון חיות: מי הולך על שתיים ומי על ארבע?');
    setWorksheetSubtitle('דף פעילות וגזירה לגיל הרך');
    setColorMode('color');
    setTemplate('cut_and_paste');
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

  // Export to PDF
  const handleDownloadPDF = async () => {
    if (!sheetRef.current) return;
    setIsExporting(true);
    setExportError(null);
    setExportSuccess(false);
    setExportProgress('מכין את קובץ ה-PDF באיכות הדפסה גבוהה...');
    trackAnimalPDFDownload(template, colorMode, currentWorksheetAnimals.length);

    try {
      const scale = 2; // high resolution for crisp print
      const canvas = await html2canvas(sheetRef.current, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false
      });

      setExportProgress('מעבד דף A4...');
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      const filename = `דף_פעילות_מיון_חיות_${template === 'cut_and_paste' ? 'גזירה_והדבקה' : 'מתיחת_קו'}.pdf`;
      pdf.save(filename);

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
      {/* Notifications */}
      {exportSuccess && (
        <div className="no-print bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-center text-sm font-bold flex items-center justify-center gap-2 shadow-md">
          <CheckCircle2 className="w-5 h-5" />
          <span>דף הפעילות וההדפסה הופק והורד בהצלחה כקובץ PDF! 🎉</span>
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

      {/* Main Grid: Controls Sidebar (Left in RTL, Col 4) & Preview Section (Right in RTL, Col 8) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SIDEBAR CONTROLS */}
        <aside className="no-print lg:col-span-5 xl:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>🐾</span>
                <span>הגדרות דף הפעילות</span>
              </h2>
              <p className="text-xs text-slate-500">
                התאמה אישית, בחירת חיות והדפסת PDF
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

          {/* 1. Template Choice */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              סוג הפעילות (תבנית):
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
                  לוח מיון עליון + כרטיסיות לגזירה למטה
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
                  חיבור בקו מעודד אחיזת עיפרון ומיומנות
                </span>
              </button>
            </div>
          </div>

          {/* 2. Color Mode: Full Color vs B&W Coloring Book Mode */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              סגנון הדפסה וצבע:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  trackAnimalColorModeChange('color');
                  setColorMode('color');
                }}
                className={`p-2.5 rounded-xl border text-right transition-all flex items-center gap-2 ${
                  colorMode === 'color'
                    ? 'border-amber-500 bg-amber-50/80 font-bold ring-2 ring-amber-200'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <span className="text-lg">🎨</span>
                <div>
                  <div className="text-xs font-bold text-slate-900">צבעוני מלא</div>
                  <div className="text-[10px] text-slate-500">איורים עשירים וצבעוניים</div>
                </div>
              </button>

              <button
                onClick={() => {
                  trackAnimalColorModeChange('coloring_book');
                  setColorMode('coloring_book');
                }}
                className={`p-2.5 rounded-xl border text-right transition-all flex items-center gap-2 ${
                  colorMode === 'coloring_book'
                    ? 'border-slate-700 bg-slate-100 font-bold ring-2 ring-slate-300'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <span className="text-lg">🖍️</span>
                <div>
                  <div className="text-xs font-bold text-slate-900">דף צביעה (שחור-לבן)</div>
                  <div className="text-[10px] text-slate-500">קווי מתאר, חוסך דיו</div>
                </div>
              </button>
            </div>
          </div>

          {/* 3. Number of Cards in Sheet */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                מספר כרטיסיות בדף:
              </label>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                {cardsCount} חיות
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { count: 6, label: '6 חיות', desc: 'מתחילים (3-4)' },
                { count: 8, label: '8 חיות', desc: 'מומלץ לגן' },
                { count: 10, label: '10 חיות', desc: 'מתקדם' }
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
                  <div className="text-[10px] opacity-75">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Balanced Random Pick & Action Buttons */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">בחירה מהירה ומאוזנת:</span>
              <span className="text-[11px] text-slate-500">חצי על שתיים וחצי על ארבע</span>
            </div>
            <button
              onClick={handleRandomPick}
              className="w-full py-2 px-3 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>ערבב ובחר {cardsCount} חיות באופן אקראי ומאוזן 🎲</span>
            </button>
          </div>

          {/* 5. Title & Kindergarten Name Customization */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                כותרת ראשית של דף הפעילות:
              </label>
              <input
                type="text"
                value={worksheetTitle}
                onChange={(e) => setWorksheetTitle(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none bg-white"
                placeholder="למשל: מיון חיות: מי על 2 ומי על 4?"
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
                placeholder="למשל: דף עבודה - גן שושנים"
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

          {/* 6. Border Style Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              מסגרת דקורטיבית לדף A4:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'kindergarten', label: '🎨 גן עליז', desc: 'מסגרת צבעונית חמה' },
                { id: 'dots', label: '✂️ קו מקווקו', desc: 'בסגנון חוברת עבודה' },
                { id: 'double', label: '📜 קו כפול', desc: 'מסגרת קלאסית' },
                { id: 'clean', label: '◻️ נקייה', desc: 'קו פשוט ומינימליסטי' }
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

          {/* 7. Bank of Animals Picker (Checkboxes) */}
          <div className="pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800">
                בנק החיות המובנה ({ANIMALS_DATABASE.length} חיות):
              </span>
              <span className="text-[11px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-md">
                נבחרו {currentWorksheetAnimals.length} מתוך {cardsCount}
              </span>
            </div>

            {/* Filter buttons */}
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

            {/* Scrollable Animals List */}
            <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 text-xs">
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
                          ? 'border-emerald-400 bg-emerald-50/60 font-bold'
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

                    <div className="flex items-center gap-1.5">
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
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Screen Practice Toggle */}
          <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-purple-900 block flex items-center gap-1">
                  <MousePointerClick className="w-3.5 h-3.5" />
                  <span>אימון ותרגול אינטראקטיבי על המסך:</span>
                </span>
                <span className="text-[11px] text-purple-700">
                  מאפשר לילד/ה לשבץ חיות בלחיצה ישירות בדפדפן!
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
                    נקה לוח
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Direct Print & PDF Export Buttons */}
          <div className="pt-2 border-t border-slate-200 space-y-2.5">
            <button
              onClick={handleDownloadPDF}
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
                  <span>הורד דף פעילות כקובץ PDF מוכן להדפסה</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="w-full py-2.5 px-4 font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>הדפסה ישירה במדפסת (A4 מלא)</span>
            </button>
          </div>
        </aside>

        {/* RIGHT PREVIEW SECTION (Col 8) */}
        <section className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
          {/* Top Preview Control Bar */}
          <div className="no-print bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-800">תצוגת דף A4:</span>
              <span className="text-xs bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded-md">
                {template === 'cut_and_paste' ? '✂️ גזירה והדבקה' : '✏️ מתיחת קו'}
              </span>
              <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-md">
                {colorMode === 'color' ? '🎨 צבעוני מלא' : '🖍️ דף צביעה שחור-לבן'}
              </span>
              <span className="text-[11px] text-slate-400">
                {currentWorksheetAnimals.length} כרטיסיות חיות
              </span>
            </div>

            {/* Preview Zoom Controls */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-slate-500 ml-1">זום תצוגה:</span>
              {[50, 70, 85, 100].map((zoomVal) => (
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

          {/* Printable A4 Container with Zoom Scaling */}
          <div className="flex justify-center overflow-x-auto pb-8">
            <div
              style={{
                transform: `scale(${previewZoom / 100})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease-out'
              }}
              className="print-sheet-wrapper"
            >
              {/* THE A4 PRINTABLE SHEET (Exact 210mm x 297mm proportions) */}
              <div
                ref={sheetRef}
                id="animal-worksheet-a4"
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
                {/* Decorative border embellishments (if kindergarten festive style) */}
                {borderStyle === 'kindergarten' && (
                  <>
                    <div className="absolute top-2 left-3 text-base opacity-75">🎈⭐</div>
                    <div className="absolute top-2 right-3 text-base opacity-75">⭐🎉</div>
                    <div className="absolute bottom-2 left-3 text-base opacity-75">🐾🌿</div>
                    <div className="absolute bottom-2 right-3 text-base opacity-75">🌿👣</div>
                  </>
                )}

                {/* 1. WORKSHEET HEADER AREA */}
                <header className="border-b-2 border-slate-300 pb-2.5 mb-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <h1 className="text-2xl font-black text-slate-900 leading-tight">
                        {worksheetTitle}
                      </h1>
                      <p className="text-xs font-semibold text-slate-600 mt-0.5">
                        {worksheetSubtitle}
                      </p>
                    </div>

                    {/* Student name and Kindergarten info boxes */}
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

                {/* 2. TEMPLATE A: CUT & PASTE (גזירה והדבקה) */}
                {template === 'cut_and_paste' ? (
                  <div className="flex-1 flex flex-col justify-between">
                    {/* Instructions Banner */}
                    <div className="bg-slate-100/90 rounded-xl py-1.5 px-3 text-center text-xs font-bold text-slate-800 border border-slate-200">
                      🎯 משימה: גזרו את כרטיסיות החיות שבתחתית הדף והדביקו כל חיה בעמודה הנכונה!
                    </div>

                    {/* 2 MAIN SORTING COLUMNS (Top Board) */}
                    <div className="grid grid-cols-2 gap-4 my-2 flex-1 max-h-[148mm]">
                      {/* Column 1: הולכים על שתיים (2 רגליים) */}
                      <div className="flex flex-col border-2 border-dashed border-amber-400 bg-amber-50/40 rounded-2xl p-2.5 relative">
                        <div className="flex items-center justify-center gap-2 bg-amber-200/80 text-amber-950 font-black py-1 px-3 rounded-xl text-sm shadow-xs mb-2">
                          <span className="text-lg">👣</span>
                          <span>הולכים על שתיים (2 רגליים)</span>
                        </div>

                        {/* Drop zone / Target pasting slots */}
                        <div className="flex-1 grid grid-cols-2 gap-2 p-1.5 rounded-xl border border-amber-200/80 bg-white/70 overflow-hidden items-center justify-items-center">
                          {isInteractiveMode ? (
                            // Render placed animals in interactive mode
                            currentWorksheetAnimals
                              .filter((a) => placedAnimals[a.id] === 2)
                              .map((a) => (
                                <div
                                  key={a.id}
                                  className="w-[38mm] h-[34mm] border-2 border-emerald-500 bg-emerald-50 rounded-xl p-1 flex flex-col items-center justify-center shadow-xs animate-scale-up"
                                >
                                  <div className="w-12 h-12">
                                    <AnimalIllustration animalId={a.id} mode={colorMode} />
                                  </div>
                                  <span className="text-xs font-black text-slate-800">
                                    {a.nameNikud}
                                  </span>
                                </div>
                              ))
                          ) : (
                            // Guide outline placeholders for physical pasting
                            Array.from({ length: 4 }).map((_, idx) => (
                              <div
                                key={idx}
                                className="w-full h-full min-h-[30mm] border border-dashed border-amber-300 rounded-xl flex flex-col items-center justify-center text-amber-400/80 p-2 text-center"
                              >
                                <span className="text-xl opacity-40">👣</span>
                                <span className="text-[10px] font-semibold opacity-60">
                                  מקום להדבקה {idx + 1}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Column 2: הולכים על ארבע (4 רגליים) */}
                      <div className="flex flex-col border-2 border-dashed border-sky-400 bg-sky-50/40 rounded-2xl p-2.5 relative">
                        <div className="flex items-center justify-center gap-2 bg-sky-200/80 text-sky-950 font-black py-1 px-3 rounded-xl text-sm shadow-xs mb-2">
                          <span className="text-lg">🐾</span>
                          <span>הולכים על ארבע (4 רגליים)</span>
                        </div>

                        {/* Drop zone / Target pasting slots */}
                        <div className="flex-1 grid grid-cols-2 gap-2 p-1.5 rounded-xl border border-sky-200/80 bg-white/70 overflow-hidden items-center justify-items-center">
                          {isInteractiveMode ? (
                            // Render placed animals in interactive mode
                            currentWorksheetAnimals
                              .filter((a) => placedAnimals[a.id] === 4)
                              .map((a) => (
                                <div
                                  key={a.id}
                                  className="w-[38mm] h-[34mm] border-2 border-emerald-500 bg-emerald-50 rounded-xl p-1 flex flex-col items-center justify-center shadow-xs animate-scale-up"
                                >
                                  <div className="w-12 h-12">
                                    <AnimalIllustration animalId={a.id} mode={colorMode} />
                                  </div>
                                  <span className="text-xs font-black text-slate-800">
                                    {a.nameNikud}
                                  </span>
                                </div>
                              ))
                          ) : (
                            // Guide outline placeholders for physical pasting
                            Array.from({ length: 4 }).map((_, idx) => (
                              <div
                                key={idx}
                                className="w-full h-full min-h-[30mm] border border-dashed border-sky-300 rounded-xl flex flex-col items-center justify-center text-sky-400/80 p-2 text-center"
                              >
                                <span className="text-xl opacity-40">🐾</span>
                                <span className="text-[10px] font-semibold opacity-60">
                                  מקום להדבקה {idx + 1}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>

                    {/* CUTTING DIVIDER LINE */}
                    <div className="my-1.5 relative flex items-center justify-center">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t-2 border-dashed border-slate-400"></div>
                      </div>
                      <div className="relative bg-white px-3 py-0.5 rounded-full border border-slate-300 text-[11px] font-bold text-slate-600 flex items-center gap-1.5 shadow-xs">
                        <Scissors className="w-3.5 h-3.5 text-rose-500 rotate-90" />
                        <span>גזרו לאורך הקו המקווקו את כרטיסיות החיות והדביקו למעלה</span>
                        <Scissors className="w-3.5 h-3.5 text-rose-500 -rotate-90" />
                      </div>
                    </div>

                    {/* BOTTOM HALF: CUTOUT CARDS GRID (Uniform Squares ~4.5cm x 4.5cm) */}
                    <div className="pt-1">
                      <div
                        className={`grid gap-2.5 justify-center ${
                          cardsCount === 6
                            ? 'grid-cols-6'
                            : cardsCount === 10
                            ? 'grid-cols-5'
                            : 'grid-cols-4'
                        }`}
                      >
                        {currentWorksheetAnimals.map((animal) => {
                          const isPlaced = isInteractiveMode && placedAnimals[animal.id];

                          return (
                            <div
                              key={animal.id}
                              className={`relative border-2 border-dashed border-slate-400 rounded-xl p-1.5 flex flex-col items-center justify-between bg-white text-center transition-all ${
                                isInteractiveMode ? 'cursor-pointer hover:border-rose-400 hover:shadow-md' : ''
                              } ${isPlaced ? 'opacity-30 line-through' : ''}`}
                              style={{
                                width: cardsCount === 10 ? '33mm' : '41mm',
                                height: cardsCount === 10 ? '33mm' : '40mm',
                                boxSizing: 'border-box'
                              }}
                              onClick={() => {
                                if (isInteractiveMode) {
                                  // toggle placement
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
                              {/* Scissors cut indicator in top-left */}
                              <div className="absolute top-0.5 left-1 text-[9px] text-slate-400 flex items-center">
                                ✂️
                              </div>

                              {/* Animal Vector Illustration */}
                              <div className="w-14 h-14 flex items-center justify-center my-auto">
                                <AnimalIllustration animalId={animal.id} mode={colorMode} />
                              </div>

                              {/* Hebrew Vocalized Name */}
                              <div className="w-full bg-slate-50 border-t border-slate-100 rounded-b-lg py-0.5">
                                <span className="text-xs font-black text-slate-900 tracking-wide font-['Fredoka',sans-serif]">
                                  {animal.nameNikud}
                                </span>
                              </div>

                              {/* Interactive quick buttons when in digital practice */}
                              {isInteractiveMode && !isPlaced && (
                                <div className="absolute -bottom-2 flex gap-1 z-10">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleInteractiveClassify(animal.id, 2);
                                    }}
                                    className="text-[9px] bg-amber-500 text-white font-bold px-1.5 py-0.5 rounded shadow-xs"
                                    title="שבץ ב-2 רגליים"
                                  >
                                    2 👣
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleInteractiveClassify(animal.id, 4);
                                    }}
                                    className="text-[9px] bg-sky-500 text-white font-bold px-1.5 py-0.5 rounded shadow-xs"
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
                  </div>
                ) : (
                  /* 3. TEMPLATE B: LINE MATCHING (מתיחת קו) */
                  <div className="flex-1 flex flex-col justify-between py-1">
                    {/* Instructions Banner */}
                    <div className="bg-indigo-50/90 rounded-xl py-2 px-3 text-center text-xs font-bold text-indigo-950 border border-indigo-200">
                      ✏️ משימה: מתחו קו בעיפרון או צבע מכל חיה אל הקבוצה המתאימה שלה!
                    </div>

                    {/* TWO DESTINATION STATIONS (Top) */}
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

                    {/* ANIMALS GRID WITH MATCHING ANCHOR DOTS */}
                    <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-3 p-3 items-center">
                      {currentWorksheetAnimals.map((animal, idx) => (
                        <div
                          key={animal.id}
                          className="flex items-center justify-between border-2 border-slate-300 rounded-2xl p-2 bg-white shadow-xs relative"
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

                          {/* Line matching dot / anchor for drawing */}
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-semibold text-slate-400">מתחו מכאן</span>
                            <div className="w-4 h-4 rounded-full border-2 border-slate-600 bg-slate-100 flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. FOOTER NOTE */}
                <footer className="pt-2 border-t border-slate-200 text-center text-[10px] text-slate-400 font-mono flex items-center justify-between">
                  <span>דף פעילות להדפסה • מותאם ל-A4 ולגזירה לגיל הרך</span>
                  <span>לימוד והבחנה: בעלי חיים והולכים על 2 מול 4</span>
                </footer>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
