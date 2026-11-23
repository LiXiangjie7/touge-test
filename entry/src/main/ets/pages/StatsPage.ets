import { AppColors, LoadState } from '../common/Constants';
import { ListenStats } from '../model/Models';
import { ApiService } from '../network/ApiService';
import { musicStore } from '../viewmodel/MusicStore';
import { BarChart, LineChart, PieChart } from '../components/charts/Charts';
import { EmptyView, ErrorView, LoadingView } from '../components/StateViews';

/**
 * 听歌统计页（数据可视化加分项）：
 * 近 7 日听歌时长折线图 + 曲风占比环形图 + 歌手收听横向柱状图。
 * 数据经 ApiService 异步获取（叠加本地真实播放记录），
 * Canvas 图表随数据变化自动重绘。
 */
@ComponentV2
export struct StatsPage {
  @Local stats: ListenStats | null = null;
  @Local state: LoadState = LoadState.LOADING;

  aboutToAppear(): void {
    this.load();
  }

  private load(): void {
    this.state = LoadState.LOADING;
    ApiService.getListenStats(musicStore().extraMinutesToday)
      .then((stats: ListenStats) => {
        this.stats = stats;
        this.state = stats.weeklyMinutes.length === 0 ? LoadState.EMPTY : LoadState.SUCCESS;
      })
      .catch((e: Object) => {
        console.error(`StatsPage load failed: ${String(e)}`);
        this.state = LoadState.ERROR;
      });
  }

  build() {
    Column() {
      Text('听歌统计')
        .fontSize(22)
        .fontWeight(FontWeight.Bold)
        .fontColor(AppColors.TEXT_MAIN)
        .width('100%')
        .padding({ left: 16, top: 12, bottom: 8 })

      if (this.state === LoadState.LOADING) {
        LoadingView({ tip: '统计数据生成中…' })
      } else if (this.state === LoadState.ERROR) {
        ErrorView({ message: '统计数据加载失败', onRetry: (): void => this.load() })
      } else if (this.stats === null) {
        EmptyView({ tip: '暂无统计数据' })
      } else {
        Scroll() {
          Column({ space: 14 }) {
            // 汇总卡片
            Row({ space: 14 }) {
              Column({ space: 6 }) {
                Text(`${this.stats?.totalMinutes ?? 0}`)
                  .fontSize(24)
                  .fontWeight(FontWeight.Bold)
                  .fontColor(AppColors.PRIMARY)
                Text('本周听歌（分钟）')
                  .fontSize(12)
                  .fontColor(AppColors.TEXT_SUB)
              }
              .layoutWeight(1)
              .padding({ top: 18, bottom: 18 })
              .backgroundColor(AppColors.CARD)
              .borderRadius(12)

              Column({ space: 6 }) {
                Text(`${this.stats?.totalSongs ?? 0}`)
                  .fontSize(24)
                  .fontWeight(FontWeight.Bold)
                  .fontColor(AppColors.PRIMARY)
                Text('曲库收录（首）')
                  .fontSize(12)
                  .fontColor(AppColors.TEXT_SUB)
              }
              .layoutWeight(1)
              .padding({ top: 18, bottom: 18 })
              .backgroundColor(AppColors.CARD)
              .borderRadius(12)
            }
            .width('100%')

            LineChart({ title: '近 7 日听歌时长（分钟）', data: this.stats?.weeklyMinutes ?? [] })
            PieChart({ title: '曲风占比', data: this.stats?.genreShare ?? [] })
            BarChart({ title: '常听歌手 Top5', data: this.stats?.topArtists ?? [] })

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
}
