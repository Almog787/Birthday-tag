// Google Analytics (gtag.js) tracking helper
// Measurement ID: G-Q4YPYFREZL

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Universal safe event tracker
 */
export function trackEvent(eventName: string, params: Record<string, any> = {}): void {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, {
        ...params,
        send_to: 'G-Q4YPYFREZL'
      });
    }
  } catch (err) {
    // Silently handle if gtag is blocked by privacy extensions
    console.debug('GA tracking event:', eventName, params);
  }
}

// ==========================================
// Specific tracking helpers for Birthday Tags
// ==========================================

export function trackMainTabSwitch(tab: 'tags' | 'tables'): void {
  trackEvent('switch_main_module', {
    module_name: tab,
    module_label: tab === 'tags' ? 'תגי יום הולדת' : 'טבלאות ומעקב לגן'
  });
}

export function trackTagSubTab(tab: 'design' | 'names' | 'print'): void {
  trackEvent('switch_tag_subtab', {
    subtab: tab,
    subtab_label: tab === 'design' ? 'עיצוב ותבניות' : tab === 'names' ? 'ניהול רשימת ילדים' : 'הגדרות הדפסה ו-PDF'
  });
}

export function trackThemeChange(themeId: string, themeName: string): void {
  trackEvent('change_theme', {
    theme_id: themeId,
    theme_name: themeName
  });
}

export function trackPaletteChange(paletteId: string): void {
  trackEvent('change_palette', {
    palette_id: paletteId
  });
}

export function trackPatternChange(patternId: string): void {
  trackEvent('change_bg_pattern', {
    pattern_id: patternId
  });
}

export function trackGradientChange(gradientId: string): void {
  trackEvent('change_gradient', {
    gradient_id: gradientId
  });
}

export function trackFontChange(fontFamily: string): void {
  trackEvent('change_font', {
    font_family: fontFamily
  });
}

export function trackIconChange(icon: string): void {
  trackEvent('change_tag_icon', {
    icon_symbol: icon
  });
}

export function trackTagModeSelect(mode: 'full' | 'clean' | 'text_only'): void {
  trackEvent('select_tag_display_mode', {
    display_mode: mode,
    mode_label: mode === 'full' ? 'מלא (שם + תאריך + איורים)' : mode === 'clean' ? 'נקי (שם + תאריך בלבד)' : 'טקסט בלבד (שם בלבד)'
  });
}

export function trackToggleDate(enabled: boolean): void {
  trackEvent('toggle_birthdate_display', {
    enabled,
    action: enabled ? 'show_date' : 'hide_date'
  });
}

export function trackToggleDecorations(enabled: boolean): void {
  trackEvent('toggle_decorations_display', {
    enabled,
    action: enabled ? 'show_decorations' : 'hide_decorations'
  });
}

export function trackToggleGreeting(enabled: boolean): void {
  trackEvent('toggle_greeting_display', {
    enabled
  });
}

export function trackDatePlacementChange(placement: 'under_name' | 'bottom'): void {
  trackEvent('change_date_placement', {
    placement
  });
}

export function trackDateSizeChange(size: 'large' | 'medium'): void {
  trackEvent('change_date_size', {
    size
  });
}

export function trackTagsPerPageChange(count: number): void {
  trackEvent('change_tags_per_page', {
    tags_per_page: count
  });
}

export function trackAddChild(name: string, date: string): void {
  trackEvent('add_child_tag', {
    child_name_length: name.length,
    has_date: Boolean(date)
  });
}

export function trackDeleteChild(): void {
  trackEvent('delete_child_tag');
}

export function trackResetChildren(): void {
  trackEvent('reset_children_list_to_default');
}

export function trackBulkImportOpen(): void {
  trackEvent('open_bulk_import_modal');
}

export function trackBulkImportSubmit(importedCount: number): void {
  trackEvent('bulk_import_children_success', {
    imported_count: importedCount
  });
}

export function trackPrintTags(totalTags: number, pagesCount: number): void {
  trackEvent('print_tags_click', {
    total_tags: totalTags,
    pages_count: pagesCount
  });
}

export function trackDownloadPDF(view: 'tags' | 'tables', extraParams: Record<string, any> = {}): void {
  trackEvent('download_pdf_click', {
    view_type: view,
    ...extraParams
  });
}

export function trackDownloadImage(format: 'png' | 'jpg'): void {
  trackEvent('download_image_click', {
    image_format: format
  });
}

export function trackSearchQuery(query: string): void {
  if (query.trim()) {
    trackEvent('search_children_list', {
      query_length: query.trim().length
    });
  }
}

export function trackZoomControl(zoom: number, view: 'tags' | 'tables'): void {
  trackEvent('change_preview_zoom', {
    zoom_level: zoom,
    view_type: view
  });
}

// ==========================================
// Tracking helpers for Kindergarten Tables
// ==========================================

export function trackTableTemplateSelect(templateId: string, templateName: string): void {
  trackEvent('select_table_template', {
    template_id: templateId,
    template_name: templateName
  });
}

export function trackTableOrientationChange(isLandscape: boolean): void {
  trackEvent('toggle_table_orientation', {
    orientation: isLandscape ? 'landscape' : 'portrait'
  });
}

export function trackTableDesignThemeChange(themeId: string, themeName: string): void {
  trackEvent('change_table_theme', {
    table_theme_id: themeId,
    table_theme_name: themeName
  });
}

export function trackTableBorderChange(borderId: string): void {
  trackEvent('change_table_border', {
    border_id: borderId
  });
}

export function trackTableDensityChange(density: 'compact' | 'normal' | 'spacious'): void {
  trackEvent('change_table_density', {
    density
  });
}

export function trackTableAddColumn(columnName: string): void {
  trackEvent('add_table_column', {
    column_name: columnName
  });
}

export function trackTableDeleteColumn(columnIndex: number): void {
  trackEvent('delete_table_column', {
    column_index: columnIndex
  });
}

export function trackTableAddRow(name: string): void {
  trackEvent('add_table_row', {
    has_name: Boolean(name)
  });
}

export function trackTableDeleteRow(): void {
  trackEvent('delete_table_row');
}

export function trackTableSyncWithTags(tagsCount: number): void {
  trackEvent('sync_table_with_tags_list', {
    synced_children_count: tagsCount
  });
}

export function trackTableReset(): void {
  trackEvent('reset_table_to_template');
}

export function trackPrintTable(rowsCount: number, columnsCount: number, isLandscape: boolean): void {
  trackEvent('print_table_click', {
    rows_count: rowsCount,
    columns_count: columnsCount,
    orientation: isLandscape ? 'landscape' : 'portrait'
  });
}
