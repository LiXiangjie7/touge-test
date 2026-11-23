if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
import { AppColors, LoadState } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
import type { RankList, Song } from '../model/Models';
import { ApiService } from "@normalized:N&&&entry/src/main/ets/network/ApiService&";
import { PlayerController } from "@normalized:N&&&entry/src/main/ets/viewmodel/PlayerStore&";
import { SongListItem } from "@normalized:N&&&entry/src/main/ets/components/SongListItem&";
import { EmptyView, ErrorView, LoadingView } from "@normalized:N&&&entry/src/main/ets/components/StateViews&";
export class RankPage extends ViewV2 {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda, extraInfo) {
        super(parent, elmtId, extraInfo);
        this.ranks = [];
        this.pageState = LoadState.LOADING;
        this.currentTab = 0;
        this.songsList = [];
        this.stateList = [];
        this.finalizeConstruction();
    }
    public resetStateVarsOnReuse(params: Object): void {
        this.ranks = [];
        this.pageState = LoadState.LOADING;
        this.currentTab = 0;
        this.songsList = [];
        this.stateList = [];
    }
    @Local
    ranks: RankList[];
    @Local
    pageState: LoadState;
    @Local
    currentTab: number;
    /** 与 ranks 对齐：各榜单歌曲列表（空数组 = 未加载） */
    @Local
    songsList: Song[][];
    /** 与 ranks 对齐：各榜单加载状态 */
    @Local
    stateList: LoadState[];
    aboutToAppear(): void {
        this.loadRanks();
    }
    private loadRanks(): void {
        this.pageState = LoadState.LOADING;
        ApiService.getRanks()
            .then((ranks: RankList[]) => {
            this.ranks = ranks;
            this.pageState = ranks.length === 0 ? LoadState.EMPTY : LoadState.SUCCESS;
            this.songsList = ranks.map((): Song[] => []);
            this.stateList = ranks.map((): LoadState => LoadState.LOADING);
            if (ranks.length > 0) {
                this.loadRankSongs(0);
            }
        })
            .catch((e: Object) => {
            console.error(`RankPage loadRanks failed: ${String(e)}`);
            this.pageState = LoadState.ERROR;
        });
    }
    /** 加载第 index 个榜单的歌曲（已有缓存则跳过） */
    private loadRankSongs(index: number): void {
        if (index < 0 || index >= this.ranks.length) {
            return;
        }
        const cached: Song[] = this.songsList[index] ?? [];
        if (cached.length > 0 || this.stateList[index] === LoadState.EMPTY) {
            return;
        }
        const states: LoadState[] = this.stateList.slice();
        states[index] = LoadState.LOADING;
        this.stateList = states;
        ApiService.getRankSongs(this.ranks[index])
            .then((songs: Song[]) => {
            const newSongs: Song[][] = this.songsList.slice();
            newSongs[index] = songs;
            this.songsList = newSongs;
            const newStates: LoadState[] = this.stateList.slice();
            newStates[index] = songs.length === 0 ? LoadState.EMPTY : LoadState.SUCCESS;
            this.stateList = newStates;
        })
            .catch((e: Object) => {
            console.error(`RankPage loadRankSongs failed: ${String(e)}`);
            const newStates: LoadState[] = this.stateList.slice();
            newStates[index] = LoadState.ERROR;
            this.stateList = newStates;
        });
    }
    /** 重试：清空缓存后重新加载 */
    private retryRank(index: number): void {
        const newSongs: Song[][] = this.songsList.slice();
        newSongs[index] = [];
        this.songsList = newSongs;
        this.loadRankSongs(index);
    }
    RankSongs(index: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.stateList[index] === LoadState.ERROR) {
                this.ifElseBranchUpdateFunction(0, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new ErrorView(this, { onRetry: (): void => this.retryRank(index) }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/RankPage.ets", line: 85, col: 7 });
                                ViewV2.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        onRetry: (): void => this.retryRank(index)
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
            else if (this.stateList[index] === LoadState.EMPTY) {
                this.ifElseBranchUpdateFunction(1, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new EmptyView(this, { tip: '榜单暂无数据' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/RankPage.ets", line: 87, col: 7 });
                                ViewV2.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        tip: '榜单暂无数据'
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    tip: '榜单暂无数据'
                                });
                            }
                        }, { name: "EmptyView" });
                    }
                });
            }
            else if ((this.songsList[index] ?? []).length === 0) {
                this.ifElseBranchUpdateFunction(2, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new LoadingView(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/RankPage.ets", line: 89, col: 7 });
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
            else {
                this.ifElseBranchUpdateFunction(3, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        List.create();
                        List.debugLine("entry/src/main/ets/pages/RankPage.ets(91:7)", "entry");
                        List.layoutWeight(1);
                        List.scrollBar(BarState.Off);
                    }, List);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = (_item, songIndex: number) => {
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
                                    ListItem.debugLine("entry/src/main/ets/pages/RankPage.ets(93:11)", "entry");
                                };
                                const deepRenderFunction = (elmtId, isInitialRender) => {
                                    itemCreation(elmtId, isInitialRender);
                                    {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            if (isInitialRender) {
                                                let componentCall = new SongListItem(this, {
                                                    song: song,
                                                    index: songIndex,
                                                    showIndex: true,
                                                    onPlay: (s: Song): void => {
                                                        PlayerController.playSong(s, this.songsList[index] ?? []);
                                                    }
                                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/RankPage.ets", line: 94, col: 13 });
                                                ViewV2.create(componentCall);
                                                let paramsLambda = () => {
                                                    return {
                                                        song: song,
                                                        index: songIndex,
                                                        showIndex: true,
                                                        onPlay: (s: Song): void => {
                                                            PlayerController.playSong(s, this.songsList[index] ?? []);
                                                        }
                                                    };
                                                };
                                                componentCall.paramsGenerator_ = paramsLambda;
                                            }
                                            else {
                                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                                    song: song,
                                                    index: songIndex,
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
                        this.forEachUpdateFunction(elmtId, this.songsList[index] ?? [], forEachItemGenFunction, (song: Song) => song.id.toString(), true, false);
                    }, ForEach);
                    ForEach.pop();
                    List.pop();
                });
            }
        }, If);
        If.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/RankPage.ets(111:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(AppColors.BG);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('排行榜');
            Text.debugLine("entry/src/main/ets/pages/RankPage.ets(112:7)", "entry");
            Text.fontSize(22);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(AppColors.TEXT_MAIN);
            Text.width('100%');
            Text.padding({ left: 16, top: 12, bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.pageState === LoadState.LOADING) {
                this.ifElseBranchUpdateFunction(0, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new LoadingView(this, { tip: '榜单加载中…' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/RankPage.ets", line: 120, col: 9 });
                                ViewV2.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        tip: '榜单加载中…'
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    tip: '榜单加载中…'
                                });
                            }
                        }, { name: "LoadingView" });
                    }
                });
            }
            else if (this.pageState === LoadState.ERROR) {
                this.ifElseBranchUpdateFunction(1, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new ErrorView(this, { onRetry: (): void => this.loadRanks() }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/RankPage.ets", line: 122, col: 9 });
                                ViewV2.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        onRetry: (): void => this.loadRanks()
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
            else if (this.pageState === LoadState.EMPTY) {
                this.ifElseBranchUpdateFunction(2, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new EmptyView(this, { tip: '暂无榜单' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/RankPage.ets", line: 124, col: 9 });
                                ViewV2.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        tip: '暂无榜单'
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    tip: '暂无榜单'
                                });
                            }
                        }, { name: "EmptyView" });
                    }
                });
            }
            else {
                this.ifElseBranchUpdateFunction(3, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Tabs.create({ index: { value: this.currentTab, changeEvent: newValue => { this.currentTab = newValue; } } });
                        Tabs.debugLine("entry/src/main/ets/pages/RankPage.ets(126:9)", "entry");
                        Tabs.barMode(BarMode.Fixed);
                        Tabs.layoutWeight(1);
                        Tabs.onChange((index: number) => {
                            this.loadRankSongs(index);
                        });
                    }, Tabs);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = (_item, index: number) => {
                            const rank = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                TabContent.create(() => {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Column.create();
                                        Column.debugLine("entry/src/main/ets/pages/RankPage.ets(129:15)", "entry");
                                        Column.layoutWeight(1);
                                    }, Column);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Row.create({ space: 10 });
                                        Row.debugLine("entry/src/main/ets/pages/RankPage.ets(130:17)", "entry");
                                        Row.width('100%');
                                        Row.padding({ left: 16, right: 16, top: 6, bottom: 10 });
                                    }, Row);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Image.create(rank.cover);
                                        Image.debugLine("entry/src/main/ets/pages/RankPage.ets(131:19)", "entry");
                                        Image.width(52);
                                        Image.height(52);
                                        Image.borderRadius(8);
                                        Image.objectFit(ImageFit.Cover);
                                        Image.alt({ "id": 16777223, "type": 20000, params: [], "bundleName": "com.yunle.music", "moduleName": "entry" });
                                    }, Image);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Column.create({ space: 2 });
                                        Column.debugLine("entry/src/main/ets/pages/RankPage.ets(137:19)", "entry");
                                        Column.alignItems(HorizontalAlign.Start);
                                        Column.layoutWeight(1);
                                    }, Column);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(rank.name);
                                        Text.debugLine("entry/src/main/ets/pages/RankPage.ets(138:21)", "entry");
                                        Text.fontSize(16);
                                        Text.fontWeight(FontWeight.Bold);
                                        Text.fontColor(AppColors.TEXT_MAIN);
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(rank.updateTip);
                                        Text.debugLine("entry/src/main/ets/pages/RankPage.ets(142:21)", "entry");
                                        Text.fontSize(11);
                                        Text.fontColor(AppColors.TEXT_SUB);
                                    }, Text);
                                    Text.pop();
                                    Column.pop();
                                    Row.pop();
                                    this.RankSongs.bind(this)(index);
                                    Column.pop();
                                });
                                TabContent.tabBar(rank.name);
                                TabContent.debugLine("entry/src/main/ets/pages/RankPage.ets(128:13)", "entry");
                            }, TabContent);
                            TabContent.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.ranks, forEachItemGenFunction, (rank: RankList) => rank.id.toString(), true, false);
                    }, ForEach);
                    ForEach.pop();
                    Tabs.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
