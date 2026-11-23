import type { HomeData, HotSearch, ListenStats, Playlist, RankList, Song } from '../model/Models';
import { NetConfig } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
import { HttpUtil } from "@normalized:N&&&entry/src/main/ets/network/HttpUtil&";
import { MockApi } from "@normalized:N&&&entry/src/main/ets/network/MockApi&";
/** 远端搜索接口返回的单条结构（GD Studio 公开音乐接口） */
interface RemoteSong {
    name?: string;
    artist?: string[];
    album?: string;
}
/**
 * API 服务层：页面唯一的数据入口。
 * 搜索功能优先请求真实远端接口（@kit.NetworkKit），
 * 远端不可用时自动降级为本地 Mock 数据，保证演示与容错链路完整；
 * 其余接口经由 MockApi（模拟网络延迟 + 可注入异常）返回数据。
 */
export class ApiService {
    /** 首页数据 */
    static getHomeData(): Promise<HomeData> {
        return MockApi.getHomeData();
    }
    /** 歌单歌曲列表 */
    static getPlaylistSongs(playlist: Playlist): Promise<Song[]> {
        return MockApi.getPlaylistSongs(playlist);
    }
    /** 排行榜歌曲列表 */
    static getRankSongs(rank: RankList): Promise<Song[]> {
        return MockApi.getRankSongs(rank);
    }
    /** 排行榜元数据 */
    static getRanks(): Promise<RankList[]> {
        return MockApi.getRanks();
    }
    /** 热搜榜 */
    static getHotSearch(): Promise<HotSearch[]> {
        return MockApi.getHotSearch();
    }
    /** 听歌统计（叠加本地记录的今日时长） */
    static getListenStats(extraTodayMinutes: number): Promise<ListenStats> {
        return MockApi.getListenStats(extraTodayMinutes);
    }
    /** Banner -> 歌单 */
    static findPlaylist(id: number): Playlist | undefined {
        return MockApi.findPlaylist(id);
    }
    /**
     * 搜索：真实远端接口优先，失败自动降级本地 Mock。
     * 远端返回结构映射为本地 Song 模型（封面/音频流使用演示资源池）。
     */
    static async searchSongs(keyword: string): Promise<Song[]> {
        const kw: string = keyword.trim();
        if (kw.length === 0) {
            return [];
        }
        try {
            const url: string = `${NetConfig.REMOTE_SEARCH}&name=${encodeURIComponent(kw)}&count=20`;
            const raw: string = await HttpUtil.get(url);
            const remoteList: RemoteSong[] = JSON.parse(raw) as RemoteSong[];
            if (!Array.isArray(remoteList) || remoteList.length === 0) {
                return MockApi.searchSongs(kw);
            }
            return remoteList.slice(0, 20).map((r: RemoteSong, i: number) => {
                const song: Song = {
                    id: 900000 + i,
                    name: r.name ?? '未知歌曲',
                    artist: (r.artist ?? []).join(' / ') || '未知歌手',
                    album: r.album ?? '未知专辑',
                    cover: `https://picsum.photos/seed/remote${i}${encodeURIComponent(kw)}/300/300`,
                    playUrl: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(i % 9) + 1}.mp3`,
                    duration: 200000 + i * 7000,
                    genre: '流行',
                    playCount: 100000 + i * 5000,
                    lyric: ['远端搜索结果', '音频为演示流', '感谢使用云乐']
                };
                return song;
            });
        }
        catch (e) {
            // 远端异常：降级本地 Mock，保证功能可用
            console.warn(`ApiService.searchSongs remote failed, fallback to mock: ${String(e)}`);
            return MockApi.searchSongs(kw);
        }
    }
}
