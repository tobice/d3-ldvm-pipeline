import loremIpsum from 'lorem-ipsum'
import {VISUALIZER, TRANSFORMER, DATASOURCE, ANALYZER} from './consts.js'

/** Generates random LDVM pipeline. */
export default function generate(componentsCount, visualizersCount) {
    let components = [],  bindings = [], inputs = [];

    // Create visualizers
    seq(visualizersCount).forEach(() => {
        let v = component(VISUALIZER);
        v.outputs = [];
        inputs = inputs.concat(v.inputs);
        components.push(v);
    });

    // Create inner components
    seq(componentsCount).forEach(() => {
        let c = component();
        c.outputs.forEach(output => {
            if (inputs.length > 0) {
                bindings.push(binding(output, inputs.shift()));
            }
        });
        inputs = inputs.concat(c.inputs);
        components.push(c);
    });

    // Attach datasources to unused intputs
    inputs.forEach(input => {
        let c = component(DATASOURCE);
        let output = port();
        c.inputs = [];
        c.outputs = [output];
        bindings.push(binding(output, input));
        components.push(c);
    });

    return {components: components, bindings: bindings};
}

function component(type) {
    let _id = id();
    return {
        id: _id,
        uri: componentUri(_id),
        label: label(),
        htmlContent: 'Some <strong>html</strong> content',
        type: type || (randomInt(1) ? ANALYZER : TRANSFORMER),
        inputs: inputs(),
        outputs: outputs()
    }
}

function binding(source, target) {
    return {
        sourceId: source.id,
        targetId: target.id,
        sourceUri: source.uri,
        targetUri: target.uri,
        type: 'resolved'
    }
}

function id() {
    return randomInt(9999999);
}

function label() {
    return loremIpsum({count: 3, units: 'words'});
}

function componentUri(id) {
    return 'http://payola.viz/#component' + id;
}

function portUri(id) {
    return 'http://payola.viz/#port' + id;
}

function inputs() {
    return randomSeq(3).map(port);
}

function outputs() {
    return randomSeq(1).map(port);
}

function port() {
    let _id = id();
    return {
        id: _id,
        uri: portUri(_id),
        label: label()
    };
}

function randomInt(max) {
    return Math.round((Math.random() * max));
}

function seq(length) {
    return Array.apply(0, new Array(length)).map((_, i) => i);
}

function randomSeq(maxLength) {
    return seq(randomInt(maxLength - 1) + 1);
}

