import { AppColors } from '../common/Constants';
import { Song } from '../model/Models';
import { playerState } from '../viewmodel/PlayerStore';
import { musicStore } from '../viewmodel/MusicStore';

/**
 * 可复用自定义组件：歌曲列表项。
 * 在首页热门单曲、歌单详情、排行榜、搜索结果、我的收藏、最近播放中复用。
 * 展示封面 / 序号 / 歌名 / 歌手 / 收藏按钮；正在播放的歌曲高亮。
 */
@ComponentV2
export struct SongListItem {
  @Require @Param song: Song;
  @Param index: number = 0;
  @Param showIndex: boolean = false;
  /** 点击播放回调（由父组件决定播放队列上下文） */
  @Event onPlay: (song: Song) => void = () => {};

  private isPlayingThis(): boolean {
    return playerState.currentSong !== null && playerState.currentSong.id === this.song.id;
  }

  build() {
    Row({ space: 10 }) {
      if (this.showIndex) {
        Text(`${this.index + 1}`)
          .fontSize(15)
          .fontWeight(this.index < 3 ? FontWeight.Bold : FontWeight.Normal)
          .fontColor(this.index < 3 ? AppColors.PRIMARY : AppColors.TEXT_SUB)
          .width(26)
          .textAlign(TextAlign.Center)
      }
      Image(this.song.cover)
        .width(46)
        .height(46)
        .borderRadius(8)
        .objectFit(ImageFit.Cover)
        .alt($r('app.media.startIcon'))
      Column({ space: 3 }) {
        Text(this.song.name)
          .fontSize(15)
          .fontColor(this.isPlayingThis() ? AppColors.PRIMARY : AppColors.TEXT_MAIN)
          .fontWeight(this.isPlayingThis() ? FontWeight.Medium : FontWeight.Normal)
          .maxLines(1)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
        Text(`${this.song.artist} · ${this.song.album}`)
          .fontSize(12)
          .fontColor(AppColors.TEXT_SUB)
          .maxLines(1)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
      }
      .alignItems(HorizontalAlign.Start)
      .layoutWeight(1)

      if (this.isPlayingThis()) {
        SymbolGlyph($r('sys.symbol.music'))
          .fontSize(16)
          .fontColor([AppColors.PRIMARY])
      }
      SymbolGlyph(musicStore().isFavorite(this.song.id)
        ? $r('sys.symbol.heart_fill')
        : $r('sys.symbol.heart'))
        .fontSize(18)
        .fontColor(musicStore().isFavorite(this.song.id)
          ? [AppColors.PRIMARY]
          : [AppColors.TEXT_LIGHT])
        .onClick(() => musicStore().toggleFavorite(this.song))
    }
    .width('100%')
    .padding({ left: 16, right: 16, top: 8, bottom: 8 })
    .backgroundColor(AppColors.CARD)
    .onClick(() => this.onPlay(this.song))
  }
}
