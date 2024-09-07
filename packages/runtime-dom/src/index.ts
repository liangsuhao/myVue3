import { patchProps } from './patchprop';
import { nodeOps } from './nodeOps';

export const renderOptionDom = {patchProps, ...nodeOps};