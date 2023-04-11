/*
 * @Author: XiaoJun
 * @Date: 2023-04-03 12:41:09
 * @LastEditors: XiaoJun
 * @LastEditTime: 2023-04-11 13:26:11
 * @Description: 组件功能
 * @FilePath: /xj-mini-vue/src/reactivity/tests/reactive.spec.ts
 */
import { isReactive, isReadonly, reactive } from '../reactive';
describe('reactive', () => {
  it('happy path', () => {
    const original = {
      foo: 1
    };
    const observed = reactive(original);
    // 值不相等
    expect(observed).not.toBe(original);
    expect(observed.foo).toBe(original.foo);
    // 测试isReactive
    expect(isReactive(observed)).toBe(true);
    expect(isReactive(original)).toBe(false);
  });
  it('nested reactive', () => {
    const original = {
      nested: {
        foo: 1
      },
      array: [
        {
          bar: 2
        }
      ]
    };
    const observed = reactive(original);
    expect(isReactive(observed.nested)).toBe(true);
    expect(isReactive(observed.array)).toBe(true);
    expect(isReactive(observed.array[0])).toBe(true);
    expect(isReadonly(observed.array[0])).toBe(false);
  });
});
