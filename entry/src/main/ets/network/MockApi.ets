import { ArtistStat, DayStat, FriendItem, GenreStat, HomeData, HotSearch, ListenStats, Playlist, PlayStatItem, RankList, Song } from '../model/Models';
import { MOCK_BANNERS, MOCK_FRIENDS, MOCK_HOT_SEARCH, MOCK_PLAYLISTS, MOCK_RANKS, MOCK_SONGS } from './MockData';

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
   * 入参为本地真实听歌记录（近 7 日时长 + 每首歌播放次数），
   * 模拟"上传听歌记录 -> 服务端聚合 -> 返回统计结果"的完整链路；
   * 曲风占比与歌手 Top 均按用户实际听过的歌曲聚合。
   */
  static getListenStats(weekly: DayStat[], plays: PlayStatItem[]): Promise<ListenStats> {
    // 曲风占比：按"我听过的歌"的曲风分布聚合（权重 = 播放次数）
    const genreMap: Map<string, number> = new Map<string, number>();
    plays.forEach((p: PlayStatItem) => {
      genreMap.set(p.song.genre, (genreMap.get(p.song.genre) ?? 0) + p.count);
    });
    const genreShare: GenreStat[] = [];
    genreMap.forEach((count: number, genre: string) => {
      genreShare.push({ genre, count });
    });
    genreShare.sort((a: GenreStat, b: GenreStat) => b.count - a.count);

    // 常听歌手 Top：按"我听过的歌"的歌手播放次数聚合
    const artistMap: Map<string, number> = new Map<string, number>();
    plays.forEach((p: PlayStatItem) => {
      artistMap.set(p.song.artist, (artistMap.get(p.song.artist) ?? 0) + p.count);
    });
    const topArtists: ArtistStat[] = [];
    artistMap.forEach((count: number, artist: string) => {
      topArtists.push({ artist, count });
    });
    topArtists.sort((a: ArtistStat, b: ArtistStat) => b.count - a.count);

    const totalMinutes: number = weekly.reduce((sum: number, d: DayStat) => sum + d.minutes, 0);
    const totalPlays: number = plays.reduce((sum: number, p: PlayStatItem) => sum + p.count, 0);
    const stats: ListenStats = {
      weeklyMinutes: weekly,
      genreShare: genreShare,
      topArtists: topArtists.slice(0, 5),
      topSongs: plays.slice(0, 50),
      totalMinutes: totalMinutes,
      totalSongs: plays.length,
      totalPlays: totalPlays
    };
    const empty: ListenStats = {
      weeklyMinutes: [], genreShare: [], topArtists: [], topSongs: [],
      totalMinutes: 0, totalSongs: 0, totalPlays: 0
    };
    return MockApi.pipe(stats, empty, 500);
  }

  /** 推荐用户列表（个人中心 -> 关注 / 好友列表） */
  static getFriends(): Promise<FriendItem[]> {
    return MockApi.pipe(MOCK_FRIENDS, [], 400);
  }
}
