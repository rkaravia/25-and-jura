const D3Node = require('d3-node');
const logo = require('./logo');

const d3Node = new D3Node();
const svg = d3Node.createSVG(500, 500);
logo(svg);
process.stdout.write(d3Node.svgString());
