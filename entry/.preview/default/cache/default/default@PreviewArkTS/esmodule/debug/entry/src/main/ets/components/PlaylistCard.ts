if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
import { AppColors } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
import type { Playlist } from '../model/Models';
import { formatCount } from "@normalized:N&&&entry/src/main/ets/utils/Format&";
export class PlaylistCard extends ViewV2 {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda, extraInfo) {
        super(parent, elmtId, extraInfo);
        this.initParam("playlist", (params && "playlist" in params) ? params.playlist : undefined);
        this.onTap = "onTap" in params ? params.onTap : () => { };
        this.finalizeConstruction();
    }
    public resetStateVarsOnReuse(params: Object): void {
        this.resetParam("playlist", (params && "playlist" in params) ? params.playlist : undefined);
        this.onTap = "onTap" in params ? params.onTap : () => { };
    }
    @Param
    readonly playlist: Playlist;
    @Event
    onTap: (playlist: Playlist) => void;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 6 });
            Column.debugLine("entry/src/main/ets/components/PlaylistCard.ets(15:5)", "entry");
            Column.alignItems(HorizontalAlign.Start);
            Column.onClick(() => this.onTap(this.playlist));
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create({ alignContent: Alignment.TopEnd });
            Stack.debugLine("entry/src/main/ets/components/PlaylistCard.ets(16:7)", "entry");
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.playlist.cover);
            Image.debugLine("entry/src/main/ets/components/PlaylistCard.ets(17:9)", "entry");
            Image.width('100%');
            Image.aspectRatio(1);
            Image.borderRadius(10);
            Image.objectFit(ImageFit.Cover);
            Image.alt({ "id": 16777223, "type": 20000, params: [], "bundleName": "com.yunle.music", "moduleName": "entry" });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 3 });
            Row.debugLine("entry/src/main/ets/components/PlaylistCard.ets(23:9)", "entry");
            Row.padding({ left: 8, right: 8, top: 3, bottom: 3 });
            Row.backgroundColor('#66000000');
            Row.borderRadius(10);
            Row.margin({ top: 6, right: 6 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831175, "type": 40000, params: [], "bundleName": "com.yunle.music", "moduleName": "entry" });
            SymbolGlyph.debugLine("entry/src/main/ets/components/PlaylistCard.ets(24:11)", "entry");
            SymbolGlyph.fontSize(10);
            SymbolGlyph.fontColor([Color.White]);
        }, SymbolGlyph);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(formatCount(this.playlist.playCount));
            Text.debugLine("entry/src/main/ets/components/PlaylistCard.ets(27:11)", "entry");
            Text.fontSize(10);
            Text.fontColor(Color.White);
        }, Text);
        Text.pop();
        Row.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.playlist.name);
            Text.debugLine("entry/src/main/ets/components/PlaylistCard.ets(36:7)", "entry");
            Text.fontSize(13);
            Text.fontColor(AppColors.TEXT_MAIN);
            Text.maxLines(2);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.width('100%');
        }, Text);
        Text.pop();
        Column.pop();
    }
    public updateStateVars(params) {
        if (params === undefined) {
            return;
        }
        if ("playlist" in params) {
            this.updateParam("playlist", params.playlist);
        }
    }
    rerender() {
        this.updateDirtyElements();
    }
}
