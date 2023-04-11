/*
 * @Author: XiaoJun
 * @Date: 2023-04-05 14:58:17
 * @LastEditors: XiaoJun
 * @LastEditTime: 2023-04-11 13:26:54
 * @Description: 组件功能
 * @FilePath: /xj-mini-vue/src/reactivity/baseHandlers.ts
 */
import { isObject } from '../shared';
import { track, trigger } from './effect';
import { EnumReactiveFlag, reactive, readonly } from './reactive';

/** 想要-getter */
const wannaGetter = (isReadonly = false) => {
  return (target, key) => {
    if (key === EnumReactiveFlag.IS_REACTIVE) {
      return !isReadonly;
    }
    if (key === EnumReactiveFlag.IS_READONLY) {
      return isReadonly;
    }
    const res = Reflect.get(target, key);
    // res如果是obj--> 对内部对象进行嵌套reactive处理
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }
    if (!isReadonly) {
      // #tips  非只读-触发收集
      track(target, key);
    }
    return res;
  };
};
/**想要-setter
 * @param {*} isReadonly 是否只读
 * @return {*}
 */
const wannaSetter = (isReadonly = false) => {
  return (target, key, value) => {
    if (!isReadonly) {
      const res = Reflect.set(target, key, value);
      // #tips 非只读-触发依赖
      trigger(target, key);
      return res;
    } else {
      console.warn(`只读对象${target}不可修改`);
      return true;
    }
  };
};

/** 灵活的handlers
 * 目前用于reactive
 */
export const mutableHandlers = {
  get: wannaGetter(),
  set: wannaSetter()
};
/** 死板的handlers
 * 目前用于readonly
 */
export const readonlyHandlers = {
  get: wannaGetter(true),
  set: wannaSetter(true)
};
