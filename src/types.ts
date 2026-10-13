export interface TagItem {
  id: string;
  name: string;
  date: string;
}

export type TagDisplayMode = 'full' | 'clean' | 'name_only';
export type TagCardSizePreset = 'small_drawer' | 'medium_shelf' | 'large_door';
export type TagFontSizePreset = 'regular' | 'large' | 'max_fill';

export type TableColumnBorderThickness = 'regular' | 'thick' | 'extra_bold';

export interface ThemePreset {
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
  customBgGradient?: string;
  borderColorHex?: string;
}

export interface BackgroundPattern {
  id: string;
  name: string;
  cssPattern: (colorHex: string) => string;
}

export interface GradientStyle {
  id: string;
  name: string;
  gradientClass: string;
}

export interface ColorPalette {
  id: string;
  name: string;
  cardBg: string;
  borderColor: string;
  borderColorHex: string;
  textColor: string;
  accentColor: string;
  subtextColor: string;
  badgeBg: string;
  previewColor: string;
}

export interface TableColumn {
  id: string;
  title: string;
  width?: string;
}

export interface TableRowData {
  id: string;
  name: string;
  cells: Record<string, string>;
}

export interface TableTemplate {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  columns: string[];
  orientation: 'portrait' | 'landscape';
  description: string;
}

export interface TableDesignTheme {
  id: string;
  name: string;
  headerBg: string;
  headerText: string;
  borderColor: string;
  borderHex: string;
  altRowBg: string;
  accentBadge: string;
  frameBorderClass: string;
}

// ==========================================
// Animal Sorting Worksheet Types
// ==========================================
export type AnimalLegsCount = 2 | 4;

export interface AnimalItem {
  id: string;
  name: string;
  nameNikud: string;
  legs: AnimalLegsCount;
  category: 'birds' | 'mammals' | 'reptiles' | 'pets' | 'farm' | 'wild';
  categoryLabel: string;
  description: string;
  soundEmoji?: string;
  imagePath?: string;
}

export type AnimalWorksheetTemplate = 'cut_and_paste' | 'line_matching';
export type AnimalWorksheetColorMode = 'color' | 'coloring_book';
export type AnimalWorksheetBorder = 'kindergarten' | 'dots' | 'double' | 'clean';
export type AnimalPageLayoutMode = 'combined' | 'separated';
export type AnimalCardsSize = 'medium' | 'large';

// Magnetic Kit Specific Types
export type AnimalCardsPerSheet = 1 | 2 | 4 | 6 | 8 | 9; // 1 = full A4 poster, 2 = half-page (1x2), 4 = large (2x2), 6 = medium (2x3), 8 = compact (2x4), 9 = mini (3x3)
export type AnimalImageScale = 'fill' | 'large' | 'medium' | 'contained'; // 'fill' = fills card maximally, 'large' = 85%, 'medium' = 70%, 'contained' = with padding
export type AnimalCardBgStyle = 'clean_white' | 'pastel_tint' | 'vibrant_border';
export type AnimalCutLinesStyle = 'dashed' | 'crop_marks' | 'solid';

export type MainViewType = 'tags' | 'tables' | 'animal_sorting';


