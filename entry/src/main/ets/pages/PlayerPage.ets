import { AppColors } from '../common/Constants';
import { Router } from '../common/Router';
import { Song } from '../model/Models';
import { LoopMode, PlayerController, playerState } from '../viewmodel/PlayerStore';
import { musicStore } from '../viewmodel/MusicStore';
import { msToTime } from '../utils/Format';

/**
 * 全屏播放页（NavDestination）：
 * 旋转封面、简化歌词滚动、进度条拖动、播放/暂停、切歌、播放模式、收藏。
 * 所有控件直接绑定全局 playerState（状态管理 V2），与 MiniPlayer 实时同步；
 * 预览器环境自动进入模拟播放，进度与歌词仍由定时器驱动，功能可完整复现。
 */
@ComponentV2
export struct PlayerPage {
  @Local seeking: boolean = false;
  @Local seekValue: number = 0;

  /** 当前应高亮的歌词行（简化：每 4 秒一行） */
  private currentLyricIndex(): number {
    const song: Song | null = playerState.currentSong;
    if (song === null || song.lyric.length === 0) {
      return 0;
    }
    return Math.floor(playerState.position / 4000) % song.lyric.length;
  }

  /** 取相对当前行偏移 offset 的歌词（越界自动回绕，空安全） */
  private lyricAt(offset: number): string {
    const song: Song | null = playerState.currentSong;
    if (song === null || song.lyric.length === 0) {
      return '♪ ♪ ♪';
    }
    const len: number = song.lyric.length;
    const idx: number = ((this.currentLyricIndex() + offset) % len + len) % len;
    return song.lyric[idx];
  }

  private hasLyric(): boolean {
    return playerState.currentSong !== null && (playerState.currentSong?.lyric.length ?? 0) > 0;
  }

  /** 收藏/取消收藏当前歌曲 */
  private toggleFavorite(): void {
    const song: Song | null = playerState.currentSong;
    if (song !== null) {
      musicStore().toggleFavorite(song);
    }
  }

  private modeIcon(): Resource {
    if (playerState.mode === LoopMode.SHUFFLE) {
      return $r('sys.symbol.shuffle');
    }
    if (playerState.mode === LoopMode.SINGLE) {
      return $r('sys.symbol.repeat_1');
    }
    return $r('sys.symbol.repeat');
  }

