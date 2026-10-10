import React, { useState, useRef, useEffect } from 'react';
import {
  Printer,
  Download,
  Plus,
  Trash2,
  RefreshCw,
  Palette,
  Scissors,
  Check,
  Search,
  Sparkles,
  RotateCcw,
  Sliders,
  Type,
  FileText,
  Calendar,
  Copy,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Upload,
  Settings,
  Sparkle
} from 'lucide-react';
import jsPDF from 'jspdf';
import { toJpeg, toPng } from 'html-to-image';
import html2canvas from 'html2canvas';

import {
  TagItem,
  ThemePreset,
  BackgroundPattern,
  GradientStyle,
  ColorPalette
} from './types';
import {
  INITIAL_TAGS,
  THEMES,
  COLOR_PALETTES,
  BG_PATTERNS,
  GRADIENT_STYLES,
  FONTS,
  ICONS
} from './constants';
import { BulkImportModal } from './components/BulkImportModal';
import { KindergartenTableView } from './components/KindergartenTableView';

export default function App() {
  // Main View Switcher: 'tags' (Birthday Tags) vs 'tables' (Kindergarten Tracking Tables)
  const [mainView, setMainView] = useState<'tags' | 'tables'>('tags');

  // Tags State with localStorage persistence
  const [tags, setTags] = useState<TagItem[]>(() => {
    try {
      const saved = localStorage.getItem('birthday_tags_list_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load tags from localStorage', e);
    }
    return INITIAL_TAGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('birthday_tags_list_v2', JSON.stringify(tags));
    } catch (e) {
      console.warn('Failed to save tags to localStorage', e);
    }
  }, [tags]);

  // Design & Modifiers State
  const [selectedTheme, setSelectedTheme] = useState<ThemePreset>(THEMES[0]);
  const [customTitle, setCustomTitle] = useState<string>('יום הולדת שמח ל');
  const [showScissorMarks, setShowScissorMarks] = useState<boolean>(true);
  const [borderStyle, setBorderStyle] = useState<'dashed' | 'solid' | 'double'>('dashed');
  const [tagsPerPage, setTagsPerPage] = useState<number>(10); // 8, 10, 12, 15
  const [selectedIcon, setSelectedIcon] = useState<string>('🎈');
  const [selectedFont, setSelectedFont] = useState<string>(THEMES[0].fontFamily);
  const [dateFormat, setDateFormat] = useState<'standard' | 'hebrew_prefix'>('standard');
  const [showCornerCrop, setShowCornerCrop] = useState<boolean>(true);
  const [previewZoom, setPreviewZoom] = useState<number>(85); // 85%
  const [activeTab, setActiveTab] = useState<'design' | 'names' | 'print'>('design');

  // Specific user requirements: Date placement directly under name and size equal to name
  const [showDate, setShowDate] = useState<boolean>(true);
  const [datePlacement, setDatePlacement] = useState<'under_name' | 'bottom'>('under_name');
  const [dateSize, setDateSize] = useState<'large' | 'medium'>('large');
  const [showGreeting, setShowGreeting] = useState<boolean>(true);
  const [showDecorations, setShowDecorations] = useState<boolean>(true);

  // Background & Color Customization State
  const [selectedPattern, setSelectedPattern] = useState<string>(THEMES[0].patternStyle);
  const [selectedPalette, setSelectedPalette] = useState<string>('rose');
  const [selectedGradient, setSelectedGradient] = useState<string>('solid');
  const [customBorderColor, setCustomBorderColor] = useState<string>('');

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState<string>('');

  // New Item Inputs
  const [newName, setNewName] = useState<string>('');
  const [newDate, setNewDate] = useState<string>('');

  // Bulk Import Modal State
  const [isBulkModalOpen, setIsBulkModalOpen] = useState<boolean>(false);

  // PDF Generation Progress & Feedback
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<string>('');
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);

  // Refs
  const printPagesRef = useRef<HTMLDivElement>(null);

  // Filtered tags for manager tab
  const filteredTags = tags.filter(
    (t) => t.name.includes(searchTerm) || t.date.includes(searchTerm)
  );

  // Add new tag
  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const item: TagItem = {
      id: Date.now().toString(),
      name: newName.trim(),
      date: newDate.trim() || '01.01'
    };
    setTags([...tags, item]);
    setNewName('');
    setNewDate('');
  };

  // Delete tag
  const handleDeleteTag = (id: string) => {
    setTags(tags.filter((t) => t.id !== id));
  };

  // Update tag
  const handleUpdateTag = (id: string, name: string, date: string) => {
    setTags(tags.map((t) => (t.id === id ? { ...t, name, date } : t)));
  };

  // Reset to original 29 tags
  const handleResetToOriginal = () => {
    if (window.confirm('האם לשחזר את הרשימה המקורית של 29 הילדים?')) {
      setTags(INITIAL_TAGS);
    }
  };

  // Duplicate tag
  const handleDuplicateTag = (tag: TagItem) => {
    const copyTag: TagItem = {
      id: Date.now().toString(),
      name: tag.name,
      date: tag.date
    };
    setTags([...tags, copyTag]);
  };

  // Bulk import callback
  const handleBulkImport = (newTags: TagItem[]) => {
    setTags(newTags);
  };

  // Presets for tag modes (Mode 1: Full, Mode 2: Clean without illustrations, Mode 3: Name only)
  const handleSetTagMode = (mode: 'full' | 'clean' | 'name_only') => {
    if (mode === 'full') {
      setShowDate(true);
      setDatePlacement('under_name');
      setDateSize('large');
      setShowGreeting(true);
      setShowDecorations(true);
      setShowScissorMarks(true);
    } else if (mode === 'clean') {
      setShowDate(true);
      setDatePlacement('under_name');
      setDateSize('large');
      setShowGreeting(false);
      setShowDecorations(false);
      setShowScissorMarks(true);
    } else if (mode === 'name_only') {
      setShowDate(false);
      setShowGreeting(false);
      setShowDecorations(false);
      setShowScissorMarks(true);
    }
  };

  // Calculate pagination pages
  const totalPages = Math.ceil(tags.length / tagsPerPage) || 1;
  const pagesArray = Array.from({ length: totalPages }, (_, i) => i);

  // Get grid dimensions class
  const getGridClass = () => {
    switch (tagsPerPage) {
      case 8:
        return 'grid-cols-2 grid-rows-4 gap-4 p-6'; // 2x4
      case 12:
        return 'grid-cols-3 grid-rows-4 gap-3 p-5'; // 3x4
      case 15:
        return 'grid-cols-3 grid-rows-5 gap-2.5 p-4'; // 3x5
      case 10:
      default:
        return 'grid-cols-2 grid-rows-5 gap-3.5 p-5'; // 2x5
    }
  };

  // PDF Export for Birthday Tags
  const handleDownloadPDF = async () => {
    if (!printPagesRef.current) return;
    setIsExporting(true);
    setExportError(null);
    setExportSuccess(false);
    setExportProgress('מכין את קובץ ה-PDF...');

    try {
      if (document.fonts?.ready) {
        try {
          await document.fonts.ready;
        } catch {
          // ignore
        }
      }

      const PDFDoc = typeof jsPDF === 'function' ? jsPDF : (jsPDF as any).jsPDF;
      const pdf = new PDFDoc({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const pageElements = Array.from(
        printPagesRef.current.querySelectorAll('.a4-print-page')
      ) as HTMLElement[];

      if (pageElements.length === 0) {
        throw new Error('לא נמצאו דפים להדפסה.');
      }

      for (let i = 0; i < pageElements.length; i++) {
        setExportProgress(`מעבד דף ${i + 1} מתוך ${pageElements.length}...`);
        const pageEl = pageElements[i];

        const originalTransform = pageEl.style.transform;
        const originalMargin = pageEl.style.margin;
        const originalBoxShadow = pageEl.style.boxShadow;

        let imgData: string | null = null;

        try {
          pageEl.style.transform = 'none';
          pageEl.style.margin = '0';
          pageEl.style.boxShadow = 'none';

          await new Promise((resolve) => setTimeout(resolve, 70));

          // Tier 1: toJpeg with high quality
          try {
            imgData = await toJpeg(pageEl, {
              quality: 0.95,
              pixelRatio: 2,
              backgroundColor: '#ffffff',
              cacheBust: true,
              filter: (node) => !(node instanceof HTMLElement && node.classList.contains('no-print'))
            });
          } catch (fontErr) {
            console.warn('toJpeg with fonts failed, attempting toJpeg with skipFonts:', fontErr);
            // Tier 2: toJpeg with skipFonts
            try {
              imgData = await toJpeg(pageEl, {
                quality: 0.95,
                pixelRatio: 2,
                backgroundColor: '#ffffff',
                cacheBust: true,
                skipFonts: true,
                filter: (node) => !(node instanceof HTMLElement && node.classList.contains('no-print'))
              });
            } catch (jpegErr) {
              console.warn('toJpeg failed, attempting toPng:', jpegErr);
              // Tier 3: toPng
              try {
                imgData = await toPng(pageEl, {
                  pixelRatio: 1.5,
                  backgroundColor: '#ffffff',
                  skipFonts: true,
                  filter: (node) => !(node instanceof HTMLElement && node.classList.contains('no-print'))
                });
              } catch (pngErr) {
                console.warn('html-to-image failed, falling back to html2canvas:', pngErr);
                // Tier 4: html2canvas
                const canvas = await html2canvas(pageEl, {
                  scale: 2,
                  useCORS: true,
                  backgroundColor: '#ffffff',
                  ignoreElements: (el) => el.classList.contains('no-print')
                });
                imgData = canvas.toDataURL('image/jpeg', 0.95);
              }
            }
          }
        } finally {
          pageEl.style.transform = originalTransform;
          pageEl.style.margin = originalMargin;
          pageEl.style.boxShadow = originalBoxShadow;
        }

        if (!imgData) {
          throw new Error(`שגיאה בלכידת תוכן דף ${i + 1}`);
        }

        if (i > 0) {
          pdf.addPage('a4', 'portrait');
        }

        const imageFormat = imgData.startsWith('data:image/png') ? 'PNG' : 'JPEG';
        pdf.addImage(imgData, imageFormat, 0, 0, 210, 297, undefined, 'FAST');
      }

      setExportProgress('מייצר קובץ ומוריד...');
      const fileName = `כרטיסי_יום_הולדת_${tags.length}_תגים.pdf`;

      try {
        pdf.save(fileName);
      } catch (saveErr) {
        console.warn('pdf.save failed, using blob URL download fallback:', saveErr);
        const blob = pdf.output('blob');
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 1500);
      }

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 5000);
    } catch (err: any) {
      console.error('PDF export error:', err);
      setExportError(err?.message || 'אירעה שגיאה ביצירת ה-PDF. ניתן להשתמש בהדפסה ישירה.');
    } finally {
      setIsExporting(false);
      setExportProgress('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-['Assistant',sans-serif] text-slate-800" dir="rtl">
      
      {/* Top Header Navigation */}
      <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center text-white shadow-md font-extrabold text-xl shrink-0">
              {mainView === 'tags' ? '🎈' : '📋'}
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                {mainView === 'tags' ? 'מעצב תגי יום הולדת לילדים' : 'טבלאות ומעקב מעוצבות לגן'}
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                {mainView === 'tags'
                  ? `עיצוב תגים, תאריכים מוגדלים והורדת PDF (${tags.length} ילדים)`
                  : `מעקב ציוד, מגבונים ותורנויות שבת להדפסה ול-PDF`}
              </p>
            </div>
          </div>

          {/* Module Switcher Tabs in Center / Right */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setMainView('tags')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                mainView === 'tags'
                  ? 'bg-white text-rose-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🎈</span>
              <span>תגי יום הולדת</span>
            </button>

            <button
              onClick={() => setMainView('tables')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                mainView === 'tables'
                  ? 'bg-white text-rose-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-rose-500" />
              <span>טבלאות מעקב לגן</span>
            </button>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBulkModalOpen(true)}
              className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors hidden md:flex items-center gap-1.5"
              title="הדבקה מהירה של רשימת ילדים מוואטסאפ או אקסל"
            >
              <Upload className="w-3.5 h-3.5 text-slate-600" />
              <span>הדבקה מהירה</span>
            </button>

            {mainView === 'tags' && (
              <>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
                  title="הדפסה ישירה במדפסת"
                >
                  <Printer className="w-4 h-4 text-slate-600" />
                  <span className="hidden sm:inline">הדפס</span>
                </button>

                <button
                  onClick={handleDownloadPDF}
                  disabled={isExporting}
                  className="px-3.5 py-1.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 rounded-lg shadow-xs hover:shadow transition-all flex items-center gap-1.5 disabled:opacity-50"
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
              </>
            )}
          </div>

        </div>
      </header>

      {/* Alert notifications for Tags PDF export */}
      {exportSuccess && mainView === 'tags' && (
        <div className="no-print bg-emerald-600 text-white px-4 py-2.5 text-center text-sm font-bold flex items-center justify-center gap-2 shadow-md animate-fade-in">
          <CheckCircle2 className="w-5 h-5" />
          <span>קובץ ה-PDF של התגים נוצר והורד בהצלחה! 🎉 מזל טוב לחוגגים!</span>
        </div>
      )}

      {exportError && mainView === 'tags' && (
        <div className="no-print bg-rose-600 text-white px-4 py-3 text-center text-sm font-semibold flex flex-wrap items-center justify-center gap-3 shadow-md">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{exportError}</span>
          <button
            onClick={() => window.print()}
            className="px-3 py-1 bg-white text-rose-700 font-bold rounded-md hover:bg-rose-50 text-xs shadow-xs"
          >
            פתח הדפסה בדפדפן
          </button>
          <button
            onClick={() => setExportError(null)}
            className="text-white/80 hover:text-white text-xs underline"
          >
            סגור
          </button>
        </div>
      )}

      {isExporting && mainView === 'tags' && (
        <div className="no-print bg-indigo-600 text-white px-4 py-2.5 text-center text-sm font-semibold flex items-center justify-center gap-3 shadow-md">
          <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
          <span>{exportProgress || 'מעבד את קובץ ה-PDF, אנא המתן...'}</span>
        </div>
      )}

      {/* Render Active View */}
      {mainView === 'tables' ? (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
          <KindergartenTableView
            tags={tags}
            onSyncFromTags={() => {
              // State is already shared
            }}
          />
        </main>
      ) : (
        /* BIRTHDAY TAGS VIEW */
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left / Right Sidebar Tabs & Controls (lg:col-span-5) */}
          <aside className="no-print lg:col-span-5 flex flex-col gap-4">
            
            {/* Main Navigation Tabs */}
            <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-1">
              <button
                onClick={() => setActiveTab('design')}
                className={`flex-1 py-2 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'design'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Palette className="w-4 h-4" />
                <span>עיצוב ותבניות</span>
              </button>

              <button
                onClick={() => setActiveTab('names')}
                className={`flex-1 py-2 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'names'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>רשימת שמות ({tags.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('print')}
                className={`flex-1 py-2 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'print'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Scissors className="w-4 h-4" />
                <span>הגדרות גזירה</span>
              </button>
            </div>

            {/* TAB 1: DESIGN & STYLING */}
            {activeTab === 'design' && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                
                {/* Tag Presentation Modes (Section 2.A from spec) */}
                <div className="p-3.5 bg-gradient-to-r from-rose-50 to-amber-50 rounded-xl border border-rose-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-rose-600" />
                      <span>מצבי תצוגה מהירים לתגים:</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleSetTagMode('full')}
                      className={`p-2 rounded-lg text-xs font-bold transition-all text-center border ${
                        showDate && showDecorations && showGreeting
                          ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
                      }`}
                    >
                      🌟 מלא
                      <span className="block text-[10px] font-normal opacity-85">שם + תאריך + איורים</span>
                    </button>

                    <button
                      onClick={() => handleSetTagMode('clean')}
                      className={`p-2 rounded-lg text-xs font-bold transition-all text-center border ${
                        showDate && !showDecorations && !showGreeting
                          ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
                      }`}
                    >
                      ✨ נקי
                      <span className="block text-[10px] font-normal opacity-85">שם + תאריך בלבד</span>
                    </button>

                    <button
                      onClick={() => handleSetTagMode('name_only')}
                      className={`p-2 rounded-lg text-xs font-bold transition-all text-center border ${
                        !showDate && !showGreeting && !showDecorations
                          ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
                      }`}
                    >
                      🏷️ שם בלבד
                      <span className="block text-[10px] font-normal opacity-85">טקסט בלבד ללא תאריך</span>
                    </button>
                  </div>
                </div>

                {/* Date Position and Size Controls (User's direct request) */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-rose-500" />
                      <span>הגדרות תאריך הלידה בתג:</span>
                    </span>
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-700">
                      <span>הצג תאריך</span>
                      <input
                        type="checkbox"
                        checked={showDate}
                        onChange={(e) => setShowDate(e.target.checked)}
                        className="w-4 h-4 accent-rose-500 rounded"
                      />
                    </label>
                  </div>

                  {showDate && (
                    <div className="space-y-3 pt-1 border-t border-slate-200">
                      {/* Placement */}
                      <div>
                        <span className="text-[11px] font-bold text-slate-600 block mb-1">
                          מיקום התאריך בכרטיס:
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setDatePlacement('under_name')}
                            className={`py-1.5 px-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                              datePlacement === 'under_name'
                                ? 'bg-rose-500 text-white border-rose-600 font-bold shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            ⭐ ישירות מתחת לשם (מומלץ)
                          </button>
                          <button
                            onClick={() => setDatePlacement('bottom')}
                            className={`py-1.5 px-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                              datePlacement === 'bottom'
                                ? 'bg-rose-500 text-white border-rose-600 font-bold shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            בתחתית הכרטיס
                          </button>
                        </div>
                      </div>

                      {/* Size */}
                      <div>
                        <span className="text-[11px] font-bold text-slate-600 block mb-1">
                          גודל פונט התאריך:
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setDateSize('large')}
                            className={`py-1.5 px-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                              dateSize === 'large'
                                ? 'bg-rose-500 text-white border-rose-600 font-bold shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            🔤 גדול ובולט (כמו השם)
                          </button>
                          <button
                            onClick={() => setDateSize('medium')}
                            className={`py-1.5 px-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                              dateSize === 'medium'
                                ? 'bg-rose-500 text-white border-rose-600 font-bold shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            תאריך קומפקטי
                          </button>
                        </div>
                      </div>

                      {/* Format */}
                      <div>
                        <span className="text-[11px] font-bold text-slate-600 block mb-1">
                          מבנה התאריך:
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setDateFormat('standard')}
                            className={`py-1.5 px-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                              dateFormat === 'standard'
                                ? 'bg-rose-500 text-white border-rose-600 font-bold shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            תאריך בלבד (18.06)
                          </button>
                          <button
                            onClick={() => setDateFormat('hebrew_prefix')}
                            className={`py-1.5 px-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                              dateFormat === 'hebrew_prefix'
                                ? 'bg-rose-500 text-white border-rose-600 font-bold shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            עם קידומת (בתאריך 18.06)
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Theme Selector */}
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2.5">
                    בחירת תבנית נושא מוכנה:
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {THEMES.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => {
                          setSelectedTheme(theme);
                          setSelectedFont(theme.fontFamily);
                          setSelectedIcon(theme.icon);
                          setSelectedPattern(theme.patternStyle);
                          if (theme.borderColorHex) setCustomBorderColor('');
                        }}
                        className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between ${
                          selectedTheme.id === theme.id
                            ? 'border-rose-500 ring-2 ring-rose-200 bg-rose-50/50 font-bold'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <span className="text-xs sm:text-sm">{theme.name}</span>
                        {selectedTheme.id === theme.id && (
                          <Check className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Background Color Palette Selection */}
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                    גווני צבע לרקע ולכרטיסים:
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {COLOR_PALETTES.map((palette) => (
                      <button
                        key={palette.id}
                        onClick={() => {
                          setSelectedPalette(palette.id);
                          setSelectedTheme((prev) => ({
                            ...prev,
                            cardBg: palette.cardBg,
                            borderColor: palette.borderColor,
                            borderColorHex: palette.borderColorHex,
                            textColor: palette.textColor,
                            accentColor: palette.accentColor,
                            subtextColor: palette.subtextColor,
                            badgeBg: palette.badgeBg
                          }));
                        }}
                        className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                          selectedPalette === palette.id
                            ? 'border-rose-500 ring-2 ring-rose-200 bg-white font-bold'
                            : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                        }`}
                      >
                        <div
                          className="w-6 h-6 rounded-full border border-slate-300 shadow-xs"
                          style={{ backgroundColor: palette.previewColor }}
                        />
                        <span className="text-[11px] text-slate-700">{palette.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Border Color Picker */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      צבע מסגרת וסימוני גזירה:
                    </label>
                    {customBorderColor && (
                      <button
                        onClick={() => setCustomBorderColor('')}
                        className="text-[11px] text-rose-600 hover:underline font-semibold"
                      >
                        אפס לצבע התבנית
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={customBorderColor || selectedTheme.borderColorHex || '#cbd5e1'}
                      onChange={(e) => setCustomBorderColor(e.target.value)}
                      className="w-9 h-9 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white"
                    />
                    <span className="text-xs text-slate-600">
                      {customBorderColor
                        ? `צבע מותאם אישית (${customBorderColor})`
                        : `צבע ברירת מחדל של התבנית`}
                    </span>
                  </div>
                </div>

                {/* Background Pattern / Texture Selection */}
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                    דוגמת רקע ומרקם לכרטיסים (Pattern):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {BG_PATTERNS.map((pattern) => (
                      <button
                        key={pattern.id}
                        onClick={() => setSelectedPattern(pattern.id)}
                        className={`p-2.5 rounded-xl border text-xs text-right transition-all flex items-center justify-between ${
                          selectedPattern === pattern.id
                            ? 'border-rose-500 ring-2 ring-rose-200 bg-rose-50/50 font-bold text-rose-900'
                            : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                        }`}
                      >
                        <span>{pattern.name}</span>
                        {selectedPattern === pattern.id && (
                          <Check className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gradient / Lighting Style */}
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                    תאורת רקע ומעברי צבע (Gradient):
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {GRADIENT_STYLES.map((grad) => (
                      <button
                        key={grad.id}
                        onClick={() => setSelectedGradient(grad.id)}
                        className={`p-2.5 rounded-xl border text-xs text-right transition-all flex items-center justify-between ${
                          selectedGradient === grad.id
                            ? 'border-rose-500 ring-2 ring-rose-200 bg-rose-50/50 font-bold text-rose-900'
                            : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                        }`}
                      >
                        <span>{grad.name}</span>
                        {selectedGradient === grad.id && (
                          <Check className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Greeting Subtitle Input */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      איחול / כותרת עליונה בתג:
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-600">
                      <span>הצג איחול</span>
                      <input
                        type="checkbox"
                        checked={showGreeting}
                        onChange={(e) => setShowGreeting(e.target.checked)}
                        className="w-3.5 h-3.5 accent-rose-500 rounded"
                      />
                    </label>
                  </div>
                  {showGreeting && (
                    <>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={customTitle}
                          onChange={(e) => setCustomTitle(e.target.value)}
                          placeholder="למשל: יום הולדת שמח ל"
                          className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {['יום הולדת שמח ל', 'מזל טוב ל', 'חוגגים ל', 'יום הולדת שמח! 🎉'].map(
                          (preset) => (
                            <button
                              key={preset}
                              onClick={() => setCustomTitle(preset)}
                              className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                            >
                              {preset}
                            </button>
                          )
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Font Selector */}
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                    גופן (פונט עברי):
                  </label>
                  <select
                    value={selectedFont}
                    onChange={(e) => setSelectedFont(e.target.value)}
                    className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none bg-white font-sans"
                  >
                    {FONTS.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Decorative Icon Choice */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      איור / אייקון מקשט:
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-600">
                      <span>הצג איורים</span>
                      <input
                        type="checkbox"
                        checked={showDecorations}
                        onChange={(e) => setShowDecorations(e.target.checked)}
                        className="w-3.5 h-3.5 accent-rose-500 rounded"
                      />
                    </label>
                  </div>
                  {showDecorations && (
                    <div className="flex flex-wrap gap-2">
                      {ICONS.map((icon) => (
                        <button
                          key={icon}
                          onClick={() => setSelectedIcon(icon)}
                          className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all ${
                            selectedIcon === icon
                              ? 'bg-rose-500 text-white shadow-md scale-110'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                          }`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB 2: NAMES MANAGER */}
            {activeTab === 'names' && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-800">
                    עריכת רשימת השמות ({tags.length})
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsBulkModalOpen(true)}
                      className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 bg-rose-50 px-2 py-1 rounded-md"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>הדבקה מהירה</span>
                    </button>
                    <button
                      onClick={handleResetToOriginal}
                      className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1"
                      title="איפוס ל-29 שמות מקוריים"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>אפס</span>
                    </button>
                  </div>
                </div>

                {/* Add New Tag Form */}
                <form onSubmit={handleAddTag} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">הוספת ילד/ה חדש/ה:</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="שם הילד/ה (למשל: יובל)"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
                    />
                    <input
                      type="text"
                      placeholder="תאריך (12.05)"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-24 px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white text-center"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-lg transition-colors flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>הוסף</span>
                    </button>
                  </div>
                </form>

                {/* Search input */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="חיפוש שם או תאריך ברשימה..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pr-9 pl-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>

                {/* Scrollable list of names */}
                <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
                  {filteredTags.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-6">
                      לא נמצאו שמות התואמים לחיפוש.
                    </p>
                  ) : (
                    filteredTags.map((tag, idx) => (
                      <div
                        key={tag.id}
                        className="flex items-center gap-2 p-2 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                      >
                        <span className="text-xs font-mono text-slate-400 w-5 text-center">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={tag.name}
                          onChange={(e) => handleUpdateTag(tag.id, e.target.value, tag.date)}
                          className="flex-1 px-2 py-1 text-xs font-bold border border-slate-200 rounded focus:bg-white focus:outline-none"
                        />
                        <input
                          type="text"
                          value={tag.date}
                          onChange={(e) => handleUpdateTag(tag.id, tag.name, e.target.value)}
                          className="w-16 px-2 py-1 text-xs border border-slate-200 rounded text-center focus:bg-white focus:outline-none"
                        />
                        <button
                          onClick={() => handleDuplicateTag(tag)}
                          className="p-1 text-slate-400 hover:text-slate-600 rounded"
                          title="שכפל תג"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTag(tag.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          title="מחק תג"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

              </div>
            )}

            {/* TAB 3: PRINT & CUT SETTINGS */}
            {activeTab === 'print' && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                
                {/* Tags Per Page */}
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                    מספר תגים בדף A4:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { count: 10, label: '10 תגים בדף (2x5)', desc: 'גודל תקני מומלץ ~9x5 ס"מ' },
                      { count: 8, label: '8 תגים בדף (2x4)', desc: 'תגים גדולים ~9x6.5 ס"מ' },
                      { count: 12, label: '12 תגים בדף (3x4)', desc: 'תגים מרובעים ~6x6.5 ס"מ' },
                      { count: 15, label: '15 תגים בדף (3x5)', desc: 'תגים קומפקטיים ~6x5 ס"מ' }
                    ].map((opt) => (
                      <button
                        key={opt.count}
                        onClick={() => setTagsPerPage(opt.count)}
                        className={`p-2.5 rounded-xl border text-right transition-all ${
                          tagsPerPage === opt.count
                            ? 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-200 font-bold'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="text-xs font-bold text-slate-900">{opt.label}</div>
                        <div className="text-[10px] text-slate-500">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scissor Icons Toggle */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">אייקון מספריים לגזירה (✂️):</span>
                    <span className="text-[11px] text-slate-500">מציג מספריים קטנים בפינות התגים לחיתוך קל</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={showScissorMarks}
                    onChange={(e) => setShowScissorMarks(e.target.checked)}
                    className="w-5 h-5 accent-rose-500 rounded cursor-pointer"
                  />
                </div>

                {/* Border Cut Line Style */}
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                    סגנון קו הגזירה סביב כל תג:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'dashed', label: 'קו מקווקו' },
                      { id: 'solid', label: 'קו רציף' },
                      { id: 'double', label: 'קו כפול' }
                    ].map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setBorderStyle(style.id as any)}
                        className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                          borderStyle === style.id
                            ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Page Crop Marks Toggle */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">סימוני חיתוך בפינות הדף:</span>
                    <span className="text-[11px] text-slate-500">צלבי יישור מדויקים בשולי הדף להדפסה מקצועית</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={showCornerCrop}
                    onChange={(e) => setShowCornerCrop(e.target.checked)}
                    className="w-5 h-5 accent-rose-500 rounded cursor-pointer"
                  />
                </div>

                {/* Action Buttons inside Tab */}
                <div className="pt-3 border-t border-slate-200 space-y-2.5">
                  <button
                    onClick={handleDownloadPDF}
                    disabled={isExporting}
                    className="w-full py-3 px-4 font-bold text-white bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                  >
                    {isExporting ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>{exportProgress || 'מעבד קובץ PDF...'}</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        <span>הורד קובץ PDF של כל הדפים</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="w-full py-2.5 px-4 font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <Printer className="w-4 h-4 text-slate-600" />
                    <span>הדפסה ישירה במדפסת (ללא שמירת קובץ)</span>
                  </button>
                </div>

              </div>
            )}

          </aside>

          {/* Right / Left Main Preview Section (lg:col-span-7) */}
          <section className="lg:col-span-7 flex flex-col gap-4">
            
            {/* Top Preview Control Bar */}
            <div className="no-print bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">תצוגה מקדימה:</span>
                <span className="text-xs bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded-md">
                  {totalPages} {totalPages === 1 ? 'דף A4' : 'דפי A4'} ({tags.length} תגים)
                </span>
                <span className="text-[11px] text-slate-400">
                  {tagsPerPage} תגים בכל דף
                </span>
              </div>

              {/* Preview Zoom Controls */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500 ml-1">זום:</span>
                {[70, 85, 100].map((zoomVal) => (
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

            {/* Printable A4 Sheets Container */}
            <div
              ref={printPagesRef}
              className="print-sheet-container flex flex-col items-center gap-8 overflow-x-auto pb-8"
            >
              {pagesArray.map((pageIdx) => {
                const pageTags = tags.slice(
                  pageIdx * tagsPerPage,
                  (pageIdx + 1) * tagsPerPage
                );

                return (
                  <div
                    key={pageIdx}
                    className="a4-print-page bg-white shadow-xl rounded-sm border border-slate-300 relative text-right overflow-hidden transition-transform duration-200"
                    style={{
                      width: '210mm',
                      height: '297mm',
                      boxSizing: 'border-box',
                      transform: `scale(${previewZoom / 100})`,
                      transformOrigin: 'top center',
                      margin: previewZoom < 100 ? `0 0 -${(100 - previewZoom) * 2.8}mm 0` : '0'
                    }}
                  >
                    {/* Outer Crop Alignment Marks */}
                    {showCornerCrop && (
                      <>
                        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-slate-400 pointer-events-none" />
                        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-slate-400 pointer-events-none" />
                        <div className="absolute bottom-2 right-2 w-3 h-2 border-b-2 border-r-2 border-slate-400 pointer-events-none" />
                        <div className="absolute bottom-2 left-2 w-3 h-2 border-b-2 border-l-2 border-slate-400 pointer-events-none" />
                      </>
                    )}

                    {/* Header info bar on top margin */}
                    <div className="no-print absolute top-3 left-6 right-6 flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-100 pb-1">
                      <span>כרטיסי יום הולדת • עמוד {pageIdx + 1} מתוך {totalPages}</span>
                      <span>סימוני גזירה היקפיים</span>
                    </div>

                    {/* Tags Grid Container */}
                    <div
                      className={`w-full h-full grid ${getGridClass()} pt-8 pb-6`}
                      style={{ fontFamily: selectedFont }}
                    >
                      {pageTags.map((tag) => {
                        const patternObj = BG_PATTERNS.find((p) => p.id === selectedPattern) || BG_PATTERNS[0];
                        const activePatternHex = customBorderColor || selectedTheme.borderColorHex || '#cbd5e1';
                        const patternCss = patternObj.cssPattern(activePatternHex);
                        const gradientObj = GRADIENT_STYLES.find((g) => g.id === selectedGradient);

                        return (
                          <div
                            key={tag.id}
                            className={`relative rounded-xl flex flex-col justify-between p-3.5 transition-all shadow-xs overflow-hidden ${
                              selectedTheme.cardBg
                            } ${selectedTheme.textColor} ${
                              borderStyle === 'dashed'
                                ? 'border-2 border-dashed'
                                : borderStyle === 'double'
                                ? 'border-4 border-double'
                                : 'border-2 border-solid'
                            } ${selectedTheme.borderColor}`}
                            style={{
                              backgroundImage: patternCss !== 'none' ? patternCss : undefined,
                              backgroundSize: selectedPattern === 'waves' ? '20px 20px' : '16px 16px',
                              borderColor: customBorderColor || undefined
                            }}
                          >
                            {/* Optional lighting gradient overlay */}
                            {gradientObj && gradientObj.gradientClass && (
                              <div className={`absolute inset-0 pointer-events-none ${gradientObj.gradientClass}`} />
                            )}

                            {/* Scissor icon at corner */}
                            {showScissorMarks && (
                              <div className="absolute top-1 left-1 text-[11px] text-slate-400 opacity-60 pointer-events-none transform -rotate-45 z-10">
                                ✂️
                              </div>
                            )}

                            {/* Top Banner Row: Greeting & Decorative Icon (if showGreeting or showDecorations) */}
                            {(showGreeting || showDecorations) && (
                              <div className="relative z-10 flex items-center justify-between border-b border-slate-200/50 pb-1.5 min-h-[30px]">
                                {showGreeting ? (
                                  <span
                                    className={`text-xs font-semibold px-2 py-0.5 rounded-full truncate max-w-[140px] ${selectedTheme.badgeBg} ${selectedTheme.subtextColor}`}
                                  >
                                    {customTitle}
                                  </span>
                                ) : (
                                  <div />
                                )}

                                {showDecorations && (
                                  <span className="text-xl filter drop-shadow-xs shrink-0 mr-1">
                                    {selectedIcon}
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Middle Center: Child Name AND Birth Date Directly Underneath */}
                            <div className="relative z-10 my-auto flex-1 flex flex-col items-center justify-center text-center py-1">
                              {/* Child Name */}
                              <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-none drop-shadow-xs truncate max-w-full px-1">
                                {tag.name}
                              </h2>

                              {/* Birth Date Directly Under Name (User's specific request) */}
                              {showDate && datePlacement === 'under_name' && (
                                <div
                                  className={`mt-1 font-black tracking-tight flex items-center justify-center gap-1.5 transition-all ${
                                    dateSize === 'large'
                                      ? 'text-xl sm:text-2xl text-slate-900'
                                      : 'text-sm sm:text-base font-bold text-slate-700'
                                  }`}
                                >
                                  {showDecorations && (
                                    <span className="text-base">🎈</span>
                                  )}
                                  <span
                                    className={
                                      dateSize === 'large'
                                        ? 'border-b-2 border-rose-400/60 pb-0.5'
                                        : ''
                                    }
                                  >
                                    {dateFormat === 'hebrew_prefix'
                                      ? `בתאריך ${tag.date}`
                                      : tag.date}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Bottom Row: Footer Decoration or Legacy Bottom Date */}
                            <div className="relative z-10 flex items-center justify-between pt-1 border-t border-slate-200/50 min-h-[28px]">
                              {showDecorations ? (
                                <div className="flex items-center gap-1 text-xs opacity-75 font-medium shrink-0">
                                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                  <span>מזל טוב!</span>
                                </div>
                              ) : (
                                <div />
                              )}

                              {/* If date is placed at the bottom */}
                              {showDate && datePlacement === 'bottom' && (
                                <div
                                  className={`px-2.5 py-0.5 rounded-md font-mono text-xs font-bold ${selectedTheme.badgeBg} ${selectedTheme.accentColor} flex items-center gap-1 shrink-0`}
                                >
                                  <Calendar className="w-3 h-3 inline" />
                                  <span>
                                    {dateFormat === 'hebrew_prefix'
                                      ? `בתאריך ${tag.date}`
                                      : tag.date}
                                  </span>
                                </div>
                              )}

                              {/* If date is already under the name, show subtle congratulations message */}
                              {(!showDate || datePlacement === 'under_name') && showDecorations && (
                                <span className="text-[11px] font-semibold opacity-60">
                                  יום הולדת שמח 🎉
                                </span>
                              )}
                            </div>

                          </div>
                        );
                      })}
                    </div>

                    {/* Sheet Footer Page Counter */}
                    <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-slate-400 font-mono">
                      דף {pageIdx + 1} / {totalPages} • מיוצר עבור הדפסה וגזירה בבית או בגן
                    </div>

                  </div>
                );
              })}
            </div>

          </section>

        </main>
      )}

      {/* Bulk Import Modal */}
      <BulkImportModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onImport={handleBulkImport}
        currentTagsCount={tags.length}
      />

      {/* Footer */}
      <footer className="no-print bg-white border-t border-slate-200 py-3 text-center text-xs text-slate-500">
        מעצב תגי יום הולדת וטבלאות מעקב לגן • מוכן להדפסה ב-A4 עם סימוני גזירה מדויקים
      </footer>

    </div>
  );
}
