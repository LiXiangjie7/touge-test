if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
import { AppColors } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
import { Router } from "@normalized:N&&&entry/src/main/ets/common/Router&";
import type { Song } from '../model/Models';
import { LoopMode, PlayerController, playerState } from "@normalized:N&&&entry/src/main/ets/viewmodel/PlayerStore&";
import { musicStore } from "@normalized:N&&&entry/src/main/ets/viewmodel/MusicStore&";
import { msToTime } from "@normalized:N&&&entry/src/main/ets/utils/Format&";
export class PlayerPage extends ViewV2 {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda, extraInfo) {
        super(parent, elmtId, extraInfo);
        this.seeking = false;
        this.seekValue = 0;
        this.finalizeConstruction();
    }
    public resetStateVarsOnReuse(params: Object): void {
        this.seeking = false;
        this.seekValue = 0;
    }
    @Local
    seeking: boolean;
    @Local
    seekValue: number;
    /** 当前应高亮的歌词行（简化：每 4 秒一行） */
    private currentLyricIndex(): number {
        const song: Song | null = playerState.currentSong;
        if (song === null || song.lyric.length === 0) {
            return 0;
        }
        return Math.floor(playerState.position / 4000) % song.lyric.length;
    }
    /** 取相对当前行偏移 offset 的歌词（越界自动回绕，空安全） */
    private lyricAt(offset: number): string {
        const song: Song | null = playerState.currentSong;
        if (song === null || song.lyric.length === 0) {
            return '♪ ♪ ♪';
        }
        const len: number = song.lyric.length;
        const idx: number = ((this.currentLyricIndex() + offset) % len + len) % len;
        return song.lyric[idx];
    }
    private hasLyric(): boolean {
        return playerState.currentSong !== null && (playerState.currentSong?.lyric.length ?? 0) > 0;
    }
    /** 收藏/取消收藏当前歌曲 */
    private toggleFavorite(): void {
        const song: Song | null = playerState.currentSong;
        if (song !== null) {
            musicStore().toggleFavorite(song);
        }
    }
    private modeIcon(): Resource {
        if (playerState.mode === LoopMode.SHUFFLE) {
            return { "id": 125831837, "type": 40000, params: [], "bundleName": "com.yunle.music", "moduleName": "entry" };
        }
        if (playerState.mode === LoopMode.SINGLE) {
            return { "id": 125831132, "type": 40000, params: [], "bundleName": "com.yunle.music", "moduleName": "entry" };
        }
        return { "id": 125831838, "type": 40000, params: [], "bundleName": "com.yunle.music", "moduleName": "entry" };
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            NavDestination.create(() => {
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.debugLine("entry/src/main/ets/pages/PlayerPage.ets(63:7)", "entry");
                    Column.width('100%');
                    Column.height('100%');
                    Column.linearGradient({
                        angle: 180,
                        colors: [[AppColors.PLAYER_BG_TOP, 0.0], [AppColors.PLAYER_BG_BOTTOM, 1.0]]
                    });
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    // 顶部栏
                    Row.create();
                    Row.debugLine("entry/src/main/ets/pages/PlayerPage.ets(65:9)", "entry");
                    // 顶部栏
                    Row.width('100%');
                    // 顶部栏
                    Row.padding({ left: 16, right: 16, top: 14 });
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    SymbolGlyph.create({ "id": 125832666, "type": 40000, params: [], "bundleName": "com.yunle.music", "moduleName": "entry" });
                    SymbolGlyph.debugLine("entry/src/main/ets/pages/PlayerPage.ets(66:11)", "entry");
                    SymbolGlyph.fontSize(22);
                    SymbolGlyph.fontColor([Color.White]);
                    SymbolGlyph.onClick(() => Router.back());
                }, SymbolGlyph);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create({ space: 2 });
                    Column.debugLine("entry/src/main/ets/pages/PlayerPage.ets(70:11)", "entry");
                    Column.alignItems(HorizontalAlign.Center);
                    Column.layoutWeight(1);
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(playerState.currentSong?.name ?? '');
                    Text.debugLine("entry/src/main/ets/pages/PlayerPage.ets(71:13)", "entry");
                    Text.fontSize(16);
                    Text.fontWeight(FontWeight.Medium);
                    Text.fontColor(Color.White);
                    Text.maxLines(1);
                    Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(playerState.currentSong?.artist ?? '');
                    Text.debugLine("entry/src/main/ets/pages/PlayerPage.ets(77:13)", "entry");
                    Text.fontSize(12);
                    Text.fontColor(AppColors.WHITE_60);
                    Text.maxLines(1);
                    Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                }, Text);
                Text.pop();
                Column.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Blank.create();
                    Blank.debugLine("entry/src/main/ets/pages/PlayerPage.ets(85:11)", "entry");
                    Blank.width(22);
                }, Blank);
                Blank.pop();
                // 顶部栏
                Row.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Blank.create();
                    Blank.debugLine("entry/src/main/ets/pages/PlayerPage.ets(90:9)", "entry");
                    Blank.layoutWeight(1);
                }, Blank);
                Blank.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    // 旋转封面（黑胶唱片样式）
                    Stack.create();
                    Stack.debugLine("entry/src/main/ets/pages/PlayerPage.ets(93:9)", "entry");
                    globalThis.Context.animation({ duration: 20000, curve: Curve.Linear, iterations: -1, playMode: PlayMode.Normal });
                    // 旋转封面（黑胶唱片样式）
                    Stack.rotate({ angle: playerState.isPlaying ? 360 : 0 });
                    globalThis.Context.animation(null);
                }, Stack);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Circle.create({ width: 250, height: 250 });
                    Circle.debugLine("entry/src/main/ets/pages/PlayerPage.ets(94:11)", "entry");
                    Circle.fill('#141414');
                }, Circle);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Circle.create({ width: 244, height: 244 });
                    Circle.debugLine("entry/src/main/ets/pages/PlayerPage.ets(96:11)", "entry");
                    Circle.fill('#222226');
                }, Circle);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Image.create(playerState.currentSong?.cover ?? '');
                    Image.debugLine("entry/src/main/ets/pages/PlayerPage.ets(98:11)", "entry");
                    Image.width(168);
                    Image.height(168);
                    Image.borderRadius(84);
                    Image.objectFit(ImageFit.Cover);
                    Image.alt({ "id": 16777223, "type": 20000, params: [], "bundleName": "com.yunle.music", "moduleName": "entry" });
                }, Image);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Circle.create({ width: 20, height: 20 });
                    Circle.debugLine("entry/src/main/ets/pages/PlayerPage.ets(104:11)", "entry");
                    Circle.fill(AppColors.PLAYER_BG_BOTTOM);
                }, Circle);
                // 旋转封面（黑胶唱片样式）
                Stack.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Blank.create();
                    Blank.debugLine("entry/src/main/ets/pages/PlayerPage.ets(110:9)", "entry");
                    Blank.layoutWeight(1);
                }, Blank);
                Blank.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    // 简化歌词区：三行视图，当前行高亮
                    Column.create({ space: 6 });
                    Column.debugLine("entry/src/main/ets/pages/PlayerPage.ets(113:9)", "entry");
                    // 简化歌词区：三行视图，当前行高亮
                    Column.width('100%');
                    // 简化歌词区：三行视图，当前行高亮
                    Column.padding({ bottom: 20 });
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    If.create();
                    if (this.hasLyric()) {
                        this.ifElseBranchUpdateFunction(0, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(this.lyricAt(-1));
                                Text.debugLine("entry/src/main/ets/pages/PlayerPage.ets(115:13)", "entry");
                                Text.fontSize(13);
                                Text.fontColor(AppColors.WHITE_30);
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(this.lyricAt(0));
                                Text.debugLine("entry/src/main/ets/pages/PlayerPage.ets(118:13)", "entry");
                                Text.fontSize(15);
                                Text.fontColor(Color.White);
                                Text.fontWeight(FontWeight.Medium);
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(this.lyricAt(1));
                                Text.debugLine("entry/src/main/ets/pages/PlayerPage.ets(122:13)", "entry");
                                Text.fontSize(13);
                                Text.fontColor(AppColors.WHITE_30);
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
                // 简化歌词区：三行视图，当前行高亮
                Column.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    // 进度条
                    Row.create({ space: 8 });
                    Row.debugLine("entry/src/main/ets/pages/PlayerPage.ets(131:9)", "entry");
                    // 进度条
                    Row.width('100%');
                    // 进度条
                    Row.padding({ left: 16, right: 16 });
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(msToTime(playerState.position));
                    Text.debugLine("entry/src/main/ets/pages/PlayerPage.ets(132:11)", "entry");
                    Text.fontSize(11);
                    Text.fontColor(AppColors.WHITE_60);
                    Text.width(40);
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Slider.create({
                        value: this.seeking ? this.seekValue : playerState.position,
                        min: 0,
                        max: Math.max(playerState.duration, 1),
                        step: 500,
                        style: SliderStyle.OutSet
                    });
                    Slider.debugLine("entry/src/main/ets/pages/PlayerPage.ets(136:11)", "entry");
                    Slider.layoutWeight(1);
                    Slider.blockColor(AppColors.PRIMARY);
                    Slider.trackColor(AppColors.WHITE_30);
                    Slider.selectedColor(AppColors.PRIMARY);
                    Slider.onChange((value: number, mode: SliderChangeMode) => {
                        if (mode === SliderChangeMode.Begin) {
                            this.seeking = true;
                            this.seekValue = value;
                        }
                        else if (mode === SliderChangeMode.Moving) {
                            this.seekValue = value;
                            playerState.position = value;
                        }
                        else {
                            PlayerController.seekTo(value);
                            this.seeking = false;
                        }
                    });
                }, Slider);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(msToTime(playerState.duration));
                    Text.debugLine("entry/src/main/ets/pages/PlayerPage.ets(159:11)", "entry");
                    Text.fontSize(11);
                    Text.fontColor(AppColors.WHITE_60);
                    Text.width(40);
                }, Text);
                Text.pop();
                // 进度条
                Row.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    // 播放控制区
                    Row.create();
                    Row.debugLine("entry/src/main/ets/pages/PlayerPage.ets(168:9)", "entry");
                    // 播放控制区
                    Row.width('100%');
                    // 播放控制区
                    Row.padding({ left: 24, right: 24, top: 10, bottom: 30 });
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    SymbolGlyph.create(this.modeIcon());
                    SymbolGlyph.debugLine("entry/src/main/ets/pages/PlayerPage.ets(169:11)", "entry");
                    SymbolGlyph.fontSize(22);
                    SymbolGlyph.fontColor([Color.White]);
                    SymbolGlyph.onClick(() => PlayerController.switchMode());
                    SymbolGlyph.layoutWeight(1);
                }, SymbolGlyph);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    SymbolGlyph.create({ "id": 125833856, "type": 40000, params: [], "bundleName": "com.yunle.music", "moduleName": "entry" });
                    SymbolGlyph.debugLine("entry/src/main/ets/pages/PlayerPage.ets(174:11)", "entry");
                    SymbolGlyph.fontSize(30);
                    SymbolGlyph.fontColor([Color.White]);
                    SymbolGlyph.onClick(() => PlayerController.prev());
                    SymbolGlyph.layoutWeight(1);
                }, SymbolGlyph);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Stack.create();
                    Stack.debugLine("entry/src/main/ets/pages/PlayerPage.ets(179:11)", "entry");
                    Stack.layoutWeight(1);
                    Stack.onClick(() => PlayerController.toggle());
                }, Stack);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Circle.create({ width: 62, height: 62 });
                    Circle.debugLine("entry/src/main/ets/pages/PlayerPage.ets(180:13)", "entry");
                    Circle.fill(AppColors.PRIMARY);
                }, Circle);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    If.create();
                    if (playerState.isLoading) {
                        this.ifElseBranchUpdateFunction(0, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                LoadingProgress.create();
                                LoadingProgress.debugLine("entry/src/main/ets/pages/PlayerPage.ets(183:15)", "entry");
                                LoadingProgress.width(26);
                                LoadingProgress.height(26);
                                LoadingProgress.color(Color.White);
                            }, LoadingProgress);
                        });
                    }
                    else {
                        this.ifElseBranchUpdateFunction(1, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                SymbolGlyph.create(playerState.isPlaying ? { "id": 125834191, "type": 40000, params: [], "bundleName": "com.yunle.music", "moduleName": "entry" } : { "id": 125831175, "type": 40000, params: [], "bundleName": "com.yunle.music", "moduleName": "entry" });
                                SymbolGlyph.debugLine("entry/src/main/ets/pages/PlayerPage.ets(188:15)", "entry");
                                SymbolGlyph.fontSize(30);
                                SymbolGlyph.fontColor([Color.White]);
                            }, SymbolGlyph);
                        });
                    }
                }, If);
                If.pop();
                Stack.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    SymbolGlyph.create($r('sys.symbol.forward_fill'));
                    SymbolGlyph.debugLine("entry/src/main/ets/pages/PlayerPage.ets(195:11)", "entry");
                    SymbolGlyph.fontSize(30);
                    SymbolGlyph.fontColor([Color.White]);
                    SymbolGlyph.onClick(() => PlayerController.next());
                    SymbolGlyph.layoutWeight(1);
                }, SymbolGlyph);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    SymbolGlyph.create(playerState.currentSong !== null && musicStore().isFavorite(playerState.currentSong.id)
                        ? { "id": 125831545, "type": 40000, params: [], "bundleName": "com.yunle.music", "moduleName": "entry" } : { "id": 125831544, "type": 40000, params: [], "bundleName": "com.yunle.music", "moduleName": "entry" });
                    SymbolGlyph.debugLine("entry/src/main/ets/pages/PlayerPage.ets(200:11)", "entry");
                    SymbolGlyph.fontSize(22);
                    SymbolGlyph.fontColor(playerState.currentSong !== null && musicStore().isFavorite(playerState.currentSong.id)
                        ? [AppColors.PRIMARY]
                        : [Color.White]);
                    SymbolGlyph.onClick(() => this.toggleFavorite());
                    SymbolGlyph.layoutWeight(1);
                }, SymbolGlyph);
                // 播放控制区
                Row.pop();
                Column.pop();
            }, { moduleName: "entry", pagePath: "entry/src/main/ets/pages/PlayerPage" });
            NavDestination.hideTitleBar(true);
            NavDestination.debugLine("entry/src/main/ets/pages/PlayerPage.ets(62:5)", "entry");
        }, NavDestination);
        NavDestination.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