  build() {
    NavDestination() {
      Column() {
        // 顶部栏
        Row() {
          SymbolGlyph($r('sys.symbol.chevron_down'))
            .fontSize(22)
            .fontColor([Color.White])
            .onClick(() => Router.back())
          Column({ space: 2 }) {
            Text(playerState.currentSong?.name ?? '')
              .fontSize(16)
              .fontWeight(FontWeight.Medium)
              .fontColor(Color.White)
              .maxLines(1)
              .textOverflow({ overflow: TextOverflow.Ellipsis })
            Text(playerState.currentSong?.artist ?? '')
              .fontSize(12)
              .fontColor(AppColors.WHITE_60)
              .maxLines(1)
              .textOverflow({ overflow: TextOverflow.Ellipsis })
          }
          .alignItems(HorizontalAlign.Center)
          .layoutWeight(1)
          Blank().width(22)
        }
        .width('100%')
        .padding({ left: 16, right: 16, top: 14 })

        Blank().layoutWeight(1)

        // 旋转封面（黑胶唱片样式）
        Stack() {
          Circle({ width: 250, height: 250 })
            .fill('#141414')
          Circle({ width: 244, height: 244 })
            .fill('#222226')
          Image(playerState.currentSong?.cover ?? '')
            .width(168)
            .height(168)
            .borderRadius(84)
            .objectFit(ImageFit.Cover)
            .alt($r('app.media.startIcon'))
          Circle({ width: 20, height: 20 })
            .fill(AppColors.PLAYER_BG_BOTTOM)
        }
        .rotate({ angle: playerState.isPlaying ? 360 : 0 })
        .animation({ duration: 20000, curve: Curve.Linear, iterations: -1, playMode: PlayMode.Normal })

        Blank().layoutWeight(1)

        // 简化歌词区：三行视图，当前行高亮
        Column({ space: 6 }) {
          if (this.hasLyric()) {
            Text(this.lyricAt(-1))
              .fontSize(13)
              .fontColor(AppColors.WHITE_30)
            Text(this.lyricAt(0))
              .fontSize(15)
              .fontColor(Color.White)
              .fontWeight(FontWeight.Medium)
            Text(this.lyricAt(1))
              .fontSize(13)
              .fontColor(AppColors.WHITE_30)
          }
        }
        .width('100%')
        .padding({ bottom: 20 })

        // 进度条
        Row({ space: 8 }) {
          Text(msToTime(playerState.position))
            .fontSize(11)
            .fontColor(AppColors.WHITE_60)
            .width(40)
          Slider({
            value: this.seeking ? this.seekValue : playerState.position,
            min: 0,
            max: Math.max(playerState.duration, 1),
            step: 500,
            style: SliderStyle.OutSet
          })
            .layoutWeight(1)
            .blockColor(AppColors.PRIMARY)
            .trackColor(AppColors.WHITE_30)
            .selectedColor(AppColors.PRIMARY)
            .onChange((value: number, mode: SliderChangeMode) => {
              if (mode === SliderChangeMode.Begin) {
                this.seeking = true;
                this.seekValue = value;
              } else if (mode === SliderChangeMode.Moving) {
                this.seekValue = value;
                playerState.position = value;
              } else {
                PlayerController.seekTo(value);
                this.seeking = false;
              }
            })
          Text(msToTime(playerState.duration))
            .fontSize(11)
            .fontColor(AppColors.WHITE_60)
            .width(40)
        }
        .width('100%')
        .padding({ left: 16, right: 16 })

        // 播放控制区
        Row() {
          SymbolGlyph(this.modeIcon())
            .fontSize(22)
            .fontColor([Color.White])
            .onClick(() => PlayerController.switchMode())
            .layoutWeight(1)
          SymbolGlyph($r('sys.symbol.backward_end_fill'))
            .fontSize(30)
            .fontColor([Color.White])
            .onClick(() => PlayerController.prev())
            .layoutWeight(1)
          Stack() {
            Circle({ width: 62, height: 62 })
              .fill(AppColors.PRIMARY)
            if (playerState.isLoading) {
              LoadingProgress()
                .width(26)
                .height(26)
                .color(Color.White)
            } else {
              SymbolGlyph(playerState.isPlaying ? $r('sys.symbol.pause_fill') : $r('sys.symbol.play_fill'))
                .fontSize(30)
                .fontColor([Color.White])
            }
          }
          .layoutWeight(1)
          .onClick(() => PlayerController.toggle())
          SymbolGlyph($r('sys.symbol.forward_end_fill'))
            .fontSize(30)
            .fontColor([Color.White])
            .onClick(() => PlayerController.next())
            .layoutWeight(1)
          SymbolGlyph(playerState.currentSong !== null && musicStore().isFavorite(playerState.currentSong.id)
            ? $r('sys.symbol.heart_fill')
            : $r('sys.symbol.heart'))
            .fontSize(22)
            .fontColor(playerState.currentSong !== null && musicStore().isFavorite(playerState.currentSong.id)
              ? [AppColors.PRIMARY]
              : [Color.White])
            .onClick(() => this.toggleFavorite())
            .layoutWeight(1)
        }
        .width('100%')
        .padding({ left: 24, right: 24, top: 10, bottom: 30 })
      }
      .width('100%')
      .height('100%')
      .linearGradient({
        angle: 180,
        colors: [[AppColors.PLAYER_BG_TOP, 0.0], [AppColors.PLAYER_BG_BOTTOM, 1.0]]
      })
    }
    .hideTitleBar(true)
  }
}
