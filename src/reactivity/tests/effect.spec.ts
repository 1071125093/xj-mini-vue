/*
 * @Author: XiaoJun
 * @Date: 2023-04-03 12:41:09
 * @LastEditors: XiaoJun
 * @LastEditTime: 2023-04-03 13:33:15
 * @Description: 组件功能
 * @FilePath: /xj-mini-vue/src/reactivity/tests/effect.spec.ts
 */
import { reactive } from '../reactive';
import { effect, stop } from '../effect';
describe('effect', () => {
  it('happy path', () => {
    const user = reactive({
      age: 10
      // level: 1
    });
    let nextAge;
    effect(() => {
      nextAge = user.age + 1;
      console.log('页面A刷新');
    });
    effect(() => {
      console.log('页面B刷新');
    });

    expect(nextAge).toBe(11);

    // #info update时
    user.age++;
    expect(nextAge).toBe(12);
  });

  it('get runner', () => {
    let foo = 10;
    const runner = effect(() => {
      foo++;
      return `我是${foo}`;
    });
    expect(foo).toBe(11);
    const str = runner();
    expect(foo).toBe(12);
    expect(str).toBe('我是12');
  });
  it('scheduler', () => {
    // 一.通过effect 的第二个参数给定一个scheduler回调
    // 二.effect第一次执行时，还会执行fn
    // 三.当响应式触发effect时，执行scheduler而不是fn
    // 四.通过runner调用fn

    let dummy;
    let run;
    // received value must be a mock or spy function
    const scheduler = jest.fn(() => {
      run = runner;
    });
    const obj = reactive({
      foo: 1
    });
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      {
        scheduler
      }
    );
    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    // 三 更新obj , 触发trigger中的scheduler
    obj.foo++;
    expect(scheduler).toHaveBeenCalledTimes(1);
    // 四
    run();
    expect(dummy).toBe(2);
  });
  it('stop', () => {
    // 测试暂停
    let dummy;
    const obj = reactive({
      prop: 1
    });
    const runner = effect(() => {
      dummy = obj.prop;
    });
    obj.prop = 2;
    expect(dummy).toBe(2);
    stop(runner);
    obj.prop = 3;
    expect(dummy).toBe(2);

    runner();
    expect(dummy).toBe(3);
  });
  it('onStop', () => {
    // 测试top回调
  });
});
