import { preferences } from '@kit.ArkData';
import { common } from '@kit.AbilityKit';

/**
 * 首选项（Preferences）持久化工具：
 * 对 @kit.ArkData 的轻量封装，提供同步读写 + 自动 flush。
 * 用于收藏列表、最近播放、听歌时长统计、异常模拟开关的持久化。
 */
export class PreferencesUtil {
  private static pref: preferences.Preferences | null = null;
  private static ctx: common.Context | null = null;
  private static readonly STORE_NAME: string = 'yunle_store';

  /** 在 EntryAbility.onCreate 中初始化 */
  static init(context: common.Context): void {
    PreferencesUtil.ctx = context;
  }

  private static store(): preferences.Preferences {
    const cached: preferences.Preferences | null = PreferencesUtil.pref;
    if (cached !== null) {
      return cached;
    }
    const ctx: common.Context | null = PreferencesUtil.ctx;
    if (ctx === null) {
      throw new Error('PreferencesUtil.init() must be called in EntryAbility.onCreate first');
    }
    const created: preferences.Preferences =
      preferences.getPreferencesSync(ctx, { name: PreferencesUtil.STORE_NAME });
    PreferencesUtil.pref = created;
    return created;
  }

  static putString(key: string, value: string): void {
    PreferencesUtil.store().putSync(key, value);
    PreferencesUtil.store().flush();
  }

  static getString(key: string, def: string = ''): string {
    return PreferencesUtil.store().getSync(key, def) as string;
  }

  static putBool(key: string, value: boolean): void {
    PreferencesUtil.store().putSync(key, value);
    PreferencesUtil.store().flush();
  }

  static getBool(key: string, def: boolean = false): boolean {
    return PreferencesUtil.store().getSync(key, def) as boolean;
  }

  static putNumber(key: string, value: number): void {
    PreferencesUtil.store().putSync(key, value);
    PreferencesUtil.store().flush();
  }

  static getNumber(key: string, def: number = 0): number {
    return PreferencesUtil.store().getSync(key, def) as number;
  }
}
