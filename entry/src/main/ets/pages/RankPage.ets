import { AppColors, LoadState } from '../common/Constants';
import { RankList, Song } from '../model/Models';
import { ApiService } from '../network/ApiService';
import { PlayerController } from '../viewmodel/PlayerStore';
import { SongListItem } from '../components/SongListItem';
import { EmptyView, ErrorView, LoadingView } from '../components/StateViews';

/**
 * 排行榜页：Tabs 多榜单切换，每个榜单独立加载歌曲列表（List + 三态容错）。
 * 各榜单数据与加载状态用平行数组缓存（@Local 数组重赋值驱动 UI 刷新）。
 */
@ComponentV2
export struct RankPage {
  @Local ranks: RankList[] = [];
  @Local pageState: LoadState = LoadState.LOADING;
  @Local currentTab: number = 0;
  /** 与 ranks 对齐：各榜单歌曲列表（空数组 = 未加载） */
  @Local songsList: Song[][] = [];
  /** 与 ranks 对齐：各榜单加载状态 */
  @Local stateList: LoadState[] = [];

  aboutToAppear(): void {
    this.loadRanks();
  }

  private loadRanks(): void {
    this.pageState = LoadState.LOADING;
    ApiService.getRanks()
      .then((ranks: RankList[]) => {
        this.ranks = ranks;
        this.pageState = ranks.length === 0 ? LoadState.EMPTY : LoadState.SUCCESS;
        this.songsList = ranks.map((): Song[] => []);
        this.stateList = ranks.map((): LoadState => LoadState.LOADING);
        if (ranks.length > 0) {
          this.loadRankSongs(0);
        }
      })
      .catch((e: Object) => {
        console.error(`RankPage loadRanks failed: ${String(e)}`);
        this.pageState = LoadState.ERROR;
      });
  }

  /** 加载第 index 个榜单的歌曲（已有缓存则跳过） */
  private loadRankSongs(index: number): void {
    if (index < 0 || index >= this.ranks.length) {
      return;
    }
    const cached: Song[] = this.songsList[index] ?? [];
    if (cached.length > 0 || this.stateList[index] === LoadState.EMPTY) {
      return;
    }
    const states: LoadState[] = this.stateList.slice();
    states[index] = LoadState.LOADING;
    this.stateList = states;

    ApiService.getRankSongs(this.ranks[index])
      .then((songs: Song[]) => {
        const newSongs: Song[][] = this.songsList.slice();
        newSongs[index] = songs;
        this.songsList = newSongs;
        const newStates: LoadState[] = this.stateList.slice();
        newStates[index] = songs.length === 0 ? LoadState.EMPTY : LoadState.SUCCESS;
        this.stateList = newStates;
      })
      .catch((e: Object) => {
        console.error(`RankPage loadRankSongs failed: ${String(e)}`);
        const newStates: LoadState[] = this.stateList.slice();
        newStates[index] = LoadState.ERROR;
        this.stateList = newStates;
      });
  }

  /** 重试：清空缓存后重新加载 */
  private retryRank(index: number): void {
    const newSongs: Song[][] = this.songsList.slice();
    newSongs[index] = [];
    this.songsList = newSongs;
    this.loadRankSongs(index);
  }

  @Builder
  RankSongs(index: number) {
    if (this.stateList[index] === LoadState.ERROR) {
      ErrorView({ onRetry: (): void => this.retryRank(index) })
    } else if (this.stateList[index] === LoadState.EMPTY) {
      EmptyView({ tip: '榜单暂无数据' })
    } else if ((this.songsList[index] ?? []).length === 0) {
      LoadingView()
    } else {
      List() {
        ForEach(this.songsList[index] ?? [], (song: Song, songIndex: number) => {
          ListItem() {
            SongListItem({
              song: song,
              index: songIndex,
              showIndex: true,
              onPlay: (s: Song): void => {
                PlayerController.playSong(s, this.songsList[index] ?? []);
              }
            })
          }
        }, (song: Song) => song.id.toString())
      }
      .layoutWeight(1)
      .scrollBar(BarState.Off)
    }
  }

  build() {
    Column() {
      Text('排行榜')
        .fontSize(22)
        .fontWeight(FontWeight.Bold)
        .fontColor(AppColors.TEXT_MAIN)
        .width('100%')
        .padding({ left: 16, top: 12, bottom: 8 })

      if (this.pageState === LoadState.LOADING) {
        LoadingView({ tip: '榜单加载中…' })
      } else if (this.pageState === LoadState.ERROR) {
        ErrorView({ onRetry: (): void => this.loadRanks() })
      } else if (this.pageState === LoadState.EMPTY) {
        EmptyView({ tip: '暂无榜单' })
      } else {
        Tabs({ index: $$this.currentTab }) {
          ForEach(this.ranks, (rank: RankList, index: number) => {
            TabContent() {
              Column() {
                Row({ space: 10 }) {
                  Image(rank.cover)
                    .width(52)
                    .height(52)
                    .borderRadius(8)
                    .objectFit(ImageFit.Cover)
                    .alt($r('app.media.startIcon'))
                  Column({ space: 2 }) {
                    Text(rank.name)
                      .fontSize(16)
                      .fontWeight(FontWeight.Bold)
                      .fontColor(AppColors.TEXT_MAIN)
                    Text(rank.updateTip)
                      .fontSize(11)
                      .fontColor(AppColors.TEXT_SUB)
                  }
                  .alignItems(HorizontalAlign.Start)
                  .layoutWeight(1)
                }
                .width('100%')
                .padding({ left: 16, right: 16, top: 6, bottom: 10 })
                this.RankSongs(index)
              }
              .layoutWeight(1)
            }
            .tabBar(rank.name)
          }, (rank: RankList) => rank.id.toString())
        }
        .barMode(BarMode.Fixed)
        .layoutWeight(1)
        .onChange((index: number) => {
          this.loadRankSongs(index);
        })
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor(AppColors.BG)
  }
}
