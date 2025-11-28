import React, { useState, useMemo, useRef, useEffect } from 'react';
import { LineChart } from '../LineChart/LineChart';
import { Controls, LineStyle } from '../Controls/Controls';
import { getVariations, processData, TimeGrain } from '../../utils/dataProcessor';
import styles from './ChartContainer.module.css';
import { ZOOM_CONFIG, THEME_COLORS } from '../../constants/chart';

export const ChartContainer: React.FC = () => {
  const [timeGrain, setTimeGrain] = useState<TimeGrain>('day');
  const variations = useMemo(() => getVariations(), []);
  const [selectedVariations, setSelectedVariations] = useState<string[]>(
    variations.map(v => v.id !== undefined ? v.id.toString() : '0')
  );
  const [lineStyle, setLineStyle] = useState<LineStyle>('monotone');
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [brushStartIndex, setBrushStartIndex] = useState<number | undefined>(undefined);
  const [brushEndIndex, setBrushEndIndex] = useState<number | undefined>(undefined);

  const chartRef = useRef<any>(null);

  const handleExport = () => {
    const svg = document.querySelector('.recharts-surface');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        if (ctx) {
          ctx.fillStyle = isDarkTheme ? THEME_COLORS.DARK.BRUSH_FILL : THEME_COLORS.LIGHT.BACKGROUND;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          const pngFile = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.download = 'chart.png';
          downloadLink.href = pngFile;
          downloadLink.click();
        }
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    }
  };

  const data = useMemo(() => processData(timeGrain), [timeGrain]);

  const handleZoom = (direction: 'in' | 'out') => {
    const dataLength = data.length;
    const currentStart = brushStartIndex ?? 0;
    const currentEnd = brushEndIndex ?? dataLength - 1;
    const currentRange = currentEnd - currentStart;

    let newRange = currentRange;

    if (direction === 'in' && currentRange > ZOOM_CONFIG.MIN_RANGE) {
      newRange = Math.max(ZOOM_CONFIG.MIN_RANGE, Math.floor(currentRange * ZOOM_CONFIG.ZOOM_IN_FACTOR));
    } else if (direction === 'out' && currentRange < dataLength - 1) {
      newRange = Math.min(dataLength - 1, Math.floor(currentRange * ZOOM_CONFIG.ZOOM_OUT_FACTOR));
    } else {
      return;
    }

    const center = Math.floor((currentStart + currentEnd) / 2);
    const newStart = Math.max(0, center - Math.floor(newRange / 2));
    const newEnd = Math.min(dataLength - 1, newStart + newRange);

    setBrushStartIndex(newStart);
    setBrushEndIndex(newEnd);
  };

  const handleZoomIn = () => handleZoom('in');
  const handleZoomOut = () => handleZoom('out');

  const handleResetZoom = () => {
    setBrushStartIndex(0);
    setBrushEndIndex(data.length - 1);
  };

  const handleToggleVariation = (id: string) => {
    setSelectedVariations(prev => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev;
        return prev.filter(v => v !== id);
      }
      return [...prev, id];
    });
  };

  useEffect(() => {
    document.body.style.backgroundColor = isDarkTheme ? THEME_COLORS.DARK.BACKGROUND : THEME_COLORS.LIGHT.BACKGROUND;
    document.body.style.color = isDarkTheme ? THEME_COLORS.DARK.TEXT : THEME_COLORS.LIGHT.TEXT;
  }, [isDarkTheme]);

  return (
    <div className={styles.container} style={{ color: isDarkTheme ? THEME_COLORS.DARK.CONTAINER_TEXT : THEME_COLORS.LIGHT.CONTAINER_TEXT }}>
      <header className={styles.header}>
        <h1 className={styles.title} style={{ color: isDarkTheme ? THEME_COLORS.DARK.CONTAINER_TEXT : THEME_COLORS.LIGHT.CONTAINER_TEXT }}>
          Conversion Rate by Variation
        </h1>
      </header>

      <Controls
        variations={variations}
        selectedVariations={selectedVariations}
        onToggleVariation={handleToggleVariation}
        timeGrain={timeGrain}
        onTimeGrainChange={setTimeGrain}
        lineStyle={lineStyle}
        onLineStyleChange={setLineStyle}
        isDarkTheme={isDarkTheme}
        onToggleTheme={() => setIsDarkTheme(!isDarkTheme)}
        onExport={handleExport}
        onResetZoom={handleResetZoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />

      <LineChart
        ref={chartRef}
        data={data}
        variations={variations}
        selectedVariations={selectedVariations}
        lineStyle={lineStyle}
        isDarkTheme={isDarkTheme}
        brushStartIndex={brushStartIndex}
        brushEndIndex={brushEndIndex}
        onBrushChange={(startIndex, endIndex) => {
          setBrushStartIndex(startIndex);
          setBrushEndIndex(endIndex);
        }}
      />
    </div>
  );
};
