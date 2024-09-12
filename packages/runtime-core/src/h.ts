import { isObject } from "@vue/shared";
import { createVode, isVnode } from "./vnode";

export function h(type, propsOrChildren, children) { //变成vnode
    // 参数
    let len = arguments.length; //获取参数的个数
    if(len === 2) {
        // 元素 + 属性 || 元素 + children
        if(isObject(propsOrChildren)) {
            if(isVnode(propsOrChildren)) {
                return createVode(type, null, [propsOrChildren]);
            }
            return createVode(type, propsOrChildren);
        } else {
            return createVode(type, null, propsOrChildren);
        }
    } else {
        // h('div', {}, 1, 2, 3, 4)
        if(len > 3) {
            children = Array.prototype.slice.call(arguments, 2);
        } else if(len === 3 && isVnode(children)) {
            children = [children];
        }
        return createVode(type, propsOrChildren, children);
    }

}