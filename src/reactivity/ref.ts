import { hasChanged, isObject } from '../shared';
import { track, trackEffects, triggerEffects } from './effect';
import { reactive } from './reactive';

class RefImpl {
  private _value: any;
  private _rawValue: any;
  public dep;
  public __v_isRef = true;
  constructor(value) {
    this.updateValue(value);
    // 1.看看是不是对象
    this.dep = new Set();
  }
  get value() {
    trackEffects(this.dep);
    return this._value;
  }
  set value(value) {
    if (hasChanged(value, this._value)) {
      this.updateValue(value);
      triggerEffects(this.dep);
    }
  }
  private updateValue(value) {
    this._rawValue = value;
    this._value = isObject(value) ? reactive(value) : value;
  }
}

export function ref(value) {
  return new RefImpl(value);
}
export function isRef(ref) {
  return Boolean(ref.__v_isRef);
}
export function unRef(ref) {
  return isRef(ref) ? ref.value : ref;
}
