let b = 1;

export { b };

export function isObject(target) {
    return typeof target === 'object' && target != null;
}