import { patchProps } from './patchprop';
import { nodeOps } from './nodeOps';
import { createRender, h } from '@vue/runtime-core';

export const renderOptionDom = {patchProps, ...nodeOps};

export const createApp = (rootComponent, rootProps) => {
    let app = createRender(renderOptionDom).createApp(rootComponent, rootProps);
    let { mount } = app;
    app.mount = function(container) {
        container = nodeOps.querySelector(container);
        container.innerHTML = '';

        mount(container);
    }
    return app;
}

export * from "@vue/runtime-core";
export * from "@vue/reactivity";