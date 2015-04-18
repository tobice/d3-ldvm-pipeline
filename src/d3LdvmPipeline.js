import d3 from 'd3'

import styles from './styles.css'
import transform from './transform.js'
import {VISUALIZER, DATASOURCE} from './consts.js'

export default function d3LdvmPipeline() {
    let width = 1800;
    let height = 700;

    let my = selection => selection.each(function (data) {
        // Note: can't use arrow function here because I need the value of this to contain the
        // selected parent DOM node set by D3.js. Arrow functions behave differently as they
        // automatically take this value from the outside context.

        // Transform input data into our internal format
        let {components, bindings} = transform(data);

        // Init the force layout
        let force = d3.layout.force()
            .nodes(components)
            .links(bindings)
            .size([width, height])
            .linkDistance(200)
            .charge(-600)
            .on('tick', tick)
            .start();

        // Select the svg element, if it exists, or create, if it doesn't
        let svg = d3.select(this).append('svg')
            .attr('width', width)
            .attr('height', height);

        // Per-type markers, as they don't inherit styles.
        svg.append('defs').selectAll('marker')
            .data(['suit', 'licensing', 'resolved'])
            .enter().append('marker')
            .attr('id', d => d)
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 15)
            .attr('refY', -1.5)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M0,-5L10,0L0,5');


        let bindingSelection = svg.append('g')
            .selectAll('path')
            .data(force.links())
            .enter()
            .append(binding => binding.render());

        let componentSelection = svg.append('g')
            .selectAll('.component')
            .data(force.nodes())
            .enter()
            .append(component => component.render())
            .call(force.drag);

        function tick(e) {
            // Push source components to the left and target to the right
            var k = 50 * e.alpha;
            bindings.forEach(binding => {
                binding.source.x -= k;
                binding.target.x += k;
            });

            // Push datasources to the left and visualizers to the right
            components
                .filter(component => component.type == DATASOURCE)
                .forEach(component => component.x -= k);
            components
                .filter(component => component.type == VISUALIZER)
                .forEach(component => component.x += k);

            // Update positions
            bindingSelection.attr('d', binding => binding.d());
            componentSelection.attr('transform', component => component.transform());
        }
    });

    /// chainable setters & getters
    let _ = () => my;
    my.width = value => (value === undefined) ? width : _(width = value);
    my.height = value => (value === undefined) ? height : _(height = value);

    return my;
}

