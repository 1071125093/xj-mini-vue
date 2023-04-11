import { ReactiveEffect } from './effect';

/*
 * @Author: XiaoJun
 * @Date: 2023-04-11 17:33:22
 * @LastEditors: XiaoJun
 * @LastEditTime: 2023-04-11 18:11:33
 * @Description: 组件功能
 * @FilePath: /xj-mini-vue/src/reactivity/computed.ts
 */
class ComputedRefImpl {
  private _getter: any;
  private _dirty = true;
  private _value: any;
  private _effect: any;
  constructor(getter) {
    this._getter = getter;
    this._effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true;
      }
    });
  }
  get value() {
    if (this._dirty) {
      this._dirty = false;
      this._value = this._effect.run();
    }
    return this._value;
  }
}

export function computed(getter) {
  return new ComputedRefImpl(getter);
}
