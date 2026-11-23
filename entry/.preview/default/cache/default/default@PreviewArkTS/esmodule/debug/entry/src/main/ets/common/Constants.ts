/**
 * 全局常量定义：主题色、路由名、页面加载状态、存储键、网络配置。
 * 统一管理，避免魔法值散落各处。
 */
/** 应用主题色（网易云音乐风格） */
export class AppColors {
    static readonly PRIMARY: string = '#EC4141';
    static readonly PRIMARY_LIGHT: string = '#FDEEEE';
    static readonly BG: string = '#F7F8FA';
    static readonly CARD: string = '#FFFFFF';
    static readonly TEXT_MAIN: string = '#333333';
    static readonly TEXT_SUB: string = '#888888';
    static readonly TEXT_LIGHT: string = '#BBBBBB';
    static readonly DIVIDER: string = '#EFEFEF';
    static readonly PLAYER_BG_TOP: string = '#4A4A4E';
    static readonly PLAYER_BG_BOTTOM: string = '#1C1C1E';
    static readonly WHITE_60: string = '#99FFFFFF';
    static readonly WHITE_30: string = '#4DFFFFFF';
}
/** Navigation 路由名 */
export class AppRoutes {
    static readonly PLAYLIST_DETAIL: string = 'playlistDetail';
    static readonly PLAYER: string = 'player';
    static readonly SEARCH: string = 'search';
}
/** 页面数据加载状态机：加载中 / 成功 / 空数据 / 异常 */
export enum LoadState {
    LOADING = 0,
    SUCCESS = 1,
    EMPTY = 2,
    ERROR = 3
}
/** 首选项存储键 */
export class StoreKeys {
    static readonly FAVORITES: string = 'favorites';
    static readonly HISTORY: string = 'history';
    static readonly EXTRA_MINUTES: string = 'extra_minutes';
    static readonly SIMULATE_ERROR: string = 'simulate_error';
}
/** 网络配置 */
export class NetConfig {
    /** 真实远端音乐搜索接口（公开服务）；不可用时自动降级到本地 Mock 数据 */
    static readonly REMOTE_SEARCH: string = 'https://music-api.gdstudio.xyz/api.php?types=search&source=netease';
    static readonly TIMEOUT: number = 8000;
}
