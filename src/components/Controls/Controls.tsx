import React, { useState, useRef, useEffect } from 'react';
import styles from './Controls.module.css';
import { Variation, TimeGrain } from '../../utils/dataProcessor';
import { ChevronDown, Maximize2, Moon, Sun, Download, ZoomIn, ZoomOut } from 'lucide-react';
import { UI_CONFIG } from '../../constants/chart';

export type LineStyle = 'monotone' | 'linear' | 'step' | 'area';

interface ControlsProps {
  variations: Variation[];
  selectedVariations: string[];
  onToggleVariation: (id: string) => void;
  timeGrain: TimeGrain;
  onTimeGrainChange: (grain: TimeGrain) => void;
  lineStyle: LineStyle;
  onLineStyleChange: (style: LineStyle) => void;
  isDarkTheme: boolean;
  onToggleTheme: () => void;
  onExport: () => void;
  onResetZoom: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  variations,
  selectedVariations,
  onToggleVariation,
  timeGrain,
  onTimeGrainChange,
  lineStyle,
  onLineStyleChange,
  isDarkTheme,
  onToggleTheme,
  onExport,
  onResetZoom,
  onZoomIn,
  onZoomOut,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDropdownLabel = () => {
    if (selectedVariations.length === variations.length) return 'All variations selected';
    if (selectedVariations.length === 0) return 'No variations selected';
    return `${selectedVariations.length} variations selected`;
  };

  return (
    <div className={styles.controls}>
      <div className={styles.leftGroup}>

        <div className={styles.selectWrapper} ref={dropdownRef}>
          <button
            className={styles.dropdownButton}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span>{getDropdownLabel()}</span>
            <ChevronDown size={UI_CONFIG.ICON_SIZE.CHEVRON} style={{ color: '#999' }} />
          </button>

          {isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              {variations.map((v) => {
                const id = v.id !== undefined ? v.id.toString() : '0';
                return (
                  <div
                    key={id}
                    className={styles.dropdownItem}
                    onClick={() => onToggleVariation(id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedVariations.includes(id)}
                      readOnly
                      style={{ pointerEvents: 'none' }}
                    />
                    <span>{v.name}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className={styles.selectWrapper}>
          <select
            className={styles.select}
            value={timeGrain}
            onChange={(e) => onTimeGrainChange(e.target.value as TimeGrain)}
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
          </select>
          <ChevronDown size={UI_CONFIG.ICON_SIZE.CHEVRON} style={{ position: 'absolute', right: 10, top: 12, pointerEvents: 'none', color: '#999' }} />
        </div>
      </div>

      <div className={styles.rightGroup}>
        <div className={styles.selectWrapper}>
          <select
            className={styles.select}
            value={lineStyle}
            onChange={(e) => onLineStyleChange(e.target.value as LineStyle)}
          >
            <option value="monotone">Line style: Smooth</option>
            <option value="linear">Line style: Linear</option>
            <option value="step">Line style: Step</option>
            <option value="area">Line style: Area</option>
          </select>
          <ChevronDown size={UI_CONFIG.ICON_SIZE.CHEVRON} style={{ position: 'absolute', right: 10, top: 12, pointerEvents: 'none', color: '#999' }} />
        </div>

        <button className={styles.iconButton} onClick={onZoomIn} title="Zoom In">
          <ZoomIn size={UI_CONFIG.ICON_SIZE.CONTROL} />
        </button>

        <button className={styles.iconButton} onClick={onZoomOut} title="Zoom Out">
          <ZoomOut size={UI_CONFIG.ICON_SIZE.CONTROL} />
        </button>

        <button className={styles.iconButton} onClick={onResetZoom} title="Reset Zoom">
          <Maximize2 size={UI_CONFIG.ICON_SIZE.CONTROL} />
        </button>

        <button className={styles.iconButton} onClick={onToggleTheme} title="Toggle Theme">
          {isDarkTheme ? <Sun size={UI_CONFIG.ICON_SIZE.CONTROL} /> : <Moon size={UI_CONFIG.ICON_SIZE.CONTROL} />}
        </button>

        <button className={styles.iconButton} onClick={onExport} title="Export PNG">
          <Download size={UI_CONFIG.ICON_SIZE.CONTROL} />
        </button>
      </div>
    </div>
  );
};
