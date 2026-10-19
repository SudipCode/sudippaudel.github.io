const loader = document.querySelector('.loader-container');

const hideLoader = () => {
  if (!loader) {
    document.documentElement.classList.remove('site-loading');
    return;
  }

  loader.classList.add('is-hidden');
  window.setTimeout(() => {
    loader.remove();
    document.documentElement.classList.remove('site-loading');
  }, 400);
};

if (document.readyState === 'complete') {
  hideLoader();
} else {
  window.addEventListener('load', hideLoader, { once: true });
}
