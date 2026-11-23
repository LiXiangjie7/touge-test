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
