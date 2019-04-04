import timeago from 'timeago.js';

const lastUpdateElement = document.getElementById('last-update');

export default () => {
  timeago.cancel();
  lastUpdateElement.setAttribute('data-timeago', new Date().toISOString());
  timeago().render(lastUpdateElement);
};
