
export const CHART_COLORS = {
  ORIGINAL: '#333333',
  VARIATION_A: '#4F46E5',
  VARIATION_B: '#FF7300',
  VARIATION_C: '#10B981',
} as const;

export const DEFAULT_COLORS = [
  CHART_COLORS.ORIGINAL,
  CHART_COLORS.VARIATION_A,
  CHART_COLORS.VARIATION_B,
  CHART_COLORS.VARIATION_C,
] as const;

export const VARIATION_IDS = {
  ORIGINAL: '0',
  VARIATION_A: '10001',
  VARIATION_B: '10002',
  VARIATION_C: '10003',
} as const;

export const CHART_CONFIG = {
  HEIGHT: 500,
  BRUSH_HEIGHT: 30,
  MARGIN: {
    top: 10,
    right: 30,
    left: 0,
    bottom: 0,
  },
  STROKE_WIDTH: 2,
  ACTIVE_DOT_RADIUS: 6,
  MIN_TICK_GAP: 30,
} as const;

export const GRID_CONFIG = {
  VERTICAL_DASH: '4 4',
  HORIZONTAL_DASH: '0',
  LIGHT_THEME: {
    VERTICAL: '#e0e0e0',
    HORIZONTAL: '#d0d0d0',
    AXIS: '#999',
  },
  DARK_THEME: {
    VERTICAL: '#333',
    HORIZONTAL: '#444',
    AXIS: '#666',
  },
} as const;

export const ZOOM_CONFIG = {
  MIN_RANGE: 5,
  ZOOM_IN_FACTOR: 0.7,
  ZOOM_OUT_FACTOR: 1.4,
} as const;

export const TOOLTIP_CONFIG = {
  ICON_SIZE: 14,
  TROPHY_SIZE: 12,
  DOT_SIZE: 8,
} as const;

export const UI_CONFIG = {
  FONT_SIZE: {
    AXIS: 12,
    TOOLTIP: 13,
  },
  ICON_SIZE: {
    CONTROL: 16,
    CHEVRON: 14,
  },
  BUTTON: {
    SIZE: 36,
  },
  LEGEND_PADDING_TOP: 20,
  FILL_OPACITY: 0.1,
} as const;

export const THEME_COLORS = {
  LIGHT: {
    BACKGROUND: '#fff',
    TEXT: '#000',
    CONTAINER_TEXT: '#333',
    BORDER: '#eee',
    BRUSH_FILL: '#fafafa',
    BRUSH_STROKE: '#e0e0e0',
    TOOLTIP_BG: 'white',
    TOOLTIP_BORDER: '#f0f0f0',
    TOOLTIP_TEXT: '#666',
  },
  DARK: {
    BACKGROUND: '#1a1a1a',
    TEXT: '#fff',
    CONTAINER_TEXT: '#fff',
    BORDER: '#555',
    BRUSH_FILL: '#222',
    BRUSH_STROKE: '#e0e0e0',
    TOOLTIP_BG: '#333',
    TOOLTIP_BORDER: '#444',
    TOOLTIP_TEXT: '#aaa',
  },
} as const;
