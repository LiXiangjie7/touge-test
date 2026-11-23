# 云乐（YunLe Music）

> 一款类「网易云音乐」的 HarmonyOS 音乐应用 —— 移动应用开发课程设计

基于 **HarmonyOS（API 12）+ ArkTS + ArkUI（Stage 模型）** 开发，
全程可在 **DevEco Studio Previewer** 中预览与交互，不依赖真机。

## 功能总览

| 模块 | 功能 |
| --- | --- |
| 发现 | 搜索入口、Banner 轮播、推荐歌单（Grid）、热门单曲（List）、下拉刷新 |
| 歌单详情 | Navigation 路由传参、模糊封面头图、播放全部、单曲点播 |
| 播放器 | AVPlayer 在线播放、进度拖动、切歌、顺序/随机/单曲循环、歌词滚动、收藏、旋转封面 |
| 排行榜 | Tabs 多榜单切换、榜单缓存、独立三态容错 |
| 搜索 | 热搜榜、真实远端接口搜索（失败自动降级本地 Mock）、结果点播 |
| 我的 | 我喜欢的音乐、最近播放、Preferences 持久化、个人资料入口、模拟网络异常开关 |
| 个人资料 | 编辑姓名 / 年龄 / 个人名片（持久化保存）、我的关注 / 好友列表（关注/取关，三态容错） |
| 听歌统计（加分项） | 基于个人真实听歌记录：近 7 日时长折线图 / 曲风占比环形图 / 歌手 Top 柱状图，点击可查看听歌排行（每首歌的播放次数） |

## 课程考点对照

- **容器组件**：Row / Column / List / Grid / Scroll / Swiper / Tabs / Stack / Flex
- **自定义组件**：`SongListItem`、`PlaylistCard`、`SectionHeader`、`MiniPlayer`、`TabBar`、`LoadingView / ErrorView / EmptyView`、`LineChart / PieChart / BarChart`
- **状态管理 V2**：`@ObservedV2` / `@Trace` / `@Local` / `@Param` / `@Event` / `@Monitor` / `AppStorageV2`
- **Navigation 路由**：NavPathStack 统一管理路由栈，多页面跳转 + 传参 + 返回
- **网络交互（硬性）**：`@kit.NetworkKit` 封装 HttpUtil；搜索走真实远端接口，其余走 Mock 接口（考核允许）；全页面具备 加载中 / 异常（可重试）/ 空数据 三态；「我的 → 网络状态模拟」支持 正常 / 慢速网络 / 网络异常 / 空数据 四档切换，可现场演示三种容错态
- **Git 版本管理**：按开发阶段分段提交，commit 信息语义化
- **加分项·数据可视化**：统计页三类 Canvas 自绘图表，全部基于个人真实听歌记录（每次播放按歌曲时长累计到当天、单曲播放次数 +1，Preferences 持久化），点击折线图卡片可进入听歌排行查看每首歌的播放次数

## 目录结构

```
YunLeMusic/
├── AppScope/                     # 应用级配置与图标
├── entry/src/main/
│   ├── module.json5              # 模块配置（含 INTERNET 权限声明）
│   ├── ets/
│   │   ├── entryability/         # 入口 Ability（初始化持久化与数据仓库）
│   │   ├── pages/                # 页面：Index(路由宿主)/发现/详情/播放/排行/搜索/我的/统计/个人资料/听歌排行
│   │   ├── components/           # 可复用自定义组件（含 charts/ 图表组件）
│   │   ├── viewmodel/            # 全局状态：MusicStore（收藏/历史/听歌统计）、UserStore（资料/关注）、PlayerStore（播放器）
│   │   ├── network/              # HttpUtil / ApiService / MockApi / MockData
│   │   ├── model/                # 数据模型（接口定义）
│   │   ├── common/               # 常量（主题色/路由/状态机）与路由工具
│   │   └── utils/                # 格式化与 Preferences 持久化工具
│   └── resources/                # 字符串 / 颜色 / 图标 / 页面路由声明
└── README.md
```

## 运行方式

1. 使用 **DevEco Studio 5.0+（API 12）** 打开本工程根目录；
2. 等待同步完成后，打开 `entry/src/main/ets/pages/Index.ets`，点击 **Previewer**；
3. 在预览器中即可完整体验：浏览歌单、搜索、播放（预览器无音频输出时会
   **自动进入模拟播放**，进度条 / 歌词 / 切歌均正常演示）、收藏、统计图表。

## 说明

- 音频流使用公开测试音频，封面图使用 picsum 占位图服务；搜索接口为
  公开音乐搜索服务，异常时自动降级本地 Mock 数据，保证功能可复现。
- 预览器若无法加载网络图片，会显示占位图标，不影响功能演示。
