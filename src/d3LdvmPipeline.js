import d3 from 'd3'

import styles from './styles.css'
import transform from './transform.js'
import Marker from './Marker.js'
import tooltip from './tooltip.js'
import makeTree from './makeTree.js'
import treeLayout from './treeLayout.js'

export default function d3LdvmPipeline() {
    let width = 1800;
    let height = 700;
    let componentSize = 70;
    let componentTypes = ['suit', 'licensing', 'resolved'];

    let my = selection => selection.each(function (data) {
        // Note: can't use arrow function here because I need the value of 'this' to contain the
        // selected parent DOM node set by D3.js. Arrow functions behave differently as they
        // automatically take 'this' value from the outside context.

        // Transform input data into our internal format
        let {components, bindings} = transform(data);

        let DOMElement = d3.select(this);
        let svg = initSvg();
        let markers = componentTypes.map(type => new Marker(componentSize / 10, type));

        // Init tooltip
        DOMElement.append(() => tooltip.render());

        makeLayout();
        render();
        update();

        function initSvg() {
            return DOMElement.append('svg')
                .attr('class', 'ldvm')
                .attr('width', width)
                .attr('height', height);
        }

        function makeLayout() {
            let tree = makeTree(components, bindings);
            treeLayout()
                .width(width)
                .height(height)
                .nodeSize(componentSize)
                .run(tree);
        }

        function render() {
            components.forEach(component => component.size(componentSize));

            svg.append('defs').selectAll('marker')
                .data(markers)
                .enter()
                .append(marker => marker.render());

            svg.append('g')
                .selectAll('path')
                .data(bindings)
                .enter()
                .append(binding => binding.render());

            svg.append('g')
                .selectAll('.ldvm-component')
                .data(components)
                .enter()
                .append(component => component.render());
        }

        function update() {
            components.forEach(component => component.update());
            bindings.forEach(binding => binding.update());
        }
    });

    /// chainable setters & getters
    let _ = () => my;
    my.width = value => (value === undefined) ? width : _(width = value);
    my.height = value => (value === undefined) ? height : _(height = value);
    my.nodeSize = value => (value === undefined) ? componentSize : _(componentSize = value);
    my.componentTypes = value => (value === undefined) ? componentTypes : _(componentTypes = value);

    return my;
}

