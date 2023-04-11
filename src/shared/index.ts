/*
 * @Author: XiaoJun
 * @Date: 2023-04-11 13:15:04
 * @LastEditors: XiaoJun
 * @LastEditTime: 2023-04-11 16:02:55
 * @Description: 方法们
 * @FilePath: /xj-mini-vue/src/shared/index.ts
 */
export const isObject = (val) => {
  return val !== null && typeof val === 'object';
};

/** 基础类型的比较 */
export const hasChanged = (val, newV) => {
  return !Object.is(val, newV);
};
