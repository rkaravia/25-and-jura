const d3 = require('d3');

const radius = 150;
const margin = 100;
const middle = radius + margin;
const SWISS_FLAG_SIZE = 200;

const CANTON_FLAG_COUNT = 12;

function drawBackground(svg) {
  svg.append('circle')
    .attr('r', middle)
    .attr('cx', middle)
    .attr('cy', middle)
    .attr('fill', '#eee');
}

function createCantonFlagNodes() {
  const nodes = [];
  for (let i = 0; i < CANTON_FLAG_COUNT; i += 1) {
    const angle = (i / CANTON_FLAG_COUNT) * 2 * Math.PI;
    const x = middle + (radius * Math.cos(angle));
    const y = middle + (radius * Math.sin(angle));
    nodes.push({ angle, x, y });
  }
  return nodes;
}

function drawCantonFlags(svg, nodes) {
  function flagPath() {
    const path = d3.path();
    path.moveTo(-1, -1);
    path.lineTo(1, -1);
    path.arc(1, 0, 1, 1.5 * Math.PI, 0.5 * Math.PI);
    path.lineTo(-1, 1);
    path.closePath();
    return path;
  }
  svg.selectAll('path')
    .data(nodes)
    .enter()
    .append('g')
    .attr('transform', d => `translate(${d.x}, ${d.y})`)
    .append('path')
    .attr('d', flagPath)
    .attr('stroke', '#777')
    .attr('stroke-width', 0.2)
    .attr('fill', 'none')
    .attr('transform', d => `rotate(${d.angle / Math.PI * 180}) scale(${radius / 5})`);
}

function drawSwissFlag(svg) {
  svg.append('circle')
    .attr('r', SWISS_FLAG_SIZE / 2)
    .attr('cx', middle)
    .attr('cy', middle)
    .attr('fill', '#ff0000');
  const foreground = svg.append('g')
    .attr('transform', `translate(${middle}, ${middle})`);
  const scale = SWISS_FLAG_SIZE / 32;
  foreground.append('rect')
    .attr('width', 20)
    .attr('height', 6)
    .attr('x', -10)
    .attr('y', -3)
    .attr('fill', '#fff')
    .attr('transform', `scale(${scale})`);
  foreground.append('rect')
    .attr('width', 6)
    .attr('height', 20)
    .attr('x', -3)
    .attr('y', -10)
    .attr('fill', '#fff')
    .attr('transform', `scale(${scale})`);
}

module.exports = (svg) => {
  drawBackground(svg);
  const cantonFlagNodes = createCantonFlagNodes();
  drawCantonFlags(svg, cantonFlagNodes);
  drawSwissFlag(svg);
};
