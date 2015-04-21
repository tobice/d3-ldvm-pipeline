import {VISUALIZER} from './consts.js'

export default function makeTree(components, bindings) {

    // As the input pipeline doesn't have to be a strict tree (multiple visualizers, multiple
    // outputs per component) we have to create a "subgraph" that is a true tree so we can feed it to
    // the d3 tree layout.

    components.forEach(component => {
        component.children = [];
        component.parent = null;
    });
    bindings.forEach(binding => {
        // One component can have multiple outputs and therefore multiple parents, use only
        // the first one.
        if (!binding.source.parent) {
            binding.source.parent = binding.target;
            binding.target.children.push(binding.source);
        }
    });

    // Create an artificial node that will serve as a root having all visualizers as its children.
    let visualizers = components.filter(component => component.type() == VISUALIZER);
    let root = {
        children: visualizers,
        parent: null
    };
    visualizers.forEach(visualizer => visualizer.parent = root);

    return root;
}