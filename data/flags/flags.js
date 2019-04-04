const fs = require('fs');
const https = require('https');
const path = require('path');

const URL_TEMPLATE_CONTENT = 'https://de.wikipedia.org/w/api.php?action=query&titles={title}&prop=revisions&rvprop=content&format=json&formatversion=2';
const URL_TEMPLATE_IMAGE = 'https://de.wikipedia.org/w/api.php?action=query&titles={title}&prop=imageinfo&iiprop=url&format=json&formatversion=2';

const CANTONS = ['ZH', 'BE', 'LU', 'UR', 'SZ', 'OW', 'NW', 'GL', 'ZG', 'FR', 'SO', 'BS', 'BL', 'SH', 'AR', 'AI', 'SG', 'GR', 'AG', 'TG', 'TI', 'VD', 'VS', 'NE', 'GE', 'JU'];

async function query(url) {
  return new Promise((resolve) => {
    console.error('Request:', url);
    https.get(url, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        resolve(data);
      });
    }).on('error', (error) => {
      throw error;
    });
  });
}

async function queryContent(title) {
  const url = URL_TEMPLATE_CONTENT.replace(/{title}/g, title);
  const result = JSON.parse(await query(url));
  return result.query.pages[0].revisions[0].content
}

async function queryImage(title) {
  const url = URL_TEMPLATE_IMAGE.replace(/{title}/g, encodeURI(title));
  const result = JSON.parse(await query(url));
  return result.query.pages[0].imageinfo[0].url;
}

async function downloadFlag(canton) {
  const title = `Vorlage:CH-${canton}`;
  const content = await queryContent(title);
  const svgFile = content.match(/(Datei|Bild):.*svg/)[0];
  const url = await queryImage(svgFile);
  const svg = await query(url);
  const outputPath = path.resolve(__dirname, `../../src/img/flags/${canton}.svg`)
  fs.writeFileSync(outputPath, svg);
}

async function downloadFlags() {
  for (canton of CANTONS) {
    await downloadFlag(canton);
  };
}

downloadFlags();
