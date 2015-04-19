import d3 from 'd3'

export function createElement(name) {
    return d3.select(document.createElementNS('http://www.w3.org/2000/svg', name));
}

/** Returns position of the selected element, relative to the whole page. */
export function realPosition(d3Select) {
    if (!d3Select) {
        return { x: 0, y: 0 };
    }

    return {
        x: d3Select.node().getBoundingClientRect().left + document.body.scrollLeft,
        y: d3Select.node().getBoundingClientRect().top + document.body.scrollTop
    }
}