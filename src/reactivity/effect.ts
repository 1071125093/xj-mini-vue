/*
 * @Author: XiaoJun
 * @Date: 2023-03-29 21:01:41
 * @LastEditors: XiaoJun
 * @LastEditTime: 2023-04-11 18:07:21
 * @Description: effect
 * @FilePath: /xj-mini-vue/src/reactivity/effect.ts
 */
let activeEffect;
let showTrack; // 第12节课，但是与activeEffect高度重叠

export class ReactiveEffect {
  private fn;
  public scheduler;
  dep = [];
  active = true;
  constructor(fn, scheduler?) {
    this.fn = fn;
    this.scheduler = scheduler;
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
      cleanupEffect(this);
    }
  }
}

export const cleanupEffect = (effect) => {
  effect.dep.forEach((dep: any) => {
    dep.delete(effect);
  });
};

export function effect(fn, options?) {
  const scheduler = options?.scheduler;
  const _effect = new ReactiveEffect(fn, scheduler);
  _effect.run();
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}

const targetMap = new Map();

/** 触发收集 */
export function track(target, key) {
  // target -> key -> dep
  if (!needTrack()) return;

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
  trackEffects(dep);
}
/** 触发收集-提取Effects部分 */
export function trackEffects(dep) {
  if (!needTrack()) return;
  dep.add(activeEffect);
  activeEffect.dep.push(dep);
}

/** 是否需要收集
 * 当effect run起来的时候 就需要追踪
 */
const needTrack = () => {
  return Boolean(activeEffect);
};

/** 触发依赖 */
export function trigger(target, key) {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);
  triggerEffects(dep);
}
export function triggerEffects(dep) {
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
