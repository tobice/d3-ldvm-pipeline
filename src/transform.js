import Component from './Component.js'
import Binding from './Binding.js'

/** Transform input data into internal format */
export default function transform(data) {
    let ports = {};

    let components = data.components.map(c => {
        let component = new Component(c, c.inputs, c.outputs);

        // Remember to which component each port belongs
        c.inputs.forEach((port, i) => {
            port.rank = i;
            port.component = component;
            ports[port.uri] = port;
        });
        c.outputs.forEach((port, i) => {
            port.rank = i;
            port.component = component;
            ports[port.uri] = port;
        });

        return component;
    });

    let bindings = data.bindings.map(b =>
        new Binding(b, ports[b.sourceUri], ports[b.targetUri]));

    return {components: components, bindings: bindings};
}