import { track, trigger } from './effect';
export function reactive(raw) {
  return new Proxy(raw, {
    get(target, key) {
      // {foo:1}
      const res = Reflect.get(target, key);
      // #todo  触发收集
      track(target, key);

      return res;
    },
    set(target, key, value) {
      const res = Reflect.set(target, key, value);

      // #todo 触发依赖
      trigger(target, key);
      return res;
    }
  });
}
