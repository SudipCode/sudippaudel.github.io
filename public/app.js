const form = document.querySelector('#download-form');
const urlInput = document.querySelector('#video-url');
const clearButton = document.querySelector('#clear-url');
const errorBox = document.querySelector('#error-box');
const resultSection = document.querySelector('#result-section');
const thumbnail = document.querySelector('#video-thumbnail');
const title = document.querySelector('#video-title');
const author = document.querySelector('#video-author');
const duration = document.querySelector('#video-duration');
const downloadButton = document.querySelector('#download-button');
const formatOptions = document.querySelectorAll('.format-option');

let currentFormat = 'mp4';
let currentUrl = '';

function formatDuration(seconds) {
  const total = Number(seconds) || 0;
  const minutes = Math.floor(total / 60);
  const remainingSeconds = total % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function setError(message) {
  errorBox.textContent = message;
  errorBox.hidden = !message;
}

function setLoading(isLoading) {
  const submit = form.querySelector('button[type="submit"]');
  submit.disabled = isLoading;
  submit.querySelector('span').textContent = isLoading ? 'Reading video...' : 'Inspect video';
}

function updateDownloadLink() {
  const params = new URLSearchParams({ url: currentUrl, type: currentFormat });
  downloadButton.href = `/api/download?${params.toString()}`;
  downloadButton.querySelector('span').textContent = `Download ${currentFormat.toUpperCase()}`;
}

urlInput.addEventListener('input', () => {
  clearButton.hidden = !urlInput.value;
});

clearButton.addEventListener('click', () => {
  urlInput.value = '';
  clearButton.hidden = true;
  urlInput.focus();
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  setError('');
  resultSection.hidden = true;
  setLoading(true);

  try {
    const response = await fetch('/api/video-info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: urlInput.value.trim() })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Unable to inspect this video.');

    currentUrl = data.url;
    thumbnail.src = data.thumbnail || '';
    thumbnail.alt = `Thumbnail for ${data.title}`;
    title.textContent = data.title;
    author.textContent = data.author;
    duration.textContent = formatDuration(data.duration);
    resultSection.hidden = false;
    updateDownloadLink();
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
});

formatOptions.forEach((option) => {
  option.addEventListener('click', () => {
    currentFormat = option.dataset.format;
    formatOptions.forEach((item) => item.classList.toggle('active', item === option));
    updateDownloadLink();
  });
});
