const express = require('express');
const path = require('path');
const { spawn } = require('child_process');
const ffmpegPath = require('ffmpeg-static');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function cleanFileName(value) {
  return value
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 90) || 'download';
}

function parseUrl(request) {
  const url = request.body?.url || request.query.url;
  if (!url || !/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(url)) {
    const error = new Error('Please enter a valid YouTube video URL.');
    error.statusCode = 400;
    throw error;
  }
  return url;
}

function pythonCommand() {
  return process.env.PYTHON_BIN || (process.platform === 'win32' ? 'python' : 'python3');
}

function getVideoInfo(url) {
  return new Promise((resolve, reject) => {
    const worker = spawn(pythonCommand(), [path.join(__dirname, 'downloader.py'), 'info', url]);
    let output = '';
    let errorOutput = '';
    worker.stdout.on('data', (chunk) => { output += chunk; });
    worker.stderr.on('data', (chunk) => { errorOutput += chunk; });
    worker.on('error', reject);
    worker.on('close', (code) => {
      if (code !== 0) return reject(new Error(errorOutput.trim() || 'Python downloader failed.'));
      try {
        resolve(JSON.parse(output));
      } catch {
        reject(new Error('The Python downloader returned invalid metadata.'));
      }
    });
  });
}

app.post('/api/video-info', async (request, response, next) => {
  try {
    const url = parseUrl(request);
    const details = await getVideoInfo(url);

    response.json({
      id: details.id,
      title: details.title,
      author: details.author,
      duration: details.duration,
      thumbnail: details.thumbnail,
      url,
      isLive: details.isLive
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/download', async (request, response, next) => {
  let stream;
  try {
    const url = parseUrl(request);
    const type = request.query.type === 'mp3' ? 'mp3' : 'mp4';
    const info = await getVideoInfo(url);
    const title = cleanFileName(info.title);
    const extension = type === 'mp3' ? 'mp3' : 'mp4';
    const fileName = `${title}.${extension}`;

    if (info.isLive) {
      const error = new Error('Live streams are not supported by this downloader.');
      error.statusCode = 400;
      throw error;
    }

    response.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    response.setHeader('Cache-Control', 'no-store');

    response.type(type === 'mp3' ? 'audio/mpeg' : 'video/mp4');
    stream = spawn(pythonCommand(), [
      path.join(__dirname, 'downloader.py'),
      'download',
      url,
      '--type', type,
      '--ffmpeg-path', ffmpegPath
    ]);
    stream.stdout.pipe(response);
    stream.stderr.on('data', (chunk) => console.error(`yt-dlp: ${chunk}`));
    stream.on('error', next);
    stream.on('close', (code) => {
      if (code !== 0 && !response.writableEnded) {
        response.destroy(new Error('The Python downloader could not create the file.'));
      }
    });
  } catch (error) {
    next(error);
  }
});

app.use((error, request, response, next) => {
  if (response.headersSent) return next(error);
  const status = error.statusCode || 500;
  console.error(error);
  response.status(status).json({
    error: error.message || 'Unable to process that video right now.'
  });
});

app.listen(PORT, () => {
  console.log(`TruDrop is running at http://localhost:${PORT}`);
});
