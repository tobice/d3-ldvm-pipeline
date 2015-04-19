import d3 from 'd3'

import styles from './styles.css'
import transform from './transform.js'
import gravity from './gravity.js'
import LoadingBar from './LoadingBar.js'

// If the alpha value in the force layout gets bellow this value, the layout stops updating and
// becomes stable. These values are part of the force layout and cannot be changed (really?).
const D3_FORCE_ALPHA_THRESHOLD = 0.005;
const D3_FORCE_ALPHA_START = 0.1;

export default function d3LdvmPipeline() {
    let width = 1800;
    let height = 700;

    let my = selection => selection.each(function (data) {
        // Note: can't use arrow function here because I need the value of 'this' to contain the
        // selected parent DOM node set by D3.js. Arrow functions behave differently as they
        // automatically take 'this' value from the outside context.

        // Transform input data into our internal format
        let {components, bindings} = transform(data);

        let DOMElement = d3.select(this);
        let svg = initSvg();
        let force = initForce();
        let loadingBar = new LoadingBar(D3_FORCE_ALPHA_START, D3_FORCE_ALPHA_THRESHOLD);
        let rendered = false;

        // We wait until the layout stabilizes for the first time (the event 'end' is fired) and
        // only then we display the visualization. It saves up some CPU time and results in way
        // smoother user experience.
        showLoadingBar();
        force.on('end', () => {
            if (!rendered) {
                hideLoadingBar();
                render();
                update();
                rendered = true;
            }
        });
        force.start();

        function initSvg() {
            return DOMElement.append('svg')
                .attr('width', width)
                .attr('height', height);
        }

        function initForce() {
            return d3.layout.force()
                .nodes(components)
                .links(bindings)
                .size([width, height])
                .linkDistance(200)
                .charge(-600)
                .on('tick', tick);
        }

        function render() {
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


            svg.append('g')
                .selectAll('path')
                .data(force.links())
                .enter()
                .append(binding => binding.render());

            svg.append('g')
                .selectAll('.component')
                .data(force.nodes())
                .enter()
                .append(component => component.render())
                .call(force.drag);
        }

        function showLoadingBar() {
            svg.append(() => loadingBar.render())
                .attr('transform', 'translate(' + width / 2 + ', ' + height / 2 + ')');
        }

        function hideLoadingBar() {
            loadingBar.remove();
        }

        function update() {
            components.forEach(component => component.update());
            bindings.forEach(binding => binding.update());
            loadingBar.update();
        }

        function tick(e) {
            loadingBar.alpha = e.alpha;
            gravity(e.alpha, components, bindings);
            update();
        }
    });

    /// chainable setters & getters
    let _ = () => my;
    my.width = value => (value === undefined) ? width : _(width = value);
    my.height = value => (value === undefined) ? height : _(height = value);

    return my;
}

