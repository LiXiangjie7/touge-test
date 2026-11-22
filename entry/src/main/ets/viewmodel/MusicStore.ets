import { AppStorageV2 } from '@kit.ArkUI';
import { Song } from '../model/Models';
import { PreferencesUtil } from '../utils/PreferencesUtil';
import { StoreKeys } from '../common/Constants';

/**
 * 全局数据仓库（状态管理 V2：@ObservedV2 + @Trace + AppStorageV2）。
 * 管理：我喜欢的音乐、最近播放、今日额外听歌时长，
 * 全部通过 Preferences 持久化，重启应用后数据不丢失。
 */
@ObservedV2
export class MusicStore {
  /** 我喜欢的音乐（歌曲对象列表，保证离线可渲染） */
  @Trace favorites: Song[] = [];
  /** 最近播放（最新在前，最多 50 条） */
  @Trace history: Song[] = [];
  /** 今日额外听歌分钟数（叠加进统计图表，体现图表动态更新） */
  @Trace extraMinutesToday: number = 0;

  /** 从首选项恢复数据（EntryAbility.onCreate 调用） */
  init(): void {
    const favRaw: string = PreferencesUtil.getString(StoreKeys.FAVORITES, '[]');
    const hisRaw: string = PreferencesUtil.getString(StoreKeys.HISTORY, '[]');
    try {
      this.favorites = JSON.parse(favRaw) as Song[];
      this.history = JSON.parse(hisRaw) as Song[];
    } catch (e) {
      this.favorites = [];
      this.history = [];
    }
    this.extraMinutesToday = PreferencesUtil.getNumber(StoreKeys.EXTRA_MINUTES, 0);
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

  /** 记录一次播放：按歌曲时长折算分钟数叠加到今日统计 */
  recordPlay(song: Song): void {
    this.extraMinutesToday += song.duration / 60000;
    PreferencesUtil.putNumber(StoreKeys.EXTRA_MINUTES, this.extraMinutesToday);
  }
}

let storeInstance: MusicStore | null = null;

/** 获取全局 MusicStore（懒加载注册进 AppStorageV2） */
export function musicStore(): MusicStore {
  if (storeInstance === null) {
    storeInstance = AppStorageV2.connect(MusicStore, 'musicStore', () => new MusicStore())!;
  }
  return storeInstance;
}
