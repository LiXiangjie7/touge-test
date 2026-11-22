/**
 * 数据模型层：接口用于网络/Mock 数据解析与传递。
 * ArkTS 严格类型要求，所有跨层数据均显式建模。
 */

/** 歌曲 */
export interface Song {
  id: number;
  name: string;
  artist: string;
  album: string;
  cover: string;      // 封面图 URL
  playUrl: string;    // 音频流 URL
  duration: number;   // 时长，单位毫秒
  genre: string;      // 曲风（用于统计饼图）
  playCount: number;  // 播放量（热度）
  lyric: string[];    // 简化歌词行
}

/** 歌单 */
export interface Playlist {
  id: number;
  name: string;
  cover: string;
  description: string;
  playCount: number;
  creator: string;
  tags: string[];
  songIds: number[];
}

/** 首页 Banner */
export interface BannerItem {
  id: number;
  image: string;
  title: string;
  playlistId: number; // 点击跳转的歌单
}

/** 排行榜 */
export interface RankList {
  id: number;
  name: string;
  cover: string;
  updateTip: string;
  songIds: number[];
}

/** 首页聚合数据 */
export interface HomeData {
  banners: BannerItem[];
  recommendPlaylists: Playlist[];
  hotSongs: Song[];
}

/** 热搜词条 */
export interface HotSearch {
  keyword: string;
  score: number;
}

/** 统计：每日听歌时长 */
export interface DayStat {
  label: string;   // 周一…周日
  minutes: number;
}

/** 统计：曲风占比 */
export interface GenreStat {
  genre: string;
  count: number;
}

/** 统计：歌手收听量 */
export interface ArtistStat {
  artist: string;
  count: number;
}

/** 统计页聚合数据（数据可视化加分项的数据源） */
export interface ListenStats {
  weeklyMinutes: DayStat[];
  genreShare: GenreStat[];
  topArtists: ArtistStat[];
  totalMinutes: number;
  totalSongs: number;
}
