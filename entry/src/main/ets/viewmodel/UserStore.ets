import { AppStorageV2 } from '@kit.ArkUI';
import { UserProfile } from '../model/Models';
import { PreferencesUtil } from '../utils/PreferencesUtil';
import { StoreKeys } from '../common/Constants';

/** 默认资料（首次启动） */
const DEFAULT_PROFILE: UserProfile = {
  nickname: '云乐村民',
  age: 20,
  signature: '保持热爱，奔赴山海',
  avatarSeed: 'yunle-avatar'
};

/**
 * 用户资料仓库（状态管理 V2）。
 * 管理：个人资料（姓名 / 年龄 / 个人名片）与我的关注列表，
 * 通过 Preferences 持久化，编辑后"我的"页面实时联动刷新。
 */
@ObservedV2
export class UserStore {
  @Trace profile: UserProfile = DEFAULT_PROFILE;
  /** 我关注的用户 id 列表（默认关注前 4 位推荐用户，便于演示） */
  @Trace followingIds: number[] = [1, 2, 3, 4];

  /** 从首选项恢复（EntryAbility.onCreate 调用） */
  init(): void {
    const profileRaw: string = PreferencesUtil.getString(StoreKeys.PROFILE, '');
    if (profileRaw.length > 0) {
      try {
        this.profile = JSON.parse(profileRaw) as UserProfile;
      } catch (e) {
        this.profile = DEFAULT_PROFILE;
      }
    }
    const followRaw: string = PreferencesUtil.getString(StoreKeys.FOLLOWING, '');
    if (followRaw.length > 0) {
      try {
        this.followingIds = JSON.parse(followRaw) as number[];
      } catch (e) {
        this.followingIds = [1, 2, 3, 4];
      }
    }
  }

  /** 保存个人资料（姓名 / 年龄 / 个人名片） */
  updateProfile(profile: UserProfile): void {
    this.profile = profile;
    PreferencesUtil.putString(StoreKeys.PROFILE, JSON.stringify(profile));
  }

  isFollowing(id: number): boolean {
    return this.followingIds.indexOf(id) >= 0;
  }

  /** 关注 / 取消关注 */
  toggleFollow(id: number): void {
    if (this.isFollowing(id)) {
      this.followingIds = this.followingIds.filter((x: number) => x !== id);
    } else {
      this.followingIds = [...this.followingIds, id];
    }
    PreferencesUtil.putString(StoreKeys.FOLLOWING, JSON.stringify(this.followingIds));
  }

  /** 我的关注数 */
  followingCount(): number {
    return this.followingIds.length;
  }
}

let storeInstance: UserStore | null = null;

/** 获取全局 UserStore（懒加载注册进 AppStorageV2） */
export function userStore(): UserStore {
  if (storeInstance === null) {
    const connected: UserStore | undefined =
      AppStorageV2.connect(UserStore, 'userStore', () => new UserStore());
    storeInstance = connected ?? new UserStore();
  }
  return storeInstance;
}
