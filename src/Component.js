import d3 from 'd3'
import {createElement} from './misc.js'

const SIZE = 70;
const PORT_SIZE = 10;
const BORDER_RADIUS = 8;

export default class Component {

    constructor(name, type, inputs, outputs) {
        this.name = name;
        this.type = type;
        this.inputs = inputs;
        this.outputs = outputs;

        this._element = null;
    }

    render() {
        if (!this._element) {
            let g = createElement('g')
                .attr('class', 'component');

            g.style('opacity', 0)
                .transition()
                .style('opacity', 1);

            g.append(() => this._renderLabel());
            g.append(() => this._renderBody());

            this.inputs.forEach((port) => g.append(() => this._renderInput(port)));
            this.outputs.forEach((port) => g.append(() => this._renderOutput(port)));

            this._element = g;
        }

        return this._element.node();
    }

    update() {
        if (this._element) {
            this._element.attr('transform', 'translate(' + this.x + ',' + this.y + ')');
        }
    }

    _renderLabel() {
        return createElement('text')
            .text(this.name)
            .attr('x', 0)
            .attr('y', SIZE / 2 + 10)
            .attr('text-anchor', 'middle')
            .node();
    }

    _renderBody() {
        return createElement('rect')
            .attr('class', 'component-body component-' + this.type)
            .attr('width', SIZE)
            .attr('height', SIZE)
            .attr('x', -SIZE/2)
            .attr('y', -SIZE/2)
            .attr('rx', BORDER_RADIUS)
            .attr('ry', BORDER_RADIUS)
            .node();
    }

    _renderInput(port) {
        return this._renderPort(this.getInputCoords(port), port);
    }

    _renderOutput(port) {
        return this._renderPort(this.getOutputCoords(port), port);
    }

    _renderPort(coords, port) {
        return createElement('circle')
            .attr('class', 'component-port')
            .attr('cx', coords.x)
            .attr('cy', coords.y)
            .attr('r', PORT_SIZE / 2)
            .node();
    }

    getInputCoords(input) {
        return {
            x: -SIZE / 2,
            y: this.getPortY(this.inputs.indexOf(input), this.inputs.length)
        }
    }

    getOutputCoords(output) {
        return {
            x: SIZE / 2,
            y: this.getPortY(this.outputs.indexOf(output), this.outputs.length)
        }
    }

    getPortY(i, count) {
        let p = SIZE / count;
        return (-SIZE/2) + i * p + p / 2;
    }

    getPortCoords(uri) {
        let port;
        if (port = this.findPortByUri(this.inputs, uri)) {
            return this.getInputCoords(port);
        } else if (port = this.findPortByUri(this.outputs, uri)) {
            return this.getOutputCoords(port);
        } else {
            throw new Error('Port does not exist: ' + uri);
        }
    }

    findPortByUri(ports, uri) {
        let result = ports.filter(port => port.uri == uri);
        return result.length > 0 ? result[0] : false;
    }
}