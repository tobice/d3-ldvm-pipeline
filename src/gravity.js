import {VISUALIZER, DATASOURCE} from './consts.js'

export default function gravity(alpha, components, bindings) {
    var k = 50 * alpha;
    bindings.forEach(binding => {
        // Push source components to the left and target to the right
        binding.source.x -= k;
        binding.target.x += k;

        // Use rank to enforce the order of source components
        binding.source.y += binding.rank * (k/2);
    });

    // Push datasources to the left and visualizers to the right
    components
        .filter(component => component.type == DATASOURCE)
        .forEach(component => component.x -= k);
    components
        .filter(component => component.type == VISUALIZER)
        .forEach(component => component.x += k);

    // Normalize the whole visualization a little to the top left
    components.forEach(component => {
        component.x -= (k/4);
        component.y -= (k/4);
    });
}