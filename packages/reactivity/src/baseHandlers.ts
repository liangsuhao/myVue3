import { hasOwn, isArray, isIntegerKey, isObject } from "@vue/shared";
import { reactive, readonly } from "./reactive";
import { TrackOpType } from './operations';
import { Track } from './effect';

function createGetter(isReadOnly=false, isShallow=false) {
    return function get(target, key, receiver) {
        const res = Reflect.get(target, key, receiver);

        if(!isReadOnly){
            Track(target, TrackOpType.GET, key);
        }

        if(isShallow) {
            return res;
        }

        if(isObject(res)) {
            return isReadOnly ? readonly(res) : reactive(res);
        }

        return res;
    }
}

function createSetter(isShallow?: any) {
    return function set(target, key, value, receiver) {
        const res = Reflect.set(target, key,value, receiver);
        // 1.判断是是数组还是对象 2.判断是新增还是修改
        const oldValue = target[key];
        const hasKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);

        if(!hasKey) { //说明是新增操作
            
        } else {
            // trigger(target);
        }
        return res;
    }
}

const get = createGetter();
const shalloweGet = createGetter(false, true);
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);

const set = createSetter();
const shalloweSet = createSetter(true);

const reactiveHandlers = {
    get,
    set
};
const shallowReactiveHandlers = {
    get: shalloweGet,
    set: shalloweSet
};
const readonlyHandlers = {
    get: readonlyGet,
    set: function(target,key,value) {
        console.log("不能够修改")
    }
};
const shallowReadonlyHandlers = {
    get: shallowReadonlyGet,
    et: function(target,key,value) {
        console.log("不能够修改")
    }
};

export {reactiveHandlers, shallowReactiveHandlers, readonlyHandlers, shallowReadonlyHandlers}