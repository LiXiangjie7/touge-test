import { AppColors } from '../../common/Constants';
import { ArtistStat, DayStat, GenreStat } from '../../model/Models';

/**
 * 数据可视化加分项：基于 Canvas 自绘图表组件。
 * 选择 Canvas 自绘而非 Web+ECharts，原因是 Previewer 对 Web 容器加载
 * 远程脚本的支持有限，自绘可保证预览环境 100% 可复现；
 * 数据变化时通过 @Monitor 触发重绘，图表随接口数据动态更新。
 */

const PALETTE: string[] = ['#EC4141', '#FF8A5C', '#FFC24B', '#5BB98C', '#5B8FF9', '#9467BD'];

// ============================== 折线图 ==============================

@ComponentV2
export struct LineChart {
  @Require @Param data: DayStat[];
  @Param title: string = '';
  private ctx: CanvasRenderingContext2D = new CanvasRenderingContext2D(new RenderingContextSettings(true));
  private ready: boolean = false;

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
    ctx.font = '10vp sans-serif';
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
      } else {
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

  build() {
    Column({ space: 8 }) {
      if (this.title.length > 0) {
        Text(this.title)
          .fontSize(15)
          .fontWeight(FontWeight.Medium)
          .fontColor(AppColors.TEXT_MAIN)
          .width('100%')
      }
      Canvas(this.ctx)
        .width('100%')
        .height(190)
        .onReady(() => {
          this.ready = true;
          this.draw();
        })
    }
    .width('100%')
    .padding(14)
    .backgroundColor(AppColors.CARD)
    .borderRadius(12)
  }
}

// ============================== 饼图 ==============================

@ComponentV2
export struct PieChart {
  @Require @Param data: GenreStat[];
  @Param title: string = '';
  private ctx: CanvasRenderingContext2D = new CanvasRenderingContext2D(new RenderingContextSettings(true));
  private ready: boolean = false;

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

  build() {
    Column({ space: 8 }) {
      if (this.title.length > 0) {
        Text(this.title)
          .fontSize(15)
          .fontWeight(FontWeight.Medium)
          .fontColor(AppColors.TEXT_MAIN)
          .width('100%')
      }
      Row({ space: 12 }) {
        Canvas(this.ctx)
          .width(150)
          .height(150)
          .onReady(() => {
            this.ready = true;
            this.draw();
          })
        Column({ space: 8 }) {
          ForEach(this.data, (d: GenreStat, i: number) => {
            Row({ space: 6 }) {
              Circle({ width: 8, height: 8 })
                .fill(PALETTE[i % PALETTE.length])
              Text(`${d.genre} ${d.count}首`)
                .fontSize(12)
                .fontColor(AppColors.TEXT_SUB)
            }
          }, (d: GenreStat) => d.genre)
        }
        .alignItems(HorizontalAlign.Start)
        .layoutWeight(1)
      }
      .width('100%')
    }
    .width('100%')
    .padding(14)
    .backgroundColor(AppColors.CARD)
    .borderRadius(12)
  }
}

// ============================== 横向柱状图 ==============================

@ComponentV2
export struct BarChart {
  @Require @Param data: ArtistStat[];
  @Param title: string = '';
  private ctx: CanvasRenderingContext2D = new CanvasRenderingContext2D(new RenderingContextSettings(true));
  private ready: boolean = false;

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
      ctx.font = '12vp sans-serif';
      const name: string = d.artist.length > 5 ? `${d.artist.substring(0, 5)}…` : d.artist;
      ctx.fillText(name, 0, y + barH / 2 + 4);
      // 圆角柱体
      ctx.fillStyle = PALETTE[i % PALETTE.length];
      ctx.beginPath();
      ctx.roundRect(labelW, y, Math.max(barW, 4), barH, [barH / 2, barH / 2, barH / 2, barH / 2]);
      ctx.fill();
      // 数值
      ctx.fillStyle = AppColors.TEXT_SUB;
      ctx.fillText(`${d.count}`, labelW + Math.max(barW, 4) + 8, y + barH / 2 + 4);
    });
  }

  build() {
    Column({ space: 8 }) {
      if (this.title.length > 0) {
        Text(this.title)
          .fontSize(15)
          .fontWeight(FontWeight.Medium)
          .fontColor(AppColors.TEXT_MAIN)
          .width('100%')
      }
      Canvas(this.ctx)
        .width('100%')
        .height(170)
        .onReady(() => {
          this.ready = true;
          this.draw();
        })
    }
    .width('100%')
    .padding(14)
    .backgroundColor(AppColors.CARD)
    .borderRadius(12)
  }
}
