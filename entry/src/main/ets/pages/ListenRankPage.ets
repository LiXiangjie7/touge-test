import { AppColors } from '../common/Constants';
import { Router } from '../common/Router';
import { PlayStatItem, Song } from '../model/Models';
import { musicStore } from '../viewmodel/MusicStore';
import { PlayerController } from '../viewmodel/PlayerStore';
import { EmptyView } from '../components/StateViews';

/**
 * 听歌排行页（NavDestination）：
 * 由统计页折线图 / "听过歌曲"卡片点击进入，
 * 展示我听过的歌曲及每首的累计播放次数（数据来自 MusicStore 真实听歌记录，
 * 随播放行为实时刷新），点击任意歌曲可直接播放。
 */
@ComponentV2
export struct ListenRankPage {
  aboutToAppear(): void {
    musicStore().ensureInit();
  }

  build() {
    NavDestination() {
      Column() {
        // 顶部导航行
        Row({ space: 10 }) {
          SymbolGlyph($r('sys.symbol.chevron_left'))
            .fontSize(20)
            .fontColor([AppColors.TEXT_MAIN])
            .onClick(() => Router.back())
          Text('听歌排行')
            .fontSize(17)
            .fontWeight(FontWeight.Medium)
            .fontColor(AppColors.TEXT_MAIN)
          Blank()
          Text(`累计播放 ${musicStore().totalPlays()} 次`)
            .fontSize(12)
            .fontColor(AppColors.TEXT_SUB)
        }
        .width('100%')
        .padding({ left: 16, right: 16, top: 14, bottom: 10 })

        if (musicStore().playStats.length === 0) {
          EmptyView({ tip: '还没有听歌记录，去播放几首歌吧', icon: $r('sys.symbol.music') })
        } else {
          List() {
            ForEach(musicStore().playStats, (item: PlayStatItem, index: number) => {
              ListItem() {
                Row({ space: 10 }) {
                  Text(`${index + 1}`)
                    .fontSize(15)
                    .fontWeight(index < 3 ? FontWeight.Bold : FontWeight.Normal)
                    .fontColor(index < 3 ? AppColors.PRIMARY : AppColors.TEXT_SUB)
                    .width(26)
                    .textAlign(TextAlign.Center)
                  Image(item.song.cover)
                    .width(46)
                    .height(46)
                    .borderRadius(8)
                    .objectFit(ImageFit.Cover)
                    .alt($r('app.media.startIcon'))
                  Column({ space: 3 }) {
                    Text(item.song.name)
                      .fontSize(15)
                      .fontColor(AppColors.TEXT_MAIN)
                      .maxLines(1)
                      .textOverflow({ overflow: TextOverflow.Ellipsis })
                    Text(item.song.artist)
                      .fontSize(12)
                      .fontColor(AppColors.TEXT_SUB)
                      .maxLines(1)
                      .textOverflow({ overflow: TextOverflow.Ellipsis })
                  }
                  .alignItems(HorizontalAlign.Start)
                  .layoutWeight(1)
                  Text(`播放 ${item.count} 次`)
                    .fontSize(12)
                    .fontColor(index < 3 ? AppColors.PRIMARY : AppColors.TEXT_SUB)
                }
                .width('100%')
                .padding({ left: 16, right: 16, top: 8, bottom: 8 })
                .backgroundColor(AppColors.CARD)
                .onClick(() => {
                  const songs: Song[] = musicStore().playStats.map((p: PlayStatItem) => p.song);
                  PlayerController.playSong(item.song, songs);
                })
              }
            }, (item: PlayStatItem) => item.song.id.toString())
          }
          .layoutWeight(1)
          .scrollBar(BarState.Off)
          .divider({ strokeWidth: 0.5, color: AppColors.DIVIDER, startMargin: 52, endMargin: 16 })
        }
      }
      .width('100%')
      .height('100%')
      .backgroundColor(AppColors.BG)
    }
    .hideTitleBar(true)
  }
}
