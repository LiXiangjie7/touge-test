if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
import { AppColors } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
export class LoadingView extends ViewV2 {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda, extraInfo) {
        super(parent, elmtId, extraInfo);
        this.initParam("tip", (params && "tip" in params) ? params.tip : '加载中…');
        this.finalizeConstruction();
    }
    public resetStateVarsOnReuse(params: Object): void {
        this.resetParam("tip", (params && "tip" in params) ? params.tip : '加载中…');
    }
    @Param
    readonly tip: string;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 12 });
            Column.debugLine("entry/src/main/ets/components/StateViews.ets(14:5)", "entry");
            Column.width('100%');
            Column.padding({ top: 48, bottom: 48 });
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            LoadingProgress.create();
            LoadingProgress.debugLine("entry/src/main/ets/components/StateViews.ets(15:7)", "entry");
            LoadingProgress.width(36);
            LoadingProgress.height(36);
            LoadingProgress.color(AppColors.PRIMARY);
        }, LoadingProgress);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.tip);
            Text.debugLine("entry/src/main/ets/components/StateViews.ets(19:7)", "entry");
            Text.fontSize(13);
            Text.fontColor(AppColors.TEXT_SUB);
        }, Text);
        Text.pop();
        Column.pop();
    }
    public updateStateVars(params) {
        if (params === undefined) {
            return;
        }
        if ("tip" in params) {
            this.updateParam("tip", params.tip);
        }
    }
    rerender() {
        this.updateDirtyElements();
    }
}
export class ErrorView extends ViewV2 {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda, extraInfo) {
        super(parent, elmtId, extraInfo);
        this.initParam("message", (params && "message" in params) ? params.message : '网络异常，请检查网络后重试');
        this.onRetry = "onRetry" in params ? params.onRetry : () => { };
        this.finalizeConstruction();
    }
    public resetStateVarsOnReuse(params: Object): void {
        this.resetParam("message", (params && "message" in params) ? params.message : '网络异常，请检查网络后重试');
        this.onRetry = "onRetry" in params ? params.onRetry : () => { };
    }
    @Param
    readonly message: string;
    @Event
    onRetry: () => void;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 12 });
            Column.debugLine("entry/src/main/ets/components/StateViews.ets(36:5)", "entry");
            Column.width('100%');
            Column.padding({ top: 48, bottom: 48 });
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125832652, "type": 40000, params: [], "bundleName": "com.yunle.music", "moduleName": "entry" });
            SymbolGlyph.debugLine("entry/src/main/ets/components/StateViews.ets(37:7)", "entry");
            SymbolGlyph.fontSize(40);
            SymbolGlyph.fontColor([AppColors.TEXT_LIGHT]);
        }, SymbolGlyph);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.message);
            Text.debugLine("entry/src/main/ets/components/StateViews.ets(40:7)", "entry");
            Text.fontSize(13);
            Text.fontColor(AppColors.TEXT_SUB);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('点击重试');
            Button.debugLine("entry/src/main/ets/components/StateViews.ets(43:7)", "entry");
            Button.fontSize(13);
            Button.fontColor(AppColors.PRIMARY);
            Button.backgroundColor(AppColors.PRIMARY_LIGHT);
            Button.borderRadius(16);
            Button.height(34);
            Button.onClick(() => this.onRetry());
        }, Button);
        Button.pop();
        Column.pop();
    }
    public updateStateVars(params) {
        if (params === undefined) {
            return;
        }
        if ("message" in params) {
            this.updateParam("message", params.message);
        }
    }
    rerender() {
        this.updateDirtyElements();
    }
}
export class EmptyView extends ViewV2 {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda, extraInfo) {
        super(parent, elmtId, extraInfo);
        this.initParam("tip", (params && "tip" in params) ? params.tip : '暂无数据');
        this.initParam("icon", (params && "icon" in params) ? params.icon : $r('sys.symbol.music_note'));
        this.finalizeConstruction();
    }
    public resetStateVarsOnReuse(params: Object): void {
        this.resetParam("tip", (params && "tip" in params) ? params.tip : '暂无数据');
        this.resetParam("icon", (params && "icon" in params) ? params.icon : $r('sys.symbol.music_note'));
    }
    @Param
    readonly tip: string;
    @Param
    readonly icon: Resource;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 12 });
            Column.debugLine("entry/src/main/ets/components/StateViews.ets(64:5)", "entry");
            Column.width('100%');
            Column.padding({ top: 48, bottom: 48 });
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create(this.icon);
            SymbolGlyph.debugLine("entry/src/main/ets/components/StateViews.ets(65:7)", "entry");
            SymbolGlyph.fontSize(40);
            SymbolGlyph.fontColor([AppColors.TEXT_LIGHT]);
        }, SymbolGlyph);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.tip);
            Text.debugLine("entry/src/main/ets/components/StateViews.ets(68:7)", "entry");
            Text.fontSize(13);
            Text.fontColor(AppColors.TEXT_SUB);
        }, Text);
        Text.pop();
        Column.pop();
    }
    public updateStateVars(params) {
        if (params === undefined) {
            return;
        }
        if ("tip" in params) {
            this.updateParam("tip", params.tip);
        }
        if ("icon" in params) {
            this.updateParam("icon", params.icon);
        }
    }
    rerender() {
        this.updateDirtyElements();
    }
}
