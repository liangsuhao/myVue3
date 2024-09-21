import { currentInstance, setCurrentInstance } from "./component";

export enum LifeCycle {
    BEFOREMOUNT = 'bm',
    MOUNTED = 'M',
    BEFOREUPDATE = 'bu',
    UPDATED = 'u',
}

export const onBeforeMount = createHook(LifeCycle.BEFOREMOUNT);
export const onMounted = createHook(LifeCycle.MOUNTED);
export const onBeforeUpdate = createHook(LifeCycle.BEFOREUPDATE);
export const onUpdated = createHook(LifeCycle.UPDATED);

function createHook(lifecycle) {
    // 这里要能拿到当前组件的实例

    return function(hook, current = currentInstance) {
        // 生命周期跟hook产生关联
        injectHook(hook, lifecycle, current);
    }
}

function injectHook(hook, lifecycle, target) {
    if(!target) {
        return;
    }

    // 给这个实例添加生命周期
    const hooks = target[lifecycle] || (target[lifecycle] = []);
    const rap = () => {
        setCurrentInstance(target);
        hook();
        setCurrentInstance(null);
    }

    hooks.push(hook);  // hook是生命周期的方法
}

export function invokeArrayFns(fnArr) {
    fnArr.forEach(fn => fn());
}