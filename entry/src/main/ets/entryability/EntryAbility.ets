import { AbilityConstant, UIAbility, Want } from '@kit.AbilityKit';
import { window } from '@kit.ArkUI';
import { BusinessError } from '@kit.BasicServicesKit';
import { PreferencesUtil } from '../utils/PreferencesUtil';
import { musicStore } from '../viewmodel/MusicStore';
import { MockApi } from '../network/MockApi';
import { StoreKeys } from '../common/Constants';

/**
 * 应用入口 Ability：
 *  - 初始化首选项工具
 *  - 初始化全局数据仓库（收藏 / 最近播放 / 听歌统计）
 *  - 恢复"模拟网络异常"开关状态（用于演示容错处理）
 */
export default class EntryAbility extends UIAbility {
  onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    PreferencesUtil.init(this.context);
    musicStore().init();
    MockApi.simulateError = PreferencesUtil.getBool(StoreKeys.SIMULATE_ERROR, false);
  }

  onWindowStageCreate(windowStage: window.WindowStage): void {
    windowStage.loadContent('pages/Index', (err: BusinessError) => {
      if (err.code) {
        console.error(`EntryAbility loadContent failed, code=${err.code}, msg=${err.message}`);
      }
    });
  }
}
