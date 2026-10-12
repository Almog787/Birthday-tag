export interface TagItem {
  id: string;
  name: string;
  date: string;
}

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
}

export type AnimalWorksheetTemplate = 'cut_and_paste' | 'line_matching';
export type AnimalWorksheetColorMode = 'color' | 'coloring_book';
export type AnimalWorksheetBorder = 'kindergarten' | 'dots' | 'double' | 'clean';
export type AnimalPageLayoutMode = 'combined' | 'separated';
export type AnimalCardsSize = 'medium' | 'large';

// Magnetic Kit Specific Types
export type AnimalCardsPerSheet = 4 | 6; // 4 = extra large (9.5-10cm) 2x2, 6 = medium-large (8cm) 2x3
export type AnimalCardBgStyle = 'clean_white' | 'pastel_tint' | 'vibrant_border';
export type AnimalCutLinesStyle = 'dashed' | 'crop_marks' | 'solid';

export type AnimalArtStyle = 'classic' | 'story_animation';

export type MainViewType = 'tags' | 'tables' | 'animal_sorting';


