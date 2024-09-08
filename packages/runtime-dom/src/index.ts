import { patchProps } from './patchprop';
import { nodeOps } from './nodeOps';

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

function createRender(renderOptionDom) {
    return {
        createApp:(rootComponent, rootProps) => {
            let app = {
                mount: (container) => {
                    console.log(container, rootComponent, rootProps, renderOptionDom);
                }
            }
            return app;
        }
    }
}