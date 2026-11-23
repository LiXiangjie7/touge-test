import { AppColors, AppRoutes } from '../common/Constants';
import { Router } from '../common/Router';
import { PlayerController, playerState } from '../viewmodel/PlayerStore';

/**
 * 可复用自定义组件：底部悬浮迷你播放条。
 * 共享全局播放状态 playerState：封面、歌名、播放/暂停、切歌实时同步；
 * 无播放内容时不渲染；点击跳转全屏播放页。
 */
@ComponentV2
export struct MiniPlayer {
  build() {
    if (playerState.currentSong !== null) {
      Row({ space: 10 }) {
        Image(playerState.currentSong?.cover ?? '')
          .width(40)
          .height(40)
          .borderRadius(20)
          .objectFit(ImageFit.Cover)
          .alt($r('app.media.startIcon'))
          // 播放时封面匀速旋转
          .rotate({ angle: playerState.isPlaying ? 360 : 0 })
          .animation({ duration: 12000, curve: Curve.Linear, iterations: -1, playMode: PlayMode.Normal })
        Column({ space: 2 }) {
          Text(playerState.currentSong?.name ?? '')
            .fontSize(14)
            .fontColor(AppColors.TEXT_MAIN)
            .maxLines(1)
            .textOverflow({ overflow: TextOverflow.Ellipsis })
          Text(playerState.currentSong?.artist ?? '')
            .fontSize(11)
            .fontColor(AppColors.TEXT_SUB)
            .maxLines(1)
            .textOverflow({ overflow: TextOverflow.Ellipsis })
        }
        .alignItems(HorizontalAlign.Start)
        .layoutWeight(1)

        SymbolGlyph(playerState.isPlaying ? $r('sys.symbol.pause_fill') : $r('sys.symbol.play_fill'))
          .fontSize(26)
          .fontColor([AppColors.PRIMARY])
          .onClick(() => PlayerController.toggle())
        SymbolGlyph($r('sys.symbol.forward_end_fill'))
          .fontSize(20)
          .fontColor([AppColors.TEXT_SUB])
          .onClick(() => PlayerController.next())
      }
      .width('100%')
      .height(56)
      .padding({ left: 12, right: 16 })
      .backgroundColor(AppColors.CARD)
      .shadow({ radius: 8, color: '#1A000000', offsetY: -2 })
      .onClick(() => Router.push(AppRoutes.PLAYER))
    } else {
      Blank().height(0)
    }
  }
}
