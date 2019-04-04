import './css/index.css';

import cantonsNearby from './js/cantonsNearby';
import { hideCollidingContainers, showCantons } from './js/render';
import showLastUpdate from './js/showLastUpdate';
import watchPosition from './js/watchPosition';

function main() {
  hideCollidingContainers();
  watchPosition((coordinates) => {
    showLastUpdate();
    const { current, nearby } = cantonsNearby(coordinates);
    showCantons({ current, nearby });
  });
}

document.addEventListener('deviceready', main, false);

const script = document.createElement('script');
script.src = 'cordova.js';
document.body.appendChild(script);
