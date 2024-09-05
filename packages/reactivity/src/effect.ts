import { isArray, isIntegerKey } from '@vue/shared';
import { TriggerOpType } from './operations';

export function effect(fn, options: any = {}) {
    const effect = createReactEffect(fn, options);

    if (!options.lazy) {
        effect();
    }

    return effect;
}

let uid = 0, effectStack = []; //用栈型结构来解决effect嵌套的问题
let activeEffect;
function createReactEffect(fn, options) {
    const effect = function reactiveEffect() {
        if (!effectStack.includes(effect)) {
            try {
                effectStack.push(effect);
                activeEffect = effect;
                return fn();
            } finally {
                effectStack.pop();
                activeEffect = effectStack[effectStack.length - 1];
            }
        }
    }

    effect.id = uid++; //effect的唯一标识
    effect._isEffect = true; //标识effect是否是响应式的
    effect.raw = fn; //保存用户的方法
    effect.option = options; //保存用户的属性

    return effect;
}

const targetMap = new WeakMap();
export function Track(target, type, key) {
    // 在使用的时候type 一一对应
    if (activeEffect === undefined) { //说明这个变量没有被收集
        return;
    }

    let depMap = targetMap.get(target);
    if (!depMap) {
        targetMap.set(target, (depMap = new Map))
    }

    let dep = depMap.get(key); //拿到属性
    if (!dep) {
        depMap.set(key, (dep = new Set));
    }

    if (!dep.has(activeEffect)) {
        dep.add(activeEffect);
    }
}

export function trigger(target, type, key, newValue?, oldValue?) {
    const depMap = targetMap.get(target);
    if (!depMap) {
        return;
    }

    //这里使用set来对依赖进行去重
    const effectSet = new Set();
    const add = (effectAdd) => {
        if (effectAdd) {
            effectAdd.forEach(element => {
                effectSet.add(element);
            });
        }
    }
    //触发数组更新
    if(key === 'length' && isArray(target)) {
        depMap.forEach((dep, kk)=>{
            if(kk === 'length' || kk > newValue) {
                add(dep);
            }
        })
    } else {
        console.log("lsh",depMap, target, key)
        if(key!==undefined) {
            add(depMap.get(key));
        }
        //处理数组更新
        switch (type) {
            case TriggerOpType.ADD:
                if(isArray(target) && isIntegerKey(key)) {
                    console.log("lsh", target, key)
                    add(depMap.get('length'));
                }
        }
    }

    // 执行
    effectSet.forEach((effect: any)=>effect())
}