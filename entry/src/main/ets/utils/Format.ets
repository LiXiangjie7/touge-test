/**
 * 通用格式化工具函数。
 */

/** 毫秒时长 -> mm:ss */
export function msToTime(ms: number): string {
  const totalSec: number = Math.max(0, Math.floor(ms / 1000));
  const m: number = Math.floor(totalSec / 60);
  const s: number = totalSec % 60;
  const mm: string = m < 10 ? `0${m}` : `${m}`;
  const ss: string = s < 10 ? `0${s}` : `${s}`;
  return `${mm}:${ss}`;
}

/** 播放量格式化：123456 -> 12万 / 1.2亿 */
export function formatCount(n: number): string {
  if (n >= 100000000) {
    return `${(n / 100000000).toFixed(1)}亿`;
  }
  if (n >= 10000) {
    return `${Math.round(n / 10000)}万`;
  }
  return `${n}`;
}

/** 日期 -> 'yyyy-MM-dd' 键（按天统计听歌时长用） */
export function dateKey(d: Date): string {
  const m: number = d.getMonth() + 1;
  const day: number = d.getDate();
  return `${d.getFullYear()}-${m < 10 ? `0${m}` : `${m}`}-${day < 10 ? `0${day}` : `${day}`}`;
}

/** 近 7 天的日期键与横轴标签（今天显示"今天"，其余显示"周X"），按时间升序 */
export function recentDayRefs(): DayRef[] {
  const weekNames: string[] = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const refs: DayRef[] = [];
  const now: Date = new Date();
  for (let i: number = 6; i >= 0; i--) {
    const d: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    refs.push({
      key: dateKey(d),
      label: i === 0 ? '今天' : weekNames[d.getDay()]
    });
  }
  return refs;
}

/** 近 7 天日期的键与标签 */
export interface DayRef {
  key: string;
  label: string;
}
