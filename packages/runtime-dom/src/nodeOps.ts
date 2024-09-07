export const nodeOps = {
  createElement: tagName => document.createElement(tagName),
  remove: child => {
    let parent = child.parentNode;
    if(parent) {
      parent.removeChild(child);
    }
  },
  insert: (child,parent,ancher=null) => {
    parent.inserBefore(child);
  },
  querySelector: select => document.querySelector(select),
  setElementText: (el, text) => el.textContent = text,
  //关于文本的
  createText: text => document.createTextNode(text),
  setText: (node, text) => node.nodeValue = text,
}