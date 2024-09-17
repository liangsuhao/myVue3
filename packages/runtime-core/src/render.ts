import { shapeFlags } from "@vue/shared";
import { ApiCreateApp } from "./apiCreateApp";
import { createComponentInstance, setupComponent } from "./component";
import { effect } from "@vue/reactivity";
import { CVnode, TEXT } from './vnode';

export function createRender(renderOptionDom) {
    const {
        createElement: hostCreateElement,
        patchProps: hostPatchProp,
        remove: hostRemove,
        insert: hostIsert,
        createText: hostCreateTextElement,
    } = renderOptionDom;
    function setupRenderEffect(instance, container) {
        // 创建effect
        effect(function componentEffect(){
            // 用effect将数据进行收集
            if(!instance.isMounted) {
                // 获取到render的返回值
                let proxy = instance.proxy;
                let subTree = instance.subTree = instance.render.call(proxy, proxy);
                // 渲染元素
                patch(null, subTree, container);
                instance.isMounted = true;
            } else {
                const proxy = instance.proxy;
                const prevTree = instance.subTree;
                const newTree = instance.render.call(proxy, proxy);
                instance.subTree = newTree;
                patch(prevTree, newTree, container)
            }
        })
    }
    const mountComponent = (initialVnode, container) => {
        // 组件的渲染
        // 1. 现有一个实例对象
        const instance = initialVnode.component = createComponentInstance(initialVnode);
        // 2. 解析数据到这个实例对象
        setupComponent(instance);
        // 3. 创建一个effect 让render函数执行
        setupRenderEffect(instance, container);
    }

    const processComponent = (n1, n2, container) => {
        if(n1 === null) { //说明是第一次挂载
            mountComponent(n2, container);
        } else { //更新

        }
    }

    function mountChildren(el, children) {
        for(let i = 0 ; i < children.length; i++) {
            let vnode = CVnode(children[i]);
            patch(null, vnode, el);
        }
    }

    const mountElement = (vnode, container) => {
        const {props, shapeFlag, type, children} = vnode;
        // 创建元素
        let el = vnode.el = hostCreateElement(type);
        // 添加属性
        if(props) {
            for(let key in props) {
                hostPatchProp(el, key, null, props[key]);
            }
        }
        // 处理子元素
        if(children) {
            if(shapeFlag & shapeFlags.TEXT_CHILDREN) {
                const textnode = hostCreateTextElement(children);
                el.appendChild(textnode);
            } else if (shapeFlag & shapeFlags.ARRAY_CHILDREN) {
                mountChildren(el, children);
            }
        }
        // 插入对应的位置
        hostIsert(el, container);
    }

    const processElement = (n1, n2, container) => {
        if(n1 === null) {
            mountElement(n2, container);
        } else {
            //更新
        }
    }

    const processText = (n1, n2, container) => {
        if(n1 === null) {
            hostIsert(n2.el=hostCreateTextElement(n2.children), container);
        }
    }

    const isSameVnode = (vnode1, vnode2) => {
        return vnode1.type === vnode2.type && vnode1.key === vnode2.key;
    }

    const unmount = (vnode) => {
        hostRemove(vnode.el);
    }

    const patch = (n1, n2, container) => {
        let { shapeFlag, type } = n2;

        if(n1 && !isSameVnode(n1, n2)) {
            unmount(n1);
            n1 = null;
        }
        switch (type) {
            case TEXT: {
                processText(n1, n2, container);
                break
            } 
            default: {
                if(shapeFlag & shapeFlags.ELEMENT) {
                    processElement(n1, n2, container);
                } else if(shapeFlag & shapeFlags.STATEFUL_COMPONENT) {
                    processComponent(n1, n2, container);
                }
            }  
        }
    }

    const render = (vnode, container) => {
        // 将获取到的vnode挂载到对应的容器里
        patch(null, vnode, container);
    }

    return {
        createApp: ApiCreateApp(render)
    };
}