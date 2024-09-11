// createVode和h函数作用一样
// 区分是组件还是元素

import { isArray, isObject, isString, shapeFlags } from "@vue/shared";

// 创建vnode，区分
export const createVode = (type, props, children= null) => {
    //vnode {}
    let shapeFlag = isString(type) ? shapeFlags.ELEMENT : isObject(type) ? shapeFlags.STATEFUL_COMPONENT : 0;
    const vnode = {
        _v_isVnode : true,
        type,
        props,
        children,
        key: props && props.key, //diff会用到
        el: null, //与真实dom一一对应
        shapeFlag,
        component: {},
    }
    // 儿子也需要标识
    normalizeChildren(vnode, children);

    return vnode;
}

function normalizeChildren(vnode, children) {
    let type = 0;
    if(!children) {

    } else if(isArray(children)) {
        type = shapeFlags.ARRAY_CHILDREN;
    } else {
        type = shapeFlags.TEXT_CHILDREN;
    }
    vnode.shapeFlag = vnode.shapeFlag | type;
}

export function isVnode(vnode) {
    return vnode._v_isVnode;
}