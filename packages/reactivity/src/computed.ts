import { isFunction } from "@vue/shared";
import { effect } from "./effect";

export function computed(obj) {
    if(isFunction(obj)) {
        return new ComputedRefImpl(obj, ()=>{});
    } else {
        return new ComputedRefImpl(obj.get, obj.set);
    }
}

class ComputedRefImpl {
    public _dirty = true;
    public _value;
    public effect;
    constructor(getter, setter) {
        this.effect = effect(getter, {
            lazy: true
        })
    }

    get value() {
        if(this._dirty) {
            this._value = this.effect();
            this._dirty = false;
        }

        return this._value;
    }

    // set value() {

    // }
}