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

export default (error, watchPosition) => {
  setState('error');
  const errorText = document.getElementById('error-text');
  errorText.innerText = errorString(error.code);
  const tryAgain = document.getElementById('try-again');
  tryAgain.addEventListener('click', watchPosition, { once: true });
};
