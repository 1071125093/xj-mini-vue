/*
 * @Author: XiaoJun
 * @Date: 2023-03-29 20:48:44
 * @LastEditors: XiaoJun
 * @LastEditTime: 2023-04-05 15:10:39
 * @Description: 组件功能
 * @FilePath: /xj-mini-vue/src/reactivity/reactive.ts
 */
import { track, trigger } from './effect';
import { mutableHandlers, readonlyHandlers } from './baseHandlers';

export function reactive(raw) {
  return new Proxy(raw, mutableHandlers);
}
/** readonly reactive只读版 */
export function readonly(raw) {
  return new Proxy(raw, readonlyHandlers);
}
