import {isObject} from "@vue/shared"

const reactiveHandlers = {};
const shallowReactiveHandlers = {};
const readonlyHandlers = {};
const shallowReadonlyHandlers = {};

export function reactive(target) {
    return createReactObj(target, false, reactiveHandlers)  // 高阶函数
}

export function shallowReactive(target) {
    return createReactObj(target, true, shallowReactiveHandlers)
}

export function readonly(target) {
    return createReactObj(target, false, readonlyHandlers)
}

export function shallowReadonly(target) {
    return createReactObj(target, true, shallowReadonlyHandlers)
}

const weakProxyMap = new WeakMap();
const weakReadonlyProxyMap = new WeakMap();
// 实现代理的核心方法
function createReactObj(target, isReadOnly, baseHandler) {
    if(!isObject(target)) {
        return target;
    } else {
        let proxyMap = isReadOnly ? weakReadonlyProxyMap : weakProxyMap;
        let newProxy = proxyMap.get(target);
        if(newProxy) {
            return newProxy;
        }
        let proxy = new Proxy(target, baseHandler);
        proxyMap.set(target, proxy);
        return proxy;
    }
}