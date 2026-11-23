import { ArtistStat, DayStat, GenreStat, HomeData, HotSearch, ListenStats, Playlist, RankList, Song } from '../model/Models';
import { MOCK_BANNERS, MOCK_HOT_SEARCH, MOCK_PLAYLISTS, MOCK_RANKS, MOCK_SONGS } from './MockData';

/** 网络状态模拟档位：正常 / 慢速网络 / 网络异常 / 空数据 */
export type SimulateMode = 'normal' | 'slow' | 'error' | 'empty';

/**
 * Mock 接口引擎（考核允许使用 Mock 接口）。
 * 以异步 Promise + 模拟网络延迟的方式提供数据，与真实接口调用方式完全一致；
 * 支持四档网络状态模拟，用于演示页面的加载提示、失败重试与空数据容错：
 *  - normal：正常返回数据（默认延迟，展示加载态）；
 *  - slow：延迟 2.5s 返回，清晰展示"加载中"状态；
 *  - error：抛出网络异常，页面进入错误态（可重试）；
 *  - empty：返回空数据，页面进入空数据态。
 */
export class MockApi {
  /** 当前模拟档位（在"我的"页面切换，并持久化到首选项） */
  static simulateMode: SimulateMode = 'normal';

  private static delay(ms: number): Promise<void> {
    return new Promise<void>((resolve: () => void) => {
      setTimeout(resolve, ms);
    });
  }

  /** 统一的"网络管道"：按当前模拟档位返回数据 / 抛错 / 返回空数据 */
  private static async pipe<T>(data: T, emptyValue: T, latency: number = 500): Promise<T> {
    const wait: number = MockApi.simulateMode === 'slow' ? 2500 : latency;
    await MockApi.delay(wait);
    if (MockApi.simulateMode === 'error') {
      throw new Error('MOCK_NETWORK_ERROR: 网络异常，请稍后重试');
    }
    if (MockApi.simulateMode === 'empty') {
      return emptyValue;
    }
    return data;
  }

  /** 首页聚合数据 */
  static getHomeData(): Promise<HomeData> {
    const hot: Song[] = [...MOCK_SONGS].sort((a: Song, b: Song) => b.playCount - a.playCount).slice(0, 10);
    const data: HomeData = {
      banners: MOCK_BANNERS,
      recommendPlaylists: MOCK_PLAYLISTS,
      hotSongs: hot
    };
    const empty: HomeData = { banners: [], recommendPlaylists: [], hotSongs: [] };
    return MockApi.pipe(data, empty, 600);
  }

  /** 按 id 列表展开为完整歌曲列表（保持传入顺序） */
  private static expandSongs(ids: number[]): Song[] {
    const songs: Song[] = [];
    ids.forEach((id: number) => {
      const found: Song | undefined = MOCK_SONGS.find((s: Song) => s.id === id);
      if (found !== undefined) {
        songs.push(found);
      }
    });
    return songs;
  }

  /** 歌单详情：按歌单 songIds 展开为完整歌曲列表 */
  static getPlaylistSongs(playlist: Playlist): Promise<Song[]> {
    return MockApi.pipe(MockApi.expandSongs(playlist.songIds), [], 400);
  }

  /** 排行榜歌曲列表 */
  static getRankSongs(rank: RankList): Promise<Song[]> {
    return MockApi.pipe(MockApi.expandSongs(rank.songIds), [], 400);
  }

  /** 本地搜索（远端接口不可用时的降级方案）：按歌名/歌手/专辑模糊匹配 */
  static searchSongs(keyword: string): Promise<Song[]> {
    const kw: string = keyword.trim().toLowerCase();
    if (kw.length === 0) {
      return MockApi.pipe([], [], 300);
    }
    const result: Song[] = MOCK_SONGS.filter((s: Song) =>
      s.name.toLowerCase().includes(kw) ||
      s.artist.toLowerCase().includes(kw) ||
      s.album.toLowerCase().includes(kw) ||
      s.genre.toLowerCase().includes(kw));
    return MockApi.pipe(result, [], 450);
  }

  /** 热搜榜 */
  static getHotSearch(): Promise<HotSearch[]> {
    return MockApi.pipe(MOCK_HOT_SEARCH, [], 300);
  }

  /** 全部排行榜元数据 */
  static getRanks(): Promise<RankList[]> {
    return MockApi.pipe(MOCK_RANKS, [], 350);
  }

  /** 根据歌单 id 查歌单（Banner 跳转用） */
  static findPlaylist(id: number): Playlist | undefined {
    return MOCK_PLAYLISTS.find((p: Playlist) => p.id === id);
  }

  /**
   * 听歌统计数据（数据可视化加分项的数据源）。
   * extraTodayMinutes：本地真实记录的今日听歌时长，会叠加进"今天"的柱子，
   * 体现图表随数据动态更新。
   */
  static getListenStats(extraTodayMinutes: number): Promise<ListenStats> {
    const weekly: DayStat[] = [
      { label: '周一', minutes: 45 },
      { label: '周二', minutes: 32 },
      { label: '周三', minutes: 78 },
      { label: '周四', minutes: 20 },
      { label: '周五', minutes: 95 },
      { label: '周六', minutes: 120 },
      { label: '今天', minutes: 66 + Math.round(extraTodayMinutes) }
    ];

    // 曲风占比：由曲库真实分布统计得出
    const genreMap: Map<string, number> = new Map<string, number>();
    MOCK_SONGS.forEach((s: Song) => {
      genreMap.set(s.genre, (genreMap.get(s.genre) ?? 0) + 1);
    });
    const genreShare: GenreStat[] = [];
    genreMap.forEach((count: number, genre: string) => {
      genreShare.push({ genre, count });
    });
    genreShare.sort((a: GenreStat, b: GenreStat) => b.count - a.count);

    // 歌手收听 Top：由曲库歌手出现频次统计得出
    const artistMap: Map<string, number> = new Map<string, number>();
    MOCK_SONGS.forEach((s: Song) => {
      artistMap.set(s.artist, (artistMap.get(s.artist) ?? 0) + 1);
    });
    const topArtists: ArtistStat[] = [];
    artistMap.forEach((count: number, artist: string) => {
      topArtists.push({ artist, count });
    });
    topArtists.sort((a: ArtistStat, b: ArtistStat) => b.count - a.count);

    const totalMinutes: number = weekly.reduce((sum: number, d: DayStat) => sum + d.minutes, 0);
    const stats: ListenStats = {
      weeklyMinutes: weekly,
      genreShare: genreShare,
      topArtists: topArtists.slice(0, 5),
      totalMinutes: totalMinutes,
      totalSongs: MOCK_SONGS.length
    };
    const empty: ListenStats = {
      weeklyMinutes: [], genreShare: [], topArtists: [], totalMinutes: 0, totalSongs: 0
    };
    return MockApi.pipe(stats, empty, 500);
  }
}
