/*
 * @Author: XiaoJun
 * @Date: 2023-03-29 21:01:41
 * @LastEditors: XiaoJun
 * @LastEditTime: 2023-03-29 22:58:51
 * @Description: effect
 * @FilePath: /xj-mini-vue/src/reactivity/effect.ts
 */

class ReactiveEffect {
  private fn;
  constructor(fn) {
    this.fn = fn;
  }
  run() {
    activeEffect = this;
    const res = this.fn();
    activeEffect = null; // xj擅自添加的,处理effect即便传空对象，也能被连带触发相应问题
    return res;
  }
}
export function effect(fn) {
  const _effect = new ReactiveEffect(fn);
  _effect.run();
  return _effect.run.bind(_effect);
}

const targetMap = new Map();

let activeEffect;
/** 触发收集 */
export function track(target, key) {
  // target -> key -> dep
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  if (activeEffect) {
    dep.add(activeEffect);
  }
}
/** 触发依赖 */
export function trigger(target, key) {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);
  for (const effect of dep) {
    effect.run();
  }
}
