if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
import { AppColors } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
import type { ArtistStat, DayStat, GenreStat } from '../../model/Models';
/**
 * 数据可视化加分项：基于 Canvas 自绘图表组件。
 * 选择 Canvas 自绘而非 Web+ECharts，原因是 Previewer 对 Web 容器加载
 * 远程脚本的支持有限，自绘可保证预览环境 100% 可复现；
 * 数据变化时通过 @Monitor 触发重绘，图表随接口数据动态更新。
 */
const PALETTE: string[] = ['#EC4141', '#FF8A5C', '#FFC24B', '#5BB98C', '#5B8FF9', '#9467BD'];
export class LineChart extends ViewV2 {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda, extraInfo) {
        super(parent, elmtId, extraInfo);
        this.initParam("data", (params && "data" in params) ? params.data : undefined);
        this.initParam("title", (params && "title" in params) ? params.title : '');
        this.ctx = new CanvasRenderingContext2D(new RenderingContextSettings(true));
        this.ready = false;
        this.finalizeConstruction();
    }
    public resetStateVarsOnReuse(params: Object): void {
        this.resetParam("data", (params && "data" in params) ? params.data : undefined);
        this.resetParam("title", (params && "title" in params) ? params.title : '');
        this.resetMonitorsOnReuse();
    }
    @Param
    readonly data: DayStat[];
    @Param
    readonly title: string;
    private ctx: CanvasRenderingContext2D;
    private ready: boolean;
    @Monitor('data')
    onDataChange(): void {
        if (this.ready) {
            this.draw();
        }
    }
    private draw(): void {
        const ctx: CanvasRenderingContext2D = this.ctx;
        const w: number = ctx.width;
        const h: number = ctx.height;
        ctx.clearRect(0, 0, w, h);
        if (this.data.length === 0) {
            return;
        }
        const padL: number = 36, padR: number = 16, padT: number = 20, padB: number = 28;
        const chartW: number = w - padL - padR;
        const chartH: number = h - padT - padB;
        const maxV: number = Math.max(this.data.reduce((m: number, d: DayStat) => Math.max(m, d.minutes), 0), 10);
        // 网格线与纵轴刻度
        ctx.strokeStyle = AppColors.DIVIDER;
        ctx.lineWidth = 1;
        ctx.font = '10px sans-serif';
        ctx.fillStyle = AppColors.TEXT_SUB;
        for (let i = 0; i <= 4; i++) {
            const y: number = padT + chartH - chartH * i / 4;
            ctx.beginPath();
            ctx.moveTo(padL, y);
            ctx.lineTo(w - padR, y);
            ctx.stroke();
            ctx.fillText(`${Math.round(maxV * i / 4)}`, 4, y + 3);
        }
        // 折线
        ctx.beginPath();
        this.data.forEach((d: DayStat, i: number) => {
            const x: number = padL + chartW * (this.data.length === 1 ? 0.5 : i / (this.data.length - 1));
            const y: number = padT + chartH - chartH * d.minutes / maxV;
            if (i === 0) {
                ctx.moveTo(x, y);
            }
            else {
                ctx.lineTo(x, y);
            }
        });
        ctx.strokeStyle = AppColors.PRIMARY;
        ctx.lineWidth = 2;
        ctx.stroke();
        // 数据点 + 横轴标签 + 数值
        this.data.forEach((d: DayStat, i: number) => {
            const x: number = padL + chartW * (this.data.length === 1 ? 0.5 : i / (this.data.length - 1));
            const y: number = padT + chartH - chartH * d.minutes / maxV;
            ctx.beginPath();
            ctx.arc(x, y, 3.5, 0, Math.PI * 2);
            ctx.fillStyle = AppColors.PRIMARY;
            ctx.fill();
            ctx.fillStyle = AppColors.TEXT_SUB;
            ctx.fillText(d.label, x - 10, h - 10);
            ctx.fillStyle = AppColors.TEXT_MAIN;
            ctx.fillText(`${d.minutes}`, x - 8, y - 8);
        });
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 8 });
            Column.debugLine("entry/src/main/ets/components/charts/Charts.ets(87:5)", "entry");
            Column.width('100%');
            Column.padding(14);
            Column.backgroundColor(AppColors.CARD);
            Column.borderRadius(12);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.title.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.title);
                        Text.debugLine("entry/src/main/ets/components/charts/Charts.ets(89:9)", "entry");
                        Text.fontSize(15);
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor(AppColors.TEXT_MAIN);
                        Text.width('100%');
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
            Canvas.create(this.ctx);
            Canvas.debugLine("entry/src/main/ets/components/charts/Charts.ets(95:7)", "entry");
            Canvas.width('100%');
            Canvas.height(190);
            Canvas.onReady(() => {
                this.ready = true;
                this.draw();
            });
        }, Canvas);
        Canvas.pop();
        Column.pop();
    }
    public updateStateVars(params) {
        if (params === undefined) {
            return;
        }
        if ("data" in params) {
            this.updateParam("data", params.data);
        }
        if ("title" in params) {
            this.updateParam("title", params.title);
        }
    }
    rerender() {
        this.updateDirtyElements();
    }
}
export class PieChart extends ViewV2 {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda, extraInfo) {
        super(parent, elmtId, extraInfo);
        this.initParam("data", (params && "data" in params) ? params.data : undefined);
        this.initParam("title", (params && "title" in params) ? params.title : '');
        this.ctx = new CanvasRenderingContext2D(new RenderingContextSettings(true));
        this.ready = false;
        this.finalizeConstruction();
    }
    public resetStateVarsOnReuse(params: Object): void {
        this.resetParam("data", (params && "data" in params) ? params.data : undefined);
        this.resetParam("title", (params && "title" in params) ? params.title : '');
        this.resetMonitorsOnReuse();
    }
    @Param
    readonly data: GenreStat[];
    @Param
    readonly title: string;
    private ctx: CanvasRenderingContext2D;
    private ready: boolean;
    @Monitor('data')
    onDataChange(): void {
        if (this.ready) {
            this.draw();
        }
    }
    private draw(): void {
        const ctx: CanvasRenderingContext2D = this.ctx;
        const w: number = ctx.width;
        const h: number = ctx.height;
        ctx.clearRect(0, 0, w, h);
        const total: number = this.data.reduce((sum: number, d: GenreStat) => sum + d.count, 0);
        if (total === 0) {
            return;
        }
        const cx: number = h / 2;
        const cy: number = h / 2;
        const radius: number = h / 2 - 16;
        let angle: number = -Math.PI / 2;
        this.data.forEach((d: GenreStat, i: number) => {
            const sweep: number = Math.PI * 2 * d.count / total;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, radius, angle, angle + sweep);
            ctx.closePath();
            ctx.fillStyle = PALETTE[i % PALETTE.length];
            ctx.fill();
            angle += sweep;
        });
        // 中心镂空成环形
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.55, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 8 });
            Column.debugLine("entry/src/main/ets/components/charts/Charts.ets(157:5)", "entry");
            Column.width('100%');
            Column.padding(14);
            Column.backgroundColor(AppColors.CARD);
            Column.borderRadius(12);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.title.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.title);
                        Text.debugLine("entry/src/main/ets/components/charts/Charts.ets(159:9)", "entry");
                        Text.fontSize(15);
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor(AppColors.TEXT_MAIN);
                        Text.width('100%');
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
            Row.create({ space: 12 });
            Row.debugLine("entry/src/main/ets/components/charts/Charts.ets(165:7)", "entry");
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Canvas.create(this.ctx);
            Canvas.debugLine("entry/src/main/ets/components/charts/Charts.ets(166:9)", "entry");
            Canvas.width(150);
            Canvas.height(150);
            Canvas.onReady(() => {
                this.ready = true;
                this.draw();
            });
        }, Canvas);
        Canvas.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 8 });
            Column.debugLine("entry/src/main/ets/components/charts/Charts.ets(173:9)", "entry");
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, i: number) => {
                const d = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create({ space: 6 });
                    Row.debugLine("entry/src/main/ets/components/charts/Charts.ets(175:13)", "entry");
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Circle.create({ width: 8, height: 8 });
                    Circle.debugLine("entry/src/main/ets/components/charts/Charts.ets(176:15)", "entry");
                    Circle.fill(PALETTE[i % PALETTE.length]);
                }, Circle);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(`${d.genre} ${d.count}首`);
                    Text.debugLine("entry/src/main/ets/components/charts/Charts.ets(178:15)", "entry");
                    Text.fontSize(12);
                    Text.fontColor(AppColors.TEXT_SUB);
                }, Text);
                Text.pop();
                Row.pop();
            };
            this.forEachUpdateFunction(elmtId, this.data, forEachItemGenFunction, (d: GenreStat) => d.genre, true, false);
        }, ForEach);
        ForEach.pop();
        Column.pop();
        Row.pop();
        Column.pop();
    }
    public updateStateVars(params) {
        if (params === undefined) {
            return;
        }
        if ("data" in params) {
            this.updateParam("data", params.data);
        }
        if ("title" in params) {
            this.updateParam("title", params.title);
        }
    }
    rerender() {
        this.updateDirtyElements();
    }
}
export class BarChart extends ViewV2 {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda, extraInfo) {
        super(parent, elmtId, extraInfo);
        this.initParam("data", (params && "data" in params) ? params.data : undefined);
        this.initParam("title", (params && "title" in params) ? params.title : '');
        this.ctx = new CanvasRenderingContext2D(new RenderingContextSettings(true));
        this.ready = false;
        this.finalizeConstruction();
    }
    public resetStateVarsOnReuse(params: Object): void {
        this.resetParam("data", (params && "data" in params) ? params.data : undefined);
        this.resetParam("title", (params && "title" in params) ? params.title : '');
        this.resetMonitorsOnReuse();
    }
    @Param
    readonly data: ArtistStat[];
    @Param
    readonly title: string;
    private ctx: CanvasRenderingContext2D;
    private ready: boolean;
    @Monitor('data')
    onDataChange(): void {
        if (this.ready) {
            this.draw();
        }
    }
    private draw(): void {
        const ctx: CanvasRenderingContext2D = this.ctx;
        const w: number = ctx.width;
        const h: number = ctx.height;
        ctx.clearRect(0, 0, w, h);
        if (this.data.length === 0) {
            return;
        }
        const labelW: number = 76;
        const rowH: number = h / this.data.length;
        const barH: number = Math.min(18, rowH - 14);
        const maxV: number = Math.max(this.data.reduce((m: number, d: ArtistStat) => Math.max(m, d.count), 0), 1);
        this.data.forEach((d: ArtistStat, i: number) => {
            const y: number = rowH * i + (rowH - barH) / 2;
            const barW: number = (w - labelW - 46) * d.count / maxV;
            // 歌手名
            ctx.fillStyle = AppColors.TEXT_MAIN;
            ctx.font = '12px sans-serif';
            const name: string = d.artist.length > 5 ? `${d.artist.substring(0, 5)}…` : d.artist;
            ctx.fillText(name, 0, y + barH / 2 + 4);
            // 柱体
            ctx.fillStyle = PALETTE[i % PALETTE.length];
            ctx.fillRect(labelW, y, Math.max(barW, 4), barH);
            // 数值
            ctx.fillStyle = AppColors.TEXT_SUB;
            ctx.fillText(`${d.count}`, labelW + Math.max(barW, 4) + 8, y + barH / 2 + 4);
        });
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 8 });
            Column.debugLine("entry/src/main/ets/components/charts/Charts.ets(243:5)", "entry");
            Column.width('100%');
            Column.padding(14);
            Column.backgroundColor(AppColors.CARD);
            Column.borderRadius(12);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.title.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.title);
                        Text.debugLine("entry/src/main/ets/components/charts/Charts.ets(245:9)", "entry");
                        Text.fontSize(15);
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor(AppColors.TEXT_MAIN);
                        Text.width('100%');
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
            Canvas.create(this.ctx);
            Canvas.debugLine("entry/src/main/ets/components/charts/Charts.ets(251:7)", "entry");
            Canvas.width('100%');
            Canvas.height(170);
            Canvas.onReady(() => {
                this.ready = true;
                this.draw();
            });
        }, Canvas);
        Canvas.pop();
        Column.pop();
    }
    public updateStateVars(params) {
        if (params === undefined) {
            return;
        }
        if ("data" in params) {
            this.updateParam("data", params.data);
        }
        if ("title" in params) {
            this.updateParam("title", params.title);
        }
    }
    rerender() {
        this.updateDirtyElements();
    }
}
