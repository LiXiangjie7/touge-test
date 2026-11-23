if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
import { AppColors, LoadState } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
import { Router } from "@normalized:N&&&entry/src/main/ets/common/Router&";
import type { HotSearch, Song } from '../model/Models';
import { ApiService } from "@normalized:N&&&entry/src/main/ets/network/ApiService&";
import { PlayerController } from "@normalized:N&&&entry/src/main/ets/viewmodel/PlayerStore&";
import { SongListItem } from "@normalized:N&&&entry/src/main/ets/components/SongListItem&";
import { EmptyView, ErrorView, LoadingView } from "@normalized:N&&&entry/src/main/ets/components/StateViews&";
import { formatCount } from "@normalized:N&&&entry/src/main/ets/utils/Format&";
export class SearchPage extends ViewV2 {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda, extraInfo) {
        super(parent, elmtId, extraInfo);
        this.keyword = '';
        this.hotList = [];
        this.results = null;
        this.state = LoadState.SUCCESS;
        this.hotState = LoadState.LOADING;
        this.finalizeConstruction();
    }
    public resetStateVarsOnReuse(params: Object): void {
        this.keyword = '';
        this.hotList = [];
        this.results = null;
        this.state = LoadState.SUCCESS;
        this.hotState = LoadState.LOADING;
    }
    @Local
    keyword: string;
    @Local
    hotList: HotSearch[];
    @Local
    results: Song[] | null; // null = 未搜索（展示热搜）
    @Local
    state: LoadState;
    @Local
    hotState: LoadState;
    aboutToAppear(): void {
        ApiService.getHotSearch()
            .then((list: HotSearch[]) => {
            this.hotList = list;
            this.hotState = list.length === 0 ? LoadState.EMPTY : LoadState.SUCCESS;
        })
            .catch(() => {
            this.hotState = LoadState.ERROR;
        });
    }
    private doSearch(keyword: string): void {
        const kw: string = keyword.trim();
        if (kw.length === 0) {
            return;
        }
        this.keyword = kw;
        this.state = LoadState.LOADING;
        this.results = [];
        ApiService.searchSongs(kw)
            .then((songs: Song[]) => {
            this.results = songs;
            this.state = songs.length === 0 ? LoadState.EMPTY : LoadState.SUCCESS;
        })
            .catch((e: Object) => {
            console.error(`SearchPage doSearch failed: ${String(e)}`);
            this.state = LoadState.ERROR;
        });
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            NavDestination.create(() => {
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.debugLine("entry/src/main/ets/pages/SearchPage.ets(55:7)", "entry");
                    Column.width('100%');
                    Column.height('100%');
                    Column.backgroundColor(AppColors.BG);
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    // 搜索栏
                    Row.create({ space: 10 });
                    Row.debugLine("entry/src/main/ets/pages/SearchPage.ets(57:9)", "entry");
                    // 搜索栏
                    Row.width('100%');
                    // 搜索栏
                    Row.padding({ left: 16, right: 16, top: 12, bottom: 8 });
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    SymbolGlyph.create({ "id": 125832663, "type": 40000, params: [], "bundleName": "com.yunle.music", "moduleName": "entry" });
                    SymbolGlyph.debugLine("entry/src/main/ets/pages/SearchPage.ets(58:11)", "entry");
                    SymbolGlyph.fontSize(20);
                    SymbolGlyph.fontColor([AppColors.TEXT_MAIN]);
                    SymbolGlyph.onClick(() => Router.back());
                }, SymbolGlyph);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    TextInput.create({ text: { value: this.keyword, changeEvent: newValue => { this.keyword = newValue; } }, placeholder: '搜索歌曲 / 歌手 / 歌单' });
                    TextInput.debugLine("entry/src/main/ets/pages/SearchPage.ets(62:11)", "entry");
                    TextInput.layoutWeight(1);
                    TextInput.height(38);
                    TextInput.fontSize(14);
                    TextInput.backgroundColor(AppColors.CARD);
                    TextInput.borderRadius(19);
                    TextInput.onSubmit(() => this.doSearch(this.keyword));
                }, TextInput);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithLabel('搜索');
                    Button.debugLine("entry/src/main/ets/pages/SearchPage.ets(69:11)", "entry");
                    Button.fontSize(14);
                    Button.fontColor(Color.White);
                    Button.backgroundColor(AppColors.PRIMARY);
                    Button.borderRadius(19);
                    Button.height(38);
                    Button.onClick(() => this.doSearch(this.keyword));
                }, Button);
                Button.pop();
                // 搜索栏
                Row.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    If.create();
                    if (this.results === null) {
                        this.ifElseBranchUpdateFunction(0, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                If.create();
                                // 热搜榜
                                if (this.hotState === LoadState.LOADING) {
                                    this.ifElseBranchUpdateFunction(0, () => {
                                        {
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                if (isInitialRender) {
                                                    let componentCall = new LoadingView(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/SearchPage.ets", line: 83, col: 13 });
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
                                else if (this.hotState === LoadState.ERROR) {
                                    this.ifElseBranchUpdateFunction(1, () => {
                                        {
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                if (isInitialRender) {
                                                    let componentCall = new ErrorView(this, { message: '热搜加载失败', onRetry: (): void => this.aboutToAppear() }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/SearchPage.ets", line: 85, col: 13 });
                                                    ViewV2.create(componentCall);
                                                    let paramsLambda = () => {
                                                        return {
                                                            message: '热搜加载失败',
                                                            onRetry: (): void => this.aboutToAppear()
                                                        };
                                                    };
                                                    componentCall.paramsGenerator_ = paramsLambda;
                                                }
                                                else {
                                                    this.updateStateVarsOfChildByElmtId(elmtId, {
                                                        message: '热搜加载失败'
                                                    });
                                                }
                                            }, { name: "ErrorView" });
                                        }
                                    });
                                }
                                else if (this.hotState === LoadState.EMPTY) {
                                    this.ifElseBranchUpdateFunction(2, () => {
                                        {
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                if (isInitialRender) {
                                                    let componentCall = new EmptyView(this, { tip: '暂无热搜' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/SearchPage.ets", line: 87, col: 13 });
                                                    ViewV2.create(componentCall);
                                                    let paramsLambda = () => {
                                                        return {
                                                            tip: '暂无热搜'
                                                        };
                                                    };
                                                    componentCall.paramsGenerator_ = paramsLambda;
                                                }
                                                else {
                                                    this.updateStateVarsOfChildByElmtId(elmtId, {
                                                        tip: '暂无热搜'
                                                    });
                                                }
                                            }, { name: "EmptyView" });
                                        }
                                    });
                                }
                                else {
                                    this.ifElseBranchUpdateFunction(3, () => {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Scroll.create();
                                            Scroll.debugLine("entry/src/main/ets/pages/SearchPage.ets(89:13)", "entry");
                                            Scroll.scrollBar(BarState.Off);
                                            Scroll.layoutWeight(1);
                                        }, Scroll);
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Column.create({ space: 14 });
                                            Column.debugLine("entry/src/main/ets/pages/SearchPage.ets(90:15)", "entry");
                                            Column.alignItems(HorizontalAlign.Start);
                                            Column.padding({ left: 16, right: 16 });
                                        }, Column);
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create('热搜榜');
                                            Text.debugLine("entry/src/main/ets/pages/SearchPage.ets(91:17)", "entry");
                                            Text.fontSize(17);
                                            Text.fontWeight(FontWeight.Bold);
                                            Text.fontColor(AppColors.TEXT_MAIN);
                                            Text.width('100%');
                                            Text.padding({ top: 8 });
                                        }, Text);
                                        Text.pop();
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Flex.create({ wrap: FlexWrap.Wrap });
                                            Flex.debugLine("entry/src/main/ets/pages/SearchPage.ets(97:17)", "entry");
                                            Flex.width('100%');
                                        }, Flex);
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            ForEach.create();
                                            const forEachItemGenFunction = (_item, index: number) => {
                                                const item = _item;
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Row.create({ space: 4 });
                                                    Row.debugLine("entry/src/main/ets/pages/SearchPage.ets(99:21)", "entry");
                                                    Row.padding({ left: 12, right: 12, top: 7, bottom: 7 });
                                                    Row.backgroundColor(AppColors.CARD);
                                                    Row.borderRadius(16);
                                                    Row.margin({ right: 10, bottom: 10 });
                                                    Row.onClick(() => this.doSearch(item.keyword));
                                                }, Row);
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Text.create(`${index + 1}`);
                                                    Text.debugLine("entry/src/main/ets/pages/SearchPage.ets(100:23)", "entry");
                                                    Text.fontSize(11);
                                                    Text.fontColor(index < 3 ? AppColors.PRIMARY : AppColors.TEXT_SUB);
                                                }, Text);
                                                Text.pop();
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Text.create(item.keyword);
                                                    Text.debugLine("entry/src/main/ets/pages/SearchPage.ets(103:23)", "entry");
                                                    Text.fontSize(13);
                                                    Text.fontColor(AppColors.TEXT_MAIN);
                                                }, Text);
                                                Text.pop();
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Text.create(formatCount(item.score));
                                                    Text.debugLine("entry/src/main/ets/pages/SearchPage.ets(106:23)", "entry");
                                                    Text.fontSize(10);
                                                    Text.fontColor(AppColors.TEXT_LIGHT);
                                                }, Text);
                                                Text.pop();
                                                Row.pop();
                                            };
                                            this.forEachUpdateFunction(elmtId, this.hotList, forEachItemGenFunction, (item: HotSearch) => item.keyword, true, false);
                                        }, ForEach);
                                        ForEach.pop();
                                        Flex.pop();
                                        Column.pop();
                                        Scroll.pop();
                                    });
                                }
                            }, If);
                            If.pop();
                        });
                    }
                    else if (this.state === LoadState.LOADING) {
                        this.ifElseBranchUpdateFunction(1, () => {
                            {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    if (isInitialRender) {
                                        let componentCall = new LoadingView(this, { tip: '搜索中…' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/SearchPage.ets", line: 126, col: 11 });
                                        ViewV2.create(componentCall);
                                        let paramsLambda = () => {
                                            return {
                                                tip: '搜索中…'
                                            };
                                        };
                                        componentCall.paramsGenerator_ = paramsLambda;
                                    }
                                    else {
                                        this.updateStateVarsOfChildByElmtId(elmtId, {
                                            tip: '搜索中…'
                                        });
                                    }
                                }, { name: "LoadingView" });
                            }
                        });
                    }
                    else if (this.state === LoadState.ERROR) {
                        this.ifElseBranchUpdateFunction(2, () => {
                            {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    if (isInitialRender) {
                                        let componentCall = new ErrorView(this, { message: '搜索失败，请重试', onRetry: (): void => this.doSearch(this.keyword) }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/SearchPage.ets", line: 128, col: 11 });
                                        ViewV2.create(componentCall);
                                        let paramsLambda = () => {
                                            return {
                                                message: '搜索失败，请重试',
                                                onRetry: (): void => this.doSearch(this.keyword)
                                            };
                                        };
                                        componentCall.paramsGenerator_ = paramsLambda;
                                    }
                                    else {
                                        this.updateStateVarsOfChildByElmtId(elmtId, {
                                            message: '搜索失败，请重试'
                                        });
                                    }
                                }, { name: "ErrorView" });
                            }
                        });
                    }
                    else if (this.state === LoadState.EMPTY) {
                        this.ifElseBranchUpdateFunction(3, () => {
                            {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    if (isInitialRender) {
                                        let componentCall = new EmptyView(this, { tip: `没有找到与"${this.keyword}"相关的内容` }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/SearchPage.ets", line: 130, col: 11 });
                                        ViewV2.create(componentCall);
                                        let paramsLambda = () => {
                                            return {
                                                tip: `没有找到与"${this.keyword}"相关的内容`
                                            };
                                        };
                                        componentCall.paramsGenerator_ = paramsLambda;
                                    }
                                    else {
                                        this.updateStateVarsOfChildByElmtId(elmtId, {
                                            tip: `没有找到与"${this.keyword}"相关的内容`
                                        });
                                    }
                                }, { name: "EmptyView" });
                            }
                        });
                    }
                    else {
                        this.ifElseBranchUpdateFunction(4, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                List.create();
                                List.debugLine("entry/src/main/ets/pages/SearchPage.ets(132:11)", "entry");
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
                                            ListItem.debugLine("entry/src/main/ets/pages/SearchPage.ets(134:15)", "entry");
                                        };
                                        const deepRenderFunction = (elmtId, isInitialRender) => {
                                            itemCreation(elmtId, isInitialRender);
                                            {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    if (isInitialRender) {
                                                        let componentCall = new SongListItem(this, {
                                                            song: song,
                                                            index: index,
                                                            onPlay: (s: Song): void => {
                                                                if (this.results !== null) {
                                                                    PlayerController.playSong(s, this.results);
                                                                }
                                                            }
                                                        }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/SearchPage.ets", line: 135, col: 17 });
                                                        ViewV2.create(componentCall);
                                                        let paramsLambda = () => {
                                                            return {
                                                                song: song,
                                                                index: index,
                                                                onPlay: (s: Song): void => {
                                                                    if (this.results !== null) {
                                                                        PlayerController.playSong(s, this.results);
                                                                    }
                                                                }
                                                            };
                                                        };
                                                        componentCall.paramsGenerator_ = paramsLambda;
                                                    }
                                                    else {
                                                        this.updateStateVarsOfChildByElmtId(elmtId, {
                                                            song: song,
                                                            index: index
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
                                this.forEachUpdateFunction(elmtId, this.results ?? [], forEachItemGenFunction, (song: Song) => song.id.toString(), true, false);
                            }, ForEach);
                            ForEach.pop();
                            List.pop();
                        });
                    }
                }, If);
                If.pop();
                Column.pop();
            }, { moduleName: "entry", pagePath: "entry/src/main/ets/pages/SearchPage" });
            NavDestination.hideTitleBar(true);
            NavDestination.debugLine("entry/src/main/ets/pages/SearchPage.ets(54:5)", "entry");
        }, NavDestination);
        NavDestination.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
