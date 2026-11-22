import { AppColors } from '../common/Constants';

/**
 * 页面三态视图组件（网络交互硬性要求：加载中 / 异常 / 空数据）。
 * 三个组件在所有数据页面复用，保证容错体验一致。
 */

/** 加载中 */
@ComponentV2
export struct LoadingView {
  @Param tip: string = '加载中…';

  build() {
    Column({ space: 12 }) {
      LoadingProgress()
        .width(36)
        .height(36)
        .color(AppColors.PRIMARY)
      Text(this.tip)
        .fontSize(13)
        .fontColor(AppColors.TEXT_SUB)
    }
    .width('100%')
    .padding({ top: 48, bottom: 48 })
    .justifyContent(FlexAlign.Center)
  }
}

/** 加载异常（可重试） */
@ComponentV2
export struct ErrorView {
  @Param message: string = '网络异常，请检查网络后重试';
  @Event onRetry: () => void = () => {};

  build() {
    Column({ space: 12 }) {
      SymbolGlyph($r('sys.symbol.exclamationmark_triangle'))
        .fontSize(40)
        .fontColor([AppColors.TEXT_LIGHT])
      Text(this.message)
        .fontSize(13)
        .fontColor(AppColors.TEXT_SUB)
      Button('点击重试')
        .fontSize(13)
        .fontColor(AppColors.PRIMARY)
        .backgroundColor(AppColors.PRIMARY_LIGHT)
        .borderRadius(16)
        .height(34)
        .onClick(() => this.onRetry())
    }
    .width('100%')
    .padding({ top: 48, bottom: 48 })
    .justifyContent(FlexAlign.Center)
  }
}

/** 空数据 */
@ComponentV2
export struct EmptyView {
  @Param tip: string = '暂无数据';
  @Param icon: Resource = $r('sys.symbol.music_note');

  build() {
    Column({ space: 12 }) {
      SymbolGlyph(this.icon)
        .fontSize(40)
        .fontColor([AppColors.TEXT_LIGHT])
      Text(this.tip)
        .fontSize(13)
        .fontColor(AppColors.TEXT_SUB)
    }
    .width('100%')
    .padding({ top: 48, bottom: 48 })
    .justifyContent(FlexAlign.Center)
  }
}
