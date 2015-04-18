import {VISUALIZER, DATASOURCE} from './consts.js'

export default function gravity(alpha, components, bindings) {
    // Push source components to the left and target to the right
    var k = 50 * alpha;
    bindings.forEach(binding => {
        binding.source.x -= k;
        binding.target.x += k;
    });

    // Push datasources to the left and visualizers to the right
    components
        .filter(component => component.type == DATASOURCE)
        .forEach(component => component.x -= k);
    components
        .filter(component => component.type == VISUALIZER)
        .forEach(component => component.x += k);
}