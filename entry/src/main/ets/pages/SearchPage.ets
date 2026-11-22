import { AppColors, LoadState } from '../common/Constants';
import { Router } from '../common/Router';
import { HotSearch, Song } from '../model/Models';
import { ApiService } from '../network/ApiService';
import { PlayerController } from '../viewmodel/PlayerStore';
import { SongListItem } from '../components/SongListItem';
import { EmptyView, ErrorView, LoadingView } from '../components/StateViews';
import { formatCount } from '../utils/Format';

/**
 * 搜索页（NavDestination）：
 * 热搜榜展示 + 关键词搜索；搜索优先请求真实远端接口，
 * 失败自动降级本地 Mock，结果列表可点击播放。
 */
@ComponentV2
export struct SearchPage {
  @Local keyword: string = '';
  @Local hotList: HotSearch[] = [];
  @Local results: Song[] | null = null; // null = 未搜索（展示热搜）
  @Local state: LoadState = LoadState.SUCCESS;
  @Local hotState: LoadState = LoadState.LOADING;

  aboutToAppear(): void {
    ApiService.getHotSearch()
      .then((list: HotSearch[]) => {
        this.hotList = list;
        this.hotState = list.length === 0 ? LoadState.EMPTY : LoadState.SUCCESS;
      })
      .catch(() => {
        this.hotState = LoadState.ERROR;
      });
  }

  private doSearch(keyword: string): void {
    const kw: string = keyword.trim();
    if (kw.length === 0) {
      return;
    }
    this.keyword = kw;
    this.state = LoadState.LOADING;
    this.results = [];
    ApiService.searchSongs(kw)
      .then((songs: Song[]) => {
        this.results = songs;
        this.state = songs.length === 0 ? LoadState.EMPTY : LoadState.SUCCESS;
      })
      .catch((e: Object) => {
        console.error(`SearchPage doSearch failed: ${String(e)}`);
        this.state = LoadState.ERROR;
      });
  }

  build() {
    NavDestination() {
      Column() {
        // 搜索栏
        Row({ space: 10 }) {
          SymbolGlyph($r('sys.symbol.chevron_left'))
            .fontSize(20)
            .fontColor([AppColors.TEXT_MAIN])
            .onClick(() => Router.back())
          TextInput({ text: $$this.keyword, placeholder: '搜索歌曲 / 歌手 / 歌单' })
            .layoutWeight(1)
            .height(38)
            .fontSize(14)
            .backgroundColor(AppColors.CARD)
            .borderRadius(19)
            .onSubmit(() => this.doSearch(this.keyword))
          Button('搜索')
            .fontSize(14)
            .fontColor(Color.White)
            .backgroundColor(AppColors.PRIMARY)
            .borderRadius(19)
            .height(38)
            .onClick(() => this.doSearch(this.keyword))
        }
        .width('100%')
        .padding({ left: 16, right: 16, top: 12, bottom: 8 })

        if (this.results === null) {
          // 热搜榜
          if (this.hotState === LoadState.LOADING) {
            LoadingView()
          } else if (this.hotState === LoadState.ERROR) {
            ErrorView({ message: '热搜加载失败', onRetry: (): void => this.aboutToAppear() })
          } else if (this.hotState === LoadState.EMPTY) {
            EmptyView({ tip: '暂无热搜' })
          } else {
            Scroll() {
              Column({ space: 14 }) {
                Text('热搜榜')
                  .fontSize(17)
                  .fontWeight(FontWeight.Bold)
                  .fontColor(AppColors.TEXT_MAIN)
                  .width('100%')
                  .padding({ top: 8 })
                Flex({ wrap: FlexWrap.Wrap }) {
                  ForEach(this.hotList, (item: HotSearch, index: number) => {
                    Row({ space: 4 }) {
                      Text(`${index + 1}`)
                        .fontSize(11)
                        .fontColor(index < 3 ? AppColors.PRIMARY : AppColors.TEXT_SUB)
                      Text(item.keyword)
                        .fontSize(13)
                        .fontColor(AppColors.TEXT_MAIN)
                      Text(formatCount(item.score))
                        .fontSize(10)
                        .fontColor(AppColors.TEXT_LIGHT)
                    }
                    .padding({ left: 12, right: 12, top: 7, bottom: 7 })
                    .backgroundColor(AppColors.CARD)
                    .borderRadius(16)
                    .margin({ right: 10, bottom: 10 })
                    .onClick(() => this.doSearch(item.keyword))
                  }, (item: HotSearch) => item.keyword)
                }
                .width('100%')
              }
              .alignItems(HorizontalAlign.Start)
              .padding({ left: 16, right: 16 })
            }
            .scrollBar(BarState.Off)
            .layoutWeight(1)
          }
        } else if (this.state === LoadState.LOADING) {
          LoadingView({ tip: '搜索中…' })
        } else if (this.state === LoadState.ERROR) {
          ErrorView({ message: '搜索失败，请重试', onRetry: (): void => this.doSearch(this.keyword) })
        } else if (this.state === LoadState.EMPTY) {
          EmptyView({ tip: `没有找到与"${this.keyword}"相关的内容` })
        } else {
          List() {
            ForEach(this.results ?? [], (song: Song, index: number) => {
              ListItem() {
                SongListItem({
                  song: song,
                  index: index,
                  onPlay: (s: Song): void => {
                    if (this.results !== null) {
                      PlayerController.playSong(s, this.results);
                    }
                  }
                })
              }
            }, (song: Song) => song.id.toString())
          }
          .layoutWeight(1)
          .scrollBar(BarState.Off)
        }
      }
      .width('100%')
      .height('100%')
      .backgroundColor(AppColors.BG)
    }
    .hideTitleBar(true)
  }
}
