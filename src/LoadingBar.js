import d3 from 'd3'
import {createElement} from './misc.js'

const WIDTH = 200;
const HEIGHT = 30;
const BORDER_RADIUS = 4;

export default class LoadingBar {
    constructor(start, threshold) {
        this.start = start;
        this.threshold = threshold;
        this.alpha = start;

        this._element = null;
    }

    render() {
        if (!this._element) {
            let g = createElement('g').attr('class', 'loading-bar');

            g.append(() => this._renderBar());
            g.append(() => this._renderLabel());

            this._element = g;
        }
        return this._element.node();
    }

    update() {
        if (this._element) {
            this._element.select('text')
                .text('Loading visualization...' + this._getProgressPercentage() + '%');
            this._element.select('.inner')
                .attr('width', this._getBarWidth());
        }
    }

    remove() {
        this._element.transition()
            .style('opacity', 0)
            .each('end', () => {
                this._element.remove();
                this._element = null;
            });
    }

    _renderLabel() {
        return createElement('text')
            .text('Loading visualization...' + this._getProgressPercentage() + '%')
            .attr('x', 0)
            .attr('y', 0)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .node();
    }

    _renderBar() {
        let g = createElement('g');

        g.append('rect')
            .attr('class', 'outer')
            .attr('width', WIDTH)
            .attr('height', HEIGHT)
            .attr('x', -WIDTH / 2)
            .attr('y', -HEIGHT / 2)
            .attr('rx', BORDER_RADIUS)
            .attr('ry', BORDER_RADIUS);

        g.append('rect')
            .attr('class', 'inner')
            .attr('width', this._getBarWidth())
            .attr('height', HEIGHT)
            .attr('x', -WIDTH / 2)
            .attr('y', -HEIGHT / 2)
            .attr('rx', BORDER_RADIUS)
            .attr('ry', BORDER_RADIUS);

        return g.node();
    }

    _getProgressPercentage() {
        return Math.round(100 * (this.start - this.alpha) / (this.start - this.threshold));
    }

    _getBarWidth() {
        return (this._getProgressPercentage() / 100) * WIDTH;
    }
}
