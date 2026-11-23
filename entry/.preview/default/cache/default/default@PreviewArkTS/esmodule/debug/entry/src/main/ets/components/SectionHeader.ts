if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
import { AppColors } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
export class SectionHeader extends ViewV2 {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda, extraInfo) {
        super(parent, elmtId, extraInfo);
        this.initParam("title", (params && "title" in params) ? params.title : undefined);
        this.initParam("actionText", (params && "actionText" in params) ? params.actionText : '');
        this.onAction = "onAction" in params ? params.onAction : () => { };
        this.finalizeConstruction();
    }
    public resetStateVarsOnReuse(params: Object): void {
        this.resetParam("title", (params && "title" in params) ? params.title : undefined);
        this.resetParam("actionText", (params && "actionText" in params) ? params.actionText : '');
        this.onAction = "onAction" in params ? params.onAction : () => { };
    }
    @Param
    readonly title: string;
    @Param
    readonly actionText: string;
    @Event
    onAction: () => void;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/SectionHeader.ets(13:5)", "entry");
            Row.width('100%');
            Row.padding({ left: 16, right: 16, top: 18, bottom: 10 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 6 });
            Row.debugLine("entry/src/main/ets/components/SectionHeader.ets(14:7)", "entry");
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/SectionHeader.ets(15:9)", "entry");
            Column.width(4);
            Column.height(16);
            Column.backgroundColor(AppColors.PRIMARY);
            Column.borderRadius(2);
        }, Column);
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.title);
            Text.debugLine("entry/src/main/ets/components/SectionHeader.ets(20:9)", "entry");
            Text.fontSize(17);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(AppColors.TEXT_MAIN);
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/components/SectionHeader.ets(25:7)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.actionText.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.actionText);
                        Text.debugLine("entry/src/main/ets/components/SectionHeader.ets(27:9)", "entry");
                        Text.fontSize(12);
                        Text.fontColor(AppColors.TEXT_SUB);
                        Text.padding({ left: 12, right: 12, top: 5, bottom: 5 });
                        Text.border({ width: 1, color: AppColors.DIVIDER, radius: 14 });
                        Text.onClick(() => this.onAction());
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Row.pop();
    }
    public updateStateVars(params) {
        if (params === undefined) {
            return;
        }
        if ("title" in params) {
            this.updateParam("title", params.title);
        }
        if ("actionText" in params) {
            this.updateParam("actionText", params.actionText);
        }
    }
    rerender() {
        this.updateDirtyElements();
    }
}
