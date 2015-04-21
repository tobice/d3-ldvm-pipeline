import d3 from 'd3'

/** Tree layout based on the D3.js Tree layout */
export default function treeLayout() {
    let width = 1800;
    let height = 700;
    let nodeSize = 70;

    let my = () => {};

    my.run = (tree) => {
        if (!tree || !tree.children || tree.children.length == 0) return;

        // The D3 tree layout creates a tree oriented from the top to the bottom, but we need
        // the orientation to be from the right to the left.

        d3.layout.tree()
            .nodeSize([nodeSize, nodeSize])
            .separation((a, b) => nodeSize * (a.parent == b.parent ? 2 : 3))
            .size([height - nodeSize, width - nodeSize]) // flipped orientation + margin
            .nodes(tree);

        // As the root is not really an existing component, it won't be rendered. So we
        // calculate the distance between tree layers and we shift the whole tree to the
        // right by this distance to eliminate the white space taken up by the non existing
        // root. (We actually shift the whole visualisation only by a half of it to achieve
        // centering)
        let layerDistance = tree.children[0].y - tree.y;

        // Use BFS to cycle through components by layers
        let queue = [tree], ind = true;
        while (queue.length > 0) {
            let node = queue.shift();
            let {x, y} = node;

            // Flip orientation; shift by half of the layer distance; apply margin
            node.x = width - y + (layerDistance / 2) - (nodeSize / 2);
            node.y = x + (nodeSize / 2);

            // To avoid stacking of nodes, we shift nodes in each layer (that's why we need BFS)
            // alternately to the left and to the right by a small distance.
            node.x = node.x + (ind ? 1 : -1) * (nodeSize / 2) * 1.2;
            ind = !ind;

            queue = queue.concat(node.children || []);
        }
    };

    /// chainable setters & getters
    let _ = () => my;
    my.width = value => (value === undefined) ? width : _(width = value);
    my.height = value => (value === undefined) ? height : _(height = value);
    my.nodeSize = value => (value === undefined) ? componentSize : _(nodeSize = value);

    return my;
}