const FileSaver = require('file-saver');
const d3 = require('d3');
const logo = require('./logo');

function createSvg(width, height) {
  return d3.select('#canvas').append('svg')
    .attr('width', width)
    .attr('height', height);
}

const svg = createSvg(500, 500);
logo(svg);

function save(width, height) {
  const image = new Image();
  image.width = width;
  image.height = height;
  image.onload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0, width, height);
    canvas.toBlob((blob) => {
      FileSaver.saveAs(blob, '25-and-jura.png');
    });
  };
  const svgString = new XMLSerializer().serializeToString(svg.node());
  image.src = `data:image/svg+xml,${encodeURIComponent(svgString)}`;
}

save(1024, 1024);
