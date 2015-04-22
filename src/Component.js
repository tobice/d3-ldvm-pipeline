import d3 from 'd3'
import tooltip from './tooltip.js'
import {createElement, realPosition} from './misc.js'

const BORDER_RADIUS = 8;

export default class Component {

    constructor(data, inputs, outputs) {
        this.data = data;
        this.inputs = inputs;
        this.outputs = outputs;

        this._size = 70;
        this._element = null;
    }

    render() {
        if (!this._element) {
            let g = createElement('g')
                .attr('class', 'ldvm-component');

            g.style('opacity', 0)
                .transition()
                .style('opacity', 1);

            g.append(() => this._renderLabel());
            g.append(() => this._renderBody());

            this.inputs.forEach((port) => g.append(() => this._renderInput(port)));
            this.outputs.forEach((port) => g.append(() => this._renderOutput(port)));

            g.on('mouseover', () => this._hightlightGroup(true));
            g.on('mouseout', () => this._hightlightGroup(false));

            this._element = g;
        }

        return this._element.node();
    }

    update() {
        if (this._element) {
            this._element.attr('transform', 'translate(' + this.x + ',' + this.y + ')');
        }
    }

    size(value) {
        if (value === undefined) return this._size;
        this._size = value;
        return this;
    }

    type() {
        return this.data.type;
    }

    highlight(value) {
        if (this._element) {
            this._element.select('.ldvm-component-body')
                .transition()
                .style('fill-opacity', value ? 1 : 0.7);
        }
    }

    _renderLabel() {
        return createElement('text')
            .text(this.data.label)
            .attr('class', 'ldvm-component-label')
            .attr('x', 0)
            .attr('y', this._size / 2 + 10)
            .attr('text-anchor', 'middle')
            .node();
    }

    _renderBody() {
        return createElement('rect')
            .attr('class', 'ldvm-component-body ldvm-component-' + this.data.type)
            .attr('width', this._size)
            .attr('height', this._size)
            .attr('x', -this._size/2)
            .attr('y', -this._size/2)
            .attr('rx', BORDER_RADIUS)
            .attr('ry', BORDER_RADIUS)
            .on('mouseover', () => tooltip
                .label(this.data.label)
                .uri(this.data.uri)
                .content(this.data.htmlContent)
                .x(realPosition(this._element).x)
                .y(realPosition(this._element).y + this._size)
                .show())
            .on('mouseout', () => tooltip.hide())
            .node();
    }

    _hightlightGroup(value) {
        this.highlight(value);
        this.inputs.forEach(input => input.binding.source.highlight(value));
        this.outputs.forEach(output => output.binding.target.highlight(value));
    }

    _renderInput(port) {
        return this._renderPort(this._getInputCoords(port), port);
    }

    _renderOutput(port) {
        return this._renderPort(this._getOutputCoords(port), port);
    }

    _renderPort(coords, port) {
        return createElement('circle')
            .attr('class', 'ldvm-component-port')
            .attr('cx', coords.x)
            .attr('cy', coords.y)
            .attr('r', this._getPortSize() / 2)
            .on('mouseover', () => tooltip
                .label(port.label)
                .uri(port.uri)
                .content('')
                .x(d3.event.pageX)
                .y(d3.event.pageY)
                .show())
            .on('mouseout', () => tooltip.hide())
            .node();
    }

    _getInputCoords(input) {
        return {
            x: -this._size / 2,
            y: this._getPortY(this.inputs.indexOf(input), this.inputs.length)
        }
    }

    _getOutputCoords(output) {
        return {
            x: this._size / 2,
            y: this._getPortY(this.outputs.indexOf(output), this.outputs.length)
        }
    }

    _getPortY(i, count) {
        let p = this._size / count;
        return (-this._size/2) + i * p + p / 2;
    }

    _getPortSize() {
        return this._size / 6;
    }

    getPortCoords(uri) {
        let port;
        if (port = this._findPortByUri(this.inputs, uri)) {
            return this._getInputCoords(port);
        } else if (port = this._findPortByUri(this.outputs, uri)) {
            return this._getOutputCoords(port);
        } else {
            throw new Error('Port does not exist: ' + uri);
        }
    }

    _findPortByUri(ports, uri) {
        let result = ports.filter(port => port.uri == uri);
        return result.length > 0 ? result[0] : false;
    }
}