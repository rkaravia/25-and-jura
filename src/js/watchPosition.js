import setState from './setState';

const PERMISSION_DENIED = 1;
const POSITION_UNAVAILABLE = 2;
const TIMEOUT = 3;

function errorString(code) {
  switch (code) {
    case PERMISSION_DENIED:
      return 'Permission denied';
    case POSITION_UNAVAILABLE:
      return 'Position unavailable';
    case TIMEOUT:
      return 'Timeout';
    default:
      return 'Unknown';
  }
}

function positionError(error, tryAgain) {
  setState('error');
  const errorText = document.getElementById('error-text');
  errorText.innerText = errorString(error.code);
  const tryAgainElement = document.getElementById('try-again');
  tryAgainElement.addEventListener('click', tryAgain, { once: true });
}

export default function watchPosition(onUpdate) {
  setState('loading');
  const positionOptions = {
    enableHighAccuracy: true,
  };
  const watchPositionId = navigator.geolocation.watchPosition((position) => {
    setState('success');
    onUpdate(position.coords);
  }, (error) => {
    navigator.geolocation.clearWatch(watchPositionId);
    positionError(error, () => watchPosition(onUpdate));
  }, positionOptions);
}
