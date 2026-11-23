import { AppRoutes } from '../common/Constants';
import { Router } from '../common/Router';
import { Playlist } from '../model/Models';
import { HomePage } from './HomePage';
import { RankPage } from './RankPage';
import { StatsPage } from './StatsPage';
import { MinePage } from './MinePage';
import { PlaylistDetailPage } from './PlaylistDetailPage';
import { PlayerPage } from './PlayerPage';
import { SearchPage } from './SearchPage';
import { ProfilePage } from './ProfilePage';
import { ListenRankPage } from './ListenRankPage';
import { ArtistPage } from './ArtistPage';
import { MiniPlayer } from '../components/MiniPlayer';
import { TabBar } from '../components/TabBar';

/**
 * 应用根页面：Navigation 路由宿主 + 四个主 Tab。
 *  - 底部 Tab 切换：发现 / 排行 / 统计 / 我的
 *  - 二级页面（歌单详情 / 播放页 / 搜索页）通过 NavPathStack 入栈，
 *    入栈时隐藏底部 Tab 与迷你播放条，返回时自动恢复（路由栈管理）。
 */
@Entry
@ComponentV2
struct Index {
  private pageStack: NavPathStack = new NavPathStack();
  @Local currentTab: number = 0;

  aboutToAppear(): void {
    Router.setStack(this.pageStack);
  }

  /** 二级页面路由表：解析路由名与传参，返回对应 NavDestination 页面 */
  @Builder
  PageMap(name: string, param: Object) {
    if (name === AppRoutes.PLAYLIST_DETAIL) {
      PlaylistDetailPage({ playlist: param as Playlist })
    } else if (name === AppRoutes.PLAYER) {
      PlayerPage()
    } else if (name === AppRoutes.SEARCH) {
      SearchPage()
    } else if (name === AppRoutes.PROFILE) {
      ProfilePage()
    } else if (name === AppRoutes.LISTEN_RANK) {
      ListenRankPage()
    } else if (name === AppRoutes.ARTIST) {
      ArtistPage({ artistName: param as string })
    }
  }

  build() {
    Navigation(this.pageStack) {
      Stack({ alignContent: Alignment.Bottom }) {
        // 主 Tab 内容区
        Column() {
          if (this.currentTab === 0) {
            HomePage()
          } else if (this.currentTab === 1) {
            RankPage()
          } else if (this.currentTab === 2) {
            StatsPage()
          } else {
            MinePage()
          }
        }
        .width('100%')
        .height('100%')
        // 为底部 MiniPlayer + TabBar 预留空间
        .padding({ bottom: 112 })

        // 底部悬浮层：仅在一级页面（路由栈为空）时显示
        if (this.pageStack.size() === 0) {
          Column() {
            MiniPlayer()
            TabBar({
              currentIndex: this.currentTab,
              onChange: (index: number): void => {
                this.currentTab = index;
              }
            })
          }
        }
      }
    }
    .navDestination(this.PageMap)
    .hideTitleBar(true)
    .mode(NavigationMode.Stack)
  }
}
