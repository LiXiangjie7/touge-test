if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
import { AppColors, AppRoutes } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
import { Router } from "@normalized:N&&&entry/src/main/ets/common/Router&";
import { PlayerController, playerState } from "@normalized:N&&&entry/src/main/ets/viewmodel/PlayerStore&";
export class MiniPlayer extends ViewV2 {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda, extraInfo) {
        super(parent, elmtId, extraInfo);
        this.finalizeConstruction();
    }
    public resetStateVarsOnReuse(params: Object): void {
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (playerState.currentSong !== null) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 10 });
                        Row.debugLine("entry/src/main/ets/components/MiniPlayer.ets(14:7)", "entry");
                        Row.width('100%');
                        Row.height(56);
                        Row.padding({ left: 12, right: 16 });
                        Row.backgroundColor(AppColors.CARD);
                        Row.shadow({ radius: 8, color: '#1A000000', offsetY: -2 });
                        Row.onClick(() => Router.push(AppRoutes.PLAYER));
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create(playerState.currentSong?.cover ?? '');
                        Image.debugLine("entry/src/main/ets/components/MiniPlayer.ets(15:9)", "entry");
                        globalThis.Context.animation({ duration: 12000, curve: Curve.Linear, iterations: -1, playMode: PlayMode.Normal });
                        Image.width(40);
                        Image.height(40);
                        Image.borderRadius(20);
                        Image.objectFit(ImageFit.Cover);
                        Image.alt({ "id": 16777223, "type": 20000, params: [], "bundleName": "com.yunle.music", "moduleName": "entry" });
                        Image.rotate({ angle: playerState.isPlaying ? 360 : 0 });
                        globalThis.Context.animation(null);
                    }, Image);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 2 });
                        Column.debugLine("entry/src/main/ets/components/MiniPlayer.ets(24:9)", "entry");
                        Column.alignItems(HorizontalAlign.Start);
                        Column.layoutWeight(1);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(playerState.currentSong?.name ?? '');
                        Text.debugLine("entry/src/main/ets/components/MiniPlayer.ets(25:11)", "entry");
                        Text.fontSize(14);
                        Text.fontColor(AppColors.TEXT_MAIN);
                        Text.maxLines(1);
                        Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(playerState.currentSong?.artist ?? '');
                        Text.debugLine("entry/src/main/ets/components/MiniPlayer.ets(30:11)", "entry");
                        Text.fontSize(11);
                        Text.fontColor(AppColors.TEXT_SUB);
                        Text.maxLines(1);
                        Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                    }, Text);
                    Text.pop();
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        SymbolGlyph.create(playerState.isPlaying ? { "id": 125834191, "type": 40000, params: [], "bundleName": "com.yunle.music", "moduleName": "entry" } : { "id": 125831175, "type": 40000, params: [], "bundleName": "com.yunle.music", "moduleName": "entry" });
                        SymbolGlyph.debugLine("entry/src/main/ets/components/MiniPlayer.ets(39:9)", "entry");
                        SymbolGlyph.fontSize(26);
                        SymbolGlyph.fontColor([AppColors.PRIMARY]);
                        SymbolGlyph.onClick(() => PlayerController.toggle());
                    }, SymbolGlyph);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        SymbolGlyph.create($r('sys.symbol.forward_fill'));
                        SymbolGlyph.debugLine("entry/src/main/ets/components/MiniPlayer.ets(43:9)", "entry");
                        SymbolGlyph.fontSize(20);
                        SymbolGlyph.fontColor([AppColors.TEXT_SUB]);
                        SymbolGlyph.onClick(() => PlayerController.next());
                    }, SymbolGlyph);
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.debugLine("entry/src/main/ets/components/MiniPlayer.ets(55:7)", "entry");
                        Blank.height(0);
                    }, Blank);
                    Blank.pop();
                });
            }
        }, If);
        If.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
