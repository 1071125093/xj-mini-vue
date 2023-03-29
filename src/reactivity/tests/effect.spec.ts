import { reactive } from '../reactive';
import { effect } from '../effect';
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
});
