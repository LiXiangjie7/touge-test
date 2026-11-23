import { AppStorageV2 } from '@kit.ArkUI';
import { PlayStatItem, Song } from '../model/Models';
import { PreferencesUtil } from '../utils/PreferencesUtil';
import { StoreKeys } from '../common/Constants';
import { dateKey } from '../utils/Format';

/**
 * 全局数据仓库（状态管理 V2：@ObservedV2 + @Trace + AppStorageV2）。
 * 管理：我喜欢的音乐、最近播放、个人听歌统计（按天时长 + 每首歌播放次数），
 * 全部通过 Preferences 持久化，重启应用后数据不丢失。
 * 统计页的折线图 / 曲风占比 / 歌手 Top / 听歌排行全部基于这里的真实听歌记录。
 */
@ObservedV2
export class MusicStore {
  /** 我喜欢的音乐（歌曲对象列表，保证离线可渲染） */
  @Trace favorites: Song[] = [];
  /** 最近播放（最新在前，最多 50 条） */
  @Trace history: Song[] = [];
  /** 按天听歌时长：{ 'yyyy-MM-dd': 分钟数 } */
  @Trace dailyMinutes: Record<string, number> = {};
  /** 每首歌的播放次数统计（按次数降序） */
  @Trace playStats: PlayStatItem[] = [];
  /** 是否已从持久层恢复（防止 Previewer 中 EntryAbility 未执行导致数据为空） */
  private inited: boolean = false;

  /** 从首选项恢复数据（EntryAbility.onCreate 调用） */
  init(): void {
    const favRaw: string = PreferencesUtil.getString(StoreKeys.FAVORITES, '[]');
    const hisRaw: string = PreferencesUtil.getString(StoreKeys.HISTORY, '[]');
    const dailyRaw: string = PreferencesUtil.getString(StoreKeys.DAILY_MINUTES, '{}');
    const statsRaw: string = PreferencesUtil.getString(StoreKeys.PLAY_STATS, '[]');
    try {
      this.favorites = JSON.parse(favRaw) as Song[];
      this.history = JSON.parse(hisRaw) as Song[];
      this.dailyMinutes = JSON.parse(dailyRaw) as Record<string, number>;
      this.playStats = JSON.parse(statsRaw) as PlayStatItem[];
    } catch (e) {
      this.favorites = [];
      this.history = [];
      this.dailyMinutes = {};
      this.playStats = [];
    }
    this.inited = true;
  }

  /** 确保已初始化（各方法/页面首次访问时兜底调用，幂等） */
  ensureInit(): void {
    if (!this.inited) {
      this.init();
    }
  }

  isFavorite(songId: number): boolean {
    return this.favorites.some((s: Song) => s.id === songId);
  }

  /** 收藏 / 取消收藏 */
  toggleFavorite(song: Song): void {
    if (this.isFavorite(song.id)) {
      this.favorites = this.favorites.filter((s: Song) => s.id !== song.id);
    } else {
      this.favorites = [song, ...this.favorites];
    }
    PreferencesUtil.putString(StoreKeys.FAVORITES, JSON.stringify(this.favorites));
  }

  /** 记录最近播放（去重置顶） */
  addHistory(song: Song): void {
    const rest: Song[] = this.history.filter((s: Song) => s.id !== song.id);
    this.history = [song, ...rest].slice(0, 50);
    PreferencesUtil.putString(StoreKeys.HISTORY, JSON.stringify(this.history));
  }

  clearHistory(): void {
    this.history = [];
    PreferencesUtil.putString(StoreKeys.HISTORY, '[]');
  }

  /** 今日听歌分钟数（由按天统计得出） */
  todayMinutes(): number {
    return this.dailyMinutes[dateKey(new Date())] ?? 0;
  }

  /** 累计播放次数 */
  totalPlays(): number {
    return this.playStats.reduce((sum: number, p: PlayStatItem) => sum + p.count, 0);
  }

  /**
   * 记录一次播放：
   *  1. 按歌曲时长折算分钟数，叠加到"今天"的按天统计（驱动近 7 日折线图）；
   *  2. 该歌曲的累计播放次数 +1（驱动听歌排行与曲风/歌手占比）。
   */
  recordPlay(song: Song): void {
    this.ensureInit();
    // 按天时长（整体替换以触发 @Trace 刷新）
    const key: string = dateKey(new Date());
    const nextDaily: Record<string, number> = {};
    Object.keys(this.dailyMinutes).forEach((k: string) => {
      nextDaily[k] = this.dailyMinutes[k];
    });
    nextDaily[key] = (nextDaily[key] ?? 0) + song.duration / 60000;
    // 只保留最近 30 天的记录，避免无限增长
    const keys: string[] = Object.keys(nextDaily).sort();
    const trimmed: Record<string, number> = {};
    keys.slice(-30).forEach((k: string) => {
      trimmed[k] = nextDaily[k];
    });
    this.dailyMinutes = trimmed;
    PreferencesUtil.putString(StoreKeys.DAILY_MINUTES, JSON.stringify(this.dailyMinutes));

    // 单曲播放次数
    const existed: PlayStatItem | undefined =
      this.playStats.find((p: PlayStatItem) => p.song.id === song.id);
    let nextStats: PlayStatItem[];
    if (existed !== undefined) {
      nextStats = this.playStats.map((p: PlayStatItem): PlayStatItem => {
        if (p.song.id === song.id) {
          const updated: PlayStatItem = { song: p.song, count: p.count + 1, lastPlay: Date.now() };
          return updated;
        }
        return p;
      });
    } else {
      const created: PlayStatItem = { song: song, count: 1, lastPlay: Date.now() };
      nextStats = [...this.playStats, created];
    }
    nextStats.sort((a: PlayStatItem, b: PlayStatItem) => b.count - a.count);
    this.playStats = nextStats;
    PreferencesUtil.putString(StoreKeys.PLAY_STATS, JSON.stringify(this.playStats));
  }
}

let storeInstance: MusicStore | null = null;

/** 获取全局 MusicStore（懒加载注册进 AppStorageV2） */
export function musicStore(): MusicStore {
  if (storeInstance === null) {
    const connected: MusicStore | undefined =
      AppStorageV2.connect(MusicStore, 'musicStore', () => new MusicStore());
    storeInstance = connected ?? new MusicStore();
  }
  return storeInstance;
}
