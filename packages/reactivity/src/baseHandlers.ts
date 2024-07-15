import { isObject } from "@vue/shared";
import { reactive, readonly } from "./reactive";

function createGetter(isReadOnly=false, isShallow=false) {
    return function get(target, key, receiver) {
        const res = Reflect.get(target, key, receiver);

        if(!isReadOnly){}

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