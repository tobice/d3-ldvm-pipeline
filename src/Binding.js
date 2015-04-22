import d3 from 'd3'
import {createElement} from './misc.js'

export default class Binding {
    constructor(data, sourcePort, targetPort) {
        this.data = data;
        this.sourcePort = sourcePort;
        this.targetPort = targetPort;

        // Required for the d3.force layout
        this.source = sourcePort.component;
        this.target = targetPort.component;

        this.rank = targetPort.rank;

        this._element = null;
    }

    render() {
        if (!this._element) {
            this._element = createElement('line')
                .attr('class', 'ldvm-link ldvm-' + this.data.type)
                .attr('marker-end', 'url(#' + this.data.type + ')');
        }
        return this._element.node();
    }

    update() {
        if (this._element) {
            // Get the port coordinates relative to the component
            let sourcePort = this.source.getPortCoords(this.sourcePort.uri),
                targetPort = this.target.getPortCoords(this.targetPort.uri);

            // Calculate the final real coordinates of target and source by combining the component
            // position and the relative port position
            let source = {x: this.source.x + sourcePort.x, y: this.source.y + sourcePort.y},
                target = {x: this.target.x + targetPort.x, y: this.target.y + targetPort.y};

            this._element
                .attr('x1', source.x)
                .attr('y1', source.y)
                .attr('x2', target.x)
                .attr('y2', target.y);
        }

    }
}