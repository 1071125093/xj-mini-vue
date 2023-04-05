/*
 * @Author: XiaoJun
 * @Date: 2023-04-05 14:12:05
 * @LastEditors: XiaoJun
 * @LastEditTime: 2023-04-05 15:34:40
 * @Description: 组件功能
 * @FilePath: /xj-mini-vue/src/reactivity/tests/readonly.test.ts
 */
import { readonly } from '../reactive';

describe('readonly测试开始', () => {
  it('happy path', () => {
    // not set
    const original = { foo: 1, bar: { baz: 2 } };
    const wrapped = readonly(original);
    expect(wrapped).not.toBe(original);
    expect(wrapped.foo).toBe(1);
  });
  //
  it('warn then call set', () => {
    // #flag 0405-jest-1
    console.warn = jest.fn();
    const user = readonly({
      name: 213
    });
    user.name++;
    expect(console.warn).toBeCalled();
  });
});
