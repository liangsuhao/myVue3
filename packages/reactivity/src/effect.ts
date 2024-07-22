export function effect(fn, options: any = {}) {
  const effect = createReactEffect(fn, options);

  if(!options.lazy) {
    effect();
  }

  return effect;
}

function createReactEffect(fn, options) {
  const effect = function reactiveEffect() {
    fn();
  }

  return effect;
}