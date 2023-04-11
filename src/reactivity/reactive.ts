/*
 * @Author: XiaoJun
 * @Date: 2023-03-29 20:48:44
 * @LastEditors: XiaoJun
 * @LastEditTime: 2023-04-11 15:18:57
 * @Description: 组件功能
 * @FilePath: /xj-mini-vue/src/reactivity/reactive.ts
 */
import { track, trigger } from './effect';
import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from './baseHandlers';

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
export function shallowReadonly(raw) {
  return new Proxy(raw, shallowReadonlyHandlers);
}

export function isReactive(raw) {
  return Boolean(raw[EnumReactiveFlag.IS_REACTIVE]);
}
export function isReadonly(raw) {
  return Boolean(raw[EnumReactiveFlag.IS_READONLY]);
}
export function isProxy(raw) {
  return isReactive(raw) || isReadonly(raw);
}
