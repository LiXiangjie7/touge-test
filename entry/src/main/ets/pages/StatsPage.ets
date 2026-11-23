import { AppColors, AppRoutes, LoadState } from '../common/Constants';
import { Router } from '../common/Router';
import { DayStat, ListenStats } from '../model/Models';
import { ApiService } from '../network/ApiService';
import { musicStore } from '../viewmodel/MusicStore';
import { BarChart, LineChart, PieChart } from '../components/charts/Charts';
import { EmptyView, ErrorView, LoadingView } from '../components/StateViews';
import { DayRef, recentDayRefs } from '../utils/Format';

/**
 * 听歌统计页（数据可视化加分项）：
 * 基于个人真实听歌记录（Preferences 持久化）统计：
 *  - 近 7 日听歌时长折线图：来自按天记录的真实听歌分钟数；
 *  - 曲风占比 / 常听歌手 Top5：按"我听过的歌"的播放次数聚合；
 *  - 点击折线图卡片或"听过歌曲"卡片进入听歌排行，查看听过的歌曲与每首播放次数。
 * 数据经 ApiService 异步聚合（模拟"上传记录 -> 服务端统计 -> 返回"链路），
 * Canvas 图表随数据变化自动重绘。
 */
@ComponentV2
export struct StatsPage {
  @Local stats: ListenStats | null = null;
  @Local state: LoadState = LoadState.LOADING;

  aboutToAppear(): void {
    // 兜底：确保听歌记录已从持久层恢复（Previewer 中 EntryAbility 可能未执行）
    musicStore().ensureInit();
    this.load();
  }

  /** 由按天听歌记录生成近 7 日折线图数据（没有记录的天为 0） */
  private buildWeekly(): DayStat[] {
    const daily: Record<string, number> = musicStore().dailyMinutes;
    return recentDayRefs().map((ref: DayRef): DayStat => {
      const stat: DayStat = {
        label: ref.label,
        minutes: Math.round(daily[ref.key] ?? 0)
      };
      return stat;
    });
  }

  private load(): void {
    this.state = LoadState.LOADING;
    ApiService.getListenStats(this.buildWeekly(), musicStore().playStats)
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
            // 汇总卡片（点击"听过歌曲"进入听歌排行）
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
                Row({ space: 4 }) {
                  Text(`${this.stats?.totalSongs ?? 0}`)
                    .fontSize(24)
                    .fontWeight(FontWeight.Bold)
                    .fontColor(AppColors.PRIMARY)
                  SymbolGlyph($r('sys.symbol.chevron_right'))
                    .fontSize(14)
                    .fontColor([AppColors.TEXT_LIGHT])
                }
                Text('听过歌曲（首）· 点击查看')
                  .fontSize(12)
                  .fontColor(AppColors.TEXT_SUB)
              }
              .layoutWeight(1)
              .padding({ top: 18, bottom: 18 })
              .backgroundColor(AppColors.CARD)
              .borderRadius(12)
              .onClick(() => Router.push(AppRoutes.LISTEN_RANK))
            }
            .width('100%')

            // 近 7 日折线图：点击卡片查看听过的歌曲与播放次数
            LineChart({
              title: '近 7 日听歌时长（分钟）',
              data: this.stats?.weeklyMinutes ?? [],
              onChartClick: (): void => Router.push(AppRoutes.LISTEN_RANK)
            })

            if ((this.stats?.totalPlays ?? 0) === 0) {
              // 尚未产生听歌记录时的引导空态
              Column({ space: 8 }) {
                SymbolGlyph($r('sys.symbol.music'))
                  .fontSize(36)
                  .fontColor([AppColors.TEXT_LIGHT])
                Text('还没有听歌记录')
                  .fontSize(14)
                  .fontColor(AppColors.TEXT_MAIN)
                Text('去"发现"页播放几首歌，这里会生成你的专属统计')
                  .fontSize(12)
                  .fontColor(AppColors.TEXT_SUB)
              }
              .width('100%')
              .padding({ top: 28, bottom: 28 })
              .backgroundColor(AppColors.CARD)
              .borderRadius(12)
            } else {
              PieChart({ title: '我的曲风占比（按播放次数）', data: this.stats?.genreShare ?? [] })
              BarChart({ title: '我的常听歌手 Top5', data: this.stats?.topArtists ?? [] })
            }

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
