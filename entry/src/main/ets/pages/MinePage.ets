import { AppColors, StoreKeys } from '../common/Constants';
import { Song } from '../model/Models';
import { MockApi } from '../network/MockApi';
import { PlayerController } from '../viewmodel/PlayerStore';
import { musicStore } from '../viewmodel/MusicStore';
import { PreferencesUtil } from '../utils/PreferencesUtil';
import { SongListItem } from '../components/SongListItem';
import { EmptyView } from '../components/StateViews';

/**
 * 我的页面：
 * 用户信息卡 + 数据统计 + 我喜欢的音乐 + 最近播放（均经 Preferences 持久化）
 * + 设置区（"模拟网络异常"开关，用于演示各页面的错误态与重试逻辑）。
 */
@ComponentV2
export struct MinePage {
  @Local simulateError: boolean = MockApi.simulateError;
  @Local showFavorites: boolean = true; // true=收藏列表 false=最近播放

  private onToggleSimulate(value: boolean): void {
    this.simulateError = value;
    MockApi.simulateError = value;
    PreferencesUtil.putBool(StoreKeys.SIMULATE_ERROR, value);
  }

  build() {
    Scroll() {
      Column({ space: 14 }) {
        // 用户卡片
        Row({ space: 12 }) {
          Image('https://picsum.photos/seed/yunle-avatar/200/200')
            .width(58)
            .height(58)
            .borderRadius(29)
            .objectFit(ImageFit.Cover)
            .alt($r('app.media.startIcon'))
          Column({ space: 4 }) {
            Text('云乐村民')
              .fontSize(18)
              .fontWeight(FontWeight.Bold)
              .fontColor(AppColors.TEXT_MAIN)
            Text('保持热爱，奔赴山海')
              .fontSize(12)
              .fontColor(AppColors.TEXT_SUB)
          }
          .alignItems(HorizontalAlign.Start)
          .layoutWeight(1)
          SymbolGlyph($r('sys.symbol.chevron_right'))
            .fontSize(16)
            .fontColor([AppColors.TEXT_LIGHT])
        }
        .width('100%')
        .padding(16)
        .backgroundColor(AppColors.CARD)
        .borderRadius(12)

        // 数据统计行
        Row() {
          Column({ space: 4 }) {
            Text(`${musicStore().favorites.length}`)
              .fontSize(18)
              .fontWeight(FontWeight.Bold)
              .fontColor(AppColors.TEXT_MAIN)
            Text('我的收藏')
              .fontSize(11)
              .fontColor(AppColors.TEXT_SUB)
          }
          .layoutWeight(1)
          Column({ space: 4 }) {
            Text(`${musicStore().history.length}`)
              .fontSize(18)
              .fontWeight(FontWeight.Bold)
              .fontColor(AppColors.TEXT_MAIN)
            Text('最近播放')
              .fontSize(11)
              .fontColor(AppColors.TEXT_SUB)
          }
          .layoutWeight(1)
          Column({ space: 4 }) {
            Text(`${Math.round(musicStore().extraMinutesToday)}`)
              .fontSize(18)
              .fontWeight(FontWeight.Bold)
              .fontColor(AppColors.TEXT_MAIN)
            Text('今日听歌(分钟)')
              .fontSize(11)
              .fontColor(AppColors.TEXT_SUB)
          }
          .layoutWeight(1)
        }
        .width('100%')
        .padding({ top: 14, bottom: 14 })
        .backgroundColor(AppColors.CARD)
        .borderRadius(12)

        // 收藏 / 最近播放 切换
        Row({ space: 8 }) {
          Text('我喜欢的音乐')
            .fontSize(14)
            .fontColor(this.showFavorites ? Color.White : AppColors.TEXT_MAIN)
            .padding({ left: 14, right: 14, top: 7, bottom: 7 })
            .backgroundColor(this.showFavorites ? AppColors.PRIMARY : AppColors.CARD)
            .borderRadius(16)
            .onClick(() => {
              this.showFavorites = true;
            })
          Text('最近播放')
            .fontSize(14)
            .fontColor(this.showFavorites ? AppColors.TEXT_MAIN : Color.White)
            .padding({ left: 14, right: 14, top: 7, bottom: 7 })
            .backgroundColor(this.showFavorites ? AppColors.CARD : AppColors.PRIMARY)
            .borderRadius(16)
            .onClick(() => {
              this.showFavorites = false;
            })
          Blank()
          if (!this.showFavorites && musicStore().history.length > 0) {
            SymbolGlyph($r('sys.symbol.trash'))
              .fontSize(16)
              .fontColor([AppColors.TEXT_SUB])
              .onClick(() => musicStore().clearHistory())
          }
        }
        .width('100%')

        // 列表区
        Column() {
          if (this.showFavorites) {
            if (musicStore().favorites.length === 0) {
              EmptyView({ tip: '还没有收藏歌曲，去点一颗小红心吧', icon: $r('sys.symbol.heart') })
            } else {
              ForEach(musicStore().favorites, (song: Song, index: number) => {
                SongListItem({
                  song: song,
                  index: index,
                  onPlay: (s: Song): void => {
                    PlayerController.playSong(s, musicStore().favorites);
                  }
                })
              }, (song: Song) => song.id.toString())
            }
          } else {
            if (musicStore().history.length === 0) {
              EmptyView({ tip: '暂无播放记录', icon: $r('sys.symbol.clock') })
            } else {
              ForEach(musicStore().history, (song: Song, index: number) => {
                SongListItem({
                  song: song,
                  index: index,
                  onPlay: (s: Song): void => {
                    PlayerController.playSong(s, musicStore().history);
                  }
                })
              }, (song: Song) => song.id.toString())
            }
          }
        }
        .width('100%')
        .borderRadius(12)
        .clip(true)
        .backgroundColor(AppColors.CARD)

        // 设置区
        Column() {
          Row() {
            Column({ space: 2 }) {
              Text('模拟网络异常')
                .fontSize(14)
                .fontColor(AppColors.TEXT_MAIN)
              Text('开启后所有接口返回失败，用于演示错误态与重试')
                .fontSize(10)
                .fontColor(AppColors.TEXT_SUB)
            }
            .alignItems(HorizontalAlign.Start)
            .layoutWeight(1)
            Toggle({ type: ToggleType.Switch, isOn: this.simulateError })
              .selectedColor(AppColors.PRIMARY)
              .onChange((value: boolean) => this.onToggleSimulate(value))
          }
          .width('100%')
          .padding({ left: 16, right: 16, top: 12, bottom: 12 })

          Divider().color(AppColors.DIVIDER).strokeWidth(0.5).margin({ left: 16, right: 16 })

          Row() {
            Text('关于云乐')
              .fontSize(14)
              .fontColor(AppColors.TEXT_MAIN)
            Blank()
            Text('v1.0.0')
              .fontSize(12)
              .fontColor(AppColors.TEXT_LIGHT)
          }
          .width('100%')
          .padding({ left: 16, right: 16, top: 12, bottom: 12 })
        }
        .width('100%')
        .backgroundColor(AppColors.CARD)
        .borderRadius(12)

        Blank().height(24)
      }
      .alignItems(HorizontalAlign.Start)
      .padding({ left: 16, right: 16, top: 12 })
    }
    .scrollBar(BarState.Off)
    .width('100%')
    .height('100%')
    .backgroundColor(AppColors.BG)
  }
}
