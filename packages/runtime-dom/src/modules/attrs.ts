export const patchAttr = (el, key, value) => {
    if (!value) {
        el.removeAttribute(key);
    } else {
        el.addAttribute(key, value);
    }
}