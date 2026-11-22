import { media } from '@kit.MediaKit';
import { Song } from '../model/Models';
import { musicStore } from './MusicStore';

/** 播放模式 */
export enum LoopMode {
  SEQUENCE = 0, // 顺序播放
  SHUFFLE = 1,  // 随机播放
  SINGLE = 2    // 单曲循环
}

/**
 * 全局播放状态（状态管理 V2）。
 * 模块级单例，供 MiniPlayer / 播放页 / 歌曲列表项跨页面共享观测。
 */
@ObservedV2
export class PlayerState {
  @Trace currentSong: Song | null = null;
  @Trace playlist: Song[] = [];
  @Trace currentIndex: number = -1;
  @Trace isPlaying: boolean = false;
  @Trace isLoading: boolean = false;
  @Trace position: number = 0;   // 当前进度（毫秒）
  @Trace duration: number = 0;   // 总时长（毫秒）
  @Trace mode: LoopMode = LoopMode.SEQUENCE;
  /** 预览器降级标志：AVPlayer 在 Previewer 中可能无法出声，自动切换为定时器模拟播放 */
  @Trace simulated: boolean = false;
}

export const playerState: PlayerState = new PlayerState();

/**
 * 播放器控制器：封装 @kit.MediaKit AVPlayer 的生命周期与播放控制。
 * 设计要点：
 *  - 所有页面只与 PlayerController / playerState 交互，不直接碰 AVPlayer；
 *  - 播放失败（如 Previewer 环境限制）自动进入"模拟播放"，
 *    用定时器驱动进度条与歌词，保证预览环境功能可复现（考核硬性要求）。
 */
export class PlayerController {
  private static player: media.AVPlayer | null = null;
  private static timer: number = -1;

  /** 播放指定歌曲，并以其所在列表作为播放队列 */
  static async playSong(song: Song, list: Song[]): Promise<void> {
    playerState.playlist = list;
    const idx: number = list.findIndex((s: Song) => s.id === song.id);
    playerState.currentIndex = idx >= 0 ? idx : 0;
    await PlayerController.startCurrent();
  }

  /** 播放/暂停切换 */
  static toggle(): void {
    if (playerState.currentSong === null) {
      return;
    }
    if (playerState.simulated || PlayerController.player === null) {
      // 模拟模式：仅翻转状态与定时器
      if (playerState.isPlaying) {
        playerState.isPlaying = false;
        PlayerController.stopSimulate();
      } else {
        playerState.isPlaying = true;
        PlayerController.startSimulate();
      }
      return;
    }
    if (playerState.isPlaying) {
      PlayerController.player.pause();
    } else {
      PlayerController.player.play();
    }
  }

  /** 下一首（auto=true 表示自然播完触发） */
  static next(auto: boolean = false): void {
    const n: number = playerState.playlist.length;
    if (n === 0) {
      return;
    }
    if (playerState.mode === LoopMode.SINGLE && auto) {
      PlayerController.startCurrent();
      return;
    }
    let idx: number = playerState.currentIndex;
    if (playerState.mode === LoopMode.SHUFFLE) {
      idx = Math.floor(Math.random() * n);
      if (idx === playerState.currentIndex) {
        idx = (idx + 1) % n;
      }
    } else {
      idx = (idx + 1) % n;
    }
    playerState.currentIndex = idx;
    PlayerController.startCurrent();
  }

  /** 上一首 */
  static prev(): void {
    const n: number = playerState.playlist.length;
    if (n === 0) {
      return;
    }
    playerState.currentIndex = (playerState.currentIndex - 1 + n) % n;
    PlayerController.startCurrent();
  }

  /** 拖动进度条 */
  static seekTo(ms: number): void {
    const target: number = Math.max(0, Math.min(ms, playerState.duration));
    if (playerState.simulated || PlayerController.player === null) {
      playerState.position = target;
      return;
    }
    PlayerController.player.seek(target);
  }

  /** 循环切换播放模式：顺序 -> 随机 -> 单曲 */
  static switchMode(): void {
    playerState.mode = (playerState.mode + 1) % 3;
  }

  static modeLabel(): string {
    if (playerState.mode === LoopMode.SHUFFLE) {
      return '随机播放';
    }
    if (playerState.mode === LoopMode.SINGLE) {
      return '单曲循环';
    }
    return '顺序播放';
  }

  // ---------------- 内部实现 ----------------

  private static async startCurrent(): Promise<void> {
    const song: Song | undefined = playerState.playlist[playerState.currentIndex];
    if (song === undefined) {
      return;
    }
    PlayerController.stopSimulate();
    PlayerController.release();

    playerState.currentSong = song;
    playerState.position = 0;
    playerState.duration = song.duration;
    playerState.isLoading = true;
    playerState.simulated = false;
    playerState.isPlaying = false;

    // 记录最近播放与统计
    musicStore().addHistory(song);
    musicStore().recordPlay(song);

    try {
      const p: media.AVPlayer = await media.createAVPlayer();
      PlayerController.player = p;
      PlayerController.bindEvents(p);
      p.url = song.playUrl; // 设置 url 后进入 initialized，由 stateChange 驱动后续流程
    } catch (e) {
      console.warn(`PlayerController startCurrent failed, enter simulate mode: ${String(e)}`);
      PlayerController.enterSimulate();
    }
  }

  private static bindEvents(p: media.AVPlayer): void {
    p.on('stateChange', (state: media.AVPlayerState) => {
      if (state === 'initialized') {
        p.prepare();
      } else if (state === 'prepared') {
        p.play();
      } else if (state === 'playing') {
        playerState.isPlaying = true;
        playerState.isLoading = false;
      } else if (state === 'paused') {
        playerState.isPlaying = false;
      } else if (state === 'completed') {
        PlayerController.next(true);
      } else if (state === 'error') {
        PlayerController.enterSimulate();
      }
    });
    p.on('timeUpdate', (time: number) => {
      playerState.position = time;
    });
    p.on('durationUpdate', (d: number) => {
      if (d > 0) {
        playerState.duration = d;
      }
    });
    p.on('error', () => {
      PlayerController.enterSimulate();
    });
  }

  /** 进入模拟播放（预览器降级）：定时器驱动进度，播放完自动切歌 */
  private static enterSimulate(): void {
    PlayerController.release();
    playerState.simulated = true;
    playerState.isLoading = false;
    playerState.isPlaying = true;
    PlayerController.startSimulate();
  }

  private static startSimulate(): void {
    PlayerController.stopSimulate();
    PlayerController.timer = setInterval(() => {
      if (!playerState.isPlaying) {
        return;
      }
      playerState.position += 500;
      if (playerState.position >= playerState.duration) {
        PlayerController.next(true);
      }
    }, 500);
  }

  private static stopSimulate(): void {
    if (PlayerController.timer >= 0) {
      clearInterval(PlayerController.timer);
      PlayerController.timer = -1;
    }
  }

  private static release(): void {
    if (PlayerController.player !== null) {
      PlayerController.player.release();
      PlayerController.player = null;
    }
  }
}
