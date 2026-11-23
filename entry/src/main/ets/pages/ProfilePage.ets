import { promptAction } from '@kit.ArkUI';
import { AppColors, LoadState } from '../common/Constants';
import { Router } from '../common/Router';
import { FriendItem, UserProfile } from '../model/Models';
import { ApiService } from '../network/ApiService';
import { userStore } from '../viewmodel/UserStore';
import { EmptyView, ErrorView, LoadingView } from '../components/StateViews';

/**
 * 个人资料页（NavDestination）：
 * 由"我的"页面用户卡片点击进入。
 *  - 资料编辑：姓名（昵称）、年龄、个人名片，保存后经 Preferences 持久化，
 *    "我的"页面实时联动刷新；
 *  - 关注 / 好友列表：经 ApiService 异步获取（具备加载/异常/空数据三态容错），
 *    支持关注 / 取消关注，关注状态持久化。
 */
@ComponentV2
export struct ProfilePage {
  @Local nickname: string = '';
  @Local ageText: string = '';
  @Local signature: string = '';
  @Local friends: FriendItem[] = [];
  @Local friendState: LoadState = LoadState.LOADING;
  /** true=我的关注 false=我的好友（互相关注） */
  @Local showFollowing: boolean = true;

  aboutToAppear(): void {
    const p: UserProfile = userStore().profile;
    this.nickname = p.nickname;
    this.ageText = `${p.age}`;
    this.signature = p.signature;
    this.loadFriends();
  }

  private loadFriends(): void {
    this.friendState = LoadState.LOADING;
    ApiService.getFriends()
      .then((list: FriendItem[]) => {
        this.friends = list;
        this.friendState = list.length === 0 ? LoadState.EMPTY : LoadState.SUCCESS;
      })
      .catch((e: Object) => {
        console.error(`ProfilePage loadFriends failed: ${String(e)}`);
        this.friendState = LoadState.ERROR;
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

  /** 当前列表：关注=我关注的人；好友=互相关注的人 */
  private currentList(): FriendItem[] {
    if (this.showFollowing) {
      return this.friends.filter((f: FriendItem) => userStore().isFollowing(f.id));
    }
    return this.friends.filter((f: FriendItem) => f.mutual && userStore().isFollowing(f.id));
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

            // 关注 / 好友列表卡
            Column() {
              Row({ space: 8 }) {
                Text(`关注 ${userStore().followingCount()}`)
                  .fontSize(14)
                  .fontColor(this.showFollowing ? Color.White : AppColors.TEXT_MAIN)
                  .padding({ left: 14, right: 14, top: 7, bottom: 7 })
                  .backgroundColor(this.showFollowing ? AppColors.PRIMARY : AppColors.BG)
                  .borderRadius(16)
                  .onClick(() => {
                    this.showFollowing = true;
                  })
                Text('好友')
                  .fontSize(14)
                  .fontColor(this.showFollowing ? AppColors.TEXT_MAIN : Color.White)
                  .padding({ left: 14, right: 14, top: 7, bottom: 7 })
                  .backgroundColor(this.showFollowing ? AppColors.BG : AppColors.PRIMARY)
                  .borderRadius(16)
                  .onClick(() => {
                    this.showFollowing = false;
                  })
                Blank()
              }
              .width('100%')
              .padding({ left: 16, right: 16, top: 12, bottom: 4 })

              if (this.friendState === LoadState.LOADING) {
                LoadingView({ tip: '好友列表加载中…' })
              } else if (this.friendState === LoadState.ERROR) {
                ErrorView({ message: '好友列表加载失败', onRetry: (): void => this.loadFriends() })
              } else if (this.friendState === LoadState.EMPTY) {
                EmptyView({ tip: '暂无推荐用户', icon: $r('sys.symbol.person') })
              } else {
                if (this.currentList().length === 0) {
                  EmptyView({
                    tip: this.showFollowing ? '还没有关注任何人' : '暂无互相关注的好友',
                    icon: $r('sys.symbol.person')
                  })
                } else {
                  ForEach(this.currentList(), (f: FriendItem) => {
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
