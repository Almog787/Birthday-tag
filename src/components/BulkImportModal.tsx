import React, { useState } from 'react';
import { X, Upload, Check, AlertCircle } from 'lucide-react';
import { TagItem } from '../types';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (newTags: TagItem[], mode: 'replace' | 'append') => void;
  currentTagsCount: number;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
  currentTagsCount
}) => {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleParseAndImport = (mode: 'replace' | 'append') => {
    setError(null);
    if (!text.trim()) {
      setError('אנא הדבק רשימת שמות או תאריכים.');
      return;
    }

    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) {
      setError('לא נמצאו שורות תקינות.');
      return;
    }

    const parsed: TagItem[] = [];

    lines.forEach((line, idx) => {
      // Clean bullet points (*, -, •, 1., etc.)
      const cleanedLine = line.replace(/^[\*\-•\d\.\)\s]+/, '').trim();
      if (!cleanedLine) return;

      // Check if line contains a date pattern like DD.MM or DD/MM or DD-MM
      const dateMatch = cleanedLine.match(/(\d{1,2}[\.\/\-]\d{1,2})/);

      let name = cleanedLine;
      let date = '01.01';

      if (dateMatch && dateMatch[0]) {
        date = dateMatch[0].replace(/[\/\-]/g, '.');
        name = cleanedLine.replace(dateMatch[0], '').replace(/[\-–,:]+/g, ' ').trim();
      }

      if (name) {
        parsed.push({
          id: `${Date.now()}-${idx}`,
          name,
          date
        });
      }
    });

    if (parsed.length === 0) {
      setError('לא הצלחנו לפענח שמות מהטקסט שהוזן.');
      return;
    }

    onImport(parsed, mode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4 animate-fade-in" dir="rtl">
      <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-slate-200 relative text-right max-h-[90vh] flex flex-col justify-between overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold shrink-0">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">הדבקה מהירה של רשימת ילדים</h3>
              <p className="text-xs text-slate-500">הדבק רשימה מוואטסאפ, אקסל או וורד</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions */}
        <div className="py-2.5 text-xs text-slate-600 space-y-1">
          <p className="font-medium text-slate-800">דוגמה לפורמט נתמך (שורה לכל ילד):</p>
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700 leading-relaxed">
            אביב 18.06<br />
            דור 07.07<br />
            עלמה 27.07
          </div>
          <p className="text-slate-500 text-[11px]">
            * המערכת תזהה אוטומטית את השם ואת תאריך הלידה (גם עם מקף, פסיק או כוכבית).
          </p>
        </div>

        {/* Text Area */}
        <div className="space-y-1.5 flex-1">
          <label className="text-xs font-bold text-slate-700 block">
            הדבק את הרשימה כאן:
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={7}
            placeholder="הדבק כאן את רשימת השמות והתאריכים..."
            className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-400 focus:outline-none resize-none font-sans"
          />
        </div>

        {error && (
          <div className="mt-2 p-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors order-1 sm:order-none"
          >
            ביטול
          </button>

          {currentTagsCount > 0 && (
            <button
              onClick={() => handleParseAndImport('append')}
              className="px-3.5 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <span>+ הוסף לרשימה ({currentTagsCount})</span>
            </button>
          )}

          <button
            onClick={() => handleParseAndImport('replace')}
            className="px-4 py-2 text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl shadow-xs hover:shadow transition-all flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>החלף את הרשימה</span>
          </button>
        </div>

      </div>
    </div>
  );
};
