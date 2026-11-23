import { AppColors, LoadState } from '../common/Constants';
import { Router } from '../common/Router';
import { ArtistDetail, Song } from '../model/Models';
import { ApiService } from '../network/ApiService';
import { userStore } from '../viewmodel/UserStore';
import { PlayerController } from '../viewmodel/PlayerStore';
import { SongListItem } from '../components/SongListItem';
import { EmptyView, ErrorView, LoadingView } from '../components/StateViews';
import { formatCount } from '../utils/Format';

/**
 * 歌手主页（NavDestination）：
 * 由播放页歌手名 / 个人资料页"歌手"列表点击进入。
 * 展示歌手全部资料（头像 / 粉丝数 / 曲风 / 地区 / 详细介绍）与全部作品列表，
 * 支持关注 / 取消关注歌手（UserStore 持久化），
 * 数据经 ApiService 异步获取，具备加载/异常/空数据三态容错。
 */
@ComponentV2
export struct ArtistPage {
  @Require @Param artistName: string;
  @Local detail: ArtistDetail | null = null;
  @Local state: LoadState = LoadState.LOADING;

  aboutToAppear(): void {
    userStore().ensureInit();
    this.load();
  }

  private load(): void {
    this.state = LoadState.LOADING;
    ApiService.getArtistDetail(this.artistName)
      .then((detail: ArtistDetail) => {
        this.detail = detail;
        this.state = detail.songs.length === 0 && detail.info.fans === 0 && detail.info.genre.length === 0
          ? LoadState.EMPTY : LoadState.SUCCESS;
      })
      .catch((e: Object) => {
        console.error(`ArtistPage load failed: ${String(e)}`);
        this.state = LoadState.ERROR;
      });
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
          Text('歌手')
            .fontSize(17)
            .fontWeight(FontWeight.Medium)
            .fontColor(AppColors.TEXT_MAIN)
          Blank()
        }
        .width('100%')
        .padding({ left: 16, right: 16, top: 14, bottom: 10 })

        if (this.state === LoadState.LOADING) {
          LoadingView({ tip: '歌手资料加载中…' })
        } else if (this.state === LoadState.ERROR) {
          ErrorView({ message: '歌手资料加载失败', onRetry: (): void => this.load() })
        } else if (this.state === LoadState.EMPTY || this.detail === null) {
          EmptyView({ tip: '暂无该歌手的资料', icon: $r('sys.symbol.person') })
        } else {
          Scroll() {
            Column({ space: 14 }) {
              // 歌手资料卡
              Column({ space: 12 }) {
                Row({ space: 14 }) {
                  Image(this.detail?.info.avatar ?? '')
                    .width(84)
                    .height(84)
                    .borderRadius(42)
                    .objectFit(ImageFit.Cover)
                    .alt($r('app.media.startIcon'))
                  Column({ space: 8 }) {
                    Text(this.detail?.info.name ?? '')
                      .fontSize(20)
                      .fontWeight(FontWeight.Bold)
                      .fontColor(AppColors.TEXT_MAIN)
                    Text(`${formatCount(this.detail?.info.fans ?? 0)} 粉丝`)
                      .fontSize(12)
                      .fontColor(AppColors.TEXT_SUB)
                    Text(userStore().isFollowingArtist(this.detail?.info.id ?? -1) ? '已关注' : '+ 关注')
                      .fontSize(13)
                      .fontColor(userStore().isFollowingArtist(this.detail?.info.id ?? -1)
                        ? AppColors.TEXT_SUB : Color.White)
                      .padding({ left: 18, right: 18, top: 6, bottom: 6 })
                      .backgroundColor(userStore().isFollowingArtist(this.detail?.info.id ?? -1)
                        ? AppColors.BG : AppColors.PRIMARY)
                      .borderRadius(16)
                      .onClick(() => {
                        const id: number = this.detail?.info.id ?? -1;
                        if (id > 0) {
                          userStore().toggleFollowArtist(id);
                        }
                      })
                  }
                  .alignItems(HorizontalAlign.Start)
                  .layoutWeight(1)
                }
                .width('100%')

                // 详细资料
                Row({ space: 8 }) {
                  Text('曲风')
                    .fontSize(12)
                    .fontColor(AppColors.TEXT_SUB)
                    .width(56)
                  Text(this.detail?.info.genre ?? '')
                    .fontSize(12)
                    .fontColor(AppColors.TEXT_MAIN)
                }
                .width('100%')
                Row({ space: 8 }) {
                  Text('地区')
                    .fontSize(12)
                    .fontColor(AppColors.TEXT_SUB)
                    .width(56)
                  Text(this.detail?.info.region ?? '')
                    .fontSize(12)
                    .fontColor(AppColors.TEXT_MAIN)
                }
                .width('100%')
                Row({ space: 8 }) {
                  Text('简介')
                    .fontSize(12)
                    .fontColor(AppColors.TEXT_SUB)
                    .width(56)
                  Text(this.detail?.info.description ?? '')
                    .fontSize(12)
                    .fontColor(AppColors.TEXT_MAIN)
                    .layoutWeight(1)
                }
                .width('100%')
                .alignItems(VerticalAlign.Top)
              }
              .width('100%')
              .padding(16)
              .backgroundColor(AppColors.CARD)
              .borderRadius(12)
              .alignItems(HorizontalAlign.Start)

              // 全部作品
              Column() {
                Row({ space: 8 }) {
                  SymbolGlyph($r('sys.symbol.play_circle_fill'))
                    .fontSize(24)
                    .fontColor([AppColors.PRIMARY])
                  Text(`全部作品（${this.detail?.songs.length ?? 0}首）`)
                    .fontSize(15)
                    .fontWeight(FontWeight.Medium)
                    .fontColor(AppColors.TEXT_MAIN)
                }
                .width('100%')
                .padding({ left: 16, right: 16, top: 12, bottom: 8 })
                .onClick(() => {
                  const songs: Song[] = this.detail?.songs ?? [];
                  if (songs.length > 0) {
                    PlayerController.playSong(songs[0], songs);
                  }
                })

                if ((this.detail?.songs.length ?? 0) === 0) {
                  EmptyView({ tip: '暂无作品' })
                } else {
                  ForEach(this.detail?.songs ?? [], (song: Song, index: number) => {
                    SongListItem({
                      song: song,
                      index: index,
                      showIndex: true,
                      onPlay: (s: Song): void => {
                        PlayerController.playSong(s, this.detail?.songs ?? []);
                      }
                    })
                  }, (song: Song) => song.id.toString())
                }
                Blank().height(12)
              }
              .width('100%')
              .borderRadius(12)
              .clip(true)
              .backgroundColor(AppColors.CARD)

              Blank().height(24)
            }
            .alignItems(HorizontalAlign.Start)
            .padding({ left: 16, right: 16 })
          }
          .scrollBar(BarState.Off)
          .layoutWeight(1)
        }
      }
      .width('100%')
      .height('100%')
      .backgroundColor(AppColors.BG)
    }
    .hideTitleBar(true)
  }
}
