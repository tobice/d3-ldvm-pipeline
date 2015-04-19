import d3 from 'd3'

let label = 'Default label';
let uri = '';
let content = 'Default content';
let x = 0;
let y = 0;

let element = null;

// Tooltip will work as a singleton
let tooltip = () => { };

tooltip.render = () => {
    element = d3.select(document.createElement('div'))
        .attr('class', 'ldvm-tooltip');

    element.append('div').attr('class', 'ldvm-tooltip-label');
    element.append('div').attr('class', 'ldvm-tooltip-uri');
    element.append('div').attr('class', 'ldvm-tooltip-content');

    return element.node();
};

tooltip.show = () => {
    if (!element) return;

    element.select('.ldvm-tooltip-label').html(label);
    element.select('.ldvm-tooltip-uri').html(uri);
    element.select('.ldvm-tooltip-content').html(content);

    element.transition()
        .duration(200)
        .style('top', y + 'px')
        .style('left', x + 'px')
        .style('opacity', 1);
};

tooltip.hide = () => {
    if (!element) return;

    element.transition()
        .duration(200)
        .style('opacity', 0);
};

/// chainable setters & getters
let _ = () => tooltip;
tooltip.label = value => (value === undefined) ? label : _(label = value);
tooltip.uri = value => (value === undefined) ? uri : _(uri = value);
tooltip.content = value => (value === undefined) ? content : _(content = value);
tooltip.x = value => (value === undefined) ? x : _(x = value);
tooltip.y = value => (value === undefined) ? y : _(y = value);

export default tooltip;
