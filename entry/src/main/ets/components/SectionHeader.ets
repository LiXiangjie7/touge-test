import { AppColors } from '../common/Constants';

/**
 * 可复用自定义组件：章节标题栏（标题 + 可选"更多"入口）。
 */
@ComponentV2
export struct SectionHeader {
  @Require @Param title: string;
  @Param actionText: string = '';
  @Event onAction: () => void = () => {};

  build() {
    Row() {
      Row({ space: 6 }) {
        Column()
          .width(4)
          .height(16)
          .backgroundColor(AppColors.PRIMARY)
          .borderRadius(2)
        Text(this.title)
          .fontSize(17)
          .fontWeight(FontWeight.Bold)
          .fontColor(AppColors.TEXT_MAIN)
      }
      Blank()
      if (this.actionText.length > 0) {
        Text(this.actionText)
          .fontSize(12)
          .fontColor(AppColors.TEXT_SUB)
          .padding({ left: 12, right: 12, top: 5, bottom: 5 })
          .border({ width: 1, color: AppColors.DIVIDER, radius: 14 })
          .onClick(() => this.onAction())
      }
    }
    .width('100%')
    .padding({ left: 16, right: 16, top: 18, bottom: 10 })
  }
}
