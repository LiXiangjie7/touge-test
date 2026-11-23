/**
 * 全局路由工具：基于 Navigation 的 NavPathStack 统一管理路由栈。
 * 任何页面/组件均可通过 Router.push/back 完成跳转与返回，
 * 传参通过 pushPath 的 param 字段携带，在 pageMap 中解析。
 */
export class Router {
    private static stack: NavPathStack | null = null;
    /** 在 Navigation 宿主页面（Index）中注册路由栈 */
    static setStack(stack: NavPathStack): void {
        Router.stack = stack;
    }
    /** 入栈跳转 */
    static push(name: string, param?: Object): void {
        Router.stack?.pushPath({ name, param });
    }
    /** 替换栈顶 */
    static replace(name: string, param?: Object): void {
        Router.stack?.replacePath({ name, param });
    }
    /** 返回上一页 */
    static back(): void {
        Router.stack?.pop();
    }
    /** 清空路由栈回到首页 */
    static clearToHome(): void {
        Router.stack?.clear();
    }
}
