/*
 * @Author: XiaoJun
 * @Date: 2023-03-29 21:01:41
 * @LastEditors: XiaoJun
 * @LastEditTime: 2023-04-11 14:35:48
 * @Description: effect
 * @FilePath: /xj-mini-vue/src/reactivity/effect.ts
 */
let activeEffect;
let showTrack; // 第12节课，但是与activeEffect高度重叠

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
      cleanupEffect(this);
      // this.deps.forEach((deps: any) => {
      //   deps.delete(this);
      // });
    }
  }
}

const cleanupEffect = (effect) => {
  effect.deps.forEach((deps: any) => {
    deps.delete(effect);
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
  // target -> key -> deps
  if (!needTrack()) return;

  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let deps = depsMap.get(key);
  if (!deps) {
    deps = new Set();
    depsMap.set(key, deps);
  }
  deps.add(activeEffect);
  activeEffect.deps.push(deps);
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
  let deps = depsMap.get(key);
  for (const effect of deps) {
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
