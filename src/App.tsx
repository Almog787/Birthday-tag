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
  Sparkle,
  FileCode,
  FileJson
} from 'lucide-react';
import jsPDF from 'jspdf';
import { toJpeg, toPng } from 'html-to-image';
import html2canvas from 'html2canvas';

import {
  TagItem,
  ThemePreset,
  BackgroundPattern,
  GradientStyle,
  ColorPalette,
  TagDisplayMode,
  TagCardSizePreset,
  TagFontSizePreset,
  MainViewType
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
import { AnimalSortingView } from './components/AnimalSortingView';
import {
  trackMainTabSwitch,
  trackTagSubTab,
  trackThemeChange,
  trackPaletteChange,
  trackPatternChange,
  trackGradientChange,
  trackFontChange,
  trackIconChange,
  trackTagModeSelect,
  trackToggleDate,
  trackToggleDecorations,
  trackToggleGreeting,
  trackDatePlacementChange,
  trackDateSizeChange,
  trackTagsPerPageChange,
  trackAddChild,
  trackDeleteChild,
  trackResetChildren,
  trackBulkImportOpen,
  trackPrintTags,
  trackDownloadPDF,
  trackSearchQuery,
  trackZoomControl,
  trackEvent
} from './analytics';

export default function App() {
  // Main View Switcher: 'tags' (Birthday Tags) vs 'tables' (Kindergarten Tracking Tables) vs 'animal_sorting' (Animal sorting worksheet)
  const [mainView, setMainView] = useState<MainViewType>('tags');

  // Tags State with localStorage persistence (v3 reflects updated children roster)
  const [tags, setTags] = useState<TagItem[]>(() => {
    try {
      const saved = localStorage.getItem('birthday_tags_list_v3');
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
      localStorage.setItem('birthday_tags_list_v3', JSON.stringify(tags));
    } catch (e) {
      console.warn('Failed to save tags to localStorage', e);
    }
  }, [tags]);

  // Design & Modifiers State
  const [selectedTheme, setSelectedTheme] = useState<ThemePreset>(THEMES[0]);
  const [customTitle, setCustomTitle] = useState<string>('יום הולדת שמח ל');
  const [showScissorMarks, setShowScissorMarks] = useState<boolean>(true);
  const [borderStyle, setBorderStyle] = useState<'dashed' | 'solid' | 'double'>('dashed');
  const [tagsPerPage, setTagsPerPage] = useState<number>(10); // 6, 8, 10, 12, 15, 18, 20, 24
  
  // Core Drawer Label & Card Resizing States (Section 2.A & 3 from spec)
  const [tagDisplayMode, setTagDisplayMode] = useState<TagDisplayMode>('full'); // 'full' | 'clean' | 'name_only'
  const [cardSizePreset, setCardSizePreset] = useState<TagCardSizePreset>('medium_shelf'); // 'small_drawer' | 'medium_shelf' | 'large_door'
  const [fontSizePreset, setFontSizePreset] = useState<TagFontSizePreset>('large'); // 'regular' | 'large' | 'max_fill'
  const [customFontScale, setCustomFontScale] = useState<number>(130); // 80% to 220%
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
  const jsonFileInputRef = useRef<HTMLInputElement>(null);

  // Filtered tags for manager tab
  const filteredTags = tags.filter(
    (t) => t.name.includes(searchTerm) || t.date.includes(searchTerm)
  );

  // Add new tag
  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    trackAddChild(newName.trim(), newDate.trim());
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
    trackDeleteChild();
    setTags(tags.filter((t) => t.id !== id));
  };

  // Update tag
  const handleUpdateTag = (id: string, name: string, date: string) => {
    trackEvent('update_tag', { tag_id: id });
    setTags(tags.map((t) => (t.id === id ? { ...t, name, date } : t)));
  };

  // Reset to original 27 tags
  const handleResetToOriginal = () => {
    if (window.confirm('האם לשחזר את הרשימה המקורית של 27 הילדים?')) {
      trackResetChildren();
      setTags(INITIAL_TAGS);
    }
  };

  // Duplicate tag
  const handleDuplicateTag = (tag: TagItem) => {
    trackEvent('duplicate_tag', { tag_name: tag.name });
    const copyTag: TagItem = {
      id: Date.now().toString(),
      name: tag.name,
      date: tag.date
    };
    setTags([...tags, copyTag]);
  };

  // Bulk import callback (supports append or replace)
  const handleBulkImport = (newTags: TagItem[], mode: 'replace' | 'append' = 'replace') => {
    trackEvent('apply_bulk_import', { mode, count: newTags.length });
    if (mode === 'append') {
      setTags((prev) => [...prev, ...newTags]);
    } else {
      setTags(newTags);
    }
  };

  // Export children list to downloadable children.json file
  const handleExportJSON = () => {
    trackEvent('export_children_json', { count: tags.length });
    const jsonStr = JSON.stringify(tags, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'children.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import children list directly from a selected children.json file
  const handleImportJSONFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        const list = Array.isArray(parsed) ? parsed : parsed.children || parsed.tags || [];
        if (Array.isArray(list) && list.length > 0) {
          const validated: TagItem[] = list
            .map((item: any, idx: number) => ({
              id: String(item.id || `${Date.now()}-${idx}`),
              name: String(item.name || item.childName || '').trim(),
              date: String(item.date || item.birthDate || '01.01').trim()
            }))
            .filter((item: TagItem) => item.name);

          if (validated.length > 0) {
            trackEvent('import_children_json_success', { count: validated.length });
            setTags(validated);
            alert(`קובץ JSON נטען בהצלחה! סה"כ ${validated.length} ילדים.`);
          } else {
            alert('קובץ ה-JSON אינו מכיל שמות תקינים.');
          }
        } else {
          alert('מבנה קובץ ה-JSON אינו תקין. עליו להכיל מערך של שמות ותאריכים.');
        }
      } catch (err) {
        console.error('Failed to parse JSON file:', err);
        alert('שגיאה בפענוח קובץ ה-JSON. אנא וודא שהקובץ תקין.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Presets for tag modes (Mode 1: Full, Mode 2: Clean with Name + Date, Mode 3: Name only for drawers)
  const handleSetTagMode = (mode: TagDisplayMode) => {
    trackTagModeSelect(mode === 'name_only' ? 'text_only' : mode);
    setTagDisplayMode(mode);
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
      setCardSizePreset('small_drawer');
      setTagsPerPage(18); // ~6x4.2 cm per drawer label
      setFontSizePreset('max_fill');
      setCustomFontScale(160);
    }
  };

  // Card Size Preset Handler (Small drawer, Medium shelf/chair, Large door/birthday)
  const handleSetCardSize = (size: TagCardSizePreset) => {
    setCardSizePreset(size);
    trackEvent('change_card_size_preset', { size });
    if (size === 'small_drawer') {
      trackTagsPerPageChange(18);
      setTagsPerPage(18); // ~6x4.2 cm per drawer label (3x6)
    } else if (size === 'medium_shelf') {
      trackTagsPerPageChange(10);
      setTagsPerPage(10); // ~9x5 cm standard shelf/chair label (2x5)
    } else if (size === 'large_door') {
      trackTagsPerPageChange(8);
      setTagsPerPage(8); // ~9x6.5 cm large door/birthday label (2x4)
    }
  };

  // Font Size Preset Handler
  const handleSetFontSize = (preset: TagFontSizePreset) => {
    setFontSizePreset(preset);
    trackEvent('change_font_size_preset', { preset });
    if (preset === 'regular') {
      setCustomFontScale(100);
    } else if (preset === 'large') {
      setCustomFontScale(135);
    } else if (preset === 'max_fill') {
      setCustomFontScale(185);
    }
  };

  // Helper to calculate responsive name font size based on card size, name length, and scale
  const calculateNameFontSize = (name: string) => {
    let baseRem = 1.95;
    if (tagsPerPage <= 6) {
      baseRem = 2.85;
    } else if (tagsPerPage <= 8) {
      baseRem = 2.4;
    } else if (tagsPerPage <= 10) {
      baseRem = 2.05;
    } else if (tagsPerPage <= 12) {
      baseRem = 1.85;
    } else if (tagsPerPage <= 15) {
      baseRem = 1.65;
    } else if (tagsPerPage <= 18) {
      baseRem = 1.45;
    } else if (tagsPerPage <= 20) {
      baseRem = 1.35;
    } else {
      // 24
      baseRem = 1.2;
    }

    // In name-only drawer mode, no banners or dates take vertical space, so name can be significantly larger!
    if (tagDisplayMode === 'name_only') {
      baseRem *= 1.45;
    }

    // If max_fill is active, give an extra boost
    if (fontSizePreset === 'max_fill') {
      baseRem *= 1.25;
    }

    // Gentle adjustment for long double names
    if (name.length > 10) {
      baseRem *= 0.78;
    } else if (name.length > 7) {
      baseRem *= 0.88;
    }

    const scale = customFontScale / 100;
    return `${(baseRem * scale).toFixed(2)}rem`;
  };

  // Calculate pagination pages
  const totalPages = Math.ceil(tags.length / tagsPerPage) || 1;
  const pagesArray = Array.from({ length: totalPages }, (_, i) => i);

  // Get grid dimensions class
  const getGridClass = () => {
    switch (tagsPerPage) {
      case 6:
        return 'grid-cols-2 grid-rows-3 gap-5 p-7'; // 2x3 (~9x8.5 cm)
      case 8:
        return 'grid-cols-2 grid-rows-4 gap-4 p-6'; // 2x4 (~9x6.5 cm)
      case 12:
        return 'grid-cols-3 grid-rows-4 gap-3 p-5'; // 3x4 (~6x6.5 cm)
      case 15:
        return 'grid-cols-3 grid-rows-5 gap-2.5 p-4'; // 3x5 (~6x5 cm)
      case 18:
        return 'grid-cols-3 grid-rows-6 gap-2 p-3.5'; // 3x6 (~6x4.2 cm - תווית מגירה)
      case 20:
        return 'grid-cols-4 grid-rows-5 gap-2 p-3'; // 4x5 (~4.8x5 cm - תווית מגירה מרובעת)
      case 24:
        return 'grid-cols-4 grid-rows-6 gap-1.5 p-2.5'; // 4x6 (~4.8x4.2 cm - קומפקטי למגירות)
      case 10:
      default:
        return 'grid-cols-2 grid-rows-5 gap-3.5 p-5'; // 2x5 (~9x5 cm)
    }
  };

  // PDF Export for Birthday Tags
  const handleDownloadPDF = async () => {
    if (!printPagesRef.current) return;
    trackDownloadPDF('tags', {
      total_tags: tags.length,
      pages_count: totalPages,
      theme: selectedTheme.name,
      tags_per_page: tagsPerPage
    });
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
    <div className="min-h-screen bg-surface-canvas flex flex-col font-['Rubik',sans-serif] text-text-primary antialiased" dir="rtl">
      
      {/* Top Header Navigation */}
      <header className="no-print bg-white/95 backdrop-blur-sm border-b border-border-subtle sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 md:py-0 md:h-16 flex flex-wrap md:flex-nowrap items-center justify-between gap-2.5">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-primary to-accent-gold flex items-center justify-center text-white shadow-md font-extrabold text-lg sm:text-xl shrink-0">
              {mainView === 'tags' ? '🎈' : mainView === 'tables' ? '📋' : '🐾'}
            </div>
            <div>
              <h1 className="text-sm sm:text-base md:text-lg font-black text-text-primary leading-tight">
                {mainView === 'tags'
                  ? 'מעצב תגי יום הולדת לילדים'
                  : mainView === 'tables'
                  ? 'טבלאות ומעקב מעוצבות לגן'
                  : 'ערכת מיון חיות ללוח מגנטי'}
              </h1>
              <p className="text-[11px] text-text-muted hidden sm:block">
                {mainView === 'tags'
                  ? `עיצוב תגים ותוויות מגירה, תאריכים מוגדלים וייצוא PDF (${tags.length} ילדים)`
                  : mainView === 'tables'
                  ? `מעקב ציוד, מגבונים ותורנויות שבת להדפסה ול-PDF`
                  : `מיון 2 רגליים מול 4 רגליים • גזירה, הדבקה ומתיחת קו A4`}
              </p>
            </div>
          </div>

          {/* Module Switcher Tabs in Center */}
          <div className="flex items-center gap-1 bg-surface-subtle p-1 rounded-xl border border-border-subtle order-last md:order-none w-full md:w-auto justify-center overflow-x-auto">
            <button
              onClick={() => {
                trackMainTabSwitch('tags');
                setMainView('tags');
              }}
              className={`flex-1 md:flex-none px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 shrink-0 ${
                mainView === 'tags'
                  ? 'bg-white text-primary shadow-xs ring-1 ring-border-subtle'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🎈</span>
              <span>תגי יום הולדת ותוויות</span>
            </button>

            <button
              onClick={() => {
                trackMainTabSwitch('tables');
                setMainView('tables');
              }}
              className={`flex-1 md:flex-none px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 shrink-0 ${
                mainView === 'tables'
                  ? 'bg-white text-primary shadow-xs ring-1 ring-border-subtle'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-primary" />
              <span>טבלאות מעקב לגן</span>
            </button>

            <button
              onClick={() => {
                trackMainTabSwitch('animal_sorting');
                setMainView('animal_sorting');
              }}
              className={`flex-1 md:flex-none px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 shrink-0 ${
                mainView === 'animal_sorting'
                  ? 'bg-white text-primary shadow-xs ring-1 ring-border-subtle'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🧲</span>
              <span>ערכת מיון חיות</span>
              <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded-full font-black">
                חדש
              </span>
            </button>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => {
                trackBulkImportOpen();
                setIsBulkModalOpen(true);
              }}
              className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-surface-subtle hover:bg-slate-200 border border-border-subtle rounded-xl transition-colors flex items-center gap-1.5"
              title="הדבקה מהירה של רשימת ילדים מוואטסאפ או אקסל"
            >
              <Upload className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">הדבקה מהירה</span>
            </button>

            {mainView === 'tags' && (
              <>
                <button
                  onClick={() => {
                    trackPrintTags(tags.length, totalPages);
                    let printStyle = document.getElementById('table-dynamic-print-style') as HTMLStyleElement;
                    if (!printStyle) {
                      printStyle = document.createElement('style');
                      printStyle.id = 'table-dynamic-print-style';
                      document.head.appendChild(printStyle);
                    }
                    printStyle.textContent = `@media print { @page { size: A4 portrait; margin: 0; } }`;
                    window.print();
                  }}
                  className="px-3 py-1.5 text-xs sm:text-sm font-bold text-slate-700 bg-surface-subtle hover:bg-slate-200 border border-border-subtle rounded-xl transition-colors flex items-center gap-1.5"
                  title="הדפסה ישירה במדפסת"
                >
                  <Printer className="w-4 h-4 text-slate-600" />
                  <span className="hidden sm:inline">הדפס</span>
                </button>

                <button
                  onClick={handleDownloadPDF}
                  disabled={isExporting}
                  className="px-3.5 sm:px-4 py-1.5 text-xs sm:text-sm font-black text-white bg-primary hover:bg-primary-container rounded-xl shadow-xs hover:shadow transition-all flex items-center gap-1.5 disabled:opacity-50"
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
      {mainView === 'animal_sorting' ? (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
          <AnimalSortingView />
        </main>
      ) : mainView === 'tables' ? (
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
            <div className="bg-white p-1.5 rounded-2xl border border-border-subtle shadow-xs flex items-center gap-1">
              <button
                onClick={() => {
                  trackTagSubTab('design');
                  setActiveTab('design');
                }}
                className={`flex-1 py-2 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'design'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-slate-600 hover:bg-surface-subtle'
                }`}
              >
                <Palette className="w-4 h-4" />
                <span>עיצוב ותבניות</span>
              </button>

              <button
                onClick={() => {
                  trackTagSubTab('names');
                  setActiveTab('names');
                }}
                className={`flex-1 py-2 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'names'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-slate-600 hover:bg-surface-subtle'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>רשימת שמות ({tags.length})</span>
              </button>

              <button
                onClick={() => {
                  trackTagSubTab('print');
                  setActiveTab('print');
                }}
                className={`flex-1 py-2 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'print'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-slate-600 hover:bg-surface-subtle'
                }`}
              >
                <Scissors className="w-4 h-4" />
                <span>הגדרות גזירה</span>
              </button>
            </div>

            {/* TAB 1: DESIGN & STYLING */}
            {activeTab === 'design' && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                
                {/* Card Settings Control Panel (Spec Section 3) */}
                <div className="p-4 bg-gradient-to-br from-rose-50/70 via-amber-50/50 to-orange-50/60 rounded-2xl border-2 border-rose-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-rose-950 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-rose-600" />
                      <span>סרגל הגדרות תגים ותוויות (Card Settings)</span>
                    </span>
                    <span className="text-[10px] bg-rose-200/80 text-rose-800 font-bold px-2 py-0.5 rounded-full">
                      גמישות מלאה לגננות
                    </span>
                  </div>

                  {/* 1. מצב תצוגה: [תג מלא] | [שם + תאריך] | [שם בלבד (למגירות)] */}
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1.5">
                      1. מצב תצוגה:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleSetTagMode('full')}
                        className={`p-2 rounded-xl text-xs font-bold transition-all text-center border ${
                          tagDisplayMode === 'full'
                            ? 'bg-rose-500 text-white border-rose-600 shadow-xs ring-2 ring-rose-200'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
                        }`}
                      >
                        🌟 תג מלא
                        <span className="block text-[10px] font-normal opacity-90">שם + תאריך + איורים</span>
                      </button>

                      <button
                        onClick={() => handleSetTagMode('clean')}
                        className={`p-2 rounded-xl text-xs font-bold transition-all text-center border ${
                          tagDisplayMode === 'clean'
                            ? 'bg-rose-500 text-white border-rose-600 shadow-xs ring-2 ring-rose-200'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
                        }`}
                      >
                        ✨ שם + תאריך
                        <span className="block text-[10px] font-normal opacity-90">נקי ללא קישוטים</span>
                      </button>

                      <button
                        onClick={() => handleSetTagMode('name_only')}
                        className={`p-2 rounded-xl text-xs font-bold transition-all text-center border ${
                          tagDisplayMode === 'name_only'
                            ? 'bg-rose-500 text-white border-rose-600 shadow-xs ring-2 ring-rose-200'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
                        }`}
                      >
                        🏷️ שם בלבד (למגירות)
                        <span className="block text-[10px] font-normal opacity-90">מותאם למגירות הילדים</span>
                      </button>
                    </div>

                    {tagDisplayMode === 'name_only' && (
                      <div className="mt-2 p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-800 font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>מצב תוויות למגירות פעיל: שם בלבד בגודל מוגדל, ללא תאריך לידה וללא קישוטים היקפיים.</span>
                      </div>
                    )}
                  </div>

                  {/* 2. גודל הריבוע: [קטן למגירה] | [בינוני] | [גדול] */}
                  <div className="pt-2 border-t border-rose-200/60">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-800">
                        2. גודל הריבוע / הכרטיסייה:
                      </label>
                      <span className="text-[11px] text-slate-500 font-semibold">
                        {tagsPerPage} כרטיסיות בדף A4
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleSetCardSize('small_drawer')}
                        className={`p-2 rounded-xl text-xs font-bold transition-all text-center border ${
                          cardSizePreset === 'small_drawer' || tagsPerPage >= 15
                            ? 'bg-rose-500 text-white border-rose-600 shadow-xs ring-2 ring-rose-200'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
                        }`}
                      >
                        🏷️ קטן למגירה
                        <span className="block text-[10px] font-normal opacity-90">~6x4 ס"מ (18 בדף)</span>
                      </button>

                      <button
                        onClick={() => handleSetCardSize('medium_shelf')}
                        className={`p-2 rounded-xl text-xs font-bold transition-all text-center border ${
                          (cardSizePreset === 'medium_shelf' || tagsPerPage === 10 || tagsPerPage === 12) && tagsPerPage < 15 && tagsPerPage > 8
                            ? 'bg-rose-500 text-white border-rose-600 shadow-xs ring-2 ring-rose-200'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
                        }`}
                      >
                        🪑 בינוני
                        <span className="block text-[10px] font-normal opacity-90">מדף / כיסא (~9x5)</span>
                      </button>

                      <button
                        onClick={() => handleSetCardSize('large_door')}
                        className={`p-2 rounded-xl text-xs font-bold transition-all text-center border ${
                          (cardSizePreset === 'large_door' || tagsPerPage <= 8)
                            ? 'bg-rose-500 text-white border-rose-600 shadow-xs ring-2 ring-rose-200'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
                        }`}
                      >
                        🚪 גדול
                        <span className="block text-[10px] font-normal opacity-90">יום הולדת / דלת (~9x6.5)</span>
                      </button>
                    </div>

                    {/* Fine-grain tags count selector / סרגל גזירה */}
                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-600">
                      <span className="font-medium">סרגל גזירה (כמות בדף):</span>
                      <div className="flex gap-1 flex-wrap">
                        {[
                          { count: 6, label: '6' },
                          { count: 8, label: '8' },
                          { count: 10, label: '10' },
                          { count: 12, label: '12' },
                          { count: 15, label: '15' },
                          { count: 18, label: '18' },
                          { count: 20, label: '20' },
                          { count: 24, label: '24' }
                        ].map((opt) => (
                          <button
                            key={opt.count}
                            onClick={() => {
                              trackTagsPerPageChange(opt.count);
                              setTagsPerPage(opt.count);
                              if (opt.count >= 15) setCardSizePreset('small_drawer');
                              else if (opt.count >= 10) setCardSizePreset('medium_shelf');
                              else setCardSizePreset('large_door');
                            }}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                              tagsPerPage === opt.count
                                ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 3. גודל הכתב: [רגיל] | [גדול] | [מוגדל למקסימום] */}
                  <div className="pt-2 border-t border-rose-200/60">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-800">
                        3. גודל הכתב של השם:
                      </label>
                      <span className="text-[11px] text-rose-700 font-bold">
                        {customFontScale}%
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleSetFontSize('regular')}
                        className={`p-2 rounded-xl text-xs font-bold transition-all text-center border ${
                          fontSizePreset === 'regular' && customFontScale <= 110
                            ? 'bg-rose-500 text-white border-rose-600 shadow-xs ring-2 ring-rose-200'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
                        }`}
                      >
                        🔤 רגיל
                        <span className="block text-[10px] font-normal opacity-90">100% סטנדרטי</span>
                      </button>

                      <button
                        onClick={() => handleSetFontSize('large')}
                        className={`p-2 rounded-xl text-xs font-bold transition-all text-center border ${
                          fontSizePreset === 'large' && customFontScale > 110 && customFontScale < 160
                            ? 'bg-rose-500 text-white border-rose-600 shadow-xs ring-2 ring-rose-200'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
                        }`}
                      >
                        🔠 גדול
                        <span className="block text-[10px] font-normal opacity-90">135% מוגדל</span>
                      </button>

                      <button
                        onClick={() => handleSetFontSize('max_fill')}
                        className={`p-2 rounded-xl text-xs font-bold transition-all text-center border ${
                          fontSizePreset === 'max_fill' || customFontScale >= 160
                            ? 'bg-rose-500 text-white border-rose-600 shadow-xs ring-2 ring-rose-200'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
                        }`}
                      >
                        ⚡ מוגדל למקסימום
                        <span className="block text-[10px] font-normal opacity-90">ממלא את הריבוע</span>
                      </button>
                    </div>

                    {/* Smooth Font Scale Slider */}
                    <div className="mt-2.5 flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 font-bold">A</span>
                      <input
                        type="range"
                        min="80"
                        max="220"
                        step="5"
                        value={customFontScale}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setCustomFontScale(val);
                          if (val >= 160) setFontSizePreset('max_fill');
                          else if (val >= 115) setFontSizePreset('large');
                          else setFontSizePreset('regular');
                        }}
                        className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                      />
                      <span className="text-xs text-slate-800 font-black">A</span>
                    </div>
                  </div>

                </div>

                {/* Conditional Content based on Tag Mode */}
                {tagDisplayMode === 'name_only' ? (
                  /* Clean Name-Only / Drawer Label Options */
                  <div className="space-y-4">
                    {/* Drawer Mode Active Banner */}
                    <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold block">מצב תוויות נקיות למגירות פעיל</span>
                        <p className="text-[11px] text-emerald-800 mt-0.5">
                          הכרטיסיות מוצגות עם שמות הילדים בלבד בגופן בולט ומוגדל, ללא תאריכים וללא קישוטים, לנוחות גזירה והדבקה מהירה על מגירות הילדים.
                        </p>
                      </div>
                    </div>

                    {/* Font Selector */}
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <label className="text-xs font-bold text-slate-700 block mb-2">
                        גופן (פונט עברי לשמות):
                      </label>
                      <select
                        value={selectedFont}
                        onChange={(e) => {
                          trackFontChange(e.target.value);
                          setSelectedFont(e.target.value);
                        }}
                        className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none bg-white font-sans"
                      >
                        {FONTS.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Border Color */}
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-slate-700">
                          צבע מסגרת וסימוני גזירה:
                        </label>
                        {customBorderColor && (
                          <button
                            onClick={() => {
                              trackEvent('reset_custom_border_color');
                              setCustomBorderColor('');
                            }}
                            className="text-[11px] text-rose-600 hover:underline font-semibold"
                          >
                            אפס צבע
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={customBorderColor || '#cbd5e1'}
                          onChange={(e) => {
                            trackEvent('change_custom_border_color', { color: e.target.value });
                            setCustomBorderColor(e.target.value);
                          }}
                          className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white"
                        />
                        <span className="text-xs text-slate-600">
                          {customBorderColor ? `צבע מותאם (${customBorderColor})` : 'אפור עדין (סטנדרטי לגזירה)'}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Standard / Full Tag Options (Organized Cleanly) */
                  <div className="space-y-5">
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
                            onChange={(e) => {
                              trackToggleDate(e.target.checked);
                              setShowDate(e.target.checked);
                            }}
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
                                onClick={() => {
                                  trackDatePlacementChange('under_name');
                                  setDatePlacement('under_name');
                                }}
                                className={`py-1.5 px-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                                  datePlacement === 'under_name'
                                    ? 'bg-rose-500 text-white border-rose-600 font-bold shadow-xs'
                                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                ⭐ מתחת לשם (מומלץ)
                              </button>
                              <button
                                onClick={() => {
                                  trackDatePlacementChange('bottom');
                                  setDatePlacement('bottom');
                                }}
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
                                onClick={() => {
                                  trackDateSizeChange('large');
                                  setDateSize('large');
                                }}
                                className={`py-1.5 px-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                                  dateSize === 'large'
                                    ? 'bg-rose-500 text-white border-rose-600 font-bold shadow-xs'
                                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                🔤 גדול ובולט
                              </button>
                              <button
                                onClick={() => {
                                  trackDateSizeChange('medium');
                                  setDateSize('medium');
                                }}
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
                                onClick={() => {
                                  trackEvent('change_date_format', { format: 'standard' });
                                  setDateFormat('standard');
                                }}
                                className={`py-1.5 px-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                                  dateFormat === 'standard'
                                    ? 'bg-rose-500 text-white border-rose-600 font-bold shadow-xs'
                                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                תאריך בלבד (18.06)
                              </button>
                              <button
                                onClick={() => {
                                  trackEvent('change_date_format', { format: 'hebrew_prefix' });
                                  setDateFormat('hebrew_prefix');
                                }}
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
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                        בחירת תבנית נושא מוכנה:
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {THEMES.map((theme) => (
                          <button
                            key={theme.id}
                            onClick={() => {
                              trackThemeChange(theme.id, theme.name);
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
                              trackPaletteChange(palette.id);
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
                              className="w-5 h-5 rounded-full border border-slate-300 shadow-xs"
                              style={{ backgroundColor: palette.previewColor }}
                            />
                            <span className="text-[10px] text-slate-700">{palette.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Font Selector */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                        גופן (פונט עברי):
                      </label>
                      <select
                        value={selectedFont}
                        onChange={(e) => {
                          trackFontChange(e.target.value);
                          setSelectedFont(e.target.value);
                        }}
                        className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none bg-white font-sans"
                      >
                        {FONTS.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Custom Border Color Picker */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-slate-700">
                          צבע מסגרת וסימוני גזירה:
                        </label>
                        {customBorderColor && (
                          <button
                            onClick={() => {
                              trackEvent('reset_custom_border_color');
                              setCustomBorderColor('');
                            }}
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
                          onChange={(e) => {
                            trackEvent('change_custom_border_color', { color: e.target.value });
                            setCustomBorderColor(e.target.value);
                          }}
                          className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white"
                        />
                        <span className="text-xs text-slate-600">
                          {customBorderColor
                            ? `צבע מותאם (${customBorderColor})`
                            : `צבע ברירת מחדל של התבנית`}
                        </span>
                      </div>
                    </div>

                    {/* Greeting Subtitle Input */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-slate-700">
                          איחול / כותרת עליונה בתג:
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-600">
                          <span>הצג איחול</span>
                          <input
                            type="checkbox"
                            checked={showGreeting}
                            onChange={(e) => {
                              trackToggleGreeting(e.target.checked);
                              setShowGreeting(e.target.checked);
                            }}
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
                              className="flex-1 px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
                            />
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {['יום הולדת שמח ל', 'מזל טוב ל', 'חוגגים ל', 'יום הולדת שמח! 🎉'].map(
                              (preset) => (
                                <button
                                  key={preset}
                                  onClick={() => {
                                    trackEvent('select_greeting_preset', { preset });
                                    setCustomTitle(preset);
                                  }}
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

                    {/* Decorative Icon Choice */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-slate-700">
                          איור / אייקון מקשט:
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-600">
                          <span>הצג איורים</span>
                          <input
                            type="checkbox"
                            checked={showDecorations}
                            onChange={(e) => {
                              trackToggleDecorations(e.target.checked);
                              setShowDecorations(e.target.checked);
                            }}
                            className="w-3.5 h-3.5 accent-rose-500 rounded"
                          />
                        </label>
                      </div>
                      {showDecorations && (
                        <div className="flex flex-wrap gap-2">
                          {ICONS.map((icon) => (
                            <button
                              key={icon}
                              onClick={() => {
                                trackIconChange(icon);
                                setSelectedIcon(icon);
                              }}
                              className={`w-9 h-9 rounded-xl text-base flex items-center justify-center transition-all ${
                                selectedIcon === icon
                                  ? 'bg-rose-500 text-white shadow-md scale-105'
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
              </div>
            )}

            {/* TAB 2: NAMES MANAGER */}
            {activeTab === 'names' && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                
                {/* Hidden JSON file input */}
                <input
                  type="file"
                  ref={jsonFileInputRef}
                  accept=".json"
                  onChange={handleImportJSONFile}
                  className="hidden"
                />

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-bold text-slate-800">
                      עריכת רשימת השמות ({tags.length})
                    </h2>
                    <span className="text-[11px] text-slate-500 font-mono">
                      קובץ מקור: children.json
                    </span>
                  </div>
                  <div className="flex items-center flex-wrap gap-1.5">
                    <button
                      onClick={() => jsonFileInputRef.current?.click()}
                      className="text-xs text-indigo-700 hover:text-indigo-900 font-semibold flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2 py-1 rounded-md transition-colors"
                      title="טען רשימה מקובץ children.json מהמחשב"
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      <span>טען JSON</span>
                    </button>

                    <button
                      onClick={handleExportJSON}
                      className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-1 rounded-md transition-colors"
                      title="הורד את רשימת הילדים העדכנית כקובץ children.json"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>הורד JSON</span>
                    </button>

                    <button
                      onClick={() => {
                        trackBulkImportOpen();
                        setIsBulkModalOpen(true);
                      }}
                      className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 bg-rose-50 px-2 py-1 rounded-md"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>הדבקה מהירה</span>
                    </button>

                    <button
                      onClick={handleResetToOriginal}
                      className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1"
                      title="איפוס לרשימת ה-JSON המקורית מהמאגר"
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
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      trackSearchQuery(e.target.value);
                    }}
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
                      { count: 18, label: '18 תגים (3x6) - תווית מגירה', desc: 'כ-6x4.2 ס"מ • מומלץ למגירות' },
                      { count: 10, label: '10 תגים (2x5) - מדף / כיסא', desc: 'כ-9x5 ס"מ • גודל תקני סטנדרטי' },
                      { count: 8, label: '8 תגים (2x4) - דלת / יום הולדת', desc: 'כ-9x6.5 ס"מ • גודל מוגדל' },
                      { count: 12, label: '12 תגים (3x4) - ריבועי', desc: 'כ-6x6.5 ס"מ • פרופורציה מרובעת' },
                      { count: 20, label: '20 תגים (4x5) - מגירה מרובעת', desc: 'כ-4.8x5 ס"מ • ריבוע קומפקטי' },
                      { count: 15, label: '15 תגים (3x5) - קומפקטי', desc: 'כ-6x5 ס"מ • בינוני-קטן' },
                      { count: 6, label: '6 תגים (2x3) - ענק', desc: 'כ-9x8.5 ס"מ • כרטיס גדול ובולט' },
                      { count: 24, label: '24 תגים (4x6) - מיני מגירות', desc: 'כ-4.8x4.2 ס"מ • חיסכון בדפים' }
                    ].map((opt) => (
                      <button
                        key={opt.count}
                        onClick={() => {
                          trackTagsPerPageChange(opt.count);
                          setTagsPerPage(opt.count);
                          if (opt.count >= 15) setCardSizePreset('small_drawer');
                          else if (opt.count >= 10) setCardSizePreset('medium_shelf');
                          else setCardSizePreset('large_door');
                        }}
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
                    onChange={(e) => {
                      trackEvent('toggle_scissor_marks', { enabled: e.target.checked });
                      setShowScissorMarks(e.target.checked);
                    }}
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
                        onClick={() => {
                          trackEvent('change_cut_border_style', { style: style.id });
                          setBorderStyle(style.id as any);
                        }}
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
                    onChange={(e) => {
                      trackEvent('toggle_corner_crop_marks', { enabled: e.target.checked });
                      setShowCornerCrop(e.target.checked);
                    }}
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
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{exportProgress || 'מעבד קובץ PDF...'}</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>הורד קובץ PDF של כל הדפים</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      trackPrintTags(tags.length, totalPages);
                      let printStyle = document.getElementById('table-dynamic-print-style') as HTMLStyleElement;
                      if (!printStyle) {
                        printStyle = document.createElement('style');
                        printStyle.id = 'table-dynamic-print-style';
                        document.head.appendChild(printStyle);
                      }
                      printStyle.textContent = `@media print { @page { size: A4 portrait; margin: 0; } }`;
                      window.print();
                    }}
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
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-slate-500 ml-1">זום:</span>
                {[50, 70, 85, 100].map((zoomVal) => (
                  <button
                    key={zoomVal}
                    onClick={() => {
                      trackZoomControl(zoomVal, 'tags');
                      setPreviewZoom(zoomVal);
                    }}
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
                    className="a4-print-page portrait bg-white shadow-xl rounded-sm border border-slate-300 relative text-right overflow-hidden transition-transform duration-200"
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

                            {/* Top Banner Row: Greeting & Decorative Icon (Hidden in drawer name_only mode) */}
                            {tagDisplayMode !== 'name_only' && (showGreeting || showDecorations) && (
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
                            <div className="relative z-10 my-auto flex-1 flex flex-col items-center justify-center text-center py-1 w-full overflow-hidden">
                              {/* Child Name with dynamic responsive font size */}
                              <h2
                                className="font-black tracking-tight leading-tight drop-shadow-xs text-center w-full px-1 break-words select-none"
                                style={{
                                  fontSize: calculateNameFontSize(tag.name)
                                }}
                              >
                                {tag.name}
                              </h2>

                              {/* Birth Date Directly Under Name (Hidden in drawer name_only mode) */}
                              {tagDisplayMode !== 'name_only' && showDate && datePlacement === 'under_name' && (
                                <div
                                  className={`mt-1 font-black tracking-tight flex items-center justify-center gap-1.5 transition-all ${
                                    selectedTheme.textColor
                                  } ${
                                    dateSize === 'large'
                                      ? 'text-xl sm:text-2xl'
                                      : 'text-sm sm:text-base font-bold'
                                  }`}
                                >
                                  {showDecorations && (
                                    <span className="text-base">🎈</span>
                                  )}
                                  <span
                                    className={
                                      dateSize === 'large'
                                        ? 'border-b-2 border-current/40 pb-0.5'
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

                            {/* Bottom Row: Footer Decoration or Legacy Bottom Date (Hidden in drawer name_only mode) */}
                            {tagDisplayMode !== 'name_only' && (showDecorations || (showDate && datePlacement === 'bottom')) && (
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
                            )}

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
        מעצב תגי יום הולדת, טבלאות מעקב לגן ודפי פעילות מיון חיות • מותאם להדפסה ב-A4 וב-PDF עם סימוני גזירה
      </footer>

    </div>
  );
}
