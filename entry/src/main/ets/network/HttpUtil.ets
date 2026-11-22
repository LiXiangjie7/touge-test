import { http } from '@kit.NetworkKit';
import { NetConfig } from '../common/Constants';

/**
 * 网络请求工具：对 @kit.NetworkKit http 模块的封装。
 * 统一处理超时、状态码校验与资源释放。
 */
export class HttpUtil {
  /**
   * 发起 GET 请求并返回响应字符串。
   * 非 200 状态码或网络异常时抛出 Error，由上层统一捕获并进入错误态。
   */
  static async get(url: string, timeout: number = NetConfig.TIMEOUT): Promise<string> {
    const request = http.createHttp();
    try {
      const response = await request.request(url, {
        method: http.RequestMethod.GET,
        connectTimeout: timeout,
        readTimeout: timeout,
        expectDataType: http.HttpDataType.STRING,
        header: { 'Content-Type': 'application/json' }
      });
      if (response.responseCode === 200 && typeof response.result === 'string') {
        return response.result;
      }
      throw new Error(`HTTP_${response.responseCode}`);
    } finally {
      request.destroy();
    }
  }
}
