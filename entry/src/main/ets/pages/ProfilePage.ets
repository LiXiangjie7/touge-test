import { promptAction } from '@kit.ArkUI';
import { AppColors, AppRoutes, LoadState } from '../common/Constants';
import { Router } from '../common/Router';
import { ArtistInfo, FriendItem, UserProfile } from '../model/Models';
import { ApiService } from '../network/ApiService';
import { userStore } from '../viewmodel/UserStore';
import { EmptyView, ErrorView, LoadingView } from '../components/StateViews';
import { formatCount } from '../utils/Format';

/**
 * 个人资料页（NavDestination）：
 * 由"我的"页面用户卡片点击进入。
 *  - 资料编辑：姓名（昵称）、年龄、个人名片，保存后经 Preferences 持久化，
 *    "我的"页面实时联动刷新；
 *  - 关注 / 好友 / 歌手 三个列表：经 ApiService 异步获取（加载/异常/空数据三态容错），
 *    支持关注 / 取消关注；点击歌手进入歌手主页。
 */
@ComponentV2
export struct ProfilePage {
  @Local nickname: string = '';
  @Local ageText: string = '';
  @Local signature: string = '';
  @Local friends: FriendItem[] = [];
  @Local artists: ArtistInfo[] = [];
  @Local listState: LoadState = LoadState.LOADING;
  /** 列表页签：0=我的关注 1=我的好友 2=关注的歌手 */
  @Local tab: number = 0;

  aboutToAppear(): void {
    userStore().ensureInit();
    const p: UserProfile = userStore().profile;
    this.nickname = p.nickname;
    this.ageText = `${p.age}`;
    this.signature = p.signature;
    this.loadLists();
  }

  private loadLists(): void {
    this.listState = LoadState.LOADING;
    Promise.all([ApiService.getFriends(), ApiService.getArtists()])
      .then((result: [FriendItem[], ArtistInfo[]]) => {
        this.friends = result[0];
        this.artists = result[1];
        this.listState = this.friends.length === 0 && this.artists.length === 0
          ? LoadState.EMPTY : LoadState.SUCCESS;
      })
      .catch((e: Object) => {
        console.error(`ProfilePage loadLists failed: ${String(e)}`);
        this.listState = LoadState.ERROR;
      });
  }

  /** 保存资料：昵称非空、年龄为 1-120 的数字 */
  private saveProfile(): void {
    const name: string = this.nickname.trim();
    const age: number = Number(this.ageText.trim());
    if (name.length === 0) {
      promptAction.showToast({ message: '姓名不能为空' });
      return;
    }
    if (!Number.isInteger(age) || age < 1 || age > 120) {
      promptAction.showToast({ message: '请输入 1-120 之间的年龄' });
      return;
    }
    const profile: UserProfile = {
      nickname: name,
      age: age,
      signature: this.signature.trim(),
      avatarSeed: userStore().profile.avatarSeed
    };
    userStore().updateProfile(profile);
    promptAction.showToast({ message: '资料已保存' });
  }

  /** 关注列表 / 好友列表（好友 = 互相关注） */
  private currentFriends(): FriendItem[] {
    if (this.tab === 0) {
      return this.friends.filter((f: FriendItem) => userStore().isFollowing(f.id));
    }
    return this.friends.filter((f: FriendItem) => f.mutual && userStore().isFollowing(f.id));
  }

  /** 我关注的歌手 */
  private followedArtists(): ArtistInfo[] {
    return this.artists.filter((a: ArtistInfo) => userStore().isFollowingArtist(a.id));
  }

  @Builder
  EditRow(label: string, placeholder: string, value: string, isNumber: boolean,
    onChange: (v: string) => void) {
    Row({ space: 12 }) {
      Text(label)
        .fontSize(14)
        .fontColor(AppColors.TEXT_MAIN)
        .width(64)
      TextInput({ placeholder: placeholder, text: value })
        .type(isNumber ? InputType.Number : InputType.Normal)
        .fontSize(14)
        .fontColor(AppColors.TEXT_MAIN)
        .placeholderColor(AppColors.TEXT_LIGHT)
        .backgroundColor(AppColors.BG)
        .borderRadius(8)
        .height(38)
        .layoutWeight(1)
        .maxLength(isNumber ? 3 : 20)
        .onChange(onChange)
    }
    .width('100%')
  }

