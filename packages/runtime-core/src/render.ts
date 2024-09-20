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
        setElementText: hostSetElementText,
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

    const mountElement = (vnode, container, ancher=null) => {
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
        hostIsert(el, container, ancher);
    }

    const processElement = (n1, n2, container, ancher=null) => {
        if(n1 === null) {
            mountElement(n2, container, ancher);
        } else {
            //更新，先比对属性
            patchElement(n1, n2, container, ancher);
        }
    }

    const processText = (n1, n2, container) => {
        if(n1 === null) {
            hostIsert(n2.el=hostCreateTextElement(n2.children), container);
        }
    }

    const patchElement = (n1, n2, container, ancher=null) => {
        const el = (n2.el = n1.el);
        const oldProps = n1.props || {};
        const newProps = n2.props || {};
        patchProps(el, oldProps, newProps);
        patchChildren(n1, n2, el);
    }

    const patchProps = (el, oldProps, newProps) => {  // 比对props
        // 1.旧的有，新的没有
        // 2.新的有，旧的没有
        // 3.新的旧的都有
        if(oldProps !== newProps) {
            for(let key in newProps) {
                const prev = oldProps[key];
                const next = newProps[key];
                if(prev !== next) {
                    hostPatchProp(el, key, prev, next);
                }
            }
        }

        for(let key in oldProps) {
            if(!newProps[key]) {
                hostPatchProp(el, key, oldProps[key], null);
            }
        }
    }

    const patchChildren = (n1, n2, el) => {
        const c1 = n1.children;
        const c2 = n2.children;
        // 1.旧的有children，新的没有children 2.新的有children，旧的没有 3.都有且children都是文本 4.都有且children是数组
        const pervShapeFlag = n1.shapeFlag;
        const nextShapeFlag = n2.shapeFlag;
        if(nextShapeFlag & shapeFlags.TEXT_CHILDREN) { //全是文本，直接进行替换
            hostSetElementText(el, c2);
        } else { // 不是文本，是数组
            if(pervShapeFlag & shapeFlags.ARRAY_CHILDREN) { //都有且都是数组
                patchKeyChildren(c1, c2, el);
            } else { // 旧的是文本
                // 删除文本，添加数组
                hostSetElementText(el, '');
                mountChildren(el, c2);
            }
        }
    }

    // 最长递增子序列
    function getSequence(arr) {
        let len = arr.length;
        let start, end, middle;
        const result = [0];
        const p = arr.slice();
        for(let i = 1 ; i < len ; i++) {
            if(arr[i] !== 0) {
                const lastIndex = result[result.length - 1];
                if(arr[i] > arr[lastIndex]) {
                    p[i] = lastIndex;
                    result.push(i);
                    continue;
                }
                // 二分查找替换
                start = 0;
                end = result.length - 1;
                while(start < end) {
                    middle = Math.floor((start + end) / 2);
    
                    if(arr[result[middle]] < arr[i]) {
                        start = middle + 1;
                    } else {
                        end = middle;
                    }
                }
                // 找到对应的位置
                if(arr[i] < arr[result[start]]) {
                    if(start > 0) {
                        p[i] = result[start-1];
                    }
                    result[start] = i;
                }
            }
        }
    
        // 循环获取数据
        let len1 = result.length;
        let last = result[len1-1];
        while(len1--) {
            result[len1] = last;
            last = p[last];
        }
        return result;
    }

    /**
     * 儿子都是数组的情况
     */
    const patchKeyChildren = (c1, c2, el) => {
        // vue2双指针  vue3
        let i = 0 ;
        let e1 = c1.length - 1;
        let e2 = c2.length - 1;
        // sync from start： 头部比对
        while(i<=e1 && i<=e2) {
            const n1 = c1[i];
            const n2 = c2[i];
            if(isSameVnode(n1, n2)) {
                patch(n1, n2, el);
            } else {
                break;
            }
            i++;
        }

        while(i<=e1 && i<=e2) {
            const n1 = c1[e1];
            const n2 = c2[e2];
            if(isSameVnode(n1, n2)) {
                patch(n1, n2, el);
            } else {
                break;
            }
            e1--;
            e2--;
        }

        if(i > e1) {
            // 说明是节点变多，且要前追加
            const nextProps = e2 + 1; //插入的位置
            const ancher = nextProps < c2.length ? c2[nextProps].el : null; //判断插入的地方是头还是尾
            while(i <= e2) {
                patch(null, c2[i++], el, ancher)
            }
        } else if (i > e2) { //说明节点变少
            while(i <= e1) {
                unmount(c1[i++]);
            }
        } else {
            //说明是乱序，新建map进行存储。随后在map中找，能找到的话就复用否则添加
            const keyIndexMap = new Map();
            let s1 = i, s2 = i;
            const patchNum = e2 - s2 + 1;
            const indexToPatchMap = new Array(patchNum).fill(0);
            for(let j = s2; j <= e2; j++) {
                const childNode = c2[j];
                keyIndexMap.set(childNode.key, j);
            }
            for(let j = s1; j <= e1; j++) {
                const childNode = c1[j];
                const keyIndex = keyIndexMap.get(childNode.key);
                if(keyIndex === undefined) {
                    unmount(childNode);
                } else {
                    indexToPatchMap[keyIndex - s2] = j + 1;
                    patch(childNode, c2[keyIndex], el)
                }
            }

            const increaseArr = getSequence(indexToPatchMap);
            let k = increaseArr.length - 1;
            for(let j = patchNum -1; j>=0; j--) { //这里要倒叙进行添加，因为是insertbefor要先处理后一个元素
                let currentIndex = s2 + j;
                let child = c2[currentIndex];
                let ancher = currentIndex + 1 < c2.length ? c2[currentIndex + 1].el : null;
                if(indexToPatchMap[j] === 0) {
                    patch(null, child, el,ancher);
                } else {
                    if(j != increaseArr[k]) {
                        hostIsert(child.el, el, ancher);
                    } else {
                        k--;
                    }
                }
            }
        }
    }

    const isSameVnode = (vnode1, vnode2) => {
        return vnode1.type === vnode2.type && vnode1.key === vnode2.key;
    }

    const unmount = (vnode) => {
        hostRemove(vnode.el);
    }

    const patch = (n1, n2, container, ancher = null) => {
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
                    processElement(n1, n2, container, ancher);
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