import { AppColors, LoadState } from '../common/Constants';
import { Router } from '../common/Router';
import { Playlist, Song } from '../model/Models';
import { ApiService } from '../network/ApiService';
import { PlayerController } from '../viewmodel/PlayerStore';
import { SongListItem } from '../components/SongListItem';
import { EmptyView, ErrorView, LoadingView } from '../components/StateViews';
import { formatCount } from '../utils/Format';

/**
 * 歌单详情页（NavDestination）：
 * 通过 Navigation 路由传参接收 Playlist 对象；
 * 头部为模糊封面背景 + 歌单信息，下方为歌曲列表，
 * 支持"播放全部"与单曲点播，加载过程具备三态容错。
 */
@ComponentV2
export struct PlaylistDetailPage {
  @Require @Param playlist: Playlist;
  @Local songs: Song[] = [];
  @Local state: LoadState = LoadState.LOADING;

  aboutToAppear(): void {
    this.load();
  }

  private load(): void {
    this.state = LoadState.LOADING;
    ApiService.getPlaylistSongs(this.playlist)
      .then((songs: Song[]) => {
        this.songs = songs;
        this.state = songs.length === 0 ? LoadState.EMPTY : LoadState.SUCCESS;
      })
      .catch((e: Object) => {
        console.error(`PlaylistDetailPage load failed: ${String(e)}`);
        this.state = LoadState.ERROR;
      });
  }

  build() {
    NavDestination() {
      Stack({ alignContent: Alignment.TopStart }) {
        // 模糊封面背景
        Image(this.playlist.cover)
          .width('100%')
          .height(300)
          .objectFit(ImageFit.Cover)
          .blur(40)
          .brightness(0.65)

        Column() {
          // 顶部导航行
          Row({ space: 10 }) {
            SymbolGlyph($r('sys.symbol.chevron_left'))
              .fontSize(20)
              .fontColor([Color.White])
              .onClick(() => Router.back())
            Text('歌单')
              .fontSize(17)
              .fontWeight(FontWeight.Medium)
              .fontColor(Color.White)
            Blank()
          }
          .width('100%')
          .padding({ left: 16, right: 16, top: 14 })

          // 歌单信息区
          Row({ space: 14 }) {
            Image(this.playlist.cover)
              .width(118)
              .height(118)
              .borderRadius(10)
              .objectFit(ImageFit.Cover)
              .alt($r('app.media.startIcon'))
            Column({ space: 8 }) {
              Text(this.playlist.name)
                .fontSize(17)
                .fontWeight(FontWeight.Bold)
                .fontColor(Color.White)
                .maxLines(2)
                .textOverflow({ overflow: TextOverflow.Ellipsis })
              Text(`by ${this.playlist.creator} · ${formatCount(this.playlist.playCount)}次播放`)
                .fontSize(12)
                .fontColor(AppColors.WHITE_60)
              Row({ space: 6 }) {
                ForEach(this.playlist.tags, (tag: string) => {
                  Text(tag)
                    .fontSize(10)
                    .fontColor(Color.White)
                    .padding({ left: 8, right: 8, top: 2, bottom: 2 })
                    .border({ width: 1, color: AppColors.WHITE_30, radius: 8 })
                }, (tag: string) => tag)
              }
              Text(this.playlist.description)
                .fontSize(11)
                .fontColor(AppColors.WHITE_60)
                .maxLines(2)
                .textOverflow({ overflow: TextOverflow.Ellipsis })
            }
            .alignItems(HorizontalAlign.Start)
            .layoutWeight(1)
          }
          .width('100%')
          .padding({ left: 16, right: 16, top: 18 })

          // 歌曲列表卡片
          Column() {
            // 播放全部
            Row({ space: 8 }) {
              SymbolGlyph($r('sys.symbol.play_circle_fill'))
                .fontSize(24)
                .fontColor([AppColors.PRIMARY])
              Text(`播放全部（${this.songs.length}首）`)
                .fontSize(15)
                .fontWeight(FontWeight.Medium)
                .fontColor(AppColors.TEXT_MAIN)
            }
            .width('100%')
            .padding({ left: 16, right: 16, top: 12, bottom: 8 })
            .onClick(() => {
              if (this.songs.length > 0) {
                PlayerController.playSong(this.songs[0], this.songs);
              }
            })

            if (this.state === LoadState.LOADING) {
              LoadingView()
            } else if (this.state === LoadState.ERROR) {
              ErrorView({ onRetry: (): void => this.load() })
            } else if (this.state === LoadState.EMPTY) {
              EmptyView({ tip: '这个歌单还没有歌曲' })
            } else {
              List() {
                ForEach(this.songs, (song: Song, index: number) => {
                  ListItem() {
                    SongListItem({
                      song: song,
                      index: index,
                      showIndex: true,
                      onPlay: (s: Song): void => {
                        PlayerController.playSong(s, this.songs);
                      }
                    })
                  }
                }, (song: Song) => song.id.toString())
              }
              .layoutWeight(1)
              .scrollBar(BarState.Off)
            }
          }
          .layoutWeight(1)
          .width('100%')
          .margin({ top: 20 })
          .backgroundColor(AppColors.BG)
          .borderRadius({ topLeft: 18, topRight: 18 })
        }
        .width('100%')
        .height('100%')
      }
      .width('100%')
      .height('100%')
      .backgroundColor(AppColors.BG)
    }
    .hideTitleBar(true)
  }
}
