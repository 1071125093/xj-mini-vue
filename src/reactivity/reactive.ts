/*
 * @Author: XiaoJun
 * @Date: 2023-03-29 20:48:44
 * @LastEditors: XiaoJun
 * @LastEditTime: 2023-04-11 13:06:01
 * @Description: 组件功能
 * @FilePath: /xj-mini-vue/src/reactivity/reactive.ts
 */
import { track, trigger } from './effect';
import { mutableHandlers, readonlyHandlers } from './baseHandlers';

export enum EnumReactiveFlag {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly'
}

export function reactive(raw) {
  return new Proxy(raw, mutableHandlers);
}
/** readonly reactive只读版 */
export function readonly(raw) {
  return new Proxy(raw, readonlyHandlers);
}
export function isReactive(raw) {
  return Boolean(raw[EnumReactiveFlag.IS_REACTIVE]);
}
export function isReadonly(raw) {
  return Boolean(raw[EnumReactiveFlag.IS_READONLY]);
}
