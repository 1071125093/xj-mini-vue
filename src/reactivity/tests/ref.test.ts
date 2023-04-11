/*
 * @Author: XiaoJun
 * @Date: 2023-04-11 15:20:44
 * @LastEditors: XiaoJun
 * @LastEditTime: 2023-04-11 16:40:33
 * @Description: 组件功能
 * @FilePath: /xj-mini-vue/src/reactivity/tests/ref.test.ts
 */
import { effect } from '../effect';
import { reactive } from '../reactive';
import { isRef, ref, unRef } from '../ref';
describe('ref', () => {
  it('happy path', () => {
    const a = ref(1);
    expect(a.value).toBe(1);
  });
  it('is reactive', () => {
    const a = ref(1);
    let dummy;
    let calls = 0;
    effect(() => {
      calls++;
      dummy = a.value;
    });
    expect(calls).toBe(1);
    expect(dummy).toBe(1);
    a.value = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);
    // same value should not trigger
    a.value = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);
  });
  test('should make nested properties reactive ', () => {
    const a = ref({
      count: 1
    });
    let dummy;
    effect(() => {
      dummy = a.value.count;
    });
    expect(dummy).toBe(1);
    a.value.count = 2;
    expect(dummy).toBe(2);
  });
  it('isRef works', () => {
    const a = ref(1);
    const user = reactive({
      age: 1
    });
    expect(isRef(a)).toBe(true);
    expect(isRef(1)).toBe(false);
    expect(isRef(user)).toBe(false);
    expect(unRef(a)).toBe(1);
  });
});
