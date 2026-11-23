if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
import { AppColors } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
/** 底部导航项定义 */
class TabInfo {
    label: string;
    icon: Resource;
    constructor(label: string, icon: Resource) {
        this.label = label;
        this.icon = icon;
    }
}
export class TabBar extends ViewV2 {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda, extraInfo) {
        super(parent, elmtId, extraInfo);
        this.initParam("currentIndex", (params && "currentIndex" in params) ? params.currentIndex : undefined);
        this.onChange = "onChange" in params ? params.onChange : () => { };
        this.finalizeConstruction();
    }
    public resetStateVarsOnReuse(params: Object): void {
        this.resetParam("currentIndex", (params && "currentIndex" in params) ? params.currentIndex : undefined);
        this.onChange = "onChange" in params ? params.onChange : () => { };
    }
    @Param
    readonly currentIndex: number;
    @Event
    onChange: (index: number) => void;
    private tabs(): TabInfo[] {
        return [
            new TabInfo('发现', { "id": 125831534, "type": 40000, params: [], "bundleName": "com.yunle.music", "moduleName": "entry" }),
            new TabInfo('排行', $r('sys.symbol.chart_bar_fill')),
            new TabInfo('统计', $r('sys.symbol.chart_pie_fill')),
            new TabInfo('我的', { "id": 125832137, "type": 40000, params: [], "bundleName": "com.yunle.music", "moduleName": "entry" })
        ];
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/TabBar.ets(33:5)", "entry");
            Row.width('100%');
            Row.height(56);
            Row.backgroundColor(AppColors.CARD);
            Row.border({ width: { top: 0.5 }, color: AppColors.DIVIDER });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const tab = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create({ space: 2 });
                    Column.debugLine("entry/src/main/ets/components/TabBar.ets(35:9)", "entry");
                    Column.layoutWeight(1);
                    Column.justifyContent(FlexAlign.Center);
                    Column.onClick(() => this.onChange(index));
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    SymbolGlyph.create(tab.icon);
                    SymbolGlyph.debugLine("entry/src/main/ets/components/TabBar.ets(36:11)", "entry");
                    SymbolGlyph.fontSize(22);
                    SymbolGlyph.fontColor(this.currentIndex === index ? [AppColors.PRIMARY] : [AppColors.TEXT_SUB]);
                }, SymbolGlyph);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(tab.label);
                    Text.debugLine("entry/src/main/ets/components/TabBar.ets(39:11)", "entry");
                    Text.fontSize(10);
                    Text.fontColor(this.currentIndex === index ? AppColors.PRIMARY : AppColors.TEXT_SUB);
                }, Text);
                Text.pop();
                Column.pop();
            };
            this.forEachUpdateFunction(elmtId, this.tabs(), forEachItemGenFunction, (tab: TabInfo) => tab.label, true, false);
        }, ForEach);
        ForEach.pop();
        Row.pop();
    }
    public updateStateVars(params) {
        if (params === undefined) {
            return;
        }
        if ("currentIndex" in params) {
            this.updateParam("currentIndex", params.currentIndex);
        }
    }
    rerender() {
        this.updateDirtyElements();
    }
}
