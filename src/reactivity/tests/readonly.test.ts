/*
 * @Author: XiaoJun
 * @Date: 2023-04-05 14:12:05
 * @LastEditors: XiaoJun
 * @LastEditTime: 2023-04-11 13:25:25
 * @Description: 组件功能
 * @FilePath: /xj-mini-vue/src/reactivity/tests/readonly.test.ts
 */
import { isProxy, isReactive, isReadonly, readonly } from '../reactive';

describe('readonly测试开始', () => {
  it('happy path', () => {
    // not set
    const original = { foo: 1, bar: { baz: 2 } };
    const wrapped = readonly(original);
    expect(wrapped).not.toBe(original);
    expect(wrapped.foo).toBe(1);

    // 测试isReadonly
    expect(isReadonly(wrapped)).toBe(true);
    expect(isReadonly(original)).toBe(false);

    // 测试嵌套内容是否是readonly
    expect(isReadonly(wrapped.bar)).toBe(true);
    // 没想到啊，你这个浓眉大眼的也被背叛了
    expect(isReactive(wrapped.bar)).toBe(false);
    
    expect(isProxy(wrapped)).toBe(true);
    expect(isProxy(original)).toBe(false);
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
