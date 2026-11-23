if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
import { AppColors, LoadState } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
import type { ListenStats } from '../model/Models';
import { ApiService } from "@normalized:N&&&entry/src/main/ets/network/ApiService&";
import { musicStore } from "@normalized:N&&&entry/src/main/ets/viewmodel/MusicStore&";
import { BarChart, LineChart, PieChart } from "@normalized:N&&&entry/src/main/ets/components/charts/Charts&";
import { EmptyView, ErrorView, LoadingView } from "@normalized:N&&&entry/src/main/ets/components/StateViews&";
export class StatsPage extends ViewV2 {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda, extraInfo) {
        super(parent, elmtId, extraInfo);
        this.stats = null;
        this.state = LoadState.LOADING;
        this.finalizeConstruction();
    }
    public resetStateVarsOnReuse(params: Object): void {
        this.stats = null;
        this.state = LoadState.LOADING;
    }
    @Local
    stats: ListenStats | null;
    @Local
    state: LoadState;
    aboutToAppear(): void {
        this.load();
    }
    private load(): void {
        this.state = LoadState.LOADING;
        ApiService.getListenStats(musicStore().extraMinutesToday)
            .then((stats: ListenStats) => {
            this.stats = stats;
            this.state = LoadState.SUCCESS;
        })
            .catch((e: Object) => {
            console.error(`StatsPage load failed: ${String(e)}`);
            this.state = LoadState.ERROR;
        });
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/StatsPage.ets(37:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(AppColors.BG);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('听歌统计');
            Text.debugLine("entry/src/main/ets/pages/StatsPage.ets(38:7)", "entry");
            Text.fontSize(22);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(AppColors.TEXT_MAIN);
            Text.width('100%');
            Text.padding({ left: 16, top: 12, bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.state === LoadState.LOADING) {
                this.ifElseBranchUpdateFunction(0, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new LoadingView(this, { tip: '统计数据生成中…' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/StatsPage.ets", line: 46, col: 9 });
                                ViewV2.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        tip: '统计数据生成中…'
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    tip: '统计数据生成中…'
                                });
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
                                let componentCall = new ErrorView(this, { message: '统计数据加载失败', onRetry: (): void => this.load() }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/StatsPage.ets", line: 48, col: 9 });
                                ViewV2.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        message: '统计数据加载失败',
                                        onRetry: (): void => this.load()
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    message: '统计数据加载失败'
                                });
                            }
                        }, { name: "ErrorView" });
                    }
                });
            }
            else if (this.stats === null) {
                this.ifElseBranchUpdateFunction(2, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new EmptyView(this, { tip: '暂无统计数据' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/StatsPage.ets", line: 50, col: 9 });
                                ViewV2.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        tip: '暂无统计数据'
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    tip: '暂无统计数据'
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
                        Scroll.debugLine("entry/src/main/ets/pages/StatsPage.ets(52:9)", "entry");
                        Scroll.scrollBar(BarState.Off);
                        Scroll.layoutWeight(1);
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 14 });
                        Column.debugLine("entry/src/main/ets/pages/StatsPage.ets(53:11)", "entry");
                        Column.alignItems(HorizontalAlign.Start);
                        Column.padding({ left: 16, right: 16 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 汇总卡片
                        Row.create({ space: 14 });
                        Row.debugLine("entry/src/main/ets/pages/StatsPage.ets(55:13)", "entry");
                        // 汇总卡片
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 6 });
                        Column.debugLine("entry/src/main/ets/pages/StatsPage.ets(56:15)", "entry");
                        Column.layoutWeight(1);
                        Column.padding({ top: 18, bottom: 18 });
                        Column.backgroundColor(AppColors.CARD);
                        Column.borderRadius(12);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`${this.stats?.totalMinutes ?? 0}`);
                        Text.debugLine("entry/src/main/ets/pages/StatsPage.ets(57:17)", "entry");
                        Text.fontSize(24);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor(AppColors.PRIMARY);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('本周听歌（分钟）');
                        Text.debugLine("entry/src/main/ets/pages/StatsPage.ets(61:17)", "entry");
                        Text.fontSize(12);
                        Text.fontColor(AppColors.TEXT_SUB);
                    }, Text);
                    Text.pop();
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 6 });
                        Column.debugLine("entry/src/main/ets/pages/StatsPage.ets(70:15)", "entry");
                        Column.layoutWeight(1);
                        Column.padding({ top: 18, bottom: 18 });
                        Column.backgroundColor(AppColors.CARD);
                        Column.borderRadius(12);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`${this.stats?.totalSongs ?? 0}`);
                        Text.debugLine("entry/src/main/ets/pages/StatsPage.ets(71:17)", "entry");
                        Text.fontSize(24);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor(AppColors.PRIMARY);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('曲库收录（首）');
                        Text.debugLine("entry/src/main/ets/pages/StatsPage.ets(75:17)", "entry");
                        Text.fontSize(12);
                        Text.fontColor(AppColors.TEXT_SUB);
                    }, Text);
                    Text.pop();
                    Column.pop();
                    // 汇总卡片
                    Row.pop();
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new LineChart(this, { title: '近 7 日听歌时长（分钟）', data: this.stats?.weeklyMinutes ?? [] }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/StatsPage.ets", line: 86, col: 13 });
                                ViewV2.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        title: '近 7 日听歌时长（分钟）',
                                        data: this.stats?.weeklyMinutes ?? []
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    title: '近 7 日听歌时长（分钟）', data: this.stats?.weeklyMinutes ?? []
                                });
                            }
                        }, { name: "LineChart" });
                    }
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new PieChart(this, { title: '曲风占比', data: this.stats?.genreShare ?? [] }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/StatsPage.ets", line: 87, col: 13 });
                                ViewV2.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        title: '曲风占比',
                                        data: this.stats?.genreShare ?? []
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    title: '曲风占比', data: this.stats?.genreShare ?? []
                                });
                            }
                        }, { name: "PieChart" });
                    }
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new BarChart(this, { title: '常听歌手 Top5', data: this.stats?.topArtists ?? [] }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/StatsPage.ets", line: 88, col: 13 });
                                ViewV2.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        title: '常听歌手 Top5',
                                        data: this.stats?.topArtists ?? []
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    title: '常听歌手 Top5', data: this.stats?.topArtists ?? []
                                });
                            }
                        }, { name: "BarChart" });
                    }
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.debugLine("entry/src/main/ets/pages/StatsPage.ets(90:13)", "entry");
                        Blank.height(24);
                    }, Blank);
                    Blank.pop();
                    Column.pop();
                    Scroll.pop();
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
