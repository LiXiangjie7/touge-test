import { AppColors, AppRoutes, LoadState } from '../common/Constants';
import { Router } from '../common/Router';
import { BannerItem, HomeData, Playlist, Song } from '../model/Models';
import { ApiService } from '../network/ApiService';
import { PlayerController } from '../viewmodel/PlayerStore';
import { PlaylistCard } from '../components/PlaylistCard';
import { SectionHeader } from '../components/SectionHeader';
import { SongListItem } from '../components/SongListItem';
import { EmptyView, ErrorView, LoadingView } from '../components/StateViews';

/**
 * 发现页（首页）：
 * 搜索入口 + Banner 轮播(Swiper) + 推荐歌单(Grid) + 热门单曲(List) + 下拉刷新(Refresh)。
 * 数据经由 ApiService 异步获取，具备 加载中/异常/空数据 三态容错。
 */
@ComponentV2
export struct HomePage {
  @Local homeData: HomeData | null = null;
  @Local state: LoadState = LoadState.LOADING;
  @Local refreshing: boolean = false;

  aboutToAppear(): void {
    this.load();
  }

  /** 首次/重试加载 */
  private load(): void {
    this.state = LoadState.LOADING;
    ApiService.getHomeData()
      .then((data: HomeData) => {
        this.homeData = data;
        const empty: boolean = data.banners.length === 0 &&
          data.recommendPlaylists.length === 0 && data.hotSongs.length === 0;
        this.state = empty ? LoadState.EMPTY : LoadState.SUCCESS;
      })
      .catch((e: Object) => {
        console.error(`HomePage load failed: ${String(e)}`);
        this.state = LoadState.ERROR;
      });
  }

  /** 下拉刷新 */
  private onRefresh(): void {
    ApiService.getHomeData()
      .then((data: HomeData) => {
        this.homeData = data;
      })
      .catch((e: Object) => {
        console.error(`HomePage refresh failed: ${String(e)}`);
      })
      .finally(() => {
        this.refreshing = false;
      });
  }

  /** 点击 Banner 跳转到对应歌单 */
  private onBannerTap(banner: BannerItem): void {
    const playlist: Playlist | undefined = ApiService.findPlaylist(banner.playlistId);
    if (playlist !== undefined) {
      Router.push(AppRoutes.PLAYLIST_DETAIL, playlist);
    }
  }

  /** 推荐歌单区高度：按 3 列换算行数，保证 Grid 在 Scroll 中正确布局 */
  private gridHeight(): number {
    if (this.homeData === null) {
      return 0;
    }
    const rows: number = Math.ceil(this.homeData.recommendPlaylists.length / 3);
    return rows * 188 + (rows - 1) * 12;
  }

  private banners(): BannerItem[] {
    return this.homeData?.banners ?? [];
  }

  private playlists(): Playlist[] {
    return this.homeData?.recommendPlaylists ?? [];
  }

  private hotSongs(): Song[] {
    return this.homeData?.hotSongs ?? [];
  }

  /** 以热门单曲列表为播放队列点播 */
  private playHot(song: Song): void {
    PlayerController.playSong(song, this.hotSongs());
    Router.push(AppRoutes.PLAYER);
  }

  build() {
    Column() {
      // 顶部标题 + 搜索入口
      Row({ space: 10 }) {
        Text('云乐')
          .fontSize(22)
          .fontWeight(FontWeight.Bold)
          .fontColor(AppColors.PRIMARY)
        Row({ space: 6 }) {
          SymbolGlyph($r('sys.symbol.magnifyingglass'))
            .fontSize(15)
            .fontColor([AppColors.TEXT_SUB])
          Text('搜索歌曲 / 歌手 / 歌单')
            .fontSize(13)
            .fontColor(AppColors.TEXT_SUB)
        }
        .layoutWeight(1)
        .height(36)
        .padding({ left: 12 })
        .backgroundColor(AppColors.CARD)
        .borderRadius(18)
        .alignItems(VerticalAlign.Center)
        .onClick(() => Router.push(AppRoutes.SEARCH))
      }
      .width('100%')
      .padding({ left: 16, right: 16, top: 12, bottom: 8 })

      if (this.state === LoadState.LOADING) {
        LoadingView({ tip: '正在为你推荐好音乐…' })
      } else if (this.state === LoadState.ERROR) {
        ErrorView({
          message: '网络异常，好音乐马上回来',
          onRetry: (): void => this.load()
        })
      } else if (this.state === LoadState.EMPTY) {
        EmptyView({ tip: '暂时没有内容' })
      } else if (this.homeData !== null) {
        Refresh({ refreshing: $$this.refreshing }) {
          Scroll() {
            Column() {
              // Banner 轮播
              Swiper() {
                ForEach(this.banners(), (banner: BannerItem) => {
                  Stack({ alignContent: Alignment.BottomStart }) {
                    Image(banner.image)
                      .width('100%')
                      .height(150)
                      .borderRadius(12)
                      .objectFit(ImageFit.Cover)
                      .alt($r('app.media.startIcon'))
                    Text(banner.title)
                      .fontSize(13)
                      .fontColor(Color.White)
                      .fontWeight(FontWeight.Medium)
                      .padding({ left: 10, right: 10, top: 4, bottom: 4 })
                      .backgroundColor('#66000000')
                      .borderRadius(8)
                      .margin({ left: 10, bottom: 10 })
                  }
                  .onClick(() => this.onBannerTap(banner))
                }, (banner: BannerItem) => banner.id.toString())
              }
              .autoPlay(true)
              .interval(3500)
              .loop(true)
              .indicator(Indicator.dot()
                .selectedColor(AppColors.PRIMARY)
                .color('#99FFFFFF'))
              .width('100%')
              .height(150)
              .padding({ left: 16, right: 16 })

              // 推荐歌单 Grid
              SectionHeader({ title: '推荐歌单' })
              Grid() {
                ForEach(this.playlists(), (playlist: Playlist) => {
                  GridItem() {
                    PlaylistCard({
                      playlist: playlist,
                      onTap: (p: Playlist): void => Router.push(AppRoutes.PLAYLIST_DETAIL, p)
                    })
                  }
                }, (playlist: Playlist) => playlist.id.toString())
              }
              .columnsTemplate('1fr 1fr 1fr')
              .columnsGap(10)
              .rowsGap(12)
              .height(this.gridHeight())
              .padding({ left: 16, right: 16 })

              // 热门单曲 List
              SectionHeader({ title: '热门单曲' })
              Column() {
                ForEach(this.hotSongs(), (song: Song, index: number) => {
                  SongListItem({
                    song: song,
                    index: index,
                    onPlay: (s: Song): void => this.playHot(s)
                  })
                }, (song: Song) => song.id.toString())
              }
              .borderRadius(12)
              .clip(true)
              .margin({ left: 16, right: 16 })

              Blank().height(24)
            }
            .alignItems(HorizontalAlign.Start)
          }
          .scrollBar(BarState.Off)
          .align(Alignment.Top)
        }
        .layoutWeight(1)
        .onRefreshing(() => this.onRefresh())
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor(AppColors.BG)
  }
}
