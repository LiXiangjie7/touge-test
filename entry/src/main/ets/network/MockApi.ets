import { ArtistStat, DayStat, GenreStat, HomeData, HotSearch, ListenStats, Playlist, RankList, Song } from '../model/Models';
import { MOCK_BANNERS, MOCK_HOT_SEARCH, MOCK_PLAYLISTS, MOCK_RANKS, MOCK_SONGS } from './MockData';

/**
 * Mock 接口引擎（考核允许使用 Mock 接口）。
 * 以异步 Promise + 模拟网络延迟的方式提供数据，与真实接口调用方式完全一致；
 * 通过 simulateError 开关可注入网络异常，用于演示页面的错误态与重试逻辑。
 */
export class MockApi {
  /** 模拟网络异常开关（在"我的"页面可切换，并持久化到首选项） */
  static simulateError: boolean = false;

  private static delay(ms: number): Promise<void> {
    return new Promise<void>((resolve: () => void) => {
      setTimeout(resolve, ms);
    });
  }

  /** 统一的"网络管道"：延迟返回数据；开启异常模拟时抛出错误 */
  private static async pipe<T>(data: T, latency: number = 500): Promise<T> {
    await MockApi.delay(latency);
    if (MockApi.simulateError) {
      throw new Error('MOCK_NETWORK_ERROR: 网络异常，请稍后重试');
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
    return MockApi.pipe(data, 600);
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
    return MockApi.pipe(MockApi.expandSongs(playlist.songIds), 400);
  }

  /** 排行榜歌曲列表 */
  static getRankSongs(rank: RankList): Promise<Song[]> {
    return MockApi.pipe(MockApi.expandSongs(rank.songIds), 400);
  }

  /** 本地搜索（远端接口不可用时的降级方案）：按歌名/歌手/专辑模糊匹配 */
  static searchSongs(keyword: string): Promise<Song[]> {
    const kw: string = keyword.trim().toLowerCase();
    if (kw.length === 0) {
      return MockApi.pipe([], 300);
    }
    const result: Song[] = MOCK_SONGS.filter((s: Song) =>
      s.name.toLowerCase().includes(kw) ||
      s.artist.toLowerCase().includes(kw) ||
      s.album.toLowerCase().includes(kw) ||
      s.genre.toLowerCase().includes(kw));
    return MockApi.pipe(result, 450);
  }

  /** 热搜榜 */
  static getHotSearch(): Promise<HotSearch[]> {
    return MockApi.pipe(MOCK_HOT_SEARCH, 300);
  }

  /** 全部排行榜元数据 */
  static getRanks(): Promise<RankList[]> {
    return MockApi.pipe(MOCK_RANKS, 350);
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
    return MockApi.pipe(stats, 500);
  }
}
