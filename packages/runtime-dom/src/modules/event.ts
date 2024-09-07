export const patchEvent = (el, key, value) => {
    const invokers = el._vei || (el._vei = {});
    const eventName = key.slice(2).toLowerCase();
    const invoker = invokers[eventName];
    if(invoker && value) {
        invoker.value = value;
    } else {
        if(value) {
            invokers[eventName] = createInvoker(value);
            el.addEventListener(eventName, invokers[eventName]);
        } else {
            invokers[eventName] = null;
            el.removeEventListener(eventName);
        }
    }
}

function createInvoker(value) {
    const invoker = (e) => {
        invoker.value(e);
    }
    invoker.value = value;
    return invoker;
}