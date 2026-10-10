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
