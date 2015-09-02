import Component from './Component.js'
import Binding from './Binding.js'

/** Transform input data into internal format */
export default function transform(data) {
    let ports = {};

    let components = (data.components || []).map(c => {
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

    let bindings = (data.bindings || []).map(b => {
        if (!ports[b.sourceUri] || !ports[b.targetUri]) {
            console.log("Inconsistent data: binding is trying to connect non-existent components");
            return null;
        }

        let binding = new Binding(b, ports[b.sourceUri], ports[b.targetUri]);

        // Remember of which binding is the port member
        binding.sourcePort.binding = binding.targetPort.binding = binding;

        return binding;
    }).filter(b => b);

    return {components, bindings};
}