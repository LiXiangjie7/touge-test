if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
import { AppRoutes } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
import { Router } from "@normalized:N&&&entry/src/main/ets/common/Router&";
import type { Playlist } from '../model/Models';
import { HomePage } from "@normalized:N&&&entry/src/main/ets/pages/HomePage&";
import { RankPage } from "@normalized:N&&&entry/src/main/ets/pages/RankPage&";
import { StatsPage } from "@normalized:N&&&entry/src/main/ets/pages/StatsPage&";
import { MinePage } from "@normalized:N&&&entry/src/main/ets/pages/MinePage&";
import { PlaylistDetailPage } from "@normalized:N&&&entry/src/main/ets/pages/PlaylistDetailPage&";
import { PlayerPage } from "@normalized:N&&&entry/src/main/ets/pages/PlayerPage&";
import { SearchPage } from "@normalized:N&&&entry/src/main/ets/pages/SearchPage&";
import { MiniPlayer } from "@normalized:N&&&entry/src/main/ets/components/MiniPlayer&";
import { TabBar } from "@normalized:N&&&entry/src/main/ets/components/TabBar&";
class Index extends ViewV2 {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda, extraInfo) {
        super(parent, elmtId, extraInfo);
        this.pageStack = new NavPathStack();
        this.currentTab = 0;
        this.finalizeConstruction();
    }
    public resetStateVarsOnReuse(params: Object): void {
        this.currentTab = 0;
    }
    private pageStack: NavPathStack;
    @Local
    currentTab: number;
    aboutToAppear(): void {
        Router.setStack(this.pageStack);
    }
    /** 二级页面路由表：解析路由名与传参，返回对应 NavDestination 页面 */
    PageMap(name: string, param: Object, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (name === AppRoutes.PLAYLIST_DETAIL) {
                this.ifElseBranchUpdateFunction(0, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new PlaylistDetailPage(this, { playlist: param as Playlist }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 34, col: 7 });
                                ViewV2.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        playlist: param as Playlist
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    playlist: param as Playlist
                                });
                            }
                        }, { name: "PlaylistDetailPage" });
                    }
                });
            }
            else if (name === AppRoutes.PLAYER) {
                this.ifElseBranchUpdateFunction(1, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new PlayerPage(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 36, col: 7 });
                                ViewV2.create(componentCall);
                                let paramsLambda = () => {
                                    return {};
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "PlayerPage" });
                    }
                });
            }
            else if (name === AppRoutes.SEARCH) {
                this.ifElseBranchUpdateFunction(2, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new SearchPage(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 38, col: 7 });
                                ViewV2.create(componentCall);
                                let paramsLambda = () => {
                                    return {};
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "SearchPage" });
                    }
                });
            }
            else {
                this.ifElseBranchUpdateFunction(3, () => {
                });
            }
        }, If);
        If.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Navigation.create(this.pageStack, { moduleName: "entry", pagePath: "entry/src/main/ets/pages/Index", isUserCreateStack: true });
            Navigation.debugLine("entry/src/main/ets/pages/Index.ets(43:5)", "entry");
            Navigation.navDestination({ builder: this.PageMap.bind(this) });
            Navigation.hideTitleBar(true);
            Navigation.mode(NavigationMode.Stack);
        }, Navigation);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create({ alignContent: Alignment.Bottom });
            Stack.debugLine("entry/src/main/ets/pages/Index.ets(44:7)", "entry");
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 主 Tab 内容区
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Index.ets(46:9)", "entry");
            // 主 Tab 内容区
            Column.width('100%');
            // 主 Tab 内容区
            Column.height('100%');
            // 主 Tab 内容区
            Column.padding({ bottom: 112 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.currentTab === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new HomePage(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 48, col: 13 });
                                ViewV2.create(componentCall);
                                let paramsLambda = () => {
                                    return {};
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "HomePage" });
                    }
                });
            }
            else if (this.currentTab === 1) {
                this.ifElseBranchUpdateFunction(1, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new RankPage(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 50, col: 13 });
                                ViewV2.create(componentCall);
                                let paramsLambda = () => {
                                    return {};
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "RankPage" });
                    }
                });
            }
            else if (this.currentTab === 2) {
                this.ifElseBranchUpdateFunction(2, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new StatsPage(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 52, col: 13 });
                                ViewV2.create(componentCall);
                                let paramsLambda = () => {
                                    return {};
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "StatsPage" });
                    }
                });
            }
            else {
                this.ifElseBranchUpdateFunction(3, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new MinePage(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 54, col: 13 });
                                ViewV2.create(componentCall);
                                let paramsLambda = () => {
                                    return {};
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "MinePage" });
                    }
                });
            }
        }, If);
        If.pop();
        // 主 Tab 内容区
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 底部悬浮层：仅在一级页面（路由栈为空）时显示
            if (this.pageStack.size() === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/Index.ets(64:11)", "entry");
                    }, Column);
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new MiniPlayer(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 65, col: 13 });
                                ViewV2.create(componentCall);
                                let paramsLambda = () => {
                                    return {};
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "MiniPlayer" });
                    }
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new TabBar(this, {
                                    currentIndex: this.currentTab,
                                    onChange: (index: number): void => {
                                        this.currentTab = index;
                                    }
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 66, col: 13 });
                                ViewV2.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        currentIndex: this.currentTab,
                                        onChange: (index: number): void => {
                                            this.currentTab = index;
                                        }
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    currentIndex: this.currentTab
                                });
                            }
                        }, { name: "TabBar" });
                    }
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Stack.pop();
        Navigation.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Index";
    }
}
registerNamedRoute(() => new Index(undefined, {}), "", { bundleName: "com.yunle.music", moduleName: "entry", pagePath: "pages/Index", pageFullPath: "entry/src/main/ets/pages/Index", integratedHsp: "false", moduleType: "followWithHap" });