  @Builder
  TabChip(label: string, index: number) {
    Text(label)
      .fontSize(14)
      .fontColor(this.tab === index ? Color.White : AppColors.TEXT_MAIN)
      .padding({ left: 14, right: 14, top: 7, bottom: 7 })
      .backgroundColor(this.tab === index ? AppColors.PRIMARY : AppColors.BG)
      .borderRadius(16)
      .onClick(() => {
        this.tab = index;
      })
  }

  build() {
    NavDestination() {
      Column() {
        // 顶部导航行
        Row({ space: 10 }) {
          SymbolGlyph($r('sys.symbol.chevron_left'))
            .fontSize(20)
            .fontColor([AppColors.TEXT_MAIN])
            .onClick(() => Router.back())
          Text('个人资料')
            .fontSize(17)
            .fontWeight(FontWeight.Medium)
            .fontColor(AppColors.TEXT_MAIN)
          Blank()
        }
        .width('100%')
        .padding({ left: 16, right: 16, top: 14, bottom: 10 })

        Scroll() {
          Column({ space: 14 }) {
            // 头像 + 资料编辑卡
            Column({ space: 12 }) {
              Image(`https://picsum.photos/seed/${userStore().profile.avatarSeed}/200/200`)
                .width(72)
                .height(72)
                .borderRadius(36)
                .objectFit(ImageFit.Cover)
                .alt($r('app.media.startIcon'))

              this.EditRow('姓名', '请输入姓名 / 昵称', this.nickname, false,
                (v: string): void => {
                  this.nickname = v;
                })
              this.EditRow('年龄', '请输入年龄', this.ageText, true,
                (v: string): void => {
                  this.ageText = v;
                })

              Row({ space: 12 }) {
                Text('个人名片')
                  .fontSize(14)
                  .fontColor(AppColors.TEXT_MAIN)
                  .width(64)
                TextArea({ placeholder: '写一句话介绍自己', text: this.signature })
                  .fontSize(14)
                  .fontColor(AppColors.TEXT_MAIN)
                  .placeholderColor(AppColors.TEXT_LIGHT)
                  .backgroundColor(AppColors.BG)
                  .borderRadius(8)
                  .height(64)
                  .layoutWeight(1)
                  .maxLength(50)
                  .onChange((v: string) => {
                    this.signature = v;
                  })
              }
              .width('100%')

              Button('保存资料')
                .fontSize(15)
                .fontColor(Color.White)
                .backgroundColor(AppColors.PRIMARY)
                .borderRadius(20)
                .height(40)
                .width('100%')
                .onClick(() => this.saveProfile())
            }
            .width('100%')
            .padding(16)
            .backgroundColor(AppColors.CARD)
            .borderRadius(12)

            // 关注 / 好友 / 歌手 列表卡
            Column() {
              Row({ space: 8 }) {
                this.TabChip(`关注 ${userStore().followingCount()}`, 0)
                this.TabChip('好友', 1)
                this.TabChip(`歌手 ${userStore().followedArtistCount()}`, 2)
                Blank()
              }
              .width('100%')
              .padding({ left: 16, right: 16, top: 12, bottom: 4 })

              if (this.listState === LoadState.LOADING) {
                LoadingView({ tip: '列表加载中…' })
              } else if (this.listState === LoadState.ERROR) {
                ErrorView({ message: '列表加载失败', onRetry: (): void => this.loadLists() })
              } else if (this.listState === LoadState.EMPTY) {
                EmptyView({ tip: '暂无数据', icon: $r('sys.symbol.person') })
              } else if (this.tab === 2) {
                // 关注的歌手
                if (this.followedArtists().length === 0) {
                  EmptyView({
                    tip: '还没有关注歌手，去播放页点歌手名进入主页关注吧',
                    icon: $r('sys.symbol.person')
                  })
                } else {
                  ForEach(this.followedArtists(), (a: ArtistInfo) => {
                    Row({ space: 10 }) {
                      Image(a.avatar)
                        .width(44)
                        .height(44)
                        .borderRadius(22)
                        .objectFit(ImageFit.Cover)
                        .alt($r('app.media.startIcon'))
                      Column({ space: 3 }) {
                        Text(a.name)
                          .fontSize(15)
                          .fontColor(AppColors.TEXT_MAIN)
                        Text(`${a.genre} · ${formatCount(a.fans)}粉丝`)
                          .fontSize(12)
                          .fontColor(AppColors.TEXT_SUB)
                          .maxLines(1)
                          .textOverflow({ overflow: TextOverflow.Ellipsis })
                      }
                      .alignItems(HorizontalAlign.Start)
                      .layoutWeight(1)
                      Text('已关注')
                        .fontSize(12)
                        .fontColor(AppColors.TEXT_SUB)
                        .padding({ left: 12, right: 12, top: 5, bottom: 5 })
                        .backgroundColor(AppColors.BG)
                        .borderRadius(14)
                        .onClick(() => userStore().toggleFollowArtist(a.id))
                    }
                    .width('100%')
                    .padding({ left: 16, right: 16, top: 8, bottom: 8 })
                    .onClick(() => Router.push(AppRoutes.ARTIST, a.name))
                  }, (a: ArtistInfo) => a.id.toString())
                }
              } else {
                // 关注 / 好友
                if (this.currentFriends().length === 0) {
                  EmptyView({
                    tip: this.tab === 0 ? '还没有关注任何人' : '暂无互相关注的好友',
                    icon: $r('sys.symbol.person')
                  })
                } else {
                  ForEach(this.currentFriends(), (f: FriendItem) => {
                    Row({ space: 10 }) {
                      Image(f.avatar)
                        .width(44)
                        .height(44)
                        .borderRadius(22)
                        .objectFit(ImageFit.Cover)
                        .alt($r('app.media.startIcon'))
                      Column({ space: 3 }) {
                        Row({ space: 6 }) {
                          Text(f.name)
                            .fontSize(15)
                            .fontColor(AppColors.TEXT_MAIN)
                          if (f.mutual) {
                            Text('互相关注')
                              .fontSize(10)
                              .fontColor(AppColors.PRIMARY)
                              .padding({ left: 6, right: 6, top: 1, bottom: 1 })
                              .backgroundColor(AppColors.PRIMARY_LIGHT)
                              .borderRadius(6)
                          }
                        }
                        Text(f.signature)
                          .fontSize(12)
                          .fontColor(AppColors.TEXT_SUB)
                          .maxLines(1)
                          .textOverflow({ overflow: TextOverflow.Ellipsis })
                      }
                      .alignItems(HorizontalAlign.Start)
                      .layoutWeight(1)
                      Text(userStore().isFollowing(f.id) ? '已关注' : '+ 关注')
                        .fontSize(12)
                        .fontColor(userStore().isFollowing(f.id) ? AppColors.TEXT_SUB : Color.White)
                        .padding({ left: 12, right: 12, top: 5, bottom: 5 })
                        .backgroundColor(userStore().isFollowing(f.id) ? AppColors.BG : AppColors.PRIMARY)
                        .borderRadius(14)
                        .onClick(() => userStore().toggleFollow(f.id))
                    }
                    .width('100%')
                    .padding({ left: 16, right: 16, top: 8, bottom: 8 })
                  }, (f: FriendItem) => f.id.toString())
                }
              }

              Blank().height(8)
            }
            .width('100%')
            .backgroundColor(AppColors.CARD)
            .borderRadius(12)

            Blank().height(24)
          }
          .alignItems(HorizontalAlign.Start)
          .padding({ left: 16, right: 16 })
        }
        .scrollBar(BarState.Off)
        .layoutWeight(1)
      }
      .width('100%')
      .height('100%')
      .backgroundColor(AppColors.BG)
    }
    .hideTitleBar(true)
  }
}
