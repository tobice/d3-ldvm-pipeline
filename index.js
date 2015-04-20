import d3 from 'd3'
import d3LdvmPipeline from './src/d3LdvmPipeline.js'
import generate from './src/generate.js'

const COMPONENTS_COUNT = 3;
const VISUALIZERS_COUNT = 1;
const MAX_INPUTS = 3;
const MAX_OUTPUTS = 1;

const WIDTH = 1800;
const HEIGHT = 700;
const COMPONENT_SIZE = 70;
const COMPONENT_TYPES = ['suit', 'licensing', 'resolved'];

const data = generate(COMPONENTS_COUNT, VISUALIZERS_COUNT, MAX_INPUTS, MAX_OUTPUTS);

let pipeline = d3LdvmPipeline()
    .width(WIDTH)
    .height(HEIGHT)
    .componentSize(COMPONENT_SIZE)
    .componentTypes(COMPONENT_TYPES)
    .configureForce(force => force.gravity(0.2));

d3.select("body")
    .datum(data)
    .call(pipeline);