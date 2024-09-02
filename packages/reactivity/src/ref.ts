import { hasChange } from '@vue/shared';
import { Track, trigger } from './effect';
import { TrackOpType, TriggerOpType } from './operations';

export function ref(target) {
  return createRef(target);
}

export function shallowRef(target) {
  return createRef(target, true)
}

class RefImpl {
  public __v_isRef = true;
  public _value
  constructor(public rawValue, public isShaow) {
    // this.target = target;
    this._value = rawValue;
  }

  get value() {
    Track(this, TrackOpType.GET, 'value')
    return this._value;
  }

  set value(newValue) {
    if(hasChange(newValue, this._value)) {
      this._value = newValue;
      this.rawValue = newValue;
      trigger(this,TriggerOpType.SET, 'value', newValue)
    }
  }
}

function createRef(target, isShallow=false) {
  return new RefImpl(target,isShallow);
}

