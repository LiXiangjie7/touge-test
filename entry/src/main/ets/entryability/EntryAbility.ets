import { AbilityConstant, UIAbility, Want } from '@kit.AbilityKit';
import { window } from '@kit.ArkUI';
import { BusinessError } from '@kit.BasicServicesKit';
import { PreferencesUtil } from '../utils/PreferencesUtil';
import { musicStore } from '../viewmodel/MusicStore';
import { MockApi, SimulateMode } from '../network/MockApi';
import { StoreKeys } from '../common/Constants';

/**
 * 应用入口 Ability：
 *  - 初始化首选项工具
 *  - 初始化全局数据仓库（收藏 / 最近播放 / 听歌统计）
 *  - 恢复"网络状态模拟"档位（用于演示加载/失败/空数据容错）
 */
export default class EntryAbility extends UIAbility {
  onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    PreferencesUtil.init(this.context);
    musicStore().init();
    MockApi.simulateMode = PreferencesUtil.getString(StoreKeys.SIMULATE_MODE, 'normal') as SimulateMode;
  }

  onWindowStageCreate(windowStage: window.WindowStage): void {
    windowStage.loadContent('pages/Index', (err: BusinessError) => {
      if (err.code) {
        console.error(`EntryAbility loadContent failed, code=${err.code}, msg=${err.message}`);
      }
    });
  }
}
