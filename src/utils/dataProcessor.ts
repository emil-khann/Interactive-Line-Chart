import rawData from '../data.json';

interface RawDailyData {
  date: string;
  visits: Record<string, number>;
  conversions: Record<string, number>;
}

interface RawData {
  variations: Variation[];
  data: RawDailyData[];
}

const typedRawData = rawData as RawData;

export interface Variation {
  id?: number;
  name: string;
}

export interface DailyData {
  date: string;
  visits: Record<string, number>;
  conversions: Record<string, number>;
}

export interface ProcessedDataPoint {
  date: string;
  [key: string]: number | string;
}

export type TimeGrain = 'day' | 'week';

export const getVariations = (): Variation[] => {
  return typedRawData.variations;
};

export const processData = (grain: TimeGrain = 'day'): ProcessedDataPoint[] => {
  const data = typedRawData.data;

  if (grain === 'day') {
    return data.map((day) => {
      const point: ProcessedDataPoint = { date: day.date };

      const variationIds = new Set([
        ...Object.keys(day.visits),
        ...Object.keys(day.conversions)
      ]);

      variationIds.forEach(id => {
        const visits = day.visits[id] || 0;
        const conversions = day.conversions[id] || 0;
        const rate = visits > 0 ? (conversions / visits) * 100 : 0;
        point[id] = parseFloat(rate.toFixed(2));
      });

      return point;
    });
  } else {

    // Calculate ISO Week number
    const getWeekKey = (dateStr: string) => {
      const date = new Date(dateStr);
      const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      const dayNum = d.getUTCDay() || 7;
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      const year = d.getUTCFullYear();
      const weekNo = Math.ceil((((d.getTime() - new Date(Date.UTC(year, 0, 1)).getTime()) / 86400000) + 1) / 7);
      return `${year}-W${weekNo}`;
    };

    const weeklyMap = new Map<string, { visits: Record<string, number>, conversions: Record<string, number>, startDate: string }>();

    data.forEach(day => {
      const weekKey = getWeekKey(day.date);
      if (!weeklyMap.has(weekKey)) {
        weeklyMap.set(weekKey, { visits: {}, conversions: {}, startDate: day.date });
      }
      const week = weeklyMap.get(weekKey)!;

      Object.entries(day.visits).forEach(([id, val]) => {
        week.visits[id] = (week.visits[id] || 0) + val;
      });
      Object.entries(day.conversions).forEach(([id, val]) => {
        week.conversions[id] = (week.conversions[id] || 0) + val;
      });
    });

    return Array.from(weeklyMap.values()).map(week => {
      const point: ProcessedDataPoint = { date: week.startDate };
      const variationIds = new Set([
        ...Object.keys(week.visits),
        ...Object.keys(week.conversions)
      ]);

      variationIds.forEach(id => {
        const visits = week.visits[id] || 0;
        const conversions = week.conversions[id] || 0;
        const rate = visits > 0 ? (conversions / visits) * 100 : 0;
        point[id] = parseFloat(rate.toFixed(2));
      });
      return point;
    });
  }
};
