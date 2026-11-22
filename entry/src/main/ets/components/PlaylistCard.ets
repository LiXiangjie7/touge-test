import { AppColors } from '../common/Constants';
import { Playlist } from '../model/Models';
import { formatCount } from '../utils/Format';

/**
 * 可复用自定义组件：歌单卡片。
 * 封面 + 播放量角标 + 双行标题，用于首页推荐歌单 Grid。
 */
@ComponentV2
export struct PlaylistCard {
  @Require @Param playlist: Playlist;
  @Event onTap: (playlist: Playlist) => void = () => {};

  build() {
    Column({ space: 6 }) {
      Stack({ alignContent: Alignment.TopEnd }) {
        Image(this.playlist.cover)
          .width('100%')
          .aspectRatio(1)
          .borderRadius(10)
          .objectFit(ImageFit.Cover)
          .alt($r('app.media.startIcon'))
        Row({ space: 3 }) {
          SymbolGlyph($r('sys.symbol.play_fill'))
            .fontSize(10)
            .fontColor([Color.White])
          Text(formatCount(this.playlist.playCount))
            .fontSize(10)
            .fontColor(Color.White)
        }
        .padding({ left: 8, right: 8, top: 3, bottom: 3 })
        .backgroundColor('#66000000')
        .borderRadius(10)
        .margin({ top: 6, right: 6 })
      }
      Text(this.playlist.name)
        .fontSize(13)
        .fontColor(AppColors.TEXT_MAIN)
        .maxLines(2)
        .textOverflow({ overflow: TextOverflow.Ellipsis })
        .width('100%')
    }
    .alignItems(HorizontalAlign.Start)
    .onClick(() => this.onTap(this.playlist))
  }
}
