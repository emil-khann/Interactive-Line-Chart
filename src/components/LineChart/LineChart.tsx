import React, { forwardRef } from 'react';
import {
  LineChart as RechartsLineChart,
  AreaChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Brush,
  TooltipProps,
} from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { ProcessedDataPoint, Variation } from '../../utils/dataProcessor';
import styles from './LineChart.module.css';
import { LineStyle } from '../Controls/Controls';
import { Calendar, Trophy } from 'lucide-react';
import {
  CHART_COLORS,
  DEFAULT_COLORS,
  VARIATION_IDS,
  CHART_CONFIG,
  GRID_CONFIG,
  TOOLTIP_CONFIG,
  UI_CONFIG,
  THEME_COLORS,
} from '../../constants/chart';

interface LineChartProps {
  data: ProcessedDataPoint[];
  variations: Variation[];
  selectedVariations: string[];
  lineStyle: LineStyle;
  isDarkTheme: boolean;
  brushStartIndex?: number;
  brushEndIndex?: number;
  onBrushChange?: (startIndex: number, endIndex: number) => void;
}

const COLORS_MAP: Record<string, string> = {
  [VARIATION_IDS.ORIGINAL]: CHART_COLORS.ORIGINAL,
  [VARIATION_IDS.VARIATION_A]: CHART_COLORS.VARIATION_A,
  [VARIATION_IDS.VARIATION_B]: CHART_COLORS.VARIATION_B,
  [VARIATION_IDS.VARIATION_C]: CHART_COLORS.VARIATION_C,
};

const CustomTooltip = ({ active, payload, label, isDarkTheme }: TooltipProps<ValueType, NameType> & { isDarkTheme: boolean }) => {
  if (active && payload && payload.length) {
    const maxVal = Math.max(...payload.map((p) => Number(p.value)));
    const date = new Date(label);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    return (
      <div className={styles.tooltip} style={{
        background: isDarkTheme ? THEME_COLORS.DARK.TOOLTIP_BG : THEME_COLORS.LIGHT.TOOLTIP_BG,
        color: isDarkTheme ? THEME_COLORS.DARK.TEXT : THEME_COLORS.LIGHT.CONTAINER_TEXT
      }}>
        <div className={styles.tooltipHeader} style={{ borderColor: isDarkTheme ? THEME_COLORS.DARK.TOOLTIP_BORDER : THEME_COLORS.LIGHT.TOOLTIP_BORDER }}>
          <Calendar size={TOOLTIP_CONFIG.ICON_SIZE} />
          <span>{formattedDate}</span>
        </div>
        {payload.map((entry) => (
          <div key={entry.name} className={styles.tooltipItem}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span className={styles.dot} style={{ backgroundColor: entry.color }}></span>
              <span>{entry.name}</span>
              {entry.value === maxVal && (
                <Trophy size={TOOLTIP_CONFIG.TROPHY_SIZE} className={styles.winner} style={{ color: isDarkTheme ? THEME_COLORS.DARK.TOOLTIP_TEXT : THEME_COLORS.LIGHT.TOOLTIP_TEXT }} />
              )}
            </div>
            <span className={styles.value}>{Number(entry.value).toFixed(2)}%</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export const LineChart = forwardRef<any, LineChartProps>(({
  data,
  variations,
  selectedVariations,
  lineStyle,
  isDarkTheme,
  brushStartIndex,
  brushEndIndex,
  onBrushChange,
}, ref) => {



  const commonProps = {
    data,
    margin: CHART_CONFIG.MARGIN,
  };

  const renderChartContent = () => (
    <>
      <CartesianGrid
        horizontal={true}
        vertical={true}
        stroke={isDarkTheme ? GRID_CONFIG.DARK_THEME.HORIZONTAL : GRID_CONFIG.LIGHT_THEME.HORIZONTAL}
      />
      <XAxis
        dataKey="date"
        stroke={isDarkTheme ? GRID_CONFIG.DARK_THEME.AXIS : GRID_CONFIG.LIGHT_THEME.AXIS}
        tick={{ fontSize: UI_CONFIG.FONT_SIZE.AXIS }}
        tickLine={false}
        axisLine={false}
        dy={10}
        tickFormatter={(value) => {
          const date = new Date(value);
          const month = date.toLocaleString('en-US', { month: 'short' });
          const day = date.getDate();
          return `${month}, ${day}`;
        }}
        minTickGap={CHART_CONFIG.MIN_TICK_GAP}
      />
      <YAxis
        unit="%"
        stroke={isDarkTheme ? GRID_CONFIG.DARK_THEME.AXIS : GRID_CONFIG.LIGHT_THEME.AXIS}
        tick={{ fontSize: UI_CONFIG.FONT_SIZE.AXIS }}
        tickLine={false}
        axisLine={false}
        dx={-10}
      />
      <Tooltip content={<CustomTooltip isDarkTheme={isDarkTheme} />} cursor={{ stroke: '#ccc', strokeDasharray: '4 4' }} />
      <Legend iconType="circle" wrapperStyle={{ paddingTop: UI_CONFIG.LEGEND_PADDING_TOP }} />
      <Brush
        dataKey="date"
        height={CHART_CONFIG.BRUSH_HEIGHT}
        stroke={THEME_COLORS.LIGHT.BRUSH_STROKE}
        fill={isDarkTheme ? THEME_COLORS.DARK.BRUSH_FILL : THEME_COLORS.LIGHT.BRUSH_FILL}
        tickFormatter={() => ''}
        startIndex={brushStartIndex}
        endIndex={brushEndIndex}
        onChange={(brushData: any) => {
          if (onBrushChange && brushData) {
            onBrushChange(brushData.startIndex, brushData.endIndex);
          }
        }}
      />
      {variations.map((v, index) => {
        const id = v.id !== undefined ? v.id.toString() : '0';
        if (!selectedVariations.includes(id)) return null;

        const color = COLORS_MAP[id] || DEFAULT_COLORS[index % DEFAULT_COLORS.length];

        if (lineStyle === 'area') {
          return (
            <Area
              key={id}
              type="monotone"
              dataKey={id}
              name={v.name}
              stroke={color}
              fill={color}
              fillOpacity={UI_CONFIG.FILL_OPACITY}
              activeDot={{ r: CHART_CONFIG.ACTIVE_DOT_RADIUS, strokeWidth: 0 }}
              strokeWidth={CHART_CONFIG.STROKE_WIDTH}
              isAnimationActive={false}
            />
          );
        }

        return (
          <Line
            key={id}
            type={lineStyle === 'step' ? 'step' : lineStyle === 'linear' ? 'linear' : 'monotone'}
            dataKey={id}
            name={v.name}
            stroke={color}
            activeDot={{ r: CHART_CONFIG.ACTIVE_DOT_RADIUS, strokeWidth: 0 }}
            strokeWidth={CHART_CONFIG.STROKE_WIDTH}
            dot={false}
            isAnimationActive={false}
          />
        );
      })}
    </>
  );

  return (
    <div className={styles.chartWrapper} style={{ background: isDarkTheme ? THEME_COLORS.DARK.BACKGROUND : THEME_COLORS.LIGHT.BACKGROUND }}>
      <ResponsiveContainer width="100%" height="100%">
        {lineStyle === 'area' ? (
          <AreaChart ref={ref} {...commonProps}>
            {renderChartContent()}
          </AreaChart>
        ) : (
          <RechartsLineChart ref={ref} {...commonProps}>
            {renderChartContent()}
          </RechartsLineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
});
