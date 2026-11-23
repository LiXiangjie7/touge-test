if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
import { AppColors, LoadState } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
import { Router } from "@normalized:N&&&entry/src/main/ets/common/Router&";
import type { Playlist, Song } from '../model/Models';
import { ApiService } from "@normalized:N&&&entry/src/main/ets/network/ApiService&";
import { PlayerController } from "@normalized:N&&&entry/src/main/ets/viewmodel/PlayerStore&";
import { SongListItem } from "@normalized:N&&&entry/src/main/ets/components/SongListItem&";
import { EmptyView, ErrorView, LoadingView } from "@normalized:N&&&entry/src/main/ets/components/StateViews&";
import { formatCount } from "@normalized:N&&&entry/src/main/ets/utils/Format&";
export class PlaylistDetailPage extends ViewV2 {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda, extraInfo) {
        super(parent, elmtId, extraInfo);
        this.initParam("playlist", (params && "playlist" in params) ? params.playlist : undefined);
        this.songs = [];
        this.state = LoadState.LOADING;
        this.finalizeConstruction();
    }
    public resetStateVarsOnReuse(params: Object): void {
        this.resetParam("playlist", (params && "playlist" in params) ? params.playlist : undefined);
        this.songs = [];
        this.state = LoadState.LOADING;
    }
    @Param
    readonly playlist: Playlist;
    @Local
    songs: Song[];
    @Local
    state: LoadState;
    aboutToAppear(): void {
        this.load();
    }
    private load(): void {
        this.state = LoadState.LOADING;
        ApiService.getPlaylistSongs(this.playlist)
            .then((songs: Song[]) => {
            this.songs = songs;
            this.state = songs.length === 0 ? LoadState.EMPTY : LoadState.SUCCESS;
        })
            .catch((e: Object) => {
            console.error(`PlaylistDetailPage load failed: ${String(e)}`);
            this.state = LoadState.ERROR;
        });
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            NavDestination.create(() => {
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Stack.create({ alignContent: Alignment.TopStart });
                    Stack.debugLine("entry/src/main/ets/pages/PlaylistDetailPage.ets(41:7)", "entry");
                    Stack.width('100%');
                    Stack.height('100%');
                    Stack.backgroundColor(AppColors.BG);
                }, Stack);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    // 模糊封面背景
                    Image.create(this.playlist.cover);
                    Image.debugLine("entry/src/main/ets/pages/PlaylistDetailPage.ets(43:9)", "entry");
                    // 模糊封面背景
                    Image.width('100%');
                    // 模糊封面背景
                    Image.height(300);
                    // 模糊封面背景
                    Image.objectFit(ImageFit.Cover);
                    // 模糊封面背景
                    Image.blur(40);
                    // 模糊封面背景
                    Image.brightness(0.65);
                }, Image);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.debugLine("entry/src/main/ets/pages/PlaylistDetailPage.ets(50:9)", "entry");
                    Column.width('100%');
                    Column.height('100%');
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    // 顶部导航行
                    Row.create({ space: 10 });
                    Row.debugLine("entry/src/main/ets/pages/PlaylistDetailPage.ets(52:11)", "entry");
                    // 顶部导航行
                    Row.width('100%');
                    // 顶部导航行
                    Row.padding({ left: 16, right: 16, top: 14 });
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    SymbolGlyph.create({ "id": 125832663, "type": 40000, params: [], "bundleName": "com.yunle.music", "moduleName": "entry" });
                    SymbolGlyph.debugLine("entry/src/main/ets/pages/PlaylistDetailPage.ets(53:13)", "entry");
                    SymbolGlyph.fontSize(20);
                    SymbolGlyph.fontColor([Color.White]);
                    SymbolGlyph.onClick(() => Router.back());
                }, SymbolGlyph);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create('歌单');
                    Text.debugLine("entry/src/main/ets/pages/PlaylistDetailPage.ets(57:13)", "entry");
                    Text.fontSize(17);
                    Text.fontWeight(FontWeight.Medium);
                    Text.fontColor(Color.White);
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Blank.create();
                    Blank.debugLine("entry/src/main/ets/pages/PlaylistDetailPage.ets(61:13)", "entry");
                }, Blank);
                Blank.pop();
                // 顶部导航行
                Row.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    // 歌单信息区
                    Row.create({ space: 14 });
                    Row.debugLine("entry/src/main/ets/pages/PlaylistDetailPage.ets(67:11)", "entry");
                    // 歌单信息区
                    Row.width('100%');
                    // 歌单信息区
                    Row.padding({ left: 16, right: 16, top: 18 });
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Image.create(this.playlist.cover);
                    Image.debugLine("entry/src/main/ets/pages/PlaylistDetailPage.ets(68:13)", "entry");
                    Image.width(118);
                    Image.height(118);
                    Image.borderRadius(10);
                    Image.objectFit(ImageFit.Cover);
                    Image.alt({ "id": 16777223, "type": 20000, params: [], "bundleName": "com.yunle.music", "moduleName": "entry" });
                }, Image);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create({ space: 8 });
                    Column.debugLine("entry/src/main/ets/pages/PlaylistDetailPage.ets(74:13)", "entry");
                    Column.alignItems(HorizontalAlign.Start);
                    Column.layoutWeight(1);
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(this.playlist.name);
                    Text.debugLine("entry/src/main/ets/pages/PlaylistDetailPage.ets(75:15)", "entry");
                    Text.fontSize(17);
                    Text.fontWeight(FontWeight.Bold);
                    Text.fontColor(Color.White);
                    Text.maxLines(2);
                    Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(`by ${this.playlist.creator} · ${formatCount(this.playlist.playCount)}次播放`);
                    Text.debugLine("entry/src/main/ets/pages/PlaylistDetailPage.ets(81:15)", "entry");
                    Text.fontSize(12);
                    Text.fontColor(AppColors.WHITE_60);
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create({ space: 6 });
                    Row.debugLine("entry/src/main/ets/pages/PlaylistDetailPage.ets(84:15)", "entry");
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    ForEach.create();
                    const forEachItemGenFunction = _item => {
                        const tag = _item;
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Text.create(tag);
                            Text.debugLine("entry/src/main/ets/pages/PlaylistDetailPage.ets(86:19)", "entry");
                            Text.fontSize(10);
                            Text.fontColor(Color.White);
                            Text.padding({ left: 8, right: 8, top: 2, bottom: 2 });
                            Text.border({ width: 1, color: AppColors.WHITE_30, radius: 8 });
                        }, Text);
                        Text.pop();
                    };
                    this.forEachUpdateFunction(elmtId, this.playlist.tags, forEachItemGenFunction, (tag: string) => tag, false, false);
                }, ForEach);
                ForEach.pop();
                Row.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(this.playlist.description);
                    Text.debugLine("entry/src/main/ets/pages/PlaylistDetailPage.ets(93:15)", "entry");
                    Text.fontSize(11);
                    Text.fontColor(AppColors.WHITE_60);
                    Text.maxLines(2);
                    Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                }, Text);
                Text.pop();
                Column.pop();
                // 歌单信息区
                Row.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    // 歌曲列表卡片
                    Column.create();
                    Column.debugLine("entry/src/main/ets/pages/PlaylistDetailPage.ets(106:11)", "entry");
                    // 歌曲列表卡片
                    Column.layoutWeight(1);
                    // 歌曲列表卡片
                    Column.width('100%');
                    // 歌曲列表卡片
                    Column.margin({ top: 20 });
                    // 歌曲列表卡片
                    Column.backgroundColor(AppColors.BG);
                    // 歌曲列表卡片
                    Column.borderRadius({ topLeft: 18, topRight: 18 });
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    // 播放全部
                    Row.create({ space: 8 });
                    Row.debugLine("entry/src/main/ets/pages/PlaylistDetailPage.ets(108:13)", "entry");
                    // 播放全部
                    Row.width('100%');
                    // 播放全部
                    Row.padding({ left: 16, right: 16, top: 12, bottom: 8 });
                    // 播放全部
                    Row.onClick(() => {
                        if (this.songs.length > 0) {
                            PlayerController.playSong(this.songs[0], this.songs);
                        }
                    });
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    SymbolGlyph.create({ "id": 125831134, "type": 40000, params: [], "bundleName": "com.yunle.music", "moduleName": "entry" });
                    SymbolGlyph.debugLine("entry/src/main/ets/pages/PlaylistDetailPage.ets(109:15)", "entry");
                    SymbolGlyph.fontSize(24);
                    SymbolGlyph.fontColor([AppColors.PRIMARY]);
                }, SymbolGlyph);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(`播放全部（${this.songs.length}首）`);
                    Text.debugLine("entry/src/main/ets/pages/PlaylistDetailPage.ets(112:15)", "entry");
                    Text.fontSize(15);
                    Text.fontWeight(FontWeight.Medium);
                    Text.fontColor(AppColors.TEXT_MAIN);
                }, Text);
                Text.pop();
                // 播放全部
                Row.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    If.create();
                    if (this.state === LoadState.LOADING) {
                        this.ifElseBranchUpdateFunction(0, () => {
                            {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    if (isInitialRender) {
                                        let componentCall = new LoadingView(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/PlaylistDetailPage.ets", line: 126, col: 15 });
                                        ViewV2.create(componentCall);
                                        let paramsLambda = () => {
                                            return {};
                                        };
                                        componentCall.paramsGenerator_ = paramsLambda;
                                    }
                                    else {
                                        this.updateStateVarsOfChildByElmtId(elmtId, {});
                                    }
                                }, { name: "LoadingView" });
                            }
                        });
                    }
                    else if (this.state === LoadState.ERROR) {
                        this.ifElseBranchUpdateFunction(1, () => {
                            {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    if (isInitialRender) {
                                        let componentCall = new ErrorView(this, { onRetry: (): void => this.load() }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/PlaylistDetailPage.ets", line: 128, col: 15 });
                                        ViewV2.create(componentCall);
                                        let paramsLambda = () => {
                                            return {
                                                onRetry: (): void => this.load()
                                            };
                                        };
                                        componentCall.paramsGenerator_ = paramsLambda;
                                    }
                                    else {
                                        this.updateStateVarsOfChildByElmtId(elmtId, {});
                                    }
                                }, { name: "ErrorView" });
                            }
                        });
                    }
                    else if (this.state === LoadState.EMPTY) {
                        this.ifElseBranchUpdateFunction(2, () => {
                            {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    if (isInitialRender) {
                                        let componentCall = new EmptyView(this, { tip: '这个歌单还没有歌曲' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/PlaylistDetailPage.ets", line: 130, col: 15 });
                                        ViewV2.create(componentCall);
                                        let paramsLambda = () => {
                                            return {
                                                tip: '这个歌单还没有歌曲'
                                            };
                                        };
                                        componentCall.paramsGenerator_ = paramsLambda;
                                    }
                                    else {
                                        this.updateStateVarsOfChildByElmtId(elmtId, {
                                            tip: '这个歌单还没有歌曲'
                                        });
                                    }
                                }, { name: "EmptyView" });
                            }
                        });
                    }
                    else {
                        this.ifElseBranchUpdateFunction(3, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                List.create();
                                List.debugLine("entry/src/main/ets/pages/PlaylistDetailPage.ets(132:15)", "entry");
                                List.layoutWeight(1);
                                List.scrollBar(BarState.Off);
                            }, List);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                ForEach.create();
                                const forEachItemGenFunction = (_item, index: number) => {
                                    const song = _item;
                                    {
                                        const itemCreation = (elmtId, isInitialRender) => {
                                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                            ListItem.create(deepRenderFunction, true);
                                            if (!isInitialRender) {
                                                ListItem.pop();
                                            }
                                            ViewStackProcessor.StopGetAccessRecording();
                                        };
                                        const itemCreation2 = (elmtId, isInitialRender) => {
                                            ListItem.create(deepRenderFunction, true);
                                            ListItem.debugLine("entry/src/main/ets/pages/PlaylistDetailPage.ets(134:19)", "entry");
                                        };
                                        const deepRenderFunction = (elmtId, isInitialRender) => {
                                            itemCreation(elmtId, isInitialRender);
                                            {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    if (isInitialRender) {
                                                        let componentCall = new SongListItem(this, {
                                                            song: song,
                                                            index: index,
                                                            showIndex: true,
                                                            onPlay: (s: Song): void => {
                                                                PlayerController.playSong(s, this.songs);
                                                            }
                                                        }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/PlaylistDetailPage.ets", line: 135, col: 21 });
                                                        ViewV2.create(componentCall);
                                                        let paramsLambda = () => {
                                                            return {
                                                                song: song,
                                                                index: index,
                                                                showIndex: true,
                                                                onPlay: (s: Song): void => {
                                                                    PlayerController.playSong(s, this.songs);
                                                                }
                                                            };
                                                        };
                                                        componentCall.paramsGenerator_ = paramsLambda;
                                                    }
                                                    else {
                                                        this.updateStateVarsOfChildByElmtId(elmtId, {
                                                            song: song,
                                                            index: index,
                                                            showIndex: true
                                                        });
                                                    }
                                                }, { name: "SongListItem" });
                                            }
                                            ListItem.pop();
                                        };
                                        this.observeComponentCreation2(itemCreation2, ListItem);
                                        ListItem.pop();
                                    }
                                };
                                this.forEachUpdateFunction(elmtId, this.songs, forEachItemGenFunction, (song: Song) => song.id.toString(), true, false);
                            }, ForEach);
                            ForEach.pop();
                            List.pop();
                        });
                    }
                }, If);
                If.pop();
                // 歌曲列表卡片
                Column.pop();
                Column.pop();
                Stack.pop();
            }, { moduleName: "entry", pagePath: "entry/src/main/ets/pages/PlaylistDetailPage" });
            NavDestination.hideTitleBar(true);
            NavDestination.debugLine("entry/src/main/ets/pages/PlaylistDetailPage.ets(40:5)", "entry");
        }, NavDestination);
        NavDestination.pop();
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
