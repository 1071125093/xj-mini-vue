import { computed } from '../computed';
import { reactive } from '../reactive';

/*
 * @Author: XiaoJun
 * @Date: 2023-04-11 17:32:59
 * @LastEditors: XiaoJun
 * @LastEditTime: 2023-04-11 18:13:24
 * @Description: 组件功能
 * @FilePath: /xj-mini-vue/src/reactivity/tests/computed.test.ts
 */
describe('computed', () => {
  it('happy path', () => {
    const user = reactive({
      age: 1
    });
    const age = computed(() => {
      return user.age;
    });
    expect(age.value).toBe(1);
  });
  it('should compute lazily', () => {
    const value = reactive({
      foo: 1
    });
    const getter = jest.fn(() => {
      return value.foo;
    });
    const calcValue = computed(getter);
    expect(getter).not.toHaveBeenCalled();

    expect(calcValue.value).toBe(1);
    expect(getter).toHaveBeenCalledTimes(1);

    // should not compute again
    calcValue.value;
    expect(getter).toHaveBeenCalledTimes(1);

    // should not compute again until chanegd
    value.foo = 2;
    expect(getter).toHaveBeenCalledTimes(1);

    // now it should compute
    expect(calcValue.value).toBe(2);
    expect(getter).toHaveBeenCalledTimes(2);

    calcValue.value;
    expect(getter).toHaveBeenCalledTimes(2);
  });
});
