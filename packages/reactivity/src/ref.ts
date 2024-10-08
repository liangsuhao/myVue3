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
        if (hasChange(newValue, this._value)) {
            this._value = newValue;
            this.rawValue = newValue;
            trigger(this, TriggerOpType.SET, 'value', newValue)
        }
    }
}

function createRef(target, isShallow = false) {
    return new RefImpl(target, isShallow);
}

class ObjectRefImpl {
    public __v_isRef = true;
    constructor(public target, public key) {

    }

    get value() {
        return this.target[this.key];
    }

    set value(newValue) {
        this.target[this.key] = newValue;
    }
}

export function toRef(target, key) {
    return new ObjectRefImpl(target, key)
}

export function toRefs(target) {
    let newObj = Array.isArray(target) ? new Array(target.length) : {};
    for (let i in target) {
        newObj[i] = toRef(target, i);
    }
    return newObj;
}
