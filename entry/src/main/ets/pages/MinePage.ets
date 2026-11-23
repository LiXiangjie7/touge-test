import { AppColors, AppRoutes, StoreKeys } from '../common/Constants';
import { Router } from '../common/Router';
import { Song } from '../model/Models';
import { MockApi, SimulateMode } from '../network/MockApi';
import { PlayerController } from '../viewmodel/PlayerStore';
import { musicStore } from '../viewmodel/MusicStore';
import { userStore } from '../viewmodel/UserStore';
import { PreferencesUtil } from '../utils/PreferencesUtil';
import { SongListItem } from '../components/SongListItem';
import { EmptyView } from '../components/StateViews';

/**
 * 我的页面：
 * 用户信息卡（点击进入个人资料页，可编辑姓名/年龄/个人名片、查看关注与好友列表）
 * + 数据统计 + 我喜欢的音乐 + 最近播放（均经 Preferences 持久化）
 * + 设置区（"网络状态模拟"四档切换：正常/慢速网络/网络异常/空数据，
 *   用于演示各页面的加载提示、失败重试与空数据容错）。
 */
@ComponentV2
export struct MinePage {
  @Local simulateMode: string = MockApi.simulateMode;
  @Local showFavorites: boolean = true; // true=收藏列表 false=最近播放

  /** 档位标签与取值（与 MockApi.SimulateMode 对应） */
  private readonly modeLabels: string[] = ['正常', '慢速网络', '网络异常', '空数据'];
  private readonly modeValues: string[] = ['normal', 'slow', 'error', 'empty'];

  private onSelectMode(index: number): void {
    this.simulateMode = this.modeValues[index];
    MockApi.simulateMode = this.modeValues[index] as SimulateMode;
    PreferencesUtil.putString(StoreKeys.SIMULATE_MODE, this.simulateMode);
  }

  build() {
    Scroll() {
      Column({ space: 14 }) {
        // 用户卡片（点击进入个人资料页）
        Row({ space: 12 }) {
          Image(`https://picsum.photos/seed/${userStore().profile.avatarSeed}/200/200`)
            .width(58)
            .height(58)
            .borderRadius(29)
            .objectFit(ImageFit.Cover)
            .alt($r('app.media.startIcon'))
          Column({ space: 4 }) {
            Text(userStore().profile.nickname)
              .fontSize(18)
              .fontWeight(FontWeight.Bold)
              .fontColor(AppColors.TEXT_MAIN)
            Text(userStore().profile.signature)
              .fontSize(12)
              .fontColor(AppColors.TEXT_SUB)
              .maxLines(1)
              .textOverflow({ overflow: TextOverflow.Ellipsis })
            Text(`${userStore().profile.age}岁 · 关注 ${userStore().followingCount()}`)
              .fontSize(11)
              .fontColor(AppColors.TEXT_LIGHT)
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
        .onClick(() => Router.push(AppRoutes.PROFILE))

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
            Text(`${Math.round(musicStore().todayMinutes())}`)
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

        // 设置区：网络状态模拟（四档，演示三种容错态）
        Column() {
          Column({ space: 4 }) {
            Text('网络状态模拟')
              .fontSize(14)
              .fontColor(AppColors.TEXT_MAIN)
              .width('100%')
            Text('用于演示网络请求的加载提示、失败重试与空数据容错（切档后重新进入页面生效）')
              .fontSize(10)
              .fontColor(AppColors.TEXT_SUB)
              .width('100%')
          }
          .alignItems(HorizontalAlign.Start)
          .width('100%')
          .padding({ left: 16, right: 16, top: 12, bottom: 4 })

          Flex({ wrap: FlexWrap.Wrap }) {
            ForEach(this.modeLabels, (label: string, index: number) => {
              Text(label)
                .fontSize(12)
                .fontColor(this.simulateMode === this.modeValues[index] ? Color.White : AppColors.TEXT_MAIN)
                .padding({ left: 14, right: 14, top: 7, bottom: 7 })
                .backgroundColor(this.simulateMode === this.modeValues[index]
                  ? AppColors.PRIMARY : AppColors.BG)
                .borderRadius(15)
                .margin({ right: 10, top: 8, bottom: 8 })
                .onClick(() => this.onSelectMode(index))
            }, (label: string) => label)
          }
          .width('100%')
          .padding({ left: 16, right: 16, bottom: 4 })

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
