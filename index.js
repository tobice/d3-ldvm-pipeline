// This file is the entry point for the dev server

import d3 from 'd3'
import d3LdvmPipeline from './src/d3LdvmPipeline.js'
import generate from './src/generate.js'

const COMPONENTS_COUNT = 100;
const VISUALIZERS_COUNT = 2;
const MAX_INPUTS = 4;
const MAX_OUTPUTS = 2;

const WIDTH = 1000;
const HEIGHT = 1500;
const COMPONENT_SIZE = 20;
const COMPONENT_TYPES = ['suit', 'licensing', 'resolved'];

const data = generate(COMPONENTS_COUNT, VISUALIZERS_COUNT, MAX_INPUTS, MAX_OUTPUTS);

let pipeline = d3LdvmPipeline()
    .width(WIDTH)
    .height(HEIGHT)
    .nodeSize(COMPONENT_SIZE)
    .componentTypes(COMPONENT_TYPES);

d3.select("body")
    .datum(data)
    .call(pipeline);