import { createVode } from "./vnode";

export function ApiCreateApp(render) {
    return function createApp(rootComponent, rootProps) {
        let app = {
            _component: rootComponent,
            _props: rootProps,
            _container: null,

            mount(container) {
                let vNode = createVode(rootComponent, rootProps);

                render(vNode, container);
            }
        }
        return app;
    }
}