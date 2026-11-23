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

/** 个人播放记录条目：某首歌的累计播放次数 */
export interface PlayStatItem {
  song: Song;
  count: number;     // 累计播放次数
  lastPlay: number;  // 最近播放时间戳（毫秒）
}

/** 用户个人资料（个人中心可编辑，Preferences 持久化） */
export interface UserProfile {
  nickname: string;   // 姓名 / 昵称
  age: number;        // 年龄
  signature: string;  // 个人名片（签名）
  avatarSeed: string; // 头像图种子
}

/** 关注 / 好友条目 */
export interface FriendItem {
  id: number;
  name: string;
  avatar: string;
  signature: string;
  mutual: boolean;    // 是否互相关注（互为好友）
}

/** 统计页聚合数据（数据可视化加分项的数据源，基于个人真实听歌记录） */
export interface ListenStats {
  weeklyMinutes: DayStat[];
  genreShare: GenreStat[];
  topArtists: ArtistStat[];
  topSongs: PlayStatItem[];  // 听过的歌曲及播放次数（降序）
  totalMinutes: number;
  totalSongs: number;        // 听过的歌曲数
  totalPlays: number;        // 累计播放次数
}
