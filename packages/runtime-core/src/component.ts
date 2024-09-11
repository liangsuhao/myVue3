import { isFunction, isObject, shapeFlags } from "@vue/shared";
import { componentPublicInstance } from "./componentPublicInstance";

export const createComponentInstance = (vnode) => {
    // 就是一个对象
    const instance = {
        vnode,
        type: vnode.type,
        props: {}, //组件的属性
        attrs: {}, 
        setupState: {},
        ctx: {}, //进行代理的
        proxy: {},
        render: null,
        isMounted: false,
    }
    instance.ctx = {_: instance};
    return instance;
}

export const setupComponent = (instance) => {
    instance.proxy = new Proxy(instance.ctx, componentPublicInstance)
    const { childeren, props } = instance.vnode;
    instance.props = props;  //initprops
    instance.children = childeren;  //init children
    // 看一下组件有没有setup （有状态的组件）
    let shapeFlag = instance.vnode.shapeFlag & shapeFlags.STATEFUL_COMPONENT;
    if(shapeFlag) {
        setupStateComponent(instance)
    }

}

const setupStateComponent = (instance) => {
    // setup 返回值是我们render函数的参数
    let component = instance.type;
    let { setup } = component;
    
    if(setup) {
        const setupContext = createContext(instance);
        let setupResult = setup(instance.props, setupContext);
        //setup返回值是对象或者函数
        handleSetupResult(instance, setupResult);
    } else {
        finishComponentSetup(instance);
    }
    
}

const handleSetupResult = (instance, setupResult) => {
    // 处理setup返回值
    if(isFunction(setupResult)) {
        instance.render = setupResult;
    } else if(isObject(setupResult)) {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}

const finishComponentSetup = (instance) => {
    let component = instance.type;
    if(!instance.render) {
        if(!component.render && component.template) {
            //模板 -> render
        }
        instance.render = component.render;
    }
}

const createContext = (instance) => {
    return {
        attrs: instance.attrs,
        slots: instance.slots,
        emit: ()=>{},
        expose: ()=>{}
    }
}