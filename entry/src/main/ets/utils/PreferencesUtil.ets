import { preferences } from '@kit.ArkData';
import { common } from '@kit.AbilityKit';

/**
 * 首选项（Preferences）持久化工具：
 * 对 @kit.ArkData 的轻量封装，提供同步读写 + 自动 flush。
 * 用于收藏列表、最近播放、听歌统计、个人资料、关注列表、异常模拟开关的持久化。
 *
 * 容错设计：Previewer 等无 Ability 上下文的场景下自动降级为内存存储
 * （本次运行内数据正常联动，重启后重置），任何读写异常都不会影响界面与播放流程。
 */
export class PreferencesUtil {
  private static pref: preferences.Preferences | null = null;
  private static ctx: common.Context | null = null;
  private static readonly STORE_NAME: string = 'yunle_store';
  /** 内存降级存储（Previewer / 持久化异常时兜底） */
  private static memory: Map<string, Object> = new Map<string, Object>();

  /** 在 EntryAbility.onCreate 中初始化 */
  static init(context: common.Context): void {
    PreferencesUtil.ctx = context;
  }

  /** 获取持久化存储；无上下文或创建失败时返回 null（调用方降级到内存） */
  private static store(): preferences.Preferences | null {
    const cached: preferences.Preferences | null = PreferencesUtil.pref;
    if (cached !== null) {
      return cached;
    }
    const ctx: common.Context | null = PreferencesUtil.ctx;
    if (ctx === null) {
      return null;
    }
    try {
      const created: preferences.Preferences =
        preferences.getPreferencesSync(ctx, { name: PreferencesUtil.STORE_NAME });
      PreferencesUtil.pref = created;
      return created;
    } catch (e) {
      console.warn(`PreferencesUtil store unavailable, fallback to memory: ${String(e)}`);
      return null;
    }
  }

  static putString(key: string, value: string): void {
    const s: preferences.Preferences | null = PreferencesUtil.store();
    if (s === null) {
      PreferencesUtil.memory.set(key, value);
      return;
    }
    try {
      s.putSync(key, value);
      s.flush();
    } catch (e) {
      PreferencesUtil.memory.set(key, value);
    }
  }

  static getString(key: string, def: string = ''): string {
    const s: preferences.Preferences | null = PreferencesUtil.store();
    if (s === null) {
      return (PreferencesUtil.memory.get(key) as string) ?? def;
    }
    try {
      return s.getSync(key, def) as string;
    } catch (e) {
      return (PreferencesUtil.memory.get(key) as string) ?? def;
    }
  }

  static putBool(key: string, value: boolean): void {
    const s: preferences.Preferences | null = PreferencesUtil.store();
    if (s === null) {
      PreferencesUtil.memory.set(key, value);
      return;
    }
    try {
      s.putSync(key, value);
      s.flush();
    } catch (e) {
      PreferencesUtil.memory.set(key, value);
    }
  }

  static getBool(key: string, def: boolean = false): boolean {
    const s: preferences.Preferences | null = PreferencesUtil.store();
    if (s === null) {
      return (PreferencesUtil.memory.get(key) as boolean) ?? def;
    }
    try {
      return s.getSync(key, def) as boolean;
    } catch (e) {
      return (PreferencesUtil.memory.get(key) as boolean) ?? def;
    }
  }

  static putNumber(key: string, value: number): void {
    const s: preferences.Preferences | null = PreferencesUtil.store();
    if (s === null) {
      PreferencesUtil.memory.set(key, value);
      return;
    }
    try {
      s.putSync(key, value);
      s.flush();
    } catch (e) {
      PreferencesUtil.memory.set(key, value);
    }
  }

  static getNumber(key: string, def: number = 0): number {
    const s: preferences.Preferences | null = PreferencesUtil.store();
    if (s === null) {
      return (PreferencesUtil.memory.get(key) as number) ?? def;
    }
    try {
      return s.getSync(key, def) as number;
    } catch (e) {
      return (PreferencesUtil.memory.get(key) as number) ?? def;
    }
  }
}
