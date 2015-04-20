import loremIpsum from 'lorem-ipsum'
import {VISUALIZER, TRANSFORMER, DATASOURCE, ANALYZER} from './consts.js'

/** Generates random LDVM pipeline. */
export default function generate(componentsCount, visualizersCount, maxInputs, maxOutputs) {
    let components = [],  bindings = [], inputs = [];

    // Create visualizers
    seq(visualizersCount).forEach(() => {
        let v = component(VISUALIZER, maxInputs, 0);
        inputs = inputs.concat(v.inputs);
        components.push(v);
    });

    // Create inner components
    seq(componentsCount).forEach(() => {
        let c = component(null, maxInputs, maxOutputs);
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

function component(type, maxInputs, maxOutputs) {
    let _id = id();
    return {
        id: _id,
        uri: componentUri(_id),
        label: label(),
        htmlContent: 'Some <strong>html</strong> content',
        type: type || (randomInt(1) ? ANALYZER : TRANSFORMER),
        inputs: inputs(maxInputs),
        outputs: outputs(maxOutputs)
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

function inputs(max) {
    return randomSeq(max).map(port);
}

function outputs(max) {
    return randomSeq(max).map(port);
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
    if (!length) return [];
    return Array.apply(0, new Array(length)).map((_, i) => i);
}

function randomSeq(maxLength) {
    if (!maxLength) return [];
    // To make sure it's always at least one
    return seq(randomInt(maxLength - 1) + 1);
}

