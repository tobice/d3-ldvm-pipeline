import d3 from 'd3'
import {createElement} from './misc.js'

export default class Marker {
    constructor(size, type) {
        this.size = size;
        this.type = type;
    }

    render() {
        let marker = createElement('marker')
            .attr('id', this.type)
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 15)
            .attr('refY', -1.5)
            .attr('markerWidth', this.size)
            .attr('markerHeight', this.size)
            .attr('orient', 'auto');

        marker.append('path')
            .attr('d', 'M0,-5L10,0L0,5');

        return marker.node();
    }
}