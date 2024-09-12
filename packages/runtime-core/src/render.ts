import { shapeFlags } from "@vue/shared";
import { ApiCreateApp } from "./apiCreateApp";
import { createComponentInstance, setupComponent } from "./component";
import { effect } from "@vue/reactivity";

export function createRender(renderOptionDom) {
    const {
        createElement: hostCreateElement,
        patchprop: hostPatchProp,
        insert: hostIsert
    } = renderOptionDom;
    function setupRenderEffect(instance, container) {
        // 创建effect
        effect(function componentEffect(){
            // 用effect将数据进行收集
            if(!instance.isMounted) {
                // 获取到render的返回值
                let proxy = instance.proxy;
                let subTree = instance.render.call(proxy, proxy);
                // 渲染元素
                patch(null, subTree, container)
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

    const mountElement = (vnode, container) => {
        const {props, shapeFlag, type, children} = vnode;
        // 创建元素
        console.log("lsh", type)
        let el = hostCreateElement(type);
        // 添加属性
        if(props) {
            for(let key in props) {
                hostPatchProp(el, key, null, props[key]);
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

    const patch = (n1, n2, container) => {
        let { shapeFlag } = n2;
        if(shapeFlag && shapeFlag === shapeFlags.ELEMENT) {
            processElement(n1, n2, container);
        } else if(shapeFlag && shapeFlag === shapeFlags.STATEFUL_COMPONENT) {
            processComponent(n1, n2, container);
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