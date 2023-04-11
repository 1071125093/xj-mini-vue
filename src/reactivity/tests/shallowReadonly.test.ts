import { isReadonly, shallowReadonly } from '../reactive';

/*
 * @Author: XiaoJun
 * @Date: 2023-04-11 14:41:29
 * @LastEditors: XiaoJun
 * @LastEditTime: 2023-04-11 15:16:50
 * @Description: 组件功能
 * @FilePath: /xj-mini-vue/src/reactivity/tests/shallowReadonly.test.ts
 */
describe('shallowReadonly', () => {
  test('should not make non-reactive properties reactive', () => {
    const props = shallowReadonly({
      n: {
        foo: 1
      }
    });
    expect(isReadonly(props)).toBe(true);
    expect(isReadonly(props.n)).toBe(false);
    // 表层只读
  });
});
