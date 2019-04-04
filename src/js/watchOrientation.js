export default function watchOrientation() {
  window.addEventListener('deviceorientation', (event) => {
    let alpha;
    if (event.webkitCompassHeading !== undefined) {
      alpha = event.webkitCompassHeading;
    } else {
      ({ alpha } = event);
    }
    console.log('orientation alpha', alpha);
  });
}
