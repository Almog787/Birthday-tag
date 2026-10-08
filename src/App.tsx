import React, { useState, useRef } from 'react';
import {
  Printer,
  Download,
  Plus,
  Trash2,
  Edit3,
  RefreshCw,
  Palette,
  LayoutGrid,
  Scissors,
  Check,
  Search,
  Sparkles,
  Gift,
  RotateCcw,
  Sliders,
  Type,
  FileText,
  Calendar,
  User,
  Heart,
  Star,
  Copy,
  Zap
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// 29 Children provided in user prompt
interface TagItem {
  id: string;
  name: string;
  date: string;
}

const INITIAL_TAGS: TagItem[] = [
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
  { id: '27', name: 'מיכל', date: '31.5' },
  { id: '28', name: 'אלמה', date: '13.9' },
  { id: '29', name: 'עמנואל', date: '13.9' }
];

interface ThemePreset {
  id: string;
  name: string;
  bgColor: string;
  cardBg: string;
  borderColor: string;
  textColor: string;
  accentColor: string;
  subtextColor: string;
  icon: string;
  badgeBg: string;
  fontFamily: string;
  patternStyle: string;
}

const THEMES: ThemePreset[] = [
  {
    id: 'festive',
    name: '🎈 יומולדת חגיגית',
    bgColor: 'from-amber-50 via-rose-50 to-sky-50',
    cardBg: 'bg-white',
    borderColor: 'border-rose-300',
    textColor: 'text-rose-950',
    accentColor: 'text-rose-600',
    subtextColor: 'text-rose-700',
    icon: '🎈',
    badgeBg: 'bg-rose-100/80',
    fontFamily: "'Fredoka', sans-serif",
    patternStyle: 'radial-gradient(circle, #fecdd3 1px, transparent 1px)'
  },
  {
    id: 'stars',
    name: '🌟 כוכבי הקסם',
    bgColor: 'from-indigo-900 via-purple-900 to-slate-900',
    cardBg: 'bg-indigo-950',
    borderColor: 'border-amber-400',
    textColor: 'text-amber-300',
    accentColor: 'text-amber-400',
    subtextColor: 'text-indigo-200',
    icon: '⭐',
    badgeBg: 'bg-amber-400/20',
    fontFamily: "'Secular One', sans-serif",
    patternStyle: 'radial-gradient(circle, #fbbf24 1px, transparent 1px)'
  },
  {
    id: 'safari',
    name: '🌿 ספארי מוזהב',
    bgColor: 'from-emerald-50 via-amber-50 to-teal-50',
    cardBg: 'bg-emerald-50/60',
    borderColor: 'border-emerald-400',
    textColor: 'text-emerald-950',
    accentColor: 'text-emerald-700',
    subtextColor: 'text-emerald-800',
    icon: '🦁',
    badgeBg: 'bg-emerald-200/60',
    fontFamily: "'Rubik', sans-serif",
    patternStyle: 'none'
  },
  {
    id: 'unicorn',
    name: '🦄 חד קרן פסטל',
    bgColor: 'from-fuchsia-50 via-purple-50 to-indigo-50',
    cardBg: 'bg-white/90',
    borderColor: 'border-purple-300',
    textColor: 'text-purple-950',
    accentColor: 'text-fuchsia-600',
    subtextColor: 'text-purple-700',
    icon: '✨',
    badgeBg: 'bg-fuchsia-100',
    fontFamily: "'Fredoka', sans-serif",
    patternStyle: 'none'
  },
  {
    id: 'royal',
    name: '👑 מלכותי יוקרתי',
    bgColor: 'from-amber-100 via-orange-50 to-yellow-100',
    cardBg: 'bg-amber-50/90',
    borderColor: 'border-amber-500',
    textColor: 'text-amber-950',
    accentColor: 'text-amber-700',
    subtextColor: 'text-amber-800',
    icon: '👑',
    badgeBg: 'bg-amber-200/70',
    fontFamily: "'Assistant', sans-serif",
    patternStyle: 'none'
  },
  {
    id: 'candy',
    name: '🍩 סוכריות ומתוקים',
    bgColor: 'from-pink-100 via-rose-100 to-amber-100',
    cardBg: 'bg-white',
    borderColor: 'border-pink-400',
    textColor: 'text-pink-950',
    accentColor: 'text-rose-600',
    subtextColor: 'text-pink-800',
    icon: '🎂',
    badgeBg: 'bg-pink-100',
    fontFamily: "'Varela Round', sans-serif",
    patternStyle: 'none'
  },
  {
    id: 'minimal',
    name: '🎨 מינימליסטי נקי',
    bgColor: 'from-slate-100 to-slate-200',
    cardBg: 'bg-white',
    borderColor: 'border-slate-400',
    textColor: 'text-slate-900',
    accentColor: 'text-slate-700',
    subtextColor: 'text-slate-600',
    icon: '🎁',
    badgeBg: 'bg-slate-100',
    fontFamily: "'Heebo', sans-serif",
    patternStyle: 'none'
  }
];

const FONTS = [
  { id: "'Assistant', sans-serif", name: 'אסיסטנט (נקי ואלגנטי)' },
  { id: "'Rubik', sans-serif", name: 'רוביק (מודרני וברור)' },
  { id: "'Fredoka', sans-serif", name: 'פרדוקה (שובב ועגול)' },
  { id: "'Secular One', sans-serif", name: 'סקיולר (חזק ובולט)' },
  { id: "'Varela Round', sans-serif", name: 'ורלה ראונד (נעים ורך)' },
  { id: "'Heebo', sans-serif", name: 'היבו (קלאסי ומדויק)' }
];

const ICONS = ['🎈', '🎂', '👑', '🎁', '⭐', '✨', '🦁', '💖', '🎉', '🦄', '🍩', '🏆'];

export default function App() {
  // State
  const [tags, setTags] = useState<TagItem[]>(INITIAL_TAGS);
  const [selectedTheme, setSelectedTheme] = useState<ThemePreset>(THEMES[0]);
  const [customTitle, setCustomTitle] = useState<string>('יום הולדת שמח ל');
  const [showScissorMarks, setShowScissorMarks] = useState<boolean>(true);
  const [borderStyle, setBorderStyle] = useState<'dashed' | 'solid' | 'double'>('dashed');
  const [tagsPerPage, setTagsPerPage] = useState<number>(10); // 10, 8, 12, 15
  const [selectedIcon, setSelectedIcon] = useState<string>('🎈');
  const [selectedFont, setSelectedFont] = useState<string>(THEMES[0].fontFamily);
  const [dateFormat, setDateFormat] = useState<'standard' | 'hebrew_prefix'>('standard');
  const [showCornerCrop, setShowCornerCrop] = useState<boolean>(true);
  const [previewZoom, setPreviewZoom] = useState<number>(85); // 85%
  const [activeTab, setActiveTab] = useState<'design' | 'names' | 'print'>('design');

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // New Item Inputs
  const [newName, setNewName] = useState<string>('');
  const [newDate, setNewDate] = useState<string>('');

  // PDF Generation Progress
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<string>('');

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

  // PDF Export
  const handleDownloadPDF = async () => {
    if (!printPagesRef.current) return;
    setIsExporting(true);
    setExportProgress('מכין את קובץ ה-PDF...');

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageElements = printPagesRef.current.querySelectorAll('.a4-print-page');

      for (let i = 0; i < pageElements.length; i++) {
        setExportProgress(`מעבד עמוד ${i + 1} מתוך ${pageElements.length}...`);
        const pageEl = pageElements[i] as HTMLElement;

        const canvas = await html2canvas(pageEl, {
          scale: 2, // High resolution output
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.98);
        if (i > 0) {
          pdf.addPage('a4', 'portrait');
        }
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
      }

      setExportProgress('מוריד קובץ...');
      pdf.save(`כרטיסי_יום_הולדת_לתג_${tags.length}_שמות.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
      alert('אירעה שגיאה ביצירת ה-PDF. אנא נסה שוב.');
    } finally {
      setIsExporting(false);
      setExportProgress('');
    }
  };

  // Browser Direct Print
  const handleDirectPrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-['Assistant',sans-serif] text-slate-800" dir="rtl">
      {/* Top Header Navigation */}
      <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center text-white shadow-md font-extrabold text-xl">
              🎈
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">
                מעצב תגי יום הולדת לילדים
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                עיצוב, ניהול שמות והורדת PDF מוכן להדפסה ולגזירה ({tags.length} תגים)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleDirectPrint}
              className="px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
              title="הדפסה ישירה במדפסת"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">הדפס</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{exportProgress || 'מעבד...'}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>הורד PDF להדפסה</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
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
              
              {/* Theme Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2.5">
                  בחירת תבנית עיצוב:
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => {
                        setSelectedTheme(theme);
                        setSelectedFont(theme.fontFamily);
                        setSelectedIcon(theme.icon);
                      }}
                      className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between ${
                        selectedTheme.id === theme.id
                          ? 'border-rose-500 ring-2 ring-rose-200 bg-rose-50/50 font-bold'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <span className="text-sm">{theme.name}</span>
                      {selectedTheme.id === theme.id && (
                        <Check className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Greeting Subtitle Input */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  איחול / כותרת בתג:
                </label>
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
              </div>

              {/* Font Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  גופן (פונט עברי):
                </label>
                <select
                  value={selectedFont}
                  onChange={(e) => setSelectedFont(e.target.value)}
                  className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none bg-white"
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
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  איור / אייקון מקשט:
                </label>
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
                <button
                  onClick={handleResetToOriginal}
                  className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>אפס לרשימה המקורית</span>
                </button>
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
                        className="w-16 px-2 py-1 text-xs font-mono text-center border border-slate-200 rounded focus:bg-white focus:outline-none"
                      />
                      <button
                        onClick={() => handleDuplicateTag(tag)}
                        title="שכפל"
                        className="p-1 text-slate-400 hover:text-slate-600 rounded"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTag(tag.id)}
                        title="מחק"
                        className="p-1 text-rose-400 hover:text-rose-600 rounded"
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

            </div>
          )}

          {/* Quick Stats Box */}
          <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 block">סה"כ תגים:</span>
              <span className="text-base font-bold text-white">{tags.length} תגים</span>
            </div>
            <div className="text-left">
              <span className="text-slate-400 block">סה"כ עמודי A4:</span>
              <span className="text-base font-bold text-amber-400">{totalPages} עמודים</span>
            </div>
          </div>

        </aside>

        {/* Right / Center Preview Sheet Panel (lg:col-span-7) */}
        <section className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Zoom & View Header */}
          <div className="no-print bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-rose-500" />
              <span>תצוגה מקדימה של דפי A4 להדפסה ({totalPages} עמודים)</span>
            </span>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">זום:</span>
              {[70, 85, 100].map((z) => (
                <button
                  key={z}
                  onClick={() => setPreviewZoom(z)}
                  className={`px-2 py-1 rounded text-xs font-mono font-semibold ${
                    previewZoom === z
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {z}%
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
                    {pageTags.map((tag) => (
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
                          backgroundImage: selectedTheme.patternStyle !== 'none' ? selectedTheme.patternStyle : undefined,
                          backgroundSize: '12px 12px'
                        }}
                      >
                        {/* Scissor icon at corner */}
                        {showScissorMarks && (
                          <div className="absolute top-1 left-1 text-[11px] text-slate-400 opacity-60 pointer-events-none transform -rotate-45">
                            ✂️
                          </div>
                        )}

                        {/* Top Banner Row: Custom Greeting & Decorative Icon */}
                        <div className="flex items-center justify-between border-b border-slate-200/50 pb-1.5">
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${selectedTheme.badgeBg} ${selectedTheme.subtextColor}`}
                          >
                            {customTitle}
                          </span>
                          <span className="text-xl filter drop-shadow-xs">
                            {selectedIcon}
                          </span>
                        </div>

                        {/* Middle: Child Name */}
                        <div className="my-auto text-center py-2">
                          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-none drop-shadow-xs">
                            {tag.name}
                          </h2>
                        </div>

                        {/* Bottom Row: Birth Date Badge */}
                        <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/50">
                          <div className="flex items-center gap-1 text-xs opacity-75 font-medium">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            <span>מזל טוב!</span>
                          </div>
                          
                          <div className={`px-2.5 py-0.5 rounded-md font-mono text-xs font-bold ${selectedTheme.badgeBg} ${selectedTheme.accentColor} flex items-center gap-1`}>
                            <Calendar className="w-3 h-3 inline" />
                            <span>{tag.date}</span>
                          </div>
                        </div>

                      </div>
                    ))}
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

      {/* Footer */}
      <footer className="no-print bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        מעצב תגי יום הולדת לילדים • מוכן להדפסה ב-A4 עם סימוני גזירה מדויקים
      </footer>
    </div>
  );
}
