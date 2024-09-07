export const patchStyle = (el, prev, next) => {
    const style = el.style;
    if (next == null) {
        el.removeAttribute('style');
    } else {
        for(let key in prev) {
            if(next[key] == null) {
                style[key] = ''
            }
        }

        for(let key in next) {
            style[key] = next[key];
        }
    }
}