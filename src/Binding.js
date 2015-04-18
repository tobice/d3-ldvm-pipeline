import d3 from 'd3'
import {createElement} from './misc.js'

export default class Binding {
    constructor(source, sourceUri, target, targetUri, type) {
        this.source = source;
        this.sourceUri = sourceUri;
        this.target = target;
        this.targetUri = targetUri;
        this.type = type;
    }

    d() {
        // Get the port coordinates relative to the component
        let sourcePort = this.source.getPortCoords(this.sourceUri),
            targetPort = this.target.getPortCoords(this.targetUri);

        // Calculate the final real cordinates of target and source by combining the component
        // position and the relative port position
        let source = { x: this.source.x + sourcePort.x, y: this.source.y + sourcePort.y },
            target = { x: this.target.x + targetPort.x, y: this.target.y + targetPort.y };

        let dx = target.x - source.x,
            dy = target.y - source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
        return "M" + source.x + "," + source.y + "A" + dr + "," + dr + " 0 0,1 " + target.x + "," + target.y;
    }

    render() {
        return createElement('path')
            .attr('class', 'link ' + this.type)
            .attr('marker-end', 'url(#' + this.type + ')')
            .node();
    }
}