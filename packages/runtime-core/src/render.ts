import { ApiCreateApp } from "./apiCreateApp";

export function createRender(renderOptionDom) {
    const render = (vnode, container) => {

    }

    return {
        createApp: ApiCreateApp(render)
    };
}