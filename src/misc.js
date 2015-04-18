import d3 from 'd3'

export function createElement(name) {
    return d3.select(document.createElementNS('http://www.w3.org/2000/svg', name));
}