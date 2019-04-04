// eslint-disable-next-line import/no-unresolved
const flagSvgs = require('../img/flags/*.svg');

const MAX_DISTANCE = 100000;

let containers = [];

function getCaption(container) {
  return container.querySelector('.caption');
}

function rectanglesCollide(container0, container1) {
  const rectangle0 = container0.getBoundingClientRect();
  const rectangle1 = container1.getBoundingClientRect();
  return rectangle0.x < rectangle1.x + rectangle1.width
              && rectangle0.x + rectangle0.width > rectangle1.x
              && rectangle0.y < rectangle1.y + rectangle1.height
              && rectangle0.height + rectangle0.y > rectangle1.y;
}

function hasCollision(container, otherContainers) {
  const caption = getCaption(container);
  return otherContainers.some((otherContainer) => {
    const otherCaption = getCaption(otherContainer);
    return rectanglesCollide(container, otherContainer)
              || rectanglesCollide(container, otherCaption)
              || rectanglesCollide(caption, otherContainer)
              || rectanglesCollide(caption, otherCaption);
  });
}

export function hideCollidingContainers() {
  window.requestAnimationFrame(() => {
    hideCollidingContainers();
  });
  containers.forEach((container, i) => {
    if (hasCollision(container, containers.slice(0, i))) {
      const { style } = container;
      style.visibility = 'hidden';
    }
  });
}

function toCartesian({ distance, bearing }) {
  if (distance === 0) {
    return { x: 0, y: 0 };
  }
  const angle = bearing / 180 * Math.PI;
  const radius = distance / MAX_DISTANCE;
  const radiusWidthOffset = 0.5 + radius / 2;
  return {
    x: Math.sin(angle) * radiusWidthOffset,
    y: -Math.cos(angle) * radiusWidthOffset,
  };
}

function addContainer(root, canton, className) {
  const { x, y } = toCartesian(canton);
  const container = document.createElement('div');
  container.className = className;
  container.style.left = `${50 + x * 50}%`;
  container.style.top = `${50 + y * 50}%`;
  root.appendChild(container);
  return container;
}

function addImg(parent, { id }) {
  const img = document.createElement('img');
  img.src = flagSvgs[id];
  parent.appendChild(img);
}

function formatDistance(distance) {
  if (Math.round(distance) < 1000) {
    return `${Math.round(distance)} m`;
  }
  const distanceKilometers = (distance / 1000).toPrecision(3);
  const nbsp = '\u00a0';
  return `${distanceKilometers}${nbsp}km`;
}

function addCaption(parent, { distance, name }) {
  const container = document.createElement('div');
  const caption = document.createElement('span');
  caption.className = 'caption';
  caption.innerText = name;
  if (distance) {
    caption.innerText += ` (${formatDistance(distance)})`;
  }
  container.appendChild(caption);
  parent.appendChild(container);
}

function addFlag(root, canton, className) {
  const container = addContainer(root, canton, className);
  addImg(container, canton);
  addCaption(container, canton);
  containers.push(container);
}

export function showCantons({ current, nearby }) {
  const root = document.getElementById('flag-root');
  root.innerHTML = '';
  if (current) {
    addFlag(root, current, 'flag flag-main');
  }

  containers = [];
  nearby.filter(canton => canton.distance < MAX_DISTANCE).forEach((canton) => {
    addFlag(root, canton, 'flag');
  });
}
