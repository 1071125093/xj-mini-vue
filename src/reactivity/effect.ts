/*
 * @Author: XiaoJun
 * @Date: 2023-03-29 21:01:41
 * @LastEditors: XiaoJun
 * @LastEditTime: 2023-04-11 12:55:29
 * @Description: effect
 * @FilePath: /xj-mini-vue/src/reactivity/effect.ts
 */

class ReactiveEffect {
  private fn;
  deps = [];
  active = true;
  constructor(fn, public scheduler) {
    this.fn = fn;
  }
  run() {
    activeEffect = this;
    this.active = true;
    const res = this.fn();
    activeEffect = null; // xj擅自添加的,处理effect即便传空对象，也能被连带触发相应问题
    return res;
  }
  stop() {
    if (this.active) {
      this.active = false;
      this.deps.forEach((dep: any) => {
        dep.delete(this);
      });
    }
  }
}
export function effect(fn, options?) {
  const scheduler = options?.scheduler;
  const _effect = new ReactiveEffect(fn, scheduler);
  _effect.run();
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
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
    activeEffect.deps.push(dep);
  }
}
/** 触发依赖 */
export function trigger(target, key) {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}
/** 触发停止 */
export function stop(runner) {
  runner.effect.stop();
}
