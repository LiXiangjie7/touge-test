if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
import { AppColors, AppRoutes, LoadState } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
import { Router } from "@normalized:N&&&entry/src/main/ets/common/Router&";
import type { BannerItem, HomeData, Playlist, Song } from '../model/Models';
import { ApiService } from "@normalized:N&&&entry/src/main/ets/network/ApiService&";
import { PlayerController } from "@normalized:N&&&entry/src/main/ets/viewmodel/PlayerStore&";
import { PlaylistCard } from "@normalized:N&&&entry/src/main/ets/components/PlaylistCard&";
import { SectionHeader } from "@normalized:N&&&entry/src/main/ets/components/SectionHeader&";
import { SongListItem } from "@normalized:N&&&entry/src/main/ets/components/SongListItem&";
import { EmptyView, ErrorView, LoadingView } from "@normalized:N&&&entry/src/main/ets/components/StateViews&";
export class HomePage extends ViewV2 {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda, extraInfo) {
        super(parent, elmtId, extraInfo);
        this.homeData = null;
        this.state = LoadState.LOADING;
        this.refreshing = false;
        this.finalizeConstruction();
    }
    public resetStateVarsOnReuse(params: Object): void {
        this.homeData = null;
        this.state = LoadState.LOADING;
        this.refreshing = false;
    }
    @Local
    homeData: HomeData | null;
    @Local
    state: LoadState;
    @Local
    refreshing: boolean;
    aboutToAppear(): void {
        this.load();
    }
    /** 首次/重试加载 */
    private load(): void {
        this.state = LoadState.LOADING;
        ApiService.getHomeData()
            .then((data: HomeData) => {
            this.homeData = data;
            const empty: boolean = data.banners.length === 0 &&
                data.recommendPlaylists.length === 0 && data.hotSongs.length === 0;
            this.state = empty ? LoadState.EMPTY : LoadState.SUCCESS;
        })
            .catch((e: Object) => {
            console.error(`HomePage load failed: ${String(e)}`);
            this.state = LoadState.ERROR;
        });
    }
    /** 下拉刷新 */
    private onRefresh(): void {
        ApiService.getHomeData()
            .then((data: HomeData) => {
            this.homeData = data;
        })
            .catch((e: Object) => {
            console.error(`HomePage refresh failed: ${String(e)}`);
        })
            .finally(() => {
            this.refreshing = false;
        });
    }
    /** 点击 Banner 跳转到对应歌单 */
    private onBannerTap(banner: BannerItem): void {
        const playlist: Playlist | undefined = ApiService.findPlaylist(banner.playlistId);
        if (playlist !== undefined) {
            Router.push(AppRoutes.PLAYLIST_DETAIL, playlist);
        }
    }
    /** 推荐歌单区高度：按 3 列换算行数，保证 Grid 在 Scroll 中正确布局 */
    private gridHeight(): number {
        if (this.homeData === null) {
            return 0;
        }
        const rows: number = Math.ceil(this.homeData.recommendPlaylists.length / 3);
        return rows * 188 + (rows - 1) * 12;
    }
    private banners(): BannerItem[] {
        return this.homeData?.banners ?? [];
    }
    private playlists(): Playlist[] {
        return this.homeData?.recommendPlaylists ?? [];
    }
    private hotSongs(): Song[] {
        return this.homeData?.hotSongs ?? [];
    }
    /** 以热门单曲列表为播放队列点播 */
    private playHot(song: Song): void {
        PlayerController.playSong(song, this.hotSongs());
        Router.push(AppRoutes.PLAYER);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/HomePage.ets(92:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(AppColors.BG);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部标题 + 搜索入口
            Row.create({ space: 10 });
            Row.debugLine("entry/src/main/ets/pages/HomePage.ets(94:7)", "entry");
            // 顶部标题 + 搜索入口
            Row.width('100%');
            // 顶部标题 + 搜索入口
            Row.padding({ left: 16, right: 16, top: 12, bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('云乐');
            Text.debugLine("entry/src/main/ets/pages/HomePage.ets(95:9)", "entry");
            Text.fontSize(22);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(AppColors.PRIMARY);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 6 });
            Row.debugLine("entry/src/main/ets/pages/HomePage.ets(99:9)", "entry");
            Row.layoutWeight(1);
            Row.height(36);
            Row.padding({ left: 12 });
            Row.backgroundColor(AppColors.CARD);
            Row.borderRadius(18);
            Row.alignItems(VerticalAlign.Center);
            Row.onClick(() => Router.push(AppRoutes.SEARCH));
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831500, "type": 40000, params: [], "bundleName": "com.yunle.music", "moduleName": "entry" });
            SymbolGlyph.debugLine("entry/src/main/ets/pages/HomePage.ets(100:11)", "entry");
            SymbolGlyph.fontSize(15);
            SymbolGlyph.fontColor([AppColors.TEXT_SUB]);
        }, SymbolGlyph);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('搜索歌曲 / 歌手 / 歌单');
            Text.debugLine("entry/src/main/ets/pages/HomePage.ets(103:11)", "entry");
            Text.fontSize(13);
            Text.fontColor(AppColors.TEXT_SUB);
        }, Text);
        Text.pop();
        Row.pop();
        // 顶部标题 + 搜索入口
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.state === LoadState.LOADING) {
                this.ifElseBranchUpdateFunction(0, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new LoadingView(this, { tip: '正在为你推荐好音乐…' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/HomePage.ets", line: 119, col: 9 });
                                ViewV2.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        tip: '正在为你推荐好音乐…'
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    tip: '正在为你推荐好音乐…'
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
                                let componentCall = new ErrorView(this, {
                                    message: '网络异常，好音乐马上回来',
                                    onRetry: (): void => this.load()
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/HomePage.ets", line: 121, col: 9 });
                                ViewV2.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        message: '网络异常，好音乐马上回来',
                                        onRetry: (): void => this.load()
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    message: '网络异常，好音乐马上回来'
                                });
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
                                let componentCall = new EmptyView(this, { tip: '暂时没有内容' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/HomePage.ets", line: 126, col: 9 });
                                ViewV2.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        tip: '暂时没有内容'
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    tip: '暂时没有内容'
                                });
                            }
                        }, { name: "EmptyView" });
                    }
                });
            }
            else if (this.homeData !== null) {
                this.ifElseBranchUpdateFunction(3, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Refresh.create({ refreshing: { value: this.refreshing, changeEvent: newValue => { this.refreshing = newValue; } } });
                        Refresh.debugLine("entry/src/main/ets/pages/HomePage.ets(128:9)", "entry");
                        Refresh.layoutWeight(1);
                        Refresh.onRefreshing(() => this.onRefresh());
                    }, Refresh);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Scroll.create();
                        Scroll.debugLine("entry/src/main/ets/pages/HomePage.ets(129:11)", "entry");
                        Scroll.scrollBar(BarState.Off);
                        Scroll.align(Alignment.Top);
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/HomePage.ets(130:13)", "entry");
                        Column.alignItems(HorizontalAlign.Start);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // Banner 轮播
                        Swiper.create();
                        Swiper.debugLine("entry/src/main/ets/pages/HomePage.ets(132:15)", "entry");
                        // Banner 轮播
                        Swiper.autoPlay(true);
                        // Banner 轮播
                        Swiper.interval(3500);
                        // Banner 轮播
                        Swiper.loop(true);
                        // Banner 轮播
                        Swiper.indicator(Indicator.dot()
                            .selectedColor(AppColors.PRIMARY)
                            .color('#99FFFFFF'));
                        // Banner 轮播
                        Swiper.width('100%');
                        // Banner 轮播
                        Swiper.height(150);
                        // Banner 轮播
                        Swiper.padding({ left: 16, right: 16 });
                    }, Swiper);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const banner = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Stack.create({ alignContent: Alignment.BottomStart });
                                Stack.debugLine("entry/src/main/ets/pages/HomePage.ets(134:19)", "entry");
                                Stack.onClick(() => this.onBannerTap(banner));
                            }, Stack);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Image.create(banner.image);
                                Image.debugLine("entry/src/main/ets/pages/HomePage.ets(135:21)", "entry");
                                Image.width('100%');
                                Image.height(150);
                                Image.borderRadius(12);
                                Image.objectFit(ImageFit.Cover);
                                Image.alt({ "id": 16777223, "type": 20000, params: [], "bundleName": "com.yunle.music", "moduleName": "entry" });
                            }, Image);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(banner.title);
                                Text.debugLine("entry/src/main/ets/pages/HomePage.ets(141:21)", "entry");
                                Text.fontSize(13);
                                Text.fontColor(Color.White);
                                Text.fontWeight(FontWeight.Medium);
                                Text.padding({ left: 10, right: 10, top: 4, bottom: 4 });
                                Text.backgroundColor('#66000000');
                                Text.borderRadius(8);
                                Text.margin({ left: 10, bottom: 10 });
                            }, Text);
                            Text.pop();
                            Stack.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.banners(), forEachItemGenFunction, (banner: BannerItem) => banner.id.toString(), false, false);
                    }, ForEach);
                    ForEach.pop();
                    // Banner 轮播
                    Swiper.pop();
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new 
                                // 推荐歌单 Grid
                                SectionHeader(this, { title: '推荐歌单' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/HomePage.ets", line: 164, col: 15 });
                                ViewV2.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        title: '推荐歌单'
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    title: '推荐歌单'
                                });
                            }
                        }, { name: "SectionHeader" });
                    }
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Grid.create();
                        Grid.debugLine("entry/src/main/ets/pages/HomePage.ets(165:15)", "entry");
                        Grid.columnsTemplate('1fr 1fr 1fr');
                        Grid.columnsGap(10);
                        Grid.rowsGap(12);
                        Grid.height(this.gridHeight());
                        Grid.padding({ left: 16, right: 16 });
                    }, Grid);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const playlist = _item;
                            {
                                const itemCreation2 = (elmtId, isInitialRender) => {
                                    GridItem.create(() => { }, false);
                                    GridItem.debugLine("entry/src/main/ets/pages/HomePage.ets(167:19)", "entry");
                                };
                                const observedDeepRender = () => {
                                    this.observeComponentCreation2(itemCreation2, GridItem);
                                    {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            if (isInitialRender) {
                                                let componentCall = new PlaylistCard(this, {
                                                    playlist: playlist,
                                                    onTap: (p: Playlist): void => Router.push(AppRoutes.PLAYLIST_DETAIL, p)
                                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/HomePage.ets", line: 168, col: 21 });
                                                ViewV2.create(componentCall);
                                                let paramsLambda = () => {
                                                    return {
                                                        playlist: playlist,
                                                        onTap: (p: Playlist): void => Router.push(AppRoutes.PLAYLIST_DETAIL, p)
                                                    };
                                                };
                                                componentCall.paramsGenerator_ = paramsLambda;
                                            }
                                            else {
                                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                                    playlist: playlist
                                                });
                                            }
                                        }, { name: "PlaylistCard" });
                                    }
                                    GridItem.pop();
                                };
                                observedDeepRender();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.playlists(), forEachItemGenFunction, (playlist: Playlist) => playlist.id.toString(), false, false);
                    }, ForEach);
                    ForEach.pop();
                    Grid.pop();
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new 
                                // 热门单曲 List
                                SectionHeader(this, { title: '热门单曲' }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/HomePage.ets", line: 182, col: 15 });
                                ViewV2.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        title: '热门单曲'
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    title: '热门单曲'
                                });
                            }
                        }, { name: "SectionHeader" });
                    }
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/HomePage.ets(183:15)", "entry");
                        Column.borderRadius(12);
                        Column.clip(true);
                        Column.margin({ left: 16, right: 16 });
                    }, Column);
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
                                            onPlay: (s: Song): void => this.playHot(s)
                                        }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/HomePage.ets", line: 185, col: 19 });
                                        ViewV2.create(componentCall);
                                        let paramsLambda = () => {
                                            return {
                                                song: song,
                                                index: index,
                                                onPlay: (s: Song): void => this.playHot(s)
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
                        this.forEachUpdateFunction(elmtId, this.hotSongs(), forEachItemGenFunction, (song: Song) => song.id.toString(), true, false);
                    }, ForEach);
                    ForEach.pop();
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.debugLine("entry/src/main/ets/pages/HomePage.ets(196:15)", "entry");
                        Blank.height(24);
                    }, Blank);
                    Blank.pop();
                    Column.pop();
                    Scroll.pop();
                    Refresh.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(4, () => {
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
