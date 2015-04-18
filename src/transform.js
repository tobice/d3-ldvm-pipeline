import Component from './Component.js'
import Binding from './Binding.js'

/** Transform input data into internal format */
export default function transform(data) {
    let ports = {};

    let components = data.components.map(c => {
        let component = new Component(c.label, c.type, c.inputs, c.outputs);

        // Remember to which component each port belongs
        c.inputs.forEach(port => ports[port.uri] = component);
        c.outputs.forEach(port => ports[port.uri] = component);

        return component;
    });

    let bindings = data.bindings.map(b =>
        new Binding(ports[b.sourceUri], b.sourceUri, ports[b.targetUri], b.targetUri, 'resolved'));

    return {components: components, bindings: bindings};
}