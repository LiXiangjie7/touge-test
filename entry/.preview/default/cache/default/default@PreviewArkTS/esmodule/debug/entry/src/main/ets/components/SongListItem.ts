if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
import { AppColors } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
import type { Song } from '../model/Models';
import { playerState } from "@normalized:N&&&entry/src/main/ets/viewmodel/PlayerStore&";
import { musicStore } from "@normalized:N&&&entry/src/main/ets/viewmodel/MusicStore&";
export class SongListItem extends ViewV2 {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda, extraInfo) {
        super(parent, elmtId, extraInfo);
        this.initParam("song", (params && "song" in params) ? params.song : undefined);
        this.initParam("index", (params && "index" in params) ? params.index : 0);
        this.initParam("showIndex", (params && "showIndex" in params) ? params.showIndex : false);
        this.onPlay = "onPlay" in params ? params.onPlay : () => { };
        this.finalizeConstruction();
    }
    public resetStateVarsOnReuse(params: Object): void {
        this.resetParam("song", (params && "song" in params) ? params.song : undefined);
        this.resetParam("index", (params && "index" in params) ? params.index : 0);
        this.resetParam("showIndex", (params && "showIndex" in params) ? params.showIndex : false);
        this.onPlay = "onPlay" in params ? params.onPlay : () => { };
    }
    @Param
    readonly song: Song;
    @Param
    readonly index: number;
    @Param
    readonly showIndex: boolean;
    /** 点击播放回调（由父组件决定播放队列上下文） */
    @Event
    onPlay: (song: Song) => void;
    private isPlayingThis(): boolean {
        return playerState.currentSong !== null && playerState.currentSong.id === this.song.id;
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 10 });
            Row.debugLine("entry/src/main/ets/components/SongListItem.ets(24:5)", "entry");
            Row.width('100%');
            Row.padding({ left: 16, right: 16, top: 8, bottom: 8 });
            Row.backgroundColor(AppColors.CARD);
            Row.onClick(() => this.onPlay(this.song));
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.showIndex) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`${this.index + 1}`);
                        Text.debugLine("entry/src/main/ets/components/SongListItem.ets(26:9)", "entry");
                        Text.fontSize(15);
                        Text.fontWeight(this.index < 3 ? FontWeight.Bold : FontWeight.Normal);
                        Text.fontColor(this.index < 3 ? AppColors.PRIMARY : AppColors.TEXT_SUB);
                        Text.width(26);
                        Text.textAlign(TextAlign.Center);
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
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.song.cover);
            Image.debugLine("entry/src/main/ets/components/SongListItem.ets(33:7)", "entry");
            Image.width(46);
            Image.height(46);
            Image.borderRadius(8);
            Image.objectFit(ImageFit.Cover);
            Image.alt({ "id": 16777223, "type": 20000, params: [], "bundleName": "com.yunle.music", "moduleName": "entry" });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 3 });
            Column.debugLine("entry/src/main/ets/components/SongListItem.ets(39:7)", "entry");
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.song.name);
            Text.debugLine("entry/src/main/ets/components/SongListItem.ets(40:9)", "entry");
            Text.fontSize(15);
            Text.fontColor(this.isPlayingThis() ? AppColors.PRIMARY : AppColors.TEXT_MAIN);
            Text.fontWeight(this.isPlayingThis() ? FontWeight.Medium : FontWeight.Normal);
            Text.maxLines(1);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.song.artist} · ${this.song.album}`);
            Text.debugLine("entry/src/main/ets/components/SongListItem.ets(46:9)", "entry");
            Text.fontSize(12);
            Text.fontColor(AppColors.TEXT_SUB);
            Text.maxLines(1);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isPlayingThis()) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        SymbolGlyph.create($r('sys.symbol.music_note'));
                        SymbolGlyph.debugLine("entry/src/main/ets/components/SongListItem.ets(56:9)", "entry");
                        SymbolGlyph.fontSize(16);
                        SymbolGlyph.fontColor([AppColors.PRIMARY]);
                    }, SymbolGlyph);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create(musicStore().isFavorite(this.song.id)
                ? { "id": 125831545, "type": 40000, params: [], "bundleName": "com.yunle.music", "moduleName": "entry" } : { "id": 125831544, "type": 40000, params: [], "bundleName": "com.yunle.music", "moduleName": "entry" });
            SymbolGlyph.debugLine("entry/src/main/ets/components/SongListItem.ets(60:7)", "entry");
            SymbolGlyph.fontSize(18);
            SymbolGlyph.fontColor(musicStore().isFavorite(this.song.id)
                ? [AppColors.PRIMARY]
                : [AppColors.TEXT_LIGHT]);
            SymbolGlyph.onClick(() => musicStore().toggleFavorite(this.song));
        }, SymbolGlyph);
        Row.pop();
    }
    public updateStateVars(params) {
        if (params === undefined) {
            return;
        }
        if ("song" in params) {
            this.updateParam("song", params.song);
        }
        if ("index" in params) {
            this.updateParam("index", params.index);
        }
        if ("showIndex" in params) {
            this.updateParam("showIndex", params.showIndex);
        }
    }
    rerender() {
        this.updateDirtyElements();
    }
}
