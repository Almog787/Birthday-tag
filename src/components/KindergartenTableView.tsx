import React, { useState, useRef, useEffect } from 'react';
import {
  Printer,
  Download,
  Plus,
  Trash2,
  RefreshCw,
  Edit2,
  Palette,
  Columns,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Check,
  FileSpreadsheet
} from 'lucide-react';
import jsPDF from 'jspdf';
import { toJpeg, toPng } from 'html-to-image';
import html2canvas from 'html2canvas';
import { TagItem, TableTemplate, TableDesignTheme } from '../types';
import { TABLE_TEMPLATES, TABLE_DESIGN_THEMES } from '../constants';

interface KindergartenTableViewProps {
  tags: TagItem[];
  onSyncFromTags: () => void;
}

export const KindergartenTableView: React.FC<KindergartenTableViewProps> = ({
  tags,
  onSyncFromTags
}) => {
  // Table state with localStorage persistence
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('wipes_hebrew');
  const [tableTitle, setTableTitle] = useState<string>(TABLE_TEMPLATES[0].title);
  const [tableSubtitle, setTableSubtitle] = useState<string>('גן הילדים • שנת הלימודים תשפ״ה');
  const [columns, setColumns] = useState<string[]>(TABLE_TEMPLATES[0].columns);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('landscape');
  const [showRowNumbers, setShowRowNumbers] = useState<boolean>(true);
  const [showKindergartenFrame, setShowKindergartenFrame] = useState<boolean>(true);
  const [density, setDensity] = useState<'compact' | 'spacious'>('compact');
  const [selectedThemeId, setSelectedThemeId] = useState<string>('rainbow');
  const [tableZoom, setTableZoom] = useState<number>(75);

  // Cell contents storage: rowId -> columnIdx -> text
  const [cellData, setCellData] = useState<Record<string, Record<number, string>>>({});

  // Editing column header state
  const [editingColIdx, setEditingColIdx] = useState<number | null>(null);
  const [newColTitle, setNewColTitle] = useState<string>('');
  const [newColInput, setNewColInput] = useState<string>('');

  // PDF Export status
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<string>('');
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);

  const tableSheetRef = useRef<HTMLDivElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('kindergarten_table_data_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.selectedTemplateId) setSelectedTemplateId(parsed.selectedTemplateId);
        if (parsed.tableTitle) setTableTitle(parsed.tableTitle);
        if (parsed.tableSubtitle) setTableSubtitle(parsed.tableSubtitle);
        if (parsed.columns) setColumns(parsed.columns);
        if (parsed.orientation) setOrientation(parsed.orientation);
        if (parsed.showRowNumbers !== undefined) setShowRowNumbers(parsed.showRowNumbers);
        if (parsed.showKindergartenFrame !== undefined) setShowKindergartenFrame(parsed.showKindergartenFrame);
        if (parsed.density) setDensity(parsed.density);
        if (parsed.selectedThemeId) setSelectedThemeId(parsed.selectedThemeId);
        if (parsed.cellData) setCellData(parsed.cellData);
      }
    } catch (e) {
      console.warn('Failed to load table data from localStorage', e);
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    try {
      const dataToSave = {
        selectedTemplateId,
        tableTitle,
        tableSubtitle,
        columns,
        orientation,
        showRowNumbers,
        showKindergartenFrame,
        density,
        selectedThemeId,
        cellData
      };
      localStorage.setItem('kindergarten_table_data_v2', JSON.stringify(dataToSave));
    } catch (e) {
      console.warn('Failed to save table data to localStorage', e);
    }
  }, [
    selectedTemplateId,
    tableTitle,
    tableSubtitle,
    columns,
    orientation,
    showRowNumbers,
    showKindergartenFrame,
    density,
    selectedThemeId,
    cellData
  ]);

  // Handle template change
  const handleSelectTemplate = (template: TableTemplate) => {
    setSelectedTemplateId(template.id);
    setTableTitle(template.title);
    setColumns([...template.columns]);
    setOrientation(template.orientation);
  };

  // Add column
  const handleAddColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColInput.trim()) return;
    setColumns([...columns, newColInput.trim()]);
    setNewColInput('');
  };

  // Delete column
  const handleDeleteColumn = (idx: number) => {
    if (columns.length <= 1) {
      alert('יש להשאיר לפחות עמודה אחת בטבלה.');
      return;
    }
    setColumns(columns.filter((_, i) => i !== idx));
  };

  // Edit column
  const handleSaveColTitle = (idx: number) => {
    if (!newColTitle.trim()) {
      setEditingColIdx(null);
      return;
    }
    const updated = [...columns];
    updated[idx] = newColTitle.trim();
    setColumns(updated);
    setEditingColIdx(null);
  };

  // Cell edit
  const handleCellChange = (rowId: string, colIdx: number, val: string) => {
    setCellData((prev) => ({
      ...prev,
      [rowId]: {
        ...(prev[rowId] || {}),
        [colIdx]: val
      }
    }));
  };

  // Active theme
  const activeTheme =
    TABLE_DESIGN_THEMES.find((t) => t.id === selectedThemeId) || TABLE_DESIGN_THEMES[0];

  // PDF Export
  const handleDownloadTablePDF = async () => {
    if (!tableSheetRef.current) return;
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
      const isLandscape = orientation === 'landscape';

      const pdf = new PDFDoc({
        orientation: isLandscape ? 'landscape' : 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const pageEl = tableSheetRef.current;
      const originalTransform = pageEl.style.transform;
      const originalMargin = pageEl.style.margin;
      const originalBoxShadow = pageEl.style.boxShadow;

      let imgData: string | null = null;

      try {
        pageEl.style.transform = 'none';
        pageEl.style.margin = '0';
        pageEl.style.boxShadow = 'none';

        await new Promise((resolve) => setTimeout(resolve, 80));

        // Tier 1: toJpeg with embedded fonts
        try {
          imgData = await toJpeg(pageEl, {
            quality: 0.96,
            pixelRatio: 2,
            backgroundColor: '#ffffff',
            cacheBust: true,
            filter: (node) => !(node instanceof HTMLElement && node.classList.contains('no-print'))
          });
        } catch (err1) {
          console.warn('toJpeg with fonts failed, attempting toJpeg with skipFonts:', err1);
          // Tier 2: toJpeg with skipFonts
          try {
            imgData = await toJpeg(pageEl, {
              quality: 0.96,
              pixelRatio: 2,
              backgroundColor: '#ffffff',
              cacheBust: true,
              skipFonts: true,
              filter: (node) => !(node instanceof HTMLElement && node.classList.contains('no-print'))
            });
          } catch (err2) {
            console.warn('toJpeg failed, attempting toPng:', err2);
            // Tier 3: toPng
            try {
              imgData = await toPng(pageEl, {
                pixelRatio: 1.5,
                backgroundColor: '#ffffff',
                skipFonts: true,
                filter: (node) => !(node instanceof HTMLElement && node.classList.contains('no-print'))
              });
            } catch (err3) {
              console.warn('html-to-image failed, falling back to html2canvas:', err3);
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
        throw new Error('שגיאה בלכידת תוכן הטבלה.');
      }

      const imgFormat = imgData.startsWith('data:image/png') ? 'PNG' : 'JPEG';
      const pdfWidth = isLandscape ? 297 : 210;
      const pdfHeight = isLandscape ? 210 : 297;

      pdf.addImage(imgData, imgFormat, 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

      const fileName = `${tableTitle.replace(/[\s\W]+/g, '_')}_גן_ילדים.pdf`;

      try {
        pdf.save(fileName);
      } catch (saveErr) {
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
      console.error('Table PDF Export error:', err);
      setExportError(err?.message || 'אירעה שגיאה בייצוא הטבלה ל-PDF.');
    } finally {
      setIsExporting(false);
      setExportProgress('');
    }
  };

  const isLandscape = orientation === 'landscape';

  return (
    <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-6" dir="rtl">
      
      {/* Sidebar Controls (lg:col-span-5) */}
      <aside className="no-print lg:col-span-5 flex flex-col gap-4">
        
        {/* Template Selector Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-rose-500" />
              <span>בחירת תבנית טבלה לגן:</span>
            </h2>
            <button
              onClick={onSyncFromTags}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 bg-rose-50 px-2.5 py-1 rounded-lg"
              title="סנכרן שמות עדכניים מהתגים"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>סנכרן שמות ({tags.length})</span>
            </button>
          </div>

          <div className="space-y-2">
            {TABLE_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => handleSelectTemplate(tmpl)}
                className={`w-full p-3 rounded-xl border text-right transition-all flex flex-col gap-1 ${
                  selectedTemplateId === tmpl.id
                    ? 'border-rose-500 ring-2 ring-rose-200 bg-rose-50/50 font-bold'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>{tmpl.name}</span>
                  {selectedTemplateId === tmpl.id && (
                    <Check className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                </div>
                <div className="text-[11px] text-slate-500 font-normal">{tmpl.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Table Titles and Headings Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900">כותרות ומיתוג הגן</h2>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              כותרת ראשית של הטבלה:
            </label>
            <input
              type="text"
              value={tableTitle}
              onChange={(e) => setTableTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
              placeholder="למשל: טבלת מעקב ציוד ומגבונים"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              כותרת משנה / שם הגן:
            </label>
            <input
              type="text"
              value={tableSubtitle}
              onChange={(e) => setTableSubtitle(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
              placeholder="למשל: גן שושנים • שנת הלימודים תשפ״ה"
            />
          </div>

          {/* Table Design Theme */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">
              עיצוב וסגנון צבעים לטבלה:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TABLE_DESIGN_THEMES.map((th) => (
                <button
                  key={th.id}
                  onClick={() => setSelectedThemeId(th.id)}
                  className={`p-2 rounded-xl border text-right text-xs transition-all flex items-center justify-between ${
                    selectedThemeId === th.id
                      ? 'border-rose-500 ring-2 ring-rose-200 bg-rose-50/50 font-bold'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span>{th.name}</span>
                  {selectedThemeId === th.id && (
                    <Check className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Columns Management Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              ניהול עמודות המעקב ({columns.length})
            </h2>
          </div>

          {/* Add Column Input */}
          <form onSubmit={handleAddColumn} className="flex gap-2">
            <input
              type="text"
              value={newColInput}
              onChange={(e) => setNewColInput(e.target.value)}
              placeholder="שם עמודה חדשה (למשל: תשרי)"
              className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
            />
            <button
              type="submit"
              className="px-3 py-1.5 text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-lg transition-colors flex items-center gap-1 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>הוסף</span>
            </button>
          </form>

          {/* List of Columns */}
          <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
            {columns.map((col, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 text-xs"
              >
                {editingColIdx === idx ? (
                  <div className="flex items-center gap-1.5 flex-1">
                    <input
                      type="text"
                      value={newColTitle}
                      onChange={(e) => setNewColTitle(e.target.value)}
                      className="px-2 py-1 text-xs border border-rose-400 rounded bg-white flex-1 focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveColTitle(idx)}
                      className="px-2 py-1 bg-rose-500 text-white rounded text-[11px] font-bold"
                    >
                      שמור
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="font-semibold text-slate-800 truncate max-w-[170px]">
                      {col}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingColIdx(idx);
                          setNewColTitle(col);
                        }}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded"
                        title="ערוך כותרת"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteColumn(idx)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        title="מחק עמודה"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Layout & Print Preferences */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900">הגדרות הדפסה ופריסה ל-A4</h2>

          {/* Orientation Toggle */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              כיוון הדף בהדפסה:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setOrientation('portrait')}
                className={`py-2 text-xs font-semibold rounded-xl border transition-all text-center ${
                  orientation === 'portrait'
                    ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold ring-2 ring-rose-200'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                📄 דף לאורך (Portrait)
              </button>
              <button
                onClick={() => setOrientation('landscape')}
                className={`py-2 text-xs font-semibold rounded-xl border transition-all text-center ${
                  orientation === 'landscape'
                    ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold ring-2 ring-rose-200'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                📜 דף לרוחב (Landscape)
              </button>
            </div>
          </div>

          {/* Density Toggle */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              צפיפות שורות (התאמה לדף בודד):
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setDensity('compact')}
                className={`py-2 text-xs font-semibold rounded-xl border transition-all text-center ${
                  density === 'compact'
                    ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold ring-2 ring-rose-200'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                קומפקטי (מתאים ל-30 ילדים בדף)
              </button>
              <button
                onClick={() => setDensity('spacious')}
                className={`py-2 text-xs font-semibold rounded-xl border transition-all text-center ${
                  density === 'spacious'
                    ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold ring-2 ring-rose-200'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                מרווח וגדול (נוח לכתיבה)
              </button>
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer">
              <span>מספור שורות אוטומטי (1, 2, 3...):</span>
              <input
                type="checkbox"
                checked={showRowNumbers}
                onChange={(e) => setShowRowNumbers(e.target.checked)}
                className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer">
              <span>מסגרת דקורטיבית עליזה לגן:</span>
              <input
                type="checkbox"
                checked={showKindergartenFrame}
                onChange={(e) => setShowKindergartenFrame(e.target.checked)}
                className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
              />
            </label>
          </div>

          {/* Action buttons inside sidebar */}
          <div className="pt-3 border-t border-slate-200 space-y-2">
            <button
              onClick={handleDownloadTablePDF}
              disabled={isExporting}
              className="w-full py-2.5 px-4 font-bold text-white bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{exportProgress || 'מייצר PDF...'}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>הורד טבלה כקובץ PDF</span>
                </>
              )}
            </button>

            <button
              onClick={() => window.print()}
              className="w-full py-2 px-4 font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1.5 text-xs"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>הדפסה ישירה במדפסת</span>
            </button>
          </div>

        </div>

      </aside>

      {/* Main Preview Area (lg:col-span-7) */}
      <section className="lg:col-span-7 flex flex-col gap-4">
        
        {/* Top Preview Controls Bar */}
        <div className="no-print bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">תצוגה מקדימה לדף A4</span>
            <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono">
              {isLandscape ? '297x210 מ"מ (לרוחב)' : '210x297 מ"מ (לאורך)'}
            </span>
            <span className="text-[11px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-md font-bold">
              {tags.length} ילדים
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">זום:</span>
            {[65, 75, 85, 100].map((z) => (
              <button
                key={z}
                onClick={() => setTableZoom(z)}
                className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                  tableZoom === z
                    ? 'bg-rose-500 text-white font-bold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {z}%
              </button>
            ))}
          </div>
        </div>

        {/* Feedback alerts */}
        {exportSuccess && (
          <div className="no-print bg-emerald-600 text-white p-3 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-2 shadow-md">
            <CheckCircle2 className="w-4 h-4" />
            <span>קובץ ה-PDF של הטבלה נוצר והורד בהצלחה! מוכן לתלייה בגן 📋</span>
          </div>
        )}

        {exportError && (
          <div className="no-print bg-rose-600 text-white p-3 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-2 shadow-md">
            <AlertCircle className="w-4 h-4" />
            <span>{exportError}</span>
          </div>
        )}

        {/* The Printable A4 Sheet */}
        <div className="print-sheet-container flex justify-center overflow-x-auto pb-10">
          <div
            ref={tableSheetRef}
            className={`a4-print-page bg-white shadow-xl rounded-sm border border-slate-300 relative text-right overflow-hidden transition-transform duration-200 flex flex-col justify-between p-6 ${
              showKindergartenFrame ? activeTheme.frameBorderClass : ''
            }`}
            style={{
              width: isLandscape ? '297mm' : '210mm',
              height: isLandscape ? '210mm' : '297mm',
              boxSizing: 'border-box',
              transform: `scale(${tableZoom / 100})`,
              transformOrigin: 'top center',
              margin: tableZoom < 100 ? `0 0 -${(100 - tableZoom) * 2.8}mm 0` : '0'
            }}
          >
            {/* Kindergarten Corner Icons if frame enabled */}
            {showKindergartenFrame && (
              <>
                <div className="absolute top-2 right-2 text-base select-none pointer-events-none opacity-80">
                  🎈
                </div>
                <div className="absolute top-2 left-2 text-base select-none pointer-events-none opacity-80">
                  ⭐
                </div>
                <div className="absolute bottom-2 right-2 text-base select-none pointer-events-none opacity-80">
                  🎨
                </div>
                <div className="absolute bottom-2 left-2 text-base select-none pointer-events-none opacity-80">
                  ✨
                </div>
              </>
            )}

            {/* Table Header Section */}
            <div className="text-center pb-3 border-b-2 border-slate-200 mb-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
                <span>{tableTitle}</span>
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-0.5">
                {tableSubtitle}
              </p>
            </div>

            {/* Table Itself */}
            <div className="flex-1 overflow-hidden flex flex-col">
              <table className="w-full h-full border-collapse text-right text-xs table-fixed">
                <thead>
                  <tr className={`${activeTheme.headerBg} font-bold text-center`}>
                    {showRowNumbers && (
                      <th className="border border-slate-300/60 p-1 w-8 text-center text-[11px]">
                        מס'
                      </th>
                    )}
                    <th className="border border-slate-300/60 p-1 w-28 sm:w-36 text-right pr-2 text-xs font-black">
                      שם הילד / ה
                    </th>
                    {columns.map((col, idx) => (
                      <th
                        key={idx}
                        className="border border-slate-300/60 p-1 text-center font-bold truncate text-[11px]"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tags.map((tag, rowIdx) => {
                    const rowIsAlt = rowIdx % 2 === 1;
                    return (
                      <tr
                        key={tag.id}
                        className={`${
                          rowIsAlt ? activeTheme.altRowBg : 'bg-white'
                        } border-b border-slate-200`}
                        style={{
                          height: density === 'compact' ? 'auto' : '26px'
                        }}
                      >
                        {showRowNumbers && (
                          <td className="border border-slate-200 p-0.5 text-center text-[10px] text-slate-400 font-mono">
                            {rowIdx + 1}
                          </td>
                        )}
                        <td className="border border-slate-200 p-1 font-bold text-slate-900 truncate pr-2 text-[11px] sm:text-xs">
                          {tag.name}
                        </td>
                        {columns.map((_, colIdx) => {
                          const currentVal = cellData[tag.id]?.[colIdx] || '';
                          return (
                            <td
                              key={colIdx}
                              className="border border-slate-200 p-0.5 text-center"
                            >
                              <input
                                type="text"
                                value={currentVal}
                                onChange={(e) =>
                                  handleCellChange(tag.id, colIdx, e.target.value)
                                }
                                placeholder="—"
                                className="w-full h-full bg-transparent text-center text-[10px] text-slate-800 focus:bg-white focus:outline-none placeholder:text-slate-200 font-medium"
                              />
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer with Notice and Date */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-medium">
              <span>הופק באמצעות מעצב תגי וטבלאות יום הולדת לגן</span>
              <span>סה״כ {tags.length} ילדים ברשימה • בהצלחה ובשמחה! 🎉</span>
            </div>

          </div>
        </div>

      </section>

    </div>
  );
};
