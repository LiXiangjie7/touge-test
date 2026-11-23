if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
import { AppColors, StoreKeys } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
import type { Song } from '../model/Models';
import { MockApi } from "@normalized:N&&&entry/src/main/ets/network/MockApi&";
import { PlayerController } from "@normalized:N&&&entry/src/main/ets/viewmodel/PlayerStore&";
import { musicStore } from "@normalized:N&&&entry/src/main/ets/viewmodel/MusicStore&";
import { PreferencesUtil } from "@normalized:N&&&entry/src/main/ets/utils/PreferencesUtil&";
import { SongListItem } from "@normalized:N&&&entry/src/main/ets/components/SongListItem&";
import { EmptyView } from "@normalized:N&&&entry/src/main/ets/components/StateViews&";
export class MinePage extends ViewV2 {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda, extraInfo) {
        super(parent, elmtId, extraInfo);
        this.simulateError = MockApi.simulateError;
        this.showFavorites = true;
        this.finalizeConstruction();
    }
    public resetStateVarsOnReuse(params: Object): void {
        this.simulateError = MockApi.simulateError;
        this.showFavorites = true;
    }
    @Local
    simulateError: boolean;
    @Local
    showFavorites: boolean; // true=收藏列表 false=最近播放
    private onToggleSimulate(value: boolean): void {
        this.simulateError = value;
        MockApi.simulateError = value;
        PreferencesUtil.putBool(StoreKeys.SIMULATE_ERROR, value);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.debugLine("entry/src/main/ets/pages/MinePage.ets(27:5)", "entry");
            Scroll.scrollBar(BarState.Off);
            Scroll.width('100%');
            Scroll.height('100%');
            Scroll.backgroundColor(AppColors.BG);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 14 });
            Column.debugLine("entry/src/main/ets/pages/MinePage.ets(28:7)", "entry");
            Column.alignItems(HorizontalAlign.Start);
            Column.padding({ left: 16, right: 16, top: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 用户卡片
            Row.create({ space: 12 });
            Row.debugLine("entry/src/main/ets/pages/MinePage.ets(30:9)", "entry");
            // 用户卡片
            Row.width('100%');
            // 用户卡片
            Row.padding(16);
            // 用户卡片
            Row.backgroundColor(AppColors.CARD);
            // 用户卡片
            Row.borderRadius(12);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create('https://picsum.photos/seed/yunle-avatar/200/200');
            Image.debugLine("entry/src/main/ets/pages/MinePage.ets(31:11)", "entry");
            Image.width(58);
            Image.height(58);
            Image.borderRadius(29);
            Image.objectFit(ImageFit.Cover);
            Image.alt({ "id": 16777223, "type": 20000, params: [], "bundleName": "com.yunle.music", "moduleName": "entry" });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 4 });
            Column.debugLine("entry/src/main/ets/pages/MinePage.ets(37:11)", "entry");
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('云乐村民');
            Text.debugLine("entry/src/main/ets/pages/MinePage.ets(38:13)", "entry");
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(AppColors.TEXT_MAIN);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('保持热爱，奔赴山海');
            Text.debugLine("entry/src/main/ets/pages/MinePage.ets(42:13)", "entry");
            Text.fontSize(12);
            Text.fontColor(AppColors.TEXT_SUB);
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125832664, "type": 40000, params: [], "bundleName": "com.yunle.music", "moduleName": "entry" });
            SymbolGlyph.debugLine("entry/src/main/ets/pages/MinePage.ets(48:11)", "entry");
            SymbolGlyph.fontSize(16);
            SymbolGlyph.fontColor([AppColors.TEXT_LIGHT]);
        }, SymbolGlyph);
        // 用户卡片
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 数据统计行
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/MinePage.ets(58:9)", "entry");
            // 数据统计行
            Row.width('100%');
            // 数据统计行
            Row.padding({ top: 14, bottom: 14 });
            // 数据统计行
            Row.backgroundColor(AppColors.CARD);
            // 数据统计行
            Row.borderRadius(12);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 4 });
            Column.debugLine("entry/src/main/ets/pages/MinePage.ets(59:11)", "entry");
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${musicStore().favorites.length}`);
            Text.debugLine("entry/src/main/ets/pages/MinePage.ets(60:13)", "entry");
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(AppColors.TEXT_MAIN);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('我的收藏');
            Text.debugLine("entry/src/main/ets/pages/MinePage.ets(64:13)", "entry");
            Text.fontSize(11);
            Text.fontColor(AppColors.TEXT_SUB);
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 4 });
            Column.debugLine("entry/src/main/ets/pages/MinePage.ets(69:11)", "entry");
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${musicStore().history.length}`);
            Text.debugLine("entry/src/main/ets/pages/MinePage.ets(70:13)", "entry");
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(AppColors.TEXT_MAIN);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('最近播放');
            Text.debugLine("entry/src/main/ets/pages/MinePage.ets(74:13)", "entry");
            Text.fontSize(11);
            Text.fontColor(AppColors.TEXT_SUB);
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 4 });
            Column.debugLine("entry/src/main/ets/pages/MinePage.ets(79:11)", "entry");
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${Math.round(musicStore().extraMinutesToday)}`);
            Text.debugLine("entry/src/main/ets/pages/MinePage.ets(80:13)", "entry");
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(AppColors.TEXT_MAIN);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('今日听歌(分钟)');
            Text.debugLine("entry/src/main/ets/pages/MinePage.ets(84:13)", "entry");
            Text.fontSize(11);
            Text.fontColor(AppColors.TEXT_SUB);
        }, Text);
        Text.pop();
        Column.pop();
        // 数据统计行
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 收藏 / 最近播放 切换
            Row.create({ space: 8 });
            Row.debugLine("entry/src/main/ets/pages/MinePage.ets(96:9)", "entry");
            // 收藏 / 最近播放 切换
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('我喜欢的音乐');
            Text.debugLine("entry/src/main/ets/pages/MinePage.ets(97:11)", "entry");
            Text.fontSize(14);
            Text.fontColor(this.showFavorites ? Color.White : AppColors.TEXT_MAIN);
            Text.padding({ left: 14, right: 14, top: 7, bottom: 7 });
            Text.backgroundColor(this.showFavorites ? AppColors.PRIMARY : AppColors.CARD);
            Text.borderRadius(16);
            Text.onClick(() => {
                this.showFavorites = true;
            });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('最近播放');
            Text.debugLine("entry/src/main/ets/pages/MinePage.ets(106:11)", "entry");
            Text.fontSize(14);
            Text.fontColor(this.showFavorites ? AppColors.TEXT_MAIN : Color.White);
            Text.padding({ left: 14, right: 14, top: 7, bottom: 7 });
            Text.backgroundColor(this.showFavorites ? AppColors.CARD : AppColors.PRIMARY);
            Text.borderRadius(16);
            Text.onClick(() => {
                this.showFavorites = false;
            });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/MinePage.ets(115:11)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (!this.showFavorites && musicStore().history.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        SymbolGlyph.create({ "id": 125831542, "type": 40000, params: [], "bundleName": "com.yunle.music", "moduleName": "entry" });
                        SymbolGlyph.debugLine("entry/src/main/ets/pages/MinePage.ets(117:13)", "entry");
                        SymbolGlyph.fontSize(16);
                        SymbolGlyph.fontColor([AppColors.TEXT_SUB]);
                        SymbolGlyph.onClick(() => musicStore().clearHistory());
                    }, SymbolGlyph);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        // 收藏 / 最近播放 切换
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 列表区
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/MinePage.ets(126:9)", "entry");
            // 列表区
            Column.width('100%');
            // 列表区
            Column.borderRadius(12);
            // 列表区
            Column.clip(true);
            // 列表区
            Column.backgroundColor(AppColors.CARD);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.showFavorites) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (musicStore().favorites.length === 0) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        if (isInitialRender) {
                                            let componentCall = new EmptyView(this, { tip: '还没有收藏歌曲，去点一颗小红心吧', icon: { "id": 125831544, "type": 40000, params: [], "bundleName": "com.yunle.music", "moduleName": "entry" } }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/MinePage.ets", line: 129, col: 15 });
                                            ViewV2.create(componentCall);
                                            let paramsLambda = () => {
                                                return {
                                                    tip: '还没有收藏歌曲，去点一颗小红心吧',
                                                    icon: { "id": 125831544, "type": 40000, params: [], "bundleName": "com.yunle.music", "moduleName": "entry" }
                                                };
                                            };
                                            componentCall.paramsGenerator_ = paramsLambda;
                                        }
                                        else {
                                            this.updateStateVarsOfChildByElmtId(elmtId, {
                                                tip: '还没有收藏歌曲，去点一颗小红心吧', icon: { "id": 125831544, "type": 40000, params: [], "bundleName": "com.yunle.music", "moduleName": "entry" }
                                            });
                                        }
                                    }, { name: "EmptyView" });
                                }
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    ForEach.create();
                                    const forEachItemGenFunction = (_item, index: number) => {
                                        const song = _item;
                                        {
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                if (isInitialRender) {
                                                    let componentCall = new SongListItem(this, {
                                                        song: song,
                                                        index: index,
                                                        onPlay: (s: Song): void => {
                                                            PlayerController.playSong(s, musicStore().favorites);
                                                        }
                                                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/MinePage.ets", line: 132, col: 17 });
                                                    ViewV2.create(componentCall);
                                                    let paramsLambda = () => {
                                                        return {
                                                            song: song,
                                                            index: index,
                                                            onPlay: (s: Song): void => {
                                                                PlayerController.playSong(s, musicStore().favorites);
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
                                    };
                                    this.forEachUpdateFunction(elmtId, musicStore().favorites, forEachItemGenFunction, (song: Song) => song.id.toString(), true, false);
                                }, ForEach);
                                ForEach.pop();
                            });
                        }
                    }, If);
                    If.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (musicStore().history.length === 0) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        if (isInitialRender) {
                                            let componentCall = new EmptyView(this, { tip: '暂无播放记录', icon: { "id": 125832302, "type": 40000, params: [], "bundleName": "com.yunle.music", "moduleName": "entry" } }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/MinePage.ets", line: 143, col: 15 });
                                            ViewV2.create(componentCall);
                                            let paramsLambda = () => {
                                                return {
                                                    tip: '暂无播放记录',
                                                    icon: { "id": 125832302, "type": 40000, params: [], "bundleName": "com.yunle.music", "moduleName": "entry" }
                                                };
                                            };
                                            componentCall.paramsGenerator_ = paramsLambda;
                                        }
                                        else {
                                            this.updateStateVarsOfChildByElmtId(elmtId, {
                                                tip: '暂无播放记录', icon: { "id": 125832302, "type": 40000, params: [], "bundleName": "com.yunle.music", "moduleName": "entry" }
                                            });
                                        }
                                    }, { name: "EmptyView" });
                                }
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    ForEach.create();
                                    const forEachItemGenFunction = (_item, index: number) => {
                                        const song = _item;
                                        {
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                if (isInitialRender) {
                                                    let componentCall = new SongListItem(this, {
                                                        song: song,
                                                        index: index,
                                                        onPlay: (s: Song): void => {
                                                            PlayerController.playSong(s, musicStore().history);
                                                        }
                                                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/MinePage.ets", line: 146, col: 17 });
                                                    ViewV2.create(componentCall);
                                                    let paramsLambda = () => {
                                                        return {
                                                            song: song,
                                                            index: index,
                                                            onPlay: (s: Song): void => {
                                                                PlayerController.playSong(s, musicStore().history);
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
                                    };
                                    this.forEachUpdateFunction(elmtId, musicStore().history, forEachItemGenFunction, (song: Song) => song.id.toString(), true, false);
                                }, ForEach);
                                ForEach.pop();
                            });
                        }
                    }, If);
                    If.pop();
                });
            }
        }, If);
        If.pop();
        // 列表区
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 设置区
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/MinePage.ets(163:9)", "entry");
            // 设置区
            Column.width('100%');
            // 设置区
            Column.backgroundColor(AppColors.CARD);
            // 设置区
            Column.borderRadius(12);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/MinePage.ets(164:11)", "entry");
            Row.width('100%');
            Row.padding({ left: 16, right: 16, top: 12, bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 2 });
            Column.debugLine("entry/src/main/ets/pages/MinePage.ets(165:13)", "entry");
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('模拟网络异常');
            Text.debugLine("entry/src/main/ets/pages/MinePage.ets(166:15)", "entry");
            Text.fontSize(14);
            Text.fontColor(AppColors.TEXT_MAIN);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('开启后所有接口返回失败，用于演示错误态与重试');
            Text.debugLine("entry/src/main/ets/pages/MinePage.ets(169:15)", "entry");
            Text.fontSize(10);
            Text.fontColor(AppColors.TEXT_SUB);
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Toggle.create({ type: ToggleType.Switch, isOn: this.simulateError });
            Toggle.debugLine("entry/src/main/ets/pages/MinePage.ets(175:13)", "entry");
            Toggle.selectedColor(AppColors.PRIMARY);
            Toggle.onChange((value: boolean) => this.onToggleSimulate(value));
        }, Toggle);
        Toggle.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.debugLine("entry/src/main/ets/pages/MinePage.ets(182:11)", "entry");
            Divider.color(AppColors.DIVIDER);
            Divider.strokeWidth(0.5);
            Divider.margin({ left: 16, right: 16 });
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/MinePage.ets(184:11)", "entry");
            Row.width('100%');
            Row.padding({ left: 16, right: 16, top: 12, bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('关于云乐');
            Text.debugLine("entry/src/main/ets/pages/MinePage.ets(185:13)", "entry");
            Text.fontSize(14);
            Text.fontColor(AppColors.TEXT_MAIN);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/MinePage.ets(188:13)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('v1.0.0');
            Text.debugLine("entry/src/main/ets/pages/MinePage.ets(189:13)", "entry");
            Text.fontSize(12);
            Text.fontColor(AppColors.TEXT_LIGHT);
        }, Text);
        Text.pop();
        Row.pop();
        // 设置区
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/MinePage.ets(200:9)", "entry");
            Blank.height(24);
        }, Blank);
        Blank.pop();
        Column.pop();
        Scroll.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
