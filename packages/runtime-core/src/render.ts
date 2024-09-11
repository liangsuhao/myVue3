import { shapeFlags } from "@vue/shared";
import { ApiCreateApp } from "./apiCreateApp";
import { createComponentInstance, setupComponent } from "./component";
import { effect } from "@vue/reactivity";

export function createRender(renderOptionDom) {
    function setupRenderEffect(instance) {
        // 创建effect
        effect(function componentEffect(){
            // 用effect将数据进行收集
            if(!instance.isMounted) {
                // 获取到render的返回值
                let proxy = instance.proxy;
                instance.render.call(proxy, proxy)
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
        setupRenderEffect(instance);
    }

    const processComponent = (n1, n2, container) => {
        if(n1 === null) { //说明是第一次挂载
            mountComponent(n2, container);
        } else { //更新

        }
    }

    const patch = (n1, n2, container) => {
        let { shapeFlag } = n2;
        if(shapeFlag && shapeFlag === shapeFlags.ELEMENT) {
            
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