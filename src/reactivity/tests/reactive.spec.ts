import { reactive } from '../reactive';
describe('reactive', () => {
  it('happy path', () => {
    const original = {
      foo: 1
    };
    const observed = reactive(original);
    // 值不相等
    expect(observed).not.toBe(original);
    expect(observed.foo).toBe(original.foo);
  });
});
