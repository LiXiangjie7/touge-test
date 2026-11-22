import { AppColors } from '../common/Constants';

/** 底部导航项定义 */
class TabInfo {
  label: string;
  icon: Resource;

  constructor(label: string, icon: Resource) {
    this.label = label;
    this.icon = icon;
  }
}

/**
 * 可复用自定义组件：底部导航栏。
 * 发现 / 排行 / 统计 / 我的 四个主 Tab。
 */
@ComponentV2
export struct TabBar {
  @Require @Param currentIndex: number;
  @Event onChange: (index: number) => void = () => {};

  private tabs(): TabInfo[] {
    return [
      new TabInfo('发现', $r('sys.symbol.house_fill')),
      new TabInfo('排行', $r('sys.symbol.chart_bar_fill')),
      new TabInfo('统计', $r('sys.symbol.chart_pie_fill')),
      new TabInfo('我的', $r('sys.symbol.person_crop_circle_fill'))
    ];
  }

  build() {
    Row() {
      ForEach(this.tabs(), (tab: TabInfo, index: number) => {
        Column({ space: 2 }) {
          SymbolGlyph(tab.icon)
            .fontSize(22)
            .fontColor(this.currentIndex === index ? [AppColors.PRIMARY] : [AppColors.TEXT_SUB])
          Text(tab.label)
            .fontSize(10)
            .fontColor(this.currentIndex === index ? AppColors.PRIMARY : AppColors.TEXT_SUB)
        }
        .layoutWeight(1)
        .justifyContent(FlexAlign.Center)
        .onClick(() => this.onChange(index))
      }, (tab: TabInfo) => tab.label)
    }
    .width('100%')
    .height(56)
    .backgroundColor(AppColors.CARD)
    .border({ width: { top: 0.5 }, color: AppColors.DIVIDER })
  }
}
