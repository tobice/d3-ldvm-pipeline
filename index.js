import d3 from 'd3'
import d3LdvmPipeline from './src/d3LdvmPipeline.js'
import generate from './src/generate.js'

const COMPONENTS_COUNT = 10;
const VISUALIZERS_COUNT = 1;
const WIDTH = 1800;
const HEIGHT = 700;

const data = generate(COMPONENTS_COUNT, VISUALIZERS_COUNT);

let pipeline = d3LdvmPipeline()
    .width(WIDTH)
    .height(HEIGHT);

d3.select("body")
    .datum(data)
    .call(pipeline);